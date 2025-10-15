/**
 * Random pair generator service
 */

import { LetterPair } from '../types.js';

let pairCache: string[] | null = null;

export async function loadPairReference(): Promise<string[]> {
  if (pairCache) return pairCache;
  
  try {
    const response = await fetch('./data/pair-reference.json');
    const pairs = await response.json() as string[];
    pairCache = pairs;
    return pairCache;
  } catch (error) {
    console.error('Error loading pair reference:', error);
    // Fallback: generate pairs programmatically
    const pairs: string[] = [];
    for (let i = 65; i <= 90; i++) {
      for (let j = 65; j <= 90; j++) {
        pairs.push(String.fromCharCode(i) + String.fromCharCode(j));
      }
    }
    pairCache = pairs;
    return pairs;
  }
}

export function validatePair(pair: string): boolean {
  if (!pairCache) return false;
  return pairCache.includes(pair);
}

export async function generateRandomPairs(
  count: number,
  excludeRepeats: boolean = false
): Promise<LetterPair[]> {
  const allPairs = await loadPairReference();
  const shuffled = fisherYatesShuffle([...allPairs]);
  
  let selectedPairs = shuffled.slice(0, count);
  
  // If excluding repeats, ensure no consecutive duplicates
  if (excludeRepeats) {
    selectedPairs = removeConsecutiveDuplicates(selectedPairs, allPairs);
  }
  
  return selectedPairs.map((pair, index) => ({
    pair,
    displayOrder: index,
    timestamp: Date.now()
  }));
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function removeConsecutiveDuplicates(pairs: string[], allPairs: string[]): string[] {
  const result: string[] = [pairs[0]];
  const available = [...allPairs];
  
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i] !== pairs[i - 1]) {
      result.push(pairs[i]);
    } else {
      // Find a different pair
      const replacement = available.find(p => p !== pairs[i - 1] && !result.includes(p));
      if (replacement) {
        result.push(replacement);
      } else {
        result.push(pairs[i]); // Fallback if no alternative found
      }
    }
  }
  
  return result;
}

