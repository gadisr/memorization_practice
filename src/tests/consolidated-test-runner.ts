import { EdgeTracer, traceEdges } from '../services/edge-tracer.js';
import { CubeState } from '../services/edge-tracer.js';
import { generate_scramble_sequence, scramble_cube, print_cube, example_usage, explain_move, test_individual_moves, test_rotation_variants, test_specific_moves } from '../services/cube-scrambler.js';

/**
 * Consolidated Test Runner for Memorization Practice
 * 
 * This file consolidates all tests from various test files into a single, comprehensive test suite.
 * 
 * How to run:
 * 1. npm run build
 * 2. node dist/tests/consolidated-test-runner.js
 * 
 * Or use the npm script:
 * npm run test
 */

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    console.log('🧪 === CONSOLIDATED TEST RUNNER ===\n');
    this.startTime = Date.now();
  }

  private test(name: string, testFn: () => void): void {
    const testStartTime = Date.now();
    try {
      testFn();
      const duration = Date.now() - testStartTime;
      this.results.push({ name, passed: true, duration });
      console.log(`✅ ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - testStartTime;
      this.results.push({ 
        name, 
        passed: false, 
        error: error instanceof Error ? error.message : String(error),
        duration 
      });
      console.log(`❌ ${name}: ${error} (${duration}ms)`);
    }
  }

  private expect(actual: any) {
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
      toBeGreaterThan: (expected: number) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined || actual === null) {
          throw new Error(`Expected value to be defined, got ${actual}`);
        }
      }
    };
  }

  // ===== EDGE TRACER TESTS =====
  private runEdgeTracerTests(): void {
    console.log('🔗 === EDGE TRACER TESTS ===\n');
    
    const tracer = new EdgeTracer();

    // Test 1: Data Loading
    this.test('should load edge notation data', () => {
      const edgePositions = tracer.getAllEdgePositions();
      this.expect(edgePositions).toHaveLength(24);
      this.expect(edgePositions).toContain('a');
      this.expect(edgePositions).toContain('x');
    });

    // Test 2: Solved cube should return empty
    this.test('solved cube should return empty tracing string', () => {
      const solvedCube = tracer.createSolvedCubeState();
      const result = tracer.do_full_trace(solvedCube);
      this.expect(result.trim()).toBe('');
    });

    // Test 3: Simple swap
    this.test('should handle simple swap (a <-> b)', () => {
      const cubeState = tracer.createSolvedCubeState();
      
      // Swap pieces at positions 'a' and 'b'
      const temp = cubeState['a'];
      cubeState['a'] = cubeState['b'];
      cubeState['b'] = temp;
      
      const result = tracer.do_full_trace(cubeState);
      this.expect(result.trim()).toBe('a b');
    });

    // Test 4: Three-way cycle
    this.test('should handle three-way cycle (a -> b -> c -> a)', () => {
      const cubeState = tracer.createSolvedCubeState();
      
      // Create a 3-cycle: a -> b -> c -> a
      const tempA = cubeState['a'];
      const tempB = cubeState['b'];
      const tempC = cubeState['c'];
      
      cubeState['a'] = tempC;
      cubeState['b'] = tempA;
      cubeState['c'] = tempB;
      
      const result = tracer.do_full_trace(cubeState);
      this.expect(result.trim()).toBe('a c b');
    });

    // Test 5: Helper functions
    this.test('get_edge_solved_position_by_colors should find correct notation', () => {
      const notation = tracer.get_edge_solved_position_by_colors(['white', 'blue']);
      this.expect(notation).toBe('a');
    });

    // Test 6: Secondary edge letter
    this.test('get_secondary_edge_letter should find correlate position', () => {
      const secondary = tracer.get_secondary_edge_letter('a');
      this.expect(secondary).toBe('q');
      
      const primary = tracer.get_secondary_edge_letter('b');
      this.expect(primary).toBe('m');
    });

    // Test 7: Position inclusion check
    this.test('is_position_included should check both primary and secondary', () => {
      const lettersList = ['a', 'b', 'c'];
      this.expect(tracer.is_position_included('a', lettersList)).toBe(true);
      this.expect(tracer.is_position_included('q', lettersList)).toBe(true); // q is secondary of a
      this.expect(tracer.is_position_included('d', lettersList)).toBe(false);
    });

    // Test 8: Flipped edge detection
    this.test('should detect flipped edges', () => {
      const cubeState = tracer.createSolvedCubeState();
      
      // Flip edge at position 'a' (swap its colors)
      const originalColors = cubeState['a'].colors;
      cubeState['a'] = {
        colors: [originalColors[1], originalColors[0]],
        orientation: 'flipped'
      };
      
      const isFlipped = tracer.is_edge_flipped('a', cubeState);
      this.expect(isFlipped).toBe(true);
    });

    // Test 9: Multiple cycles
    this.test('should handle multiple cycles', () => {
      const cubeState = tracer.createSolvedCubeState();
      
      // Create two separate 2-cycles: a <-> b and c <-> d
      const tempA = cubeState['a'];
      const tempB = cubeState['b'];
      const tempC = cubeState['c'];
      const tempD = cubeState['d'];
      
      cubeState['a'] = tempB;
      cubeState['b'] = tempA;
      cubeState['c'] = tempD;
      cubeState['d'] = tempC;
      
      const result = tracer.do_full_trace(cubeState);
      // Should contain both cycles
      this.expect(result).toContain('a b');
      this.expect(result).toContain('c d');
    });

    // Test 10: Performance test
    this.test('should complete tracing in reasonable time', () => {
      const cubeState = tracer.createSolvedCubeState();
      
      const startTime = Date.now();
      const result = tracer.do_full_trace(cubeState);
      const endTime = Date.now();
      
      this.expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      this.expect(result.trim()).toBe('');
    });

    // Test 11: Export function
    this.test('traceEdges function should work correctly', () => {
      const solvedCube = tracer.createSolvedCubeState();
      const result = traceEdges(solvedCube);
      this.expect(result.trim()).toBe('');
    });

    // Test 12: Colors by letter
    this.test('get_colors_by_letter should return correct colors', () => {
      const solvedCube = tracer.createSolvedCubeState();
      const colors = tracer.get_colors_by_letter('a', solvedCube);
      this.expect(colors).toHaveLength(2);
      this.expect(colors[0]).toBe('white');
      this.expect(colors[1]).toBe('blue');
    });

    // Test 13: is_in_position helper
    this.test('is_in_position should detect correctly positioned edges', () => {
      const solvedCube = tracer.createSolvedCubeState();
      
      // All edges should be in position in a solved cube
      this.expect(tracer.is_in_position('a', solvedCube)).toBe(true);
      this.expect(tracer.is_in_position('b', solvedCube)).toBe(true);
      this.expect(tracer.is_in_position('c', solvedCube)).toBe(true);
    });

    // Test 14: Edge extraction from scrambled cube
    this.test('extractEdgeColorsFromCube should work with scrambled cube', () => {
      // Create a simple scrambled state
      const scrambledCube = {
        faces: {
          U: { colors: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']] },
          L: { colors: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']] },
          F: { colors: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']] },
          R: { colors: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']] },
          B: { colors: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']] },
          D: { colors: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']] }
        }
      };
      
      const edgeState = tracer.extractEdgeColorsFromCube(scrambledCube);
      this.expect(Object.keys(edgeState)).toHaveLength(24);
    });
  }

  // ===== CUBE SCRAMBLER TESTS =====
  private runCubeScramblerTests(): void {
    console.log('\n🎲 === CUBE SCRAMBLER TESTS ===\n');

    // Test 1: Generate scramble sequence
    this.test('should generate scramble sequences', () => {
      const scramble1 = generate_scramble_sequence(10);
      this.expect(scramble1.split(' ')).toHaveLength(10);
      
      const scramble2 = generate_scramble_sequence(25);
      this.expect(scramble2.split(' ')).toHaveLength(25);
    });

    // Test 2: Apply scramble to cube
    this.test('should apply scramble to cube', () => {
      const testScramble = "R U R' F' R U R' U' R' F R2 U' R'";
      const scrambledCube = scramble_cube(testScramble);
      this.expect(scrambledCube).toBeDefined();
      this.expect(scrambledCube.faces).toBeDefined();
    });

    // Test 3: Move explanations
    this.test('should explain moves correctly', () => {
      const explanation = explain_move('R');
      this.expect(explanation).toContain('R');
    });

    // Test 4: Individual moves
    this.test('should handle individual moves', () => {
      // This test calls the built-in test function
      test_individual_moves();
    });

    // Test 5: Rotation variants
    this.test('should handle rotation variants', () => {
      // This test calls the built-in test function
      test_rotation_variants();
    });

    // Test 6: Specific moves
    this.test('should handle specific moves', () => {
      // This test calls the built-in test function
      test_specific_moves();
    });
  }

  // ===== INTEGRATION TESTS =====
  private runIntegrationTests(): void {
    console.log('\n🔗 === INTEGRATION TESTS ===\n');

    // Test 1: Full workflow - scramble and trace
    this.test('should handle full scramble and trace workflow', () => {
      // Generate a scramble
      const scramble = generate_scramble_sequence(10);
      this.expect(scramble.split(' ')).toHaveLength(10);
      
      // Apply scramble to cube
      const scrambledCube = scramble_cube(scramble);
      this.expect(scrambledCube).toBeDefined();
      
      // Extract edge colors
      const tracer = new EdgeTracer();
      const edgeState = tracer.extractEdgeColorsFromCube(scrambledCube);
      this.expect(Object.keys(edgeState)).toHaveLength(24);
      
      // Perform edge tracing
      const tracingResult = tracer.do_full_trace(edgeState);
      this.expect(typeof tracingResult).toBe('string');
    });

    // Test 2: Performance with larger scrambles
    this.test('should handle larger scrambles efficiently', () => {
      const scramble = generate_scramble_sequence(50);
      const startTime = Date.now();
      
      const scrambledCube = scramble_cube(scramble);
      const tracer = new EdgeTracer();
      const edgeState = tracer.extractEdgeColorsFromCube(scrambledCube);
      const tracingResult = tracer.do_full_trace(edgeState);
      
      const endTime = Date.now();
      this.expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  }

  // ===== MAIN RUNNER =====
  public runAllTests(): void {
    try {
      this.runEdgeTracerTests();
      this.runCubeScramblerTests();
      this.runIntegrationTests();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test runner failed:', error);
    }
  }

  private printResults(): void {
    const totalTime = Date.now() - this.startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log('\n📊 === TEST RESULTS ===');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Total Time: ${totalTime}ms`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log('\n❌ Some tests failed:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }
    
    console.log('\n📈 Performance Summary:');
    const avgTime = this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests;
    console.log(`Average test time: ${avgTime.toFixed(2)}ms`);
    
    const slowestTests = this.results
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3);
    console.log('Slowest tests:');
    slowestTests.forEach(r => console.log(`  - ${r.name}: ${r.duration}ms`));
  }
}

// Run the tests
const runner = new TestRunner();
runner.runAllTests();
