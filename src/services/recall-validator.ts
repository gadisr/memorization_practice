/**
 * Recall validation service for verifying user recall against actual pairs
 */

import { DrillType, LetterPair, RecallValidation } from '../types.js';

/**
 * Main validation function - validates user recall against actual session pairs
 */
export function validateRecall(
  userInput: string,
  actualPairs: LetterPair[],
  drillType: DrillType
): RecallValidation {
  const isOrdered = isOrderRequired(drillType);
  const userPairs = parseRecallInput(userInput);
  const actualPairStrings = actualPairs.map(p => p.pair);
  
  if (isOrdered) {
    return validateOrdered(userPairs, actualPairStrings);
  } else {
    return validateUnordered(userPairs, actualPairStrings);
  }
}

/**
 * Parse user input into array of pairs
 * Handles formats: "AB CD EF", "AB,CD,EF", "ABCDEF", "A B C D E F"
 */
export function parseRecallInput(input: string): string[] {
  // Remove extra whitespace and convert to uppercase
  let cleaned = input.trim().toUpperCase();
  
  // Remove common separators (commas, semicolons, pipes)
  cleaned = cleaned.replace(/[,;|]/g, ' ');
  
  // Split by whitespace
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
  
  const pairs: string[] = [];
  
  for (const token of tokens) {
    if (token.length === 2) {
      // Already a pair like "AB"
      pairs.push(token);
    } else if (token.length === 1) {
      // Single letter - will be paired with next token if available
      // For now, skip singles (could be typo)
      continue;
    } else if (token.length > 2 && token.length % 2 === 0) {
      // String like "ABCDEF" - split into pairs
      for (let i = 0; i < token.length; i += 2) {
        pairs.push(token.substring(i, i + 2));
      }
    }
  }
  
  return pairs;
}

/**
 * Check if drill type requires ordered recall
 */
export function isOrderRequired(drillType: DrillType): boolean {
  // Only Flash Pairs doesn't require order
  return drillType !== DrillType.FLASH_PAIRS;
}

/**
 * Validate with unordered matching (Flash Pairs)
 */
function validateUnordered(
  userPairs: string[],
  actualPairs: string[]
): RecallValidation {
  // Normalize pairs (sort letters within each pair)
  const normalizedActual = actualPairs.map(p => normalizePair(p));
  const normalizedUser = userPairs.map(p => normalizePair(p));
  
  // Create sets for comparison
  const actualSet = new Set(normalizedActual);
  const userSet = new Set(normalizedUser);
  
  // Find correct, missed, and extra pairs
  const correctPairs: string[] = [];
  const missedPairs: string[] = [];
  const extraPairs: string[] = [];
  
  // Check which actual pairs were recalled correctly
  normalizedActual.forEach(pair => {
    if (userSet.has(pair)) {
      correctPairs.push(pair);
    } else {
      missedPairs.push(pair);
    }
  });
  
  // Check for extra pairs user added
  normalizedUser.forEach(pair => {
    if (!actualSet.has(pair)) {
      extraPairs.push(pair);
    }
  });
  
  const accuracy = actualPairs.length > 0 
    ? (correctPairs.length / actualPairs.length) * 100 
    : 0;
  
  return {
    isOrderRequired: false,
    correctPairs,
    incorrectPairs: [],  // Not applicable for unordered
    missedPairs,
    extraPairs,
    accuracy
  };
}

/**
 * Validate with ordered matching (all other drills)
 */
function validateOrdered(
  userPairs: string[],
  actualPairs: string[]
): RecallValidation {
  const correctPairs: string[] = [];
  const incorrectPairs: string[] = [];
  const missedPairs: string[] = [];
  const extraPairs: string[] = [];
  
  // Check each position
  for (let i = 0; i < actualPairs.length; i++) {
    const actualPair = actualPairs[i];
    const userPair = i < userPairs.length ? userPairs[i] : null;
    
    if (userPair === actualPair) {
      correctPairs.push(actualPair);
    } else if (userPair === null) {
      missedPairs.push(actualPair);
    } else {
      incorrectPairs.push(actualPair);
    }
  }
  
  // Any pairs beyond the actual pairs count are extra
  if (userPairs.length > actualPairs.length) {
    for (let i = actualPairs.length; i < userPairs.length; i++) {
      extraPairs.push(userPairs[i]);
    }
  }
  
  const accuracy = actualPairs.length > 0 
    ? (correctPairs.length / actualPairs.length) * 100 
    : 0;
  
  return {
    isOrderRequired: true,
    correctPairs,
    incorrectPairs,
    missedPairs,
    extraPairs,
    accuracy
  };
}

/**
 * Normalize pair format - sort letters within pair
 * For Flash Pairs, treat "AB" and "BA" as equivalent
 */
function normalizePair(pair: string): string {
  if (pair.length !== 2) return pair;
  
  const chars = pair.split('').sort();
  return chars.join('');
}

