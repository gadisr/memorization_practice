/**
 * UI components and rendering for the onboarding system
 */

import { OnboardingScreen, OnboardingProgress } from './onboarding-types.js';
import { MEDIA_ASSETS, CALLOUT_CARDS, QUIZ_BANK } from './onboarding-data.js';

function extractQuizId(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'quizId' in data) {
    const value = (data as { quizId?: unknown }).quizId;
    return typeof value === 'string' ? value : undefined;
  }
  return undefined;
}

/**
 * Render an onboarding screen
 */
export function renderOnboardingScreen(screen: OnboardingScreen, progress: OnboardingProgress): void {
  const container = document.getElementById('onboarding-container');
  if (!container) {
    console.error('Onboarding container not found');
    return;
  }

  // Create the screen HTML
  const screenHtml = `
    <div class="onboarding-screen" data-screen-id="${screen.id}">
      <div class="onboarding-header">
        <div class="progress-indicator">
          <span class="progress-text">Step ${progress.currentStep} of ${progress.totalSteps}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(progress.currentStep / progress.totalSteps) * 100}%"></div>
          </div>
        </div>
        <button id="skip-onboarding" class="btn btn-text skip-btn">Skip Tutorial</button>
      </div>
      
      <div class="onboarding-content">
        <h1 class="screen-title">${screen.title}</h1>
        <div class="screen-content">${screen.content}</div>
        
        <div class="interactive-elements">
          ${renderInteractiveElements(screen.interactiveElements || [])}
        </div>
      </div>
      
      <div class="onboarding-navigation">
        <button id="prev-screen" class="btn btn-secondary" ${progress.currentStep === 1 ? 'disabled' : ''}>
          ← Previous
        </button>
        <div class="navigation-dots">
          ${generateNavigationDots(progress)}
        </div>
        <button id="next-screen" class="btn btn-primary">
          ${progress.currentStep === progress.totalSteps ? 'Complete' : 'Next →'}
        </button>
      </div>
    </div>
  `;

  container.innerHTML = screenHtml;
  attachScreenEventListeners(screen);
}

/**
 * Render interactive elements
 */
function renderInteractiveElements(elements: any[]): string {
  return elements.map(element => {
    switch (element.type) {
      case 'button':
        return `
          <button 
            id="${element.id}" 
            class="btn ${element.action === 'next' ? 'btn-primary' : 'btn-secondary'}"
            data-action="${element.action}"
            ${element.data ? `data-extra='${JSON.stringify(element.data)}'` : ''}
          >
            ${element.label}
          </button>
        `;
      case 'demo':
        return `
          <div class="interactive-demo" data-type="${element.data?.type || 'default'}">
            <button class="btn btn-demo" id="${element.id}" data-action="demo" data-extra='${JSON.stringify(element.data)}'>
              Try Interactive Demo
            </button>
          </div>
        `;
      case 'quiz': {
        const quizId = extractQuizId(element.data);
        const quiz = quizId ? QUIZ_BANK[quizId] : undefined;
        if (!quiz) {
          return `
            <div class="quiz-card quiz-missing" id="${element.id}">
              <p>Quiz data not found.</p>
            </div>
          `;
        }

        return `
          <div class="quiz-card" id="${element.id}" data-quiz-id="${quiz.id}">
            <p class="quiz-question">${quiz.question}</p>
            ${quiz.prompt ? `<p class="quiz-prompt">${quiz.prompt}</p>` : ''}
            <div class="quiz-options">
              ${quiz.options.map(option => `
                <button 
                  type="button" 
                  class="quiz-option" 
                  data-option-id="${option.id}"
                >
                  ${option.label}
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback" aria-live="polite"></div>
          </div>
        `;
      }
      default:
        return '';
    }
  }).join('');
}

/**
 * Generate navigation dots
 */
function generateNavigationDots(progress: OnboardingProgress): string {
  return Array.from({ length: progress.totalSteps }, (_, index) => {
    const stepNumber = index + 1;
    const isActive = stepNumber === progress.currentStep;
    
    return `
      <div 
        class="nav-dot ${isActive ? 'active' : ''}"
        data-step="${stepNumber}"
      ></div>
    `;
  }).join('');
}

/**
 * Attach event listeners for the current screen
 */
function attachScreenEventListeners(screen: OnboardingScreen): void {
  // Navigation buttons
  const nextBtn = document.getElementById('next-screen');
  const prevBtn = document.getElementById('prev-screen');
  const skipBtn = document.getElementById('skip-onboarding');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('onboardingNext'));
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('onboardingPrevious'));
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('onboardingSkip'));
    });
  }

  if (nextBtn && screen.interactiveElements?.some(element => element.type === 'quiz')) {
    nextBtn.setAttribute('disabled', 'true');
    nextBtn.classList.add('btn-disabled');
  }

  // Interactive elements
  screen.interactiveElements?.forEach(element => {
    const elementEl = document.getElementById(element.id);
    if (!elementEl) {
      return;
    }

    if (element.type === 'quiz') {
      setupQuiz(elementEl, extractQuizId(element.data));
      return;
    }

    if (element.type === 'demo' || element.type === 'button') {
      elementEl.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('onboardingAction', {
          detail: {
            elementId: element.id,
            action: element.action,
            data: element.data
          }
        }));
      });
    }
  });

  // Demo elements
  const demoElements = document.querySelectorAll('[data-action="demo"]');
  demoElements.forEach(demo => {
    demo.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const data = target.dataset.extra ? JSON.parse(target.dataset.extra) : null;
      window.dispatchEvent(new CustomEvent('onboardingDemo', {
        detail: {
          elementId: target.id,
          data: data
        }
      }));
    });
  });

  hydrateMediaFrames();
  hydrateCalloutStacks();
  bindMediaToggleButtons();
}

/**
 * Show onboarding progress indicator
 */
export function showOnboardingProgress(progress: OnboardingProgress): void {
  const progressEl = document.getElementById('onboarding-progress');
  if (progressEl) {
    progressEl.innerHTML = `
      <div class="progress-summary">
        <span>${progress.currentStep} / ${progress.totalSteps}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(progress.currentStep / progress.totalSteps) * 100}%"></div>
        </div>
      </div>
    `;
  }
}

/**
 * Show the onboarding screen
 */
export function showOnboardingScreen(): void {
  const onboardingEl = document.getElementById('onboarding-screen');
  const setupEl = document.getElementById('setup-screen');
  
  if (onboardingEl) {
    onboardingEl.classList.remove('hidden');
  }
  
  if (setupEl) {
    setupEl.classList.add('hidden');
  }
}

/**
 * Hide the onboarding screen
 */
export function hideOnboardingScreen(): void {
  const onboardingEl = document.getElementById('onboarding-screen');
  const setupEl = document.getElementById('setup-screen');
  
  if (onboardingEl) {
    onboardingEl.classList.add('hidden');
  }
  
  if (setupEl) {
    setupEl.classList.remove('hidden');
  }
}

/**
 * Render a drill preview demo
 */
export function renderDrillPreview(drillType: string, samplePairs: string[]): void {
  const demoContainer = document.getElementById('drill-preview-demo');
  if (!demoContainer) return;

  const demoHtml = `
    <div class="drill-preview">
      <h3>${drillType.replace(/_/g, ' ')} Preview</h3>
      <div class="demo-pairs">
        ${samplePairs.map(pair => `
          <div class="demo-pair">
            <span class="pair-display">${pair}</span>
            <span class="pair-timer">0.0s</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary" onclick="this.parentElement.style.display='none'">
        Got it! Continue
      </button>
    </div>
  `;

  demoContainer.innerHTML = demoHtml;
}

/**
 * Render a notation demo
 */
export function renderNotationDemo(pieceType: 'edge' | 'corner', colors: string[]): void {
  const demoContainer = document.getElementById('notation-demo');
  if (!demoContainer) return;

  const demoHtml = `
    <div class="notation-demo">
      <h3>Try It: ${pieceType === 'edge' ? 'Edge' : 'Corner'} Recognition</h3>
      <div class="demo-piece">
        <div class="color-squares ${pieceType}">
          ${colors.map(color => `
            <div class="square" style="background-color: ${color}"></div>
          `).join('')}
        </div>
        <p>What letter is this piece?</p>
        <input type="text" class="notation-input" maxlength="1" placeholder="?" />
        <div class="demo-feedback hidden">
          <span class="feedback-text"></span>
        </div>
      </div>
      <button class="btn btn-primary" onclick="this.parentElement.style.display='none'">
        Continue
      </button>
    </div>
  `;

  demoContainer.innerHTML = demoHtml;
}

/**
 * Render a recall demo
 */
export function renderRecallDemo(sequence: string[], userInput: string): void {
  const demoContainer = document.getElementById('recall-demo');
  if (!demoContainer) return;

  const demoHtml = `
    <div class="recall-demo">
      <h3>Recall Feedback Demo</h3>
      <div class="demo-sequence">
        <h4>You memorized:</h4>
        <p class="user-input">${userInput}</p>
        <h4>Correct sequence:</h4>
        <p class="correct-sequence">${sequence.join(' ')}</p>
        <div class="feedback-breakdown">
          <div class="correct">✓ Correct: AB, CD</div>
          <div class="incorrect">✗ Wrong: EF → EF</div>
          <div class="missed">○ Missed: GH</div>
        </div>
      </div>
      <button class="btn btn-primary" onclick="this.parentElement.style.display='none'">
        Continue
      </button>
    </div>
  `;

  demoContainer.innerHTML = demoHtml;
}

/**
 * Show a modal with additional information
 */
export function showInfoModal(title: string, content: string): void {
  const modal = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (modal && modalTitle && modalBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
  }
}

/**
 * Hide the info modal
 */
export function hideInfoModal(): void {
  const modal = document.getElementById('info-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function hydrateMediaFrames(): void {
  const frames = Array.from(document.querySelectorAll<HTMLElement>('.media-frame[data-media]'));
  frames.forEach(frame => {
    const assetId = frame.dataset.media;
    if (!assetId) {
      frame.innerHTML = '';
      return;
    }

    const asset = MEDIA_ASSETS[assetId];
    if (!asset) {
      frame.innerHTML = `<div class="media-placeholder">Media asset "${assetId}" missing.</div>`;
      return;
    }

    if (asset.type === 'image') {
      frame.innerHTML = `
        <figure>
          <img src="${asset.src}" alt="${asset.alt}" />
          ${asset.caption ? `<figcaption>${asset.caption}</figcaption>` : ''}
        </figure>
      `;
    } else if (asset.type === 'animation' || asset.type === 'video') {
      frame.innerHTML = `
        <figure>
          <video src="${asset.src}" ${asset.type === 'animation' ? 'loop autoplay muted playsinline' : 'controls'}></video>
          ${asset.caption ? `<figcaption>${asset.caption}</figcaption>` : ''}
        </figure>
      `;
    }
  });
}

function hydrateCalloutStacks(): void {
  const stacks = Array.from(document.querySelectorAll<HTMLElement>('.callout-stack[data-callout]'));
  stacks.forEach(stack => {
    const calloutId = stack.dataset.callout;
    if (!calloutId) {
      stack.innerHTML = '';
      return;
    }

    const callout = CALLOUT_CARDS[calloutId];
    if (!callout) {
      stack.innerHTML = `<div class="callout-card callout-missing">Callout "${calloutId}" not found.</div>`;
      return;
    }

    stack.innerHTML = `
      <div class="callout-card callout-${callout.tone}">
        ${callout.icon ? `<span class="callout-icon">${callout.icon}</span>` : ''}
        <div class="callout-content">
          <h3>${callout.title}</h3>
          <p>${callout.body}</p>
        </div>
      </div>
    `;
  });
}

function bindMediaToggleButtons(): void {
  const toggleGroups = Array.from(document.querySelectorAll<HTMLElement>('.media-toggle'));
  toggleGroups.forEach(group => {
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('.media-toggle-btn'));
    if (!buttons.length) return;

    const contentContainer = group.nextElementSibling as HTMLElement | null;
    if (!contentContainer || !contentContainer.classList.contains('media-frame')) return;

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const targetAssetId = button.dataset.media;
        if (targetAssetId) {
          contentContainer.dataset.media = targetAssetId;
          hydrateMediaFrames();
        }
      });
    });

    // Set first button active by default if none selected
    if (!buttons.some(btn => btn.classList.contains('active'))) {
      buttons[0].classList.add('active');
    }
  });
}

function setupQuiz(element: HTMLElement, quizId?: string): void {
  if (!quizId) {
    return;
  }

  const quiz = QUIZ_BANK[quizId];
  if (!quiz) {
    element.classList.add('quiz-missing');
    element.insertAdjacentHTML('beforeend', `<p class="quiz-error">Quiz "${quizId}" not configured.</p>`);
    return;
  }

  const optionButtons = Array.from(element.querySelectorAll<HTMLButtonElement>('.quiz-option'));
  const feedbackEl = element.querySelector<HTMLElement>('.quiz-feedback');

  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const optionId = button.dataset.optionId;
      const option = quiz.options.find(opt => opt.id === optionId);
      if (!option || !feedbackEl) {
        return;
      }

      optionButtons.forEach(btn => btn.disabled = true);

      if (option.isCorrect) {
        element.classList.remove('quiz-incorrect');
        element.classList.add('quiz-correct');
        feedbackEl.textContent = quiz.successMessage;
        feedbackEl.dataset.state = 'success';
        element.dataset.completed = 'true';
        maybeUnlockNextButton();
        window.dispatchEvent(new CustomEvent('onboardingQuizResult', {
          detail: { quizId, correct: true }
        }));
      } else {
        element.classList.remove('quiz-correct');
        element.classList.add('quiz-incorrect');
        feedbackEl.textContent = `${quiz.failureMessage} ${option.explanation}`;
        feedbackEl.dataset.state = 'error';
        optionButtons.forEach(btn => {
          if (btn !== button) btn.disabled = false;
        });
        button.disabled = true;
        window.dispatchEvent(new CustomEvent('onboardingQuizResult', {
          detail: { quizId, correct: false }
        }));
      }
    });
  });
}

function maybeUnlockNextButton(): void {
  const nextBtn = document.getElementById('next-screen') as HTMLButtonElement | null;
  if (!nextBtn) {
    return;
  }

  const pendingQuizzes = Array.from(document.querySelectorAll<HTMLElement>('.quiz-card')).filter(card => card.dataset.completed !== 'true');
  if (pendingQuizzes.length === 0) {
    nextBtn.removeAttribute('disabled');
    nextBtn.classList.remove('btn-disabled');
  }
}
