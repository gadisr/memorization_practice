/**
 * CSV export service for session data
 */

import { SessionData, NotationSessionData, DrillType } from '../types.js';

const CSV_HEADERS = [
  'Date',
  'Drill',
  '#Pairs',
  'Avg Time (sec)',
  'Recall Accuracy (%)',
  'Vividness (1-5)',
  'Flow (1-3)',
  'Notes'
];

export function generateCSV(sessions: SessionData[]): string {
  const rows: string[] = [CSV_HEADERS.join(',')];
  
  for (const session of sessions) {
    const row = [
      formatDate(session.date),
      formatDrillType(session.drillType),
      session.pairCount.toString(),
      session.averageTime.toFixed(2),
      session.recallAccuracy.toFixed(1),
      session.vividness?.toString() || '-',
      session.flow?.toString() || '-',
      escapeCsvField(session.notes || '')
    ];
    rows.push(row.join(','));
  }
  
  return rows.join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Check for IE 10+ (legacy browser support)
  const nav = navigator as any;
  if (nav.msSaveBlob) {
    nav.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US');
}

function formatDrillType(type: DrillType): string {
  const names: Record<DrillType, string> = {
    [DrillType.FLASH_PAIRS]: 'Flash Pairs',
    [DrillType.TWO_PAIR_FUSION]: '2-Pair Fusion',
    [DrillType.THREE_PAIR_CHAIN]: '3-Pair Chain',
    [DrillType.EIGHT_PAIR_CHAIN]: '8-Pair Chain',
    [DrillType.JOURNEY_MODE]: 'Journey Mode',
    [DrillType.FULL_CUBE_SIMULATION]: 'Full Cube Simulation',
    [DrillType.EDGE_NOTATION_DRILL]: 'Edge Notation',
    [DrillType.CORNER_NOTATION_DRILL]: 'Corner Notation'
  };
  return names[type] || type;
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateNotationCSV(sessions: NotationSessionData[]): string {
  const headers = [
    'Date',
    'Drill Type',
    'Total Pieces',
    'Correct',
    'Accuracy (%)',
    'Avg Time (sec)',
    'Notes'
  ];
  
  const rows: string[] = [headers.join(',')];
  
  for (const session of sessions) {
    const row = [
      formatDate(session.date),
      formatDrillType(session.drillType),
      session.totalPieces.toString(),
      session.correctCount.toString(),
      session.accuracy.toFixed(1),
      session.averageTime.toFixed(2),
      escapeCsvField(session.notes || '')
    ];
    rows.push(row.join(','));
  }
  
  return rows.join('\n');
}

export function generateCombinedCSV(pairSessions: SessionData[], notationSessions: NotationSessionData[]): string {
  const headers = [
    'Date',
    'Drill Type',
    'Count',
    'Avg Time (sec)',
    'Accuracy/Recall (%)',
    'Quality',
    'Notes'
  ];
  
  const rows: string[] = [headers.join(',')];
  
  // Add pair sessions
  for (const session of pairSessions) {
    const quality = session.vividness 
      ? `Vividness: ${session.vividness}`
      : session.flow 
        ? `Flow: ${session.flow}`
        : '-';
    
    const row = [
      formatDate(session.date),
      formatDrillType(session.drillType),
      session.pairCount.toString(),
      session.averageTime.toFixed(2),
      session.recallAccuracy.toFixed(1),
      quality,
      escapeCsvField(session.notes || '')
    ];
    rows.push(row.join(','));
  }
  
  // Add notation sessions
  for (const session of notationSessions) {
    const row = [
      formatDate(session.date),
      formatDrillType(session.drillType),
      session.totalPieces.toString(),
      session.averageTime.toFixed(2),
      session.accuracy.toFixed(1),
      '-',
      escapeCsvField(session.notes || '')
    ];
    rows.push(row.join(','));
  }
  
  return rows.join('\n');
}

