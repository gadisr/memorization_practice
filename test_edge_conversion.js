import { scramble_cube } from './src/services/cube-scrambler.js';
import { EdgeTracer } from './src/services/edge-tracer.js';

console.log('=== TESTING EDGE CONVERSION ISSUE ===\n');

// Test the problematic scramble
const scramble = "U2 D' F' L B' F2";
console.log(`Testing scramble: ${scramble}`);

const cube = scramble_cube(scramble);
console.log('\nScrambled cube generated successfully');

// Create edge tracer
const tracer = new EdgeTracer();

console.log('\n=== TESTING EDGE CONVERSION ===');
try {
  const edgeCubeState = tracer.convertFromScramblerCube(cube);
  console.log('✅ Edge conversion successful');
  console.log('Edge positions loaded:', Object.keys(edgeCubeState).length);
  
  // Show some sample edge positions
  console.log('\nSample edge positions:');
  console.log('a:', edgeCubeState.a);
  console.log('b:', edgeCubeState.b);
  console.log('c:', edgeCubeState.c);
  console.log('d:', edgeCubeState.d);
  console.log('e:', edgeCubeState.e);
  
} catch (error) {
  console.error('❌ Edge conversion failed:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n=== TESTING EDGE TRACING ===');
try {
  const edgeCubeState = tracer.extractEdgeColorsFromCube(cube);
  console.log('✅ Edge extraction successful');
  
  const result = tracer.do_full_trace(edgeCubeState);
  console.log('✅ Edge tracing successful');
  console.log('Result:', result);
  
} catch (error) {
  console.error('❌ Edge tracing failed:', error.message);
  console.error('Stack:', error.stack);
}

