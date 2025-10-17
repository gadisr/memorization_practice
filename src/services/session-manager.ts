/**
 * Session manager for handling active training sessions
 */

import { DrillType, SessionData } from '../types.js';
import { getDrillConfig } from '../config/drill-config.js';
import { generateRandomPairs } from './pair-generator.js';
import { calculateAverage } from './timer.js';
import { saveSession } from '../storage/storage-adapter.js';
import { getQualityMetric } from './quality-adapter.js';
import { validateRecall } from './recall-validator.js';

let activeSession: SessionData | null = null;
let sessionStartTime: number | null = null;

export async function createSession(
  drillType: DrillType,
  pairCount?: number
): Promise<SessionData> {
  const config = getDrillConfig(drillType);
  if (!config) {
    throw new Error(`Invalid drill type: ${drillType}`);
  }
  
  const count = pairCount ?? config.defaultPairCount;
  const pairs = await generateRandomPairs(count);
  
  const session: SessionData = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    drillType,
    pairCount: count,
    pairs,
    timings: [],
    averageTime: 0,
    recallAccuracy: 0
  };
  
  activeSession = session;
  sessionStartTime = Date.now();
  return session;
}

export function getActiveSession(): SessionData | null {
  return activeSession;
}

export function recordPairTiming(timing: number): void {
  if (!activeSession) {
    throw new Error('No active session');
  }
  activeSession.timings.push(timing);
}

export async function finalizeSession(
  userRecall: string,
  quality: number,
  notes?: string
): Promise<SessionData> {
  if (!activeSession) {
    throw new Error('No active session to finalize');
  }
  
  const config = getDrillConfig(activeSession.drillType);
  if (!config) {
    throw new Error('Invalid drill configuration');
  }
  
  // Calculate metrics
  activeSession.averageTime = calculateAverage(activeSession.timings);
  
  // Validate recall input
  const recallValidation = validateRecall(
    userRecall,
    activeSession.pairs,
    activeSession.drillType
  );
  
  activeSession.userRecall = userRecall;
  activeSession.recallValidation = recallValidation;
  activeSession.recallAccuracy = recallValidation.accuracy;
  
  // Calculate total session time
  if (sessionStartTime) {
    const totalTimeMs = Date.now() - sessionStartTime;
    activeSession.totalTime = totalTimeMs / 1000; // Convert to seconds
  }
  
  // Set quality metric based on drill type
  const metric = getQualityMetric(activeSession.drillType);
  if (metric === 'VIVIDNESS') {
    activeSession.vividness = quality;
  } else {
    activeSession.flow = quality;
  }
  
  if (notes) {
    activeSession.notes = notes;
  }
  
  // Save to storage
  await saveSession(activeSession);
  
  const completedSession = { ...activeSession };
  activeSession = null;
  sessionStartTime = null;
  
  return completedSession;
}

export function cancelSession(): void {
  activeSession = null;
  sessionStartTime = null;
}


