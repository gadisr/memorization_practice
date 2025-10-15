/**
 * Main application controller for BLD Memory Trainer
 */

import { DrillType, SessionData } from './types.js';
import { getAllDrillConfigs, getDrillConfig } from './config/drill-config.js';
import { createSession, getActiveSession, recordPairTiming, finalizeSession, cancelSession } from './services/session-manager.js';
import { startTimer, stopTimer } from './services/timer.js';
import { getQualityMetric } from './services/quality-adapter.js';
import { getAllSessions, clearAllSessions } from './storage/session-storage.js';
import { generateCSV, downloadCSV } from './services/csv-exporter.js';
import { validatePairCount, validateRecallCount, validateQualityRating } from './utils/validators.js';
import {
  showScreen,
  renderSetupScreen,
  updateDrillDescription,
  renderSessionScreen,
  renderRatingScreen,
  renderDashboard,
  showNotification,
  showPairCountWarning,
  clearPairCountWarning
} from './ui/renderer.js';
import { initializeKeyboardHandler, setKeyboardCallbacks, clearKeyboardCallbacks } from './ui/keyboard-handler.js';

// Application state
let currentPairIndex = 0;
let currentTimer = 0;

// Initialize the application
export function initializeApp(): void {
  const configs = getAllDrillConfigs();
  renderSetupScreen(configs);
  attachEventListeners();
  initializeKeyboardHandler();
  
  // Check if there are existing sessions
  const sessions = getAllSessions();
  if (sessions.length > 0) {
    showScreen('dashboard-screen');
    renderDashboard(sessions);
  } else {
    showScreen('setup-screen');
  }
}

function attachEventListeners(): void {
  // Setup screen
  const drillSelect = document.getElementById('drill-select') as HTMLSelectElement;
  const pairCountInput = document.getElementById('pair-count') as HTMLInputElement;
  const startBtn = document.getElementById('start-btn');
  const viewDashboardBtn = document.getElementById('view-dashboard-btn');
  
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
    viewDashboardBtn.addEventListener('click', () => {
      const sessions = getAllSessions();
      renderDashboard(sessions);
      showScreen('dashboard-screen');
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
    renderRatingScreen(metric, session.pairCount);
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

function handleSaveSession(): void {
  const session = getActiveSession();
  if (!session) return;
  
  const recallInput = document.getElementById('recall-input') as HTMLInputElement;
  const notesInput = document.getElementById('notes-input') as HTMLTextAreaElement;
  const qualityRadios = document.querySelectorAll('input[name="quality"]:checked');
  
  if (qualityRadios.length === 0) {
    showNotification('Please select a quality rating', 'error');
    return;
  }
  
  const recall = parseInt(recallInput.value, 10);
  const quality = parseInt((qualityRadios[0] as HTMLInputElement).value, 10);
  const notes = notesInput.value.trim();
  
  if (!validateRecallCount(recall, session.pairCount)) {
    showNotification('Invalid recall count', 'error');
    return;
  }
  
  const metric = getQualityMetric(session.drillType);
  if (!validateQualityRating(quality, metric)) {
    showNotification('Invalid quality rating', 'error');
    return;
  }
  
  try {
    finalizeSession(recall, quality, notes || undefined);
    showNotification('Session saved successfully!', 'success');
    
    // Navigate to dashboard
    const sessions = getAllSessions();
    renderDashboard(sessions);
    showScreen('dashboard-screen');
    
    // Clear keyboard callbacks
    clearKeyboardCallbacks();
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

function handleExportCSV(): void {
  const sessions = getAllSessions();
  
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
      renderDashboard([]);
      showNotification('All data cleared', 'success');
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}


