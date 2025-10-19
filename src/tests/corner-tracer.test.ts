import { CornerTracer, CornerState, traceCorners } from '../services/corner-tracer.js';

// Simple test runner for corner tracer
function runCornerTracerTests() {
  console.log('=== Corner Tracer Test Suite ===\n');
  
  const tracer = new CornerTracer();
  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, testFn: () => void) {
    totalTests++;
    try {
      testFn();
      console.log(`✅ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${name}: ${error}`);
    }
  }

  function expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      },
      toContain: (expected: any) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: (expected: number) => {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${expected}, got ${actual.length}`);
        }
      },
      toBeLessThan: (expected: number) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined) {
          throw new Error(`Expected value to be defined, got undefined`);
        }
      },
      toBeGreaterThan: (expected: number) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toThrow: (expectedMessage?: string) => {
        let threw = false;
        try {
          actual();
        } catch (error: any) {
          threw = true;
          if (expectedMessage && !error.message.includes(expectedMessage)) {
            throw new Error(`Expected error message to contain "${expectedMessage}", got "${error.message}"`);
          }
        }
        if (!threw) {
          throw new Error('Expected function to throw an error');
        }
      },
      not: {
        toContain: (expected: any) => {
          if (actual.includes(expected)) {
            throw new Error(`Expected ${actual} not to contain ${expected}`);
          }
        }
      }
    };
  }

  // Test 1: Data Loading
  test('should load corner notation data', () => {
    const cornerPositions = tracer.getAllCornerPositions();
    expect(cornerPositions).toHaveLength(24);
    expect(cornerPositions).toContain('A');
    expect(cornerPositions).toContain('X');
  });

  // Test 2: Corner notation
  test('should have correct corner notation for sample corners', () => {
    const cornerA = tracer['cornerNotation'].get('A');
    expect(cornerA).toEqual(['white', 'orange', 'blue']);
    
    const cornerB = tracer['cornerNotation'].get('B');
    expect(cornerB).toEqual(['white', 'blue', 'red']);
  });

  // Test 3: Secondary corner letters
  test('should return 2 additional letters for corner A', () => {
    const secondaryLetters = tracer.get_secondary_corner_letters('A');
    expect(secondaryLetters).toHaveLength(2);
    expect(secondaryLetters).not.toContain('A');
  });

  test('should return 2 additional letters for corner B', () => {
    const secondaryLetters = tracer.get_secondary_corner_letters('B');
    expect(secondaryLetters).toHaveLength(2);
    expect(secondaryLetters).not.toContain('B');
  });

  test('should throw error for invalid notation', () => {
    expect(() => tracer.get_secondary_corner_letters('Z')).toThrow('No corner found with notation Z');
  });

  // Test 4: Corner solved position by colors
  test('should find correct position for corner B colors (white first)', () => {
    const position = tracer.get_corner_solved_position_by_colors(['white', 'blue', 'red']);
    expect(position).toBe('B');
  });

  test('should find correct position for corner Q colors (blue first)', () => {
    const position = tracer.get_corner_solved_position_by_colors(['blue', 'red', 'white']);
    expect(position).toBe('Q');
  });

  test('should find correct position for corner N colors (red first)', () => {
    const position = tracer.get_corner_solved_position_by_colors(['red', 'white', 'blue']);
    expect(position).toBe('N');
  });

  test('should throw error for invalid colors', () => {
    expect(() => tracer.get_corner_solved_position_by_colors(['purple', 'black', 'silver']))
      .toThrow('No corner found with first color purple');
  });

  // Test 5: Create solved corner state
  test('should create solved cube state', () => {
    const solvedState = tracer.createSolvedCornerState();
    
    // Check that all positions exist
    const allPositions = tracer.getAllCornerPositions();
    allPositions.forEach(position => {
      expect(solvedState[position]).toBeDefined();
      expect(solvedState[position].colors).toHaveLength(3);
      expect(solvedState[position].orientation).toBe('correct');
    });
  });

  test('should have correct colors for corner A in solved state', () => {
    const solvedState = tracer.createSolvedCornerState();
    expect(solvedState['A'].colors).toEqual(['white', 'orange', 'blue']);
  });

  // Test 6: Position checking
  test('should return true for solved corner', () => {
    const solvedState = tracer.createSolvedCornerState();
    expect(tracer.is_in_position('A', solvedState)).toBe(true);
  });

  test('should return true for corner in secondary position', () => {
    const solvedState = tracer.createSolvedCornerState();
    // Corner A should be in position A in solved state
    expect(tracer.is_in_position('A', solvedState)).toBe(true);
  });

  // Test 7: Cycle detection
  test('should return empty cycle for solved cube', () => {
    const solvedState = tracer.createSolvedCornerState();
    const [cycleString, lettersInCycle] = tracer.do_cycle('A', solvedState, false);
    expect(cycleString.trim()).toBe('');
    expect(lettersInCycle).toHaveLength(1); // only A is in the cycle
  });

  test('should handle single piece cycle', () => {
    // Create a state where corner A is in wrong position
    const scrambledState: CornerState = {
      'A': { colors: ['red', 'white', 'blue'], orientation: 'correct' },
      'B': { colors: ['white', 'red', 'green'], orientation: 'correct' },
      'C': { colors: ['white', 'green', 'orange'], orientation: 'correct' },
      'D': { colors: ['white', 'orange', 'blue'], orientation: 'correct' },
      'E': { colors: ['orange', 'white', 'blue'], orientation: 'correct' },
      'F': { colors: ['orange', 'blue', 'yellow'], orientation: 'correct' },
      'G': { colors: ['orange', 'yellow', 'green'], orientation: 'correct' },
      'H': { colors: ['orange', 'green', 'white'], orientation: 'correct' },
      'I': { colors: ['green', 'white', 'red'], orientation: 'correct' },
      'J': { colors: ['green', 'red', 'yellow'], orientation: 'correct' },
      'K': { colors: ['green', 'yellow', 'orange'], orientation: 'correct' },
      'L': { colors: ['green', 'orange', 'white'], orientation: 'correct' },
      'M': { colors: ['red', 'white', 'blue'], orientation: 'correct' },
      'N': { colors: ['red', 'blue', 'yellow'], orientation: 'correct' },
      'O': { colors: ['red', 'yellow', 'green'], orientation: 'correct' },
      'P': { colors: ['red', 'green', 'white'], orientation: 'correct' },
      'Q': { colors: ['blue', 'white', 'orange'], orientation: 'correct' },
      'R': { colors: ['blue', 'orange', 'yellow'], orientation: 'correct' },
      'S': { colors: ['blue', 'yellow', 'red'], orientation: 'correct' },
      'T': { colors: ['blue', 'red', 'white'], orientation: 'correct' },
      'U': { colors: ['yellow', 'green', 'red'], orientation: 'correct' },
      'V': { colors: ['yellow', 'red', 'blue'], orientation: 'correct' },
      'W': { colors: ['yellow', 'blue', 'orange'], orientation: 'correct' },
      'X': { colors: ['yellow', 'orange', 'green'], orientation: 'correct' }
    };

    const [cycleString, lettersInCycle] = tracer.do_cycle('A', scrambledState, false);
    expect(lettersInCycle.length).toBeGreaterThan(0);
  });

  // Test 8: Full trace
  test('should return empty string for solved cube', () => {
    const solvedState = tracer.createSolvedCornerState();
    const result = tracer.do_full_trace(solvedState);
    expect(result.trim()).toBe('');
  });

  test('should handle scrambled cube', () => {
    // Create a simple scrambled state
    const scrambledState: CornerState = {
      'A': { colors: ['white', 'orange', 'blue'], orientation: 'correct' },
      'B': { colors: ['white', 'blue', 'red'], orientation: 'correct' },
      'C': { colors: ['white', 'green', 'red'], orientation: 'correct' },
      'D': { colors: ['white', 'orange', 'green'], orientation: 'correct' },
      'E': { colors: ['orange', 'white', 'blue'], orientation: 'correct' },
      'F': { colors: ['orange', 'blue', 'yellow'], orientation: 'correct' },
      'G': { colors: ['orange', 'yellow', 'green'], orientation: 'correct' },
      'H': { colors: ['orange', 'green', 'white'], orientation: 'correct' },
      'I': { colors: ['green', 'white', 'red'], orientation: 'correct' },
      'J': { colors: ['green', 'red', 'yellow'], orientation: 'correct' },
      'K': { colors: ['green', 'yellow', 'orange'], orientation: 'correct' },
      'L': { colors: ['green', 'orange', 'white'], orientation: 'correct' },
      'M': { colors: ['red', 'white', 'blue'], orientation: 'correct' },
      'N': { colors: ['red', 'blue', 'yellow'], orientation: 'correct' },
      'O': { colors: ['red', 'yellow', 'green'], orientation: 'correct' },
      'P': { colors: ['red', 'green', 'white'], orientation: 'correct' },
      'Q': { colors: ['blue', 'white', 'orange'], orientation: 'correct' },
      'R': { colors: ['blue', 'orange', 'yellow'], orientation: 'correct' },
      'S': { colors: ['blue', 'yellow', 'red'], orientation: 'correct' },
      'T': { colors: ['blue', 'red', 'white'], orientation: 'correct' },
      'U': { colors: ['yellow', 'green', 'red'], orientation: 'correct' },
      'V': { colors: ['yellow', 'red', 'blue'], orientation: 'correct' },
      'W': { colors: ['yellow', 'blue', 'orange'], orientation: 'correct' },
      'X': { colors: ['yellow', 'orange', 'green'], orientation: 'correct' }
    };

    const result = tracer.do_full_trace(scrambledState);
    expect(typeof result).toBe('string');
  });

  // Test 9: Extract corner colors from cube
  test('should handle valid cube state', () => {
    const mockCubeState = {
      faces: {
        'U': { colors: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']] },
        'L': { colors: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']] },
        'F': { colors: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']] },
        'R': { colors: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']] },
        'B': { colors: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']] },
        'D': { colors: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']] }
      }
    };

    const result = tracer.extractCornerColorsFromCube(mockCubeState);
    expect(result).toBeDefined();
  });

  test('should handle invalid cube state', () => {
    expect(() => tracer.extractCornerColorsFromCube(null)).toThrow();
  });

  // Test 10: Export function
  test('should work with export function', () => {
    const solvedState = tracer.createSolvedCornerState();
    const result = traceCorners(solvedState);
    expect(typeof result).toBe('string');
  });

  // Test 11: Edge cases
  test('should handle is_position_included correctly', () => {
    const lettersList = ['A', 'B'];
    expect(tracer.is_position_included('A', lettersList)).toBe(true);
    expect(tracer.is_position_included('C', lettersList)).toBe(false);
  });

  test('should handle is_corner_twisted correctly', () => {
    const solvedState = tracer.createSolvedCornerState();
    expect(tracer.is_corner_twisted('A', solvedState)).toBe(false);
  });

  test('should handle get_colors_by_letter with valid position', () => {
    const solvedState = tracer.createSolvedCornerState();
    const colors = tracer.get_colors_by_letter('A', solvedState);
    expect(colors).toHaveLength(3);
    expect(colors).toEqual(['white', 'orange', 'blue']);
  });

  test('should throw error for invalid position in get_colors_by_letter', () => {
    const solvedState = tracer.createSolvedCornerState();
    expect(() => tracer.get_colors_by_letter('Z', solvedState))
      .toThrow('Position Z not found in cube positions');
  });

  // Test Summary
  console.log(`\n=== Test Summary ===`);
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);
  
  return passedTests === totalTests;
}

// Run the tests
runCornerTracerTests();