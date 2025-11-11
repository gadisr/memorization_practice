/**
 * Centralized drill name formatting utility
 */

import { DrillType } from '../types.js';

/**
 * Map of drill types to their display names
 * Note: Enum values are strings, so this works for both enum and string inputs
 */
const DRILL_NAME_MAP: Record<string, string> = {
  [DrillType.FLASH_PAIRS]: 'Flash Pairs',
  [DrillType.EDGE_NOTATION_DRILL]: 'Edge Notation',
  [DrillType.CORNER_NOTATION_DRILL]: 'Corner Notation',
  [DrillType.CORNER_TRACING_DRILL]: 'Corner Tracing',
  [DrillType.EDGE_TRACING_DRILL]: 'Edge Tracing',
  [DrillType.EDGE_MEMORIZATION]: 'Edge Memorization',
  [DrillType.CORNER_MEMORIZATION]: 'Corner Memorization'
};

/**
 * Format a drill type to its display name
 * @param drillType - The drill type (enum or string)
 * @returns The formatted display name, or the original value if not found
 */
export function formatDrillName(drillType: DrillType | string): string {
  return DRILL_NAME_MAP[drillType] || drillType;
}

/**
 * Get a short name for notation drills (Edge/Corner)
 * @param drillType - The drill type
 * @returns 'Edge' or 'Corner' for notation drills, full name otherwise
 */
export function getNotationDrillShortName(drillType: DrillType): string {
  if (drillType === DrillType.EDGE_NOTATION_DRILL || drillType === DrillType.EDGE_MEMORIZATION) {
    return 'Edge';
  }
  if (drillType === DrillType.CORNER_NOTATION_DRILL || drillType === DrillType.CORNER_MEMORIZATION) {
    return 'Corner';
  }
  return formatDrillName(drillType);
}

