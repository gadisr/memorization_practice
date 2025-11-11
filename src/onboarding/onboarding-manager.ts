/**
 * Main onboarding controller for BLD Memory Trainer
 */

import { OnboardingScreen, OnboardingProgress, OnboardingState, OnboardingCompletion } from './onboarding-types.js';
import { ONBOARDING_SCREENS } from './onboarding-data.js';
import { DrillType } from '../types.js';
import { renderOnboardingScreen, showOnboardingProgress, hideOnboardingScreen } from './onboarding-ui.js';

export class OnboardingManager {
  private currentScreenIndex: number = 0;
  private totalScreens: number = ONBOARDING_SCREENS.length;
  private progress: OnboardingProgress;
  private isActive: boolean = false;

  constructor() {
    this.progress = {
      currentStep: 1,
      totalSteps: this.totalScreens,
      completedSteps: [],
      currentScreen: ONBOARDING_SCREENS[0].id,
      startTime: Date.now(),
      skippedScreens: []
    };
  }

  /**
   * Start the onboarding flow
   */
  public startOnboarding(): void {
    this.isActive = true;
    this.currentScreenIndex = 0;
    this.progress.startTime = Date.now();
    this.showCurrentScreen();
  }

  /**
   * Show the current screen
   */
  private showCurrentScreen(): void {
    const screen = ONBOARDING_SCREENS[this.currentScreenIndex];
    this.progress.currentScreen = screen.id;
    this.progress.currentStep = this.currentScreenIndex + 1;
    
    renderOnboardingScreen(screen, this.progress);
    showOnboardingProgress(this.progress);
  }

  /**
   * Move to the next screen
   */
  public nextScreen(): void {
    if (this.currentScreenIndex < this.totalScreens - 1) {
      this.completeCurrentScreen();
      this.currentScreenIndex++;
      this.showCurrentScreen();
    } else {
      this.completeOnboarding();
    }
  }

  /**
   * Move to the previous screen
   */
  public previousScreen(): void {
    if (this.currentScreenIndex > 0) {
      this.currentScreenIndex--;
      this.showCurrentScreen();
    }
  }

  /**
   * Skip the current screen
   */
  public skipCurrentScreen(): void {
    const currentScreen = ONBOARDING_SCREENS[this.currentScreenIndex];
    if (!this.progress.skippedScreens.includes(currentScreen.id)) {
      this.progress.skippedScreens.push(currentScreen.id);
    }
    this.nextScreen();
  }

  /**
   * Skip the entire onboarding
   */
  public skipOnboarding(): void {
    this.isActive = false;
    this.saveOnboardingState({
      isCompleted: false,
      skippedScreens: ONBOARDING_SCREENS.map(screen => screen.id),
      userPreferences: {}
    });
    this.redirectToMainApp();
  }

  /**
   * Complete the current screen
   */
  private completeCurrentScreen(): void {
    const currentScreen = ONBOARDING_SCREENS[this.currentScreenIndex];
    if (!this.progress.completedSteps.includes(currentScreen.id)) {
      this.progress.completedSteps.push(currentScreen.id);
    }
  }

  /**
   * Complete the entire onboarding
   */
  public completeOnboarding(): void {
    this.isActive = false;
    this.completeCurrentScreen();
    
    const completion: OnboardingCompletion = this.generateCompletionRecommendations();
    
    this.saveOnboardingState({
      isCompleted: true,
      completionDate: new Date().toISOString(),
      skippedScreens: this.progress.skippedScreens,
      userPreferences: {
        preferredDrillType: completion.recommendedFirstDrill,
        recommendedPairCount: completion.suggestedPairCount
      }
    });

    this.showCompletionScreen(completion);
  }

  /**
   * Generate completion recommendations based on user progress
   */
  private generateCompletionRecommendations(): OnboardingCompletion {
    // Default recommendations for beginners
    return {
      recommendedFirstDrill: DrillType.FLASH_PAIRS,
      suggestedPairCount: 10,
      userPreferences: {
        hasCompletedOnboarding: true,
        preferredDifficulty: 'beginner',
        interests: ['memorization', 'visualization']
      },
      nextSteps: [
        'Start with Flash Pairs drill (10 pairs)',
        'Practice letter recognition training',
        'Build your first memory stories',
        'Track your progress on the dashboard'
      ]
    };
  }

  /**
   * Show the completion screen with recommendations
   */
  private showCompletionScreen(completion: OnboardingCompletion): void {
    // Render completion screen with recommendations
    const completionHtml = `
      <div class="onboarding-completion">
        <div class="completion-header">
          <h1>🎉 Congratulations!</h1>
          <p>You've completed the onboarding tutorial. You're ready to start your blindfold cubing journey!</p>
        </div>
        
        <div class="recommendations">
          <h2>Recommended Next Steps:</h2>
          <div class="recommended-drill">
            <h3>Start with: ${completion.recommendedFirstDrill.replace(/_/g, ' ')}</h3>
            <p>Try ${completion.suggestedPairCount} pairs to get comfortable with the process</p>
          </div>
          
          <div class="next-steps">
            <h3>Your Learning Path:</h3>
            <ul>
              ${completion.nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="completion-actions">
          <button id="start-first-session" class="btn btn-primary btn-large">
            Start Your First Training Session
          </button>
          <button id="view-dashboard" class="btn btn-secondary">
            View Dashboard
          </button>
        </div>
      </div>
    `;

    // Update the onboarding content
    const contentElement = document.getElementById('onboarding-content');
    if (contentElement) {
      contentElement.innerHTML = completionHtml;
    }

    // Attach completion event listeners
    this.attachCompletionListeners(completion);
  }

  /**
   * Attach event listeners for completion screen
   */
  private attachCompletionListeners(completion: OnboardingCompletion): void {
    const startFirstSessionBtn = document.getElementById('start-first-session');
    const viewDashboardBtn = document.getElementById('view-dashboard');

    if (startFirstSessionBtn) {
      startFirstSessionBtn.addEventListener('click', () => {
        this.redirectToFirstSession(completion);
      });
    }

    if (viewDashboardBtn) {
      viewDashboardBtn.addEventListener('click', () => {
        this.redirectToMainApp();
      });
    }
  }

  /**
   * Redirect to first session with recommendations
   */
  private redirectToFirstSession(completion: OnboardingCompletion): void {
    // Set up the first session based on recommendations
    this.setupFirstSession(completion);
    this.redirectToMainApp();
  }

  /**
   * Set up the first session based on recommendations
   */
  private setupFirstSession(completion: OnboardingCompletion): void {
    // Set the drill type and pair count in localStorage for the main app to use
    localStorage.setItem('recommended_drill_type', completion.recommendedFirstDrill);
    localStorage.setItem('recommended_pair_count', completion.suggestedPairCount.toString());
    localStorage.setItem('onboarding_completed', 'true');
  }

  /**
   * Redirect to the main application
   */
  private redirectToMainApp(): void {
    hideOnboardingScreen();
    // The main app will detect onboarding completion and show appropriate screen
    window.dispatchEvent(new CustomEvent('onboardingCompleted'));
  }

  /**
   * Save onboarding state to localStorage
   */
  private saveOnboardingState(state: OnboardingState): void {
    localStorage.setItem('onboarding_state', JSON.stringify(state));
  }

  /**
   * Load onboarding state from localStorage
   */
  public static loadOnboardingState(): OnboardingState | null {
    try {
      const saved = localStorage.getItem('onboarding_state');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      return null;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  public static hasCompletedOnboarding(): boolean {
    const state = OnboardingManager.loadOnboardingState();
    return state?.isCompleted || false;
  }

  /**
   * Check if user should see onboarding
   */
  public static shouldShowOnboarding(): boolean {
    if (typeof window !== 'undefined') {
      const forceFlag = localStorage.getItem('onboarding_force');
      if (forceFlag === 'true') {
        localStorage.removeItem('onboarding_force');
        return true;
      }
    }

    // Don't show if already completed
    if (OnboardingManager.hasCompletedOnboarding()) {
      return false;
    }

    // Don't show if explicitly skipped
    const state = OnboardingManager.loadOnboardingState();
    if (state && !state.isCompleted && state.skippedScreens.length === ONBOARDING_SCREENS.length) {
      return false;
    }

    // Show for new users
    return true;
  }

  /**
   * Get current progress
   */
  public getProgress(): OnboardingProgress {
    return { ...this.progress };
  }

  /**
   * Check if onboarding is currently active
   */
  public isOnboardingActive(): boolean {
    return this.isActive;
  }

  /**
   * Get current screen
   */
  public getCurrentScreen(): OnboardingScreen | null {
    return ONBOARDING_SCREENS[this.currentScreenIndex] || null;
  }

  /**
   * Jump to a specific screen by ID
   */
  public jumpToScreen(screenId: string): void {
    const screenIndex = ONBOARDING_SCREENS.findIndex(screen => screen.id === screenId);
    if (screenIndex !== -1) {
      this.currentScreenIndex = screenIndex;
      this.showCurrentScreen();
    }
  }

  /**
   * Handle interactive element actions
   */
  public handleInteractiveAction(elementId: string, action: string, data?: any): void {
    switch (action) {
      case 'next':
        this.nextScreen();
        break;
      case 'skip':
        this.skipCurrentScreen();
        break;
      case 'modal':
        this.showModal(elementId, data);
        break;
      case 'demo':
        this.showDemo(elementId, data);
        break;
      case 'auth':
        this.handleAuth(elementId, data);
        break;
      case 'complete':
        this.completeOnboarding();
        break;
      default:
        console.warn('Unknown interactive action:', action);
    }
  }

  /**
   * Show a modal with additional information
   */
  private showModal(elementId: string, data?: any): void {
    // Implementation for showing modals (e.g., more info about Speffz notation)
    console.log('Show modal for:', elementId, data);
  }

  /**
   * Show an interactive demo
   */
  private showDemo(elementId: string, data?: any): void {
    // Implementation for showing demos (e.g., drill preview, notation demo)
    console.log('Show demo for:', elementId, data);
  }

  /**
   * Handle authentication flow
   */
  private handleAuth(elementId: string, data?: any): void {
    // Implementation for handling authentication
    console.log('Handle auth for:', elementId, data);
  }
}
