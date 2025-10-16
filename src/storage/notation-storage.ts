/**
 * Storage layer for notation training sessions
 */

import { NotationSessionData, DrillType } from '../types.js';

const STORAGE_PREFIX = 'bld_notation_session_';

export function saveNotationSession(session: NotationSessionData): void {
  const key = `${STORAGE_PREFIX}${session.id}`;
  localStorage.setItem(key, JSON.stringify(session));
}

export function getAllNotationSessions(): NotationSessionData[] {
  const sessions: NotationSessionData[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          sessions.push(JSON.parse(data));
        } catch (e) {
          console.error(`Failed to parse notation session: ${key}`, e);
        }
      }
    }
  }
  
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNotationSessionsByType(drillType: DrillType): NotationSessionData[] {
  return getAllNotationSessions().filter(session => session.drillType === drillType);
}

export function clearAllNotationSessions(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

