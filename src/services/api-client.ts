/**
 * API client for backend communication
 */

import { getAuthToken } from './auth-service.js';
import { SessionData, NotationSessionData } from '../types.js';

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function getCurrentUserProfile(): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/me`, { headers });
  
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
    vividness: sessionData.vividness,
    flow: sessionData.flow,
    notes: sessionData.notes
  };
  
  const response = await fetch(`${API_BASE_URL}/sessions`, {
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
  
  const response = await fetch(`${API_BASE_URL}/sessions?${params}`, { headers });
  
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
  
  const response = await fetch(`${API_BASE_URL}/notation-sessions`, {
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
  
  const response = await fetch(`${API_BASE_URL}/notation-sessions?${params}`, { headers });
  
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

