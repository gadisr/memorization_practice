/**
 * Population stats service for comparing user performance to population
 */

import { UserStats } from './stats-calculator.js';

export interface PopulationStats {
  avg_accuracy?: number;
  avg_speed?: number;
  avg_quality?: number;
  avgAccuracy?: number;
  avgSpeed?: number;
  avgQuality?: number;
  percentiles?: {
    accuracy: PercentileDistribution;
    speed: PercentileDistribution;
    quality: PercentileDistribution;
  };
  improvement_benchmarks?: ImprovementBenchmark[];
  improvementBenchmarks?: ImprovementBenchmark[];
  drill_popularity?: Record<string, number>;
  drillPopularity?: Map<string, number>;
}

export interface PercentileDistribution {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface ImprovementBenchmark {
  sessions: number;
  avgImprovement?: number;
  avg_improvement?: number;
  description: string;
}

export interface UserPercentiles {
  accuracyPercentile: number;
  speedPercentile: number;
  qualityPercentile: number;
  accuracyBadge: string;
  speedBadge: string;
  qualityBadge: string;
}

export interface PerformanceBadge {
  label: string;
  color: string;
  description: string;
}

/**
 * Calculate user percentile rankings
 */
export function calculateUserPercentiles(
  userStats: UserStats,
  populationStats: PopulationStats
): UserPercentiles {
  if (!populationStats.percentiles) {
    throw new Error('Population stats percentiles not available');
  }
  
  const accuracyPercentile = calculatePercentile(
    userStats.avgAccuracy,
    populationStats.percentiles.accuracy
  );
  const speedPercentile = calculatePercentile(
    userStats.avgSpeed,
    populationStats.percentiles.speed,
    true // reverse for speed (lower is better)
  );
  const qualityPercentile = calculatePercentile(
    userStats.bestQuality,
    populationStats.percentiles.quality
  );
  
  return {
    accuracyPercentile,
    speedPercentile,
    qualityPercentile,
    accuracyBadge: getPerformanceBadge(accuracyPercentile).label,
    speedBadge: getPerformanceBadge(speedPercentile).label,
    qualityBadge: getPerformanceBadge(qualityPercentile).label
  };
}

/**
 * Calculate percentile for a value given distribution
 */
function calculatePercentile(
  value: number,
  distribution: PercentileDistribution,
  reverse: boolean = false
): number {
  if (reverse) {
    // For speed, lower is better, so reverse the logic
    if (value <= distribution.p90) return 90;
    if (value <= distribution.p75) return 75;
    if (value <= distribution.p50) return 50;
    if (value <= distribution.p25) return 25;
    return 10;
  } else {
    // For accuracy and quality, higher is better
    if (value >= distribution.p90) return 90;
    if (value >= distribution.p75) return 75;
    if (value >= distribution.p50) return 50;
    if (value >= distribution.p25) return 25;
    return 10;
  }
}

/**
 * Get performance badge based on percentile
 */
export function getPerformanceBadge(percentile: number): PerformanceBadge {
  if (percentile >= 90) {
    return {
      label: 'Elite',
      color: '#9C27B0',
      description: 'Top 10% performer'
    };
  } else if (percentile >= 75) {
    return {
      label: 'Top Performer',
      color: '#2196F3',
      description: 'Top 25% performer'
    };
  } else if (percentile >= 50) {
    return {
      label: 'Above Average',
      color: '#4CAF50',
      description: 'Above average performer'
    };
  } else if (percentile >= 25) {
    return {
      label: 'Average',
      color: '#FF9800',
      description: 'Average performer'
    };
  } else {
    return {
      label: 'Improving',
      color: '#757575',
      description: 'Keep practicing!'
    };
  }
}

/**
 * Generate value indicators based on user stats and population stats
 */
export function generateValueIndicators(
  userStats: UserStats,
  populationStats: PopulationStats
): string[] {
  const indicators: string[] = [];
  
  const avgAccuracy = populationStats.avg_accuracy || populationStats.avgAccuracy || 0;
  const avgSpeed = populationStats.avg_speed || populationStats.avgSpeed || 0;
  const benchmarks = populationStats.improvement_benchmarks || populationStats.improvementBenchmarks || [];
  
  // Compare to population averages
  if (avgAccuracy > 0 && userStats.avgAccuracy > avgAccuracy) {
    const improvement = ((userStats.avgAccuracy - avgAccuracy) / avgAccuracy * 100).toFixed(1);
    indicators.push(`Your accuracy is ${improvement}% above average!`);
  }
  
  if (avgSpeed > 0 && userStats.avgSpeed < avgSpeed) {
    const improvement = ((avgSpeed - userStats.avgSpeed) / avgSpeed * 100).toFixed(1);
    indicators.push(`You're ${improvement}% faster than average!`);
  }
  
  // Improvement benchmarks
  if (benchmarks.length > 0) {
    const relevantBenchmark = benchmarks
      .find((b: ImprovementBenchmark) => userStats.totalSessions >= b.sessions);
    if (relevantBenchmark) {
      const improvement = relevantBenchmark.avg_improvement || relevantBenchmark.avgImprovement || 0;
      indicators.push(`Average users improve ${improvement}% after ${relevantBenchmark.sessions} sessions`);
    }
  }
  
  // Streak encouragement
  if (userStats.currentStreak > 0) {
    indicators.push(`Great streak! ${userStats.currentStreak} day${userStats.currentStreak > 1 ? 's' : ''} in a row`);
  }
  
  // Session count milestones
  if (userStats.totalSessions >= 50) {
    indicators.push('You\'ve completed 50+ sessions! Keep up the excellent work!');
  } else if (userStats.totalSessions >= 25) {
    indicators.push('You\'re on track to beat the average!');
  } else if (userStats.totalSessions >= 10) {
    indicators.push('Keep practicing! Consistency is key to improvement.');
  }
  
  return indicators;
}

/**
 * Format percentile for display
 */
export function formatPercentile(percentile: number): string {
  if (percentile >= 90) return 'Top 10%';
  if (percentile >= 75) return 'Top 25%';
  if (percentile >= 50) return 'Top 50%';
  if (percentile >= 25) return 'Top 75%';
  return 'Keep practicing!';
}

/**
 * Compare user performance to population average
 */
export function compareToAverage(
  userValue: number,
  populationAverage: number,
  metric: 'accuracy' | 'speed' | 'quality'
): { comparison: string; isAboveAverage: boolean } {
  const isReverse = metric === 'speed'; // Lower is better for speed
  const diff = userValue - populationAverage;
  const percentDiff = Math.abs(diff / populationAverage * 100);
  
  if (metric === 'speed') {
    if (diff < 0) {
      return {
        comparison: `${percentDiff.toFixed(1)}% faster than average`,
        isAboveAverage: true
      };
    } else {
      return {
        comparison: `${percentDiff.toFixed(1)}% slower than average`,
        isAboveAverage: false
      };
    }
  } else {
    if (diff > 0) {
      return {
        comparison: `${percentDiff.toFixed(1)}% above average`,
        isAboveAverage: true
      };
    } else {
      return {
        comparison: `${percentDiff.toFixed(1)}% below average`,
        isAboveAverage: false
      };
    }
  }
}

