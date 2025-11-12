/**
 * Stats calculation service for user statistics
 */

import { SessionData, NotationSessionData, DrillType } from '../types.js';

export interface UserStats {
  totalSessions: number;
  totalPairs: number;
  avgAccuracy: number;
  avgSpeed: number;
  bestAccuracy: number;
  bestSpeed: number;
  bestQuality: number;
  currentStreak: number;
  lastSessionDate: string | null;
  daysSinceLastSession: number;
  drillStats: Map<DrillType, DrillStats>;
}

export interface DrillStats {
  drillType: DrillType;
  sessionCount: number;
  bestAccuracy: number;
  bestSpeed: number;
  avgAccuracy: number;
  avgSpeed: number;
}

export interface StreakData {
  currentStreak: number;
  lastSessionDate: string | null;
  daysSinceLastSession: number;
}

/**
 * Calculate user statistics from sessions
 */
export function calculateUserStats(
  sessions: SessionData[],
  notationSessions: NotationSessionData[] = []
): UserStats {
  const allSessions = sessions.length + notationSessions.length;
  const totalPairs = sessions.reduce((sum, s) => sum + s.pairCount, 0);
  
  // Calculate averages
  const sessionAccuracy = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.recallAccuracy, 0) / sessions.length
    : 0;
  const notationAccuracy = notationSessions.length > 0
    ? notationSessions.reduce((sum, s) => sum + s.accuracy, 0) / notationSessions.length
    : 0;
  const avgAccuracy = allSessions > 0
    ? (sessionAccuracy * sessions.length + notationAccuracy * notationSessions.length) / allSessions
    : 0;
  
  const avgSpeed = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.averageTime, 0) / sessions.length
    : 0;
  
  // Calculate best performance
  const bestAccuracy = Math.max(
    ...sessions.map(s => s.recallAccuracy),
    ...notationSessions.map(s => s.accuracy),
    0
  );
  
  const bestSpeed = sessions.length > 0
    ? Math.min(...sessions.map(s => s.averageTime))
    : 0;
  
  // Calculate best quality (vividness or flow)
  const allQualityScores = sessions
    .map(s => s.vividness || s.flow || 0)
    .filter(score => score > 0);
  const bestQuality = allQualityScores.length > 0
    ? Math.max(...allQualityScores)
    : 0;
  
  // Calculate streak data
  const streakData = calculateStreak([...sessions, ...notationSessions.map(s => ({
    id: s.id,
    date: s.date,
    drillType: s.drillType
  } as SessionData))]);
  
  // Calculate drill-specific stats
  const drillStats = calculateDrillStats(sessions, notationSessions);
  
  return {
    totalSessions: allSessions,
    totalPairs,
    avgAccuracy,
    avgSpeed,
    bestAccuracy,
    bestSpeed,
    bestQuality,
    currentStreak: streakData.currentStreak,
    lastSessionDate: streakData.lastSessionDate,
    daysSinceLastSession: streakData.daysSinceLastSession,
    drillStats
  };
}

/**
 * Calculate streak data from sessions
 */
function calculateStreak(sessions: SessionData[]): StreakData {
  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      lastSessionDate: null,
      daysSinceLastSession: 0
    };
  }
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const lastSessionDate = sortedSessions[0].date;
  const lastSessionTime = new Date(lastSessionDate).getTime();
  const now = Date.now();
  const daysSinceLastSession = Math.floor((now - lastSessionTime) / (1000 * 60 * 60 * 24));
  
  // Calculate streak
  let currentStreak = 0;
  let currentDate = new Date(lastSessionDate);
  currentDate.setHours(0, 0, 0, 0);
  
  const sessionDates = new Set(
    sortedSessions.map(s => {
      const date = new Date(s.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  // Check consecutive days
  while (sessionDates.has(currentDate.getTime())) {
    currentStreak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return {
    currentStreak,
    lastSessionDate,
    daysSinceLastSession
  };
}

/**
 * Calculate drill-specific statistics
 */
function calculateDrillStats(
  sessions: SessionData[],
  notationSessions: NotationSessionData[]
): Map<DrillType, DrillStats> {
  const drillStatsMap = new Map<DrillType, DrillStats>();
  
  // Process regular sessions
  sessions.forEach(session => {
    if (!drillStatsMap.has(session.drillType)) {
      drillStatsMap.set(session.drillType, {
        drillType: session.drillType,
        sessionCount: 0,
        bestAccuracy: 0,
        bestSpeed: Infinity,
        avgAccuracy: 0,
        avgSpeed: 0
      });
    }
    
    const stats = drillStatsMap.get(session.drillType)!;
    stats.sessionCount++;
    stats.bestAccuracy = Math.max(stats.bestAccuracy, session.recallAccuracy);
    stats.bestSpeed = Math.min(stats.bestSpeed, session.averageTime);
  });
  
  // Process notation sessions
  notationSessions.forEach(session => {
    if (!drillStatsMap.has(session.drillType)) {
      drillStatsMap.set(session.drillType, {
        drillType: session.drillType,
        sessionCount: 0,
        bestAccuracy: 0,
        bestSpeed: Infinity,
        avgAccuracy: 0,
        avgSpeed: 0
      });
    }
    
    const stats = drillStatsMap.get(session.drillType)!;
    stats.sessionCount++;
    stats.bestAccuracy = Math.max(stats.bestAccuracy, session.accuracy);
    stats.bestSpeed = Math.min(stats.bestSpeed, session.averageTime);
  });
  
  // Calculate averages
  drillStatsMap.forEach((stats, drillType) => {
    const drillSessions = sessions.filter(s => s.drillType === drillType);
    const drillNotationSessions = notationSessions.filter(s => s.drillType === drillType);
    
    if (drillSessions.length > 0) {
      stats.avgAccuracy = drillSessions.reduce((sum, s) => sum + s.recallAccuracy, 0) / drillSessions.length;
      stats.avgSpeed = drillSessions.reduce((sum, s) => sum + s.averageTime, 0) / drillSessions.length;
    } else if (drillNotationSessions.length > 0) {
      stats.avgAccuracy = drillNotationSessions.reduce((sum, s) => sum + s.accuracy, 0) / drillNotationSessions.length;
      stats.avgSpeed = drillNotationSessions.reduce((sum, s) => sum + s.averageTime, 0) / drillNotationSessions.length;
    }
    
    if (stats.bestSpeed === Infinity) {
      stats.bestSpeed = 0;
    }
  });
  
  return drillStatsMap;
}

/**
 * Get recommendations for under-practiced drills
 */
export function getUnderPracticedDrills(
  drillStats: Map<DrillType, DrillStats>,
  allDrillTypes: DrillType[]
): DrillType[] {
  const practicedDrills = Array.from(drillStats.keys());
  const underPracticed: DrillType[] = [];
  
  // Find drills with few or no sessions
  allDrillTypes.forEach(drillType => {
    const stats = drillStats.get(drillType);
    if (!stats || stats.sessionCount < 3) {
      underPracticed.push(drillType);
    }
  });
  
  // Sort by session count (least practiced first)
  return underPracticed.sort((a, b) => {
    const statsA = drillStats.get(a);
    const statsB = drillStats.get(b);
    const countA = statsA?.sessionCount || 0;
    const countB = statsB?.sessionCount || 0;
    return countA - countB;
  });
}




