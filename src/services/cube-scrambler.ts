import { 
  CubeState, 
  CubeFace, 
  FullMove, 
  Move, 
  MoveVariant, 
  COLORS, 
  FACE_COLORS, 
  POSITION_LETTERS 
} from '../models/cube-models.js';

// Simple random function to replace lodash
function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random scramble sequence
 * @param length Number of moves in the scramble (default: 25)
 * @returns Scramble string with moves separated by spaces
 */
export function generate_scramble_sequence(length: number = 25): string {
  const moves: Move[] = ['U', 'R', 'F', 'B', 'D', 'L', 'Lw', 'Dw'];
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
  // Handle wide moves (Lw, Dw) - they have 2 characters + variant
  if (move.startsWith('Lw')) {
    const variant = move.slice(2) as MoveVariant;
    if (variant === "'") move_Lw_prime(cube);
    else if (variant === '2') { move_Lw(cube); move_Lw(cube); }
    else move_Lw(cube);
    return;
  }
  
  if (move.startsWith('Dw')) {
    const variant = move.slice(2) as MoveVariant;
    if (variant === "'") move_Dw_prime(cube);
    else if (variant === '2') { move_Dw(cube); move_Dw(cube); }
    else move_Dw(cube);
    return;
  }
  
  // Handle basic moves (U, R, F, B, D, L) - they have 1 character + variant
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
 * M slice move (Middle slice between R and L) - clockwise
 * Affects: middle column of U, F, D, B faces AND their centers
 */
function move_M_slice(cube: CubeState): void {
  // M slice clockwise: U[1] → F[1] → D[1] → B[1] → U[1]
  const temp = [
    cube.faces.U.colors[0][1],
    cube.faces.U.colors[1][1], 
    cube.faces.U.colors[2][1]
  ];
  
  // U[1] gets B[1] (reversed order for B face)
  cube.faces.U.colors[0][1] = cube.faces.B.colors[2][1];
  cube.faces.U.colors[1][1] = cube.faces.B.colors[1][1];
  cube.faces.U.colors[2][1] = cube.faces.B.colors[0][1];
  
  // B[1] gets D[1] (reversed order for B face)
  cube.faces.B.colors[0][1] = cube.faces.D.colors[2][1];
  cube.faces.B.colors[1][1] = cube.faces.D.colors[1][1];
  cube.faces.B.colors[2][1] = cube.faces.D.colors[0][1];
  
  // D[1] gets F[1] (reversed order for D face)
  cube.faces.D.colors[0][1] = cube.faces.F.colors[0][1];
  cube.faces.D.colors[1][1] = cube.faces.F.colors[1][1];
  cube.faces.D.colors[2][1] = cube.faces.F.colors[2][1];
  
  // F[1] gets temp (original U[1])
  cube.faces.F.colors[0][1] = temp[0];
  cube.faces.F.colors[1][1] = temp[1];
  cube.faces.F.colors[2][1] = temp[2];
  
  // Rotate centers of affected faces (U, D, F, B)
  // U center rotates clockwise (white -> green)
  const uCenter = cube.faces.U.center;
  cube.faces.U.center = cube.faces.F.center;
  cube.faces.F.center = cube.faces.D.center;
  cube.faces.D.center = cube.faces.B.center;
  cube.faces.B.center = uCenter;
  
  console.log('🔄 M slice move completed');
}

/**
 * M' slice move (Middle slice between R and L) - counter-clockwise
 * Affects: middle column of U, F, D, B faces AND their centers
 */
function move_M_slice_prime(cube: CubeState): void {
  // M' slice counter-clockwise: U[1] → F[1] → D[1] → B[1] → U[1] (reverse of M)
  const temp = [
    cube.faces.U.colors[0][1],
    cube.faces.U.colors[1][1], 
    cube.faces.U.colors[2][1]
  ];
  
  // U[1] gets F[1]
  cube.faces.U.colors[0][1] = cube.faces.F.colors[0][1];
  cube.faces.U.colors[1][1] = cube.faces.F.colors[1][1];
  cube.faces.U.colors[2][1] = cube.faces.F.colors[2][1];
  
  // F[1] gets D[1] (reversed order for F face)
  cube.faces.F.colors[0][1] = cube.faces.D.colors[0][1];
  cube.faces.F.colors[1][1] = cube.faces.D.colors[1][1];
  cube.faces.F.colors[2][1] = cube.faces.D.colors[2][1];
  
  // D[1] gets B[1] (reversed order for D face)
  cube.faces.D.colors[0][1] = cube.faces.B.colors[2][1];
  cube.faces.D.colors[1][1] = cube.faces.B.colors[1][1];
  cube.faces.D.colors[2][1] = cube.faces.B.colors[0][1];
  
  // B[1] gets temp (original U[1], reversed order for B face)
  cube.faces.B.colors[0][1] = temp[2];
  cube.faces.B.colors[1][1] = temp[1];
  cube.faces.B.colors[2][1] = temp[0];
  
  // Rotate centers of affected faces (U, D, F, B) - counter-clockwise
  // U center rotates counter-clockwise (white -> blue)
  const uCenter = cube.faces.U.center;
  cube.faces.U.center = cube.faces.B.center;
  cube.faces.B.center = cube.faces.D.center;
  cube.faces.D.center = cube.faces.F.center;
  cube.faces.F.center = uCenter;
  
  console.log('🔄 M\' slice move completed');
}

/**
 * E slice move (Equatorial slice between U and D) - clockwise
 * Affects: middle row of F, R, B, L faces AND their centers
 */
function move_E_slice(cube: CubeState): void {
  // E slice clockwise: F[1] → R[1] → B[1] → L[1] → F[1]
  const temp = [...cube.faces.F.colors[1]];
  
  // F[1] gets L[1]
  cube.faces.F.colors[1] = [...cube.faces.L.colors[1]];
  
  // L[1] gets B[1] (reversed order for L face)
  cube.faces.L.colors[1] = [...cube.faces.B.colors[1]]
  
  // B[1] gets R[1] (reversed order for B face)
  cube.faces.B.colors[1] = [...cube.faces.R.colors[1]]
  
  // R[1] gets temp (original F[1])
  cube.faces.R.colors[1] = temp;
  
  // Rotate centers of affected faces (F, R, B, L)
  // F center rotates clockwise (green -> orange)
  const fCenter = cube.faces.F.center;
  cube.faces.F.center = cube.faces.L.center;
  cube.faces.L.center = cube.faces.B.center;
  cube.faces.B.center = cube.faces.R.center;
  cube.faces.R.center = fCenter;
  
  console.log('🔄 E slice move completed');
}

/**
 * E' slice move (Equatorial slice between U and D) - counter-clockwise
 * Affects: middle row of F, R, B, L faces AND their centers
 */
function move_E_slice_prime(cube: CubeState): void {
  // E' slice counter-clockwise: F[1] → L[1] → B[1] → R[1] → F[1] (reverse of E)
  const temp = [...cube.faces.F.colors[1]];
  
  // F[1] gets R[1]
  cube.faces.F.colors[1] = [...cube.faces.R.colors[1]];
  
  // R[1] gets B[1] (reversed order for R face)
  cube.faces.R.colors[1] = [...cube.faces.B.colors[1]];
  
  // B[1] gets L[1] (reversed order for B face)
  cube.faces.B.colors[1] = [...cube.faces.L.colors[1]];
  
  // L[1] gets temp (original F[1])
  cube.faces.L.colors[1] = temp;
  
  // Rotate centers of affected faces (F, R, B, L) - counter-clockwise
  // F center rotates counter-clockwise (green -> red)
  const fCenter = cube.faces.F.center;
  cube.faces.F.center = cube.faces.R.center;
  cube.faces.R.center = cube.faces.B.center;
  cube.faces.B.center = cube.faces.L.center;
  cube.faces.L.center = fCenter;
  
  console.log('🔄 E\' slice move completed');
}

/**
 * Move Lw (Left wide - L face + M slice) - clockwise
 * Combines L move + M slice move
 */
function move_Lw(cube: CubeState): void {
  // Apply L move
  move_L(cube);
  // Apply M slice move
  move_M_slice(cube);
  
  console.log('🔄 Lw move completed (L + M slice)');
}

/**
 * Move Lw' (Left wide - L face + M slice) - counter-clockwise
 * Combines L' move + M' slice move
 */
function move_Lw_prime(cube: CubeState): void {
  // Apply L' move
  move_L_prime(cube);
  // Apply M' slice move
  move_M_slice_prime(cube);
  
  console.log('🔄 Lw\' move completed (L\' + M\' slice)');
}

/**
 * Move Dw (Down wide - D face + E slice) - clockwise
 * Combines D move + E slice move
 */
function move_Dw(cube: CubeState): void {
  // Apply D move
  move_D(cube);
  // Apply E slice move
  move_E_slice(cube);
  
  console.log('🔄 Dw move completed (D + E slice)');
}

/**
 * Move Dw' (Down wide - D face + E slice) - counter-clockwise
 * Combines D' move + E' slice move
 */
function move_Dw_prime(cube: CubeState): void {
  // Apply D' move
  move_D_prime(cube);
  // Apply E' slice move
  move_E_slice_prime(cube);
  
  console.log('🔄 Dw\' move completed (D\' + E\' slice)');
}


/**
 * Apply a scramble sequence to a cube
 * @param scramble Scramble string with moves separated by spaces
 * @returns Scrambled cube state
 */
export function scramble_cube(scramble: string): CubeState {
  const cube = create_solved_cube();
  const moves = scramble.trim().split(/\s+/);
  
  console.log('🎲 === CUBE SCRAMBLING ===');
  console.log('📝 Scramble sequence:', scramble);
  console.log('🔢 Total moves:', moves.length);
  console.log('');
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move) {
      console.log(`🔄 Move ${i + 1}/${moves.length}: ${move}`);
      apply_move(cube, move as FullMove);
    }
  }
  
  print_color_analysis(cube);
  console.log('✅ Scrambling completed!');
  
  return cube;
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
  // Handle wide moves first
  if (move.startsWith('Lw')) {
    const variant = move.slice(2);
    let explanation = `Move ${move} (Left wide `;
    
    if (variant === "'") explanation += "counter-clockwise";
    else if (variant === '2') explanation += "180 degrees";
    else explanation += "clockwise";
    
    explanation += "):\n";
    explanation += "• Rotates the LEFT face (orange center)\n";
    explanation += "• Rotates the M slice (middle slice between R and L)\n";
    explanation += "• Combines L move + M slice move\n";
    explanation += "• Affected pieces: L face + middle column of U, F, D, B faces\n";
    return explanation;
  }
  
  if (move.startsWith('Dw')) {
    const variant = move.slice(2);
    let explanation = `Move ${move} (Down wide `;
    
    if (variant === "'") explanation += "counter-clockwise";
    else if (variant === '2') explanation += "180 degrees";
    else explanation += "clockwise";
    
    explanation += "):\n";
    explanation += "• Rotates the DOWN face (yellow center)\n";
    explanation += "• Rotates the E slice (equatorial slice between U and D)\n";
    explanation += "• Combines D move + E slice move\n";
    explanation += "• Affected pieces: D face + middle row of F, R, B, L faces\n";
    return explanation;
  }
  
  // Handle basic moves
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
  
  const moves: FullMove[] = ['U', 'U\'', 'U2', 'R', 'R\'', 'R2', 'F', 'F\'', 'F2', 'B', 'B\'', 'B2', 'D', 'D\'', 'D2', 'L', 'L\'', 'L2', 'Lw', 'Lw\'', 'Lw2', 'Dw', 'Dw\'', 'Dw2'];
  
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
