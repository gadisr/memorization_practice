/**
 * API client for backend communication
 */

import { getAuthToken } from './auth-service.js';
import { SessionData, NotationSessionData } from '../types.js';

// Get API base URL from global config or default
// In production, this should be set by serve.py script injection
const API_BASE_URL = (window as any).API_BASE_URL || 
  (window.location.protocol === 'https:' ? 'https://blindfoldcubing.com/api/v1' : 'http://localhost:8000/api/v1');

// Additional fallback: if we're on the production domain, always use HTTPS
const isProductionDomain = window.location.hostname === 'blindfoldcubing.com' || window.location.hostname === 'www.blindfoldcubing.com';
const finalApiBaseUrl = isProductionDomain && !(window as any).API_BASE_URL ? 'https://blindfoldcubing.com/api/v1' : API_BASE_URL;

// Debug logging to help troubleshoot
console.log('API_BASE_URL:', API_BASE_URL);
console.log('finalApiBaseUrl:', finalApiBaseUrl);
console.log('window.API_BASE_URL:', (window as any).API_BASE_URL);
console.log('window.location.protocol:', window.location.protocol);
console.log('window.location.hostname:', window.location.hostname);
console.log('isProductionDomain:', isProductionDomain);

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function getCurrentUserProfile(): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${finalApiBaseUrl}/users/me`, { headers });
  
  if (!response.ok) throw new Error('Failed to fetch user profile');
  
  return response.json();
}

export async function createSession(sessionData: SessionData): Promise<SessionData> {
  const headers = await getAuthHeaders();
  
  // Transform camelCase to snake_case for backend
  const backendData = {
    session_date: sessionData.date,
    drill_type: sessionData.drillType,
    pair_count: sessionData.pairCount,
    pairs: sessionData.pairs,
    timings: sessionData.timings,
    average_time: sessionData.averageTime,
    total_time: sessionData.totalTime,
    recall_accuracy: sessionData.recallAccuracy,
    user_recall: sessionData.userRecall,
    recall_validation: sessionData.recallValidation,
    vividness: sessionData.vividness,
    flow: sessionData.flow,
    notes: sessionData.notes
  };
  
  const response = await fetch(`${finalApiBaseUrl}/sessions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(backendData)
  });
  
  if (!response.ok) throw new Error('Failed to create session');
  
  const backendResponse = await response.json();
  
  // Transform snake_case response back to camelCase and convert types
  return {
    id: backendResponse.id,
    date: backendResponse.session_date,
    drillType: backendResponse.drill_type,
    pairCount: Number(backendResponse.pair_count),
    pairs: backendResponse.pairs,
    timings: backendResponse.timings,
    averageTime: Number(backendResponse.average_time),
    totalTime: backendResponse.total_time ? Number(backendResponse.total_time) : undefined,
    recallAccuracy: Number(backendResponse.recall_accuracy),
    userRecall: backendResponse.user_recall,
    recallValidation: backendResponse.recall_validation,
    vividness: backendResponse.vividness,
    flow: backendResponse.flow,
    notes: backendResponse.notes
  };
}

export async function getUserSessions(
  skip: number = 0,
  limit: number = 100,
  drillType?: string
): Promise<SessionData[]> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(drillType ? { drill_type: drillType } : {})
  });
  
  const response = await fetch(`${finalApiBaseUrl}/sessions?${params}`, { headers });
  
  if (!response.ok) throw new Error('Failed to fetch sessions');
  
  const backendSessions = await response.json();
  
  // Transform snake_case response back to camelCase and convert types
  return backendSessions.map((session: any) => ({
    id: session.id,
    date: session.session_date,
    drillType: session.drill_type,
    pairCount: Number(session.pair_count),
    pairs: session.pairs,
    timings: session.timings,
    averageTime: Number(session.average_time),
    totalTime: session.total_time ? Number(session.total_time) : undefined,
    recallAccuracy: Number(session.recall_accuracy),
    userRecall: session.user_recall,
    recallValidation: session.recall_validation,
    vividness: session.vividness,
    flow: session.flow,
    notes: session.notes
  }));
}

export async function createNotationSession(
  sessionData: NotationSessionData
): Promise<NotationSessionData> {
  const headers = await getAuthHeaders();
  
  // Transform camelCase to snake_case for backend
  const backendData = {
    session_date: sessionData.date,
    drill_type: sessionData.drillType,
    attempts: sessionData.attempts,
    total_pieces: sessionData.totalPieces,
    correct_count: sessionData.correctCount,
    accuracy: sessionData.accuracy,
    average_time: sessionData.averageTime,
    total_time: sessionData.totalTime,
    notes: sessionData.notes
  };
  
  const response = await fetch(`${finalApiBaseUrl}/notation-sessions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(backendData)
  });
  
  if (!response.ok) throw new Error('Failed to create notation session');
  
  const backendResponse = await response.json();
  
  // Transform snake_case response back to camelCase and convert types
  return {
    id: backendResponse.id,
    date: backendResponse.session_date,
    drillType: backendResponse.drill_type,
    attempts: backendResponse.attempts,
    totalPieces: Number(backendResponse.total_pieces),
    correctCount: Number(backendResponse.correct_count),
    accuracy: Number(backendResponse.accuracy),
    averageTime: Number(backendResponse.average_time),
    totalTime: backendResponse.total_time ? Number(backendResponse.total_time) : undefined,
    notes: backendResponse.notes
  };
}

export async function getUserNotationSessions(
  skip: number = 0,
  limit: number = 100,
  drillType?: string
): Promise<NotationSessionData[]> {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(drillType ? { drill_type: drillType } : {})
  });
  
  const response = await fetch(`${finalApiBaseUrl}/notation-sessions?${params}`, { headers });
  
  if (!response.ok) throw new Error('Failed to fetch notation sessions');
  
  const backendSessions = await response.json();
  
  // Transform snake_case response back to camelCase and convert types
  return backendSessions.map((session: any) => ({
    id: session.id,
    date: session.session_date,
    drillType: session.drill_type,
    attempts: session.attempts,
    totalPieces: Number(session.total_pieces),
    correctCount: Number(session.correct_count),
    accuracy: Number(session.accuracy),
    averageTime: Number(session.average_time),
    totalTime: session.total_time ? Number(session.total_time) : undefined,
    notes: session.notes
  }));
}

export interface UserStatsResponse {
  total_sessions: number;
  total_pairs: number;
  avg_accuracy: number;
  avg_speed: number;
  best_accuracy: number;
  best_speed: number;
  best_quality: number;
  current_streak: number;
  last_session_date: string | null;
  days_since_last_session: number;
  drill_stats: Array<{
    drill_type: string;
    session_count: number;
    best_accuracy: number;
    best_speed: number;
    avg_accuracy: number;
    avg_speed: number;
  }>;
}

export interface PopulationStatsResponse {
  avg_accuracy: number;
  avg_speed: number;
  avg_quality: number;
  percentiles: {
    accuracy: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
    speed: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
    quality: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
  };
  improvement_benchmarks: Array<{
    sessions: number;
    avg_improvement: number;
    description: string;
  }>;
  drill_popularity: Record<string, number>;
}

export async function getUserStats(): Promise<UserStatsResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${finalApiBaseUrl}/stats`, { headers });
  
  if (!response.ok) throw new Error('Failed to fetch user stats');
  
  return await response.json();
}

export async function getPopulationStats(): Promise<PopulationStatsResponse | null> {
  // Population stats endpoint is public (no auth required)
  // Try with auth headers first, but fall back to no-auth request if not authenticated
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${finalApiBaseUrl}/stats/population`, { headers });
    
    if (!response.ok) {
      // If population stats are not available (e.g., insufficient data), return null
      if (response.status === 404 || response.status === 503) {
        return null;
      }
      // If auth failed, try without auth (public endpoint)
      if (response.status === 401 || response.status === 403) {
        return await getPopulationStatsPublic();
      }
      throw new Error('Failed to fetch population stats');
    }
    
    return await response.json();
  } catch (error) {
    // If error, try public endpoint
    return await getPopulationStatsPublic();
  }
}

async function getPopulationStatsPublic(): Promise<PopulationStatsResponse | null> {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    const response = await fetch(`${finalApiBaseUrl}/stats/population`, { headers });
    
    if (!response.ok) {
      // If population stats are not available (e.g., insufficient data), return null
      if (response.status === 404 || response.status === 503) {
        return null;
      }
      throw new Error('Failed to fetch population stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching population stats:', error);
    return null;
  }
}

