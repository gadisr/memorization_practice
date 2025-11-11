/**
 * UI renderer for notation training screens
 */

import { NotationSessionData, DrillType } from '../types.js';
import { formatDrillName, getNotationDrillShortName } from '../utils/drill-name-formatter.js';

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
  if (!container) {
    console.error('renderEdgeSquares: color-squares-container not found');
    return;
  }
  
  if (!colors || colors.length !== 2) {
    console.error('renderEdgeSquares: invalid colors', colors);
    return;
  }
  
  // Clear container and set the class for edge layout
  container.innerHTML = '';
  container.className = 'color-squares-edge';
  container.style.display = 'flex'; // Ensure container is visible
  
  const topSquare = document.createElement('div');
  topSquare.className = 'color-square color-main';
  const topColor = cubeColors[colors[0].toLowerCase()];
  if (!topColor) {
    console.warn('renderEdgeSquares: unknown color', colors[0], 'available colors:', Object.keys(cubeColors));
  }
  topSquare.style.backgroundColor = topColor || '#CCC';
  topSquare.style.width = '100px';
  topSquare.style.height = '100px';
  topSquare.style.border = '2px solid #333';
  topSquare.style.borderRadius = '4px';
  
  const bottomSquare = document.createElement('div');
  bottomSquare.className = 'color-square color-additional';
  const bottomColor = cubeColors[colors[1].toLowerCase()];
  if (!bottomColor) {
    console.warn('renderEdgeSquares: unknown color', colors[1], 'available colors:', Object.keys(cubeColors));
  }
  bottomSquare.style.backgroundColor = bottomColor || '#CCC';
  bottomSquare.style.width = '100px';
  bottomSquare.style.height = '100px';
  bottomSquare.style.border = '2px solid #333';
  bottomSquare.style.borderRadius = '4px';
  
  container.appendChild(topSquare);
  container.appendChild(bottomSquare);
  
  console.log('renderEdgeSquares: Rendered squares with colors', colors, 'container children:', container.children.length);
}

export function renderCornerSquares(colors: [string, string, string]): void {
  const container = document.getElementById('color-squares-container');
  if (!container) {
    console.error('renderCornerSquares: color-squares-container not found');
    return;
  }
  
  if (!colors || colors.length !== 3) {
    console.error('renderCornerSquares: invalid colors', colors);
    return;
  }
  
  // Clear container and set the class for corner layout
  container.innerHTML = '';
  container.className = 'color-squares-corner';
  container.style.display = 'flex'; // Ensure container is visible
  
  const topSquare = document.createElement('div');
  topSquare.className = 'color-square color-main';
  const topColor = cubeColors[colors[0].toLowerCase()];
  if (!topColor) {
    console.warn('renderCornerSquares: unknown color', colors[0], 'available colors:', Object.keys(cubeColors));
  }
  topSquare.style.backgroundColor = topColor || '#CCC';
  topSquare.style.width = '80px';
  topSquare.style.height = '80px';
  topSquare.style.border = '2px solid #333';
  topSquare.style.borderRadius = '4px';
  
  const bottomRow = document.createElement('div');
  bottomRow.className = 'corner-bottom-row';
  bottomRow.style.display = 'flex';
  bottomRow.style.flexDirection = 'row';
  bottomRow.style.gap = '8px';
  
  const bottomLeftSquare = document.createElement('div');
  bottomLeftSquare.className = 'color-square';
  const leftColor = cubeColors[colors[1].toLowerCase()];
  if (!leftColor) {
    console.warn('renderCornerSquares: unknown color', colors[1], 'available colors:', Object.keys(cubeColors));
  }
  bottomLeftSquare.style.backgroundColor = leftColor || '#CCC';
  bottomLeftSquare.style.width = '80px';
  bottomLeftSquare.style.height = '80px';
  bottomLeftSquare.style.border = '2px solid #333';
  bottomLeftSquare.style.borderRadius = '4px';
  
  const bottomRightSquare = document.createElement('div');
  bottomRightSquare.className = 'color-square';
  const rightColor = cubeColors[colors[2].toLowerCase()];
  if (!rightColor) {
    console.warn('renderCornerSquares: unknown color', colors[2], 'available colors:', Object.keys(cubeColors));
  }
  bottomRightSquare.style.backgroundColor = rightColor || '#CCC';
  bottomRightSquare.style.width = '80px';
  bottomRightSquare.style.height = '80px';
  bottomRightSquare.style.border = '2px solid #333';
  bottomRightSquare.style.borderRadius = '4px';
  
  bottomRow.appendChild(bottomLeftSquare);
  bottomRow.appendChild(bottomRightSquare);
  
  container.appendChild(topSquare);
  container.appendChild(bottomRow);
  
  console.log('renderCornerSquares: Rendered squares with colors', colors, 'container children:', container.children.length);
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
  
  const drillTypeName = formatDrillName(session.drillType);
  
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
          const drillType = getNotationDrillShortName(session.drillType);
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

