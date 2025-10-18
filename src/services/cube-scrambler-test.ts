import { generate_scramble_sequence, scramble_cube, print_cube, example_usage, explain_move, test_individual_moves, test_rotation_variants, test_specific_moves } from './cube-scrambler.js';

// Test the cube scrambling functions
function test_cube_scrambler(): void {
  console.log('Testing Cube Scrambler Functions\n');
  
  // Test 1: Generate scramble sequence
  console.log('=== Test 1: Generate Scramble Sequence ===');
  const scramble1 = generate_scramble_sequence(10);
  console.log(`10-move scramble: ${scramble1}`);
  
  const scramble2 = generate_scramble_sequence(25);
  console.log(`25-move scramble: ${scramble2}\n`);
  
  // Test 2: Apply scramble to cube
  console.log('=== Test 2: Apply Scramble to Cube ===');
  const testScramble = "R U R' F' R U R' U' R' F R2 U' R'";
  console.log(`Test scramble: ${testScramble}`);
  
  const scrambledCube = scramble_cube(testScramble);
  console.log('Scramble applied successfully!\n');
  
  // Test 3: Print cube
  console.log('=== Test 3: Print Cube ===');
  print_cube(scrambledCube);
  
  // Test 4: Individual move explanations
  console.log('=== Test 4: Individual Move Explanations ===');
  const testMove = 'R';
  console.log(explain_move(testMove));
  
  // Test 5: Test all individual moves
  console.log('=== Test 5: Test All Individual Moves ===');
  test_individual_moves();
  
  // Test 6: Test rotation variants
  console.log('=== Test 6: Test Rotation Variants ===');
  test_rotation_variants();
  
  // Test 7: Test specific moves with detailed logging
  console.log('=== Test 7: Test Specific Moves ===');
  test_specific_moves();
  
  // Test 8: Full example
  console.log('=== Test 8: Full Example ===');
  example_usage();
}

// Run the test if this file is executed directly
// Note: In ES modules, you can't use require.main === module
// Instead, you can run the test by calling the function directly

export { test_cube_scrambler };
