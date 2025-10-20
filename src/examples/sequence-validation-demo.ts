// Demo implementation for sequence validation functionality
// Interactive drill simulation with scramble string input and user sequence validation

import { SequenceValidator } from '../services/sequence-validator.js';
import { generate_scramble_sequence } from '../services/cube-scrambler.js';

export class SequenceValidationDemo {
  private validator: SequenceValidator;

  constructor() {
    this.validator = new SequenceValidator();
  }

  /**
   * Run an interactive drill session
   */
  public async runInteractiveDemo(): Promise<void> {
    console.log('🎯 === EDGE TRACING DRILL DEMO ===');
    console.log('This demo simulates an edge tracing drill session.');
    console.log('You will be given a scrambled cube and asked to provide your traced sequence.');
    console.log('The system will validate your sequence and provide feedback.\n');

    // Generate a random scramble
    const scrambleString = generate_scramble_sequence(20);
    console.log(`📝 Scramble: ${scrambleString}\n`);

    // Get expected sequence
    console.log('🔍 Analyzing cube to get expected sequence...');
    const expectedResult = this.validator.scrambleAndValidate(scrambleString, '');
    const expectedSequence = expectedResult.expectedSequence;
    console.log(`✅ Expected sequence: ${expectedSequence}\n`);

    // Simulate user input (in a real app, this would come from user interface)
    console.log('👤 Simulating user input...');
    const userSequence = this.simulateUserInput(expectedSequence);
    console.log(`📝 User sequence: ${userSequence}\n`);

    // Validate the user sequence
    console.log('🔍 Validating user sequence...');
    const validationResult = this.validator.scrambleAndValidate(scrambleString, userSequence);

    // Display results
    this.displayValidationResults(validationResult);

    // Provide detailed analysis
    const analysis = this.validator.analyzeValidationResult(validationResult);
    this.displayDetailedAnalysis(analysis);

    // Show drill performance
    this.displayDrillPerformance(validationResult, expectedSequence);
  }

  /**
   * Run multiple drill scenarios
   */
  public async runMultipleDrills(count: number = 3): Promise<void> {
    console.log(`🎯 === RUNNING ${count} DRILL SCENARIOS ===\n`);

    const results: any[] = [];

    for (let i = 1; i <= count; i++) {
      console.log(`--- Drill ${i}/${count} ---`);
      
      const scrambleString = generate_scramble_sequence(15 + Math.floor(Math.random() * 10));
      console.log(`Scramble: ${scrambleString}`);

      const expectedResult = this.validator.scrambleAndValidate(scrambleString, '');
      const expectedSequence = expectedResult.expectedSequence;
      
      const userSequence = this.simulateUserInput(expectedSequence);
      const validationResult = this.validator.scrambleAndValidate(scrambleString, userSequence);
      
      results.push({
        drill: i,
        scramble: scrambleString,
        expected: expectedSequence,
        user: userSequence,
        score: validationResult.score,
        isValid: validationResult.isValid
      });

      console.log(`Score: ${validationResult.score}% - ${validationResult.isValid ? '✅ Valid' : '❌ Invalid'}\n`);
    }

    // Summary
    this.displayDrillSummary(results);
  }

  /**
   * Test specific scenarios
   */
  public testSpecificScenarios(): void {
    console.log('🧪 === TESTING SPECIFIC SCENARIOS ===\n');

    const scenarios = [
      {
        name: 'Perfect Match',
        scramble: "U R U' R'",
        userSequence: '', // Will be filled with expected
        description: 'User provides perfect sequence'
      },
      {
        name: 'Partial Match',
        scramble: "U R U' R'",
        userSequence: '', // Will be filled with partial
        description: 'User provides partial sequence'
      },
      {
        name: 'Wrong Sequence',
        scramble: "U R U' R'",
        userSequence: 'a b c d e f',
        description: 'User provides completely wrong sequence'
      },
      {
        name: 'Empty Sequence',
        scramble: "U R U' R'",
        userSequence: '',
        description: 'User provides empty sequence'
      }
    ];

    scenarios.forEach((scenario, index) => {
      console.log(`--- Scenario ${index + 1}: ${scenario.name} ---`);
      console.log(`Description: ${scenario.description}`);
      console.log(`Scramble: ${scenario.scramble}`);

      // Get expected sequence
      const expectedResult = this.validator.scrambleAndValidate(scenario.scramble, '');
      const expectedSequence = expectedResult.expectedSequence;

      // Set user sequence based on scenario
      let userSequence = scenario.userSequence;
      if (scenario.name === 'Perfect Match') {
        userSequence = expectedSequence;
      } else if (scenario.name === 'Partial Match' && expectedSequence.length > 2) {
        userSequence = expectedSequence.split(' ').slice(0, Math.ceil(expectedSequence.split(' ').length / 2)).join(' ');
      }

      console.log(`Expected: ${expectedSequence}`);
      console.log(`User: ${userSequence}`);

      const result = this.validator.scrambleAndValidate(scenario.scramble, userSequence);
      console.log(`Score: ${result.score}% - ${result.isValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (result.errors.length > 0) {
        console.log(`Errors: ${result.errors.join(', ')}`);
      }
      
      console.log('');
    });
  }

  /**
   * Simulate user input with varying accuracy
   */
  private simulateUserInput(expectedSequence: string): string {
    if (!expectedSequence) return '';

    const letters = expectedSequence.split(' ');
    const accuracy = 0.7 + Math.random() * 0.3; // 70-100% accuracy
    
    const userLetters: string[] = [];
    
    for (let i = 0; i < letters.length; i++) {
      if (Math.random() < accuracy) {
        // Correct letter
        userLetters.push(letters[i]);
      } else {
        // Wrong letter or missing
        if (Math.random() < 0.5) {
          // Wrong letter
          const wrongLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                               'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
          const randomLetter = wrongLetters[Math.floor(Math.random() * wrongLetters.length)];
          userLetters.push(randomLetter);
        }
        // If not wrong letter, skip (missing letter)
      }
    }

    return userLetters.join(' ');
  }

  /**
   * Display validation results
   */
  private displayValidationResults(result: any): void {
    console.log('📊 === VALIDATION RESULTS ===');
    console.log(`Score: ${result.score}%`);
    console.log(`Valid: ${result.isValid ? '✅ Yes' : '❌ No'}`);
    console.log(`Expected: ${result.expectedSequence}`);
    console.log(`User: ${result.userSequence}`);
    console.log(`Edges in position: ${result.edgesInPosition.length}/24`);
    console.log(`Flipped edges: ${result.flippedEdges.length}`);
    
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.join(', ')}`);
    }
    console.log('');
  }

  /**
   * Display detailed analysis
   */
  private displayDetailedAnalysis(analysis: any): void {
    console.log('📈 === DETAILED ANALYSIS ===');
    console.log(`Summary: ${analysis.summary}\n`);
    
    console.log('Details:');
    analysis.details.forEach((detail: string, index: number) => {
      console.log(`  ${index + 1}. ${detail}`);
    });
    console.log('');

    if (analysis.suggestions.length > 0) {
      console.log('Suggestions:');
      analysis.suggestions.forEach((suggestion: string, index: number) => {
        console.log(`  ${index + 1}. ${suggestion}`);
      });
      console.log('');
    }
  }

  /**
   * Display drill performance
   */
  private displayDrillPerformance(result: any, expectedSequence: string): void {
    console.log('🎯 === DRILL PERFORMANCE ===');
    
    const expectedLength = expectedSequence.split(' ').length;
    const userLength = result.userSequence.split(' ').length;
    
    console.log(`Sequence length: Expected ${expectedLength}, User ${userLength}`);
    console.log(`Accuracy: ${result.score}%`);
    
    if (result.score >= 90) {
      console.log('🏆 Excellent performance! You\'re ready for more challenging scrambles.');
    } else if (result.score >= 70) {
      console.log('👍 Good job! Keep practicing to improve your accuracy.');
    } else if (result.score >= 50) {
      console.log('📚 Needs more practice. Focus on the fundamentals.');
    } else {
      console.log('🔄 Significant improvement needed. Consider reviewing the basics.');
    }
    
    console.log('');
  }

  /**
   * Display summary of multiple drills
   */
  private displayDrillSummary(results: any[]): void {
    console.log('📊 === DRILL SUMMARY ===');
    
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
    const validCount = results.filter(result => result.isValid).length;
    const perfectCount = results.filter(result => result.score === 100).length;
    
    console.log(`Total drills: ${results.length}`);
    console.log(`Average score: ${averageScore.toFixed(1)}%`);
    console.log(`Valid sequences: ${validCount}/${results.length} (${(validCount/results.length*100).toFixed(1)}%)`);
    console.log(`Perfect scores: ${perfectCount}/${results.length} (${(perfectCount/results.length*100).toFixed(1)}%)`);
    
    console.log('\nIndividual results:');
    results.forEach(result => {
      console.log(`  Drill ${result.drill}: ${result.score}% - ${result.isValid ? '✅' : '❌'}`);
    });
    
    console.log('');
    
    if (averageScore >= 80) {
      console.log('🏆 Outstanding overall performance!');
    } else if (averageScore >= 60) {
      console.log('👍 Good overall performance!');
    } else {
      console.log('📚 Keep practicing to improve your overall performance.');
    }
  }
}

// Demo runner function
export async function runSequenceValidationDemo(): Promise<void> {
  const demo = new SequenceValidationDemo();
  
  console.log('🚀 Starting Sequence Validation Demo...\n');
  
  try {
    // Run interactive demo
    await demo.runInteractiveDemo();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Run multiple drills
    await demo.runMultipleDrills(3);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test specific scenarios
    demo.testSpecificScenarios();
    
    console.log('✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run demo if this file is executed directly
// Note: This check is simplified for browser/Node.js compatibility
if (typeof window === 'undefined') {
  // Node.js environment
  runSequenceValidationDemo();
}
