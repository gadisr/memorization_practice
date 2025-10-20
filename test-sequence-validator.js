// Simple test script for sequence validator
import { scrambleAndValidate } from './dist/services/sequence-validator.js';

console.log('🧪 Testing sequence validator with detailed logging...\n');

try {
  const result = scrambleAndValidate("U R U' R'", "");
  console.log('\n✅ Test completed successfully!');
  console.log(`Score: ${result.score}%`);
  console.log(`Valid: ${result.isValid}`);
  console.log(`Expected sequence: "${result.expectedSequence}"`);
} catch (error) {
  console.error('❌ Test failed:', error);
}
