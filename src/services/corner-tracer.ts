// Types
export interface Position3D {
  face: string;
  row: number;
  col: number;
}

export interface CornerState {
  [position: string]: {
    colors: [string, string, string];
    orientation: 'correct' | 'twisted';
  };
}

// Corner Tracer Class
export class CornerTracer {
  private cornerNotation: Map<string, [string, string, string]>;
  private cubePositions: Map<string, Position3D>;
  private correlateMap: Map<string, string[]>;

  constructor() {
    this.cornerNotation = new Map();
    this.cubePositions = new Map();
    this.correlateMap = new Map();
    
    this.loadCornerNotation();
    this.loadCubePositions();
    this.loadCorrelateMap();
  }

  // Load corner notation data (embedded in class)
  private loadCornerNotation(): void {
    const cornerNotationData = [
        { "colors": ["white", "orange", "blue"], "notation": "A" },
        { "colors": ["white", "blue", "red"], "notation": "B" },
        { "colors": ["white", "red", "green"], "notation": "C" },
        { "colors": ["white", "green", "orange"], "notation": "D" },
      
        { "colors": ["orange", "blue", "white"], "notation": "E" },
        { "colors": ["orange", "white", "green"], "notation": "F" },
        { "colors": ["orange", "green", "yellow"], "notation": "G" },
        { "colors": ["orange", "yellow", "blue"], "notation": "H" },
      
        { "colors": ["green", "orange", "white"], "notation": "I" },
        { "colors": ["green", "white", "red"], "notation": "J" },
        { "colors": ["green", "red", "yellow"], "notation": "K" },
        { "colors": ["green", "yellow", "orange"], "notation": "L" },
      
        { "colors": ["red", "green", "white"], "notation": "M" },
        { "colors": ["red", "white", "blue"], "notation": "N" },
        { "colors": ["red", "blue", "yellow"], "notation": "O" },
        { "colors": ["red", "yellow", "green"], "notation": "P" },
      
        { "colors": ["blue", "red", "white"], "notation": "Q" },
        { "colors": ["blue", "white", "orange"], "notation": "R" },
        { "colors": ["blue", "orange", "yellow"], "notation": "S" },
        { "colors": ["blue", "yellow", "red"], "notation": "T" },
      
        { "colors": ["yellow", "orange", "green"], "notation": "U" },
        { "colors": ["yellow", "green", "red"], "notation": "V" },
        { "colors": ["yellow", "red", "blue"], "notation": "W" },
        { "colors": ["yellow", "blue", "orange"], "notation": "X" }
    ];
    
    cornerNotationData.forEach(corner => {
      this.cornerNotation.set(corner.notation.toUpperCase(), corner.colors as [string, string, string]);
    });
  }

  // Load cube positions data (embedded in class)
  private loadCubePositions(): void {
    // Direct mapping of each corner letter to its correct position
    const positionMapping = {
      // U face corners
      'A': { face: 'U', row: 0, col: 0 },
      'B': { face: 'U', row: 0, col: 2 },
      'C': { face: 'U', row: 2, col: 2 },
      'D': { face: 'U', row: 2, col: 0 },
      
      // L face corners
      'E': { face: 'L', row: 0, col: 0 },
      'F': { face: 'L', row: 0, col: 2 },
      'G': { face: 'L', row: 2, col: 2 },
      'H': { face: 'L', row: 2, col: 0 },
      
      // F face corners
      'I': { face: 'F', row: 0, col: 0 },
      'J': { face: 'F', row: 0, col: 2 },
      'K': { face: 'F', row: 2, col: 2 },
      'L': { face: 'F', row: 2, col: 0 },
      
      // R face corners
      'M': { face: 'R', row: 0, col: 0 },
      'N': { face: 'R', row: 0, col: 2 },
      'O': { face: 'R', row: 2, col: 2 },
      'P': { face: 'R', row: 2, col: 0 },
      
      // B face corners
      'Q': { face: 'B', row: 0, col: 0 },
      'R': { face: 'B', row: 0, col: 2 },
      'S': { face: 'B', row: 2, col: 2 },
      'T': { face: 'B', row: 2, col: 0 },
      
      // D face corners
      'U': { face: 'D', row: 0, col: 0 },
      'V': { face: 'D', row: 0, col: 2 },
      'W': { face: 'D', row: 2, col: 2 },
      'X': { face: 'D', row: 2, col: 0 }
    };
    
    // Store the mappings
    for (const [letter, position] of Object.entries(positionMapping)) {
      this.cubePositions.set(letter, position);
    }
  }

  // Load correlate map using the get_secondary_corner_letters function
  private loadCorrelateMap(): void {
    // Use the function to get secondary letters for all corner positions
    for (const notation of this.cornerNotation.keys()) {
      const secondaryLetters = this.get_secondary_corner_letters(notation);
      this.correlateMap.set(notation, secondaryLetters);
    }
  }

  // Get the solved position for a corner piece by its colors
  public get_corner_solved_position_by_colors(colors: [string, string, string]): string {
    // Find the corner where the first color matches the first color of the input
    for (const [notation, cornerColors] of this.cornerNotation.entries()) {
      if (cornerColors[0] === colors[0] && this.areColorsEqual(colors, cornerColors)) {
        return notation;
      }
    }
    throw new Error(`No corner found with first color ${colors[0]}`);
  }

  // Check if two color arrays are equal (considering all rotations)
  private areColorsEqual(colors1: [string, string, string], colors2: [string, string, string]): boolean {
    // Sort both arrays and compare - this handles all rotations
    const sorted1 = [...colors1].sort();
    const sorted2 = [...colors2].sort();
    return sorted1[0] === sorted2[0] && sorted1[1] === sorted2[1] && sorted1[2] === sorted2[2];
  }

  // Given a notation, find its secondary letters (2 additional orientations)
  public get_secondary_corner_letters(notation: string): string[] {
    const baseLetter = notation.toUpperCase().charAt(0);
    const secondaryLetters: string[] = [];
    
    // Check if the base letter exists
    if (!this.cornerNotation.has(baseLetter)) {
      throw new Error(`No corner found with notation ${notation}`);
    }
    
    // Get the colors of the base notation
    const baseColors = this.cornerNotation.get(baseLetter)!;
    
    // Find all notations with the same colors (different orientations)
    for (const [cornerNotation, cornerColors] of this.cornerNotation.entries()) {
      if (cornerNotation !== baseLetter && this.areColorsEqual(baseColors, cornerColors)) {
        secondaryLetters.push(cornerNotation);
      }
    }
    
    if (secondaryLetters.length !== 2) {
      throw new Error(`Expected 2 secondary letters for ${notation}, found ${secondaryLetters.length}`);
    }
    
    return secondaryLetters;
  }

  // Get colors at a position in the scrambled cube
  public get_colors_by_letter(positionLetter: string, scrambledCube: CornerState): [string, string, string] {
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
    const secondaryLetters = this.get_secondary_corner_letters(positionLetter);
    return lettersList.includes(positionLetter) || 
           lettersList.includes(secondaryLetters[0]) || 
           lettersList.includes(secondaryLetters[1]);
  }

  // Check if a corner is twisted (correct position, wrong orientation)
  public is_corner_twisted(positionLetter: string, cube: CornerState): boolean {
    const [main, secondary, tertiary] = this.get_colors_by_letter(positionLetter, cube);
    const secondaryLetters = this.get_secondary_corner_letters(positionLetter);
    const solvedPosition = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
    return secondaryLetters.includes(solvedPosition);
  }

  // Check if a corner is in its correct position (any of the 3 orientations)
  public is_in_position(notationLetter: string, cube: CornerState): boolean {
    try {
      const [main, secondary, tertiary] = this.get_colors_by_letter(notationLetter, cube);
      const solvedPosition = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
      const secondaryLetters = this.get_secondary_corner_letters(notationLetter);
      
      // Return true if the corner is in its correct position or any secondary position
      return solvedPosition === notationLetter || 
             solvedPosition === secondaryLetters[0] || 
             solvedPosition === secondaryLetters[1];
    } catch (error) {
      // If there's an error getting colors or finding position, the corner is not in position
      return false;
    }
  }

  // Perform a single cycle starting from a position
  public do_cycle(positionLetter: string, cube: CornerState, includeLastLetter: boolean = false): [string, string[]] {
    const lettersInThisCycle: string[] = [];
    let cycleString = "";
    let currentPosition = positionLetter;
    
    // starting from second cycle, add the starting position to the cycle string
    if (includeLastLetter) {
      cycleString += currentPosition + " ";  
    }

    while (!this.is_position_included(currentPosition, lettersInThisCycle)) {
      const [main, secondary, tertiary] = this.get_colors_by_letter(currentPosition, cube);
      const nextLetter = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
      
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

  // Main function to perform full corner tracing
  public do_full_trace(cube: CornerState): string {
    let startingPosition = "A";
    let lettersNotTraced = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
                           "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"];
    // Remove "A" from letters_not_traced since it's the buffer
    lettersNotTraced = lettersNotTraced.filter(letter => letter !== "A");
    
    // Remove corners that are already in their correct position
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
        const secondaryLetters = this.get_secondary_corner_letters(letter);
        lettersNotTraced = lettersNotTraced.filter(l => 
          l !== letter && l !== secondaryLetters[0] && l !== secondaryLetters[1]
        );
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
  public createSolvedCornerState(): CornerState {
    const cubeState: CornerState = {};
    
    // Create solved state where each piece is in its correct position
    for (const [notation, colors] of this.cornerNotation.entries()) {
      cubeState[notation] = {
        colors: colors,
        orientation: 'correct'
      };
    }
    
    return cubeState;
  }

  // Helper method to get all corner positions
  public getAllCornerPositions(): string[] {
    const baseLetters = new Set<string>();
    for (const notation of this.cornerNotation.keys()) {
      baseLetters.add(notation.charAt(0));
    }
    return Array.from(baseLetters).sort();
  }

  // Extract corner piece colors from a scrambled cube state
  public extractCornerColorsFromCube(cubeState: any): CornerState {
    const cornerCubeState: CornerState = {};
    
    // Extract corner piece colors using the embedded position mapping
    const allCornerPositions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                               'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
    
    // Extensive logging for debugging and transparency
    console.log("=== Extracting corner piece colors from scrambled cube ===");
    if (!cubeState || !cubeState.faces) {
      console.error("Invalid cubeState input! Expected cubeState.faces to exist.", cubeState);
    }
    console.log("cubeState.faces keys:", Object.keys(cubeState.faces || {}));
    
    for (const position of allCornerPositions) {
      const mainPos = this.cubePositions.get(position);
      const secondaryLetters = this.get_secondary_corner_letters(position);
      const secondaryPos1 = this.cubePositions.get(secondaryLetters[0]);
      const secondaryPos2 = this.cubePositions.get(secondaryLetters[1]);
      
      if (mainPos && secondaryPos1 && secondaryPos2) {
        // Get the main color from the main position
        const mainColor = cubeState.faces[mainPos.face].colors[mainPos.row][mainPos.col];
        
        // Get the secondary colors from the secondary positions
        const secondaryColor1 = cubeState.faces[secondaryPos1.face].colors[secondaryPos1.row][secondaryPos1.col];
        const secondaryColor2 = cubeState.faces[secondaryPos2.face].colors[secondaryPos2.row][secondaryPos2.col];
        
        cornerCubeState[position] = {
          colors: [mainColor, secondaryColor1, secondaryColor2],
          orientation: 'correct'
        };
      }
    }
    
    return cornerCubeState;
  }
}

// Export the main function for easy use
export function traceCorners(cubeState: CornerState): string {
  const tracer = new CornerTracer();
  return tracer.do_full_trace(cubeState);
}
