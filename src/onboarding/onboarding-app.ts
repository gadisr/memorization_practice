/**
 * Onboarding app entry point
 */

import { OnboardingManager } from './onboarding-manager.js';
import { showInfoModal, hideInfoModal } from './onboarding-ui.js';

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
