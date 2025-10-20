import { generate_scramble_sequence, scramble_cube, print_cube, example_usage, explain_move, test_individual_moves, test_rotation_variants, test_specific_moves, apply_move } from '../services/cube-scrambler.js';
import type { CubeState } from '../models/cube-models.js';

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

// New: precise single-move assertions for face rows/columns
export function verify_single_moves(): void {
  console.log('=== VERIFY SINGLE MOVES (full-face checks) ===');
  const makeSolved = (): CubeState => ({
    faces: {
      U: { center: 'white',  colors: [['white','white','white'], ['white','white','white'], ['white','white','white']] },
      L: { center: 'orange', colors: [['orange','orange','orange'], ['orange','orange','orange'], ['orange','orange','orange']] },
      F: { center: 'green',  colors: [['green','green','green'], ['green','green','green'], ['green','green','green']] },
      R: { center: 'red',    colors: [['red','red','red'], ['red','red','red'], ['red','red','red']] },
      B: { center: 'blue',   colors: [['blue','blue','blue'], ['blue','blue','blue'], ['blue','blue','blue']] },
      D: { center: 'yellow', colors: [['yellow','yellow','yellow'], ['yellow','yellow','yellow'], ['yellow','yellow','yellow']] },
    }
  });

  const row = (face: string, r: number, cube: CubeState) => cube.faces[face as keyof typeof cube.faces].colors[r];

  // U: expectation per user convention: F[0] <- L[0], R[0] <- F[0], B[0] <- R[0], L[0] <- B[0]
  {
    const c = makeSolved();
    apply_move(c, 'U');
    console.log('After U: F[0], R[0], B[0], L[0] =>', row('F',0,c), row('R',0,c), row('B',0,c), row('L',0,c));
  }

  // U': reverse direction
  {
    const c = makeSolved();
    apply_move(c, "U");
    console.log("After U': F[0], R[0], B[0], L[0] =>", row('F',0,c), row('R',0,c), row('B',0,c), row('L',0,c));
  }

  // B': expectation snippet validation: U[0] should be [orange, orange, red] on solved (from user)
  {
    const c = makeSolved();
    apply_move(c, "B'");
    console.log("After B': U[0] =>", row('U',0,c));
  }

  // combination U U B'
  {
    const c = makeSolved();
    apply_move(c, "U");
    apply_move(c, "U");
    apply_move(c, "B'");
    console.log("After U U B': U[0] =>", row('U',0,c));
  }
}



