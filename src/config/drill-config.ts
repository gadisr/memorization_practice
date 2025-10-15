/**
 * Drill configuration data for all training modes
 */

import { DrillType, QualityMetric, DrillConfig } from '../types.js';

export const DRILL_CONFIGS: Map<DrillType, DrillConfig> = new Map([
  [DrillType.FLASH_PAIRS, {
    type: DrillType.FLASH_PAIRS,
    defaultPairCount: 30,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Display single letter pairs randomly - Fast image association'
  }],
  [DrillType.TWO_PAIR_FUSION, {
    type: DrillType.TWO_PAIR_FUSION,
    defaultPairCount: 10,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Show 2 pairs → form single mini-scene - Small scene building'
  }],
  [DrillType.THREE_PAIR_CHAIN, {
    type: DrillType.THREE_PAIR_CHAIN,
    defaultPairCount: 5,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Sequentially add 3 pairs into same story - Progressive chaining'
  }],
  [DrillType.EIGHT_PAIR_CHAIN, {
    type: DrillType.EIGHT_PAIR_CHAIN,
    defaultPairCount: 8,
    qualityMetric: QualityMetric.FLOW,
    description: 'Sequential story of 8 pairs - Continuous scene building'
  }],
  [DrillType.JOURNEY_MODE, {
    type: DrillType.JOURNEY_MODE,
    defaultPairCount: 15,
    qualityMetric: QualityMetric.FLOW,
    description: 'Multi-scene (3-5 rooms) practice - Memory Palace chaining'
  }],
  [DrillType.FULL_CUBE_SIMULATION, {
    type: DrillType.FULL_CUBE_SIMULATION,
    defaultPairCount: 20,
    qualityMetric: QualityMetric.FLOW,
    description: 'Edge + Corner sequence simulation - Realistic BLD memo practice'
  }]
]);

export function getDrillConfig(type: DrillType): DrillConfig | undefined {
  return DRILL_CONFIGS.get(type);
}

export function getAllDrillConfigs(): DrillConfig[] {
  return Array.from(DRILL_CONFIGS.values());
}


