// Types
export interface Position3D {
  face: string;
  row: number;
  col: number;
}

export interface CubeState {
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

  // Load edge notation data (embedded in class)
  private loadEdgeNotation(): void {
    const edgeNotationData = [
      { "colors": ["white", "blue"], "notation": "a" },
      { "colors": ["white", "red"], "notation": "b" },
      { "colors": ["white", "green"], "notation": "c" },
      { "colors": ["white", "orange"], "notation": "d" },
      { "colors": ["orange", "white"], "notation": "e" },
      { "colors": ["orange", "green"], "notation": "f" },
      { "colors": ["orange", "yellow"], "notation": "g" },
      { "colors": ["orange", "blue"], "notation": "h" },
      { "colors": ["green", "white"], "notation": "i" },
      { "colors": ["green", "red"], "notation": "j" },
      { "colors": ["green", "yellow"], "notation": "k" },
      { "colors": ["green", "orange"], "notation": "l" },
      { "colors": ["red", "white"], "notation": "m" },
      { "colors": ["red", "blue"], "notation": "n" },
      { "colors": ["red", "yellow"], "notation": "o" },
      { "colors": ["red", "green"], "notation": "p" },
      { "colors": ["blue", "white"], "notation": "q" },
      { "colors": ["blue", "orange"], "notation": "r" },
      { "colors": ["blue", "yellow"], "notation": "s" },
      { "colors": ["blue", "red"], "notation": "t" },
      { "colors": ["yellow", "green"], "notation": "u" },
      { "colors": ["yellow", "red"], "notation": "v" },
      { "colors": ["yellow", "blue"], "notation": "w" },
      { "colors": ["yellow", "orange"], "notation": "x" }
    ];
    
    edgeNotationData.forEach(edge => {
      this.edgeNotation.set(edge.notation.toLowerCase(), edge.colors as [string, string]);
    });
  }

  // Load cube positions data (embedded in class)
  private loadCubePositions(): void {
    // Direct mapping of each letter to its correct position
    const positionMapping = {
      // U face - top face
      'a': { face: 'U', row: 0, col: 1 },
      'b': { face: 'U', row: 1, col: 2 }, 
      'c': { face: 'U', row: 2, col: 1 },   // CORRECTED: was U[2][2]
      'd': { face: 'U', row: 1, col: 0 },
      
      // L face - left face  
      'e': { face: 'L', row: 0, col: 1 },
      'f': { face: 'L', row: 1, col: 2 },
      'g': { face: 'L', row: 2, col: 1 },
      'h': { face: 'L', row: 1, col: 0 },
      
      // F face - front face
      'i': { face: 'F', row: 0, col: 1 },
      'j': { face: 'F', row: 1, col: 2 },
      'k': { face: 'F', row: 2, col: 1 },
      'l': { face: 'F', row: 1, col: 0 },
      
      // R face - right face
      'm': { face: 'R', row: 0, col: 1 },
      'n': { face: 'R', row: 1, col: 2 },
      'o': { face: 'R', row: 2, col: 1 },
      'p': { face: 'R', row: 1, col: 0 },
      
      // B face - back face
      'q': { face: 'B', row: 0, col: 1 },
      'r': { face: 'B', row: 1, col: 2 },
      's': { face: 'B', row: 2, col: 1 },
      't': { face: 'B', row: 1, col: 0 },
      
      // D face - down face
      'u': { face: 'D', row: 0, col: 1 },
      'v': { face: 'D', row: 1, col: 2 },
      'w': { face: 'D', row: 2, col: 1 },
      'x': { face: 'D', row: 1, col: 0 }
    };
    
    // Store the mappings
    for (const [letter, position] of Object.entries(positionMapping)) {
      this.cubePositions.set(letter, position);
    }
  }

  // Load correlate map using the new get_secondary_edge_letter function
  private loadCorrelateMap(): void {
    // Use the new function to get secondary letters for all edge positions
    for (const notation of this.edgeNotation.keys()) {
      const secondaryLetter = this.get_secondary_edge_letter(notation);
      this.correlateMap.set(notation, secondaryLetter);
    }
  }

  // Get the solved position for an edge piece by its colors
  public get_edge_solved_position_by_colors(colors: [string, string]): string {
    for (const [notation, edgeColors] of this.edgeNotation.entries()) {
      if (edgeColors[0] === colors[0] && edgeColors[1] === colors[1]) {
        return notation;
      }
    }
    throw new Error(`No edge found with colors ${colors[0]}, ${colors[1]}`);
  }


  // Given a notation, find its parallel (colors reversed)
  public get_secondary_edge_letter(notation: string): string {
    const colors = this.edgeNotation.get(notation.toLowerCase());
    if (!colors) {
      throw new Error(`No edge found with notation ${notation}`);
    }
    
    // Find the notation for the reversed colors
    const reversedColors: [string, string] = [colors[1], colors[0]];
    for (const [edgeNotation, edgeColors] of this.edgeNotation.entries()) {
      if (edgeColors[0] === reversedColors[0] && edgeColors[1] === reversedColors[1]) {
        return edgeNotation;
      }
    }
    throw new Error(`No parallel edge found for notation ${notation}`);
  }

  // Get colors at a position in the scrambled cube
  public get_colors_by_letter(positionLetter: string, scrambledCube: CubeState): [string, string] {
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
  public is_edge_flipped(positionLetter: string, cube: CubeState): boolean {
    const [main, secondary] = this.get_colors_by_letter(positionLetter, cube);
    const secondaryEdgeLetter = this.get_secondary_edge_letter(positionLetter);
    return this.get_edge_solved_position_by_colors([main, secondary]) === secondaryEdgeLetter;
  }

  // Check if an edge is in its correct position (either primary or secondary)
  public is_in_position(notationLetter: string, cube: CubeState): boolean {
    const [main, secondary] = this.get_colors_by_letter(notationLetter, cube);
    const solvedPosition = this.get_edge_solved_position_by_colors([main, secondary]);
    const secondaryEdgeLetter = this.get_secondary_edge_letter(notationLetter);
    
    // Return true if the edge is in its correct position or secondary position
    return solvedPosition === notationLetter || solvedPosition === secondaryEdgeLetter;
  }

  // Perform a single cycle starting from a position
  public do_cycle(positionLetter: string, cube: CubeState, includeLastLetter: boolean = false): [string, string[]] {
    const lettersInThisCycle: string[] = [];
    let cycleString = "";
    let currentPosition = positionLetter;
    
    // starting from second cycle, add the starting position to the cycle string
    if (includeLastLetter) {
      cycleString += currentPosition + " ";  
    }

    while (!this.is_position_included(currentPosition, lettersInThisCycle)) {
      const [main, secondary] = this.get_colors_by_letter(currentPosition, cube);
      const nextLetter = this.get_edge_solved_position_by_colors([main, secondary]);
      
      // Only add to cycle string if the piece is not in its correct position
      if (nextLetter !== currentPosition) {
        cycleString += nextLetter + " ";
      }
      
      lettersInThisCycle.push(currentPosition);
      currentPosition = nextLetter;
    }
    
    if (!includeLastLetter) {
      // Remove last letter written
      const words = cycleString.trim().split(" ");
      words.pop();
      cycleString = words.join(" ");
    } 
    
    return [cycleString, lettersInThisCycle];
  }

  // Main function to perform full edge tracing
  public do_full_trace(cube: CubeState): string {
    let startingPosition = "b";
    let lettersNotTraced = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", 
                           "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x"];
    // Remove "b" from letters_not_traced since it's the buffer
    lettersNotTraced = lettersNotTraced.filter(letter => letter !== "b");
    
    // Remove edges that are already in their correct position
    lettersNotTraced = lettersNotTraced.filter(letter => !this.is_in_position(letter, cube));
    
    let tracingString = "";
    let includeLastLetter = false; // Only for the first cycle
    
    while (lettersNotTraced.length > 0) {
      const [cycleString, lettersInThisCycle] = this.do_cycle(startingPosition, cube, includeLastLetter);
      includeLastLetter = true;
      console.log('Cycle traced:', cycleString);
      console.log('Letters in this cycle:', lettersInThisCycle);
      
      // Remove letters_in_this_cycle and their secondary letters from letters_not_traced
      lettersInThisCycle.forEach(letter => {
        const secondaryLetter = this.get_secondary_edge_letter(letter);
        lettersNotTraced = lettersNotTraced.filter(l => l !== letter && l !== secondaryLetter);
      });
      
      console.log(`Letters remaining after cycle: [${lettersNotTraced.join(', ')}]`);
      
      tracingString += cycleString;
      
      // Find next starting position from remaining letters
      if (lettersNotTraced.length > 0) {
        startingPosition = lettersNotTraced[0];
      }
    }
    
    return tracingString;
  }

  // Helper method to create a solved cube state for testing
  public createSolvedCubeState(): CubeState {
    const cubeState: CubeState = {};
    
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


  // Extract edge piece colors from a scrambled cube state
  public extractEdgeColorsFromCube(cubeState: any): CubeState {
    const edgeCubeState: CubeState = {};
    
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
      const secondaryLetter = this.get_secondary_edge_letter(position);
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
      const secondaryPosition = this.get_secondary_edge_letter(position);
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
      }
    }
    
    return edgeCubeState;
  }

}

// Export the main function for easy use
export function traceEdges(cubeState: CubeState): string {
  const tracer = new EdgeTracer();
  return tracer.do_full_trace(cubeState);
}
