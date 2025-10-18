// Simple random function to replace lodash
function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Types for cube representation
export interface CubeFace {
  center: string;
  colors: string[][]; // 3x3 grid of colors
}

export interface CubeState {
  faces: {
    U: CubeFace;
    L: CubeFace;
    F: CubeFace;
    R: CubeFace;
    B: CubeFace;
    D: CubeFace;
  };
}

// EdgePiece interface moved to later in file for edge tracing functionality

export interface CornerPiece {
  position: string;
  colors: [string, string, string];
}

// Move types
type Move = 'U' | 'R' | 'F' | 'B' | 'D' | 'L';
type MoveVariant = '' | "'" | '2';
type FullMove = `${Move}${MoveVariant}`;

// Color mapping
const COLORS = {
  white: '#FFFFFF',
  yellow: '#FFD700',
  red: '#E53935',
  orange: '#FF6F00',
  green: '#43A047',
  blue: '#1E88E5'
} as const;

// Face to color mapping
const FACE_COLORS = {
  U: 'white',
  D: 'yellow',
  R: 'red',
  L: 'orange',
  F: 'green',
  B: 'blue'
} as const;

// Position to letter mapping for reference
const POSITION_LETTERS = {
  U: [['A', 'a', 'B'], ['d', '*', 'b'], ['D', 'c', 'C']],
  L: [['E', 'e', 'F'], ['h', '*', 'f'], ['H', 'g', 'G']],
  F: [['I', 'i', 'J'], ['l', '*', 'j'], ['L', 'k', 'K']],
  R: [['M', 'm', 'N'], ['o', 'Q', 'n'], ['O', 'p', 'P']],
  B: [['Q', 'q', 'R'], ['s', 'T', 'r'], ['S', 't', 'T']],
  D: [['U', 'u', 'V'], ['w', 'X', 'v'], ['W', 'x', 'X']]
} as const;

// Edge piece definitions (position -> colors)
const EDGE_PIECES: Record<string, [string, string]> = {
  'A': ['white', 'blue'], 'B': ['white', 'red'], 'C': ['white', 'green'], 'D': ['white', 'orange'],
  'E': ['orange', 'white'], 'F': ['orange', 'green'], 'G': ['orange', 'yellow'], 'H': ['orange', 'blue'],
  'I': ['green', 'white'], 'J': ['green', 'red'], 'K': ['green', 'yellow'], 'L': ['green', 'orange'],
  'M': ['red', 'white'], 'N': ['red', 'blue'], 'O': ['red', 'yellow'], 'P': ['red', 'green'],
  'Q': ['blue', 'white'], 'R': ['blue', 'orange'], 'S': ['blue', 'yellow'], 'T': ['blue', 'red'],
  'U': ['yellow', 'green'], 'V': ['yellow', 'red'], 'W': ['yellow', 'blue'], 'X': ['yellow', 'orange']
};

// Corner piece definitions (position -> colors)
const CORNER_PIECES: Record<string, [string, string, string]> = {
  'A': ['white', 'orange', 'blue'], 'B': ['white', 'blue', 'red'], 'C': ['white', 'red', 'green'], 'D': ['white', 'green', 'orange'],
  'E': ['orange', 'blue', 'white'], 'F': ['orange', 'white', 'green'], 'G': ['orange', 'green', 'yellow'], 'H': ['orange', 'yellow', 'blue'],
  'I': ['green', 'orange', 'white'], 'J': ['green', 'white', 'red'], 'K': ['green', 'red', 'yellow'], 'L': ['green', 'yellow', 'orange'],
  'M': ['red', 'green', 'white'], 'N': ['red', 'white', 'blue'], 'O': ['red', 'blue', 'yellow'], 'P': ['red', 'yellow', 'green'],
  'Q': ['blue', 'red', 'white'], 'R': ['blue', 'white', 'orange'], 'S': ['blue', 'orange', 'yellow'], 'T': ['blue', 'yellow', 'red'],
  'U': ['yellow', 'orange', 'green'], 'V': ['yellow', 'green', 'red'], 'W': ['yellow', 'red', 'blue'], 'X': ['yellow', 'blue', 'orange']
};

/**
 * Generate a random scramble sequence
 * @param length Number of moves in the scramble (default: 25)
 * @returns Scramble string with moves separated by spaces
 */
export function generate_scramble_sequence(length: number = 25): string {
  const moves: Move[] = ['U', 'R', 'F', 'B', 'D', 'L'];
  const variants: MoveVariant[] = ['', "'", '2'];
  const scramble: FullMove[] = [];
  
  let lastMove: Move | null = null;
  
  for (let i = 0; i < length; i++) {
    let move: Move;
    let variant: MoveVariant;
    
    do {
      move = random(moves);
      variant = random(variants);
    } while (move === lastMove); // Avoid consecutive same face moves
    
    scramble.push(`${move}${variant}` as FullMove);
    lastMove = move;
  }
  
  return scramble.join(' ');
}

/**
 * Create initial solved cube state
 */
function create_solved_cube(): CubeState {
  return {
    faces: {
      U: { center: 'white', colors: [['white', 'white', 'white'], ['white', 'white', 'white'], ['white', 'white', 'white']] },
      L: { center: 'orange', colors: [['orange', 'orange', 'orange'], ['orange', 'orange', 'orange'], ['orange', 'orange', 'orange']] },
      F: { center: 'green', colors: [['green', 'green', 'green'], ['green', 'green', 'green'], ['green', 'green', 'green']] },
      R: { center: 'red', colors: [['red', 'red', 'red'], ['red', 'red', 'red'], ['red', 'red', 'red']] },
      B: { center: 'blue', colors: [['blue', 'blue', 'blue'], ['blue', 'blue', 'blue'], ['blue', 'blue', 'blue']] },
      D: { center: 'yellow', colors: [['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow'], ['yellow', 'yellow', 'yellow']] }
    }
  };
}

/**
 * Apply a single move to the cube
 */
function apply_move(cube: CubeState, move: FullMove): void {
  const face = move[0] as keyof typeof cube.faces;
  const variant = move.slice(1) as MoveVariant;
  
  // Apply the appropriate move based on variant
  switch (face) {
    case 'U': 
      if (variant === "'") move_U_prime(cube);
      else if (variant === '2') { move_U(cube); move_U(cube); }
      else move_U(cube);
      break;
    case 'R': 
      if (variant === "'") move_R_prime(cube);
      else if (variant === '2') { move_R(cube); move_R(cube); }
      else move_R(cube);
      break;
    case 'F': 
      if (variant === "'") move_F_prime(cube);
      else if (variant === '2') { move_F(cube); move_F(cube); }
      else move_F(cube);
      break;
    case 'B': 
      if (variant === "'") move_B_prime(cube);
      else if (variant === '2') { move_B(cube); move_B(cube); }
      else move_B(cube);
      break;
    case 'D': 
      if (variant === "'") move_D_prime(cube);
      else if (variant === '2') { move_D(cube); move_D(cube); }
      else move_D(cube);
      break;
    case 'L': 
      if (variant === "'") move_L_prime(cube);
      else if (variant === '2') { move_L(cube); move_L(cube); }
      else move_L(cube);
      break;
  }
}

/**
 * Move U (Up face clockwise)
 * Affects: U face and adjacent edge pieces
 */
function move_U(cube: CubeState): void {
  // Rotate U face
  rotate_face_clockwise(cube.faces.U);
  
  // Move edge pieces around U face (top row of adjacent faces)
  // F[0] -> L[0] -> B[0] -> R[0] -> F[0]
  const temp = [...cube.faces.F.colors[0]];
  cube.faces.F.colors[0] = [...cube.faces.R.colors[0]];
  cube.faces.R.colors[0] = [...cube.faces.B.colors[0]];
  cube.faces.B.colors[0] = [...cube.faces.L.colors[0]];
  cube.faces.L.colors[0] = temp;
  
  console.log('🔄 U move completed - F[0]:', cube.faces.F.colors[0], 'R[0]:', cube.faces.R.colors[0], 'B[0]:', cube.faces.B.colors[0], 'L[0]:', cube.faces.L.colors[0]);
}

/**
 * Move R (Right face clockwise)
 * Affects: R face and adjacent edge pieces
 */
function move_R(cube: CubeState): void {
  // Rotate R face
  rotate_face_clockwise(cube.faces.R);
  
  // Move edge pieces around R face (right column of adjacent faces)
  // U[0][2], U[1][2], U[2][2] -> B[2][0], B[1][0], B[0][0] -> D[0][2], D[1][2], D[2][2] -> F[0][2], F[1][2], F[2][2] -> U[0][2], U[1][2], U[2][2]
  const temp = [cube.faces.U.colors[0][2], cube.faces.U.colors[1][2], cube.faces.U.colors[2][2]];
  
  cube.faces.U.colors[0][2] = cube.faces.F.colors[0][2];
  cube.faces.U.colors[1][2] = cube.faces.F.colors[1][2];
  cube.faces.U.colors[2][2] = cube.faces.F.colors[2][2];
  
  cube.faces.F.colors[0][2] = cube.faces.D.colors[0][2];
  cube.faces.F.colors[1][2] = cube.faces.D.colors[1][2];
  cube.faces.F.colors[2][2] = cube.faces.D.colors[2][2];
  
  cube.faces.D.colors[0][2] = cube.faces.B.colors[2][0];
  cube.faces.D.colors[1][2] = cube.faces.B.colors[1][0];
  cube.faces.D.colors[2][2] = cube.faces.B.colors[0][0];
  
  cube.faces.B.colors[0][0] = temp[2];
  cube.faces.B.colors[1][0] = temp[1];
  cube.faces.B.colors[2][0] = temp[0];
  
  console.log('🔄 R move completed - U[0][2],U[1][2],U[2][2]:', [cube.faces.U.colors[0][2], cube.faces.U.colors[1][2], cube.faces.U.colors[2][2]]);
}

/**
 * Move F (Front face clockwise)
 * Affects: F face and adjacent edge pieces
 */
function move_F(cube: CubeState): void {
  // Rotate F face
  rotate_face_clockwise(cube.faces.F);
  
  // Move edge pieces around F face
  // U[2] -> R[0][0], R[1][0], R[2][0] -> D[0] -> L[2][2], L[1][2], L[0][2] -> U[2]
  const temp = [...cube.faces.U.colors[2]];
  
  cube.faces.U.colors[2] = [cube.faces.L.colors[2][2], cube.faces.L.colors[1][2], cube.faces.L.colors[0][2]];
  
  cube.faces.L.colors[2][2] = cube.faces.D.colors[0][2];
  cube.faces.L.colors[1][2] = cube.faces.D.colors[0][1];
  cube.faces.L.colors[0][2] = cube.faces.D.colors[0][0];
  
  cube.faces.D.colors[0] = [cube.faces.R.colors[2][0], cube.faces.R.colors[1][0], cube.faces.R.colors[0][0]];
  
  cube.faces.R.colors[0][0] = temp[0];
  cube.faces.R.colors[1][0] = temp[1];
  cube.faces.R.colors[2][0] = temp[2];
  
  console.log('🔄 F move completed - U[2]:', cube.faces.U.colors[2], 'R[0][0],R[1][0],R[2][0]:', [cube.faces.R.colors[0][0], cube.faces.R.colors[1][0], cube.faces.R.colors[2][0]]);
}

/**
 * Move B (Back face clockwise)
 * Affects: B face and adjacent edge pieces
 */
function move_B(cube: CubeState): void {
  // Rotate B face
  rotate_face_clockwise(cube.faces.B);
  
  // Move edge pieces around B face
  // U[0] -> L[0][0], L[1][0], L[2][0] -> D[2] -> R[2][2], R[1][2], R[0][2] -> U[0]
  const temp = [...cube.faces.U.colors[0]];
  
  cube.faces.U.colors[0] = [cube.faces.R.colors[0][2], cube.faces.R.colors[1][2], cube.faces.R.colors[2][2]];
  
  cube.faces.R.colors[0][2] = cube.faces.D.colors[2][2];
  cube.faces.R.colors[1][2] = cube.faces.D.colors[2][1];
  cube.faces.R.colors[2][2] = cube.faces.D.colors[2][0];
  
  cube.faces.D.colors[2] = [cube.faces.L.colors[0][0], cube.faces.L.colors[1][0], cube.faces.L.colors[2][0]];
  
  cube.faces.L.colors[0][0] = temp[2];
  cube.faces.L.colors[1][0] = temp[1];
  cube.faces.L.colors[2][0] = temp[0];
}

/**
 * Move D (Down face clockwise)
 * Affects: D face and adjacent edge pieces
 */
function move_D(cube: CubeState): void {
  // Rotate D face
  rotate_face_clockwise(cube.faces.D);
  
  // Move edge pieces around D face (bottom row of adjacent faces)
  // F[2] -> R[2] -> B[2] -> L[2] -> F[2]
  const temp = [...cube.faces.F.colors[2]];
  cube.faces.F.colors[2] = [...cube.faces.L.colors[2]];
  cube.faces.L.colors[2] = [...cube.faces.B.colors[2]];
  cube.faces.B.colors[2] = [...cube.faces.R.colors[2]];
  cube.faces.R.colors[2] = temp;
}

/**
 * Move L (Left face clockwise)
 * Affects: L face and adjacent edge pieces
 */
function move_L(cube: CubeState): void {
  // Rotate L face
  rotate_face_clockwise(cube.faces.L);
  
  // Move edge pieces around L face (left column of adjacent faces)
  // U[0][0], U[1][0], U[2][0] -> F[0][0], F[1][0], F[2][0] -> D[0][0], D[1][0], D[2][0] -> B[2][2], B[1][2], B[0][2] -> U[0][0], U[1][0], U[2][0]
  const temp = [cube.faces.U.colors[0][0], cube.faces.U.colors[1][0], cube.faces.U.colors[2][0]];
  
  cube.faces.U.colors[0][0] = cube.faces.B.colors[2][2];
  cube.faces.U.colors[1][0] = cube.faces.B.colors[1][2];
  cube.faces.U.colors[2][0] = cube.faces.B.colors[0][2];
  
  cube.faces.B.colors[0][2] = cube.faces.D.colors[2][0];
  cube.faces.B.colors[1][2] = cube.faces.D.colors[1][0];
  cube.faces.B.colors[2][2] = cube.faces.D.colors[0][0];
  
  cube.faces.D.colors[0][0] = cube.faces.F.colors[0][0];
  cube.faces.D.colors[1][0] = cube.faces.F.colors[1][0];
  cube.faces.D.colors[2][0] = cube.faces.F.colors[2][0];
  
  cube.faces.F.colors[0][0] = temp[0];
  cube.faces.F.colors[1][0] = temp[1];
  cube.faces.F.colors[2][0] = temp[2];
}

/**
 * Move U' (Up face counter-clockwise) - Blue moves to orange
 */
function move_U_prime(cube: CubeState): void {
  // Rotate U face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.U);
  
  // Move edge pieces around U face (top row of adjacent faces) - REVERSED
  // F[0] -> L[0] -> B[0] -> R[0] -> F[0] (blue moves to orange)
  const temp = [...cube.faces.F.colors[0]];
  cube.faces.F.colors[0] = [...cube.faces.L.colors[0]];
  cube.faces.L.colors[0] = [...cube.faces.B.colors[0]];
  cube.faces.B.colors[0] = [...cube.faces.R.colors[0]];
  cube.faces.R.colors[0] = temp;
  
  console.log('🔄 U\' move completed - F[0]:', cube.faces.F.colors[0], 'R[0]:', cube.faces.R.colors[0], 'B[0]:', cube.faces.B.colors[0], 'L[0]:', cube.faces.L.colors[0]);
}

/**
 * Move L' (Left face counter-clockwise) - Green moves to white
 */
function move_L_prime(cube: CubeState): void {
  // Rotate L face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.L);
  
  // Move edge pieces around L face (left column of adjacent faces) - REVERSED
  // F[0][0], F[1][0], F[2][0] -> U[0][0], U[1][0], U[2][0] -> B[2][2], B[1][2], B[0][2] -> D[0][0], D[1][0], D[2][0] -> F[0][0], F[1][0], F[2][0]
  const temp = [cube.faces.F.colors[0][0], cube.faces.F.colors[1][0], cube.faces.F.colors[2][0]];
  
  cube.faces.F.colors[0][0] = cube.faces.D.colors[0][0];
  cube.faces.F.colors[1][0] = cube.faces.D.colors[1][0];
  cube.faces.F.colors[2][0] = cube.faces.D.colors[2][0];
  
  cube.faces.D.colors[0][0] = cube.faces.B.colors[2][2];
  cube.faces.D.colors[1][0] = cube.faces.B.colors[1][2];
  cube.faces.D.colors[2][0] = cube.faces.B.colors[0][2];
  
  cube.faces.B.colors[0][2] = cube.faces.U.colors[2][0];
  cube.faces.B.colors[1][2] = cube.faces.U.colors[1][0];
  cube.faces.B.colors[2][2] = cube.faces.U.colors[0][0];
  
  cube.faces.U.colors[0][0] = temp[0];
  cube.faces.U.colors[1][0] = temp[1];
  cube.faces.U.colors[2][0] = temp[2];
  
  console.log('🔄 L\' move completed - U[0][0],U[1][0],U[2][0]:', [cube.faces.U.colors[0][0], cube.faces.U.colors[1][0], cube.faces.U.colors[2][0]]);
}

/**
 * Move R' (Right face counter-clockwise) - Blue moves to white
 */
function move_R_prime(cube: CubeState): void {
  // Rotate R face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.R);
  
  // Move edge pieces around R face (right column of adjacent faces) - REVERSED
  // U[0][2], U[1][2], U[2][2] -> B[2][0], B[1][0], B[0][0] -> D[0][2], D[1][2], D[2][2] -> F[0][2], F[1][2], F[2][2] -> U[0][2], U[1][2], U[2][2]
  const temp = [cube.faces.U.colors[0][2], cube.faces.U.colors[1][2], cube.faces.U.colors[2][2]];
  
  cube.faces.U.colors[0][2] = cube.faces.B.colors[2][0];
  cube.faces.U.colors[1][2] = cube.faces.B.colors[1][0];
  cube.faces.U.colors[2][2] = cube.faces.B.colors[0][0];
  
  cube.faces.B.colors[0][0] = cube.faces.D.colors[2][2];
  cube.faces.B.colors[1][0] = cube.faces.D.colors[1][2];
  cube.faces.B.colors[2][0] = cube.faces.D.colors[0][2];
  
  cube.faces.D.colors[0][2] = cube.faces.F.colors[0][2];
  cube.faces.D.colors[1][2] = cube.faces.F.colors[1][2];
  cube.faces.D.colors[2][2] = cube.faces.F.colors[2][2];
  
  cube.faces.F.colors[0][2] = temp[0];
  cube.faces.F.colors[1][2] = temp[1];
  cube.faces.F.colors[2][2] = temp[2];
  
  console.log('🔄 R\' move completed - U[0][2],U[1][2],U[2][2]:', [cube.faces.U.colors[0][2], cube.faces.U.colors[1][2], cube.faces.U.colors[2][2]]);
}

/**
 * Move B' (Back face counter-clockwise) - White moves to red
 */
function move_B_prime(cube: CubeState): void {
  // Rotate B face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.B);
  
  // Move edge pieces around B face - REVERSED
  // U[0] -> R[2][2], R[1][2], R[0][2] -> D[2] -> L[2][0], L[1][0], L[0][0] -> U[0]
  const temp = [...cube.faces.U.colors[0]];
  
  cube.faces.U.colors[0] = [cube.faces.L.colors[2][0], cube.faces.L.colors[1][0], cube.faces.L.colors[0][0]];
  
  cube.faces.L.colors[0][0] = cube.faces.D.colors[2][0];
  cube.faces.L.colors[1][0] = cube.faces.D.colors[2][1];
  cube.faces.L.colors[2][0] = cube.faces.D.colors[2][2];
  
  cube.faces.D.colors[2] = [cube.faces.R.colors[2][2], cube.faces.R.colors[1][2], cube.faces.R.colors[0][2]];
  
  cube.faces.R.colors[0][2] = temp[0];
  cube.faces.R.colors[1][2] = temp[1];
  cube.faces.R.colors[2][2] = temp[2];
  
  console.log('🔄 B\' move completed - U[0]:', cube.faces.U.colors[0], 'R[0][2],R[1][2],R[2][2]:', [cube.faces.R.colors[0][2], cube.faces.R.colors[1][2], cube.faces.R.colors[2][2]]);
}

/**
 * Move D' (Down face counter-clockwise) - Red moves to green
 */
function move_D_prime(cube: CubeState): void {
  // Rotate D face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.D);
  
  // Move edge pieces around D face (bottom row of adjacent faces) - REVERSED
  // F[2] -> R[2] -> B[2] -> L[2] -> F[2]
  const temp = [...cube.faces.F.colors[2]];
  cube.faces.F.colors[2] = [...cube.faces.R.colors[2]];
  cube.faces.R.colors[2] = [...cube.faces.B.colors[2]];
  cube.faces.B.colors[2] = [...cube.faces.L.colors[2]];
  cube.faces.L.colors[2] = temp;
}

/**
 * Move F' (Front face counter-clockwise) - White moves to orange
 */
function move_F_prime(cube: CubeState): void {
  // Rotate F face counter-clockwise
  rotate_face_counter_clockwise(cube.faces.F);
  
  // Move edge pieces around F face - REVERSED
  // U[2] -> L[2][2], L[1][2], L[0][2] -> D[0] -> R[0][0], R[1][0], R[2][0] -> U[2]
  const temp = [...cube.faces.U.colors[2]];
  
  cube.faces.U.colors[2] = [cube.faces.R.colors[0][0], cube.faces.R.colors[1][0], cube.faces.R.colors[2][0]];
  
  cube.faces.R.colors[0][0] = cube.faces.D.colors[0][2];
  cube.faces.R.colors[1][0] = cube.faces.D.colors[0][1];
  cube.faces.R.colors[2][0] = cube.faces.D.colors[0][0];
  
  cube.faces.D.colors[0] = [cube.faces.L.colors[0][2], cube.faces.L.colors[1][2], cube.faces.L.colors[2][2]];
  
  cube.faces.L.colors[0][2] = temp[2];
  cube.faces.L.colors[1][2] = temp[1];
  cube.faces.L.colors[2][2] = temp[0];
}

/**
 * Rotate a face clockwise (90 degrees)
 */
function rotate_face_clockwise(face: CubeFace): void {
  const colors = face.colors;
  
  // Transpose and reverse each row (standard 90-degree rotation)
  const rotated = colors[0].map((_, colIndex) =>
    colors.map(row => row[colIndex]).reverse()
  );
  
  face.colors = rotated;
}

/**
 * Rotate a face counter-clockwise (90 degrees)
 */
function rotate_face_counter_clockwise(face: CubeFace): void {
  const colors = face.colors;
  
  // Counter-clockwise 90-degree rotation: transpose then reverse each row
  const rotated = colors.map((_, rowIndex) =>
    colors.map((_, colIndex) => colors[colIndex][2 - rowIndex])
  );
  
  face.colors = rotated;
}

/**
 * Edge piece mapping for tracing
 */
export interface EdgePiece {
  id: string;
  colors: [string, string];
  position: [string, number, number]; // [face, row, col]
  originalPosition: [string, number, number];
}

/**
 * Create edge piece mapping for a solved cube
 */
function create_edge_mapping(): EdgePiece[] {
  const edges: EdgePiece[] = [];
  
  // Edge pieces and their original positions (using lowercase letters as per edge-notation.json)
  const edgePositions = [
    // U face edges
    { id: 'a', colors: ['white', 'blue'], position: ['U', 0, 0] },
    { id: 'b', colors: ['white', 'red'], position: ['U', 0, 2] },
    { id: 'c', colors: ['white', 'green'], position: ['U', 2, 2] },
    { id: 'd', colors: ['white', 'orange'], position: ['U', 2, 0] },
    
    // Middle layer edges (e-l)
    { id: 'e', colors: ['orange', 'white'], position: ['L', 0, 1] },
    { id: 'f', colors: ['orange', 'green'], position: ['L', 1, 2] },
    { id: 'g', colors: ['orange', 'yellow'], position: ['L', 2, 1] },
    { id: 'h', colors: ['orange', 'blue'], position: ['L', 1, 0] },
    { id: 'i', colors: ['green', 'white'], position: ['B', 0, 1] },
    { id: 'j', colors: ['green', 'red'], position: ['B', 1, 2] },
    { id: 'k', colors: ['green', 'yellow'], position: ['B', 2, 1] },
    { id: 'l', colors: ['green', 'orange'], position: ['B', 1, 0] },
    
    // Additional middle layer edges (m-t)
    { id: 'm', colors: ['red', 'white'], position: ['R', 0, 1] },
    { id: 'n', colors: ['red', 'blue'], position: ['R', 1, 0] },
    { id: 'o', colors: ['red', 'yellow'], position: ['R', 2, 1] },
    { id: 'p', colors: ['red', 'green'], position: ['R', 1, 2] },
    { id: 'q', colors: ['blue', 'white'], position: ['F', 0, 1] },
    { id: 'r', colors: ['blue', 'orange'], position: ['F', 1, 0] },
    { id: 's', colors: ['blue', 'yellow'], position: ['F', 2, 1] },
    { id: 't', colors: ['blue', 'red'], position: ['F', 1, 2] },
    
    // D face edges (u-x)
    { id: 'u', colors: ['yellow', 'green'], position: ['D', 2, 2] },
    { id: 'v', colors: ['yellow', 'red'], position: ['D', 0, 2] },
    { id: 'w', colors: ['yellow', 'blue'], position: ['D', 0, 0] },
    { id: 'x', colors: ['yellow', 'orange'], position: ['D', 2, 0] }
  ];
  
  edgePositions.forEach(edge => {
    edges.push({
      id: edge.id,
      colors: edge.colors as [string, string],
      position: edge.position as [string, number, number],
      originalPosition: edge.position as [string, number, number]
    });
  });
  
  return edges;
}

/**
 * Find edge piece by colors at a position
 */
function find_edge_by_colors(cube: CubeState, face: string, row: number, col: number): EdgePiece | null {
  const color1 = cube.faces[face as keyof typeof cube.faces].colors[row][col];
  const color2 = get_adjacent_color(cube, face, row, col);
  
  if (!color2) return null;
  
  // Find matching edge in our mapping
  const edges = create_edge_mapping();
  return edges.find(edge => 
    (edge.colors[0] === color1 && edge.colors[1] === color2) ||
    (edge.colors[0] === color2 && edge.colors[1] === color1)
  ) || null;
}

/**
 * Get adjacent color for edge piece
 */
function get_adjacent_color(cube: CubeState, face: string, row: number, col: number): string | null {
  const faceMap: { [key: string]: string } = {
    'U': 'white', 'L': 'orange', 'F': 'green', 
    'R': 'red', 'B': 'blue', 'D': 'yellow'
  };
  
  // For edge pieces, we need to find the adjacent face color
  if (face === 'U' && row === 0 && col === 0) return cube.faces.L.colors[0][0]; // A
  if (face === 'U' && row === 0 && col === 2) return cube.faces.R.colors[0][2]; // B
  if (face === 'U' && row === 2 && col === 2) return cube.faces.F.colors[0][2]; // C
  if (face === 'U' && row === 2 && col === 0) return cube.faces.L.colors[0][2]; // D
  
  if (face === 'L' && row === 1 && col === 0) return cube.faces.B.colors[1][2]; // E
  if (face === 'L' && row === 1 && col === 2) return cube.faces.F.colors[1][0]; // F
  if (face === 'R' && row === 1 && col === 0) return cube.faces.F.colors[1][2]; // G
  if (face === 'R' && row === 1 && col === 2) return cube.faces.B.colors[1][0]; // H
  
  if (face === 'D' && row === 0 && col === 0) return cube.faces.L.colors[2][0]; // I
  if (face === 'D' && row === 0 && col === 2) return cube.faces.R.colors[2][2]; // J
  if (face === 'D' && row === 2 && col === 2) return cube.faces.F.colors[2][2]; // K
  if (face === 'D' && row === 2 && col === 0) return cube.faces.L.colors[2][2]; // L
  
  return null;
}

/**
 * Apply a scramble sequence to a cube with edge tracing
 * @param scramble Scramble string with moves separated by spaces
 * @returns Scrambled cube state and edge tracing information
 */
export function scramble_cube_with_tracing(scramble: string): { cube: CubeState; edgeTracing: EdgePiece[] } {
  const cube = create_solved_cube();
  const moves = scramble.trim().split(/\s+/);
  const edgeTracing = create_edge_mapping();
  
  console.log('🎲 === CUBE SCRAMBLING WITH EDGE TRACING ===');
  console.log('📝 Scramble sequence:', scramble);
  console.log('🔢 Total moves:', moves.length);
  console.log('');
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move) {
      console.log(`🔄 Move ${i + 1}/${moves.length}: ${move}`);
      apply_move(cube, move as FullMove);
      
      // Update edge positions after each move
      update_edge_positions(cube, edgeTracing);
      
      console.log('📊 Edge tracing after move:');
      edgeTracing.forEach(edge => {
        const [face, row, col] = edge.position;
        const [origFace, origRow, origCol] = edge.originalPosition;
        console.log(`  ${edge.id}: ${edge.colors[0]}-${edge.colors[1]} at ${face}[${row}][${col}] (was at ${origFace}[${origRow}][${origCol}])`);
      });
      console.log('');
    }
  }
  
  console.log('✅ Scrambling with edge tracing completed!');
  return { cube, edgeTracing };
}

/**
 * Update edge positions after a move
 */
function update_edge_positions(cube: CubeState, edges: EdgePiece[]): void {
  // Check all edge positions and update their current locations
  const edgePositions = [
    ['U', 0, 0], ['U', 0, 2], ['U', 2, 2], ['U', 2, 0],
    ['L', 1, 0], ['L', 1, 2], ['R', 1, 0], ['R', 1, 2],
    ['D', 0, 0], ['D', 0, 2], ['D', 2, 2], ['D', 2, 0]
  ];
  
  edgePositions.forEach(([face, row, col]) => {
    const foundEdge = find_edge_by_colors(cube, face as string, row as number, col as number);
    if (foundEdge) {
      // Update the position of this edge
      const edgeIndex = edges.findIndex(e => e.id === foundEdge.id);
      if (edgeIndex !== -1) {
        edges[edgeIndex].position = [face as string, row as number, col as number];
      }
    }
  });
}

/**
 * Apply a scramble sequence to a cube
 * @param scramble Scramble string with moves separated by spaces
 * @returns Scrambled cube state
 */
export function scramble_cube(scramble: string): CubeState {
  const result = scramble_cube_with_tracing(scramble);
  return result.cube;
}

/**
 * Print cube with colors and letter notation positions
 * @param cube Cube state to print
 */
export function print_cube(cube: CubeState): void {
  console.log('=== CUBE STATE ===\n');
  
  // Print each face
  const faceOrder: (keyof typeof cube.faces)[] = ['U', 'L', 'F', 'R', 'B', 'D'];
  const faceNames = { U: 'UP', L: 'LEFT', F: 'FRONT', R: 'RIGHT', B: 'BACK', D: 'DOWN' };
  
  for (const faceKey of faceOrder) {
    const face = cube.faces[faceKey];
    const faceName = faceNames[faceKey];
    const centerColor = face.center;
    
    console.log(`${faceName} (${centerColor.toUpperCase()}):`);
    console.log('┌─────┬─────┬─────┐');
    
    for (let row = 0; row < 3; row++) {
      let line = '│';
      for (let col = 0; col < 3; col++) {
        const color = face.colors[row][col];
        const letter = POSITION_LETTERS[faceKey][row][col];
        const colorCode = get_color_code(color);
        line += ` ${colorCode}${letter}${colorCode} │`;
      }
      console.log(line);
      if (row < 2) console.log('├─────┼─────┼─────┤');
    }
    
    console.log('└─────┴─────┴─────┘\n');
  }
  
  // Print color analysis
  console.log('=== COLOR ANALYSIS ===');
  print_color_analysis(cube);
}

/**
 * Print color analysis showing which colors are in which positions
 */
function print_color_analysis(cube: CubeState): void {
  console.log('Face Colors:');
  for (const [faceKey, face] of Object.entries(cube.faces)) {
    console.log(`${faceKey}: ${face.center} (center)`);
    for (let row = 0; row < 3; row++) {
      const rowColors = face.colors[row].map(color => color.substring(0, 3)).join(' ');
      console.log(`  Row ${row}: ${rowColors}`);
    }
  }
}

/**
 * Get ANSI color code for terminal output
 */
function get_color_code(color: string): string {
  const colorMap: Record<string, string> = {
    white: '\x1b[47m\x1b[30m',   // White background, black text
    yellow: '\x1b[43m\x1b[30m',  // Yellow background, black text
    red: '\x1b[41m\x1b[37m',     // Red background, white text
    orange: '\x1b[45m\x1b[30m',  // Magenta background (closest to orange), black text
    green: '\x1b[42m\x1b[30m',   // Green background, black text
    blue: '\x1b[44m\x1b[37m',    // Blue background, white text
    unknown: '\x1b[40m\x1b[37m'  // Black background, white text
  };
  
  return colorMap[color] || colorMap.unknown;
}


/**
 * Explain how a move affects the cube
 */
export function explain_move(move: FullMove): string {
  const face = move[0];
  const variant = move.slice(1);
  
  let explanation = `Move ${move} (${face} face `;
  
  if (variant === "'") explanation += "counter-clockwise";
  else if (variant === '2') explanation += "180 degrees";
  else explanation += "clockwise";
  
  explanation += "):\n";
  
  switch (face) {
    case 'U':
      explanation += "• Rotates the UP face (white center)\n";
      explanation += "• Moves top row of adjacent faces: F[0] → L[0] → B[0] → R[0] → F[0]\n";
      explanation += "• Colors affected: top edges of front, left, back, right faces (green moves into orange)\n";
      break;
    case 'R':
      explanation += "• Rotates the RIGHT face (red center)\n";
      explanation += "• Moves right column: U[0][2],U[1][2],U[2][2] → F[0][2],F[1][2],F[2][2] → D[0][2],D[1][2],D[2][2] → B[2][0],B[1][0],B[0][0] → U[0][2],U[1][2],U[2][2]\n";
      explanation += "• Colors affected: right edges of up, front, down, back faces (green moves into white)\n";
      break;
    case 'F':
      explanation += "• Rotates the FRONT face (green center)\n";
      explanation += "• Moves front edges: U[2] → R[0][0],R[1][0],R[2][0] → D[0] → L[2][2],L[1][2],L[0][2] → U[2]\n";
      explanation += "• Colors affected: front edges of up, right, down, left faces\n";
      break;
    case 'B':
      explanation += "• Rotates the BACK face (blue center)\n";
      explanation += "• Moves back edges: U[0] → L[0][0],L[1][0],L[2][0] → D[2] → R[2][2],R[1][2],R[0][2] → U[0]\n";
      explanation += "• Colors affected: back edges of up, left, down, right faces\n";
      break;
    case 'D':
      explanation += "• Rotates the DOWN face (yellow center)\n";
      explanation += "• Moves bottom row of adjacent faces: F[2] → R[2] → B[2] → L[2] → F[2]\n";
      explanation += "• Colors affected: bottom edges of front, right, back, left faces (blue moves into orange)\n";
      break;
    case 'L':
      explanation += "• Rotates the LEFT face (orange center)\n";
      explanation += "• Moves left column: U[0][0],U[1][0],U[2][0] → B[2][2],B[1][2],B[0][2] → D[0][0],D[1][0],D[2][0] → F[0][0],F[1][0],F[2][0] → U[0][0],U[1][0],U[2][0]\n";
      explanation += "• Colors affected: left edges of up, back, down, front faces (blue moves into white)\n";
      break;
  }
  
  return explanation;
}

/**
 * Test individual moves to show their effects
 */
export function test_individual_moves(): void {
  console.log('=== TESTING INDIVIDUAL MOVES ===\n');
  
  const moves: FullMove[] = ['U', 'U\'', 'U2', 'R', 'R\'', 'R2', 'F', 'F\'', 'F2', 'B', 'B\'', 'B2', 'D', 'D\'', 'D2', 'L', 'L\'', 'L2'];
  
  for (const move of moves) {
    console.log(explain_move(move));
    
    // Create a fresh cube and apply the move
    const cube = create_solved_cube();
    console.log('BEFORE move:');
    print_cube_state(cube);
    
    apply_move(cube, move);
    
    console.log('AFTER move:');
    print_cube_state(cube);
    
    console.log('\n' + '='.repeat(80) + '\n');
  }
}

/**
 * Print detailed cube state showing all colors
 */
function print_cube_state(cube: CubeState): void {
  const faceOrder: (keyof typeof cube.faces)[] = ['U', 'L', 'F', 'R', 'B', 'D'];
  const faceNames = { U: 'UP', L: 'LEFT', F: 'FRONT', R: 'RIGHT', B: 'BACK', D: 'DOWN' };
  
  for (const faceKey of faceOrder) {
    const face = cube.faces[faceKey];
    const faceName = faceNames[faceKey];
    const centerColor = face.center;
    
    console.log(`${faceName} (${centerColor.toUpperCase()}):`);
    for (let row = 0; row < 3; row++) {
      const rowColors = face.colors[row].map(color => color.substring(0, 3)).join(' ');
      console.log(`  Row ${row}: ${rowColors}`);
    }
    console.log('');
  }
}

/**
 * Test rotation variants to verify they work correctly
 */
export function test_rotation_variants(): void {
  console.log('=== TESTING ROTATION VARIANTS ===\n');
  
  // Test that U U' returns to solved state
  console.log('Testing U U\' (should return to solved):');
  const cube1 = create_solved_cube();
  apply_move(cube1, 'U');
  apply_move(cube1, 'U\'');
  console.log('After U U\':');
  print_cube_state(cube1);
  
  // Test that U2 U2 returns to solved state
  console.log('\nTesting U2 U2 (should return to solved):');
  const cube2 = create_solved_cube();
  apply_move(cube2, 'U2');
  apply_move(cube2, 'U2');
  console.log('After U2 U2:');
  print_cube_state(cube2);
  
  // Test that U U U U returns to solved state
  console.log('\nTesting U U U U (should return to solved):');
  const cube3 = create_solved_cube();
  apply_move(cube3, 'U');
  apply_move(cube3, 'U');
  apply_move(cube3, 'U');
  apply_move(cube3, 'U');
  console.log('After U U U U:');
  print_cube_state(cube3);
  
  console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Test specific moves with detailed logging
 */
export function test_specific_moves(): void {
  console.log('=== TESTING SPECIFIC MOVES WITH DETAILED LOGGING ===\n');
  
  // Test U move
  console.log('🧪 Testing U move:');
  const cube1 = create_solved_cube();
  console.log('Initial state:');
  print_cube_state(cube1);
  apply_move(cube1, 'U');
  console.log('Final state after U:');
  print_cube_state(cube1);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test U' move
  console.log('🧪 Testing U\' move:');
  const cube2 = create_solved_cube();
  console.log('Initial state:');
  print_cube_state(cube2);
  apply_move(cube2, 'U\'');
  console.log('Final state after U\':');
  print_cube_state(cube2);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test L' move
  console.log('🧪 Testing L\' move:');
  const cube3 = create_solved_cube();
  console.log('Initial state:');
  print_cube_state(cube3);
  apply_move(cube3, 'L\'');
  console.log('Final state after L\':');
  print_cube_state(cube3);
  
  console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Get edge piece at a specific position
 */
function get_edge_at_position(cube: CubeState, position: string): { piece: string; colors: [string, string] } | null {
  // Map position letters to cube coordinates and their adjacent faces
  // Based on cube-positions.json layout and actual cube geometry
  // Format: [face, row, col, adjacent_face, adjacent_row, adjacent_col]
  const positionMap: { [key: string]: [string, number, number, string, number, number] } = {
    // U face edges (top face) - these connect to side faces
    'A': ['U', 0, 0, 'L', 0, 2], 'B': ['U', 0, 2, 'R', 0, 0], 'C': ['U', 2, 2, 'F', 0, 0], 'D': ['U', 2, 0, 'L', 0, 0],
    // L face edges (left face) - these connect to adjacent faces
    'E': ['L', 0, 0, 'U', 1, 0], 'F': ['L', 0, 2, 'U', 1, 2], 'G': ['L', 2, 0, 'D', 1, 0], 'H': ['L', 2, 2, 'D', 1, 2],
    // F face edges (front face) - these connect to top/bottom and sides
    'I': ['F', 0, 0, 'U', 2, 0], 'J': ['F', 0, 2, 'U', 2, 2], 'K': ['F', 2, 0, 'D', 0, 0], 'L': ['F', 2, 2, 'D', 0, 2],
    // R face edges (right face) - these connect to adjacent faces
    'M': ['R', 0, 0, 'U', 0, 2], 'N': ['R', 0, 2, 'U', 0, 2], 'O': ['R', 2, 0, 'D', 2, 1], 'P': ['R', 2, 2, 'D', 2, 1],
    // B face edges (back face) - these connect to top/bottom
    'Q': ['B', 0, 0, 'U', 0, 0], 'R': ['B', 0, 2, 'U', 0, 2], 'S': ['B', 2, 0, 'D', 2, 0], 'T': ['B', 2, 2, 'D', 2, 2],
    // D face edges (down face) - these connect to side faces
    'U': ['D', 0, 0, 'F', 2, 0], 'V': ['D', 0, 2, 'F', 2, 2], 'W': ['D', 2, 0, 'B', 2, 0], 'X': ['D', 2, 2, 'B', 2, 2]
  };
  
  const [face, row, col, adjFace, adjRow, adjCol] = positionMap[position];
  if (!face || row === undefined || col === undefined || !adjFace || adjRow === undefined || adjCol === undefined) {
    return null;
  }
  
  const color1 = cube.faces[face as keyof typeof cube.faces].colors[row][col];
  const color2 = cube.faces[adjFace as keyof typeof cube.faces].colors[adjRow][adjCol];
  
  if (!color2) {
    return null;
  }
  
  // Find which edge piece this is based on colors
  const edgeNotation = [
    { colors: ['white', 'blue'], notation: 'A' },
    { colors: ['white', 'red'], notation: 'B' },
    { colors: ['white', 'green'], notation: 'C' },
    { colors: ['white', 'orange'], notation: 'D' },
    { colors: ['orange', 'white'], notation: 'E' },
    { colors: ['orange', 'green'], notation: 'F' },
    { colors: ['orange', 'yellow'], notation: 'G' },
    { colors: ['orange', 'blue'], notation: 'H' },
    { colors: ['green', 'white'], notation: 'I' },
    { colors: ['green', 'red'], notation: 'J' },
    { colors: ['green', 'yellow'], notation: 'K' },
    { colors: ['green', 'orange'], notation: 'L' },
    { colors: ['red', 'white'], notation: 'M' },
    { colors: ['red', 'blue'], notation: 'N' },
    { colors: ['red', 'yellow'], notation: 'O' },
    { colors: ['red', 'green'], notation: 'P' },
    { colors: ['blue', 'white'], notation: 'Q' },
    { colors: ['blue', 'orange'], notation: 'R' },
    { colors: ['blue', 'yellow'], notation: 'S' },
    { colors: ['blue', 'red'], notation: 'T' },
    { colors: ['yellow', 'green'], notation: 'U' },
    { colors: ['yellow', 'red'], notation: 'V' },
    { colors: ['yellow', 'blue'], notation: 'W' },
    { colors: ['yellow', 'orange'], notation: 'X' }
  ];
  
  const foundEdge = edgeNotation.find(edge => 
    (edge.colors[0] === color1 && edge.colors[1] === color2) ||
    (edge.colors[0] === color2 && edge.colors[1] === color1)
  );
  
  return foundEdge ? { piece: foundEdge.notation, colors: [color1, color2] } : null;
}




// Example usage functions
export function example_usage(): void {
  console.log('=== CUBE SCRAMBLING EXAMPLE ===\n');
  
  // Generate a scramble
  const scramble = generate_scramble_sequence(20);
  console.log(`Generated scramble: ${scramble}\n`);
  
  // Apply scramble to cube
  const scrambledCube = scramble_cube(scramble);
  
  // Print the scrambled cube
  print_cube(scrambledCube);
}
