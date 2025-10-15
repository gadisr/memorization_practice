/**
 * Storage layer for session persistence using localStorage
 */

import { SessionData } from '../types.js';

const STORAGE_PREFIX = 'bld_trainer_';
const SESSION_KEY = `${STORAGE_PREFIX}sessions`;

export function saveSession(session: SessionData): void {
  const sessions = getAllSessions();
  sessions.push(session);
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
}

export function getAllSessions(): SessionData[] {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return [];
  
  try {
    const sessions = JSON.parse(data) as SessionData[];
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error parsing session data:', error);
    return [];
  }
}

export function getSessionsByDateRange(start: string, end: string): SessionData[] {
  const allSessions = getAllSessions();
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  
  return allSessions.filter(session => {
    const sessionDate = new Date(session.date).getTime();
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

export function clearAllSessions(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getStorageSize(): number {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? new Blob([data]).size : 0;
}

export function getStorageWarning(): string | null {
  const size = getStorageSize();
  const maxSize = 5 * 1024 * 1024; // 5MB typical limit
  const percentage = (size / maxSize) * 100;
  
  if (percentage >= 80) {
    return `Storage is ${percentage.toFixed(1)}% full. Consider exporting and clearing old sessions.`;
  }
  return null;
}


