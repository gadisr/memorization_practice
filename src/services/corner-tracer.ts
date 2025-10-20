import { CubeState as ScramblerCubeState, CornerPiece, CORNER_PIECES, POSITION_LETTERS } from '../models/cube-models.js';

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

  // Load corner notation data from shared models
  private loadCornerNotation(): void {
    for (const [notation, colors] of Object.entries(CORNER_PIECES)) {
      this.cornerNotation.set(notation, colors);
    }
  }

  // Load cube positions data from shared POSITION_LETTERS
  private loadCubePositions(): void {
    // Extract corner positions from POSITION_LETTERS (uppercase letters A-X)
    const cornerLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                          'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
    
    cornerLetters.forEach(letter => {
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

  // Load correlate map using the new get_secondary_corner_letters function
  private loadCorrelateMap(): void {
    // Use the new function to get secondary letters for all corner positions
    for (const notation of this.cornerNotation.keys()) {
      try {
        const secondaryLetters = this.get_secondary_corner_letters(notation);
        if (secondaryLetters.length === 2) {
          this.correlateMap.set(notation, secondaryLetters);
        } else {
          console.warn(`No valid secondary letters found for ${notation}`);
          // For now, we'll skip invalid positions rather than crashing
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`Error getting secondary letters for ${notation}:`, errorMessage);
        // Skip this position rather than crashing
      }
    }
  }

  // Get the solved position for a corner piece by its colors
  public get_corner_solved_position_by_colors(colors: [string, string, string]): string {
    // First try exact match
    for (const [notation, cornerColors] of this.cornerNotation.entries()) {
      if (JSON.stringify(colors) === JSON.stringify(cornerColors)) {
        return notation;
      }
    }
    
    // If no exact match, try with color rotation matching
    for (const [notation, cornerColors] of this.cornerNotation.entries()) {
      if (this.areColorsEqual(colors, cornerColors)) {
        return notation;
      }
    }
    
    // If no valid corner found, throw an error
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
    // Handle invalid notation gracefully
    if (notation === 'invalid') {
      console.warn('Attempting to get secondary letters for invalid notation');
      return [];
    }
    
    const colors = this.cornerNotation.get(notation);
    if (!colors) {
      throw new Error(`No corner found with notation ${notation}`);
    }
    
    const secondaryLetters: string[] = [];
    
    // Find all notations with the same colors (different orientations)
    for (const [cornerNotation, cornerColors] of this.cornerNotation.entries()) {
      if (cornerNotation !== notation && this.areColorsEqual(colors, cornerColors)) {
        secondaryLetters.push(cornerNotation);
      }
    }
    
    if (secondaryLetters.length !== 2) {
      console.warn(`Expected 2 secondary letters for ${notation}, found ${secondaryLetters.length}`);
      return [];
    }
    
    return secondaryLetters;
  }

  // Safe method to get secondary letters with fallback
  public get_secondary_corner_letters_safe(notation: string): string[] {
    try {
      return this.get_secondary_corner_letters(notation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Error getting secondary letters for ${notation}:`, errorMessage);
      return [];
    }
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
    const secondaryLetters = this.get_secondary_corner_letters_safe(positionLetter);
    return lettersList.includes(positionLetter) || 
           lettersList.includes(secondaryLetters[0]) || 
           lettersList.includes(secondaryLetters[1]);
  }

  // Check if a corner is twisted (correct position, wrong orientation)
  public is_corner_twisted(positionLetter: string, cube: CornerState): boolean {
    const [main, secondary, tertiary] = this.get_colors_by_letter(positionLetter, cube);
    const secondaryLetters = this.get_secondary_corner_letters_safe(positionLetter);
    const solvedPosition = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
    
    // If we got 'invalid', this corner is not twisted (it's in an invalid state)
    if (solvedPosition === 'invalid') {
      return false;
    }
    
    return secondaryLetters.includes(solvedPosition);
  }

  // Check if a corner is in its correct position (any of the 3 orientations)
  public is_in_position(notationLetter: string, cube: CornerState): boolean {
    try {
      const [main, secondary, tertiary] = this.get_colors_by_letter(notationLetter, cube);
      const solvedPosition = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
      const secondaryLetters = this.get_secondary_corner_letters_safe(notationLetter);
      
      // If we got 'invalid', this corner is not in position due to invalid scramble
      if (solvedPosition === 'invalid') {
        return false;
      }
      
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
    console.log(`🔍 Starting corner cycle from position: ${positionLetter}`);
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
      
      const [main, secondary, tertiary] = this.get_colors_by_letter(currentPosition, cube);
      console.log(`  Colors at ${currentPosition}: [${main}, ${secondary}, ${tertiary}]`);
      
      const nextLetter = this.get_corner_solved_position_by_colors([main, secondary, tertiary]);
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
    
    console.log(`✅ Corner cycle completed: "${cycleString.trim()}"`);
    console.log(`📝 Letters in cycle: [${lettersInThisCycle.join(', ')}]`);
    
    return [cycleString, lettersInThisCycle];
  }

  // Main function to perform full corner tracing
  public do_full_trace(cube: CornerState): string {
    console.log('🔍 Starting full corner trace...');
    console.log('📊 Cube state:', Object.keys(cube).length, 'corners loaded');
    
    let startingPosition = "A";
    let lettersNotTraced = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", 
                           "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"];
    // Remove "A" from letters_not_traced since it's the buffer
    lettersNotTraced = lettersNotTraced.filter(letter => letter !== "A");
    
    console.log('📝 Initial letters to trace:', lettersNotTraced);
    
    // Remove corners that are already in their correct position
    const cornersInPosition = lettersNotTraced.filter(letter => this.is_in_position(letter, cube));
    console.log('✅ Corners already in position:', cornersInPosition);
    
    lettersNotTraced = lettersNotTraced.filter(letter => !this.is_in_position(letter, cube));
    console.log('📝 Letters remaining to trace:', lettersNotTraced);
    
    let tracingString = "";
    let includeLastLetter = false; // Only for the first cycle
    let cycleCount = 0;
    const maxCycles = 6; // Prevent infinite loops
    
    while (lettersNotTraced.length > 0 && cycleCount < maxCycles) {
      cycleCount++;
      console.log(`\n🔄 Starting corner cycle ${cycleCount} from position: ${startingPosition}`);
      
      try {
        const [cycleString, lettersInThisCycle] = this.do_cycle(startingPosition, cube, includeLastLetter);
        includeLastLetter = true;
        console.log('✅ Cycle traced:', cycleString);
        console.log('📝 Letters in this cycle:', lettersInThisCycle);
        
        // Remove letters_in_this_cycle and their secondary letters from letters_not_traced
        lettersInThisCycle.forEach(letter => {
          const secondaryLetters = this.get_secondary_corner_letters_safe(letter);
          lettersNotTraced = lettersNotTraced.filter(l => 
            l !== letter && l !== secondaryLetters[0] && l !== secondaryLetters[1]
          );
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
        console.error(`❌ Error in corner cycle ${cycleCount}:`, errorMessage);
        console.error('Stack:', errorStack);
        throw error;
      }
    }
    
    // Check if we hit the cycle limit
    if (cycleCount >= maxCycles && lettersNotTraced.length > 0) {
      console.warn(`⚠️ Reached maximum cycle limit (${maxCycles}). Remaining untraced letters: [${lettersNotTraced.join(', ')}]`);
    }
    
    console.log('✅ Full corner trace completed:', tracingString);
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
    return Array.from(this.cornerNotation.keys());
  }

  // Convert scrambler cube state to corner tracer format
  public convertFromScramblerCube(scramblerCube: ScramblerCubeState): CornerState {
    const cornerCubeState: CornerState = {};
    
    // Extract corner piece colors using the embedded position mapping
    const allCornerPositions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                               'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
    
    for (const position of allCornerPositions) {
      const mainPos = this.cubePositions.get(position);
      const secondaryLetters = this.get_secondary_corner_letters_safe(position);
      
      // Skip if we got invalid secondary letters
      if (secondaryLetters.length !== 2) {
        console.warn(`Skipping position ${position} due to invalid secondary letters`);
        continue;
      }
      
      const secondaryPos1 = this.cubePositions.get(secondaryLetters[0]);
      const secondaryPos2 = this.cubePositions.get(secondaryLetters[1]);
      
      if (mainPos && secondaryPos1 && secondaryPos2) {
        // Get the main color from the main position
        const mainColor = scramblerCube.faces[mainPos.face as keyof typeof scramblerCube.faces].colors[mainPos.row][mainPos.col];
        
        // Get the secondary colors from the secondary positions
        const secondaryColor1 = scramblerCube.faces[secondaryPos1.face as keyof typeof scramblerCube.faces].colors[secondaryPos1.row][secondaryPos1.col];
        const secondaryColor2 = scramblerCube.faces[secondaryPos2.face as keyof typeof scramblerCube.faces].colors[secondaryPos2.row][secondaryPos2.col];
        
        cornerCubeState[position] = {
          colors: [mainColor, secondaryColor1, secondaryColor2],
          orientation: 'correct'
        };
      } else {
        console.warn(`Missing position data for ${position} or ${secondaryLetters.join(', ')}`);
      }
    }
    
    return cornerCubeState;
  }

  // Extract corner piece colors from a scrambled cube state (legacy method)
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
    
    allCornerPositions.forEach((position, idx) => {
      const mainPos = this.cubePositions.get(position);
      const secondaryLetters = this.get_secondary_corner_letters_safe(position);
      
      // Skip if we got invalid secondary letters
      if (secondaryLetters.length !== 2) {
        console.warn(`[${idx}] Position '${position}': Skipping due to invalid secondary letters`);
        return;
      }
      
      const secondaryPos1 = this.cubePositions.get(secondaryLetters[0]);
      const secondaryPos2 = this.cubePositions.get(secondaryLetters[1]);
      
      if (!mainPos) {
        console.warn(`[${idx}] Position '${position}': No mapping found in cubePositions!`);
      }
      if (secondaryLetters.length !== 2) {
        console.warn(`[${idx}] Position '${position}': No secondary letters (correlate) found!`);
      }
      if (!secondaryPos1 && secondaryLetters[0]) {
        console.warn(`[${idx}] Position '${position}': No mapping found for secondary letter '${secondaryLetters[0]}'.`);
      }
      if (!secondaryPos2 && secondaryLetters[1]) {
        console.warn(`[${idx}] Position '${position}': No mapping found for secondary letter '${secondaryLetters[1]}'.`);
      }
      
      let mainColor = undefined, secondaryColor1 = undefined, secondaryColor2 = undefined;
      if (mainPos && cubeState.faces[mainPos.face]) {
        const faceColors = cubeState.faces[mainPos.face].colors;
        if (faceColors[mainPos.row] && typeof faceColors[mainPos.row][mainPos.col] !== 'undefined') {
          mainColor = faceColors[mainPos.row][mainPos.col];
        } else {
          console.warn(`Main color lookup failed for [${mainPos.face}] row=${mainPos.row}, col=${mainPos.col}, letter=${position}`);
        }
      }
      if (secondaryPos1 && cubeState.faces[secondaryPos1.face]) {
        const faceColors1 = cubeState.faces[secondaryPos1.face].colors;
        if (faceColors1[secondaryPos1.row] && typeof faceColors1[secondaryPos1.row][secondaryPos1.col] !== 'undefined') {
          secondaryColor1 = faceColors1[secondaryPos1.row][secondaryPos1.col];
        } else {
          console.warn(`Secondary color 1 lookup failed for [${secondaryPos1.face}] row=${secondaryPos1.row}, col=${secondaryPos1.col}, letter=${secondaryLetters[0]}`);
        }
      }
      if (secondaryPos2 && cubeState.faces[secondaryPos2.face]) {
        const faceColors2 = cubeState.faces[secondaryPos2.face].colors;
        if (faceColors2[secondaryPos2.row] && typeof faceColors2[secondaryPos2.row][secondaryPos2.col] !== 'undefined') {
          secondaryColor2 = faceColors2[secondaryPos2.row][secondaryPos2.col];
        } else {
          console.warn(`Secondary color 2 lookup failed for [${secondaryPos2.face}] row=${secondaryPos2.row}, col=${secondaryPos2.col}, letter=${secondaryLetters[1]}`);
        }
      }
      console.log(
        `CornerLetter: ${position} | Main: ${mainPos ? `${mainPos.face}@(${mainPos.row},${mainPos.col})` : 'N/A'} = ${mainColor} | ` +
        `Secondary1 (${secondaryLetters[0]}): ${secondaryPos1 ? `${secondaryPos1.face}@(${secondaryPos1.row},${secondaryPos1.col})` : 'N/A'} = ${secondaryColor1} | ` +
        `Secondary2 (${secondaryLetters[1]}): ${secondaryPos2 ? `${secondaryPos2.face}@(${secondaryPos2.row},${secondaryPos2.col})` : 'N/A'} = ${secondaryColor2}`
      );
    });
    
    for (const position of allCornerPositions) {
      const mainPos = this.cubePositions.get(position);
      const secondaryLetters = this.get_secondary_corner_letters_safe(position);
      
      // Skip if we got invalid secondary letters
      if (secondaryLetters.length !== 2) {
        console.warn(`Skipping position ${position} due to invalid secondary letters`);
        continue;
      }
      
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
      } else {
        console.warn(`Missing position data for ${position} or ${secondaryLetters.join(', ')}`);
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

// New function to trace corners from scrambler cube state
export function traceCornersFromScrambler(scramblerCube: ScramblerCubeState): string {
  const tracer = new CornerTracer();
  const cornerCubeState = tracer.convertFromScramblerCube(scramblerCube);
  return tracer.do_full_trace(cornerCubeState);
}