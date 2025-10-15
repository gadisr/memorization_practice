/**
 * Timer service for tracking visualization speed
 */

export function startTimer(): number {
  return Date.now();
}

export function stopTimer(startTime: number): number {
  const elapsed = Date.now() - startTime;
  return Number((elapsed / 1000).toFixed(2)); // Convert to seconds with 2 decimal precision
}

export function calculateAverage(timings: number[]): number {
  if (timings.length === 0) return 0;
  
  const sum = timings.reduce((acc, time) => acc + time, 0);
  const average = sum / timings.length;
  return Number(average.toFixed(2));
}

export function formatTime(seconds: number): string {
  return `${seconds.toFixed(2)}s`;
}


