# Edge Tracer Service

The Edge Tracer service implements the edge tracing algorithm for Rubik's cube memorization practice. It follows the exact pseudocode provided in the documentation to track where edge pieces have moved after scrambling.

## Overview

The edge tracing algorithm uses a cycle-based approach to track all 24 edge pieces:
- Starts with buffer position 'b' (the only buffer position on the cube)
- Follows cycles of piece movements
- Handles flipped edges (correct position, wrong orientation)
- Returns a string representation of all cycles

## Usage

### Basic Usage

```typescript
import { EdgeTracer, traceEdges } from './edge-tracer';

// Create a tracer instance
const tracer = new EdgeTracer();

// Create a cube state (or get from scrambler)
const cubeState = tracer.createSolvedCubeState();

// Trace edges
const result = tracer.do_full_trace(cubeState);
console.log(result); // e.g., "a b c d e f"
```

### Using the Export Function

```typescript
import { traceEdges } from './edge-tracer';

// Direct function call
const result = traceEdges(cubeState);
```

## API Reference

### EdgeTracer Class

#### Constructor
```typescript
const tracer = new EdgeTracer();
```
Creates a new edge tracer instance and loads all necessary data from JSON files.

#### Main Methods

##### `do_full_trace(cubeState: CubeState): string`
Performs complete edge tracing on the given cube state.

**Parameters:**
- `cubeState`: The current state of the cube with edge piece positions and colors

**Returns:**
- String representation of all cycles (space-separated letters)

**Example:**
```typescript
const result = tracer.do_full_trace(cubeState);
// Result: "a b c d e f" (cycle: a -> b -> c -> a, then d -> e -> f -> d)
```

##### `do_cycle(positionLetter: string, cube: CubeState, includeLastLetter: boolean): [string, string[]]`
Performs a single cycle starting from the given position.

**Parameters:**
- `positionLetter`: Starting position for the cycle
- `cube`: Current cube state
- `includeLastLetter`: Whether to include the return to starting position

**Returns:**
- Tuple of [cycleString, lettersInCycle]

#### Helper Methods

##### `get_edge_solved_position_by_colors(mainColor: string, secondaryColor: string): string`
Finds the notation letter for an edge piece with given colors.

##### `get_secondary_edge_letter(positionLetter: string): string`
Gets the correlate/secondary position for a given position.

##### `get_colors_by_letter(positionLetter: string, scrambledCube: CubeState): [string, string]`
Gets the colors at a specific position in the cube.

##### `is_position_included(positionLetter: string, lettersList: string[]): boolean`
Checks if a position (or its secondary) is already in the traced list.

##### `is_edge_flipped(positionLetter: string, cube: CubeState): boolean`
Checks if an edge is in the correct position but flipped.

##### `createSolvedCubeState(): CubeState`
Creates a solved cube state for testing.

##### `getAllEdgePositions(): string[]`
Gets all 24 edge position letters.

## Data Structures

### CubeState Interface
```typescript
interface CubeState {
  [position: string]: {
    colors: [string, string];
    orientation: 'correct' | 'flipped';
  };
}
```

### Position3D Interface
```typescript
interface Position3D {
  face: string;
  row: number;
  col: number;
}
```

## Algorithm Details

### Cycle Tracing Process

1. **Initialize**: Start with buffer position 'b', create letters_not_traced array
2. **First Cycle**: Trace from buffer, exclude final return letter
3. **Subsequent Cycles**: Find next untraced letter, include return to starting position
4. **Continue**: Until all 24 edge pieces are tracked

### Edge Position Mapping

The algorithm uses two main data sources:
- `edge-notation.json`: Maps letters to color combinations
- `cube-positions.json`: Maps letters to 3D positions on cube faces

### Buffer Position

There is only **one buffer position** on the entire cube: position 'b' on the U face (white center).

## Examples

### Solved Cube
```typescript
const solvedCube = tracer.createSolvedCubeState();
const result = tracer.do_full_trace(solvedCube);
// Result: "" (empty string - no cycles needed)
```

### Simple Swap
```typescript
const cubeState = tracer.createSolvedCubeState();
// Swap pieces at 'a' and 'b'
const temp = cubeState['a'];
cubeState['a'] = cubeState['b'];
cubeState['b'] = temp;

const result = tracer.do_full_trace(cubeState);
// Result: "a b" (cycle: a -> b -> a)
```

### Multiple Cycles
```typescript
const cubeState = tracer.createSolvedCubeState();
// Create two separate 2-cycles: a <-> b and c <-> d
// ... swap logic ...

const result = tracer.do_full_trace(cubeState);
// Result: "a b c d" (two cycles: a -> b -> a, then c -> d -> c)
```

## Testing

Run the test suite:
```bash
npm test edge-tracer.test.ts
```

The test suite includes:
- Data loading validation
- Helper function tests
- Algorithm correctness tests
- Edge case handling
- Performance tests

## Integration

### With Cube Scrambler
```typescript
import { EdgeTracer } from './edge-tracer';
import { scrambleCube } from './cube-scrambler';

const tracer = new EdgeTracer();
const scrambledCube = scrambleCube(); // Get from scrambler
const edgeCycles = tracer.do_full_trace(scrambledCube);
```

### With Memorization Practice
```typescript
// Use edge cycles for memorization practice
const cycles = edgeCycles.trim().split(' ');
console.log(`Memorize these edge cycles: ${cycles.join(' ')}`);
```

## Error Handling

The service includes comprehensive error handling:
- Invalid position letters
- Unknown color combinations
- Missing cube state data
- Malformed data structures

## Performance

- Typical execution time: < 100ms for full tracing
- Memory usage: Minimal (loads data once)
- Scalable: Handles any valid cube state

## Dependencies

- `edge-notation.json`: Edge color mappings
- `cube-positions.json`: Position mappings
- TypeScript interfaces for type safety
