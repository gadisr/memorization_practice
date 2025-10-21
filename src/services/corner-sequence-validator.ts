// Corner sequence validation service for corner tracing drills
// Matches the functionality of edge validation in SequenceValidator

import { CornerTracer, CornerState } from './corner-tracer.js';
import { MoveApplier } from './move-applier.js';
import { scramble_cube, apply_move } from './cube-scrambler.js';
import { CubeState, FullMove } from '../models/cube-models.js';

// Corner swap algorithm - fixed sequence
const CORNER_SWAP_ALGORITHM = "R U' R' U' R U R' F' R U R' U' R' F R";

import { 
  SequenceValidationInput, 
  CornerDrillValidationResult, 
  CornerValidationResult,
  MoveApplicationStep 
} from '../models/sequence-validation.js';

export class CornerSequenceValidator {
  public cornerTracer: CornerTracer;
  public moveApplier: MoveApplier;

  constructor() {
    this.cornerTracer = new CornerTracer();
    this.moveApplier = new MoveApplier();
  }

  /**
   * Main function to validate a corner tracing drill sequence
   * Takes a scramble string and user's traced sequence, returns validation result
   */
  public validateCornerSequence(input: SequenceValidationInput): CornerDrillValidationResult {
    const errors: string[] = [];
    
    // Validate input
    if (!input.scrambleString || input.scrambleString.trim().length === 0) {
      errors.push('Scramble string cannot be empty');
    }
    
    // If we have input validation errors, return early
    if (errors.length > 0) {
      return {
        isValid: false,
        expectedSequence: '',
        userSequence: input.userTracingSequence,
        finalCubeState: {} as any,
        edgesInPosition: [],
        flippedEdges: [],
        errors,
        score: 0
      };
    }
    
    try {
      // Step 1: Validate scramble string format
      const validMoves = ['R', 'L', 'U', 'D', 'F', 'B', 'R\'', 'L\'', 'U\'', 'D\'', 'F\'', 'B\'', 'R2', 'L2', 'U2', 'D2', 'F2', 'B2',
                         'M', 'E', 'S', 'M\'', 'E\'', 'S\'', 'M2', 'E2', 'S2',
                         'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw', 'Rw\'', 'Lw\'', 'Uw\'', 'Dw\'', 'Fw\'', 'Bw\'', 'Rw2', 'Lw2', 'Uw2', 'Dw2', 'Fw2', 'Bw2'];
      
      const moves = input.scrambleString.trim().split(/\s+/).filter(move => move.length > 0);
      const invalidMoves = moves.filter(move => !validMoves.includes(move));
      
      if (invalidMoves.length > 0) {
        errors.push(`Invalid moves found: ${invalidMoves.join(', ')}`);
      }

      // Step 2: Generate scrambled cube from scramble string
      const scrambledCube = scramble_cube(input.scrambleString);
      
      // Step 3: Convert to CornerTracerCubeState for tracing
      const initialCornerTracerCube = this.moveApplier.convertToCornerTracerState(scrambledCube);
      
      // Step 4: Get expected sequence from CornerTracer
      const expectedSequence = this.cornerTracer.do_full_trace(initialCornerTracerCube);
      
      // Step 5: Apply user sequence to the cube using cube-scrambler
      const finalCube = this.applySequenceToCube(scrambledCube, input.userTracingSequence);
      
      // Step 6: Convert final cube state and validate
      const finalCornerTracerCube = this.moveApplier.convertToCornerTracerState(finalCube);
      const validationResult = this.validateCornerCubeState(finalCornerTracerCube);
      
      // Step 7: Calculate score
      const score = this.calculateSequenceScore(expectedSequence, input.userTracingSequence);
      
      // Step 8: Return comprehensive result
      const result: CornerDrillValidationResult = {
        isValid: validationResult.isValid && errors.length === 0,
        expectedSequence,
        userSequence: input.userTracingSequence,
        finalCubeState: finalCornerTracerCube,
        edgesInPosition: validationResult.cornersInPosition, // Map corners to edges for compatibility
        flippedEdges: validationResult.twistedCorners, // Map twisted to flipped for compatibility
        errors: [...errors, ...validationResult.errors],
        score
      };
      
      return result;
      
    } catch (error) {
      return {
        isValid: false,
        expectedSequence: '',
        userSequence: input.userTracingSequence,
        finalCubeState: {},
        edgesInPosition: [],
        flippedEdges: [],
        errors: [`Validation error: ${error}`],
        score: 0
      };
    }
  }

  /**
   * Convenience function that takes scramble string and user sequence directly
   */
  public scrambleAndValidateCorners(scrambleString: string, userSequence: string): CornerDrillValidationResult {
    return this.validateCornerSequence({
      scrambleString,
      userTracingSequence: userSequence
    });
  }

  /**
   * Apply a sequence to a cube and return the result using cube-scrambler
   */
  public applySequenceToCube(
    cube: CubeState,
    sequence: string
  ): CubeState {
    // Use MoveApplier's corner sequence application
    const result = this.moveApplier.applyCornerSequenceToCube(cube, sequence);
    
    if (!result.success) {
      throw new Error(`Failed to apply corner sequence: ${result.errors.join(', ')}`);
    }
    
    return result.finalState;
  }

  /**
   * Check if all corners are in their correct positions
   */
  public areAllCornersInPosition(cube: any): boolean { // CornerState
    const validation = this.validateCornerCubeState(cube);
    // Check if all 24 corners are in their correct positions
    return validation.cornersInPosition.length === 24;
  }

  /**
   * Calculate sequence score based on comparison with expected sequence
   */
  public calculateSequenceScore(expected: string, user: string): number {
    const expectedLetters = expected.trim().split(/\s+/).filter(letter => letter.length > 0);
    const userLetters = user.trim().split(/\s+/).filter(letter => letter.length > 0);
    
    // If both sequences are empty, it's a perfect match
    if (expectedLetters.length === 0 && userLetters.length === 0) {
      return 100;
    }
    
    // If one is empty and the other isn't, it's a complete mismatch
    if (expectedLetters.length === 0 || userLetters.length === 0) {
      return 0;
    }
    
    // Calculate basic letter matching
    let correctLetters = 0;
    const minLength = Math.min(expectedLetters.length, userLetters.length);
    
    for (let i = 0; i < minLength; i++) {
      if (expectedLetters[i] === userLetters[i]) {
        correctLetters++;
      }
    }
    
    // Base score from letter matching
    let score = (correctLetters / expectedLetters.length) * 100;
    
    // Penalty for length differences
    const lengthDifference = Math.abs(expectedLetters.length - userLetters.length);
    const lengthPenalty = Math.min(lengthDifference * 5, 20); // Max 20% penalty
    score = Math.max(0, score - lengthPenalty);
    
    return Math.round(score);
  }

  /**
   * Validate corner cube state and check corner positions
   */
  private validateCornerCubeState(cube: any): CornerValidationResult { // CornerState
    
    const cornersInPosition: string[] = [];
    const twistedCorners: string[] = [];
    const errors: string[] = [];
    
    // Get all corner positions
    const allCornerPositions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                               'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
    
    for (const position of allCornerPositions) {
      if (cube[position]) {
        const cornerData = cube[position];
        
        // Check if corner is in correct position
        const inCorrectPosition = this.isCornerInCorrectPosition(position, cornerData);
        
        if (inCorrectPosition) {
          cornersInPosition.push(position);
          
          // Check if it's twisted
          const isTwisted = this.isCornerTwisted(position, cornerData);
          
          if (isTwisted) {
            twistedCorners.push(position);
          }
        } else {
        }
      } else {
        const errorMsg = `Missing corner data for position: ${position}`;
        errors.push(errorMsg);
      }
    }
    
    // Validation is successful if there are no errors and the sequence was processed correctly
    const isValid = errors.length === 0;
    
    return {
      isValid,
      finalCubeState: cube,
      cornersInPosition,
      twistedCorners,
      errors
    };
  }

  /**
   * Check if a corner is in its correct position
   */
  private isCornerInCorrectPosition(position: string, cornerData: { colors: [string, string, string] }): boolean {
    try {
      // Get the expected colors for this position from CornerTracer
      const expectedPosition = this.cornerTracer.get_corner_solved_position_by_colors(cornerData.colors);
      
      // Check if the corner piece should be in this position
      const normalMatch = expectedPosition === position;
      
      return normalMatch;
    } catch (error) {
      console.log(`Error checking corner position: ${error}`);
      return false;
    }
  }

  /**
   * Check if a corner is twisted (correct position, wrong orientation)
   */
  private isCornerTwisted(position: string, cornerData: { colors: [string, string, string] }): boolean {
    try {
      // Check if the corner is in the correct position but twisted
      const expectedPosition = this.cornerTracer.get_corner_solved_position_by_colors(cornerData.colors);
      
      // If the corner is in the right position, check if it's twisted
      if (expectedPosition === position) {
        // This is a simplified check - in a full implementation, you'd check
        // the exact color orientation against the solved state
        return false; // For now, assume no twisting
      }
      
      return false;
    } catch (error) {
      console.log(`Error checking if corner is twisted: ${error}`);
      return false;
    }
  }

  /**
   * Get detailed analysis of a validation result
   */
  public analyzeValidationResult(result: CornerDrillValidationResult): {
    summary: string;
    details: string[];
    suggestions: string[];
  } {
    const details: string[] = [];
    const suggestions: string[] = [];
    
    // Summary
    let summary = `Score: ${result.score}% - `;
    if (result.score >= 90) {
      summary += "Excellent!";
    } else if (result.score >= 70) {
      summary += "Good job!";
    } else if (result.score >= 50) {
      summary += "Needs improvement.";
    } else {
      summary += "Needs significant practice.";
    }
    
    // Details
    details.push(`Expected sequence: ${result.expectedSequence}`);
    details.push(`Your sequence: ${result.userSequence}`);
    details.push(`Corners in position: ${result.edgesInPosition.length}/24`);
    details.push(`Twisted corners: ${result.flippedEdges.length}`);
    
    if (result.errors.length > 0) {
      details.push(`Errors: ${result.errors.join(', ')}`);
    }
    
    // Suggestions
    if (result.score < 100) {
      if (result.edgesInPosition.length < 24) {
        suggestions.push("Focus on getting all corners in their correct positions");
      }
      if (result.flippedEdges.length > 0) {
        suggestions.push("Pay attention to corner orientation - some corners are twisted");
      }
      if (result.errors.length > 0) {
        suggestions.push("Check for invalid moves or sequence format errors");
      }
    }
    
    if (result.score >= 90) {
      suggestions.push("Great work! Try more complex scrambles to improve further");
    }
    
    return { summary, details, suggestions };
  }
}

// Export convenience functions
export function validateCornerSequence(input: SequenceValidationInput): CornerDrillValidationResult {
  const validator = new CornerSequenceValidator();
  return validator.validateCornerSequence(input);
}

export function scrambleAndValidateCorners(scrambleString: string, userSequence: string): CornerDrillValidationResult {
  const validator = new CornerSequenceValidator();
  return validator.scrambleAndValidateCorners(scrambleString, userSequence);
}

export function applyCornerSequenceToCube(cube: any, sequence: string): any {
  const validator = new CornerSequenceValidator();
  return validator.applySequenceToCube(cube, sequence);
}

export function areAllCornersInPosition(cube: any): boolean {
  const validator = new CornerSequenceValidator();
  return validator.areAllCornersInPosition(cube);
}

export function calculateCornerSequenceScore(expected: string, user: string): number {
  const validator = new CornerSequenceValidator();
  return validator.calculateSequenceScore(expected, user);
}
