/**
 * Onboarding app entry point
 */

import { OnboardingManager } from './onboarding-manager.js';
import { showInfoModal, hideInfoModal } from './onboarding-ui.js';
import { DrillType } from '../types.js';
import { initializeAnalytics, trackPageView } from '../services/analytics.js';
import { measurementId } from '../config/firebase-config.js';

// Initialize Google Analytics
if (measurementId) {
  initializeAnalytics(measurementId);
  trackPageView(window.location.pathname, document.title);
}

// Initialize onboarding manager
const onboardingManager = new OnboardingManager();

// Check if we should show onboarding
if (OnboardingManager.shouldShowOnboarding()) {
  onboardingManager.startOnboarding();
} else {
  // Redirect to main app if onboarding not needed
  window.location.href = 'index.html';
}

// Event listeners for onboarding navigation
window.addEventListener('onboardingNext', () => {
  onboardingManager.nextScreen();
});

window.addEventListener('onboardingPrevious', () => {
  onboardingManager.previousScreen();
});

window.addEventListener('onboardingSkip', () => {
  onboardingManager.skipOnboarding();
});

window.addEventListener('onboardingAction', (event: Event) => {
  const customEvent = event as CustomEvent;
  const { elementId, action, data } = customEvent.detail;
  onboardingManager.handleInteractiveAction(elementId, action, data);
});

window.addEventListener('onboardingDemo', (event: Event) => {
  const customEvent = event as CustomEvent;
  const { elementId, data } = customEvent.detail;
  handleDemo(elementId, data);
});

// Handle demo interactions
function handleDemo(elementId: string, data: any): void {
  switch (elementId) {
    case 'drill-preview-demo':
      showDrillPreview(data);
      break;
    case 'notation-demo':
      showNotationDemo(data);
      break;
    case 'recall-demo':
      showRecallDemo(data);
      break;
    case 'tracing-stepper':
      showTracingStepper(data);
      break;
    case 'chunking-workshop':
      showChunkingWorkshop(data);
      break;
    case 'image-journal':
      showImageJournal(data);
      break;
    case 'edge-sequence-demo':
      showEdgeExecutionDemo(data);
      break;
    case 'checklist-toggles':
      showChecklistDemo(data);
      break;
    case 'launch-drill':
      redirectToMainApp({
        drillType: DrillType.FLASH_PAIRS,
        pairCount: 10
      });
      break;
    case 'view-dashboard':
      redirectToMainApp({
        view: 'dashboard'
      });
      break;
    default:
      console.log('Demo not implemented:', elementId, data);
  }
}

function showDrillPreview(data: any): void {
  const modalContent = `
    <div class="drill-preview-modal">
      <h3>Drill Preview: ${data.type || 'Flash Pairs'}</h3>
      <div class="preview-pairs">
        ${data.pairs ? data.pairs.map((pair: string) => `
          <div class="preview-pair">
            <span class="pair-display">${pair}</span>
            <p>Imagine an image for this pair...</p>
          </div>
        `).join('') : ''}
      </div>
      <p class="preview-note">In a real drill, you'd see pairs one at a time and practice creating vivid mental images!</p>
    </div>
  `;
  
  showInfoModal('Drill Preview', modalContent);
}

function showNotationDemo(data: any): void {
  const modalContent = `
    <div class="notation-demo-modal">
      <h3>Notation Recognition Demo</h3>
      <div class="demo-piece">
        <div class="color-squares ${data.type || 'edge'}">
          ${data.colors ? data.colors.map((color: string) => `
            <div class="square" style="background-color: ${color}"></div>
          `).join('') : ''}
        </div>
        <p>This is a ${data.type || 'edge'} piece. What letter does it represent?</p>
        <p class="demo-answer"><strong>Answer:</strong> This would be letter "M" in Speffz notation</p>
      </div>
      <p class="demo-note">In notation training, you'll practice recognizing all 24 edge and corner pieces!</p>
    </div>
  `;
  
  showInfoModal('Notation Demo', modalContent);
}

function showRecallDemo(data: any): void {
  const modalContent = `
    <div class="recall-demo-modal">
      <h3>Recall Feedback Demo</h3>
      <div class="demo-sequence">
        <h4>You memorized:</h4>
        <p class="user-input">${data.userInput || 'AB CD EF'}</p>
        <h4>Correct sequence:</h4>
        <p class="correct-sequence">${data.sequence ? data.sequence.join(' ') : 'AB CD EF'}</p>
        <div class="feedback-breakdown">
          <div class="correct">✓ Correct: AB, CD</div>
          <div class="incorrect">✗ Wrong: EF → EF</div>
          <div class="missed">○ Missed: GH</div>
        </div>
      </div>
      <p class="demo-note">This feedback helps you identify which pairs need more practice!</p>
    </div>
  `;
  
  showInfoModal('Recall Demo', modalContent);
}

function showTracingStepper(data: any): void {
  const buffer = data?.buffer ?? 'b*';
  const cycle = Array.isArray(data?.cycle) ? data.cycle : [];
  const steps = [buffer, ...cycle, buffer];

  const modalContent = `
    <div class="tracing-stepper-modal">
      <h3>Cycle Walkthrough</h3>
      <p>Follow the path starting from the buffer <strong>${buffer}</strong>.</p>
      <ol class="stepper-list">
        ${steps.map((letter: string, index: number) => `
          <li>
            <span class="step-index">${index + 1}</span>
            <span class="step-letter">${letter}</span>
            ${index < steps.length - 1 ? '<span class="step-arrow">→</span>' : ''}
          </li>
        `).join('')}
      </ol>
      <p class="stepper-note">Stop the cycle when you return to the buffer or its paired letter.</p>
    </div>
  `;

  showInfoModal('Tracing Cycle', modalContent);
}

function showChunkingWorkshop(data: any): void {
  const sequence = Array.isArray(data?.sequence) ? data.sequence : [];
  const pairs = [];
  for (let i = 0; i < sequence.length; i += 2) {
    const pair = sequence[i + 1] ? `${sequence[i]}${sequence[i + 1]}` : sequence[i];
    pairs.push(pair);
  }

  const modalContent = `
    <div class="chunking-demo-modal">
      <h3>Chunk the Memo</h3>
      <p>Group the letters into pairs to make imagery easier.</p>
      <div class="chunk-grid">
        ${pairs.map((pair: string, index: number) => `
          <div class="chunk-card">
            <span class="chunk-index">${index + 1}</span>
            <span class="chunk-value">${pair}</span>
          </div>
        `).join('')}
      </div>
      <p class="chunking-note">${sequence.length % 2 === 0 ? 'Even memo — no parity fix needed.' : 'Odd memo — plan to run parity after edges.'}</p>
    </div>
  `;

  showInfoModal('Chunking Workshop', modalContent);
}

function showImageJournal(data: any): void {
  const pairs = Array.isArray(data?.pairs) ? data.pairs : [];
  const modalContent = `
    <div class="image-journal-modal">
      <h3>Build Your Letter Pair Images</h3>
      <p>Use the input fields to note the person/object for each pair.</p>
      <div class="journal-table">
        ${pairs.map((pair: string) => `
          <div class="journal-row">
            <span class="journal-pair">${pair.toUpperCase()}</span>
            <input type="text" placeholder="Person" class="journal-input" />
            <input type="text" placeholder="Object" class="journal-input" />
          </div>
        `).join('')}
      </div>
      <p class="journal-tip">Revisit this list often to reinforce your imagery system.</p>
    </div>
  `;

  showInfoModal('Imagery Journal', modalContent);
}

function showEdgeExecutionDemo(data: any): void {
  const letter = data?.letter ?? '?';
  const setupMoves = Array.isArray(data?.setup) ? data.setup.join(' ') : '—';
  const algorithmName = data?.algorithm ?? 'T-perm';

  const modalContent = `
    <div class="edge-execution-modal">
      <h3>Executing Edge Letter: ${letter.toUpperCase()}</h3>
      <ol class="execution-list">
        <li><strong>Setup:</strong> ${setupMoves}</li>
        <li><strong>Algorithm:</strong> ${algorithmName}</li>
        <li><strong>Undo:</strong> Reverse the setup moves</li>
      </ol>
      <p class="execution-note">Avoid U or R moves in setups — keep the UR buffer untouched.</p>
    </div>
  `;

  showInfoModal('Edge Execution', modalContent);
}

function showChecklistDemo(data: any): void {
  const checklist = Array.isArray(data?.checklist) ? data.checklist : [];

  const modalContent = `
    <div class="checklist-demo-modal">
      <h3>Pre-Solve Checklist</h3>
      <ul class="demo-checklist">
        ${checklist.map((item: string) => `
          <li>
            <input type="checkbox" checked />
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
      <p class="checklist-note">Run through these steps every time before you start a blindfold solve.</p>
    </div>
  `;

  showInfoModal('Solve Checklist', modalContent);
}

function redirectToMainApp(options: { drillType?: DrillType; pairCount?: number; view?: string }): void {
  if (options.drillType) {
    localStorage.setItem('recommended_drill_type', options.drillType);
  }
  if (typeof options.pairCount === 'number') {
    localStorage.setItem('recommended_pair_count', options.pairCount.toString());
  }
  if (options.view) {
    localStorage.setItem('onboarding_redirect_view', options.view);
  }

  window.location.href = 'index.html';
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalCloseFooterBtn = document.getElementById('modal-close-footer-btn');
  const infoModal = document.getElementById('info-modal');
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideInfoModal);
  }
  
  if (modalCloseFooterBtn) {
    modalCloseFooterBtn.addEventListener('click', hideInfoModal);
  }
  
  // Close modal when clicking outside
  if (infoModal) {
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        hideInfoModal();
      }
    });
  }
});

// Handle onboarding completion
window.addEventListener('onboardingCompleted', () => {
  // Redirect to main app
  window.location.href = 'index.html';
});
