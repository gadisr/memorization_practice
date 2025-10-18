// Simple test to verify edge tracer functionality
console.log('=== Simple Edge Tracer Test ===');

// Load the data files
const edgeNotation = require('./src/data/edge-notation.json');
const cubePositions = require('./src/data/cube-positions.json');

console.log('✅ Loaded edge notation:', edgeNotation.length, 'entries');
console.log('✅ Loaded cube positions:', cubePositions.length, 'faces');

// Test correlate map building
console.log('\n--- Testing Correlate Map Building ---');
const correlateMap = new Map();

for (let i = 0; i < edgeNotation.length; i++) {
  const edge1 = edgeNotation[i];
  
  for (let j = i + 1; j < edgeNotation.length; j++) {
    const edge2 = edgeNotation[j];
    
    // Check if colors are inversed
    if (edge1.colors[0] === edge2.colors[1] && edge1.colors[1] === edge2.colors[0]) {
      correlateMap.set(edge1.notation, edge2.notation);
      correlateMap.set(edge2.notation, edge1.notation);
      console.log(`Found correlate: ${edge1.notation} <-> ${edge2.notation}`);
    }
  }
}

console.log('Total correlates found:', correlateMap.size);

// Test specific lookups
console.log('\n--- Testing Specific Lookups ---');
console.log('A ->', correlateMap.get('A'));
console.log('B ->', correlateMap.get('B'));
console.log('a ->', correlateMap.get('a'));
console.log('b ->', correlateMap.get('b'));

// Test edge solved position lookup
console.log('\n--- Testing Edge Solved Position Lookup ---');
function getEdgeSolvedPositionByColors(mainColor, secondaryColor) {
  for (const edge of edgeNotation) {
    if (edge.colors[0] === mainColor && edge.colors[1] === secondaryColor) {
      return edge.notation.toLowerCase();
    }
  }
  throw new Error(`No edge found with colors ${mainColor}, ${secondaryColor}`);
}

try {
  const notation = getEdgeSolvedPositionByColors('white', 'blue');
  console.log('White-blue notation:', notation);
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Test Complete ===');
