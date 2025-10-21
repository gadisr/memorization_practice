// Main sequence validation service for edge tracing drills

import { EdgeTracer } from './edge-tracer.js';
import { MoveApplier } from './move-applier.js';
import { scramble_cube, apply_move } from './cube-scrambler.js';
import { CubeState, FullMove } from '../models/cube-models.js';

// Edge swap algorithm - fixed sequence
const EDGE_SWAP_ALGORITHM = "R U R' U' R' F R2 U' R' U' R U R' F'";
const CORNER_SWAP_ALGORITHM = "R U' R' U' R U R' F' R U R' U' R' F R";

import { 
  SequenceValidationInput, 
  DrillValidationResult, 
  ValidationResult,
  MoveApplicationStep 
} from '../models/sequence-validation.js';

export class SequenceValidator {
  public edgeTracer: EdgeTracer;
  public moveApplier: MoveApplier;

  constructor() {
    this.edgeTracer = new EdgeTracer();
    this.moveApplier = new MoveApplier();
  }

  /**
   * Main function to validate a drill sequence
   * Takes a scramble string and user's traced sequence, returns validation result
   */
  public validateDrillSequence(input: SequenceValidationInput): DrillValidationResult {
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
      
      // Step 3: Convert to EdgeTracerCubeState for tracing
      const initialEdgeTracerCube = this.moveApplier.convertToEdgeTracerState(scrambledCube);
      
      // Step 4: Get expected sequence from EdgeTracer
      const expectedSequence = this.edgeTracer.do_full_trace(initialEdgeTracerCube);
      
      // Step 5: Apply user sequence to the cube using cube-scrambler
      const finalCube = this.applySequenceToCube(scrambledCube, input.userTracingSequence);
      
      // Step 6: Convert final cube state and validate
      const finalEdgeTracerCube = this.moveApplier.convertToEdgeTracerState(finalCube);
      const validationResult = this.validateCubeState(finalEdgeTracerCube);
      // Step 7: Calculate score
      const score = this.calculateSequenceScore(expectedSequence, input.userTracingSequence);
      
      // Step 8: Return comprehensive result
      const result = {
        isValid: validationResult.isValid && errors.length === 0,
        expectedSequence,
        userSequence: input.userTracingSequence,
        finalCubeState: finalEdgeTracerCube,
        edgesInPosition: validationResult.edgesInPosition,
        flippedEdges: validationResult.flippedEdges,
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
  public scrambleAndValidate(scrambleString: string, userSequence: string): DrillValidationResult {
    return this.validateDrillSequence({
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
    // Convert sequence of letters to sequence of moves
    const moveSequence = this.convertLetterSequenceToMoves(sequence);
    
    // Apply moves using cube-scrambler
    return this.applyMovesToCube(cube, moveSequence);
  }

  /**
   * Convert a sequence of edge letters to a sequence of cube moves
   */
  private convertLetterSequenceToMoves(sequence: string): string {
    const letters = sequence.trim().split(/\s+/).filter(letter => letter.length > 0);
    const moves: string[] = [];
    
    for (const letter of letters) {
      // Check if this is the buffer position
      if (letter === 'b') {
        throw new Error(`Letter 'b' is the buffer position and should not appear in tracing sequences. Buffer is where edges get swapped TO, not a target edge to swap.`);
      }
      
      // Get setup move for this letter
      const setupMove = this.moveApplier.setupMoves.get(letter);
      if (setupMove === undefined) {
        throw new Error(`No setup move found for letter: ${letter}. Valid edge letters are: ${Array.from(this.moveApplier.setupMoves.keys()).join(', ')}`);
      }
      
      // Skip if setup move is empty (like buffer position or position d)
      if (setupMove.trim() === '') {
        continue;
      }
      
      // Add: setup move + edge swap algorithm + inverse setup move
      moves.push(setupMove);
      moves.push(EDGE_SWAP_ALGORITHM);
      moves.push(this.moveApplier.getInverseMove(setupMove));
    }
    
    return moves.join(' ');
  }

  /**
   * Apply a sequence of moves to an existing cube state using cube-scrambler logic
   */
  private applyMovesToCube(initialCube: CubeState, moveSequence: string): CubeState {
    // Create a deep copy of the initial cube
    const cube = JSON.parse(JSON.stringify(initialCube));
    
    // Split the move sequence
    const moves = moveSequence.trim().split(/\s+/).filter(move => move.trim());
    
    // Apply each move using the existing apply_move function from cube-scrambler
    for (const move of moves) {
      if (move) {
        apply_move(cube, move as FullMove);
      }
    }
    return cube;
  }

  /**
   * Get inverse of a setup move
   */
  public getInverseSetupMove(setupMove: string): string {
    return this.moveApplier.getInverseMove(setupMove);
  }

  /**
   * Check if all edges are in their correct positions
   */
  public areAllEdgesInPosition(cube: any): boolean { // EdgeTracerCubeState
    const validation = this.validateCubeState(cube);
    // Check if all 24 edges are in their correct positions
    return validation.edgesInPosition.length === 24;
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
    
    // Penalty for length differences (more lenient for partial sequences)
    const lengthDifference = Math.abs(expectedLetters.length - userLetters.length);
    const lengthPenalty = Math.min(lengthDifference * 2, 10); // Max 10% penalty, 2% per missing letter
    score = Math.max(0, score - lengthPenalty);
    
    return Math.round(score);
  }

  /**
   * Validate cube state and check edge positions
   */
  private validateCubeState(cube: any): ValidationResult { // EdgeTracerCubeState
    
    const edgesInPosition: string[] = [];
    const flippedEdges: string[] = [];
    const errors: string[] = [];
    
    // Get all edge positions
    const allEdgePositions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                             'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    
    
    for (const position of allEdgePositions) {
      if (cube[position]) {
        const edgeData = cube[position];
        
        // Check if edge is in correct position
        const inCorrectPosition = this.isEdgeInCorrectPosition(position, edgeData);
        
        if (inCorrectPosition) {
          edgesInPosition.push(position);
          
          // Check if it's flipped
          const isFlipped = this.isEdgeFlipped(position, edgeData);
          
          if (isFlipped) {
            flippedEdges.push(position);
          }
        } else {
        }
      } else {
        const errorMsg = `Missing edge data for position: ${position}`;
        errors.push(errorMsg);
      }
    }
    
    // Validation is successful if there are no errors and the sequence was processed correctly
    const isValid = errors.length === 0;
    
    
    
    return {
      isValid,
      finalCubeState: cube,
      edgesInPosition,
      flippedEdges,
      errors
    };
  }

  /**
   * Check if an edge is in its correct position
   */
  private isEdgeInCorrectPosition(position: string, edgeData: { colors: [string, string] }): boolean {
    try {
      // console.log(`    🔍 Checking if edge at ${position} is in correct position...`);
      
      // Get the expected colors for this position from EdgeTracer
      const expectedPosition = this.edgeTracer.get_edge_solved_position_by_colors(edgeData.colors);
      // console.log(`    📍 Expected position for colors [${edgeData.colors.join(', ')}]: ${expectedPosition}`);
      
      // Check if the edge piece should be in this position
      const normalMatch = expectedPosition === position;
      const flippedMatch = this.edgeTracer.get_edge_solved_position_by_colors([edgeData.colors[1], edgeData.colors[0]]) === position;
      
      // console.log(`    📊 Normal match (${position} === ${expectedPosition}): ${normalMatch}`);
      // console.log(`    📊 Flipped match: ${flippedMatch}`);
      
      const result = normalMatch || flippedMatch;
      // console.log(`    ✅ Final result: ${result}`);
      
      return result;
    } catch (error) {
      console.log(`    ❌ Error checking edge position: ${error}`);
      return false;
    }
  }

  /**
   * Check if an edge is flipped (correct position, wrong orientation)
   */
  private isEdgeFlipped(position: string, edgeData: { colors: [string, string] }): boolean {
    try {
      console.log(`    🔍 Checking if edge at ${position} is flipped...`);
      
      // Check if the colors are in the wrong order
      const expectedPosition = this.edgeTracer.get_edge_solved_position_by_colors(edgeData.colors);
      const flippedPosition = this.edgeTracer.get_edge_solved_position_by_colors([edgeData.colors[1], edgeData.colors[0]]);
      
      // console.log(`    📍 Expected position: ${expectedPosition}`);
      // console.log(`    📍 Flipped position: ${flippedPosition}`);
      // console.log(`    📍 Current position: ${position}`);
      
      const result = expectedPosition !== position && flippedPosition === position;
      console.log(`    ✅ Is flipped: ${result}`);
      
      return result;
    } catch (error) {
      console.log(`    ❌ Error checking if edge is flipped: ${error}`);
      return false;
    }
  }

  /**
   * Get detailed analysis of a validation result
   */
  public analyzeValidationResult(result: DrillValidationResult): {
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
    details.push(`Edges in position: ${result.edgesInPosition.length}/24`);
    details.push(`Flipped edges: ${result.flippedEdges.length}`);
    
    if (result.errors.length > 0) {
      details.push(`Errors: ${result.errors.join(', ')}`);
    }
    
    // Suggestions
    if (result.score < 100) {
      if (result.edgesInPosition.length < 24) {
        suggestions.push("Focus on getting all edges in their correct positions");
      }
      if (result.flippedEdges.length > 0) {
        suggestions.push("Pay attention to edge orientation - some edges are flipped");
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
export function validateDrillSequence(input: SequenceValidationInput): DrillValidationResult {
  const validator = new SequenceValidator();
  return validator.validateDrillSequence(input);
}

export function scrambleAndValidate(scrambleString: string, userSequence: string): DrillValidationResult {
  const validator = new SequenceValidator();
  return validator.scrambleAndValidate(scrambleString, userSequence);
}

export function applySequenceToCube(cube: any, sequence: string): any {
  const validator = new SequenceValidator();
  return validator.applySequenceToCube(cube, sequence);
}

export function getInverseSetupMove(setupMove: string): string {
  const validator = new SequenceValidator();
  return validator.getInverseSetupMove(setupMove);
}

export function areAllEdgesInPosition(cube: any): boolean {
  const validator = new SequenceValidator();
  return validator.areAllEdgesInPosition(cube);
}

export function calculateSequenceScore(expected: string, user: string): number {
  const validator = new SequenceValidator();
  return validator.calculateSequenceScore(expected, user);
}
