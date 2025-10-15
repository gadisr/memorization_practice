/**
 * Type definitions for BLD Memory Trainer
 */

export enum DrillType {
  FLASH_PAIRS = 'FLASH_PAIRS',
  TWO_PAIR_FUSION = 'TWO_PAIR_FUSION',
  THREE_PAIR_CHAIN = 'THREE_PAIR_CHAIN',
  EIGHT_PAIR_CHAIN = 'EIGHT_PAIR_CHAIN',
  JOURNEY_MODE = 'JOURNEY_MODE',
  FULL_CUBE_SIMULATION = 'FULL_CUBE_SIMULATION'
}

export enum QualityMetric {
  VIVIDNESS = 'VIVIDNESS',
  FLOW = 'FLOW'
}

export interface LetterPair {
  pair: string;
  displayOrder: number;
  timestamp?: number;
}

export interface DrillConfig {
  type: DrillType;
  defaultPairCount: number;
  qualityMetric: QualityMetric;
  description: string;
}

export interface SessionData {
  id: string;
  date: string;
  drillType: DrillType;
  pairCount: number;
  pairs: LetterPair[];
  timings: number[];
  averageTime: number;
  recallAccuracy: number;
  vividness?: number;
  flow?: number;
  notes?: string;
}


