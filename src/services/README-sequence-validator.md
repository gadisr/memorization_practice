# Sequence Validator Service

The Sequence Validator service provides validation functionality for edge tracing drills. It enables users to practice their edge tracing skills by comparing their traced sequences against the expected solutions.

## Overview

The sequence validator takes a scrambled cube (based on a scramble string) and a user's traced sequence, then validates whether the user's sequence correctly solves the cube. This enables drill-based practice where users can test and improve their edge tracing abilities.

## Features

- **Drill Validation**: Validate user sequences against expected solutions
- **Scoring System**: Calculate percentage-based correctness scores
- **Error Analysis**: Provide detailed feedback on sequence errors
- **Performance Tracking**: Track drill performance over multiple attempts
- **Integration**: Works with existing EdgeTracer and cube scrambling infrastructure

## Usage

### Basic Usage

```typescript
import { SequenceValidator, scrambleAndValidate } from './sequence-validator';

// Create validator instance
const validator = new SequenceValidator();

// Validate a drill sequence
const result = validator.scrambleAndValidate("U R U' R'", "a b c d");

console.log(`Score: ${result.score}%`);
console.log(`Valid: ${result.isValid}`);
```

### Using Convenience Functions

```typescript
import { scrambleAndValidate, calculateSequenceScore } from './sequence-validator';

// Direct validation
const result = scrambleAndValidate("U R U' R'", "a b c d");

// Calculate score only
const score = calculateSequenceScore("a b c d", "a b x d");
```

### Drill Workflow

```typescript
const validator = new SequenceValidator();

// 1. Generate scramble
const scrambleString = "U R U' R'";

// 2. Get expected sequence
const expectedResult = validator.scrambleAndValidate(scrambleString, '');
const expectedSequence = expectedResult.expectedSequence;

// 3. Validate user input
const userSequence = "a b c d"; // User's traced sequence
const validationResult = validator.scrambleAndValidate(scrambleString, userSequence);

// 4. Get detailed analysis
const analysis = validator.analyzeValidationResult(validationResult);
console.log(analysis.summary);
console.log(analysis.suggestions);
```

## API Reference

### SequenceValidator Class

#### Constructor
```typescript
const validator = new SequenceValidator();
```

#### Main Methods

##### `validateDrillSequence(input: SequenceValidationInput): DrillValidationResult`
Validates a user's traced sequence against the expected solution.

**Parameters:**
- `input.scrambleString`: Original scramble sequence
- `input.userTracingSequence`: User's traced sequence

**Returns:**
- `DrillValidationResult` with validation details, score, and analysis

##### `scrambleAndValidate(scrambleString: string, userSequence: string): DrillValidationResult`
Convenience method that combines scramble generation and validation.

##### `calculateSequenceScore(expected: string, user: string): number`
Calculates percentage score based on sequence comparison.

##### `analyzeValidationResult(result: DrillValidationResult): AnalysisResult`
Provides detailed analysis and suggestions for improvement.

### Data Models

#### SequenceValidationInput
```typescript
interface SequenceValidationInput {
  scrambleString: string;
  userTracingSequence: string;
}
```

#### DrillValidationResult
```typescript
interface DrillValidationResult {
  isValid: boolean;
  expectedSequence: string;
  userSequence: string;
  finalCubeState: EdgeTracerCubeState;
  edgesInPosition: string[];
  flippedEdges: string[];
  errors: string[];
  score: number;
}
```

## Algorithm Details

### Validation Process

1. **Generate Scrambled Cube**: Use scramble string to create cube state
2. **Get Expected Sequence**: Use EdgeTracer.do_full_trace() to get correct sequence
3. **Apply User Sequence**: For each letter in user sequence:
   - Apply setup move to cube
   - Apply edge swap algorithm: `R U R' U' R' F R2 U' R' U' R U R' F'`
   - Apply inverse setup move
4. **Validation Check**: Check if all edges are in correct positions
5. **Score Calculation**: Compare user sequence with expected sequence

### Scoring System

- **Perfect Match**: 100% score
- **Partial Match**: Percentage based on correct letters
- **Length Penalty**: Penalty for sequence length differences
- **Error Penalty**: Additional penalty for validation errors

### Setup Moves

The validator uses predefined setup moves for each edge position:

- `a`: Lw2 D' L2
- `c`: Lw2 D L2
- `e`: L' Dw L'
- `f`: Dw' L
- `g`: L Dw L'
- `h`: Dw L'
- `i`: Lw D' L2
- `j`: Dw2 L
- `k`: Lw D L2
- `l`: L'
- `n`: Dw L
- `o`: D' Lw D L2
- `p`: Dw' L'
- `q`: Lw' D L2
- `r`: L
- `s`: Lw' D' L2
- `t`: Dw2 L'
- `u`: D' L2
- `v`: D2 L2
- `w`: D L2
- `x`: L2

## Error Handling

The validator handles various error conditions:

- **Invalid Scramble Strings**: Returns error for malformed scrambles
- **Invalid Sequence Letters**: Handles unknown edge position letters
- **Move Application Errors**: Catches errors during cube manipulation
- **Missing Setup Moves**: Provides error for undefined setup moves

## Integration Points

- **EdgeTracer**: Uses existing edge tracing functionality
- **Cube Scrambler**: Leverages cube scrambling infrastructure
- **Move Applier**: Converts between cube state representations
- **Data Models**: Uses established TypeScript interfaces

## Testing

The service includes comprehensive tests covering:

- Perfect sequence matches
- Partial sequence matches
- Error handling scenarios
- Performance tests
- Integration tests
- Edge cases

## Demo

Run the demo to see the validator in action:

```typescript
import { runSequenceValidationDemo } from '../examples/sequence-validation-demo';

runSequenceValidationDemo();
```

The demo includes:
- Interactive drill simulation
- Multiple drill scenarios
- Specific test cases
- Performance analysis
- Detailed feedback

## Future Enhancements

- **Drill System Integration**: Full integration with drill management system
- **Progress Tracking**: Long-term performance tracking
- **Difficulty Levels**: Adaptive difficulty based on user performance
- **Visual Feedback**: Enhanced visual cube state representation
- **Analytics**: Detailed performance analytics and insights
