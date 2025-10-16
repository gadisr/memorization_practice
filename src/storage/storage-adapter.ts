/**
 * Unified storage adapter that uses API when authenticated, localStorage when not
 */

import { SessionData, NotationSessionData } from '../types.js';
import { getAuthState, waitForAuthInit } from '../services/auth-service.js';
import * as apiClient from '../services/api-client.js';
import * as localSessionStorage from './session-storage.js';
import * as localNotationStorage from './notation-storage.js';

export async function saveSession(session: SessionData): Promise<void> {
  const { isAuthenticated } = getAuthState();
  
  if (isAuthenticated) {
    await apiClient.createSession(session);
  } else {
    localSessionStorage.saveSession(session);
  }
}

export async function getAllSessions(): Promise<SessionData[]> {
  const { isAuthenticated } = await waitForAuthInit();
  console.log('getAllSessions - isAuthenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    console.log('Loading sessions from API...');
    return await apiClient.getUserSessions();
  } else {
    console.log('Loading sessions from localStorage...');
    return localSessionStorage.getAllSessions();
  }
}

export async function saveNotationSession(session: NotationSessionData): Promise<void> {
  const { isAuthenticated } = getAuthState();
  
  if (isAuthenticated) {
    await apiClient.createNotationSession(session);
  } else {
    localNotationStorage.saveNotationSession(session);
  }
}

export async function getAllNotationSessions(): Promise<NotationSessionData[]> {
  const { isAuthenticated } = await waitForAuthInit();
  console.log('getAllNotationSessions - isAuthenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    console.log('Loading notation sessions from API...');
    return await apiClient.getUserNotationSessions();
  } else {
    console.log('Loading notation sessions from localStorage...');
    return localNotationStorage.getAllNotationSessions();
  }
}

/**
 * Migrate localStorage data to API when user authenticates
 */
export async function migrateLocalDataToAPI(): Promise<void> {
  const localSessions = localSessionStorage.getAllSessions();
  const localNotationSessions = localNotationStorage.getAllNotationSessions();
  
  // Skip if no local data
  if (localSessions.length === 0 && localNotationSessions.length === 0) {
    return;
  }
  
  console.log(`Migrating ${localSessions.length} sessions and ${localNotationSessions.length} notation sessions...`);
  
  // Migrate regular sessions
  for (const session of localSessions) {
    try {
      await apiClient.createSession(session);
    } catch (error) {
      console.error('Failed to migrate session:', session.id, error);
    }
  }
  
  // Migrate notation sessions
  for (const session of localNotationSessions) {
    try {
      await apiClient.createNotationSession(session);
    } catch (error) {
      console.error('Failed to migrate notation session:', session.id, error);
    }
  }
  
  // Clear local storage after successful migration
  localSessionStorage.clearAllSessions();
  localNotationStorage.clearAllNotationSessions();
  
  console.log('Migration complete!');
}

