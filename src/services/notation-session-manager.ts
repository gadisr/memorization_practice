/**
 * Session manager for notation training sessions
 */

import { DrillType, NotationSessionData, NotationAttempt, EdgePiece, CornerPiece } from '../types.js';
import { generateRandomEdgeSequence, generateRandomCornerSequence } from './piece-generator.js';
import { saveNotationSession } from '../storage/storage-adapter.js';

let activeSession: NotationSessionData | null = null;
let activePieces: (EdgePiece | CornerPiece)[] = [];

export async function createNotationSession(drillType: DrillType.EDGE_NOTATION_DRILL | DrillType.CORNER_NOTATION_DRILL): Promise<NotationSessionData> {
  const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (drillType === DrillType.EDGE_NOTATION_DRILL) {
    activePieces = await generateRandomEdgeSequence();
  } else {
    activePieces = await generateRandomCornerSequence();
  }
  
  const session: NotationSessionData = {
    id,
    date: new Date().toISOString(),
    drillType,
    attempts: [],
    totalPieces: activePieces.length,
    correctCount: 0,
    accuracy: 0,
    averageTime: 0
  };
  
  activeSession = session;
  return session;
}

export function getActiveNotationSession(): NotationSessionData | null {
  return activeSession;
}

export function getActivePieces(): (EdgePiece | CornerPiece)[] {
  return activePieces;
}

export function getCurrentPiece(index: number): (EdgePiece | CornerPiece) | null {
  if (index >= 0 && index < activePieces.length) {
    return activePieces[index];
  }
  return null;
}

export function recordAttempt(attempt: NotationAttempt): void {
  if (!activeSession) {
    throw new Error('No active notation session');
  }
  
  activeSession.attempts.push(attempt);
  
  if (attempt.isCorrect) {
    activeSession.correctCount++;
  }
}

export async function finalizeNotationSession(notes?: string): Promise<NotationSessionData> {
  if (!activeSession) {
    throw new Error('No active notation session to finalize');
  }
  
  const totalAttempts = activeSession.attempts.length;
  
  if (totalAttempts > 0) {
    activeSession.accuracy = (activeSession.correctCount / activeSession.totalPieces) * 100;
    
    const totalTime = activeSession.attempts.reduce((sum, attempt) => sum + attempt.timeSeconds, 0);
    activeSession.averageTime = totalTime / totalAttempts;
  }
  
  if (notes) {
    activeSession.notes = notes;
  }
  
  await saveNotationSession(activeSession);
  
  const completedSession = { ...activeSession };
  activeSession = null;
  activePieces = [];
  
  return completedSession;
}

export function cancelNotationSession(): void {
  activeSession = null;
  activePieces = [];
}

