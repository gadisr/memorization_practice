/**
 * Type definitions for BLD Memory Trainer
 */

export enum DrillType {
  FLASH_PAIRS = 'FLASH_PAIRS',
  TWO_PAIR_FUSION = 'TWO_PAIR_FUSION',
  THREE_PAIR_CHAIN = 'THREE_PAIR_CHAIN',
  EIGHT_PAIR_CHAIN = 'EIGHT_PAIR_CHAIN',
  JOURNEY_MODE = 'JOURNEY_MODE',
  FULL_CUBE_SIMULATION = 'FULL_CUBE_SIMULATION',
  EDGE_NOTATION_DRILL = 'EDGE_NOTATION_DRILL',
  CORNER_NOTATION_DRILL = 'CORNER_NOTATION_DRILL',
  CORNER_TRACING_DRILL = 'CORNER_TRACING_DRILL',
  EDGE_TRACING_DRILL = 'EDGE_TRACING_DRILL'
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
  introduction?: string;
  howItHelps?: string;
}

export interface RecallValidation {
  isOrderRequired: boolean;
  correctPairs: string[];
  incorrectPairs: string[];
  missedPairs: string[];
  extraPairs: string[];
  accuracy: number;
}

export interface SessionData {
  id: string;
  date: string;
  drillType: DrillType;
  pairCount: number;
  pairs: LetterPair[];
  timings: number[];
  averageTime: number;
  totalTime?: number;
  recallAccuracy: number;
  userRecall?: string;
  recallValidation?: RecallValidation;
  vividness?: number;
  flow?: number;
  notes?: string;
}

export interface CubeColor {
  name: string;
  hex: string;
}

export interface EdgePiece {
  colors: [string, string];
  notation: string;
  displayOrder?: number;
}

export interface CornerPiece {
  colors: [string, string, string];
  notation: string;
  displayOrder?: number;
}

export interface NotationAttempt {
  pieceColors: string[];
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSeconds: number;
}

export interface NotationSessionData {
  id: string;
  date: string;
  drillType: DrillType.EDGE_NOTATION_DRILL | DrillType.CORNER_NOTATION_DRILL;
  attempts: NotationAttempt[];
  totalPieces: number;
  correctCount: number;
  accuracy: number;
  averageTime: number;
  totalTime?: number;
  notes?: string;
}


