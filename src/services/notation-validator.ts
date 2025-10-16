/**
 * Answer validation for notation training
 */

import { loadEdgePieces, loadCornerPieces } from './piece-generator.js';

interface ValidationResult {
  isCorrect: boolean;
  correctAnswer: string;
}

export async function validateEdgeAnswer(colors: [string, string], userAnswer: string): Promise<ValidationResult> {
  const edges = await loadEdgePieces();
  const edge = edges.find(e => 
    e.colors[0] === colors[0] && e.colors[1] === colors[1]
  );
  
  if (!edge) {
    throw new Error(`Edge piece not found for colors: ${colors.join(', ')}`);
  }
  
  const normalizedUserAnswer = userAnswer.trim().toUpperCase();
  const isCorrect = normalizedUserAnswer === edge.notation;
  
  return {
    isCorrect,
    correctAnswer: edge.notation
  };
}

export async function validateCornerAnswer(colors: [string, string, string], userAnswer: string): Promise<ValidationResult> {
  const corners = await loadCornerPieces();
  const corner = corners.find(c => 
    c.colors[0] === colors[0] && 
    c.colors[1] === colors[1] && 
    c.colors[2] === colors[2]
  );
  
  if (!corner) {
    throw new Error(`Corner piece not found for colors: ${colors.join(', ')}`);
  }
  
  const normalizedUserAnswer = userAnswer.trim().toUpperCase();
  const isCorrect = normalizedUserAnswer === corner.notation;
  
  return {
    isCorrect,
    correctAnswer: corner.notation
  };
}

