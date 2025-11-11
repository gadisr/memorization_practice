/**
 * Data processing service for chart visualization
 */

import { SessionData, NotationSessionData, DrillType } from '../types.js';
import { ChartData, ProcessedSessionData, DrillTypeStats } from '../types/chart.js';
import { formatDrillName } from '../utils/drill-name-formatter.js';

/**
 * Process session data for accuracy progress chart
 */
export function processAccuracyData(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): ChartData {
  // Create unified session data for processing
  const allSessions: Array<{date: string, recallAccuracy: number, averageTime: number}> = [
    ...sessions.map(s => ({
      date: s.date,
      recallAccuracy: s.recallAccuracy,
      averageTime: s.averageTime
    })),
    ...notationSessions.map(ns => ({
      date: ns.date,
      recallAccuracy: ns.accuracy,
      averageTime: ns.averageTime
    }))
  ];

  const dailyData = groupSessionsByDate(allSessions);
  const labels: string[] = [];
  const accuracyData: number[] = [];

  // Sort dates chronologically
  const sortedDates = Object.keys(dailyData).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  sortedDates.forEach(date => {
    const daySessions = dailyData[date];
    const avgAccuracy = daySessions.reduce((sum, session) => 
      sum + session.recallAccuracy, 0) / daySessions.length;
    
    labels.push(formatDateLabel(date));
    accuracyData.push(Math.round(avgAccuracy * 10) / 10);
  });

  return {
    labels,
    datasets: [{
      label: 'Accuracy (%)',
      data: accuracyData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
}

/**
 * Process session data for speed progress chart
 */
export function processSpeedData(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): ChartData {
  // Create unified session data for processing
  const allSessions: Array<{date: string, recallAccuracy: number, averageTime: number}> = [
    ...sessions.map(s => ({
      date: s.date,
      recallAccuracy: s.recallAccuracy,
      averageTime: s.averageTime
    })),
    ...notationSessions.map(ns => ({
      date: ns.date,
      recallAccuracy: ns.accuracy,
      averageTime: ns.averageTime
    }))
  ];

  const dailyData = groupSessionsByDate(allSessions);
  const labels: string[] = [];
  const speedData: number[] = [];

  // Sort dates chronologically
  const sortedDates = Object.keys(dailyData).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  sortedDates.forEach(date => {
    const daySessions = dailyData[date];
    const avgSpeed = daySessions.reduce((sum, session) => 
      sum + session.averageTime, 0) / daySessions.length;
    
    labels.push(formatDateLabel(date));
    speedData.push(Math.round(avgSpeed * 100) / 100);
  });

  return {
    labels,
    datasets: [{
      label: 'Speed (seconds/pair)',
      data: speedData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
}

/**
 * Process session data for quality trends chart
 */
export function processQualityData(sessions: SessionData[]): ChartData {
  const vividnessSessions = sessions.filter(s => s.vividness !== undefined);
  const flowSessions = sessions.filter(s => s.flow !== undefined);

  // Create unified session data for vividness
  const vividnessSessionsData: Array<{date: string, vividness: number}> = vividnessSessions.map(s => ({
    date: s.date,
    vividness: s.vividness || 0
  }));

  // Create unified session data for flow
  const flowSessionsData: Array<{date: string, flow: number}> = flowSessions.map(s => ({
    date: s.date,
    flow: s.flow || 0
  }));

  const dailyVividness = groupSessionsByDate(vividnessSessionsData);
  const dailyFlow = groupSessionsByDate(flowSessionsData);

  const allDates = new Set([
    ...Object.keys(dailyVividness),
    ...Object.keys(dailyFlow)
  ]);

  const sortedDates = Array.from(allDates).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const labels: string[] = [];
  const vividnessData: number[] = [];
  const flowData: number[] = [];

  sortedDates.forEach(date => {
    labels.push(formatDateLabel(date));

    // Process vividness data
    if (dailyVividness[date]) {
      const avgVividness = dailyVividness[date].reduce((sum, session) => 
        sum + session.vividness, 0) / dailyVividness[date].length;
      vividnessData.push(Math.round(avgVividness * 10) / 10);
    } else {
      vividnessData.push(NaN);
    }

    // Process flow data
    if (dailyFlow[date]) {
      const avgFlow = dailyFlow[date].reduce((sum, session) => 
        sum + session.flow, 0) / dailyFlow[date].length;
      flowData.push(Math.round(avgFlow * 10) / 10);
    } else {
      flowData.push(NaN);
    }
  });

  return {
    labels,
    datasets: [
      {
        label: 'Vividness (1-5)',
        data: vividnessData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Flow (1-3)',
        data: flowData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: false,
        tension: 0.4
      }
    ]
  };
}

/**
 * Process session data for drill type comparison chart
 */
export function processDrillTypeComparison(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): ChartData {
  const drillTypeStats = new Map<string, DrillTypeStats>();

  // Process regular sessions
  sessions.forEach(session => {
    const drillType = session.drillType;
    if (!drillTypeStats.has(drillType)) {
      drillTypeStats.set(drillType, {
        drillType,
        averageAccuracy: 0,
        averageSpeed: 0,
        sessionCount: 0
      });
    }

    const stats = drillTypeStats.get(drillType)!;
    stats.averageAccuracy += session.recallAccuracy;
    stats.averageSpeed += session.averageTime;
    stats.sessionCount += 1;
  });

  // Process notation sessions
  notationSessions.forEach(session => {
    const drillType = session.drillType;
    if (!drillTypeStats.has(drillType)) {
      drillTypeStats.set(drillType, {
        drillType,
        averageAccuracy: 0,
        averageSpeed: 0,
        sessionCount: 0
      });
    }

    const stats = drillTypeStats.get(drillType)!;
    stats.averageAccuracy += session.accuracy;
    stats.averageSpeed += session.averageTime;
    stats.sessionCount += 1;
  });

  // Calculate averages
  const labels: string[] = [];
  const accuracyData: number[] = [];
  const colors: string[] = [];

  const colorPalette = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  let colorIndex = 0;
  drillTypeStats.forEach((stats, drillType) => {
    if (stats.sessionCount > 0) {
      labels.push(formatDrillTypeName(drillType));
      accuracyData.push(Math.round((stats.averageAccuracy / stats.sessionCount) * 10) / 10);
      colors.push(colorPalette[colorIndex % colorPalette.length]);
      colorIndex++;
    }
  });

  return {
    labels,
    datasets: [{
      label: 'Average Accuracy (%)',
      data: accuracyData,
      backgroundColor: colors,
      borderColor: colors.map(color => color),
      borderWidth: 1
    }]
  };
}

/**
 * Filter sessions by date range
 */
export function filterSessionsByDateRange(
  sessions: SessionData[], 
  days: number | 'all'
): SessionData[] {
  if (days === 'all') return sessions;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return sessions.filter(session => 
    new Date(session.date) >= cutoffDate
  );
}

/**
 * Filter notation sessions by date range
 */
export function filterNotationSessionsByDateRange(
  sessions: NotationSessionData[], 
  days: number | 'all'
): NotationSessionData[] {
  if (days === 'all') return sessions;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return sessions.filter(session => 
    new Date(session.date) >= cutoffDate
  );
}

/**
 * Group sessions by drill type
 */
export function groupSessionsByDrillType(sessions: SessionData[]): Map<DrillType, SessionData[]> {
  const grouped = new Map<DrillType, SessionData[]>();
  
  sessions.forEach(session => {
    if (!grouped.has(session.drillType)) {
      grouped.set(session.drillType, []);
    }
    grouped.get(session.drillType)!.push(session);
  });

  return grouped;
}

/**
 * Group sessions by date for daily aggregation
 */
function groupSessionsByDate(sessions: Array<{date: string, recallAccuracy: number, averageTime: number}>): Record<string, Array<{date: string, recallAccuracy: number, averageTime: number}>>;
function groupSessionsByDate(sessions: Array<{date: string, vividness: number}>): Record<string, Array<{date: string, vividness: number}>>;
function groupSessionsByDate(sessions: Array<{date: string, flow: number}>): Record<string, Array<{date: string, flow: number}>>;
function groupSessionsByDate(sessions: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};

  sessions.forEach(session => {
    const dateKey = new Date(session.date).toISOString().split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(session);
  });

  return grouped;
}

/**
 * Format date for chart labels
 */
function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Format drill type name for display
 */
function formatDrillTypeName(drillType: string): string {
  return formatDrillName(drillType);
}
