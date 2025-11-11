/**
 * UI renderer for color memorization sessions
 */

import { ColorMemorizationSessionData, EdgePiece, CornerPiece } from '../types.js';
import { renderEdgeSquares, renderCornerSquares } from './notation-renderer.js';
import { getQualityScaleLabel } from '../services/quality-adapter.js';
import { QualityMetric } from '../types.js';

export function renderColorMemorizationSessionScreen(
  piece: EdgePiece | CornerPiece,
  currentIndex: number,
  total: number,
  drillType: string
): void {
  const sessionContainer = document.getElementById('session-screen');
  if (!sessionContainer) return;
  
  const isEdge = drillType === 'EDGE_MEMORIZATION';
  
  sessionContainer.innerHTML = `
    <div class="session-container">
      <div class="session-header">
        <h2>${isEdge ? 'Edge' : 'Corner'} Memorization</h2>
        <div class="session-progress">
          Piece ${currentIndex + 1} of ${total}
        </div>
      </div>
      
      <div class="session-content">
        <div class="piece-display" id="color-squares-container">
          <!-- Color squares will be rendered here -->
        </div>
        
        <div class="session-instructions">
          <p>Memorize the colors and convert them to a letter in your mind.</p>
          <p>Press <strong>Space</strong> or click <strong>Next</strong> to continue.</p>
        </div>
      </div>
      
      <div class="session-actions">
        <button id="prev-btn" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
          Previous
        </button>
        <button id="next-btn" class="btn btn-primary">
          ${currentIndex === total - 1 ? 'Finish' : 'Next'}
        </button>
        <button id="cancel-btn" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  `;
  
  // Render the color squares
  const container = document.getElementById('color-squares-container');
  if (container && isEdge) {
    renderEdgeSquares((piece as EdgePiece).colors);
  } else if (container) {
    renderCornerSquares((piece as CornerPiece).colors);
  }
}

export function renderColorMemorizationRatingScreen(
  session: ColorMemorizationSessionData,
  metric: string
): void {
  const ratingContainer = document.getElementById('rating-screen');
  if (!ratingContainer) return;
  
  const isEdge = session.drillType === 'EDGE_MEMORIZATION';
  const maxRating = metric === 'VIVIDNESS' ? 5 : 3;
  
  // Use the same structure as the regular rating screen for consistency
  const header = ratingContainer.querySelector('header');
  const qualityLabel = document.getElementById('quality-label');
  const qualityRating = document.getElementById('quality-rating');
  const recallHint = document.getElementById('recall-hint');
  const recallTextInput = document.getElementById('recall-text-input') as HTMLTextAreaElement;
  const notesInput = document.getElementById('notes-input') as HTMLTextAreaElement;
  
  // Update header
  if (header) {
    const subtitle = header.querySelector('.subtitle');
    if (subtitle) {
      subtitle.textContent = `${isEdge ? 'Edge' : 'Corner'} Memorization - ${session.pieceCount} pieces`;
    }
  }
  
  // Update quality label
  if (qualityLabel) {
    const labelText = metric === 'VIVIDNESS' 
      ? 'Vividness Rating (1-5)' 
      : 'Flow Rating (1-3)';
    qualityLabel.textContent = labelText;
  }
  
  // Update quality rating options
  if (qualityRating) {
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
      const qualityMetric = metric === 'VIVIDNESS' ? QualityMetric.VIVIDNESS : QualityMetric.FLOW;
      text.textContent = getQualityScaleLabel(qualityMetric, i);
      
      label.appendChild(radio);
      label.appendChild(text);
      qualityRating.appendChild(label);
    }
  }
  
  // Update recall hint
  if (recallHint) {
    recallHint.textContent = "⚠️ Enter letters in the exact order they were shown";
  }
  
  // Update recall input placeholder
  if (recallTextInput) {
    recallTextInput.value = '';
    recallTextInput.placeholder = 'Enter letters in order (e.g., "a b c d" or "abcd")';
    recallTextInput.focus();
  }
  
  // Clear notes
  if (notesInput) {
    notesInput.value = '';
  }
}

