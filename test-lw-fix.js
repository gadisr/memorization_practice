import { scramble_cube } from './src/services/cube-scrambler.js';

console.log('--- Testing Lw moves ---');
const result = scramble_cube('Lw');
console.log('U face center:', result.faces.U.center);
console.log('D face center:', result.faces.D.center);
console.log('F face center:', result.faces.F.center);
console.log('B face center:', result.faces.B.center);
console.log('L face center:', result.faces.L.center);
console.log('R face center:', result.faces.R.center);

console.log('\n--- Testing Lw\' moves ---');
const result2 = scramble_cube('Lw\'');
console.log('U face center:', result2.faces.U.center);
console.log('D face center:', result2.faces.D.center);
console.log('F face center:', result2.faces.F.center);
console.log('B face center:', result2.faces.B.center);
console.log('L face center:', result2.faces.L.center);
console.log('R face center:', result2.faces.R.center);
