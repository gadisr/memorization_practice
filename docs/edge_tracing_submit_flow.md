# Edge Tracing Drill Submit Flow Analysis

## Complete Flow When User Clicks Submit

### 1. **UI Event Handling** (`src/ui/tracing-renderer.ts`)

**Entry Point:** `handleTracingSubmission(drillType: DrillType)`

```typescript
// Line 127-163 in tracing-renderer.ts
private async handleTracingSubmission(drillType: DrillType): Promise<void> {
  // 1. Get user input
  const sequenceInput = document.getElementById('tracing-sequence') as HTMLTextAreaElement;
  const userSequence = sequenceInput.value.trim();
  
  // 2. Validate input exists
  if (!userSequence) {
    this.showNotification('Please enter a sequence before submitting.', 'error');
    return;
  }
  
  // 3. Stop timer and calculate time
  this.isActive = false;
  const endTime = Date.now();
  const totalTime = Math.round((endTime - this.startTime) / 1000);
  
  // 4. Call appropriate validator
  if (drillType === DrillType.CORNER_TRACING_DRILL) {
    validationResult = this.cornerTracingValidator.scrambleAndValidateCorners(
      this.currentScramble, 
      userSequence
    );
  } else {
    validationResult = this.sequenceValidator.scrambleAndValidate(
      this.currentScramble, 
      userSequence
    );
  }
  
  // 5. Display results
  this.displayTracingResults(validationResult, totalTime, drillType);
}
```

### 2. **Sequence Validation Process** (`src/services/sequence-validator.ts`)

**Main Method:** `validateDrillSequence(input: SequenceValidationInput)`

#### Step 1: Input Validation
```typescript
// Validate scramble string format
const validMoves = ['R', 'L', 'U', 'D', 'F', 'B', 'R\'', 'L\'', 'U\'', 'D\'', 'F\'', 'B\'', 'R2', 'L2', 'U2', 'D2', 'F2', 'B2', ...];
const moves = input.scrambleString.trim().split(/\s+/).filter(move => move.length > 0);
const invalidMoves = moves.filter(move => !validMoves.includes(move));
```

#### Step 2: Cube Scrambling
```typescript
// Generate scrambled cube from scramble string
const scrambledCube = scramble_cube(input.scrambleString);
```

#### Step 3: Convert to Edge Tracer Format
```typescript
// Convert to EdgeTracerCubeState for tracing
const initialEdgeTracerCube = this.moveApplier.convertToEdgeTracerState(scrambledCube);
```

#### Step 4: Generate Expected Sequence
```typescript
// Get expected sequence from EdgeTracer
const expectedSequence = this.edgeTracer.do_full_trace(initialEdgeTracerCube);
```

#### Step 5: Apply User Sequence
```typescript
// Apply user sequence to the cube using cube-scrambler
const finalCube = this.applySequenceToCube(scrambledCube, input.userTracingSequence);
```

#### Step 6: Validate Final State
```typescript
// Convert final cube state and validate
const finalEdgeTracerCube = this.moveApplier.convertToEdgeTracerState(finalCube);
const validationResult = this.validateCubeState(finalEdgeTracerCube);
```

#### Step 7: Calculate Score
```typescript
// Calculate score based on comparison
const score = this.calculateSequenceScore(expectedSequence, input.userTracingSequence);
```

### 3. **Edge Tracing Algorithm** (`src/services/edge-tracer.ts`)

**Main Method:** `do_full_trace(cube: EdgeTracerCubeState)`

#### Process:
1. **Initialize:** Start with buffer position 'b'
2. **Filter edges:** Remove edges already in correct position
3. **Trace cycles:** For each untraced edge, follow the cycle
4. **Build sequence:** Create letter sequence representing the trace

#### Cycle Tracing Process:
```typescript
public do_cycle(positionLetter: string, cube: EdgeTracerCubeState, includeLastLetter: boolean = false): [string, string[]] {
  // 1. Start from given position
  // 2. Get colors at current position
  // 3. Find where this piece should be (solved position)
  // 4. Move to next position
  // 5. Repeat until back to starting position
  // 6. Return cycle string and letters involved
}
```

### 4. **Move Application** (`src/services/sequence-validator.ts`)

**Method:** `applySequenceToCube(cube: CubeState, sequence: string)`

#### Process:
1. **Convert letters to moves:** Each letter becomes setup move + edge swap algorithm + inverse setup
2. **Apply moves:** Use cube-scrambler to apply each move sequence
3. **Return final state:** Scrambled cube after user's sequence

### 5. **Cube State Validation** (`src/services/sequence-validator.ts`)

**Method:** `validateCubeState(cube: EdgeTracerCubeState)`

#### Process:
1. **Check all edges:** For each of 24 edge positions
2. **Verify position:** Is edge in correct position?
3. **Check orientation:** Is edge flipped?
4. **Collect results:** Edges in position, flipped edges, errors

### 6. **Score Calculation** (`src/services/sequence-validator.ts`)

**Method:** `calculateSequenceScore(expected: string, user: string)`

#### Process:
1. **Compare sequences:** Letter-by-letter comparison
2. **Calculate base score:** Percentage of correct letters
3. **Apply penalties:** Length differences, errors
4. **Return final score:** 0-100%

### 7. **Results Display** (`src/ui/tracing-renderer.ts`)

**Method:** `displayTracingResults(result: any, totalTime: number, drillType: DrillType)`

#### UI Elements Created:
- **Status:** Correct/Incorrect with score and time
- **Expected sequence:** What user should have traced
- **User sequence:** What user actually entered
- **Issues found:** Any validation errors
- **Edges in position:** Which edges are correctly placed
- **Flipped edges:** Which edges are in correct position but flipped
- **Action buttons:** Try Again, New Scramble, Back to Menu

## Key Data Flow

```
User Input (letter sequence)
    ↓
Input Validation
    ↓
Scramble Cube Generation
    ↓
Edge Tracer (Expected Sequence)
    ↓
Move Application (User Sequence)
    ↓
Final State Validation
    ↓
Score Calculation
    ↓
Results Display
```

## Error Handling Points

1. **Input Validation:** Empty sequence, invalid moves
2. **Cube Scrambling:** Invalid scramble generation
3. **Edge Tracing:** Invalid color combinations (current issue)
4. **Move Application:** Invalid letter sequences
5. **State Validation:** Missing edge data, invalid positions

## Current Issues Identified

1. **Invalid Edge Combinations:** Scramble algorithm creates impossible color combinations
2. **Edge Tracer Crashes:** When encountering invalid combinations
3. **Error Propagation:** Errors bubble up through the validation chain
4. **User Experience:** Generic error messages don't help user understand the issue

## Recommended Fixes

1. **Improve Scramble Algorithm:** Ensure valid edge piece movements
2. **Add Error Recovery:** Handle invalid combinations gracefully
3. **Better Logging:** Add comprehensive debugging information
4. **User Feedback:** Provide specific error messages and suggestions

