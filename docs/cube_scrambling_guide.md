# Cube Scrambling Guide: Colors and Move Notation

## Overview

This document explains how cube scrambling works, focusing on the color system and standard notation moves (U, R, F, B, D, L) with their variants (' and 2). This guide is designed to support the implementation of scrambling algorithms for a Rubik's cube training application.

## Color System

The cube uses a standard 6-color system with the following color mapping:

| Color  | Hex Code | Face |
|--------|----------|------|
| White  | #FFFFFF  | Up (U) |
| Yellow | #FFD700  | Down (D) |
| Red    | #E53935  | Right (R) |
| Orange | #FF6F00  | Left (L) |
| Green  | #43A047  | Front (F) |
| Blue   | #1E88E5  | Back (B) |

### Face Orientation
- **White (U)**: Top face
- **Yellow (D)**: Bottom face  
- **Red (R)**: Right face
- **Orange (L)**: Left face
- **Green (F)**: Front face
- **Blue (B)**: Back face

## Standard Move Notation

### Basic Moves
The six basic moves correspond to rotating each face 90° clockwise:

1. **U** - Up face (White) clockwise
2. **R** - Right face (Red) clockwise
3. **F** - Front face (Green) clockwise
4. **B** - Back face (Blue) clockwise
5. **D** - Down face (Yellow) clockwise
6. **L** - Left face (Orange) clockwise

### Wide Moves
Wide moves rotate both a face and an adjacent center slice simultaneously:

1. **Lw** - Left face + M slice (center between R and L) clockwise
2. **Dw** - Down face + E slice (center between U and D) clockwise

### Move Variants

#### Prime Notation (')
A prime (') after a move indicates a 90° counter-clockwise rotation:
- **U'** - Up face counter-clockwise
- **R'** - Right face counter-clockwise
- **F'** - Front face counter-clockwise
- **B'** - Back face counter-clockwise
- **D'** - Down face counter-clockwise
- **L'** - Left face counter-clockwise
- **Lw'** - Left wide counter-clockwise (L' + M' slice)
- **Dw'** - Down wide counter-clockwise (D' + E' slice)

#### Double Notation (2)
A "2" after a move indicates a 180° rotation (same as doing the move twice):
- **U2** - Up face 180°
- **R2** - Right face 180°
- **F2** - Front face 180°
- **B2** - Back face 180°
- **D2** - Down face 180°
- **L2** - Left face 180°
- **Lw2** - Left wide 180° (L2 + M2 slice)
- **Dw2** - Down wide 180° (D2 + E2 slice)

## Wide Move Behavior

### Lw Moves (Left Wide)
**Lw** combines the L face rotation with the M slice rotation (center slice between R and L faces):
- **Affected pieces**: L face + middle column of U, F, D, B faces
- **Movement pattern**: L face rotates + M slice rotates in same direction
- **Variants**: Lw (clockwise), Lw' (counter-clockwise), Lw2 (180°)

### Dw Moves (Down Wide)  
**Dw** combines the D face rotation with the E slice rotation (center slice between U and D faces):
- **Affected pieces**: D face + middle row of F, R, B, L faces
- **Movement pattern**: D face rotates + E slice rotates in same direction
- **Variants**: Dw (clockwise), Dw' (counter-clockwise), Dw2 (180°)

### Slice Move Components
- **M slice**: Middle slice between R and L faces
  - Clockwise: U[1] → F[1] → D[1] → B[1] → U[1]
  - Counter-clockwise: U[1] → B[1] → D[1] → F[1] → U[1]
- **E slice**: Middle slice between U and D faces
  - Clockwise: F[1] → R[1] → B[1] → L[1] → F[1]
  - Counter-clockwise: F[1] → L[1] → B[1] → R[1] → F[1]

## Color Movement Patterns

### Edge Pieces
Each edge piece has two colors and moves between specific positions. The edge notation system uses letters A-X to represent the 24 possible edge positions.

**Edge Color Pairs:**
- White edges: A(white-blue), B(white-red), C(white-green), D(white-orange)
- Orange edges: E(orange-white), F(orange-green), G(orange-yellow), H(orange-blue)
- Green edges: I(green-white), J(green-red), K(green-yellow), L(green-orange)
- Red edges: M(red-white), N(red-blue), O(red-yellow), P(red-green)
- Blue edges: Q(blue-white), R(blue-orange), S(blue-yellow), T(blue-red)
- Yellow edges: U(yellow-green), V(yellow-red), W(yellow-blue), X(yellow-orange)

### Corner Pieces
Each corner piece has three colors and moves between 24 possible positions (A-X notation).

**Corner Color Triplets:**
- White corners: A(white-orange-blue), B(white-blue-red), C(white-red-green), D(white-green-orange)
- Orange corners: E(orange-blue-white), F(orange-white-green), G(orange-green-yellow), H(orange-yellow-blue)
- Green corners: I(green-orange-white), J(green-white-red), K(green-red-yellow), L(green-yellow-orange)
- Red corners: M(red-green-white), N(red-white-blue), O(red-blue-yellow), P(red-yellow-green)
- Blue corners: Q(blue-red-white), R(blue-white-orange), S(blue-orange-yellow), T(blue-yellow-red)
- Yellow corners: U(yellow-orange-green), V(yellow-green-red), W(yellow-red-blue), X(yellow-blue-orange)

## Scrambling Algorithm Principles

### Random Move Generation
1. **Move Selection**: Randomly select from the 18 possible moves (6 faces × 3 variants)
2. **Avoid Consecutive Same Face**: Prevent moves like U U' or R R2
3. **Scramble Length**: Typically 20-25 moves for a good scramble

### Move Validation Rules
- **No Consecutive Same Face**: U followed by U, U', or U2 is invalid
- **Sufficient Randomization**: Minimum 20 moves recommended

### Color Tracking During Scrambling
When implementing scrambling:
1. **Initialize**: Start with solved state (each face has uniform color)
2. **Apply Moves**: For each move, track how colors move between positions
3. **Update State**: Maintain current color configuration after each move
4. **Generate Notation**: Create scramble sequence as string of moves

## Implementation Considerations

### Data Structures
- **Face Representation**: 3×3 grid for each face
- **Edge Tracking**: Array of 24 edge positions with color pairs
- **Corner Tracking**: Array of 24 corner positions with color triplets
- **Move History**: List of applied moves for scramble sequence

### Move Application Logic
For each move type:
1. **Identify Affected Pieces**: Determine which edges/corners move
2. **Update Positions**: Move pieces to new positions
3. **Update Orientations**: Track piece rotations
4. **Validate State**: Ensure cube remains in valid configuration

### Scramble Generation Process
1. **Initialize**: Set cube to solved state
2. **Generate Moves**: Create random valid move sequence
3. **Apply Moves**: Execute each move on cube state
4. **Output**: Return scramble notation string

## Example Scramble Sequences

### Valid Scrambles
```
R U R' F' R U R' U' R' F R2 U' R'
L2 D' F2 D2 B2 R2 D' L2 U2 F2 R' B' L' B' F' U' L' R U2
F R' U' F' F2 R2 U2 R' U' R' F' R U R U' R' F' R2 U' R'
```

### Invalid Patterns (to avoid)
```
U U' (consecutive same face)
F F2 (consecutive same face)
R R' (consecutive same face)
```

## Quality Metrics for Scrambles

### Randomness Criteria
- **Distribution**: All 18 move types should appear roughly equally
- **Independence**: Each move should be independent of previous moves
- **Unpredictability**: No discernible patterns in move sequence

### Solvability Verification
- **Parity Check**: Ensure scramble maintains solvable cube properties
- **Reachability**: Verify all positions are reachable from solved state
- **Uniqueness**: Each scramble should produce a unique cube state

This guide provides the foundation for implementing a robust cube scrambling system that generates high-quality, random scrambles while maintaining the mathematical properties required for a solvable Rubik's cube.
