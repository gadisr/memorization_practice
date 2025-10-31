/**
 * UI rendering functions
 */

import { DrillConfig, QualityMetric, SessionData, DrillType, RecallValidation, NotationSessionData } from '../types.js';
import { getQualityScaleLabel, getQualityScaleMax } from '../services/quality-adapter.js';
import { formatTime } from '../services/timer.js';
import { isOrderRequired } from '../services/recall-validator.js';

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
  const drillInfoBtn = document.getElementById('show-drill-info-btn');
  
  if (desc) {
    desc.textContent = config.description;
  }
  
  // Show/hide drill info button based on whether we have intro text
  if (drillInfoBtn) {
    if (config.introduction && config.howItHelps) {
      drillInfoBtn.classList.remove('hidden');
    } else {
      drillInfoBtn.classList.add('hidden');
    }
  }
  
  if (pairCountInput) {
    pairCountInput.value = config.defaultPairCount.toString();
    
    // Disable pair count for notation drills (always 24 pieces)
    if (config.type === DrillType.EDGE_NOTATION_DRILL || config.type === DrillType.CORNER_NOTATION_DRILL) {
      pairCountInput.disabled = true;
      pairCountInput.title = 'All 24 pieces must be practiced';
    } else {
      pairCountInput.disabled = false;
      pairCountInput.title = '';
    }
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

export function renderRatingScreen(metric: QualityMetric, pairCount: number, drillType: DrillType): void {
  const qualityLabel = document.getElementById('quality-label');
  const qualityRating = document.getElementById('quality-rating');
  const recallHint = document.getElementById('recall-hint');
  const recallTextInput = document.getElementById('recall-text-input') as HTMLTextAreaElement;
  
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
  
  // Set hint text based on drill type
  if (recallHint) {
    const orderRequired = isOrderRequired(drillType);
    recallHint.textContent = orderRequired
      ? "⚠️ Enter pairs in the exact order they were shown"
      : "✓ Order doesn't matter - just recall all pairs";
  }
  
  // Focus on textarea
  if (recallTextInput) {
    recallTextInput.value = '';
    recallTextInput.focus();
  }
}

export function renderRecallFeedback(validation: RecallValidation): void {
  const feedbackContainer = document.getElementById('recall-feedback');
  const statsContainer = document.getElementById('recall-stats');
  const detailsContainer = document.getElementById('recall-details');
  
  if (!feedbackContainer || !statsContainer || !detailsContainer) return;
  
  // Show feedback container
  feedbackContainer.classList.remove('hidden');
  
  // Render stats
  statsContainer.innerHTML = '';
  
  const accuracyDiv = document.createElement('div');
  accuracyDiv.className = 'recall-stat';
  accuracyDiv.innerHTML = `
    <div class="stat-value" style="color: ${validation.accuracy >= 90 ? '#4CAF50' : validation.accuracy >= 70 ? '#FF9800' : '#F44336'}">
      ${validation.accuracy.toFixed(0)}%
    </div>
    <div class="stat-label">Accuracy</div>
  `;
  
  const correctDiv = document.createElement('div');
  correctDiv.className = 'recall-stat';
  correctDiv.innerHTML = `
    <div class="stat-value" style="color: #4CAF50">${validation.correctPairs.length}</div>
    <div class="stat-label">Correct</div>
  `;
  
  const missedDiv = document.createElement('div');
  missedDiv.className = 'recall-stat';
  missedDiv.innerHTML = `
    <div class="stat-value" style="color: #F44336">${validation.missedPairs.length}</div>
    <div class="stat-label">Missed</div>
  `;
  
  statsContainer.appendChild(accuracyDiv);
  statsContainer.appendChild(correctDiv);
  statsContainer.appendChild(missedDiv);
  
  // Render details
  detailsContainer.innerHTML = '';
  
  // Correct pairs
  validation.correctPairs.forEach(pair => {
    const item = document.createElement('div');
    item.className = 'recall-item correct';
    item.innerHTML = `
      <span class="recall-icon">✓</span>
      <span>${pair}</span>
      <span style="margin-left: auto; opacity: 0.7;">Correct</span>
    `;
    detailsContainer.appendChild(item);
  });
  
  // Incorrect pairs (for ordered validation)
  validation.incorrectPairs.forEach(pair => {
    const item = document.createElement('div');
    item.className = 'recall-item incorrect';
    item.innerHTML = `
      <span class="recall-icon">✗</span>
      <span>${pair}</span>
      <span style="margin-left: auto; opacity: 0.7;">Wrong position</span>
    `;
    detailsContainer.appendChild(item);
  });
  
  // Missed pairs
  validation.missedPairs.forEach(pair => {
    const item = document.createElement('div');
    item.className = 'recall-item missed';
    item.innerHTML = `
      <span class="recall-icon">⚠</span>
      <span>${pair}</span>
      <span style="margin-left: auto; opacity: 0.7;">Not recalled</span>
    `;
    detailsContainer.appendChild(item);
  });
  
  // Extra pairs
  validation.extraPairs.forEach(pair => {
    const item = document.createElement('div');
    item.className = 'recall-item extra';
    item.innerHTML = `
      <span class="recall-icon">ℹ</span>
      <span>${pair}</span>
      <span style="margin-left: auto; opacity: 0.7;">Not in session</span>
    `;
    detailsContainer.appendChild(item);
  });
}

export function renderDashboard(sessions: SessionData[], notationSessions: any[] = []): void {
  renderDashboardStats(sessions, notationSessions);
  renderSessionsTable(sessions, notationSessions);
  
  // Initialize charts if Chart.js is available
  if (typeof window !== 'undefined' && (window as any).Chart) {
    import('./chart-renderer.js').then(({ initializeCharts }) => {
      initializeCharts(sessions, notationSessions);
    }).catch(error => {
      console.error('Failed to load chart renderer:', error);
    });
  }
}

function renderDashboardStats(sessions: SessionData[], notationSessions: any[] = []): void {
  const totalSessions = sessions.length + notationSessions.length;
  const totalPairs = sessions.reduce((sum, s) => sum + s.pairCount, 0);
  
  // Calculate average accuracy from both session types
  const sessionAccuracy = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.recallAccuracy, 0) / sessions.length
    : 0;
  const notationAccuracy = notationSessions.length > 0
    ? notationSessions.reduce((sum, s) => sum + s.accuracy, 0) / notationSessions.length
    : 0;
  
  const avgAccuracy = totalSessions > 0
    ? (sessionAccuracy * sessions.length + notationAccuracy * notationSessions.length) / totalSessions
    : 0;
    
  const avgSpeed = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.averageTime, 0) / sessions.length
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

function renderSessionsTable(sessions: SessionData[], notationSessions: any[] = []): void {
  const tbody = document.getElementById('sessions-tbody');
  const noSessionsMsg = document.getElementById('no-sessions-message');
  const table = document.getElementById('sessions-table');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Combine all sessions and sort by date
  const allSessions: any[] = [
    ...sessions.map(s => ({ ...s, isNotation: false })),
    ...notationSessions.map(s => ({ ...s, isNotation: true }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (allSessions.length === 0) {
    if (noSessionsMsg) noSessionsMsg.classList.remove('hidden');
    if (table) table.classList.add('hidden');
    return;
  }
  
  if (noSessionsMsg) noSessionsMsg.classList.add('hidden');
  if (table) table.classList.remove('hidden');
  
  // Show most recent 10 sessions
  const recentSessions = allSessions.slice(0, 10);
  
  recentSessions.forEach(session => {
    const row = document.createElement('tr');
    row.className = 'clickable-row';
    row.style.cursor = 'pointer';
    
    // Store session data for click handler
    (row as any).sessionData = session;
    
    const dateCell = document.createElement('td');
    dateCell.textContent = formatSessionDate(session.date);
    
    const drillCell = document.createElement('td');
    drillCell.textContent = formatDrillName(session.drillType);
    
    const pairsCell = document.createElement('td');
    if (session.isNotation) {
      pairsCell.textContent = session.totalPieces.toString();
    } else {
      pairsCell.textContent = session.pairCount.toString();
    }
    
    const avgTimeCell = document.createElement('td');
    avgTimeCell.textContent = formatTime(session.averageTime);
    
    const totalTimeCell = document.createElement('td');
    let totalTime = session.totalTime;
    
    // Fallback: calculate from timings/attempts if totalTime not available
    if (totalTime === undefined || totalTime === null) {
      if (session.isNotation && session.attempts) {
        totalTime = session.attempts.reduce((sum: number, attempt: any) => sum + attempt.timeSeconds, 0);
      } else if (!session.isNotation && session.timings) {
        totalTime = session.timings.reduce((sum: number, time: number) => sum + time, 0);
      }
    }
    
    if (totalTime !== undefined && totalTime !== null) {
      totalTimeCell.textContent = formatTime(totalTime);
    } else {
      totalTimeCell.textContent = '-';
    }
    
    const accuracyCell = document.createElement('td');
    if (session.isNotation) {
      accuracyCell.textContent = `${session.accuracy.toFixed(0)}%`;
      accuracyCell.className = getAccuracyClass(session.accuracy);
    } else {
      accuracyCell.textContent = `${session.recallAccuracy.toFixed(0)}%`;
      accuracyCell.className = getAccuracyClass(session.recallAccuracy);
    }
    
    const qualityCell = document.createElement('td');
    if (session.isNotation) {
      qualityCell.textContent = '-';
    } else if (session.vividness !== undefined) {
      qualityCell.textContent = `V: ${session.vividness}`;
    } else if (session.flow !== undefined) {
      qualityCell.textContent = `F: ${session.flow}`;
    } else {
      qualityCell.textContent = '-';
    }
    
    row.appendChild(dateCell);
    row.appendChild(drillCell);
    row.appendChild(pairsCell);
    row.appendChild(avgTimeCell);
    row.appendChild(totalTimeCell);
    row.appendChild(accuracyCell);
    row.appendChild(qualityCell);
    
    // Add click handler to open session detail modal
    row.addEventListener('click', () => {
      showSessionDetailModal(session);
    });
    
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
  if (diffDays < 7) return `${diffDays} days ago`;
  
  // Include year if different from current year
  const isSameYear = date.getFullYear() === now.getFullYear();
  if (isSameYear) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDrillName(type: DrillType): string {
  const names: Record<DrillType, string> = {
    [DrillType.FLASH_PAIRS]: 'Flash Pairs',
    [DrillType.TWO_PAIR_FUSION]: '2-Pair Fusion',
    [DrillType.THREE_PAIR_CHAIN]: '3-Pair Chain',
    [DrillType.EIGHT_PAIR_CHAIN]: '8-Pair Chain',
    [DrillType.JOURNEY_MODE]: 'Journey Mode',
    [DrillType.FULL_CUBE_SIMULATION]: 'Full Cube',
    [DrillType.EDGE_NOTATION_DRILL]: 'Edge Notation',
    [DrillType.CORNER_NOTATION_DRILL]: 'Corner Notation',
    [DrillType.CORNER_TRACING_DRILL]: 'Corner Tracing',
    [DrillType.EDGE_TRACING_DRILL]: 'Edge Tracing'
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

export function showModal(title: string, content: string): void {
  const modal = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalTitle || !modalBody) return;
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.remove('hidden');
}

export function hideModal(): void {
  const modal = document.getElementById('info-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

export function showSessionDetailModal(session: any): void {
  const modal = document.getElementById('session-detail-modal');
  if (modal) {
    modal.classList.remove('hidden');
    renderSessionDetail(session, session.isNotation);
  }
}

export function hideSessionDetailModal(): void {
  const modal = document.getElementById('session-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

export function showTechniqueIntro(introHtml: string): void {
  showModal('About BLD Memorization Technique', introHtml);
}

export function showDrillInfo(config: DrillConfig): void {
  const drillName = formatDrillName(config.type);
  const content = `
    <div class="info-section">
      <div class="info-section-title">What is ${drillName}?</div>
      <div class="info-section-content">
        <p>${config.introduction || config.description}</p>
      </div>
    </div>
    
    <div class="info-section">
      <div class="info-section-title">How It Helps Your BLD Solving</div>
      <div class="info-section-content">
        <p>${config.howItHelps || 'This drill helps improve your memorization skills for blindfold cubing.'}</p>
      </div>
    </div>
  `;
  
  showModal(`${drillName} - Drill Information`, content);
}

export function renderSessionDetail(session: SessionData | NotationSessionData, isNotation: boolean = false): void {
  const titleEl = document.getElementById('session-detail-title');
  const bodyEl = document.getElementById('session-detail-body');
  
  if (!titleEl || !bodyEl) return;
  
  if (isNotation) {
    const notationSession = session as NotationSessionData;
    const drillTypeName = notationSession.drillType === DrillType.EDGE_NOTATION_DRILL ? 'Edge Notation' : 'Corner Notation';
    titleEl.textContent = `Session Details - ${drillTypeName}`;
    
    const totalTime = notationSession.attempts.reduce((sum, a) => sum + a.timeSeconds, 0);
    
    bodyEl.innerHTML = `
      <div class="session-detail-section">
        <h3>Summary</h3>
        <div class="result-stats">
          <div class="stat">
            <span class="stat-label">Date:</span>
            <span class="stat-value">${formatSessionDate(notationSession.date)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Accuracy:</span>
            <span class="stat-value">${notationSession.correctCount} / ${notationSession.totalPieces} (${notationSession.accuracy.toFixed(1)}%)</span>
          </div>
          <div class="stat">
            <span class="stat-label">Average Time:</span>
            <span class="stat-value">${notationSession.averageTime.toFixed(2)}s per piece</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Time:</span>
            <span class="stat-value">${totalTime.toFixed(2)}s</span>
          </div>
        </div>
      </div>
      
      ${notationSession.notes ? `
        <div class="session-detail-section">
          <h3>Notes</h3>
          <p>${notationSession.notes}</p>
        </div>
      ` : ''}
      
      <div class="session-detail-section">
        <h3>Attempts Breakdown</h3>
        <div class="attempts-list">
          ${notationSession.attempts.map((attempt, index) => `
            <div class="attempt-item ${attempt.isCorrect ? 'correct' : 'incorrect'}">
              <span class="attempt-number">#${index + 1}</span>
              <span class="attempt-colors">${attempt.pieceColors.join(' - ')}</span>
              <span class="attempt-answer">
                Your answer: <strong>${attempt.userAnswer || '(no answer)'}</strong>
                ${!attempt.isCorrect ? `<br>Correct: <strong>${attempt.correctAnswer}</strong>` : ''}
              </span>
              <span class="attempt-time">${attempt.timeSeconds.toFixed(2)}s</span>
              <span class="attempt-icon">${attempt.isCorrect ? '✓' : '✗'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    const regularSession = session as SessionData;
    titleEl.textContent = `Session Details - ${formatDrillName(regularSession.drillType)}`;
    
    const hasRecallValidation = regularSession.recallValidation !== undefined;
    const accuracyDisplay = hasRecallValidation 
      ? regularSession.recallValidation!.accuracy.toFixed(0) + '%'
      : regularSession.recallAccuracy.toFixed(0) + '%';
    
    bodyEl.innerHTML = `
      <div class="session-detail-section">
        <h3>Summary</h3>
        <div class="result-stats">
          <div class="stat">
            <span class="stat-label">Date:</span>
            <span class="stat-value">${formatSessionDate(regularSession.date)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Pairs:</span>
            <span class="stat-value">${regularSession.pairCount}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Accuracy:</span>
            <span class="stat-value">${accuracyDisplay}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Avg Time/Pair:</span>
            <span class="stat-value">${formatTime(regularSession.averageTime)}</span>
          </div>
          ${regularSession.totalTime ? `
            <div class="stat">
              <span class="stat-label">Total Time:</span>
              <span class="stat-value">${formatTime(regularSession.totalTime)}</span>
            </div>
          ` : ''}
          ${regularSession.vividness !== undefined ? `
            <div class="stat">
              <span class="stat-label">Vividness:</span>
              <span class="stat-value">${regularSession.vividness}</span>
            </div>
          ` : ''}
          ${regularSession.flow !== undefined ? `
            <div class="stat">
              <span class="stat-label">Flow:</span>
              <span class="stat-value">${regularSession.flow}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      ${hasRecallValidation ? `
        <div class="session-detail-section">
          <h3>Recall Breakdown</h3>
          <div class="recall-stats">
            <div class="recall-stat">
              <div class="stat-value" style="color: #4CAF50">${regularSession.recallValidation!.correctPairs.length}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="recall-stat">
              <div class="stat-value" style="color: #F44336">${regularSession.recallValidation!.missedPairs.length}</div>
              <div class="stat-label">Missed</div>
            </div>
            ${regularSession.recallValidation!.incorrectPairs.length > 0 ? `
              <div class="recall-stat">
                <div class="stat-value" style="color: #FF9800">${regularSession.recallValidation!.incorrectPairs.length}</div>
                <div class="stat-label">Wrong Position</div>
              </div>
            ` : ''}
            ${regularSession.recallValidation!.extraPairs.length > 0 ? `
              <div class="recall-stat">
                <div class="stat-value" style="color: #9E9E9E">${regularSession.recallValidation!.extraPairs.length}</div>
                <div class="stat-label">Extra</div>
              </div>
            ` : ''}
          </div>
          
          <div class="recall-details">
            ${regularSession.recallValidation!.correctPairs.map(pair => `
              <div class="recall-item correct">
                <span class="recall-icon">✓</span>
                <span>${pair}</span>
              </div>
            `).join('')}
            ${regularSession.recallValidation!.incorrectPairs.map(pair => `
              <div class="recall-item incorrect">
                <span class="recall-icon">✗</span>
                <span>${pair}</span>
                <span style="margin-left: auto; opacity: 0.7;">Wrong position</span>
              </div>
            `).join('')}
            ${regularSession.recallValidation!.missedPairs.map(pair => `
              <div class="recall-item missed">
                <span class="recall-icon">⚠</span>
                <span>${pair}</span>
                <span style="margin-left: auto; opacity: 0.7;">Not recalled</span>
              </div>
            `).join('')}
            ${regularSession.recallValidation!.extraPairs.map(pair => `
              <div class="recall-item extra">
                <span class="recall-icon">ℹ</span>
                <span>${pair}</span>
                <span style="margin-left: auto; opacity: 0.7;">Not in session</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${regularSession.notes ? `
        <div class="session-detail-section">
          <h3>Notes</h3>
          <p>${regularSession.notes}</p>
        </div>
      ` : ''}
    `;
  }
}
