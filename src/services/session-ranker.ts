/**
 * Session ranking utility for comparing session performance
 */

import { SessionData, NotationSessionData, DrillType } from '../types.js';
import { getAllSessions, getAllNotationSessions } from '../storage/storage-adapter.js';

export interface RankInfo {
  rank: number;
  totalCount: number;
  message: string;
}

/**
 * Calculate the ranking of a session compared to all previous sessions of the same type
 * Ranking considers both accuracy (primary) and speed (secondary/tiebreaker)
 */
export async function getSessionRank(session: SessionData): Promise<RankInfo> {
  const allSessions = await getAllSessions();
  const sameTypeSessions = allSessions.filter(s => 
    s.drillType === session.drillType && s.id !== session.id
  );
  
  const totalCount = sameTypeSessions.length + 1;
  
  // If this is the first session of this type
  if (sameTypeSessions.length === 0) {
    return {
      rank: 1,
      totalCount,
      message: "First session of this type! Great start!"
    };
  }
  
  // Count sessions that rank better (higher accuracy, or same accuracy with lower speed)
  const betterSessions = sameTypeSessions.filter(s => {
    // Primary: accuracy (higher is better)
    if (s.recallAccuracy > session.recallAccuracy) return true;
    if (s.recallAccuracy < session.recallAccuracy) return false;
    
    // Secondary: speed (lower is better) - tiebreaker when accuracy is equal
    return s.averageTime < session.averageTime;
  });
  
  const rank = betterSessions.length + 1;
  
  return generateRankMessage(rank, totalCount);
}

/**
 * Calculate the ranking of a notation session compared to all previous sessions of the same type
 * Ranking considers both accuracy (primary) and speed (secondary/tiebreaker)
 */
export async function getNotationSessionRank(session: NotationSessionData): Promise<RankInfo> {
  const allSessions = await getAllNotationSessions();
  const sameTypeSessions = allSessions.filter(s => 
    s.drillType === session.drillType && s.id !== session.id
  );
  
  const totalCount = sameTypeSessions.length + 1;
  
  // If this is the first session of this type
  if (sameTypeSessions.length === 0) {
    return {
      rank: 1,
      totalCount,
      message: "First session of this type! Great start!"
    };
  }
  
  // Count sessions that rank better (higher accuracy, or same accuracy with lower speed)
  const betterSessions = sameTypeSessions.filter(s => {
    // Primary: accuracy (higher is better)
    if (s.accuracy > session.accuracy) return true;
    if (s.accuracy < session.accuracy) return false;
    
    // Secondary: speed (lower is better) - tiebreaker when accuracy is equal
    return s.averageTime < session.averageTime;
  });
  
  const rank = betterSessions.length + 1;
  
  return generateRankMessage(rank, totalCount);
}

/**
 * Generate a user-friendly ranking message
 */
function generateRankMessage(rank: number, totalCount: number): RankInfo {
  let message: string;
  
  if (rank === 1) {
    message = "Best ever! 🎉";
  } else if (rank === 2) {
    message = "2nd all-time high! 🥈";
  } else if (rank === 3) {
    message = "3rd best! 🥉";
  } else if (rank <= 5) {
    message = `${ordinalSuffix(rank)} best!`;
  } else if (rank <= Math.ceil(totalCount * 0.25)) {
    message = `${ordinalSuffix(rank)} of ${totalCount} - Top 25%!`;
  } else if (rank <= Math.ceil(totalCount * 0.5)) {
    message = `${ordinalSuffix(rank)} of ${totalCount} - Top 50%`;
  } else {
    message = `${ordinalSuffix(rank)} of ${totalCount}`;
  }
  
  return {
    rank,
    totalCount,
    message
  };
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function ordinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

