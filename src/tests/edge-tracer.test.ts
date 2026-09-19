import { EdgeTracer, traceEdges, traceStats } from '../services/edge-tracer.js';
import { CubeState } from '../models/cube-models.js';

// Simple test runner for edge tracer
function runEdgeTracerTests() {
  console.log('=== Edge Tracer Test Suite ===\n');
  
  const tracer = new EdgeTracer();
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
      }
    };
  }

  // Test 1: Data Loading
  test('should load edge notation data', () => {
    const edgePositions = tracer.getAllEdgePositions();
    expect(edgePositions).toHaveLength(24);
    expect(edgePositions).toContain('a');
    expect(edgePositions).toContain('x');
  });

  // Test 2: Solved cube should return empty
  test('solved cube should return empty tracing string', () => {
    const solvedCube = tracer.createSolvedCubeState();
    const result = tracer.do_full_trace(solvedCube);
    expect(result.trim()).toBe('');
  });

  // Test 3: Simple swap
  test('should handle simple swap (a <-> b)', () => {
    const cubeState = tracer.createSolvedCubeState();
    
    // Swap pieces at positions 'a' and 'b'
    const temp = cubeState['a'];
    cubeState['a'] = cubeState['b'];
    cubeState['b'] = temp;
    
    const result = tracer.do_full_trace(cubeState);
    expect(result.trim()).toBe('a');
  });

  // Test 4: Three-way cycle
  test('should handle three-way cycle (a -> b -> c -> a)', () => {
    const cubeState = tracer.createSolvedCubeState();
    
    // Create a 3-cycle: a -> b -> c -> a
    const tempA = cubeState['a'];
    const tempB = cubeState['b'];
    const tempC = cubeState['c'];
    
    cubeState['a'] = tempC;
    cubeState['b'] = tempA;
    cubeState['c'] = tempB;
    
    const result = tracer.do_full_trace(cubeState);
    expect(result.trim()).toBe('a c');
  });

  // Test 5: Helper functions
  test('get_edge_solved_position_by_colors should find correct notation', () => {
    const notation = tracer.get_edge_solved_position_by_colors(['white', 'blue']);
    expect(notation).toBe('a');
  });

  // Test 6: Secondary edge letter
  test('get_secondary_edge_letter should find correlate position', () => {
    const secondary = tracer.get_secondary_edge_letter('a');
    expect(secondary).toBe('q');
    
    const primary = tracer.get_secondary_edge_letter('b');
    expect(primary).toBe('m');
  });

  // Test 7: Position inclusion check
  test('is_position_included should check both primary and secondary', () => {
    const lettersList = ['a', 'b', 'c'];
    expect(tracer.is_position_included('a', lettersList)).toBe(true);
    expect(tracer.is_position_included('b', lettersList)).toBe(true);
    expect(tracer.is_position_included('q', lettersList)).toBe(true);
    expect(tracer.is_position_included('m', lettersList)).toBe(true);
    expect(tracer.is_position_included('n', lettersList)).toBe(false);
  });

  // Test 8: Flipped edge detection
  test('should detect flipped edges', () => {
    const cubeState = tracer.createSolvedCubeState();
    
    // Flip edge at position 'a' (swap its colors)
    const originalColors = cubeState['a'].colors;
    cubeState['a'] = {
      colors: [originalColors[1], originalColors[0]],
      orientation: 'flipped'
    };
    
    const isFlipped = tracer.is_edge_flipped('a', cubeState);
    expect(isFlipped).toBe(true);
  });

  // Test 9: Multiple cycles
  test('should handle multiple cycles', () => {
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
    expect(result).toContain('a');
    expect(result).toContain('d c');
  });

  // Test 10: Performance test
  test('should complete tracing in reasonable time', () => {
    const cubeState = tracer.createSolvedCubeState();
    
    const startTime = Date.now();
    const result = tracer.do_full_trace(cubeState);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    expect(result.trim()).toBe('');
  });

  // Test 11: Export function
  test('traceEdges function should work correctly', () => {
    const solvedCube = tracer.createSolvedCubeState();
    const result = traceEdges(solvedCube);
    expect(result.trim()).toBe('');
  });

  function expectTraceStats(
    trace: string,
    expected: { cycleCount: number; letterCount: number; isBufferVisited: boolean }
  ) {
    const stats = traceStats(trace);
    expect(stats.cycleCount).toBe(expected.cycleCount);
    expect(stats.letterCount).toBe(expected.letterCount);
    expect(stats.isBufferVisited).toBe(expected.isBufferVisited);
  }

  // Test 12: Empty memo
  test('traceStats returns zeros for an empty trace', () => {
    expectTraceStats('', { cycleCount: 0, letterCount: 0, isBufferVisited: false });
    expectTraceStats('   |  ', { cycleCount: 0, letterCount: 0, isBufferVisited: false });
  });

  // Test 13: Single open cycle, buffer letter omitted
  test('traceStats counts one cycle when the buffer letter is omitted', () => {
    expectTraceStats('a c', { cycleCount: 1, letterCount: 2, isBufferVisited: false });
  });

  // Test 14: Tutorial memo with an explicit cycle break
  test('traceStats counts letters and cycles in a multi-cycle memo', () => {
    expectTraceStats('m f j | r k e r', { cycleCount: 2, letterCount: 7, isBufferVisited: true });
  });

  // Test 15: Buffer letter written into the memo
  test('traceStats detects a written buffer letter', () => {
    expectTraceStats('d b', { cycleCount: 1, letterCount: 2, isBufferVisited: true });
  });

  // Test 16: Closed break-in cycle
  test('traceStats treats a repeated break-in letter as one cycle', () => {
    expectTraceStats('c d c', { cycleCount: 1, letterCount: 3, isBufferVisited: false });
  });

  // Test 17: First cycle plus a later cycle, no pipe separator
  test('traceStats splits a first cycle from a later closed cycle', () => {
    expectTraceStats('a c d c', { cycleCount: 2, letterCount: 4, isBufferVisited: false });
  });

  // Test 18: Stats agree with traces the edge tracer actually emits
  test('traceStats matches tracer output for solved, swap, and two cycles', () => {
    const solvedStats = traceStats(tracer.do_full_trace(tracer.createSolvedCubeState()));
    expect(solvedStats.cycleCount).toBe(0);
    expect(solvedStats.letterCount).toBe(0);
    expect(solvedStats.isBufferVisited).toBe(false);

    const swapCube = tracer.createSolvedCubeState();
    const swappedA = swapCube['a'];
    swapCube['a'] = swapCube['b'];
    swapCube['b'] = swappedA;
    expectTraceStats(tracer.do_full_trace(swapCube), {
      cycleCount: 1,
      letterCount: 1,
      isBufferVisited: false,
    });

    const multiCube = tracer.createSolvedCubeState();
    const pieceA = multiCube['a'];
    const pieceB = multiCube['b'];
    const pieceC = multiCube['c'];
    const pieceD = multiCube['d'];
    multiCube['a'] = pieceB;
    multiCube['b'] = pieceA;
    multiCube['c'] = pieceD;
    multiCube['d'] = pieceC;
    expectTraceStats(tracer.do_full_trace(multiCube), {
      cycleCount: 2,
      letterCount: 4,
      isBufferVisited: false,
    });
  });

  // Test 19: Colors by letter
  test('get_colors_by_letter should return correct colors', () => {
    const solvedCube = tracer.createSolvedCubeState();
    const colors = tracer.get_colors_by_letter('a', solvedCube);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe('white');
    expect(colors[1]).toBe('blue');
  });

  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('❌ Some tests failed');
    process.exitCode = 1;
  }
}

// Run the tests
runEdgeTracerTests();
