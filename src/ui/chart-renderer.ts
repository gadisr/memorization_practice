/**
 * Chart rendering components using Chart.js
 */

import { SessionData, NotationSessionData } from '../types.js';
import { ChartData, ChartConfig } from '../types/chart.js';
import {
  processAccuracyData,
  processSpeedData,
  processQualityData,
  processDrillTypeComparison,
  filterSessionsByDateRange,
  filterNotationSessionsByDateRange
} from '../services/chart-data-processor.js';

// Chart.js will be loaded from CDN
declare const Chart: any;

let accuracyChart: any = null;
let speedChart: any = null;
let qualityChart: any = null;
let comparisonChart: any = null;

/**
 * Initialize all charts with session data
 */
export function initializeCharts(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): void {
  // Wait for Chart.js to be loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }

  renderAccuracyChart(sessions, notationSessions);
  renderSpeedChart(sessions, notationSessions);
  renderQualityChart(sessions);
  renderDrillComparisonChart(sessions, notationSessions);
}

/**
 * Render accuracy progress chart
 */
export function renderAccuracyChart(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): void {
  const canvas = document.getElementById('accuracy-chart') as HTMLCanvasElement;
  if (!canvas) return;

  // Destroy existing chart
  if (accuracyChart) {
    accuracyChart.destroy();
  }

  const chartData = processAccuracyData(sessions, notationSessions);
  const config = getLineChartConfig('Accuracy Progress', '%');

  accuracyChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render speed progress chart
 */
export function renderSpeedChart(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): void {
  const canvas = document.getElementById('speed-chart') as HTMLCanvasElement;
  if (!canvas) return;

  // Destroy existing chart
  if (speedChart) {
    speedChart.destroy();
  }

  const chartData = processSpeedData(sessions, notationSessions);
  const config = getLineChartConfig('Speed Progress', 'seconds');

  speedChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render quality trends chart
 */
export function renderQualityChart(sessions: SessionData[]): void {
  const canvas = document.getElementById('quality-chart') as HTMLCanvasElement;
  if (!canvas) return;

  // Destroy existing chart
  if (qualityChart) {
    qualityChart.destroy();
  }

  const chartData = processQualityData(sessions);
  const config = getLineChartConfig('Quality Trends', 'score');

  qualityChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render drill type comparison chart
 */
export function renderDrillComparisonChart(
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): void {
  const canvas = document.getElementById('comparison-chart') as HTMLCanvasElement;
  if (!canvas) return;

  // Destroy existing chart
  if (comparisonChart) {
    comparisonChart.destroy();
  }

  const chartData = processDrillTypeComparison(sessions, notationSessions);
  const config = getBarChartConfig('Drill Type Comparison', '%');

  comparisonChart = new Chart(canvas, {
    type: 'bar',
    data: chartData,
    options: config
  });
}

/**
 * Update all charts with new filters
 */
export function updateChartsWithFilters(
  timeRange: string, 
  drillFilter: string,
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): void {
  let filteredSessions = sessions;
  let filteredNotationSessions = notationSessions;

  // Apply time range filter
  const days = timeRange === 'all' ? 'all' : parseInt(timeRange);
  filteredSessions = filterSessionsByDateRange(filteredSessions, days);
  filteredNotationSessions = filterNotationSessionsByDateRange(filteredNotationSessions, days);

  // Apply drill type filter
  if (drillFilter !== 'all') {
    if (drillFilter === 'notation') {
      // Show only notation drills
      filteredSessions = [];
    } else if (drillFilter === 'flash') {
      // Show only flash drills
      filteredSessions = filteredSessions.filter(s => s.drillType === 'FLASH_PAIRS');
    } else if (drillFilter === 'chain') {
      // Show only memorization drills
      filteredSessions = filteredSessions.filter(s => 
        s.drillType === 'EDGE_MEMORIZATION' || 
        s.drillType === 'CORNER_MEMORIZATION'
      );
    }
  }

  // Re-render all charts with filtered data
  renderAccuracyChart(filteredSessions, filteredNotationSessions);
  renderSpeedChart(filteredSessions, filteredNotationSessions);
  renderQualityChart(filteredSessions);
  renderDrillComparisonChart(filteredSessions, filteredNotationSessions);
}

/**
 * Get configuration for line charts
 */
function getLineChartConfig(title: string, yAxisLabel: string): ChartConfig {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yAxisLabel
        }
      }
    }
  };
}

/**
 * Get configuration for bar charts
 */
function getBarChartConfig(title: string, yAxisLabel: string): ChartConfig {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Drill Type'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yAxisLabel
        },
        min: 0,
        max: 100
      }
    }
  };
}

/**
 * Destroy all charts (cleanup)
 */
export function destroyAllCharts(): void {
  if (accuracyChart) {
    accuracyChart.destroy();
    accuracyChart = null;
  }
  if (speedChart) {
    speedChart.destroy();
    speedChart = null;
  }
  if (qualityChart) {
    qualityChart.destroy();
    qualityChart = null;
  }
  if (comparisonChart) {
    comparisonChart.destroy();
    comparisonChart = null;
  }
}

/**
 * Load Chart.js from CDN
 */
export function loadChartJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Chart.js'));
    document.head.appendChild(script);
  });
}
