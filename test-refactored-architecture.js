// Test the refactored architecture
import { scramble_cube } from './dist/services/cube-scrambler.js';
import { traceEdgesFromScrambler } from './dist/services/edge-tracer.js';

console.log('🧪 Testing refactored architecture...\n');

// Test 1: Scramble a cube (scrambler only handles colors)
console.log('=== Test 1: Scrambling cube ===');
const scrambledCube = scramble_cube('Lw');
console.log('✅ Scrambler completed - cube state returned\n');

// Test 2: Trace edges from scrambler output
console.log('=== Test 2: Edge tracing from scrambler output ===');
try {
  const edgeTrace = traceEdgesFromScrambler(scrambledCube);
  console.log('✅ Edge tracing completed:', edgeTrace);
} catch (error) {
  console.log('❌ Edge tracing failed:', error.message);
}

console.log('\n🎉 Architecture test completed!');
