/**
 * Piece generator service for edge and corner notation training
 */

import { EdgePiece, CornerPiece } from '../types.js';

let cachedEdgePieces: EdgePiece[] | null = null;
let cachedCornerPieces: CornerPiece[] | null = null;

export async function loadEdgePieces(): Promise<EdgePiece[]> {
  if (cachedEdgePieces) {
    return cachedEdgePieces;
  }
  
  const response = await fetch('/public/data/edge-notation.json');
  const pieces: EdgePiece[] = await response.json();
  cachedEdgePieces = pieces;
  return pieces;
}

export async function loadCornerPieces(): Promise<CornerPiece[]> {
  if (cachedCornerPieces) {
    return cachedCornerPieces;
  }
  
  const response = await fetch('/public/data/corner-notation.json');
  const pieces: CornerPiece[] = await response.json();
  cachedCornerPieces = pieces;
  return pieces;
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateRandomEdgeSequence(): Promise<EdgePiece[]> {
  const edges = await loadEdgePieces();
  const shuffled = fisherYatesShuffle(edges);
  
  return shuffled.map((edge, index) => ({
    ...edge,
    displayOrder: index
  }));
}

export async function generateRandomCornerSequence(): Promise<CornerPiece[]> {
  const corners = await loadCornerPieces();
  const shuffled = fisherYatesShuffle(corners);
  
  return shuffled.map((corner, index) => ({
    ...corner,
    displayOrder: index
  }));
}

