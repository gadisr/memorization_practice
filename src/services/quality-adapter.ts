/**
 * Adaptive quality metric logic
 */

import { DrillType, QualityMetric } from '../types.js';

export function getQualityMetric(drillType: DrillType): QualityMetric {
  switch (drillType) {
    case DrillType.FLASH_PAIRS:
    case DrillType.EDGE_MEMORIZATION:
    case DrillType.CORNER_MEMORIZATION:
      return QualityMetric.VIVIDNESS;
    
    default:
      return QualityMetric.VIVIDNESS;
  }
}

export function getQualityScaleLabel(metric: QualityMetric, value: number): string {
  if (metric === QualityMetric.VIVIDNESS) {
    const labels: Record<number, string> = {
      1: 'Blurry',
      2: 'Dim',
      3: 'Clear',
      4: 'Vivid',
      5: 'Crystal'
    };
    return labels[value] || 'Unknown';
  } else {
    const labels: Record<number, string> = {
      1: 'Choppy',
      2: 'Smooth',
      3: 'Seamless'
    };
    return labels[value] || 'Unknown';
  }
}

export function getQualityScaleMax(metric: QualityMetric): number {
  return metric === QualityMetric.VIVIDNESS ? 5 : 3;
}


