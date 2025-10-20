// Comprehensive test suite for sequence validation functionality

import { 
  SequenceValidator, 
  validateDrillSequence, 
  scrambleAndValidate,
  calculateSequenceScore 
} from '../services/sequence-validator.js';
import { SequenceValidationInput } from '../models/sequence-validation.js';
import { scramble_cube } from '../services/cube-scrambler.js';

// Simple test runner for sequence validator
function runSequenceValidatorTests() {
  console.log('=== Sequence Validator Test Suite ===\n');
  
  const validator = new SequenceValidator();
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