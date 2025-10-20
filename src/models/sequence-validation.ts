// Models for sequence validation functionality

import { EdgeTracerCubeState } from '../services/edge-tracer';

export interface SetupMove {
  letter: string;
  move: string;
}

export interface ValidationResult {
  isValid: boolean;
  finalCubeState: EdgeTracerCubeState;
  edgesInPosition: string[];
  flippedEdges: string[];
  errors: string[];
}

export interface SequenceValidationInput {
  scrambleString: string; // Original scramble sequence used to create the cube
  userTracingSequence: string; // User's traced sequence from drill
}

export interface DrillValidationResult {
  isValid: boolean;
  expectedSequence: string; // Correct sequence from EdgeTracer
  userSequence: string; // User's input
  finalCubeState: EdgeTracerCubeState;
  edgesInPosition: string[];
  flippedEdges: string[];
  errors: string[];
  score: number; // Percentage of correctness
}

export interface MoveApplicationStep {
  letter: string;
  setupMove: string;
  inverseSetupMove: string;
  cubeStateBefore: EdgeTracerCubeState;
  cubeStateAfter: EdgeTracerCubeState;
  success: boolean;
  error?: string;
}

export interface SequenceApplicationResult {
  success: boolean;
  finalCubeState: EdgeTracerCubeState;
  steps: MoveApplicationStep[];
  errors: string[];
}
