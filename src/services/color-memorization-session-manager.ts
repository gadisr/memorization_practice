/**
 * Session manager for color memorization training sessions
 */

import { DrillType, ColorMemorizationSessionData, EdgePiece, CornerPiece, SessionData } from '../types.js';
import { generateRandomEdgeSequence, generateRandomCornerSequence } from './piece-generator.js';
import { saveSession } from '../storage/storage-adapter.js';
import { validateLetterRecall } from './recall-validator.js';

let activeSession: ColorMemorizationSessionData | null = null;
let sessionStartTime: number | null = null;

export async function createColorMemorizationSession(
  drillType: DrillType.EDGE_MEMORIZATION | DrillType.CORNER_MEMORIZATION,
  pieceCount: number = 12
): Promise<ColorMemorizationSessionData> {
  const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  let pieces: (EdgePiece | CornerPiece)[];
  
  if (drillType === DrillType.EDGE_MEMORIZATION) {
    const allPieces = await generateRandomEdgeSequence();
    pieces = allPieces.slice(0, Math.min(pieceCount, allPieces.length));
  } else {
    const allPieces = await generateRandomCornerSequence();
    pieces = allPieces.slice(0, Math.min(pieceCount, allPieces.length));
  }
  
  // Extract letters from pieces in order
  const letters = pieces.map(piece => piece.notation);
  
  const session: ColorMemorizationSessionData = {
    id,
    date: new Date().toISOString(),
    drillType,
    pieces,
    pieceCount: pieces.length,
    letters,
    timings: [],
    averageTime: 0,
    recallAccuracy: 0
  };
  
  activeSession = session;
  sessionStartTime = Date.now();
  return session;
}

export function getActiveColorMemorizationSession(): ColorMemorizationSessionData | null {
  return activeSession;
}

export function recordPieceTiming(timing: number): void {
  if (!activeSession) {
    throw new Error('No active color memorization session');
  }
  
  activeSession.timings.push(timing);
}

export async function finalizeColorMemorizationSession(
  userRecall: string,
  quality: number,
  notes?: string
): Promise<ColorMemorizationSessionData> {
  if (!activeSession) {
    throw new Error('No active color memorization session to finalize');
  }
  
  // Calculate average time
  if (activeSession.timings.length > 0) {
    activeSession.averageTime = activeSession.timings.reduce((sum, time) => sum + time, 0) / activeSession.timings.length;
  }
  
  // Calculate total time
  if (sessionStartTime) {
    const totalTimeMs = Date.now() - sessionStartTime;
    activeSession.totalTime = totalTimeMs / 1000; // Convert to seconds
  }
  
  // Validate recall
  const recallValidation = validateLetterRecall(
    userRecall,
    activeSession.letters,
    activeSession.drillType
  );
  
  activeSession.userRecall = userRecall;
  activeSession.recallValidation = recallValidation;
  activeSession.recallAccuracy = recallValidation.accuracy;
  activeSession.vividness = quality;
  
  if (notes) {
    activeSession.notes = notes;
  }
  
  // Save session (convert to SessionData format for storage)
  await saveColorMemorizationSession(activeSession);
  
  const completedSession = { ...activeSession };
  activeSession = null;
  sessionStartTime = null;
  
  return completedSession;
}

export function cancelColorMemorizationSession(): void {
  activeSession = null;
  sessionStartTime = null;
}

async function saveColorMemorizationSession(session: ColorMemorizationSessionData): Promise<void> {
  // Convert ColorMemorizationSessionData to SessionData format for storage
  // We'll store it as a regular session with the drill type
  // Note: For color memorization, "pairs" are actually individual letters
  const sessionData: SessionData = {
    id: session.id,
    date: session.date,
    drillType: session.drillType,
    pairCount: session.pieceCount,
    pairs: session.pieces.map((piece, index) => ({
      pair: piece.notation, // Single letter stored as "pair" for compatibility
      displayOrder: index,
      timestamp: undefined
    })),
    timings: session.timings,
    averageTime: session.averageTime,
    totalTime: session.totalTime,
    recallAccuracy: session.recallAccuracy,
    userRecall: session.userRecall,
    recallValidation: session.recallValidation,
    vividness: session.vividness,
    flow: session.flow,
    notes: session.notes
  };
  
  await saveSession(sessionData);
}

