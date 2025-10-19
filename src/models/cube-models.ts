// Shared object models for cube representation

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

export interface EdgePiece {
  id: string;
  colors: [string, string];
  position: [string, number, number]; // [face, row, col]
  originalPosition: [string, number, number];
}

export interface CornerPiece {
  position: string;
  colors: [string, string, string];
}

// Move types
export type Move = 'U' | 'R' | 'F' | 'B' | 'D' | 'L' | 'Lw' | 'Dw';
export type MoveVariant = '' | "'" | '2';
export type FullMove = `${Move}${MoveVariant}`;

// Color mapping
export const COLORS = {
  white: '#FFFFFF',
  yellow: '#FFD700',
  red: '#E53935',
  orange: '#FF6F00',
  green: '#43A047',
  blue: '#1E88E5'
} as const;

// Face to color mapping
export const FACE_COLORS = {
  U: 'white',
  D: 'yellow',
  R: 'red',
  L: 'orange',
  F: 'green',
  B: 'blue'
} as const;

// Position to letter mapping for reference
export const POSITION_LETTERS = {
  U: [['A', 'a', 'B'], ['d', '*', 'b'], ['D', 'c', 'C']],
  L: [['E', 'e', 'F'], ['h', '*', 'f'], ['H', 'g', 'G']],
  F: [['I', 'i', 'J'], ['l', '*', 'j'], ['L', 'k', 'K']],
  R: [['M', 'm', 'N'], ['p', '*', 'n'], ['P', 'o', 'O']],
  B: [['Q', 'q', 'R'], ['t', '*', 'r'], ['T', 's', 'S']],
  D: [['U', 'u', 'V'], ['x', '*', 'v'], ['X', 'w', 'W']]
} as const;

// Edge piece definitions (position -> colors) - using lowercase letters a-x
export const EDGE_PIECES: Record<string, [string, string]> = {
  'a': ['white', 'blue'], 'b': ['white', 'red'], 'c': ['white', 'green'], 'd': ['white', 'orange'],
  'e': ['orange', 'white'], 'f': ['orange', 'green'], 'g': ['orange', 'yellow'], 'h': ['orange', 'blue'],
  'i': ['green', 'white'], 'j': ['green', 'red'], 'k': ['green', 'yellow'], 'l': ['green', 'orange'],
  'm': ['red', 'white'], 'n': ['red', 'blue'], 'o': ['red', 'yellow'], 'p': ['red', 'green'],
  'q': ['blue', 'white'], 'r': ['blue', 'orange'], 's': ['blue', 'yellow'], 't': ['blue', 'red'],
  'u': ['yellow', 'green'], 'v': ['yellow', 'red'], 'w': ['yellow', 'blue'], 'x': ['yellow', 'orange']
};

// Corner piece definitions (position -> colors)
export const CORNER_PIECES: Record<string, [string, string, string]> = {
  'A': ['white', 'orange', 'blue'], 'B': ['white', 'blue', 'red'], 'C': ['white', 'red', 'green'], 'D': ['white', 'green', 'orange'],
  'E': ['orange', 'blue', 'white'], 'F': ['orange', 'white', 'green'], 'G': ['orange', 'green', 'yellow'], 'H': ['orange', 'yellow', 'blue'],
  'I': ['green', 'orange', 'white'], 'J': ['green', 'white', 'red'], 'K': ['green', 'red', 'yellow'], 'L': ['green', 'yellow', 'orange'],
  'M': ['red', 'green', 'white'], 'N': ['red', 'white', 'blue'], 'O': ['red', 'blue', 'yellow'], 'P': ['red', 'yellow', 'green'],
  'Q': ['blue', 'red', 'white'], 'R': ['blue', 'white', 'orange'], 'S': ['blue', 'orange', 'yellow'], 'T': ['blue', 'yellow', 'red'],
  'U': ['yellow', 'orange', 'green'], 'V': ['yellow', 'green', 'red'], 'W': ['yellow', 'red', 'blue'], 'X': ['yellow', 'blue', 'orange']
};
