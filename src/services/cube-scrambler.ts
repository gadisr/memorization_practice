import { 
  CubeState, 
  CubeFace, 
  FullMove, 
  Move, 
  MoveVariant, 
  COLORS, 
  FACE_COLORS, 
  POSITION_LETTERS,
  EDGE_PIECES 
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
  // Simple moves only - no wide moves (Lw, Dw, etc.)
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
export function apply_move(cube: CubeState, move: FullMove): void {
  // Log each move applied for traceability
  try { console.log('▶ Applying move:', move); } catch {}
  // Handle wide moves (Lw, Dw) - they have 2 characters + variant
  if (move.startsWith('Lw')) {
    const variant = move.slice(2) as MoveVariant;
    if (variant === "'") move_Lw_prime(cube);
    else if (variant === '2') { move_Lw(cube); move_Lw(cube); }
    else move_Lw(cube);
    // Generic completion log for any move
    try { console.log('✓ Move completed:', move); } catch {}
    return;
  }
  
  if (move.startsWith('Dw')) {
    const variant = move.slice(2) as MoveVariant;
    if (variant === "'") move_Dw_prime(cube);
    else if (variant === '2') { move_Dw(cube); move_Dw(cube); }
    else move_Dw(cube);
    // Generic completion log for any move
    try { console.log('✓ Move completed:', move); } catch {}
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
  // Generic completion log for any move
  try { 
    console.log('✓ Move completed:', move); 
    print_cube(cube);
  } catch {}
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
export function rotate_face_clockwise(face: CubeFace): void {
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
export function rotate_face_counter_clockwise(face: CubeFace): void {
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
  cube.faces.L.colors[1] = [...cube.faces.B.colors[1]];
  
  // B[1] gets R[1] (reversed order for B face)
  cube.faces.B.colors[1] = [...cube.faces.R.colors[1]];
  
  // R[1] gets temp (original F[1])
  cube.faces.R.colors[1] = temp;
  
  // Rotate centers of affected faces (F, R, B, L)
  // F center rotates clockwise (green -> orange)
  const fCenter = cube.faces.F.center;
  cube.faces.F.center = cube.faces.L.center;
  cube.faces.L.center = cube.faces.B.center;
  cube.faces.B.center = cube.faces.R.center;
  cube.faces.R.center = fCenter;
  
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
  
}


/**
 * Get edge position from POSITION_LETTERS mapping
 */
function get_edge_position(edgeId: string): [string, number, number] | null {
  // Find the position of this edge letter in POSITION_LETTERS
  for (const [faceKey, faceLetters] of Object.entries(POSITION_LETTERS)) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (faceLetters[row][col] === edgeId) {
          return [faceKey, row, col];
        }
      }
    }
  }
  return null;
}

/**
 * Create edge tracking data using shared models
 */
function create_edge_tracking() {
  const edges: Array<{
    id: string;
    colors: [string, string];
    position: [string, number, number];
    originalPosition: [string, number, number];
  }> = [];
  
  // Use EDGE_PIECES from cube-models.ts
  for (const [edgeId, colors] of Object.entries(EDGE_PIECES)) {
    const position = get_edge_position(edgeId);
    if (position) {
      edges.push({
        id: edgeId,
        colors: colors,
        position: position,
        originalPosition: position
      });
    }
  }
  
  return edges;
}

/**
 * Find edge piece by colors at a position
 */
function find_edge_by_colors(cube: CubeState, face: string, row: number, col: number) {
  const color1 = cube.faces[face as keyof typeof cube.faces].colors[row][col];
  const color2 = get_adjacent_color(cube, face, row, col);
  if (!color2) return null;
  
  // Find matching edge in EDGE_PIECES from cube-models.ts
  for (const [edgeId, colors] of Object.entries(EDGE_PIECES)) {
    if ((colors[0] === color1 && colors[1] === color2) ||
        (colors[0] === color2 && colors[1] === color1)) {
      return {
        id: edgeId,
        colors: colors,
        position: get_edge_position(edgeId),
        originalPosition: get_edge_position(edgeId)
      };
    }
  }
  return null;
}

/**
 * Get adjacent color for edge piece using POSITION_LETTERS mapping
 */
function get_adjacent_color(cube: CubeState, face: string, row: number, col: number): string | null {
  // Find the edge letter at this position
  const edgeLetter = POSITION_LETTERS[face as keyof typeof POSITION_LETTERS]?.[row]?.[col];
  if (!edgeLetter || edgeLetter === '*') return null;
  
  // Find the secondary position for this edge letter
  const secondaryLetter = get_secondary_edge_letter(edgeLetter);
  if (!secondaryLetter || secondaryLetter === 'invalid') return null;
  
  // Get the position of the secondary letter
  const secondaryPosition = get_edge_position(secondaryLetter);
  if (!secondaryPosition) return null;
  
  // Get the color at the secondary position
  const [secondaryFace, secondaryRow, secondaryCol] = secondaryPosition;
  return cube.faces[secondaryFace as keyof typeof cube.faces].colors[secondaryRow][secondaryCol];
}

/**
 * Get secondary edge letter (the other position of the same edge piece)
 */
function get_secondary_edge_letter(edgeLetter: string): string | null {
  // Find the colors for this edge letter
  const colors = EDGE_PIECES[edgeLetter];
  if (!colors) return null;
  
  // Find the edge letter with reversed colors
  for (const [letter, edgeColors] of Object.entries(EDGE_PIECES)) {
    if (edgeColors[0] === colors[1] && edgeColors[1] === colors[0]) {
      return letter;
    }
  }
  return null;
}

/**
 * Update edge positions after a move using POSITION_LETTERS
 */
function update_edge_positions(cube: CubeState, edges: ReturnType<typeof create_edge_tracking>): void {
  // For each edge, find where it currently is by checking all positions
  edges.forEach(edge => {
    // Get the expected colors for this edge
    const expectedColors = EDGE_PIECES[edge.id];
    if (!expectedColors) return;
    
    // Check all edge positions to find where this edge currently is
    const edgeLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 
                        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    
    for (const letter of edgeLetters) {
      const position = get_edge_position(letter);
      if (!position) continue;
      
      const [face, row, col] = position;
      const foundEdge = find_edge_by_colors(cube, face, row, col);
      
      // Check if this is the edge we're looking for
      if (foundEdge && foundEdge.id === edge.id) {
        edge.position = [face, row, col];
        break;
      }
    }
  });
}

/**
 * Apply a scramble sequence to a cube with edge tracing
 * @param scramble Scramble string with moves separated by spaces
 * @returns Scrambled cube state and edge tracing information
 */
export function scramble_cube_with_tracing(scramble: string): { cube: CubeState; edgeTracing: ReturnType<typeof create_edge_tracking> } {
  const cube = create_solved_cube();
  const moves = scramble.trim().split(/\s+/);
  const edgeTracing = create_edge_tracking();
  
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

