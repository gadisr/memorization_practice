# Edge Tracing Algorithm Implementation Plan

## Overview

This document outlines the implementation plan for the edge tracing algorithm used in Rubik's cube memorization practice. The algorithm tracks where edge pieces have moved after scrambling by following a cycle-based approach.

## Algorithm Description

### Core Concept
The edge tracing algorithm follows a systematic approach to track all 24 edge pieces after a cube scramble:

1. **Buffer Position**: Start with position 'b' (the only buffer position on the cube)
2. **Cycle Tracking**: Follow where each piece should be, creating cycles
3. **Multiple Cycles**: Continue until all edges are tracked
4. **Flipped Edges**: Handle cases where edges are in correct position but flipped

### Key References
- **Edge Notation**: `src/data/edge-notation.json` - Maps letters A-X to color combinations
- **Cube Positions**: `src/data/cube-positions.json` - Maps letters to 3D positions on cube faces
- **Corner Notation**: `src/data/corner-notation.json` - For reference (not used in edge tracing)

## Data Structures

### Core Interfaces

```typescript
interface CubeState {
  [position: string]: {
    colors: [string, string];
    orientation: 'correct' | 'flipped';
  };
}

interface EdgePiece {
  id: string;
  colors: [string, string];
  position: string;
  correlatePosition: string;
}

interface EdgeTracingResult {
  cycles: string[][];
  flippedEdges: string[];
  totalPieces: number;
  isComplete: boolean;
}

interface Position3D {
  face: string;
  row: number;
  col: number;
}
```

### Position Mapping

From `cube-positions.json`, the cube is structured as:
- **U face**: White center, positions A-D, a-c, **b (buffer)**
- **L face**: Orange center, positions E-H, e-g, f
- **F face**: Green center, positions I-L, i-k, j
- **R face**: Red center, positions M-P, m-p, n
- **B face**: Blue center, positions Q-T, q-t, r
- **D face**: Yellow center, positions U-X, u-x, v

**Note**: There is only **one buffer position** in the entire cube: position 'b' on the U face.

### Edge Color Mapping

From `edge-notation.json`, each edge piece has:
- **Primary color**: First color in the array
- **Secondary color**: Second color in the array
- **Correlate position**: The position of the secondary color

## Algorithm Implementation

Based on the provided pseudocode, here's the exact implementation:

### Core Functions

```typescript
// Get the solved position for an edge piece by its colors
function get_edge_solved_position_by_colors(mainColor: string, secondaryColor: string): string {
  // Look up in edge-notation.json using lowercase letters
  // Return the notation letter that matches these colors
}

// Get the secondary edge letter for a given position
function get_secondary_edge_letter(positionLetter: string): string {
  // Use edge-notation.json to get colors by position_letter
  // Return the letter that has the same colors inversed
}

// Get colors at a position in the scrambled cube
function get_colors_by_letter(positionLetter: string, scrambledCube: CubeState): [string, string] {
  // According to cube-positions.json get main color
  // Use get_secondary_edge_letter to return the color on secondary letter
  return [mainColor, secondaryColor];
}

// Check if a position is already included in traced letters
function is_position_included(positionLetter: string, lettersList: string[]): boolean {
  const secondaryLetter = get_secondary_edge_letter(positionLetter);
  return lettersList.includes(positionLetter) || lettersList.includes(secondaryLetter);
}

// Check if an edge is flipped (correct position, wrong orientation)
function is_edge_flipped(positionLetter: string, cube: CubeState): boolean {
  const [main, secondary] = get_colors_by_letter(positionLetter, cube);
  const secondaryEdgeLetter = get_secondary_edge_letter(positionLetter);
  return get_edge_solved_position_by_colors(main, secondary) === secondaryEdgeLetter;
}

// Perform a single cycle starting from a position
function do_cycle(positionLetter: string, cube: CubeState, includeLastLetter: boolean = false): [string, string[]] {
  const lettersInThisCycle: string[] = [];
  let cycleString = "";
  let currentPosition = positionLetter;
  
  while (!is_position_included(currentPosition, lettersInThisCycle)) {
    const [main, secondary] = get_colors_by_letter(currentPosition, cube);
    const nextLetter = get_edge_solved_position_by_colors(main, secondary);
    cycleString += nextLetter + " ";
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
function do_full_trace(cube: CubeState): string {
  let startingPosition = "b";
  let lettersNotTraced = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", 
                         "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x"];
  // Remove "b" from letters_not_traced since it's the buffer
  lettersNotTraced = lettersNotTraced.filter(letter => letter !== "b");
  
  let tracingString = "";
  let includeLastLetter = true; // Only for the first cycle
  
  while (lettersNotTraced.length > 0) {
    const [cycleString, lettersInThisCycle] = do_cycle(startingPosition, cube, includeLastLetter);
    includeLastLetter = false;
    
    // Remove letters_in_this_cycle and their secondary letters from letters_not_traced
    lettersInThisCycle.forEach(letter => {
      const secondaryLetter = get_secondary_edge_letter(letter);
      lettersNotTraced = lettersNotTraced.filter(l => l !== letter && l !== secondaryLetter);
    });
    
    tracingString += cycleString;
    
    // Find next starting position from remaining letters
    if (lettersNotTraced.length > 0) {
      startingPosition = lettersNotTraced[0];
    }
  }
  
  return tracingString;
}
```

### Helper Functions for Implementation

```typescript
// Load edge notation data
function loadEdgeNotation(): Map<string, [string, string]> {
  // Load from edge-notation.json
  // Create mapping from notation to colors
}

// Load cube positions data  
function loadCubePositions(): Map<string, Position3D> {
  // Load from cube-positions.json
  // Create mapping from letter to 3D position
}

// Get main color at a position
function getMainColorAtPosition(letter: string, cube: CubeState): string {
  // Use cube-positions.json to find the face and position
  // Return the color at that position
}

// Get secondary color at a position
function getSecondaryColorAtPosition(letter: string, cube: CubeState): string {
  const secondaryLetter = get_secondary_edge_letter(letter);
  return getMainColorAtPosition(secondaryLetter, cube);
}
```

## Algorithm Flow

### Detailed Process (Following Pseudocode)

1. **Initialize**
   - Set starting position to "b" (buffer)
   - Create letters_not_traced array with all letters a-x except "b"
   - Initialize tracing_string as empty
   - Set include_last_letter to true (only for first cycle)

2. **Main Loop**
   - While letters_not_traced is not empty:
     - Call do_cycle(starting_position, cube, include_last_letter)
     - Set include_last_letter to false for subsequent cycles
     - Remove letters_in_this_cycle and their secondary letters from letters_not_traced
     - Append cycle_string to tracing_string
     - Set starting_position to next untraced letter

3. **do_cycle Function**
   - Initialize letters_in_this_cycle array and cycle_string
   - While current position not in letters_in_this_cycle:
     - Get main and secondary colors at current position
     - Find next letter using get_edge_solved_position_by_colors
     - Add next letter to cycle_string
     - Add current position to letters_in_this_cycle
     - Move to next position
   - If include_last_letter is false, remove last letter from cycle_string
   - Return cycle_string and letters_in_this_cycle

4. **Helper Functions**
   - get_edge_solved_position_by_colors: Look up notation by colors (lowercase)
   - get_secondary_edge_letter: Find letter with same colors inversed
   - get_colors_by_letter: Get main and secondary colors at position
   - is_position_included: Check if position or its secondary is in list
   - is_edge_flipped: Check if edge is in correct position but flipped

### Example Output

```typescript
// Example result for a scrambled cube
{
  cycles: [
    ['t', 'u', 'c', 'n', 'r', 'g'],  // First cycle
    ['d', 't', 'x', 'd'],            // Second cycle
    ['a', 'q']                       // Flipped edge cycle
  ],
  flippedEdges: ['a', 'q'],
  totalPieces: 24,
  isComplete: true
}
```

## Testing Strategy

### Test Cases

1. **Solved Cube**
   - Should return empty cycles
   - No flipped edges
   - All pieces in correct positions

2. **Known Scrambles**
   - Test with specific scramble sequences
   - Verify expected cycle patterns
   - Check edge orientation handling

3. **Edge Cases**
   - All edges flipped
   - Single cycle containing all edges
   - Multiple small cycles

4. **Validation Tests**
   - Ensure all 24 pieces are tracked
   - Verify cycle completeness
   - Check for duplicate pieces

### Test Implementation

```typescript
describe('Edge Tracing Algorithm', () => {
  test('solved cube returns empty cycles', () => {
    const solvedCube = createSolvedCube();
    const result = traceAllEdges(solvedCube);
    expect(result.cycles).toEqual([]);
    expect(result.flippedEdges).toEqual([]);
    expect(result.isComplete).toBe(true);
  });
  
  test('handles flipped edges correctly', () => {
    const cubeWithFlippedEdges = createCubeWithFlippedEdges();
    const result = traceAllEdges(cubeWithFlippedEdges);
    expect(result.flippedEdges).toContain('a');
    expect(result.flippedEdges).toContain('q');
  });
  
  test('tracks all 24 pieces', () => {
    const scrambledCube = createScrambledCube();
    const result = traceAllEdges(scrambledCube);
    expect(result.totalPieces).toBe(24);
    expect(result.isComplete).toBe(true);
  });
});
```

## File Structure

```
src/
├── services/
│   ├── edge-tracer.ts           # Main edge tracing implementation
│   ├── cube-scrambler.ts        # Existing scrambler
│   └── cube-state-manager.ts    # Cube state management
├── data/
│   ├── edge-notation.json      # Edge color mappings
│   ├── cube-positions.json      # Position mappings
│   └── corner-notation.json     # Corner mappings (reference)
├── types/
│   └── cube-types.ts            # TypeScript interfaces
└── tests/
    └── edge-tracer.test.ts      # Test suite
```

## Implementation Priority

1. **Phase 1**: Core data structures and position mapping
2. **Phase 2**: Basic cycle tracing (first cycle)
3. **Phase 3**: Multiple cycle handling
4. **Phase 4**: Flipped edge detection
5. **Phase 5**: Testing and validation
6. **Phase 6**: Integration with existing scrambler

## Notes

- The algorithm assumes white center is always Up face and green is always Front face
- Buffer position 'b' is the white-red edge in solved state
- Correlate positions are determined by the cube's physical structure
- All 24 edge pieces must be accounted for in the final result
- Cycles are written as arrays of position letters
- First cycle excludes the final return to buffer position
- Subsequent cycles include the return to starting position
