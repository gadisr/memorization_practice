/**
 * UI renderer for notation training screens
 */

import { NotationSessionData, DrillType } from '../types.js';

const cubeColors: Record<string, string> = {
  white: '#FFFFFF',
  yellow: '#FFD700',
  red: '#E53935',
  orange: '#FF6F00',
  green: '#43A047',
  blue: '#1E88E5'
};

export function renderEdgeSquares(colors: [string, string]): void {
  const container = document.getElementById('color-squares-container');
  if (!container) return;
  
  container.innerHTML = '';
  container.className = 'color-squares-edge';
  
  const topSquare = document.createElement('div');
  topSquare.className = 'color-square color-main';
  topSquare.style.backgroundColor = cubeColors[colors[0]] || '#CCC';
  
  const bottomSquare = document.createElement('div');
  bottomSquare.className = 'color-square color-additional';
  bottomSquare.style.backgroundColor = cubeColors[colors[1]] || '#CCC';
  
  container.appendChild(topSquare);
  container.appendChild(bottomSquare);
}

export function renderCornerSquares(colors: [string, string, string]): void {
  const container = document.getElementById('color-squares-container');
  if (!container) return;
  
  container.innerHTML = '';
  container.className = 'color-squares-corner';
  
  const topSquare = document.createElement('div');
  topSquare.className = 'color-square color-main';
  topSquare.style.backgroundColor = cubeColors[colors[0]] || '#CCC';
  
  const bottomRow = document.createElement('div');
  bottomRow.className = 'corner-bottom-row';
  
  const bottomLeftSquare = document.createElement('div');
  bottomLeftSquare.className = 'color-square';
  bottomLeftSquare.style.backgroundColor = cubeColors[colors[1]] || '#CCC';
  
  const bottomRightSquare = document.createElement('div');
  bottomRightSquare.className = 'color-square';
  bottomRightSquare.style.backgroundColor = cubeColors[colors[2]] || '#CCC';
  
  bottomRow.appendChild(bottomLeftSquare);
  bottomRow.appendChild(bottomRightSquare);
  
  container.appendChild(topSquare);
  container.appendChild(bottomRow);
}

export function clearColorSquares(): void {
  const container = document.getElementById('color-squares-container');
  if (container) {
    container.innerHTML = '';
  }
}

export function renderNotationResults(session: NotationSessionData): void {
  const resultsContainer = document.getElementById('notation-results-container');
  if (!resultsContainer) return;
  
  const drillTypeName = session.drillType === DrillType.EDGE_NOTATION_DRILL ? 'Edge Notation' : 'Corner Notation';
  
  const totalTime = session.attempts.reduce((sum, a) => sum + a.timeSeconds, 0);
  
  resultsContainer.innerHTML = `
    <div class="results-summary">
      <h3>${drillTypeName} Results</h3>
      <div class="result-stats">
        <div class="stat">
          <span class="stat-label">Accuracy:</span>
          <span class="stat-value">${session.correctCount} / ${session.totalPieces} (${session.accuracy.toFixed(1)}%)</span>
        </div>
        <div class="stat">
          <span class="stat-label">Average Time:</span>
          <span class="stat-value">${session.averageTime.toFixed(2)}s per piece</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Time:</span>
          <span class="stat-value">${totalTime.toFixed(2)}s</span>
        </div>
      </div>
    </div>
    
    <div class="attempts-breakdown">
      <h4>Attempts Details</h4>
      <div class="attempts-list">
        ${session.attempts.map((attempt, index) => `
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
}

export function renderNotationSessionsTable(sessions: NotationSessionData[]): void {
  const tableContainer = document.getElementById('notation-sessions-table');
  if (!tableContainer) return;
  
  if (sessions.length === 0) {
    tableContainer.innerHTML = '<p>No notation training sessions yet.</p>';
    return;
  }
  
  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Accuracy</th>
          <th>Avg Time</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${sessions.map(session => {
          const date = new Date(session.date).toLocaleDateString();
          const drillType = session.drillType === DrillType.EDGE_NOTATION_DRILL ? 'Edge' : 'Corner';
          return `
            <tr>
              <td>${date}</td>
              <td>${drillType}</td>
              <td>${session.correctCount}/${session.totalPieces} (${session.accuracy.toFixed(1)}%)</td>
              <td>${session.averageTime.toFixed(2)}s</td>
              <td>${session.notes || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

