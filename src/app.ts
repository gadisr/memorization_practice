/**
 * Main application controller for BLD Memory Trainer
 */

import { DrillType, SessionData, NotationSessionData, NotationAttempt, EdgePiece, CornerPiece, ColorMemorizationSessionData } from './types.js';
import { getAllDrillConfigs, getDrillConfig, BLD_TECHNIQUE_INTRO } from './config/drill-config.js';
import { createSession, getActiveSession, recordPairTiming, finalizeSession, cancelSession } from './services/session-manager.js';
import { startTimer, stopTimer } from './services/timer.js';
import { getQualityMetric } from './services/quality-adapter.js';
import { getAllSessions } from './storage/storage-adapter.js';
import { getAllNotationSessions } from './storage/storage-adapter.js';
import { getAuthState, waitForAuthInit } from './services/auth-service.js';
import { getUserStats, getPopulationStats } from './services/api-client.js';
import { clearAllSessions } from './storage/session-storage.js';
import { generateCSV, downloadCSV } from './services/csv-exporter.js';
import { initializeAuthUI, refreshAuthUI } from './ui/auth-ui.js';
import { validatePairCount, validateRecallCount, validateQualityRating } from './utils/validators.js';
import { formatDrillName } from './utils/drill-name-formatter.js';
import {
  showScreen,
  renderSetupScreen,
  updateDrillDescription,
  renderSessionScreen,
  renderRatingScreen,
  renderRecallFeedback,
  renderDashboard,
  renderHomeDashboard,
  showNotification,
  showPairCountWarning,
  clearPairCountWarning,
  showTechniqueIntro,
  showDrillInfo,
  hideModal,
  hideSessionDetailModal
} from './ui/renderer.js';
import { initializeKeyboardHandler, setKeyboardCallbacks, clearKeyboardCallbacks } from './ui/keyboard-handler.js';
import {
  createNotationSession,
  getActiveNotationSession,
  getCurrentPiece,
  recordAttempt,
  finalizeNotationSession,
  cancelNotationSession
} from './services/notation-session-manager.js';
import { validateEdgeAnswer, validateCornerAnswer } from './services/notation-validator.js';
import { renderEdgeSquares, renderCornerSquares, renderNotationResults } from './ui/notation-renderer.js';
import { TracingRenderer } from './ui/tracing-renderer.js';
import { OnboardingManager } from './onboarding/onboarding-manager.js';
import { loadChartJS } from './ui/chart-renderer.js';
import { getSessionRank, getNotationSessionRank } from './services/session-ranker.js';
import {
  createColorMemorizationSession,
  getActiveColorMemorizationSession,
  recordPieceTiming,
  finalizeColorMemorizationSession,
  cancelColorMemorizationSession
} from './services/color-memorization-session-manager.js';
import {
  renderColorMemorizationSessionScreen,
  renderColorMemorizationRatingScreen
} from './ui/color-memorization-renderer.js';
import { initializeAnalytics, trackPageView, trackEvent } from './services/analytics.js';
import { measurementId } from './config/firebase-config.js';

// Application state
let currentPairIndex = 0;
let furthestPairIndex = 0;
let currentTimer = 0;

// Notation training state
let currentPieceIndex = 0;
let currentNotationTimer = 0;
let timerInterval: number | null = null;

// Tracing drill state
let tracingRenderer: TracingRenderer | null = null;

// Color memorization state
let currentColorMemorizationPieceIndex = 0;
let currentColorMemorizationTimer = 0;

// Initialize the application
export async function initializeApp(): Promise<void> {
  // Initialize Google Analytics
  if (measurementId) {
    initializeAnalytics(measurementId);
    trackPageView(window.location.pathname, document.title);
  }
  
  // Check if user should see onboarding
  if (OnboardingManager.shouldShowOnboarding()) {
    // Redirect to onboarding
    window.location.href = 'onboarding.html';
    return;
  }
  
  const configs = getAllDrillConfigs();
  renderSetupScreen(configs);
  attachEventListeners();
  initializeAuthUI();
  initializeKeyboardHandler();
  
  // Check for onboarding recommendations
  checkOnboardingRecommendations();
  
  // Show appropriate tutorial button based on onboarding status
  setupTutorialButtons();
  
  // Load dashboard data and show home dashboard by default
  await loadAndRenderHomeDashboard();
}

function attachEventListeners(): void {
  // Setup screen
  const drillSelect = document.getElementById('drill-select') as HTMLSelectElement;
  const pairCountInput = document.getElementById('pair-count') as HTMLInputElement;
  const startBtn = document.getElementById('start-btn');
  const viewDashboardBtn = document.getElementById('view-dashboard-btn');
  const showTechniqueIntroBtn = document.getElementById('show-technique-intro-btn');
  const showDrillInfoBtn = document.getElementById('show-drill-info-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  const reviewTutorialBtn = document.getElementById('review-tutorial-btn');
  
  if (drillSelect) {
    drillSelect.addEventListener('change', handleDrillChange);
  }
  
  if (pairCountInput) {
    pairCountInput.addEventListener('input', handlePairCountChange);
  }
  
  if (startBtn) {
    startBtn.addEventListener('click', handleStartSession);
  }
  
  if (viewDashboardBtn) {
    viewDashboardBtn.addEventListener('click', async () => {
      // Navigate to home dashboard instead of detailed dashboard
      await loadAndRenderHomeDashboard();
    });
  }
  
  if (showTechniqueIntroBtn) {
    showTechniqueIntroBtn.addEventListener('click', () => {
      showTechniqueIntro(BLD_TECHNIQUE_INTRO);
    });
  }
  
  if (showDrillInfoBtn) {
    showDrillInfoBtn.addEventListener('click', () => {
      const select = document.getElementById('drill-select') as HTMLSelectElement;
      if (select?.value) {
        const drillType = select.value as DrillType;
        const config = getDrillConfig(drillType);
        if (config) {
          showDrillInfo(config);
        }
      }
    });
  }
  
  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', () => {
      localStorage.setItem('onboarding_force', 'true');
      window.location.href = 'onboarding.html';
    });
  }
  
  if (reviewTutorialBtn) {
    reviewTutorialBtn.addEventListener('click', () => {
      localStorage.setItem('onboarding_force', 'true');
      window.location.href = 'onboarding.html';
    });
  }
  
  // Modal close buttons
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalCloseFooterBtn = document.getElementById('modal-close-footer-btn');
  const infoModal = document.getElementById('info-modal');
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
  
  if (modalCloseFooterBtn) {
    modalCloseFooterBtn.addEventListener('click', hideModal);
  }
  
  // Close modal when clicking outside
  if (infoModal) {
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        hideModal();
      }
    });
  }
  
  // Session detail modal close buttons
  const closeSessionDetailBtn = document.getElementById('close-session-detail-btn');
  const sessionDetailCloseFooterBtn = document.getElementById('session-detail-close-footer-btn');
  const sessionDetailModal = document.getElementById('session-detail-modal');
  
  if (closeSessionDetailBtn) {
    closeSessionDetailBtn.addEventListener('click', hideSessionDetailModal);
  }
  
  if (sessionDetailCloseFooterBtn) {
    sessionDetailCloseFooterBtn.addEventListener('click', hideSessionDetailModal);
  }
  
  // Close session detail modal when clicking outside
  if (sessionDetailModal) {
    sessionDetailModal.addEventListener('click', (e) => {
      if (e.target === sessionDetailModal) {
        hideSessionDetailModal();
      }
    });
  }
  
  // Session screen
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const cancelSessionBtn = document.getElementById('cancel-session-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', handlePreviousPair);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', handleNextPair);
  }
  
  if (cancelSessionBtn) {
    cancelSessionBtn.addEventListener('click', handleCancelSession);
  }
  
  // Rating screen
  const saveBtn = document.getElementById('save-btn');
  const discardBtn = document.getElementById('discard-btn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveSession);
  }
  
  if (discardBtn) {
    discardBtn.addEventListener('click', handleDiscardSession);
  }
  
  // Dashboard screen
  const newSessionBtn = document.getElementById('new-session-btn');
  const exportBtn = document.getElementById('export-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  if (newSessionBtn) {
    newSessionBtn.addEventListener('click', () => showScreen('setup-screen'));
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExportCSV);
  }
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', handleClearAll);
  }
  
  // Notation training screen
  const notationSubmitBtn = document.getElementById('notation-submit');
  const notationInput = document.getElementById('notation-input') as HTMLInputElement;
  const cancelNotationBtn = document.getElementById('cancel-notation-btn');
  
  if (notationSubmitBtn) {
    notationSubmitBtn.addEventListener('click', handleNotationSubmit);
  }
  
  if (notationInput) {
    notationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if this is inside a form
        handleNotationSubmit();
      }
    });
  }
  
  if (cancelNotationBtn) {
    cancelNotationBtn.addEventListener('click', handleCancelNotation);
  }
  
  // Notation results screen
  const saveNotationBtn = document.getElementById('save-notation-btn');
  const discardNotationBtn = document.getElementById('discard-notation-btn');
  
  if (saveNotationBtn) {
    saveNotationBtn.addEventListener('click', handleSaveNotation);
  }
  
  if (discardNotationBtn) {
    discardNotationBtn.addEventListener('click', handleDiscardNotation);
  }
  
  // Chart controls
  const timeRangeSelect = document.getElementById('time-range-select') as HTMLSelectElement;
  const drillFilterSelect = document.getElementById('drill-filter-select') as HTMLSelectElement;
  
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', handleChartFilterChange);
  }
  
  if (drillFilterSelect) {
    drillFilterSelect.addEventListener('change', handleChartFilterChange);
  }
  
  // Home dashboard event listeners
  setupHomeDashboardListeners();
  
  // Back to dashboard button (from setup screen)
  const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener('click', async () => {
      await loadAndRenderHomeDashboard();
    });
  }
  
  // Back to home dashboard button (from Training Dashboard)
  const backToHomeDashboardBtn = document.getElementById('back-to-home-dashboard-btn');
  if (backToHomeDashboardBtn) {
    backToHomeDashboardBtn.addEventListener('click', async () => {
      await loadAndRenderHomeDashboard();
    });
  }
  
  // Listen for auth state changes to refresh dashboard
  window.addEventListener('auth-state-changed', async () => {
    // Refresh home dashboard when auth state changes
    const homeDashboardScreen = document.getElementById('home-dashboard-screen');
    if (homeDashboardScreen && !homeDashboardScreen.classList.contains('hidden')) {
      await loadAndRenderHomeDashboard();
    }
  });
}

/**
 * Setup event listeners for home dashboard
 */
function setupHomeDashboardListeners(): void {
  // Primary CTA button - start training
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'start-training-btn' || target.closest('#start-training-btn')) {
      e.preventDefault();
      showScreen('setup-screen');
    }
    
    // View detailed dashboard button
    if (target.id === 'view-detailed-dashboard-btn' || target.closest('#view-detailed-dashboard-btn')) {
      e.preventDefault();
      loadAndRenderTrainingDashboard();
    }
    
    // Drill card start buttons
    if (target.classList.contains('drill-start-btn') || target.closest('.drill-start-btn')) {
      e.preventDefault();
      const btn = target.classList.contains('drill-start-btn') ? target : target.closest('.drill-start-btn') as HTMLElement;
      const drillType = btn.getAttribute('data-drill-type');
      if (drillType) {
        startDrillFromCard(drillType as DrillType);
      }
    }
    
    // Registration signup button
    if (target.id === 'registration-signup-btn' || target.closest('#registration-signup-btn')) {
      e.preventDefault();
      handleRegistrationSignup();
    }
  });
}

/**
 * Load and render home dashboard
 */
async function loadAndRenderHomeDashboard(): Promise<void> {
  // Track dashboard view
  trackEvent('dashboard_view', {
    view_type: 'home_dashboard'
  });
  try {
    // Wait for auth to initialize
    await waitForAuthInit();
    const authState = getAuthState();
    const isAuthenticated = authState.isAuthenticated;
    
    // Load sessions (from API if authenticated, from localStorage if not)
    const sessions = await getAllSessions();
    const notationSessions = await getAllNotationSessions();
    
    // Load population stats (available for all users - public endpoint)
    let populationStats = null;
    try {
      populationStats = await getPopulationStats();
    } catch (error) {
      console.error('Error loading population stats:', error);
      // Continue without population stats
    }
    
    // Render home dashboard
    renderHomeDashboard(sessions, notationSessions, populationStats);
    
    // Show home dashboard screen if we're not already on a session screen
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (!currentScreen || currentScreen.id === 'home-dashboard-screen' || 
        currentScreen.id === 'setup-screen' || currentScreen.id === 'dashboard-screen') {
      showScreen('home-dashboard-screen');
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Show dashboard with empty data
    renderHomeDashboard([], [], null);
    showScreen('home-dashboard-screen');
  }
}

/**
 * Load and render Training Dashboard (with graphs and sessions)
 */
async function loadAndRenderTrainingDashboard(): Promise<void> {
  // Track dashboard view
  trackEvent('dashboard_view', {
    view_type: 'training_dashboard'
  });
  try {
    // Wait for auth to initialize
    await waitForAuthInit();
    
    // Load sessions (from API if authenticated, from localStorage if not)
    const sessions = await getAllSessions();
    const notationSessions = await getAllNotationSessions();
    
    // Show Training Dashboard screen first (this will trigger refreshAuthUI via showScreen)
    showScreen('dashboard-screen');
    
    // Render Training Dashboard (refreshAuthUI is already called by showScreen, but we call it again to be safe)
    renderDashboard(sessions, notationSessions);
    
    // Ensure auth UI is refreshed after screen is shown and DOM is ready
    setTimeout(() => {
      refreshAuthUI();
    }, 100);
  } catch (error) {
    console.error('Error loading Training Dashboard:', error);
    // Show dashboard with empty data
    showScreen('dashboard-screen');
    renderDashboard([], []);
    setTimeout(() => {
      refreshAuthUI();
    }, 100);
  }
}

/**
 * Start drill from drill card
 */
function startDrillFromCard(drillType: DrillType): void {
  const config = getDrillConfig(drillType);
  if (!config) return;
  
  // Navigate to setup screen
  showScreen('setup-screen');
  
  // Pre-select the drill
  const drillSelect = document.getElementById('drill-select') as HTMLSelectElement;
  if (drillSelect) {
    drillSelect.value = drillType;
    updateDrillDescription(config);
  }
  
  // Optionally auto-start the session (or just pre-select and let user start)
  // For now, just pre-select and show setup screen
}

/**
 * Handle registration signup from dashboard
 */
async function handleRegistrationSignup(): Promise<void> {
  try {
    const { signInWithGoogle } = await import('./services/auth-service.js');
    await signInWithGoogle();
    // Auth UI will handle the rest and refresh dashboard
  } catch (error) {
    console.error('Registration signup failed:', error);
    showNotification('Failed to sign up. Please try again.', 'error');
  }
}

function handleDrillChange(): void {
  const select = document.getElementById('drill-select') as HTMLSelectElement;
  if (!select || !select.value) {
    clearPairCountWarning();
    return;
  }
  
  const drillType = select.value as DrillType;
  const config = getDrillConfig(drillType);
  
  if (config) {
    updateDrillDescription(config);
    clearPairCountWarning();
    // Track drill selection
    trackEvent('drill_selected', {
      drill_type: drillType,
      drill_name: formatDrillName(config.type)
    });
  }
}

function handlePairCountChange(): void {
  const select = document.getElementById('drill-select') as HTMLSelectElement;
  const input = document.getElementById('pair-count') as HTMLInputElement;
  
  if (!select?.value || !input) return;
  
  const drillType = select.value as DrillType;
  const count = parseInt(input.value, 10);
  
  const validation = validatePairCount(count, drillType);
  
  if (!validation.valid) {
    showPairCountWarning('Invalid pair count (must be between 1 and 50)');
  } else if (validation.warning) {
    showPairCountWarning(validation.warning);
  } else {
    clearPairCountWarning();
  }
}

async function handleStartSession(): Promise<void> {
  const select = document.getElementById('drill-select') as HTMLSelectElement;
  const input = document.getElementById('pair-count') as HTMLInputElement;
  
  if (!select?.value) {
    showNotification('Please select a drill type', 'error');
    return;
  }
  
  const drillType = select.value as DrillType;
  
  // Check if it's a notation drill
  if (drillType === DrillType.EDGE_NOTATION_DRILL || drillType === DrillType.CORNER_NOTATION_DRILL) {
    await handleStartNotationSession(drillType);
    return;
  }
  
  // Check if it's a tracing drill
  if (drillType === DrillType.CORNER_TRACING_DRILL || drillType === DrillType.EDGE_TRACING_DRILL) {
    await handleStartTracingSession(drillType);
    return;
  }
  
  // Check if it's a color memorization drill
  if (drillType === DrillType.EDGE_MEMORIZATION || drillType === DrillType.CORNER_MEMORIZATION) {
    await handleStartColorMemorizationSession(drillType);
    return;
  }
  
  const pairCount = parseInt(input.value, 10);
  
  const validation = validatePairCount(pairCount, drillType);
  if (!validation.valid) {
    showNotification('Invalid pair count', 'error');
    return;
  }
  
  try {
    const session = await createSession(drillType, pairCount);
    currentPairIndex = 0;
    furthestPairIndex = 0;
    currentTimer = 0; // Reset timer when starting new session
    
    // Track training session start
    trackEvent('training_session_start', {
      drill_type: drillType,
      pair_count: pairCount,
      session_id: session.id
    });
    
    showScreen('session-screen');
    displayCurrentPair();
    
    // Set keyboard callbacks for session
    setKeyboardCallbacks({
      space: handleNextPair,
      arrowLeft: handlePreviousPair,
      arrowRight: handleNextPair,
      escape: handleCancelSession
    });
  } catch (error) {
    console.error('Error creating session:', error);
    showNotification('Error starting session', 'error');
  }
}

function displayCurrentPair(): void {
  const session = getActiveSession();
  if (!session) return;
  
  const currentPair = session.pairs[currentPairIndex];
  if (currentPair) {
    renderSessionScreen(currentPair.pair, currentPairIndex, session.pairCount);
    
    // Timer management: timer only starts when advancing to new furthest pair
    // Start timer if at furthest pair and timer not yet started (initial case)
    if (currentPairIndex === furthestPairIndex && currentTimer === 0) {
      currentTimer = startTimer();
    }
    // Don't restart timer when returning to furthest pair or viewing previous pairs
    
    // Update Previous button state
    updatePreviousButtonState();
  }
}

function handlePreviousPair(): void {
  const session = getActiveSession();
  if (!session) return;
  
  // Don't go before first pair
  if (currentPairIndex === 0) return;
  
  // Decrement index (timer keeps running for furthest pair)
  currentPairIndex--;
  
  // Update display (doesn't affect timer)
  displayCurrentPair();
}

function updatePreviousButtonState(): void {
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
  if (prevBtn) {
    prevBtn.disabled = currentPairIndex === 0;
  }
}

function handleNextPair(): void {
  const session = getActiveSession();
  if (!session) return;
  
  // If at furthest pair, stop timer and record timing
  if (currentPairIndex === furthestPairIndex) {
    const timing = stopTimer(currentTimer);
    recordPairTiming(timing);
  }
  
  currentPairIndex++;
  
  // If moving to a new furthest pair, update furthestPairIndex and start new timer
  if (currentPairIndex > furthestPairIndex) {
    furthestPairIndex = currentPairIndex;
    currentTimer = startTimer();
  }
  
  if (currentPairIndex < session.pairCount) {
    // More pairs to go
    displayCurrentPair();
  } else {
    // Session complete, show rating screen
    const metric = getQualityMetric(session.drillType);
    renderRatingScreen(metric, session.pairCount, session.drillType);
    showScreen('rating-screen');
    
    // Set keyboard callbacks for rating screen
    setKeyboardCallbacks({
      enter: handleSaveSession,
      escape: handleDiscardSession,
      numbers: handleQuickRating
    });
  }
}

function handleQuickRating(num: number): void {
  const session = getActiveSession();
  if (!session) return;
  
  const metric = getQualityMetric(session.drillType);
  
  if (validateQualityRating(num, metric)) {
    const radios = document.querySelectorAll('input[name="quality"]');
    radios.forEach((radio: Element) => {
      const input = radio as HTMLInputElement;
      if (input.value === num.toString()) {
        input.checked = true;
      }
    });
  }
}

async function handleSaveSession(): Promise<void> {
  const session = getActiveSession();
  if (!session) return;
  
  const recallTextInput = document.getElementById('recall-text-input') as HTMLTextAreaElement;
  const notesInput = document.getElementById('notes-input') as HTMLTextAreaElement;
  const qualityRadios = document.querySelectorAll('input[name="quality"]:checked');
  
  if (qualityRadios.length === 0) {
    showNotification('Please select a quality rating', 'error');
    return;
  }
  
  const userRecall = recallTextInput.value.trim();
  
  if (!userRecall) {
    showNotification('Please enter your recalled pairs', 'error');
    return;
  }
  
  const quality = parseInt((qualityRadios[0] as HTMLInputElement).value, 10);
  const notes = notesInput.value.trim();
  
  const metric = getQualityMetric(session.drillType);
  if (!validateQualityRating(quality, metric)) {
    showNotification('Invalid quality rating', 'error');
    return;
  }
  
  try {
    const completedSession = await finalizeSession(userRecall, quality, notes || undefined);
    
    // Track training session completion
    trackEvent('training_session_complete', {
      drill_type: completedSession.drillType,
      pair_count: completedSession.pairCount,
      accuracy: completedSession.recallValidation?.accuracy || 0,
      quality_rating: quality,
      total_time: completedSession.totalTime,
      session_id: completedSession.id
    });
    
    // Calculate and display ranking
    const rankInfo = await getSessionRank(completedSession);
    
    // Show validation feedback
    if (completedSession.recallValidation) {
      renderRecallFeedback(completedSession.recallValidation);
      
      // Delay navigation to let user see results
      setTimeout(async () => {
        showNotification(`Session saved successfully! ${rankInfo.message}`, 'success');
        const sessions = await getAllSessions();
        const notationSessions = await getAllNotationSessions();
        renderDashboard(sessions, notationSessions);
        showScreen('dashboard-screen');
        clearKeyboardCallbacks();
      }, 3000);
    } else {
      // Fallback if validation not available
      showNotification(`Session saved successfully! ${rankInfo.message}`, 'success');
      const sessions = await getAllSessions();
      const notationSessions = await getAllNotationSessions();
      renderDashboard(sessions, notationSessions);
      showScreen('dashboard-screen');
      clearKeyboardCallbacks();
    }
  } catch (error) {
    console.error('Error saving session:', error);
    showNotification('Error saving session', 'error');
  }
}

function handleDiscardSession(): void {
  if (confirm('Are you sure you want to discard this session?')) {
    cancelSession();
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

function handleCancelSession(): void {
  if (confirm('Are you sure you want to cancel this session?')) {
    const session = getActiveSession();
    const drillType = session?.drillType || 'unknown';
    
    cancelSession();
    
    // Track training session cancellation
    trackEvent('training_session_cancel', {
      drill_type: drillType,
      pair_count: session?.pairCount || 0
    });
    
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

async function handleExportCSV(): Promise<void> {
  const sessions = await getAllSessions();
  
  if (sessions.length === 0) {
    showNotification('No sessions to export', 'error');
    return;
  }
  
  try {
    const csv = generateCSV(sessions);
    const date = new Date().toISOString().split('T')[0];
    const filename = `bld_training_log_${date}.csv`;
    
    // Track data export
    trackEvent('data_export', {
      session_count: sessions.length,
      export_format: 'csv'
    });
    downloadCSV(csv, filename);
    showNotification('CSV exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    showNotification('Error exporting CSV', 'error');
  }
}

function handleClearAll(): void {
  if (confirm('Are you sure you want to clear all session data? This cannot be undone.')) {
    if (confirm('Really clear ALL data? This is permanent!')) {
      clearAllSessions();
      renderDashboard([], []);
      showNotification('All data cleared', 'success');
    }
  }
}

// Notation Training Handlers
async function handleStartNotationSession(drillType: DrillType.EDGE_NOTATION_DRILL | DrillType.CORNER_NOTATION_DRILL): Promise<void> {
  try {
    const session = await createNotationSession(drillType);
    currentPieceIndex = 0;
    
    // Track training session start
    trackEvent('training_session_start', {
      drill_type: drillType,
      session_type: 'notation',
      session_id: session.id
    });
    
    showScreen('notation-screen');
    
    // Ensure screen is visible before rendering
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      displayCurrentPiece();
    });
    
    // Set keyboard callbacks
    setKeyboardCallbacks({
      escape: handleCancelNotation
    });
  } catch (error) {
    console.error('Error creating notation session:', error);
    showNotification('Error starting notation session', 'error');
  }
}

async function handleStartTracingSession(drillType: DrillType.CORNER_TRACING_DRILL | DrillType.EDGE_TRACING_DRILL): Promise<void> {
  try {
    // Initialize tracing renderer if not already done
    if (!tracingRenderer) {
      tracingRenderer = new TracingRenderer();
    }
    
    // Track training session start
    trackEvent('training_session_start', {
      drill_type: drillType,
      session_type: 'tracing'
    });
    
    // Render the tracing screen
    tracingRenderer.renderTracingScreen(drillType);
    
    // Set keyboard callbacks
    setKeyboardCallbacks({
      escape: handleCancelTracing
    });
  } catch (error) {
    console.error('Error starting tracing session:', error);
    showNotification('Error starting tracing session', 'error');
  }
}

function handleCancelTracing(): void {
  // Clear tracing renderer state
  tracingRenderer = null;
  
  // Clear keyboard callbacks
  clearKeyboardCallbacks();
  
  // Go back to setup screen
  showScreen('setup-screen');
}

// Color Memorization Handlers
async function handleStartColorMemorizationSession(drillType: DrillType.EDGE_MEMORIZATION | DrillType.CORNER_MEMORIZATION): Promise<void> {
  const input = document.getElementById('pair-count') as HTMLInputElement;
  const pieceCount = parseInt(input.value, 10) || 12;
  
  try {
    const session = await createColorMemorizationSession(drillType, pieceCount);
    currentColorMemorizationPieceIndex = 0;
    currentColorMemorizationTimer = 0;
    
    // Track training session start
    trackEvent('training_session_start', {
      drill_type: drillType,
      session_type: 'color_memorization',
      piece_count: pieceCount,
      session_id: session.id
    });
    
    showScreen('session-screen');
    displayCurrentColorMemorizationPiece();
    
    // Set keyboard callbacks for session
    setKeyboardCallbacks({
      space: handleNextColorMemorizationPiece,
      arrowLeft: handlePreviousColorMemorizationPiece,
      arrowRight: handleNextColorMemorizationPiece,
      escape: handleCancelColorMemorizationSession
    });
  } catch (error) {
    console.error('Error creating color memorization session:', error);
    showNotification('Error starting color memorization session', 'error');
  }
}

function displayCurrentColorMemorizationPiece(): void {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  const currentPiece = session.pieces[currentColorMemorizationPieceIndex];
  if (!currentPiece) return;
  
  renderColorMemorizationSessionScreen(
    currentPiece,
    currentColorMemorizationPieceIndex,
    session.pieceCount,
    session.drillType
  );
  
  // Timer management: timer only starts when advancing to new piece
  if (currentColorMemorizationPieceIndex === 0 && currentColorMemorizationTimer === 0) {
    currentColorMemorizationTimer = startTimer();
  }
  
  // Attach event listeners
  attachColorMemorizationEventListeners();
  
  // Update Previous button state
  updateColorMemorizationPreviousButtonState();
}

function attachColorMemorizationEventListeners(): void {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  if (prevBtn) {
    prevBtn.replaceWith(prevBtn.cloneNode(true)); // Remove old listeners
    document.getElementById('prev-btn')?.addEventListener('click', handlePreviousColorMemorizationPiece);
  }
  
  if (nextBtn) {
    nextBtn.replaceWith(nextBtn.cloneNode(true)); // Remove old listeners
    document.getElementById('next-btn')?.addEventListener('click', handleNextColorMemorizationPiece);
  }
  
  if (cancelBtn) {
    cancelBtn.replaceWith(cancelBtn.cloneNode(true)); // Remove old listeners
    document.getElementById('cancel-btn')?.addEventListener('click', handleCancelColorMemorizationSession);
  }
}

function updateColorMemorizationPreviousButtonState(): void {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
  if (prevBtn) {
    prevBtn.disabled = currentColorMemorizationPieceIndex === 0;
  }
}

function handlePreviousColorMemorizationPiece(): void {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  if (currentColorMemorizationPieceIndex === 0) return;
  
  currentColorMemorizationPieceIndex--;
  displayCurrentColorMemorizationPiece();
  
  // Update button state after navigation
  updateColorMemorizationPreviousButtonState();
}

function handleNextColorMemorizationPiece(): void {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  // If at current piece, stop timer and record timing
  if (currentColorMemorizationTimer > 0) {
    const timing = stopTimer(currentColorMemorizationTimer);
    recordPieceTiming(timing);
  }
  
  currentColorMemorizationPieceIndex++;
  
  if (currentColorMemorizationPieceIndex < session.pieceCount) {
    // More pieces to go - start new timer
    currentColorMemorizationTimer = startTimer();
    displayCurrentColorMemorizationPiece();
  } else {
    // Session complete, show rating screen
    const metric = getQualityMetric(session.drillType);
    renderColorMemorizationRatingScreen(session, metric);
    showScreen('rating-screen');
    
    // Set keyboard callbacks for rating screen
    setKeyboardCallbacks({
      enter: handleSaveColorMemorizationSession,
      escape: handleDiscardColorMemorizationSession,
      numbers: handleQuickColorMemorizationRating
    });
    
    // Attach event listeners for rating screen buttons
    attachColorMemorizationRatingEventListeners();
  }
}

function attachColorMemorizationRatingEventListeners(): void {
  const saveBtn = document.getElementById('save-btn');
  const discardBtn = document.getElementById('discard-btn');
  
  if (saveBtn) {
    saveBtn.replaceWith(saveBtn.cloneNode(true)); // Remove old listeners
    document.getElementById('save-btn')?.addEventListener('click', handleSaveColorMemorizationSession);
  }
  
  if (discardBtn) {
    discardBtn.replaceWith(discardBtn.cloneNode(true)); // Remove old listeners
    document.getElementById('discard-btn')?.addEventListener('click', handleDiscardColorMemorizationSession);
  }
}

function handleQuickColorMemorizationRating(num: number): void {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  const metric = getQualityMetric(session.drillType);
  
  if (validateQualityRating(num, metric)) {
    const radios = document.querySelectorAll('input[name="quality"]');
    radios.forEach((radio: Element) => {
      const input = radio as HTMLInputElement;
      if (input.value === num.toString()) {
        input.checked = true;
      }
    });
  }
}

async function handleSaveColorMemorizationSession(): Promise<void> {
  const session = getActiveColorMemorizationSession();
  if (!session) return;
  
  const recallTextInput = document.getElementById('recall-text-input') as HTMLTextAreaElement;
  const notesInput = document.getElementById('notes-input') as HTMLTextAreaElement;
  const qualityRadios = document.querySelectorAll('input[name="quality"]:checked');
  
  if (qualityRadios.length === 0) {
    showNotification('Please select a quality rating', 'error');
    return;
  }
  
  const userRecall = recallTextInput.value.trim();
  
  if (!userRecall) {
    showNotification('Please enter your recalled letters', 'error');
    return;
  }
  
  const quality = parseInt((qualityRadios[0] as HTMLInputElement).value, 10);
  const notes = notesInput.value.trim();
  
  const metric = getQualityMetric(session.drillType);
  if (!validateQualityRating(quality, metric)) {
    showNotification('Invalid quality rating', 'error');
    return;
  }
  
  try {
    const completedSession = await finalizeColorMemorizationSession(userRecall, quality, notes || undefined);
    
    // Track training session completion
    trackEvent('training_session_complete', {
      drill_type: completedSession.drillType,
      session_type: 'color_memorization',
      accuracy: completedSession.recallValidation?.accuracy || 0,
      quality_rating: quality,
      total_time: completedSession.totalTime,
      piece_count: completedSession.pieceCount,
      session_id: completedSession.id
    });
    
    // Calculate and display ranking
    const rankInfo = await getSessionRank(completedSession as any);
    
    // Show validation feedback
    if (completedSession.recallValidation) {
      renderRecallFeedback(completedSession.recallValidation);
      
      // Delay navigation to let user see results
      setTimeout(async () => {
        showNotification(`Session saved successfully! ${rankInfo.message}`, 'success');
        const sessions = await getAllSessions();
        const notationSessions = await getAllNotationSessions();
        renderDashboard(sessions, notationSessions);
        showScreen('dashboard-screen');
        clearKeyboardCallbacks();
      }, 3000);
    } else {
      showNotification(`Session saved successfully! ${rankInfo.message}`, 'success');
      const sessions = await getAllSessions();
      const notationSessions = await getAllNotationSessions();
      renderDashboard(sessions, notationSessions);
      showScreen('dashboard-screen');
      clearKeyboardCallbacks();
    }
  } catch (error) {
    console.error('Error saving color memorization session:', error);
    showNotification('Error saving session', 'error');
  }
}

function handleDiscardColorMemorizationSession(): void {
  if (confirm('Are you sure you want to discard this session?')) {
    cancelColorMemorizationSession();
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

function handleCancelColorMemorizationSession(): void {
  if (confirm('Are you sure you want to cancel this session?')) {
    cancelColorMemorizationSession();
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

function displayCurrentPiece(): void {
  const session = getActiveNotationSession();
  if (!session) return;
  
  const piece = getCurrentPiece(currentPieceIndex);
  if (!piece) return;
  
  // Update counter
  const counter = document.getElementById('notation-counter');
  if (counter) {
    counter.textContent = `Piece ${currentPieceIndex + 1} of ${session.totalPieces}`;
  }
  
  // Render color squares
  if (session.drillType === DrillType.EDGE_NOTATION_DRILL) {
    renderEdgeSquares((piece as EdgePiece).colors);
  } else {
    renderCornerSquares((piece as CornerPiece).colors);
  }
  
  // Clear input and focus
  const input = document.getElementById('notation-input') as HTMLInputElement;
  if (input) {
    input.value = '';
    input.focus();
  }
  
  // Hide feedback
  const feedback = document.getElementById('notation-feedback');
  if (feedback) {
    feedback.classList.add('hidden');
  }
  
  // Start timer
  currentNotationTimer = startTimer();
  
  // Start visual timer update
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = window.setInterval(updateTimerDisplay, 100);
}

function updateTimerDisplay(): void {
  const now = Date.now();
  const elapsed = (now - currentNotationTimer) / 1000;
  const timerEl = document.getElementById('notation-timer');
  if (timerEl) {
    timerEl.textContent = `${elapsed.toFixed(1)}s`;
  }
}

async function handleNotationSubmit(): Promise<void> {
  const session = getActiveNotationSession();
  if (!session) return;
  
  const piece = getCurrentPiece(currentPieceIndex);
  if (!piece) return;
  
  const input = document.getElementById('notation-input') as HTMLInputElement;
  const userAnswer = input?.value.trim() || '';
  
  // Stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const elapsed = stopTimer(currentNotationTimer);
  
  // Validate answer
  let validation;
  try {
    if (session.drillType === DrillType.EDGE_NOTATION_DRILL) {
      validation = await validateEdgeAnswer((piece as EdgePiece).colors, userAnswer);
    } else {
      validation = await validateCornerAnswer((piece as CornerPiece).colors, userAnswer);
    }
  } catch (error) {
    console.error('Error validating answer:', error);
    showNotification('Error validating answer', 'error');
    return;
  }
  
  // Create attempt
  const attempt: NotationAttempt = {
    pieceColors: [...piece.colors],
    correctAnswer: validation.correctAnswer,
    userAnswer,
    isCorrect: validation.isCorrect,
    timeSeconds: elapsed
  };
  
  // Record attempt
  recordAttempt(attempt);
  
  // Show feedback
  const feedback = document.getElementById('notation-feedback');
  if (feedback) {
    feedback.classList.remove('hidden', 'correct', 'incorrect');
    feedback.classList.add(validation.isCorrect ? 'correct' : 'incorrect');
    
    if (validation.isCorrect) {
      feedback.innerHTML = `✓ Correct! (${elapsed.toFixed(2)}s)`;
    } else {
      feedback.innerHTML = `✗ Incorrect<br>Correct: <strong>${validation.correctAnswer}</strong> (${elapsed.toFixed(2)}s)`;
    }
  }
  
  // Wait 1 second, then show next piece or results
  setTimeout(() => {
    currentPieceIndex++;
    
    if (currentPieceIndex < session.totalPieces) {
      displayCurrentPiece();
    } else {
      showNotationResults();
    }
  }, 1000);
}

function showNotationResults(): void {
  const session = getActiveNotationSession();
  if (!session) return;
  
  // Stop any running timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Calculate metrics before showing results (without saving yet)
  const totalAttempts = session.attempts.length;
  if (totalAttempts > 0) {
    session.accuracy = (session.correctCount / session.totalPieces) * 100;
    const totalTime = session.attempts.reduce((sum, attempt) => sum + attempt.timeSeconds, 0);
    session.averageTime = totalTime / totalAttempts;
  }
  
  renderNotationResults(session);
  showScreen('notation-results-screen');
  
  // Clear keyboard callbacks
  clearKeyboardCallbacks();
}

async function handleSaveNotation(): Promise<void> {
  const notesInput = document.getElementById('notation-notes-input') as HTMLTextAreaElement;
  const notes = notesInput?.value.trim() || undefined;
  
  try {
    const completedSession = await finalizeNotationSession(notes);
    
    // Track training session completion
    trackEvent('training_session_complete', {
      drill_type: completedSession.drillType,
      session_type: 'notation',
      accuracy: completedSession.accuracy || 0,
      total_pieces: completedSession.totalPieces,
      correct_count: completedSession.correctCount,
      session_id: completedSession.id
    });
    
    // Calculate and display ranking
    const rankInfo = await getNotationSessionRank(completedSession);
    showNotification(`Notation training saved successfully! ${rankInfo.message}`, 'success');
    
    // Navigate to dashboard
    const sessions = await getAllSessions();
    const notationSessions = await getAllNotationSessions();
    renderDashboard(sessions, notationSessions);
    showScreen('dashboard-screen');
  } catch (error) {
    console.error('Error saving notation session:', error);
    showNotification('Error saving notation session', 'error');
  }
}

function handleDiscardNotation(): void {
  if (confirm('Are you sure you want to discard this notation training session?')) {
    cancelNotationSession();
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

function handleCancelNotation(): void {
  if (confirm('Are you sure you want to cancel this notation training?')) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    cancelNotationSession();
    showScreen('setup-screen');
    clearKeyboardCallbacks();
  }
}

// Check for onboarding recommendations and apply them
function checkOnboardingRecommendations(): void {
  const recommendedDrillType = localStorage.getItem('recommended_drill_type');
  const recommendedPairCount = localStorage.getItem('recommended_pair_count');
  const redirectView = localStorage.getItem('onboarding_redirect_view');
  
  if (recommendedDrillType && recommendedPairCount) {
    // Set the recommended drill type and pair count
    const drillSelect = document.getElementById('drill-select') as HTMLSelectElement;
    const pairCountInput = document.getElementById('pair-count') as HTMLInputElement;
    
    if (drillSelect) {
      drillSelect.value = recommendedDrillType;
      // Trigger change event to update description
      drillSelect.dispatchEvent(new Event('change'));
    }
    
    if (pairCountInput) {
      pairCountInput.value = recommendedPairCount;
    }
    
    // Clear the recommendations
    localStorage.removeItem('recommended_drill_type');
    localStorage.removeItem('recommended_pair_count');
    
    // Show a notification about the recommendations
    showNotification('Welcome! We\'ve set up your first session based on your onboarding preferences.', 'success');
  }

  if (redirectView === 'dashboard') {
    localStorage.removeItem('onboarding_redirect_view');
    const viewDashboardBtn = document.getElementById('view-dashboard-btn') as HTMLButtonElement | null;
    viewDashboardBtn?.click();
  }
}

// Setup tutorial buttons based on onboarding status
function setupTutorialButtons(): void {
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  const reviewTutorialBtn = document.getElementById('review-tutorial-btn');
  
  if (OnboardingManager.hasCompletedOnboarding()) {
    // User has completed onboarding, show review button
    if (startTutorialBtn) startTutorialBtn.style.display = 'none';
    if (reviewTutorialBtn) reviewTutorialBtn.style.display = 'inline-block';
  } else {
    // User hasn't completed onboarding, show start button
    if (startTutorialBtn) startTutorialBtn.style.display = 'inline-block';
    if (reviewTutorialBtn) reviewTutorialBtn.style.display = 'none';
  }
}

// Handle chart filter changes
async function handleChartFilterChange(): Promise<void> {
  try {
    const timeRangeSelect = document.getElementById('time-range-select') as HTMLSelectElement;
    const drillFilterSelect = document.getElementById('drill-filter-select') as HTMLSelectElement;
    
    if (!timeRangeSelect || !drillFilterSelect) return;
    
    const timeRange = timeRangeSelect.value;
    const drillFilter = drillFilterSelect.value;
    
    // Load sessions
    const sessions = await getAllSessions();
    const notationSessions = await getAllNotationSessions();
    
    // Update charts with new filters
    const { updateChartsWithFilters } = await import('./ui/chart-renderer.js');
    updateChartsWithFilters(timeRange, drillFilter, sessions, notationSessions);
    
  } catch (error) {
    console.error('Error updating charts with filters:', error);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}


