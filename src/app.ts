/**
 * Main application controller for BLD Memory Trainer
 */

import { DrillType, SessionData, NotationSessionData, NotationAttempt, EdgePiece, CornerPiece } from './types.js';
import { getAllDrillConfigs, getDrillConfig, BLD_TECHNIQUE_INTRO } from './config/drill-config.js';
import { createSession, getActiveSession, recordPairTiming, finalizeSession, cancelSession } from './services/session-manager.js';
import { startTimer, stopTimer } from './services/timer.js';
import { getQualityMetric } from './services/quality-adapter.js';
import { getAllSessions } from './storage/storage-adapter.js';
import { getAllNotationSessions } from './storage/storage-adapter.js';
import { clearAllSessions } from './storage/session-storage.js';
import { generateCSV, downloadCSV } from './services/csv-exporter.js';
import { initializeAuthUI } from './ui/auth-ui.js';
import { validatePairCount, validateRecallCount, validateQualityRating } from './utils/validators.js';
import {
  showScreen,
  renderSetupScreen,
  updateDrillDescription,
  renderSessionScreen,
  renderRatingScreen,
  renderRecallFeedback,
  renderDashboard,
  showNotification,
  showPairCountWarning,
  clearPairCountWarning,
  showTechniqueIntro,
  showDrillInfo,
  hideModal
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

// Application state
let currentPairIndex = 0;
let currentTimer = 0;

// Notation training state
let currentPieceIndex = 0;
let currentNotationTimer = 0;
let timerInterval: number | null = null;

// Tracing drill state
let tracingRenderer: TracingRenderer | null = null;

// Initialize the application
export async function initializeApp(): Promise<void> {
  const configs = getAllDrillConfigs();
  renderSetupScreen(configs);
  attachEventListeners();
  initializeAuthUI();
  initializeKeyboardHandler();
  
  // Always start with setup screen, let auth UI handle dashboard loading
  showScreen('setup-screen');
}

function attachEventListeners(): void {
  // Setup screen
  const drillSelect = document.getElementById('drill-select') as HTMLSelectElement;
  const pairCountInput = document.getElementById('pair-count') as HTMLInputElement;
  const startBtn = document.getElementById('start-btn');
  const viewDashboardBtn = document.getElementById('view-dashboard-btn');
  const showTechniqueIntroBtn = document.getElementById('show-technique-intro-btn');
  const showDrillInfoBtn = document.getElementById('show-drill-info-btn');
  
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
      try {
        const sessions = await getAllSessions();
        const notationSessions = await getAllNotationSessions();
        console.log('Loaded sessions:', sessions.length, 'notation sessions:', notationSessions.length);
        renderDashboard(sessions, notationSessions);
        showScreen('dashboard-screen');
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show empty dashboard if there's an error
        renderDashboard([], []);
        showScreen('dashboard-screen');
      }
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
  
  // Session screen
  const nextBtn = document.getElementById('next-btn');
  const cancelSessionBtn = document.getElementById('cancel-session-btn');
  
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
    notationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
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
  
  const pairCount = parseInt(input.value, 10);
  
  const validation = validatePairCount(pairCount, drillType);
  if (!validation.valid) {
    showNotification('Invalid pair count', 'error');
    return;
  }
  
  try {
    const session = await createSession(drillType, pairCount);
    currentPairIndex = 0;
    
    showScreen('session-screen');
    displayCurrentPair();
    
    // Set keyboard callbacks for session
    setKeyboardCallbacks({
      space: handleNextPair,
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
    currentTimer = startTimer();
  }
}

function handleNextPair(): void {
  const session = getActiveSession();
  if (!session) return;
  
  // Stop timer and record timing
  const timing = stopTimer(currentTimer);
  recordPairTiming(timing);
  
  currentPairIndex++;
  
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
    
    // Show validation feedback
    if (completedSession.recallValidation) {
      renderRecallFeedback(completedSession.recallValidation);
      
      // Delay navigation to let user see results
      setTimeout(async () => {
        showNotification('Session saved successfully!', 'success');
        const sessions = await getAllSessions();
        const notationSessions = await getAllNotationSessions();
        renderDashboard(sessions, notationSessions);
        showScreen('dashboard-screen');
        clearKeyboardCallbacks();
      }, 3000);
    } else {
      // Fallback if validation not available
      showNotification('Session saved successfully!', 'success');
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
    cancelSession();
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
    await createNotationSession(drillType);
    currentPieceIndex = 0;
    
    showScreen('notation-screen');
    displayCurrentPiece();
    
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
    await finalizeNotationSession(notes);
    showNotification('Notation training saved successfully!', 'success');
    
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

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}


