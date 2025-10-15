/**
 * Adaptive quality metric logic
 */

import { DrillType, QualityMetric } from '../types.js';

export function getQualityMetric(drillType: DrillType): QualityMetric {
  switch (drillType) {
    case DrillType.FLASH_PAIRS:
    case DrillType.TWO_PAIR_FUSION:
    case DrillType.THREE_PAIR_CHAIN:
      return QualityMetric.VIVIDNESS;
    
    case DrillType.EIGHT_PAIR_CHAIN:
    case DrillType.JOURNEY_MODE:
    case DrillType.FULL_CUBE_SIMULATION:
      return QualityMetric.FLOW;
    
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


