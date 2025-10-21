// UI rendering components for tracing drills

import { DrillType } from '../types.js';
import { SequenceValidator } from '../services/sequence-validator.js';
import { CornerTracingValidator } from '../services/corner-tracing-validator.js';
import { generate_scramble_sequence, scramble_cube_with_tracing } from '../services/cube-scrambler.js';
import { AnimCubeJSViewer } from './animcubejs-viewer.js';

export class TracingRenderer {
  private sequenceValidator: SequenceValidator;
  private cornerTracingValidator: CornerTracingValidator;
  private currentScramble: string = '';
  private startTime: number = 0;
  private isActive: boolean = false;
  private animCubeJSViewer: AnimCubeJSViewer | null = null;

  constructor() {
    this.sequenceValidator = new SequenceValidator();
    this.cornerTracingValidator = new CornerTracingValidator();
  }

  /**
   * Render the tracing drill screen
   */
  public renderTracingScreen(drillType: DrillType): void {
    const container = document.getElementById('app') as HTMLElement;
    if (!container) return;

    // Generate a new scramble (shorter for easier tracing)
    this.currentScramble = generate_scramble_sequence(6); // 6 moves
    this.startTime = Date.now();
    this.isActive = true;

    const isCornerDrill = drillType === DrillType.CORNER_TRACING_DRILL;
    const drillName = isCornerDrill ? 'Corner Tracing' : 'Edge Tracing';
    const instructionText = isCornerDrill 
      ? 'Trace the corner cycles from the scramble below. Enter the letter sequence that represents the corner movements.'
      : 'Trace the edge cycles from the scramble below. Enter the letter sequence that represents the edge movements.';

    container.innerHTML = `
      <div class="tracing-drill-container">
        <div class="tracing-header">
          <h2>${drillName} Drill</h2>
          <div class="timer" id="tracing-timer">00:00</div>
        </div>
        
        <div class="tracing-content">
          <div class="scramble-display">
            <h3>Scramble:</h3>
            <div class="scramble-string" id="scramble-string">${this.currentScramble}</div>
          </div>
          
          <div class="cube-3d-container" style="
            display: flex;
            justify-content: center;
            margin: 20px 0;
          ">
            <div id="cube-3d-viewer" style="
              width: 300px;
              height: 300px;
              border: 2px solid #ccc;
              border-radius: 8px;
              background: #f5f5f5;
            "></div>
          </div>
          
          <div class="instruction">
            <p>${instructionText}</p>
            <p><strong>Instructions:</strong></p>
            <ul>
              <li>Look at the scramble above</li>
              <li>Trace the ${isCornerDrill ? 'corner' : 'edge'} cycles in your mind</li>
              <li>Enter the letter sequence below (e.g., "a b c d e f")</li>
              <li>Press Enter or click Submit when done</li>
            </ul>
          </div>
          
          <div class="tracing-input">
            <label for="tracing-sequence">Your ${isCornerDrill ? 'Corner' : 'Edge'} Sequence:</label>
            <textarea 
              id="tracing-sequence" 
              placeholder="Enter letter sequence (e.g., a b c d e f)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="tracing-actions">
            <button id="submit-tracing" class="btn btn-primary">Submit</button>
            <button id="new-scramble" class="btn btn-secondary">New Scramble</button>
            <button id="back-to-menu" class="btn btn-secondary">Back to Menu</button>
          </div>
        </div>
        
        <div class="tracing-results" id="tracing-results" style="display: none;">
          <!-- Results will be populated here -->
        </div>
      </div>
    `;

    this.attachTracingEventListeners(drillType);
    this.startTracingTimer();
    this.initializeAnimCubeJSViewer();
  }

  /**
   * Initialize AnimCubeJS viewer
   */
  private async initializeAnimCubeJSViewer(): Promise<void> {
    try {
      // Create AnimCubeJS viewer
      this.animCubeJSViewer = new AnimCubeJSViewer({
        containerId: 'cube-3d-viewer',
        width: 300,
        height: 300,
        backgroundColor: '#f5f5f5',
        enableControls: true,
        enableAnimations: true,
        size: 200,
        bgColor: '#f5f5f5',
        scheme: 'WOBGRY',
        edit: false,
        buttons: true,
        sliders: true,
        colors: 'WOBGRY',
        speed: 1
      });

      // Initialize the viewer
      await this.animCubeJSViewer.initialize();

      // Wait longer for AnimCubeJS to be fully ready and rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply the scramble using initmove parameter
      console.log('Applying initial scramble to visual cube:', this.currentScramble);
      await this.animCubeJSViewer.applyScrambleAsInitMove(this.currentScramble);

      // Wait a bit more to ensure the scramble is visually applied
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error('Failed to initialize AnimCubeJS viewer:', error);
    }
  }

  /**
   * Attach event listeners for tracing drill
   */
  private attachTracingEventListeners(drillType: DrillType): void {
    const submitButton = document.getElementById('submit-tracing');
    const newScrambleButton = document.getElementById('new-scramble');
    const backButton = document.getElementById('back-to-menu');
    const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;

    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this.handleTracingSubmission(drillType);
      });
    }

    if (newScrambleButton) {
      newScrambleButton.addEventListener('click', async () => {
        await this.generateNewScramble();
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        this.goBackToMenu();
      });
    }

    if (sequenceInput) {
      sequenceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          this.handleTracingSubmission(drillType);
        }
      });
    }
  }

  /**
   * Handle tracing submission and validation
   */
  private async handleTracingSubmission(drillType: DrillType): Promise<void> {
    const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;
    const resultsDiv = document.getElementById('tracing-results');
    
    if (!sequenceInput || !resultsDiv) return;

    const userSequence = sequenceInput.value.trim();
    if (!userSequence) {
      this.showNotification('Please enter a sequence before submitting.', 'error');
      return;
    }

    this.isActive = false;
    const endTime = Date.now();
    const totalTime = Math.round((endTime - this.startTime) / 1000);

    try {
      let validationResult;
      
      if (drillType === DrillType.CORNER_TRACING_DRILL) {
        validationResult = this.cornerTracingValidator.scrambleAndValidateCorners(
          this.currentScramble, 
          userSequence
        );
      } else {
        validationResult = this.sequenceValidator.scrambleAndValidate(
          this.currentScramble, 
          userSequence
        );
      }

      this.displayTracingResults(validationResult, totalTime, drillType);
      
    } catch (error) {
      this.showNotification(`Validation error: ${error}`, 'error');
    }
  }

  /**
   * Display tracing results
   */
  private displayTracingResults(result: any, totalTime: number, drillType: DrillType): void {
    const resultsDiv = document.getElementById('tracing-results');
    if (!resultsDiv) return;

    const isCornerDrill = drillType === DrillType.CORNER_TRACING_DRILL;
    const pieceType = isCornerDrill ? 'corner' : 'edge';
    const pieceTypePlural = isCornerDrill ? 'corners' : 'edges';

    const successClass = result.isValid ? 'success' : 'error';
    const statusText = result.isValid ? 'Correct!' : 'Incorrect';
    const scoreText = `Score: ${result.score}%`;

    resultsDiv.innerHTML = `
      <div class="tracing-results-content">
        <div class="results-header ${successClass}">
          <h3>${statusText}</h3>
          <p>${scoreText} | Time: ${totalTime}s</p>
        </div>
        
        <div class="results-details">
          <div class="correct-solution-section">
            <h4>✅ Correct Solution:</h4>
            <div class="sequence-display correct-solution">${result.expectedSequence || 'No solution available'}</div>
            <p class="solution-hint">This is what you should have traced:</p>
          </div>
          
          <div class="sequence-comparison">
            <div class="sequence-item">
              <h4>Your Sequence:</h4>
              <div class="sequence-display user-sequence">${result.userSequence || 'None'}</div>
            </div>
          </div>
          
          ${result.errors && result.errors.length > 0 ? `
            <div class="errors-section">
              <h4>Issues Found:</h4>
              <ul class="error-list">
                ${result.errors.map((error: string) => `<li>${error}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${result.edgesInPosition && result.edgesInPosition.length > 0 ? `
            <div class="position-info">
              <h4>${pieceTypePlural.charAt(0).toUpperCase() + pieceTypePlural.slice(1)} in Position:</h4>
              <div class="position-list">${result.edgesInPosition.join(', ')}</div>
            </div>
          ` : ''}
          
          ${result.flippedEdges && result.flippedEdges.length > 0 ? `
            <div class="orientation-info">
              <h4>${isCornerDrill ? 'Twisted' : 'Flipped'} ${pieceTypePlural.charAt(0).toUpperCase() + pieceTypePlural.slice(1)}:</h4>
              <div class="orientation-list">${result.flippedEdges.join(', ')}</div>
            </div>
          ` : ''}
        </div>
        
        <div class="results-actions">
          <button id="try-again" class="btn btn-primary">Try Again</button>
          <button id="new-scramble-results" class="btn btn-secondary">New Scramble</button>
          <button id="back-to-menu-results" class="btn btn-secondary">Back to Menu</button>
        </div>
      </div>
    `;

    resultsDiv.style.display = 'block';

    // Attach event listeners for result actions
    this.attachResultsEventListeners(drillType);
  }

  /**
   * Attach event listeners for results screen
   */
  private attachResultsEventListeners(drillType: DrillType): void {
    const tryAgainButton = document.getElementById('try-again');
    const newScrambleButton = document.getElementById('new-scramble-results');
    const backButton = document.getElementById('back-to-menu-results');

    if (tryAgainButton) {
      tryAgainButton.addEventListener('click', () => {
        this.clearResults();
        this.focusInput();
      });
    }

    if (newScrambleButton) {
      newScrambleButton.addEventListener('click', async () => {
        await this.generateNewScramble();
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        this.goBackToMenu();
      });
    }
  }

  /**
   * Generate a new scramble
   */
  private async generateNewScramble(): Promise<void> {
    this.currentScramble = generate_scramble_sequence(6);
    this.startTime = Date.now();
    this.isActive = true;

    const scrambleElement = document.getElementById('scramble-string');
    const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;
    const resultsDiv = document.getElementById('tracing-results');

    if (scrambleElement) {
      scrambleElement.textContent = this.currentScramble;
    }

    if (sequenceInput) {
      sequenceInput.value = '';
    }

    if (resultsDiv) {
      resultsDiv.style.display = 'none';
    }

    // Apply the new scramble to the visual cube using initmove
    if (this.animCubeJSViewer) {
      try {
        await this.animCubeJSViewer.applyScrambleAsInitMove(this.currentScramble);
        console.log('Applied new scramble to visual cube as initmove:', this.currentScramble);
      } catch (error) {
        console.error('Failed to apply scramble to visual cube:', error);
      }
    }

    this.focusInput();
  }

  /**
   * Clear results and reset for new attempt
   */
  private clearResults(): void {
    const resultsDiv = document.getElementById('tracing-results');
    const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;

    if (resultsDiv) {
      resultsDiv.style.display = 'none';
    }

    if (sequenceInput) {
      sequenceInput.value = '';
    }
  }

  /**
   * Focus the input field
   */
  private focusInput(): void {
    const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;
    if (sequenceInput) {
      sequenceInput.focus();
    }
  }

  /**
   * Start the tracing timer
   */
  private startTracingTimer(): void {
    const timerElement = document.getElementById('tracing-timer');
    if (!timerElement) return;

    const updateTimer = () => {
      if (!this.isActive) return;

      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      setTimeout(updateTimer, 1000);
    };

    updateTimer();
  }

  /**
   * Go back to main menu
   */
  private goBackToMenu(): void {
    // This would typically trigger a navigation back to the main menu
    // For now, we'll just reload the page
    window.location.reload();
  }

  /**
   * Show notification
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Dispose of AnimCubeJS viewer resources
   */
  public dispose(): void {
    if (this.animCubeJSViewer) {
      this.animCubeJSViewer.dispose();
      this.animCubeJSViewer = null;
    }
  }
}
