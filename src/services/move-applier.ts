// Move application service for EdgeTracerCubeState
// Converts between CubeState (scrambler) and EdgeTracerCubeState (tracer)

import { CubeState, CubeFace, FullMove, MoveVariant, POSITION_LETTERS, EDGE_PIECES, FACE_COLORS } from '../models/cube-models.js';
import { EdgeTracerCubeState, Position3D, EdgeTracer } from './edge-tracer.js';
import { CornerTracer, CornerState, convertFromScramblerCube } from './corner-tracer.js';
import { scramble_cube, rotate_face_clockwise, rotate_face_counter_clockwise, apply_move } from './cube-scrambler.js';

// Edge swap algorithm - fixed sequence
const EDGE_SWAP_ALGORITHM = "R U R' U' R' F R2 U' R' U' R U R' F'";

export class MoveApplier {
  public setupMoves: Map<string, string> = new Map();
  private edgeTracer: EdgeTracer;
  private cornerTracer: CornerTracer;

  constructor() {
    this.loadSetupMoves();
    this.edgeTracer = new EdgeTracer();
    this.cornerTracer = new CornerTracer();
  }

  private loadSetupMoves(): void {
    // Load setup moves from the JSON data
    const setupMovesData = {
      "a": "Lw2 D' L2",
      "b": "", // Buffer position - no setup move needed
      "c": "Lw2 D L2", 
      "d": "", // No setup move needed for position d
      "e": "L' Dw L'",
      "f": "Dw' L",
      "g": "L Dw L'",
      "h": "Dw L'",
      "i": "Lw D' L2",
      "j": "Dw2 L",
      "k": "Lw D L2",
      "l": "L'",
      "n": "Dw L",
      "o": "D' Lw D L2",
      "p": "Dw' L'",
      "q": "Lw' D L2",
      "r": "L",
      "s": "Lw' D' L2",
      "t": "Dw2 L'",
      "u": "D' L2",
      "v": "D2 L2",
      "w": "D L2",
      "x": "L2"
    };

    for (const [letter, move] of Object.entries(setupMovesData)) {
      this.setupMoves.set(letter, move);
    }
  }

  /**
   * Convert CubeState (scrambler) to EdgeTracerCubeState (tracer)
   * Reuses existing EdgeTracer functionality to avoid duplication
   */
  public convertToEdgeTracerState(cubeState: CubeState): EdgeTracerCubeState {
    // Use the existing EdgeTracer conversion method
    return this.edgeTracer.convertFromScramblerCube(cubeState);
  }

  /**
   * Convert CubeState to CornerTracerState
   */
  public convertToCornerTracerState(cubeState: CubeState): CornerState {
    // Use the existing CornerTracer conversion function
    return convertFromScramblerCube(cubeState);
  }

  /**
   * Convert EdgeTracerCubeState back to CubeState
   */
  public convertToCubeState(edgeTracerState: EdgeTracerCubeState): CubeState {
    // Create solved cube using FACE_COLORS from cube-models
    const cubeState: CubeState = {
      faces: {
        U: { center: FACE_COLORS.U, colors: this.createFaceColors(FACE_COLORS.U) },
        L: { center: FACE_COLORS.L, colors: this.createFaceColors(FACE_COLORS.L) },
        F: { center: FACE_COLORS.F, colors: this.createFaceColors(FACE_COLORS.F) },
        R: { center: FACE_COLORS.R, colors: this.createFaceColors(FACE_COLORS.R) },
        B: { center: FACE_COLORS.B, colors: this.createFaceColors(FACE_COLORS.B) },
        D: { center: FACE_COLORS.D, colors: this.createFaceColors(FACE_COLORS.D) }
      }
    };

    // Apply edge colors from EdgeTracerCubeState
    for (const [letter, edgeData] of Object.entries(edgeTracerState)) {
      this.applyEdgeToCubeState(cubeState, letter, edgeData);
    }

    return cubeState;
  }

  /**
   * Create a 3x3 array filled with the same color
   */
  private createFaceColors(color: string): string[][] {
    return [
      [color, color, color],
      [color, color, color],
      [color, color, color]
    ];
  }

  /**
   * Apply a sequence of moves using cube-scrambler and return the final EdgeTracerCubeState
   * This is the new simplified approach that uses only cube-scrambler for move application
   */
  public applySequenceToEdgeTracerState(
    cubeState: EdgeTracerCubeState, 
    sequence: string
  ): { success: boolean; finalState: EdgeTracerCubeState; errors: string[] } {
    
    const errors: string[] = [];
    
    try {
      // Convert EdgeTracerCubeState to CubeState for move application
      const initialCubeState = this.convertToCubeState(cubeState);
      
      // Convert sequence of letters to sequence of moves
      const moveSequence = this.convertLetterSequenceToMoves(sequence);
      
      // Apply moves using cube-scrambler
      const finalCubeState = this.applyMovesToCube(initialCubeState, moveSequence);
      
      // Convert back to EdgeTracerCubeState
      const finalEdgeTracerState = this.convertToEdgeTracerState(finalCubeState);
      
      
      return {
        success: true,
        finalState: finalEdgeTracerState,
        errors
      };
      
    } catch (error) {
      errors.push(`Error applying sequence: ${error}`);
      
      return {
        success: false,
        finalState: cubeState, // Return original state on error
        errors
      };
    }
  }

  /**
   * Convert a sequence of edge letters to a sequence of cube moves
   * Each letter becomes: setup move + edge swap algorithm + inverse setup move
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
      const setupMove = this.setupMoves.get(letter);
      if (setupMove === undefined) {
        throw new Error(`No setup move found for letter: ${letter}. Valid edge letters are: ${Array.from(this.setupMoves.keys()).join(', ')}`);
      }
      
      // Skip if setup move is empty (like buffer position)
      if (setupMove.trim() === '') {
        continue;
      }
      
      // Add: setup move + edge swap algorithm + inverse setup move
      moves.push(setupMove);
      moves.push(EDGE_SWAP_ALGORITHM);
      moves.push(this.getInverseMove(setupMove));
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
    
    console.log('🔧 === APPLYING MOVES TO CUBE ===');
    console.log('📝 Move sequence:', moveSequence);
    console.log('🔢 Total moves:', moves.length);
    console.log('');
    
    // Apply each move using the existing apply_move function from cube-scrambler
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (move) {
        console.log(`🔄 Move ${i + 1}/${moves.length}: ${move}`);
        // TODO: Use the existing apply_move function from cube-scrambler
        // For now, we'll use a placeholder that needs to be implemented
        this.applySingleMoveToCube(cube, move as FullMove);
      }
    }
    
    console.log('✅ Move application completed!');
    return cube;
  }

  /**
   * Apply a single move to a cube state using the existing apply_move function from cube-scrambler
   */
  private applySingleMoveToCube(cube: CubeState, move: FullMove): void {
    // Use the existing apply_move function from cube-scrambler.ts
    apply_move(cube, move);
  }



  /**
   * Create a solved cube state using FACE_COLORS
   */
  public createSolvedCube(): CubeState {
    return {
      faces: {
        U: { center: FACE_COLORS.U, colors: this.createFaceColors(FACE_COLORS.U) },
        L: { center: FACE_COLORS.L, colors: this.createFaceColors(FACE_COLORS.L) },
        F: { center: FACE_COLORS.F, colors: this.createFaceColors(FACE_COLORS.F) },
        R: { center: FACE_COLORS.R, colors: this.createFaceColors(FACE_COLORS.R) },
        B: { center: FACE_COLORS.B, colors: this.createFaceColors(FACE_COLORS.B) },
        D: { center: FACE_COLORS.D, colors: this.createFaceColors(FACE_COLORS.D) }
      }
    };
  }


  /**
   * Get inverse of a move sequence
   */
  public getInverseMove(moveSequence: string): string {
    const moves = moveSequence.trim().split(/\s+/);
    const inverseMoves: string[] = [];
    
    // Process moves in reverse order
    for (let i = moves.length - 1; i >= 0; i--) {
      const move = moves[i];
      const inverseMove = this.getInverseSingleMove(move);
      inverseMoves.push(inverseMove);
    }
    
    return inverseMoves.join(' ');
  }

  /**
   * Get inverse of a single move
   */
  private getInverseSingleMove(move: string): string {
    if (move.endsWith("'")) {
      return move.slice(0, -1); // Remove prime
    } else if (move.endsWith("2")) {
      return move; // Double moves are their own inverse
    } else {
      return move + "'"; // Add prime
    }
  }


  /**
   * Apply edge data to cube state
   * This is a simplified implementation - in practice, we primarily work with EdgeTracerCubeState
   */
  private applyEdgeToCubeState(cubeState: CubeState, letter: string, edgeData: { colors: [string, string] }): void {
    // Find the position and apply the colors
    for (const [faceKey, faceLetters] of Object.entries(POSITION_LETTERS)) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (faceLetters[row][col] === letter) {
            const face = cubeState.faces[faceKey as keyof typeof cubeState.faces];
            face.colors[row][col] = edgeData.colors[0];
            // Note: Secondary color application would require complex edge connection logic
            // For now, this is a simplified implementation
            break;
          }
        }
      }
    }
  }

}
