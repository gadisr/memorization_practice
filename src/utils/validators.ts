/**
 * Data validation utilities
 */

import { DrillType, QualityMetric } from '../types.js';
import { getDrillConfig } from '../config/drill-config.js';

export function validatePairCount(count: number, drillType: DrillType): { valid: boolean; warning?: string } {
  if (count < 1) {
    return { valid: false };
  }
  
  if (count > 50) {
    return { valid: false };
  }
  
  const config = getDrillConfig(drillType);
  if (config && Math.abs(count - config.defaultPairCount) > config.defaultPairCount * 0.5) {
    return {
      valid: true,
      warning: `Pair count differs significantly from recommended ${config.defaultPairCount} pairs`
    };
  }
  
  return { valid: true };
}

export function validateRecallCount(recall: number, total: number): boolean {
  return recall >= 0 && recall <= total && Number.isInteger(recall);
}

export function validateQualityRating(rating: number, metric: QualityMetric): boolean {
  if (!Number.isInteger(rating)) return false;
  
  if (metric === QualityMetric.VIVIDNESS) {
    return rating >= 1 && rating <= 5;
  } else {
    return rating >= 1 && rating <= 3;
  }
}


