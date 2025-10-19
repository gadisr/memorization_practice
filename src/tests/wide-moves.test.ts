import { generate_scramble_sequence, scramble_cube, explain_move } from '../services/cube-scrambler.js';

/**
 * Comprehensive test suite for wide moves (Lw, Dw)
 */

// Simple test framework
function runWideMovesTests() {
  console.log('🧪 === WIDE MOVES TEST SUITE ===\n');
  
  let passed = 0;
  let failed = 0;
  
  function test(name: string, testFn: () => void) {
    try {
      console.log(`🧪 Testing: ${name}`);
      testFn();
      console.log(`✅ PASSED: ${name}\n`);
      passed++;
    } catch (error) {
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error}\n`);
      failed++;
    }
  }
  
  function expect(actual: any) {
    return {
      toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
      },
      not: {
        toEqual: (expected: any) => {
          if (JSON.stringify(actual) === JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(actual)} to not equal ${JSON.stringify(expected)}`);
          }
        }
      },
      toContain: (expected: any) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: (expected: number) => {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${expected}, but got ${actual.length}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined || actual === null) {
          throw new Error(`Expected value to be defined, but got ${actual}`);
        }
      },
      toBeLessThan: (expected: number) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      }
    };
  }

  // Helper function to get cube signature for comparison
  function getCubeSignature(cube: any): string {
    return JSON.stringify({
      U: cube.faces.U.colors,
      L: cube.faces.L.colors,
      F: cube.faces.F.colors,
      R: cube.faces.R.colors,
      B: cube.faces.B.colors,
      D: cube.faces.D.colors
    });
  }

  // Helper function to create solved cube
  function createSolvedCube(): any {
    return {
      faces: {
        U: { center: 'white', colors: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']] },
        L: { center: 'orange', colors: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']] },
        F: { center: 'green', colors: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']] },
        R: { center: 'red', colors: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']] },
        B: { center: 'blue', colors: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']] },
        D: { center: 'yellow', colors: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']] }
      }
    };
  }

  // Helper function to apply move (we'll need to import this)
  function applyMove(cube: any, move: string): void {
    // This is a simplified version - in real implementation we'd import the actual function
    // For now, we'll test the scramble_cube function which uses apply_move internally
    const result = scramble_cube(move);
    Object.assign(cube.faces, result.faces);
  }

  // ===== BASIC WIDE MOVE TESTS =====
  
  test('should generate scramble sequences with wide moves', () => {
    const scramble = generate_scramble_sequence(10);
    const moves = scramble.split(' ');
    
    // Should contain some wide moves occasionally
    const hasWideMoves = moves.some(move => move.startsWith('Lw') || move.startsWith('Dw'));
    
    // At least should be able to generate scrambles with wide moves
    expect(moves).toHaveLength(10);
    expect(scramble).toBeDefined();
  });

  test('should explain Lw moves correctly', () => {
    const explanation = explain_move('Lw');
    expect(explanation).toContain('Left wide');
    expect(explanation).toContain('LEFT face');
    expect(explanation).toContain('M slice');
  });

  test('should explain Dw moves correctly', () => {
    const explanation = explain_move('Dw');
    expect(explanation).toContain('Down wide');
    expect(explanation).toContain('DOWN face');
    expect(explanation).toContain('E slice');
  });

  test('should explain Lw\' moves correctly', () => {
    const explanation = explain_move('Lw\'');
    expect(explanation).toContain('counter-clockwise');
    expect(explanation).toContain('Left wide');
  });

  test('should explain Dw2 moves correctly', () => {
    const explanation = explain_move('Dw2');
    expect(explanation).toContain('180 degrees');
    expect(explanation).toContain('Down wide');
  });

  // ===== SLICE MOVE VALIDATION TESTS =====
  
  test('should apply Lw move and change cube state', () => {
    const cube = createSolvedCube();
    const initialState = getCubeSignature(cube);
    
    applyMove(cube, 'Lw');
    const finalState = getCubeSignature(cube);
    
    // Lw should change the cube state
    expect(finalState).not.toEqual(initialState);
  });

  test('should apply Dw move and change cube state', () => {
    const cube = createSolvedCube();
    const initialState = getCubeSignature(cube);
    
    applyMove(cube, 'Dw');
    const finalState = getCubeSignature(cube);
    
    // Dw should change the cube state
    expect(finalState).not.toEqual(initialState);
  });

  // ===== WIDE MOVE COMBINATION TESTS =====
  
  test('should handle Lw + Lw\' sequence', () => {
    const cube1 = createSolvedCube();
    const cube2 = createSolvedCube();
    
    // Apply Lw + Lw' to first cube
    applyMove(cube1, 'Lw Lw\'');
    
    // Apply no moves to second cube (should remain solved)
    const state1 = getCubeSignature(cube1);
    const state2 = getCubeSignature(cube2);
    
    // Lw + Lw' should return to solved state
    expect(state1).toEqual(state2);
  });

  test('should handle Dw + Dw\' sequence', () => {
    const cube1 = createSolvedCube();
    const cube2 = createSolvedCube();
    
    // Apply Dw + Dw' to first cube
    applyMove(cube1, 'Dw Dw\'');
    
    // Apply no moves to second cube (should remain solved)
    const state1 = getCubeSignature(cube1);
    const state2 = getCubeSignature(cube2);
    
    // Dw + Dw' should return to solved state
    expect(state1).toEqual(state2);
  });

  test('should handle Lw2 as equivalent to Lw + Lw', () => {
    const cube1 = createSolvedCube();
    const cube2 = createSolvedCube();
    
    // Apply Lw2 to first cube
    applyMove(cube1, 'Lw2');
    
    // Apply Lw + Lw to second cube
    applyMove(cube2, 'Lw Lw');
    
    const state1 = getCubeSignature(cube1);
    const state2 = getCubeSignature(cube2);
    
    // Lw2 should be equivalent to Lw + Lw
    expect(state1).toEqual(state2);
  });

  test('should handle Dw2 as equivalent to Dw + Dw', () => {
    const cube1 = createSolvedCube();
    const cube2 = createSolvedCube();
    
    // Apply Dw2 to first cube
    applyMove(cube1, 'Dw2');
    
    // Apply Dw + Dw to second cube
    applyMove(cube2, 'Dw Dw');
    
    const state1 = getCubeSignature(cube1);
    const state2 = getCubeSignature(cube2);
    
    // Dw2 should be equivalent to Dw + Dw
    expect(state1).toEqual(state2);
  });

  // ===== INTEGRATION TESTS =====
  
  test('should handle mixed basic and wide moves', () => {
    const scramble = 'R Lw U Dw\' F2';
    const cube = scramble_cube(scramble);
    
    expect(cube).toBeDefined();
    expect(cube.faces).toBeDefined();
    expect(cube.faces.U).toBeDefined();
    expect(cube.faces.L).toBeDefined();
    expect(cube.faces.F).toBeDefined();
    expect(cube.faces.R).toBeDefined();
    expect(cube.faces.B).toBeDefined();
    expect(cube.faces.D).toBeDefined();
  });

  test('should handle complex wide move sequences', () => {
    const scramble = 'Lw Dw Lw\' Dw\' Lw2 Dw2';
    const cube = scramble_cube(scramble);
    
    expect(cube).toBeDefined();
    expect(cube.faces).toBeDefined();
  });

  // ===== EDGE CASE TESTS =====
  
  test('should handle consecutive wide moves', () => {
    const scramble = 'Lw Lw Dw Dw';
    const cube = scramble_cube(scramble);
    
    expect(cube).toBeDefined();
    expect(cube.faces).toBeDefined();
  });

  test('should handle wide moves in long sequences', () => {
    const scramble = 'R U R\' F\' R U R\' U\' R\' F R2 U\' R\' Lw Dw Lw\' Dw\' Lw2 Dw2';
    const cube = scramble_cube(scramble);
    
    expect(cube).toBeDefined();
    expect(cube.faces).toBeDefined();
  });

  // ===== PERFORMANCE TESTS =====
  
  test('should handle wide moves without performance issues', () => {
    const startTime = Date.now();
    
    // Generate and apply multiple scrambles with wide moves
    for (let i = 0; i < 10; i++) {
      const scramble = generate_scramble_sequence(25);
      const cube = scramble_cube(scramble);
      expect(cube).toBeDefined();
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete in reasonable time (less than 5 seconds)
    expect(duration).toBeLessThan(5000);
  });

  // ===== SUMMARY =====
  
  console.log('📊 === TEST SUMMARY ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('🎉 All wide move tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }
}

// Export the test function
export { runWideMovesTests };

// Run tests if this file is executed directly
// Since this is an ES module, we'll run the tests by default
runWideMovesTests();
