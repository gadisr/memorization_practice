import { scramble_cube } from './src/services/cube-scrambler.js';
import { EdgeTracer } from './src/services/edge-tracer.js';
import { MoveApplier } from './src/services/move-applier.js';

console.log('=== EDGE CONVERSION DEBUG TEST ===\n');

// Test the problematic scramble
const scramble = "U2 D' F' L B' F2";
console.log(`Testing scramble: ${scramble}`);

try {
  // Step 1: Generate scrambled cube
  const cube = scramble_cube(scramble);
  console.log('✅ Scrambled cube generated successfully');
  
  // Step 2: Create tracers
  const edgeTracer = new EdgeTracer();
  const moveApplier = new MoveApplier();
  
  console.log('\n=== TESTING EDGE TRACER CONVERSION ===');
  try {
    const edgeCubeState = edgeTracer.convertFromScramblerCube(cube);
    console.log('✅ Edge tracer conversion successful');
    console.log('Edge positions loaded:', Object.keys(edgeCubeState).length);
    
    // Show some sample edge positions
    console.log('\nSample edge positions:');
    console.log('a:', edgeCubeState.a);
    console.log('b:', edgeCubeState.b);
    console.log('c:', edgeCubeState.c);
    console.log('d:', edgeCubeState.d);
    console.log('e:', edgeCubeState.e);
    
  } catch (error) {
    console.error('❌ Edge tracer conversion failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n=== TESTING MOVE APPLIER CONVERSION ===');
  try {
    const edgeCubeState = moveApplier.convertToEdgeTracerState(cube);
    console.log('✅ Move applier conversion successful');
    console.log('Edge positions loaded:', Object.keys(edgeCubeState).length);
  } catch (error) {
    console.error('❌ Move applier conversion failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n=== TESTING EDGE TRACING ===');
  try {
    const edgeCubeState = edgeTracer.extractEdgeColorsFromCube(cube);
    console.log('✅ Edge extraction successful');
    
    const result = edgeTracer.do_full_trace(edgeCubeState);
    console.log('✅ Edge tracing successful');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Edge tracing failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n=== TESTING INDIVIDUAL EDGE POSITIONS ===');
  const allEdgePositions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                            'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
  
  let invalidPositions = [];
  
  for (const position of allEdgePositions) {
    try {
      console.log(`\n--- Testing position ${position} ---`);
      
      // Get secondary position
      const secondaryPosition = edgeTracer.get_secondary_edge_letter(position);
      console.log(`Secondary position for ${position}: ${secondaryPosition}`);
      
      if (secondaryPosition === 'invalid') {
        console.error(`❌ Position ${position} has invalid secondary position`);
        invalidPositions.push(position);
        continue;
      }
      
      // Get colors at this position
      const mainPos = edgeTracer.cubePositions.get(position);
      const secondaryPos = edgeTracer.cubePositions.get(secondaryPosition);
      
      if (mainPos && secondaryPos) {
        const mainColor = cube.faces[mainPos.face].colors[mainPos.row][mainPos.col];
        const secondaryColor = cube.faces[secondaryPos.face].colors[secondaryPos.row][secondaryPos.col];
        
        console.log(`Colors at ${position}: [${mainColor}, ${secondaryColor}]`);
        
        // Test if this combination is valid
        try {
          const solvedPosition = edgeTracer.get_edge_solved_position_by_colors([mainColor, secondaryColor]);
          console.log(`✅ Valid combination, solved position: ${solvedPosition}`);
        } catch (error) {
          console.error(`❌ Invalid color combination: [${mainColor}, ${secondaryColor}]`);
          console.error(`Error: ${error.message}`);
          invalidPositions.push(position);
        }
      } else {
        console.error(`❌ Missing position data for ${position} or ${secondaryPosition}`);
        invalidPositions.push(position);
      }
      
    } catch (error) {
      console.error(`❌ Error testing position ${position}:`, error.message);
      invalidPositions.push(position);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Invalid positions found:', invalidPositions);
  console.log('Total invalid positions:', invalidPositions.length);
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack:', error.stack);
}

