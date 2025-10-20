// Analyze corner piece relationships
const CORNER_PIECES = {
  'A': ['white', 'orange', 'blue'], 'B': ['white', 'blue', 'red'], 'C': ['white', 'red', 'green'], 'D': ['white', 'green', 'orange'],
  'E': ['orange', 'blue', 'white'], 'F': ['orange', 'white', 'green'], 'G': ['orange', 'green', 'yellow'], 'H': ['orange', 'yellow', 'blue'],
  'I': ['green', 'orange', 'white'], 'J': ['green', 'white', 'red'], 'K': ['green', 'red', 'yellow'], 'L': ['green', 'yellow', 'orange'],
  'M': ['red', 'green', 'white'], 'N': ['red', 'white', 'blue'], 'O': ['red', 'blue', 'yellow'], 'P': ['red', 'yellow', 'green'],
  'Q': ['blue', 'red', 'white'], 'R': ['blue', 'white', 'orange'], 'S': ['blue', 'orange', 'yellow'], 'T': ['blue', 'yellow', 'red'],
  'U': ['yellow', 'orange', 'green'], 'V': ['yellow', 'green', 'red'], 'W': ['yellow', 'red', 'blue'], 'X': ['yellow', 'blue', 'orange']
};

function areColorsEqual(colors1, colors2) {
  const sorted1 = [...colors1].sort();
  const sorted2 = [...colors2].sort();
  return sorted1[0] === sorted2[0] && sorted1[1] === sorted2[1] && sorted1[2] === sorted2[2];
}

// Find relationships
const relationships = {};
for (const [notation, colors] of Object.entries(CORNER_PIECES)) {
  const related = [];
  for (const [otherNotation, otherColors] of Object.entries(CORNER_PIECES)) {
    if (notation !== otherNotation && areColorsEqual(colors, otherColors)) {
      related.push(otherNotation);
    }
  }
  relationships[notation] = related;
}

console.log('Corner piece relationships:');
for (const [notation, related] of Object.entries(relationships)) {
  console.log(`${notation}: [${related.join(', ')}] (${related.length} related)`);
}

// Find the specific relationships for A
console.log('\nFor corner A:');
console.log('A colors:', CORNER_PIECES['A']);
for (const [notation, colors] of Object.entries(CORNER_PIECES)) {
  if (notation !== 'A' && areColorsEqual(CORNER_PIECES['A'], colors)) {
    console.log(`${notation}: [${colors.join(', ')}]`);
  }
}
