/**
 * UI rendering functions
 */

import { DrillConfig, QualityMetric, SessionData, DrillType } from '../types.js';
import { getQualityScaleLabel, getQualityScaleMax } from '../services/quality-adapter.js';
import { formatTime } from '../services/timer.js';

export function showScreen(screenId: string): void {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.add('hidden'));
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }
}

export function renderSetupScreen(configs: DrillConfig[]): void {
  const select = document.getElementById('drill-select') as HTMLSelectElement;
  if (!select) return;
  
  // Clear existing options except the first placeholder
  select.innerHTML = '<option value="">Select a drill...</option>';
  
  // Add drill options
  configs.forEach(config => {
    const option = document.createElement('option');
    option.value = config.type;
    option.textContent = formatDrillName(config.type);
    select.appendChild(option);
  });
}

export function updateDrillDescription(config: DrillConfig): void {
  const desc = document.getElementById('drill-description');
  const pairCountInput = document.getElementById('pair-count') as HTMLInputElement;
  
  if (desc) {
    desc.textContent = config.description;
  }
  
  if (pairCountInput) {
    pairCountInput.value = config.defaultPairCount.toString();
  }
}

export function renderSessionScreen(pair: string, currentIndex: number, total: number): void {
  const pairDisplay = document.getElementById('current-pair');
  const counter = document.getElementById('pair-counter');
  
  if (pairDisplay) {
    pairDisplay.textContent = pair;
  }
  
  if (counter) {
    counter.textContent = `Pair ${currentIndex + 1} of ${total}`;
  }
}

export function renderRatingScreen(metric: QualityMetric, pairCount: number): void {
  const qualityLabel = document.getElementById('quality-label');
  const qualityRating = document.getElementById('quality-rating');
  const recallTotal = document.getElementById('recall-total');
  const recallInput = document.getElementById('recall-input') as HTMLInputElement;
  
  if (qualityLabel) {
    const labelText = metric === QualityMetric.VIVIDNESS 
      ? 'Vividness Rating (1-5)' 
      : 'Flow Rating (1-3)';
    qualityLabel.textContent = labelText;
  }
  
  if (qualityRating) {
    const maxRating = getQualityScaleMax(metric);
    qualityRating.innerHTML = '';
    
    for (let i = 1; i <= maxRating; i++) {
      const label = document.createElement('label');
      label.className = 'rating-option';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'quality';
      radio.value = i.toString();
      radio.id = `quality-${i}`;
      
      const text = document.createElement('span');
      text.textContent = `${i} - ${getQualityScaleLabel(metric, i)}`;
      
      label.appendChild(radio);
      label.appendChild(text);
      qualityRating.appendChild(label);
    }
  }
  
  if (recallTotal) {
    recallTotal.textContent = `out of ${pairCount}`;
  }
  
  if (recallInput) {
    recallInput.max = pairCount.toString();
    recallInput.value = pairCount.toString(); // Default to perfect recall
  }
}

export function renderDashboard(sessions: SessionData[]): void {
  renderDashboardStats(sessions);
  renderSessionsTable(sessions);
}

function renderDashboardStats(sessions: SessionData[]): void {
  const totalSessions = sessions.length;
  const totalPairs = sessions.reduce((sum, s) => sum + s.pairCount, 0);
  const avgAccuracy = totalSessions > 0
    ? sessions.reduce((sum, s) => sum + s.recallAccuracy, 0) / totalSessions
    : 0;
  const avgSpeed = totalSessions > 0
    ? sessions.reduce((sum, s) => sum + s.averageTime, 0) / totalSessions
    : 0;
  
  const totalSessionsEl = document.getElementById('total-sessions');
  const totalPairsEl = document.getElementById('total-pairs');
  const avgAccuracyEl = document.getElementById('avg-accuracy');
  const avgSpeedEl = document.getElementById('avg-speed');
  
  if (totalSessionsEl) totalSessionsEl.textContent = totalSessions.toString();
  if (totalPairsEl) totalPairsEl.textContent = totalPairs.toString();
  if (avgAccuracyEl) avgAccuracyEl.textContent = `${avgAccuracy.toFixed(1)}%`;
  if (avgSpeedEl) avgSpeedEl.textContent = formatTime(avgSpeed);
}

function renderSessionsTable(sessions: SessionData[]): void {
  const tbody = document.getElementById('sessions-tbody');
  const noSessionsMsg = document.getElementById('no-sessions-message');
  const table = document.getElementById('sessions-table');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (sessions.length === 0) {
    if (noSessionsMsg) noSessionsMsg.classList.remove('hidden');
    if (table) table.classList.add('hidden');
    return;
  }
  
  if (noSessionsMsg) noSessionsMsg.classList.add('hidden');
  if (table) table.classList.remove('hidden');
  
  // Show most recent 10 sessions
  const recentSessions = sessions.slice(0, 10);
  
  recentSessions.forEach(session => {
    const row = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = formatSessionDate(session.date);
    
    const drillCell = document.createElement('td');
    drillCell.textContent = formatDrillName(session.drillType);
    
    const pairsCell = document.createElement('td');
    pairsCell.textContent = session.pairCount.toString();
    
    const timeCell = document.createElement('td');
    timeCell.textContent = formatTime(session.averageTime);
    
    const accuracyCell = document.createElement('td');
    accuracyCell.textContent = `${session.recallAccuracy.toFixed(0)}%`;
    accuracyCell.className = getAccuracyClass(session.recallAccuracy);
    
    const qualityCell = document.createElement('td');
    if (session.vividness !== undefined) {
      qualityCell.textContent = `V: ${session.vividness}`;
    } else if (session.flow !== undefined) {
      qualityCell.textContent = `F: ${session.flow}`;
    } else {
      qualityCell.textContent = '-';
    }
    
    row.appendChild(dateCell);
    row.appendChild(drillCell);
    row.appendChild(pairsCell);
    row.appendChild(timeCell);
    row.appendChild(accuracyCell);
    row.appendChild(qualityCell);
    
    tbody.appendChild(row);
  });
}

export function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  const notification = document.getElementById('notification');
  const messageEl = document.getElementById('notification-message');
  
  if (!notification || !messageEl) return;
  
  messageEl.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function formatSessionDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDrillName(type: DrillType): string {
  const names: Record<DrillType, string> = {
    [DrillType.FLASH_PAIRS]: 'Flash Pairs',
    [DrillType.TWO_PAIR_FUSION]: '2-Pair Fusion',
    [DrillType.THREE_PAIR_CHAIN]: '3-Pair Chain',
    [DrillType.EIGHT_PAIR_CHAIN]: '8-Pair Chain',
    [DrillType.JOURNEY_MODE]: 'Journey Mode',
    [DrillType.FULL_CUBE_SIMULATION]: 'Full Cube'
  };
  return names[type] || type;
}

function getAccuracyClass(accuracy: number): string {
  if (accuracy >= 90) return 'accuracy-high';
  if (accuracy >= 70) return 'accuracy-medium';
  return 'accuracy-low';
}

export function showPairCountWarning(warning: string): void {
  const warningEl = document.getElementById('pair-count-warning');
  if (warningEl) {
    warningEl.textContent = warning;
  }
}

export function clearPairCountWarning(): void {
  const warningEl = document.getElementById('pair-count-warning');
  if (warningEl) {
    warningEl.textContent = '';
  }
}


