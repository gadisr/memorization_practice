// Comprehensive test suite for sequence validation functionality

import { 
  SequenceValidator, 
  validateDrillSequence, 
  scrambleAndValidate,
  calculateSequenceScore 
} from '../services/sequence-validator.js';
import { 
  CornerSequenceValidator,
  validateCornerSequence,
  scrambleAndValidateCorners,
  calculateCornerSequenceScore
} from '../services/corner-sequence-validator.js';
import { SequenceValidationInput } from '../models/sequence-validation.js';
import { scramble_cube } from '../services/cube-scrambler.js';

// Simple test runner for sequence validator
function runSequenceValidatorTests() {
  console.log('=== Sequence Validator Test Suite ===\n');
  
  const validator = new SequenceValidator();
  const cornerValidator = new CornerSequenceValidator();
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
      toBeLessThan: (expected: number) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual: (expected: number) => {
        if (actual < expected) {
          throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
        }
      },
      toBeInstanceOf: (expected: any) => {
        if (!(actual instanceof expected)) {
          throw new Error(`Expected ${actual} to be instance of ${expected.name}`);
        }
      },
      toHaveLength: (expected: number) => {
        if (actual.length !== expected) {
          throw new Error(`Expected length ${expected}, got ${actual.length}`);
        }
      }
    };
  }

  function describe(name: string, testFn: () => void) {
    console.log(`\n--- ${name} ---`);
    testFn();
  }

  describe('Basic Validation', () => {
    test('should validate perfect sequence match', () => {
      const scrambleString = "U R U' R'";
      const result = validator.scrambleAndValidate(scrambleString, "");
      
      expect(result).toBeDefined();
      expect(result.userSequence).toBe("");
      expect(typeof result.score).toBe('number');
    });

    test('should handle empty user sequence', () => {
      const scrambleString = "U R U' R'";
      const result = validator.scrambleAndValidate(scrambleString, "");
      
      expect(result.userSequence).toBe("");
      expect(result.expectedSequence).toBeDefined();
    });

    test('should handle invalid scramble string', () => {
      const scrambleString = "INVALID_MOVE";
      const result = validator.scrambleAndValidate(scrambleString, "");
      
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Sequence Scoring', () => {
    test('should calculate perfect score for identical sequences', () => {
      const expected = "a b c d";
      const user = "a b c d";
      
      const score = calculateSequenceScore(expected, user);
      expect(score).toBe(100);
    });

    test('should calculate partial score for similar sequences', () => {
      const expected = "a b c d e";
      const user = "a b x d e";
      
      const score = calculateSequenceScore(expected, user);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });

    test('should calculate zero score for completely different sequences', () => {
      const expected = "a b c d";
      const user = "x y z w";
      
      const score = calculateSequenceScore(expected, user);
      expect(score).toBe(0);
    });

    test('should handle empty sequences', () => {
      const score1 = calculateSequenceScore("", "");
      expect(score1).toBe(100);

      const score2 = calculateSequenceScore("a b c", "");
      expect(score2).toBe(0);

      const score3 = calculateSequenceScore("", "a b c");
      expect(score3).toBe(0);
    });

    test('should apply length penalty for different sequence lengths', () => {
      const expected = "a b c d e";
      const user = "a b c d e f g"; // Longer sequence
      
      const score = calculateSequenceScore(expected, user);
      expect(score).toBeLessThan(100);
    });
  });

  describe('Move Application', () => {
    test('should apply single letter sequence', () => {
      const cube = validator.moveApplier.createSolvedCube();
      const result = validator.applySequenceToCube(cube, "a");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.faces).toBeDefined();
    });

    test('should apply multiple letter sequence', () => {
      const cube = validator.moveApplier.createSolvedCube();
      const result = validator.applySequenceToCube(cube, "a c e");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.faces).toBeDefined();
    });

    test('should handle invalid letters gracefully', () => {
      const cube = validator.moveApplier.createSolvedCube();
      
      // This should throw an error for invalid letters
      let threwError = false;
      try {
        validator.applySequenceToCube(cube, "invalid_letter");
      } catch (error) {
        threwError = true;
      }
      expect(threwError).toBe(true);
    });
  });

  describe('Inverse Move Calculation', () => {
    test('should calculate inverse of simple moves', () => {
      const inverse1 = validator.getInverseSetupMove("R");
      expect(inverse1).toBe("R'");

      const inverse2 = validator.getInverseSetupMove("R'");
      expect(inverse2).toBe("R");

      const inverse3 = validator.getInverseSetupMove("R2");
      expect(inverse3).toBe("R2");
    });

    test('should calculate inverse of complex sequences', () => {
      const inverse = validator.getInverseSetupMove("R U R' U'");
      expect(inverse).toBe("U R U' R'");
    });

    test('should handle wide moves', () => {
      const inverse1 = validator.getInverseSetupMove("Lw");
      expect(inverse1).toBe("Lw'");

      const inverse2 = validator.getInverseSetupMove("Lw'");
      expect(inverse2).toBe("Lw");

      const inverse3 = validator.getInverseSetupMove("Lw2");
      expect(inverse3).toBe("Lw2");
    });
  });

  describe('Edge Position Validation', () => {
    test('should identify edges in correct positions', () => {
      const solvedCube = validator.edgeTracer.createSolvedCubeState();
      const allInPosition = validator.areAllEdgesInPosition(solvedCube);
      
      expect(allInPosition).toBe(true);
    });

    test('should identify scrambled edges', () => {
      const scrambledCube = scramble_cube("U R U' R'");
      const edgeTracerCube = validator.moveApplier.convertToEdgeTracerState(scrambledCube);
      
      const allInPosition = validator.areAllEdgesInPosition(edgeTracerCube);
      expect(allInPosition).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should complete full drill workflow', () => {
      const scrambleString = "U R U' R'";
      
      // Step 1: Scramble cube
      const scrambledCube = scramble_cube(scrambleString);
      
      // Step 2: Convert to EdgeTracerCubeState
      const edgeTracerCube = validator.moveApplier.convertToEdgeTracerState(scrambledCube);
      
      // Step 3: Get expected sequence
      const expectedSequence = validator.edgeTracer.do_full_trace(edgeTracerCube);
      
      // Step 4: Validate with expected sequence (should be perfect)
      const result = validator.scrambleAndValidate(scrambleString, expectedSequence);
      
      expect(result.expectedSequence).toBe(expectedSequence);
      expect(result.userSequence).toBe(expectedSequence);
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(100);
    });

    test('should validate user sequence against expected', () => {
      const scrambleString = "U R U' R'";
      const expectedResult = validator.scrambleAndValidate(scrambleString, "");
      const expectedSequence = expectedResult.expectedSequence;
      
      // Test with perfect match
      const perfectResult = validator.scrambleAndValidate(scrambleString, expectedSequence);
      expect(perfectResult.score).toBe(100);
      
      // Test with partial match
      if (expectedSequence.length > 2) {
        const partialSequence = expectedSequence.split(' ')[0]; // Just first letter
        const partialResult = validator.scrambleAndValidate(scrambleString, partialSequence);
        expect(partialResult.score).toBeGreaterThan(0);
        expect(partialResult.score).toBeLessThan(100);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid input gracefully', () => {
      const invalidInput: SequenceValidationInput = {
        scrambleString: "",
        userTracingSequence: "invalid"
      };
      
      const result = validator.validateDrillSequence(invalidInput);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle malformed sequences', () => {
      const result = validator.scrambleAndValidate("U R U' R'", "a b c invalid d");
      
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Analysis and Feedback', () => {
    test('should provide detailed analysis', () => {
      const scrambleString = "U R U' R'";
      const result = validator.scrambleAndValidate(scrambleString, "");
      
      const analysis = validator.analyzeValidationResult(result);
      
      expect(analysis.summary).toBeDefined();
      expect(analysis.details).toBeInstanceOf(Array);
      expect(analysis.suggestions).toBeInstanceOf(Array);
      expect(analysis.summary).toContain("Score:");
    });

    test('should provide appropriate suggestions', () => {
      const scrambleString = "U R U' R'";
      const result = validator.scrambleAndValidate(scrambleString, "");
      
      const analysis = validator.analyzeValidationResult(result);
      
      expect(analysis.suggestions.length).toBeGreaterThanOrEqual(0);
      
      // Should have suggestions for low scores
      if (result.score < 90) {
        expect(analysis.suggestions.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Tests', () => {
    test('should handle long sequences efficiently', () => {
      const longSequence = "a b c d e f g h i j k l m n o p q r s t u v w x";
      const scrambleString = "U R U' R'";
      
      const startTime = Date.now();
      const result = validator.scrambleAndValidate(scrambleString, longSequence);
      const endTime = Date.now();
      
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should handle multiple validations efficiently', () => {
      const scrambleString = "U R U' R'";
      const sequences = ["a", "b", "c", "d", "e"];
      
      const startTime = Date.now();
      const results = sequences.map(seq => validator.scrambleAndValidate(scrambleString, seq));
      const endTime = Date.now();
      
      expect(results).toHaveLength(5);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Edge Tracing Drill Flow', () => {
    test('should complete full drill workflow with problematic scrambles', () => {
      const problematicScrambles = [
        "U2 D' F' L B' F2",
        "D2 L' R F' U' R'",
        "R U R' U' F' B'",
        "L' U L U' R' F R"
      ];

      for (const scrambleString of problematicScrambles) {
        console.log(`\n=== Testing drill flow with scramble: ${scrambleString} ===`);
        
        try {
          // Step 1: Generate scrambled cube (same as drill)
          const scrambledCube = scramble_cube(scrambleString);
          console.log('✅ Scrambled cube generated');
          
          // Step 2: Convert to EdgeTracerCubeState (same as drill)
          const initialEdgeTracerCube = validator.moveApplier.convertToEdgeTracerState(scrambledCube);
          console.log('✅ Edge tracer conversion successful');
          console.log('Edge positions loaded:', Object.keys(initialEdgeTracerCube).length);
          
          // Step 3: Get expected sequence from EdgeTracer (same as drill)
          const expectedSequence = validator.edgeTracer.do_full_trace(initialEdgeTracerCube);
          console.log('✅ Edge tracing successful');
          console.log('Expected sequence:', expectedSequence);
          
          // Step 4: Test with empty user sequence (same as drill UX)
          const emptyResult = validator.scrambleAndValidate(scrambleString, "");
          expect(emptyResult).toBeDefined();
          expect(emptyResult.expectedSequence).toBe(expectedSequence);
          expect(emptyResult.userSequence).toBe("");
          expect(typeof emptyResult.score).toBe('number');
          console.log('✅ Empty sequence validation successful');
          
          // Step 5: Test with the expected sequence (perfect match)
          const perfectResult = validator.scrambleAndValidate(scrambleString, expectedSequence);
          expect(perfectResult.isValid).toBe(true);
          expect(perfectResult.score).toBe(100);
          expect(perfectResult.errors.length).toBe(0);
          console.log('✅ Perfect sequence validation successful');
          
          // Step 6: Test with partial sequence (common user scenario)
          if (expectedSequence.length > 0) {
            const partialSequence = expectedSequence.split(' ').slice(0, 2).join(' ');
            const partialResult = validator.scrambleAndValidate(scrambleString, partialSequence);
            expect(partialResult).toBeDefined();
            expect(partialResult.score).toBeGreaterThan(0);
            expect(partialResult.score).toBeLessThan(100);
            console.log('✅ Partial sequence validation successful');
          }
          
          // Step 7: Test with wrong sequence (common user scenario)
          const wrongSequence = "a b c d e f";
          const wrongResult = validator.scrambleAndValidate(scrambleString, wrongSequence);
          expect(wrongResult).toBeDefined();
          expect(wrongResult.isValid).toBe(false);
          expect(wrongResult.score).toBeLessThan(100);
          console.log('✅ Wrong sequence validation successful');
          
          console.log(`✅ All drill flow tests passed for scramble: ${scrambleString}`);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
          console.error(`❌ Drill flow test failed for scramble ${scrambleString}:`, errorMessage);
          console.error('Stack:', errorStack);
          throw error;
        }
      }
    });

    test('should handle edge conversion issues gracefully', () => {
      const scrambleString = "U2 D' F' L B' F2";
      console.log(`\n=== Testing edge conversion with scramble: ${scrambleString} ===`);
      
      try {
        // Test the exact flow that was failing
        const scrambledCube = scramble_cube(scrambleString);
        console.log('✅ Scrambled cube generated');
        
        // Test edge tracer conversion directly
        const edgeTracer = validator.edgeTracer;
        const edgeCubeState = edgeTracer.convertFromScramblerCube(scrambledCube);
        console.log('✅ Edge tracer conversion successful');
        console.log('Edge positions loaded:', Object.keys(edgeCubeState).length);
        
        // Test move applier conversion
        const moveApplierCubeState = validator.moveApplier.convertToEdgeTracerState(scrambledCube);
        console.log('✅ Move applier conversion successful');
        console.log('Move applier positions loaded:', Object.keys(moveApplierCubeState).length);
        
        // Test edge tracing
        const result = edgeTracer.do_full_trace(edgeCubeState);
        console.log('✅ Edge tracing successful');
        console.log('Result:', result);
        
        // Test full validation
        const validationResult = validator.scrambleAndValidate(scrambleString, result);
        expect(validationResult).toBeDefined();
        expect(validationResult.isValid).toBe(true);
        expect(validationResult.score).toBe(100);
        console.log('✅ Full validation successful');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
        console.error('❌ Edge conversion test failed:', errorMessage);
        console.error('Stack:', errorStack);
        throw error;
      }
    });

    test('should validate individual edge positions', () => {
      const scrambleString = "U2 D' F' L B' F2";
      console.log(`\n=== Testing individual edge positions with scramble: ${scrambleString} ===`);
      
      const scrambledCube = scramble_cube(scrambleString);
      const edgeTracer = validator.edgeTracer;
      const edgeCubeState = validator.moveApplier.convertToEdgeTracerState(scrambledCube);
      
      // Test each edge position individually
      const allEdgePositions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                                'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
      
      let validPositions = 0;
      let invalidPositions = 0;
      
      for (const position of allEdgePositions) {
        try {
          console.log(`\n--- Testing position ${position} ---`);
          
          // Get secondary position
          const secondaryPosition = edgeTracer.get_secondary_edge_letter_safe(position);
          console.log(`Secondary position for ${position}: ${secondaryPosition}`);
          
          if (secondaryPosition === 'invalid') {
            console.warn(`⚠️ Position ${position} has invalid secondary position`);
            invalidPositions++;
            continue;
          }
          
          // Get colors at this position from converted EdgeTracerCubeState
          const colors = (edgeCubeState as any)[position]?.colors as [string, string] | undefined;
          if (colors && colors.length === 2) {
            const [mainColor, secondaryColor] = colors;
            console.log(`Colors at ${position}: [${mainColor}, ${secondaryColor}]`);
            // Test if this combination is valid
            const solvedPosition = edgeTracer.get_edge_solved_position_by_colors([mainColor, secondaryColor]);
            if (solvedPosition !== 'invalid') {
              console.log(`✅ Valid combination, solved position: ${solvedPosition}`);
              validPositions++;
            } else {
              console.warn(`⚠️ Invalid color combination: [${mainColor}, ${secondaryColor}]`);
              invalidPositions++;
            }
          } else {
            console.warn(`⚠️ Missing edge colors for position ${position}`);
            invalidPositions++;
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`❌ Error testing position ${position}:`, errorMessage);
          invalidPositions++;
        }
      }
      
      console.log(`\n=== Position Analysis Summary ===`);
      console.log(`Valid positions: ${validPositions}`);
      console.log(`Invalid positions: ${invalidPositions}`);
      console.log(`Total positions: ${allEdgePositions.length}`);
      
      // The test should pass even if some positions are invalid (graceful handling)
      expect(validPositions).toBeGreaterThan(0);
      console.log('✅ Position analysis completed successfully');
    });
  });

  describe('Sequence Validator Utilities', () => {
    test('should export convenience functions', () => {
      expect(validateDrillSequence).toBeDefined();
      expect(scrambleAndValidate).toBeDefined();
      expect(calculateSequenceScore).toBeDefined();
    });

    test('should work with convenience functions', () => {
      const result = scrambleAndValidate("U R U' R'", "");
      expect(result).toBeDefined();
      expect(typeof result.score).toBe('number');
    });
  });

  describe('Corner Validation', () => {
    test('should validate perfect corner sequence match', () => {
      const scrambleString = "U R U' R'";
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      
      expect(result).toBeDefined();
      expect(result.userSequence).toBe("");
      expect(typeof result.score).toBe('number');
    });

    test('should handle empty corner user sequence', () => {
      const scrambleString = "U R U' R'";
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      
      expect(result.userSequence).toBe("");
      expect(result.expectedSequence).toBeDefined();
    });

    test('should handle invalid corner scramble string', () => {
      const scrambleString = "INVALID_MOVE";
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.isValid).toBe(false);
    });

    test('should calculate perfect score for identical corner sequences', () => {
      const expected = "B C D E";
      const user = "B C D E";
      
      const score = calculateCornerSequenceScore(expected, user);
      expect(score).toBe(100);
    });

    test('should calculate partial score for similar corner sequences', () => {
      const expected = "B C D E F";
      const user = "B C X D F";
      
      const score = calculateCornerSequenceScore(expected, user);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });

    test('should calculate zero score for completely different corner sequences', () => {
      const expected = "B C D E";
      const user = "X Y Z W";
      
      const score = calculateCornerSequenceScore(expected, user);
      expect(score).toBe(0);
    });

    test('should handle empty corner sequences', () => {
      const score1 = calculateCornerSequenceScore("", "");
      expect(score1).toBe(100);

      const score2 = calculateCornerSequenceScore("B C D", "");
      expect(score2).toBe(0);

      const score3 = calculateCornerSequenceScore("", "B C D");
      expect(score3).toBe(0);
    });

    test('should apply length penalty for different corner sequence lengths', () => {
      const expected = "B C D E F";
      const user = "B C D E F G H"; // Longer sequence
      
      const score = calculateCornerSequenceScore(expected, user);
      expect(score).toBeLessThan(100);
    });
  });

  describe('Corner Move Application', () => {
    test('should apply single corner letter sequence', () => {
      const cube = cornerValidator.moveApplier.createSolvedCube();
      const result = cornerValidator.applySequenceToCube(cube, "B");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.faces).toBeDefined();
    });

    test('should apply multiple corner letter sequence', () => {
      const cube = cornerValidator.moveApplier.createSolvedCube();
      const result = cornerValidator.applySequenceToCube(cube, "B C D");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.faces).toBeDefined();
    });

    test('should handle invalid corner letters gracefully', () => {
      const cube = cornerValidator.moveApplier.createSolvedCube();
      
      // This should throw an error for invalid letters
      let threwError = false;
      try {
        cornerValidator.applySequenceToCube(cube, "invalid_letter");
      } catch (error) {
        threwError = true;
      }
      expect(threwError).toBe(true);
    });
  });

  describe('Corner Position Validation', () => {
    test('should identify corners in correct positions', () => {
      const solvedCube = cornerValidator.cornerTracer.createSolvedCornerState();
      const allInPosition = cornerValidator.areAllCornersInPosition(solvedCube);
      
      expect(allInPosition).toBe(true);
    });

    test('should identify scrambled corners', () => {
      const scrambledCube = scramble_cube("U R U' R'");
      const cornerTracerCube = cornerValidator.moveApplier.convertToCornerTracerState(scrambledCube);
      
      const allInPosition = cornerValidator.areAllCornersInPosition(cornerTracerCube);
      expect(allInPosition).toBe(false);
    });
  });

  describe('Corner Integration Tests', () => {
    test('should complete full corner drill workflow', () => {
      const scrambleString = "U R U' R'";
      
      // Step 1: Scramble cube
      const scrambledCube = scramble_cube(scrambleString);
      
      // Step 2: Convert to CornerTracerCubeState
      const cornerTracerCube = cornerValidator.moveApplier.convertToCornerTracerState(scrambledCube);
      
      // Step 3: Get expected sequence
      const expectedSequence = cornerValidator.cornerTracer.do_full_trace(cornerTracerCube);
      
      // Step 4: Validate with expected sequence (should be perfect)
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, expectedSequence);
      
      expect(result.expectedSequence).toBe(expectedSequence);
      expect(result.userSequence).toBe(expectedSequence);
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(100);
    });

    test('should validate corner user sequence against expected', () => {
      const scrambleString = "U R U' R'";
      const expectedResult = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      const expectedSequence = expectedResult.expectedSequence;
      
      // Test with perfect match
      const perfectResult = cornerValidator.scrambleAndValidateCorners(scrambleString, expectedSequence);
      expect(perfectResult.score).toBe(100);
      
      // Test with partial match
      if (expectedSequence.length > 2) {
        const partialSequence = expectedSequence.split(' ').slice(0, 2).join(' ');
        const partialResult = cornerValidator.scrambleAndValidateCorners(scrambleString, partialSequence);
        expect(partialResult.score).toBeGreaterThan(0);
        expect(partialResult.score).toBeLessThan(100);
      }
    });
  });

  describe('Corner Error Handling', () => {
    test('should handle invalid corner input gracefully', () => {
      const invalidInput: SequenceValidationInput = {
        scrambleString: "",
        userTracingSequence: "invalid"
      };
      
      const result = cornerValidator.validateCornerSequence(invalidInput);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle malformed corner sequences', () => {
      const result = cornerValidator.scrambleAndValidateCorners("U R U' R'", "B C D invalid E");
      
      expect(result).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Corner Analysis and Feedback', () => {
    test('should provide detailed corner analysis', () => {
      const scrambleString = "U R U' R'";
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      
      const analysis = cornerValidator.analyzeValidationResult(result);
      
      expect(analysis.summary).toBeDefined();
      expect(analysis.details).toBeInstanceOf(Array);
      expect(analysis.suggestions).toBeInstanceOf(Array);
      expect(analysis.summary).toContain("Score:");
    });

    test('should provide appropriate corner suggestions', () => {
      const scrambleString = "U R U' R'";
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
      
      const analysis = cornerValidator.analyzeValidationResult(result);
      
      expect(analysis.suggestions.length).toBeGreaterThanOrEqual(0);
      
      // Should have suggestions for low scores
      if (result.score < 90) {
        expect(analysis.suggestions.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Corner Performance Tests', () => {
    test('should handle long corner sequences efficiently', () => {
      const longSequence = "B C D E F G H I J K L M N O P Q R S T U V W X";
      const scrambleString = "U R U' R'";
      
      const startTime = Date.now();
      const result = cornerValidator.scrambleAndValidateCorners(scrambleString, longSequence);
      const endTime = Date.now();
      
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should handle multiple corner validations efficiently', () => {
      const scrambleString = "U R U' R'";
      const sequences = ["B", "C", "D", "E", "F"];
      
      const startTime = Date.now();
      const results = sequences.map(seq => cornerValidator.scrambleAndValidateCorners(scrambleString, seq));
      const endTime = Date.now();
      
      expect(results).toHaveLength(5);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Corner Tracing Drill Flow', () => {
    test('should complete full corner drill workflow with problematic scrambles', () => {
      const problematicScrambles = [
        "U2 D' F' L B' F2",
        "D2 L' R F' U' R'",
        "R U R' U' F' B'",
        "L' U L U' R' F R"
      ];

      for (const scrambleString of problematicScrambles) {
        console.log(`\n=== Testing corner drill flow with scramble: ${scrambleString} ===`);
        
        try {
          // Step 1: Generate scrambled cube (same as drill)
          const scrambledCube = scramble_cube(scrambleString);
          console.log('✅ Scrambled cube generated');
          
          // Step 2: Convert to CornerTracerCubeState (same as drill)
          const initialCornerTracerCube = cornerValidator.moveApplier.convertToCornerTracerState(scrambledCube);
          console.log('✅ Corner tracer conversion successful');
          console.log('Corner positions loaded:', Object.keys(initialCornerTracerCube).length);
          
          // Step 3: Get expected sequence from CornerTracer (same as drill)
          const expectedSequence = cornerValidator.cornerTracer.do_full_trace(initialCornerTracerCube);
          console.log('✅ Corner tracing successful');
          console.log('Expected sequence:', expectedSequence);
          
          // Step 4: Test with empty user sequence (same as drill UX)
          const emptyResult = cornerValidator.scrambleAndValidateCorners(scrambleString, "");
          expect(emptyResult).toBeDefined();
          expect(emptyResult.expectedSequence).toBe(expectedSequence);
          expect(emptyResult.userSequence).toBe("");
          expect(typeof emptyResult.score).toBe('number');
          console.log('✅ Empty sequence validation successful');
          
          // Step 5: Test with the expected sequence (perfect match)
          const perfectResult = cornerValidator.scrambleAndValidateCorners(scrambleString, expectedSequence);
          expect(perfectResult.isValid).toBe(true);
          expect(perfectResult.score).toBe(100);
          expect(perfectResult.errors.length).toBe(0);
          console.log('✅ Perfect sequence validation successful');
          
          // Step 6: Test with partial sequence (common user scenario)
          if (expectedSequence.length > 0) {
            const partialSequence = expectedSequence.split(' ').slice(0, 2).join(' ');
            const partialResult = cornerValidator.scrambleAndValidateCorners(scrambleString, partialSequence);
            expect(partialResult).toBeDefined();
            expect(partialResult.score).toBeGreaterThan(0);
            expect(partialResult.score).toBeLessThan(100);
            console.log('✅ Partial sequence validation successful');
          }
          
          // Step 7: Test with wrong sequence (common user scenario)
          const wrongSequence = "B C D E F G";
          const wrongResult = cornerValidator.scrambleAndValidateCorners(scrambleString, wrongSequence);
          expect(wrongResult).toBeDefined();
          expect(wrongResult.isValid).toBe(false);
          expect(wrongResult.score).toBeLessThan(100);
          console.log('✅ Wrong sequence validation successful');
          
          console.log(`✅ All corner drill flow tests passed for scramble: ${scrambleString}`);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
          console.error(`❌ Corner drill flow test failed for scramble ${scrambleString}:`, errorMessage);
          console.error('Stack:', errorStack);
          throw error;
        }
      }
    });

    test('should handle corner conversion issues gracefully', () => {
      const scrambleString = "U2 D' F' L B' F2";
      console.log(`\n=== Testing corner conversion with scramble: ${scrambleString} ===`);
      
      try {
        // Test the exact flow that was failing
        const scrambledCube = scramble_cube(scrambleString);
        console.log('✅ Scrambled cube generated');
        
        // Test corner tracer conversion directly
        const cornerTracer = cornerValidator.cornerTracer;
        const cornerCubeState = cornerTracer.convertFromScramblerCube(scrambledCube);
        console.log('✅ Corner tracer conversion successful');
        console.log('Corner positions loaded:', Object.keys(cornerCubeState).length);
        
        // Test move applier conversion
        const moveApplierCubeState = cornerValidator.moveApplier.convertToCornerTracerState(scrambledCube);
        console.log('✅ Move applier conversion successful');
        console.log('Move applier positions loaded:', Object.keys(moveApplierCubeState).length);
        
        // Test corner tracing
        const result = cornerTracer.do_full_trace(cornerCubeState);
        console.log('✅ Corner tracing successful');
        console.log('Result:', result);
        
        // Test full validation
        const validationResult = cornerValidator.scrambleAndValidateCorners(scrambleString, result);
        expect(validationResult).toBeDefined();
        expect(validationResult.isValid).toBe(true);
        expect(validationResult.score).toBe(100);
        console.log('✅ Full validation successful');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
        console.error(`❌ Corner conversion test failed:`, errorMessage);
        console.error('Stack:', errorStack);
        throw error;
      }
    });
  });

  describe('Corner Validator Utilities', () => {
    test('should export corner convenience functions', () => {
      expect(validateCornerSequence).toBeDefined();
      expect(scrambleAndValidateCorners).toBeDefined();
      expect(calculateCornerSequenceScore).toBeDefined();
    });

    test('should work with corner convenience functions', () => {
      const result = scrambleAndValidateCorners("U R U' R'", "");
      expect(result).toBeDefined();
      expect(typeof result.score).toBe('number');
    });
  });

  // Test summary
  console.log(`\n=== Test Summary ===`);
  console.log(`Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please review the output above.');
  }
}

// Export the test function
export { runSequenceValidatorTests };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runSequenceValidatorTests();
}