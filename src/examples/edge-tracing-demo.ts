import { EdgeTracer, traceEdges } from '../services/edge-tracer';
import { CubeState } from '../models/cube-models';

/**
 * Demo script showing how to use the Edge Tracer
 */
function demonstrateEdgeTracing() {
  console.log('=== Edge Tracing Algorithm Demo ===\n');
  
  const tracer = new EdgeTracer();
  
  // 1. Test with solved cube
  console.log('1. Testing with solved cube:');
  const solvedCube = tracer.createSolvedCubeState();
  const solvedResult = tracer.do_full_trace(solvedCube);
  console.log(`Result: "${solvedResult}"`);
  console.log('Expected: Empty string (no cycles needed)\n');
  
  // 2. Test with simple swap
  console.log('2. Testing with simple swap (a <-> b):');
  const swapCube = tracer.createSolvedCubeState();
  
  // Swap pieces at positions 'a' and 'b'
  const temp = swapCube['a'];
  swapCube['a'] = swapCube['b'];
  swapCube['b'] = temp;
  
  const swapResult = tracer.do_full_trace(swapCube);
  console.log(`Result: "${swapResult}"`);
  console.log('Expected: "a b" (cycle: a -> b -> a)\n');
  
  // 3. Test with three-way cycle
  console.log('3. Testing with three-way cycle (a -> b -> c -> a):');
  const cycleCube = tracer.createSolvedCubeState();
  
  // Create a 3-cycle: a -> b -> c -> a
  const tempA = cycleCube['a'];
  const tempB = cycleCube['b'];
  const tempC = cycleCube['c'];
  
  cycleCube['a'] = tempC;
  cycleCube['b'] = tempA;
  cycleCube['c'] = tempB;
  
  const cycleResult = tracer.do_full_trace(cycleCube);
  console.log(`Result: "${cycleResult}"`);
  console.log('Expected: "a b c" (cycle: a -> b -> c -> a)\n');
  
  // 4. Test with multiple cycles
  console.log('4. Testing with multiple cycles:');
  const multiCycleCube = tracer.createSolvedCubeState();
  
  // Create two separate 2-cycles: a <-> b and c <-> d
  const tempA2 = multiCycleCube['a'];
  const tempB2 = multiCycleCube['b'];
  const tempC2 = multiCycleCube['c'];
  const tempD2 = multiCycleCube['d'];
  
  multiCycleCube['a'] = tempB2;
  multiCycleCube['b'] = tempA2;
  multiCycleCube['c'] = tempD2;
  multiCycleCube['d'] = tempC2;
  
  const multiResult = tracer.do_full_trace(multiCycleCube);
  console.log(`Result: "${multiResult}"`);
  console.log('Expected: Contains both "a b" and "c d" cycles\n');
  
  // 5. Test flipped edge detection
  console.log('5. Testing flipped edge detection:');
  const flippedCube = tracer.createSolvedCubeState();
  
  // Flip edge at position 'a' (swap its colors)
  const originalColors = flippedCube['a'].colors;
  flippedCube['a'] = {
    colors: [originalColors[1], originalColors[0]],
    orientation: 'flipped'
  };
  
  const isFlipped = tracer.is_edge_flipped('a', flippedCube);
  console.log(`Is edge at position 'a' flipped? ${isFlipped}`);
  console.log('Expected: true\n');
  
  // 6. Show all edge positions
  console.log('6. All edge positions in the cube:');
  const allPositions = tracer.getAllEdgePositions();
  console.log(`Positions: ${allPositions.join(', ')}`);
  console.log(`Total: ${allPositions.length} edge positions\n`);
  
  // 7. Demonstrate helper functions
  console.log('7. Helper function examples:');
  const notation = tracer.get_edge_solved_position_by_colors(['white', 'blue']);
  console.log(`Edge with colors white-blue is at position: ${notation}`);
  
  const secondary = tracer.get_secondary_edge_letter('A');
  console.log(`Secondary position for 'A' is: ${secondary}`);
  
  const colors = tracer.get_colors_by_letter('a', solvedCube);
  console.log(`Colors at position 'a' in solved cube: ${colors.join(', ')}`);
  
  console.log('\n=== Demo Complete ===');
}

/**
 * Example of integrating with cube scrambler
 */
function demonstrateWithScrambler() {
  console.log('\n=== Integration with Cube Scrambler ===\n');
  
  const tracer = new EdgeTracer();
  
  // This would typically come from the cube scrambler
  // For demo purposes, we'll create a manually scrambled state
  const scrambledCube = tracer.createSolvedCubeState();
  
  // Simulate a scramble by swapping several pieces
  const swaps = [
    ['a', 'b'],
    ['c', 'd'],
    ['e', 'f'],
    ['g', 'h']
  ];
  
  swaps.forEach(([pos1, pos2]) => {
    const temp = scrambledCube[pos1];
    scrambledCube[pos1] = scrambledCube[pos2];
    scrambledCube[pos2] = temp;
  });
  
  console.log('Scrambled cube state created');
  console.log('Tracing edges...');
  
  const result = tracer.do_full_trace(scrambledCube);
  console.log(`Edge tracing result: "${result}"`);
  
  // Parse the result to show individual cycles
  const cycles = result.trim().split(' ').filter(letter => letter.length > 0);
  console.log(`Total pieces in cycles: ${cycles.length}`);
  console.log(`Cycles: ${cycles.join(' ')}`);
}

// Run the demos
demonstrateEdgeTracing();
demonstrateWithScrambler();

export { demonstrateEdgeTracing, demonstrateWithScrambler };
