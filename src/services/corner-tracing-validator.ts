// Corner tracing validation service for corner tracing drills

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

export class CornerTracingValidator {
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
  public validateCornerTracing(input: SequenceValidationInput): CornerDrillValidationResult {
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
    return this.validateCornerTracing({
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
   * Convert a sequence of corner letters to a sequence of cube moves
   */
  private convertLetterSequenceToMoves(sequence: string): string {
    // Use the MoveApplier's corner sequence conversion
    return this.moveApplier.convertCornerLetterSequenceToMoves(sequence);
  }


  /**
   * Get the inverse of a move
   */
  private getInverseMove(move: string): string {
    if (move.endsWith('\'')) {
      return move.slice(0, -1);
    } else if (move.endsWith('2')) {
      return move; // 180-degree moves are their own inverse
    } else {
      return move + '\'';
    }
  }


  /**
   * Validate the final corner cube state
   */
  private validateCornerCubeState(cubeState: CornerState): CornerValidationResult {
    const errors: string[] = [];
    const cornersInPosition: string[] = [];
    const twistedCorners: string[] = [];
    
    // Check each corner position
    for (const [position, corner] of Object.entries(cubeState)) {
      if (corner && typeof corner === 'object' && 'colors' in corner) {
        const cornerData = corner as any;
        
        // Check if corner is in correct position
        if (this.isCornerInCorrectPosition(position, cornerData.colors)) {
          cornersInPosition.push(position);
        }
        
        // Check if corner is twisted (wrong orientation)
        if (this.isCornerTwisted(position, cornerData.colors)) {
          twistedCorners.push(position);
        }
      }
    }
    
    const isValid = cornersInPosition.length === 8 && twistedCorners.length === 0;
    
    return {
      isValid,
      finalCubeState: cubeState,
      cornersInPosition,
      twistedCorners,
      errors
    };
  }

  /**
   * Check if a corner is in the correct position
   */
  private isCornerInCorrectPosition(position: string, colors: [string, string, string]): boolean {
    try {
      // Use CornerTracer to get the expected position for these colors
      const expectedPosition = this.cornerTracer.get_corner_solved_position_by_colors(colors);
      
      // Check if the corner piece should be in this position
      return expectedPosition === position;
    } catch (error) {
      console.log(`Error checking corner position: ${error}`);
      return false;
    }
  }

  /**
   * Check if a corner is twisted (wrong orientation)
   */
  private isCornerTwisted(position: string, colors: [string, string, string]): boolean {
    try {
      // Use CornerTracer to check if the corner is in the correct position but twisted
      const expectedPosition = this.cornerTracer.get_corner_solved_position_by_colors(colors);
      
      // If the corner is in the right position but the colors don't match exactly,
      // it might be twisted
      if (expectedPosition === position) {
        // Check if the colors are in the correct order
        // This is a simplified check - in a full implementation, you'd check
        // the exact color orientation
        return false; // For now, assume no twisting
      }
      
      return false;
    } catch (error) {
      console.log(`Error checking if corner is twisted: ${error}`);
      return false;
    }
  }

  /**
   * Calculate the score based on sequence comparison
   */
  private calculateSequenceScore(expected: string, user: string): number {
    if (!expected || !user) return 0;
    
    const expectedLetters = expected.trim().split(/\s+/).filter(letter => letter.length > 0);
    const userLetters = user.trim().split(/\s+/).filter(letter => letter.length > 0);
    
    if (expectedLetters.length === 0) return 100;
    
    let correctCount = 0;
    const maxLength = Math.max(expectedLetters.length, userLetters.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < expectedLetters.length && i < userLetters.length) {
        if (expectedLetters[i].toLowerCase() === userLetters[i].toLowerCase()) {
          correctCount++;
        }
      }
    }
    
    return Math.round((correctCount / expectedLetters.length) * 100);
  }
}
