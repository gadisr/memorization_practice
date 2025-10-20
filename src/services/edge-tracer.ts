import { CubeState as ScramblerCubeState, EdgePiece, EDGE_PIECES, POSITION_LETTERS } from '../models/cube-models.js';

// Types
export interface Position3D {
  face: string;
  row: number;
  col: number;
}

export interface EdgeTracerCubeState {
  [position: string]: {
    colors: [string, string];
    orientation: 'correct' | 'flipped';
  };
}

// Edge Tracer Class
export class EdgeTracer {
  private edgeNotation: Map<string, [string, string]>;
  private cubePositions: Map<string, Position3D>;
  private correlateMap: Map<string, string>;

  constructor() {
    this.edgeNotation = new Map();
    this.cubePositions = new Map();
    this.correlateMap = new Map();
    
    this.loadEdgeNotation();
    this.loadCubePositions();
    this.loadCorrelateMap();
  }

  // Load edge notation data from shared models
  private loadEdgeNotation(): void {
    for (const [notation, colors] of Object.entries(EDGE_PIECES)) {
      this.edgeNotation.set(notation.toLowerCase(), colors);
    }
  }

  // Load cube positions data from shared POSITION_LETTERS
  private loadCubePositions(): void {
    // Extract edge positions from POSITION_LETTERS (lowercase letters a-x)
    const edgeLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    
    edgeLetters.forEach(letter => {
      // Find the position of this letter in POSITION_LETTERS
      let found = false;
      for (const [faceKey, faceLetters] of Object.entries(POSITION_LETTERS)) {
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            if (faceLetters[row][col] === letter) {
              this.cubePositions.set(letter, { face: faceKey, row, col });
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
    });
  }

  // Load correlate map using the new get_secondary_edge_letter function
  private loadCorrelateMap(): void {
    // Use the new function to get secondary letters for all edge positions
    for (const notation of this.edgeNotation.keys()) {
      try {
        const secondaryLetter = this.get_secondary_edge_letter(notation);
        if (secondaryLetter !== 'invalid') {
          this.correlateMap.set(notation, secondaryLetter);
        } else {
          console.warn(`No valid secondary letter found for ${notation}`);
          // For now, we'll skip invalid positions rather than crashing
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`Error getting secondary letter for ${notation}:`, errorMessage);
        // Skip this position rather than crashing
      }
    }
  }

  // Get the solved position for an edge piece by its colors
  public get_edge_solved_position_by_colors(colors: [string, string]): string {
    // First try exact match
    for (const [notation, edgeColors] of this.edgeNotation.entries()) {
      if (edgeColors[0] === colors[0] && edgeColors[1] === colors[1]) {
        return notation;
      }
    }
    
    // Try reversed order
    for (const [notation, edgeColors] of this.edgeNotation.entries()) {
      if (edgeColors[0] === colors[1] && edgeColors[1] === colors[0]) {
        return notation;
      }
    }
    
    // If no valid edge found, this indicates an invalid scramble
    // Return a placeholder to prevent crashes, but log the issue
    console.warn(`Invalid edge color combination detected: ${colors[0]}, ${colors[1]}. This suggests a bug in the scrambling algorithm.`);
    return 'invalid';
  }


  // Given a notation, find its parallel (colors reversed)
  public get_secondary_edge_letter(notation: string): string {
    // Handle invalid notation gracefully
    if (notation === 'invalid') {
      console.warn('Attempting to get secondary letter for invalid notation');
      return 'invalid';
    }
    
    const colors = this.edgeNotation.get(notation.toLowerCase());
    if (!colors) {
      console.warn(`No edge found with notation ${notation}`);
      return 'invalid';
    }
    
    // Find the notation for the reversed colors
    const reversedColors: [string, string] = [colors[1], colors[0]];
    for (const [edgeNotation, edgeColors] of this.edgeNotation.entries()) {
      if (edgeColors[0] === reversedColors[0] && edgeColors[1] === reversedColors[1]) {
        return edgeNotation;
      }
    }
    console.warn(`No parallel edge found for notation ${notation} with colors [${colors.join(', ')}] -> [${reversedColors.join(', ')}]`);
    return 'invalid';
  }

  // Safe method to get secondary letter with fallback
  public get_secondary_edge_letter_safe(notation: string): string {
    try {
      return this.get_secondary_edge_letter(notation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Error getting secondary letter for ${notation}:`, errorMessage);
      return 'invalid';
    }
  }

  // Get colors at a position in the scrambled cube
  public get_colors_by_letter(positionLetter: string, scrambledCube: EdgeTracerCubeState): [string, string] {
    const position = this.cubePositions.get(positionLetter);
    if (!position) {
      throw new Error(`Position ${positionLetter} not found in cube positions`);
    }

    const piece = scrambledCube[positionLetter];
    if (!piece) {
      throw new Error(`No piece data found for position ${positionLetter}`);
    }

    return piece.colors;
  }

  // Check if a position is already included in traced letters
  public is_position_included(positionLetter: string, lettersList: string[]): boolean {
    const secondaryLetter = this.get_secondary_edge_letter(positionLetter);
    return lettersList.includes(positionLetter) || lettersList.includes(secondaryLetter);
  }

  // Check if an edge is flipped (correct position, wrong orientation)
  public is_edge_flipped(positionLetter: string, cube: EdgeTracerCubeState): boolean {
    const [main, secondary] = this.get_colors_by_letter(positionLetter, cube);
    const secondaryEdgeLetter = this.get_secondary_edge_letter(positionLetter);
    const solvedPosition = this.get_edge_solved_position_by_colors([main, secondary]);
    
    // If we got 'invalid', this edge is not flipped (it's in an invalid state)
    if (solvedPosition === 'invalid') {
      return false;
    }
    
    return solvedPosition === secondaryEdgeLetter;
  }

  // Check if an edge is in its correct position (either primary or secondary)
  public is_in_position(notationLetter: string, cube: EdgeTracerCubeState): boolean {
    const [main, secondary] = this.get_colors_by_letter(notationLetter, cube);
    const solvedPosition = this.get_edge_solved_position_by_colors([main, secondary]);
    const secondaryEdgeLetter = this.get_secondary_edge_letter(notationLetter);
    
    // If we got 'invalid', this edge is not in position due to invalid scramble
    if (solvedPosition === 'invalid') {
      return false;
    }
    
    // Return true if the edge is in its correct position or secondary position
    return solvedPosition === notationLetter || solvedPosition === secondaryEdgeLetter;
  }

  // Perform a single cycle starting from a position
  public do_cycle(positionLetter: string, cube: EdgeTracerCubeState, includeLastLetter: boolean = false): [string, string[]] {
    console.log(`🔍 Starting cycle from position: ${positionLetter}`);
    console.log(`📝 Include last letter: ${includeLastLetter}`);
    
    const lettersInThisCycle: string[] = [];
    let cycleString = "";
    let currentPosition = positionLetter;
    let stepCount = 0;
    const maxSteps = 25; // Prevent infinite loops
    
    // starting from second cycle, add the starting position to the cycle string
    if (includeLastLetter) {
      cycleString += currentPosition + " ";  
      console.log(`  Added starting position: ${currentPosition}`);
    }

    while (!this.is_position_included(currentPosition, lettersInThisCycle)) {
      stepCount++;
      console.log(`  Step ${stepCount}: Current position: ${currentPosition}`);
      
      const [main, secondary] = this.get_colors_by_letter(currentPosition, cube);
      console.log(`  Colors at ${currentPosition}: [${main}, ${secondary}]`);
      
      const nextLetter = this.get_edge_solved_position_by_colors([main, secondary]);
      console.log(`  Next position: ${nextLetter}`);
      
      // If the next position is invalid, stop this cycle gracefully
      if (nextLetter === 'invalid') {
        console.warn(`  Encountered invalid next position from ${currentPosition}. Ending cycle early.`);
        break;
      }
      
      // Only add to cycle string if the piece is not in its correct position
      if (nextLetter !== currentPosition) {
        cycleString += nextLetter + " ";
        console.log(`  Added to cycle: ${nextLetter}`);
      }
      
      lettersInThisCycle.push(currentPosition);
      currentPosition = nextLetter;
      
      if (stepCount >= maxSteps) {
        console.error(`❌ Cycle exceeded maximum steps (${maxSteps}). Possible infinite loop.`);
        break;
      }
    }
    
    if (!includeLastLetter) {
      // Remove last letter written
      const words = cycleString.trim().split(" ");
      words.pop();
      cycleString = words.join(" ");
      console.log(`  Removed last letter from cycle: ${cycleString}`);
    } 
    
    console.log(`✅ Cycle completed: "${cycleString.trim()}"`);
    console.log(`📝 Letters in cycle: [${lettersInThisCycle.join(', ')}]`);
    
    return [cycleString, lettersInThisCycle];
  }

  // Main function to perform full edge tracing
  public do_full_trace(cube: EdgeTracerCubeState): string {
    console.log('🔍 Starting full edge trace...');
    console.log('📊 Cube state:', Object.keys(cube).length, 'edges loaded');
    
    let startingPosition = "b";
    let lettersNotTraced = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", 
                           "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x"];
    // Remove "b" from letters_not_traced since it's the buffer
    lettersNotTraced = lettersNotTraced.filter(letter => letter !== "b");
    
    console.log('📝 Initial letters to trace:', lettersNotTraced);
    
    // Remove edges that are already in their correct position
    const edgesInPosition = lettersNotTraced.filter(letter => this.is_in_position(letter, cube));
    console.log('✅ Edges already in position:', edgesInPosition);
    
    lettersNotTraced = lettersNotTraced.filter(letter => !this.is_in_position(letter, cube));
    console.log('📝 Letters remaining to trace:', lettersNotTraced);
    
    let tracingString = "";
    let includeLastLetter = false; // Only for the first cycle
    let cycleCount = 0;
    const maxCycles = 6; // Prevent infinite loops
    
    while (lettersNotTraced.length > 0 && cycleCount < maxCycles) {
      cycleCount++;
      console.log(`\n🔄 Starting cycle ${cycleCount} from position: ${startingPosition}`);
      
      try {
        const [cycleString, lettersInThisCycle] = this.do_cycle(startingPosition, cube, includeLastLetter);
        includeLastLetter = true;
        console.log('✅ Cycle traced:', cycleString);
        console.log('📝 Letters in this cycle:', lettersInThisCycle);
        
        // Remove letters_in_this_cycle and their secondary letters from letters_not_traced
        lettersInThisCycle.forEach(letter => {
          const secondaryLetter = this.get_secondary_edge_letter(letter);
          lettersNotTraced = lettersNotTraced.filter(l => l !== letter && l !== secondaryLetter);
        });
        
        console.log(`📝 Letters remaining after cycle: [${lettersNotTraced.join(', ')}]`);
        
        tracingString += (tracingString ? ' ' : '') + cycleString;
        
        // Find next starting position from remaining letters
        if (lettersNotTraced.length > 0) {
          startingPosition = lettersNotTraced[0];
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
        console.error(`❌ Error in cycle ${cycleCount}:`, errorMessage);
        console.error('Stack:', errorStack);
        throw error;
      }
    }
    
    // Check if we hit the cycle limit
    if (cycleCount >= maxCycles && lettersNotTraced.length > 0) {
      console.warn(`⚠️ Reached maximum cycle limit (${maxCycles}). Remaining untraced letters: [${lettersNotTraced.join(', ')}]`);
    }
    
    console.log('✅ Full edge trace completed:', tracingString);
    return tracingString;
  }

  // Helper method to create a solved cube state for testing
  public createSolvedCubeState(): EdgeTracerCubeState {
    const cubeState: EdgeTracerCubeState = {};
    
    // Create solved state where each piece is in its correct position
    for (const [notation, colors] of this.edgeNotation.entries()) {
      cubeState[notation] = {
        colors: colors,
        orientation: 'correct'
      };
    }
    
    return cubeState;
  }

  // Helper method to get all edge positions
  public getAllEdgePositions(): string[] {
    return Array.from(this.edgeNotation.keys());
  }


  // Convert scrambler cube state to edge tracer format
  public convertFromScramblerCube(scramblerCube: ScramblerCubeState): EdgeTracerCubeState {
    const edgeCubeState: EdgeTracerCubeState = {};
    
    // Extract edge piece colors using the embedded position mapping
    const allEdgePositions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                              'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    
    for (const position of allEdgePositions) {
      const mainPos = this.cubePositions.get(position);
      const secondaryPosition = this.get_secondary_edge_letter_safe(position);
      
      // Skip if we got invalid secondary position
      if (secondaryPosition === 'invalid') {
        console.warn(`Skipping position ${position} due to invalid secondary position`);
        continue;
      }
      
      const secondaryPos = this.cubePositions.get(secondaryPosition);
      
      if (mainPos && secondaryPos) {
        // Get the main color from the main position
        const mainColor = scramblerCube.faces[mainPos.face as keyof typeof scramblerCube.faces].colors[mainPos.row][mainPos.col];
        
        // Get the secondary color from the secondary position
        const secondaryColor = scramblerCube.faces[secondaryPos.face as keyof typeof scramblerCube.faces].colors[secondaryPos.row][secondaryPos.col];
        
        
        edgeCubeState[position] = {
          colors: [mainColor, secondaryColor],
          orientation: 'correct'
        };
      } else {
        console.warn(`Missing position data for ${position} or ${secondaryPosition}`);
      }
    }
    
    return edgeCubeState;
  }

  // Extract edge piece colors from a scrambled cube state (legacy method)
  public extractEdgeColorsFromCube(cubeState: any): EdgeTracerCubeState {
    const edgeCubeState: EdgeTracerCubeState = {};
    
    // Extract edge piece colors using the embedded position mapping
    const allEdgePositions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                              'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    // Extensive logging for debugging and transparency
    console.log("=== Extracting edge piece colors from scrambled cube ===");
    if (!cubeState || !cubeState.faces) {
      console.error("Invalid cubeState input! Expected cubeState.faces to exist.", cubeState);
    }
    console.log("cubeState.faces keys:", Object.keys(cubeState.faces || {}));
    
    allEdgePositions.forEach((position, idx) => {
      const mainPos = this.cubePositions.get(position);
      const secondaryLetter = this.get_secondary_edge_letter_safe(position);
      
      // Skip if we got invalid secondary letter
      if (secondaryLetter === 'invalid') {
        console.warn(`[${idx}] Position '${position}': Skipping due to invalid secondary letter`);
        return;
      }
      
      const secondaryPos = secondaryLetter ? this.cubePositions.get(secondaryLetter) : undefined;
      
      if (!mainPos) {
        console.warn(`[${idx}] Position '${position}': No mapping found in cubePositions!`);
      }
      if (!secondaryLetter) {
        console.warn(`[${idx}] Position '${position}': No secondary letter (correlate) found!`);
      }
      if (!secondaryPos && secondaryLetter) {
        console.warn(`[${idx}] Position '${position}': No mapping found for secondary letter '${secondaryLetter}'.`);
      }
      let mainColor = undefined, secondaryColor = undefined;
      if (mainPos && cubeState.faces[mainPos.face]) {
        const faceColors = cubeState.faces[mainPos.face].colors;
        if (faceColors[mainPos.row] && typeof faceColors[mainPos.row][mainPos.col] !== 'undefined') {
          mainColor = faceColors[mainPos.row][mainPos.col];
        } else {
          console.warn(`Main color lookup failed for [${mainPos.face}] row=${mainPos.row}, col=${mainPos.col}, letter=${position}`);
        }
      }
      if (secondaryPos && cubeState.faces[secondaryPos.face]) {
        const faceColors2 = cubeState.faces[secondaryPos.face].colors;
        if (faceColors2[secondaryPos.row] && typeof faceColors2[secondaryPos.row][secondaryPos.col] !== 'undefined') {
          secondaryColor = faceColors2[secondaryPos.row][secondaryPos.col];
        } else {
          console.warn(`Secondary color lookup failed for [${secondaryPos.face}] row=${secondaryPos.row}, col=${secondaryPos.col}, letter=${secondaryLetter}`);
        }
      }
      console.log(
        `EdgeLetter: ${position} | Main: ${mainPos ? `${mainPos.face}@(${mainPos.row},${mainPos.col})` : 'N/A'} = ${mainColor} | ` +
        `Secondary (${secondaryLetter}): ${secondaryPos ? `${secondaryPos.face}@(${secondaryPos.row},${secondaryPos.col})` : 'N/A'} = ${secondaryColor}`
      );
    });
    for (const position of allEdgePositions) {
      const mainPos = this.cubePositions.get(position);
      const secondaryPosition = this.get_secondary_edge_letter_safe(position);
      
      // Skip if we got invalid secondary position
      if (secondaryPosition === 'invalid') {
        console.warn(`Skipping position ${position} due to invalid secondary position`);
        continue;
      }
      
      const secondaryPos = this.cubePositions.get(secondaryPosition);
      
      if (mainPos && secondaryPos) {
        // Get the main color from the main position
        const mainColor = cubeState.faces[mainPos.face].colors[mainPos.row][mainPos.col];
        
        // Get the secondary color from the secondary position
        const secondaryColor = cubeState.faces[secondaryPos.face].colors[secondaryPos.row][secondaryPos.col];
        
        edgeCubeState[position] = {
          colors: [mainColor, secondaryColor],
          orientation: 'correct'
        };
      } else {
        console.warn(`Missing position data for ${position} or ${secondaryPosition}`);
      }
    }
    
    return edgeCubeState;
  }

}

// Export the main function for easy use
export function traceEdges(cubeState: EdgeTracerCubeState): string {
  const tracer = new EdgeTracer();
  return tracer.do_full_trace(cubeState);
}

// New function to trace edges from scrambler cube state
export function traceEdgesFromScrambler(scramblerCube: ScramblerCubeState): string {
  const tracer = new EdgeTracer();
  const edgeCubeState = tracer.convertFromScramblerCube(scramblerCube);
  return tracer.do_full_trace(edgeCubeState);
}
