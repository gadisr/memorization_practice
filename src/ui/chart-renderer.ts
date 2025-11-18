/**
 * Chart rendering components using Chart.js
 */

import { SessionData, NotationSessionData } from '../types.js';
import { ChartData, ChartConfig } from '../types/chart.js';
import {
  processFlashPairsData,
  processNotationData,
  processTracingData,
  processMemorizationData,
  filterSessionsByDateRange,
  filterNotationSessionsByDateRange
} from '../services/chart-data-processor.js';

// Chart.js will be loaded from CDN
declare const Chart: any;

let flashPairsChart: any = null;
let notationChart: any = null;
let tracingChart: any = null;
let memorizationChart: any = null;

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

  renderFlashPairsChart(sessions);
  renderNotationChart(notationSessions);
  renderTracingChart(sessions);
  renderMemorizationChart(sessions);
}

/**
 * Render Flash Pairs chart
 */
export function renderFlashPairsChart(sessions: SessionData[]): void {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart render');
    return;
  }

  const canvas = document.getElementById('flash-pairs-chart') as HTMLCanvasElement;
  if (!canvas) return;

  // Destroy existing chart
  if (flashPairsChart) {
    flashPairsChart.destroy();
  }

  const chartData = processFlashPairsData(sessions);
  const config = getMultiLineChartConfig('Flash Pairs Progress');

  flashPairsChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render merged Notation chart (Edge + Corner)
 */
export function renderNotationChart(sessions: NotationSessionData[]): void {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart render');
    return;
  }

  const canvas = document.getElementById('notation-chart') as HTMLCanvasElement;
  if (!canvas) {
    console.warn('Notation chart canvas not found');
    return;
  }

  // Destroy existing chart
  if (notationChart) {
    notationChart.destroy();
  }

  const chartData = processNotationData(sessions);
  
  // Ensure we have at least empty structure if no data
  if (chartData.labels.length === 0) {
    chartData.labels = ['No data'];
    chartData.datasets.forEach(dataset => {
      dataset.data = [NaN];
    });
  }
  
  const config = getMultiLineChartConfig('Notation Progress');

  notationChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render merged Tracing chart (Edge + Corner)
 */
export function renderTracingChart(sessions: SessionData[]): void {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart render');
    return;
  }

  const canvas = document.getElementById('tracing-chart') as HTMLCanvasElement;
  if (!canvas) {
    console.warn('Tracing chart canvas not found');
    return;
  }

  // Destroy existing chart
  if (tracingChart) {
    tracingChart.destroy();
  }

  const chartData = processTracingData(sessions);
  
  // Ensure we have at least empty structure if no data
  if (chartData.labels.length === 0) {
    chartData.labels = ['No data'];
    chartData.datasets.forEach(dataset => {
      dataset.data = [NaN];
    });
  }
  
  const config = getMultiLineChartConfig('Tracing Progress');

  tracingChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Render merged Memorization chart (Edge + Corner)
 */
export function renderMemorizationChart(sessions: SessionData[]): void {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart render');
    return;
  }

  const canvas = document.getElementById('memorization-chart') as HTMLCanvasElement;
  if (!canvas) {
    console.warn('Memorization chart canvas not found');
    return;
  }

  // Destroy existing chart
  if (memorizationChart) {
    memorizationChart.destroy();
  }

  const chartData = processMemorizationData(sessions);
  
  // Ensure we have at least empty structure if no data
  if (chartData.labels.length === 0) {
    chartData.labels = ['No data'];
    chartData.datasets.forEach(dataset => {
      dataset.data = [NaN];
    });
  }
  
  const config = getMultiLineChartConfig('Memorization Progress');

  memorizationChart = new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: config
  });
}

/**
 * Update all charts with new filters
 */
export async function updateChartsWithFilters(
  timeRange: string,
  sessions: SessionData[], 
  notationSessions: NotationSessionData[]
): Promise<void> {
  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    await loadChartJS();
  }

  let filteredSessions = sessions;
  let filteredNotationSessions = notationSessions;

  // Apply time range filter
  const days = timeRange === 'all' ? 'all' : parseInt(timeRange);
  filteredSessions = filterSessionsByDateRange(filteredSessions, days);
  filteredNotationSessions = filterNotationSessionsByDateRange(filteredNotationSessions, days);

  // Re-render all charts with filtered data
  renderFlashPairsChart(filteredSessions);
  renderNotationChart(filteredNotationSessions);
  renderTracingChart(filteredSessions);
  renderMemorizationChart(filteredSessions);
}

/**
 * Get configuration for multi-line charts with multiple datasets
 */
function getMultiLineChartConfig(title: string): ChartConfig {
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
        display: true
      }
    }
  };
}

/**
 * Destroy all charts (cleanup)
 */
export function destroyAllCharts(): void {
  if (flashPairsChart) {
    flashPairsChart.destroy();
    flashPairsChart = null;
  }
  if (notationChart) {
    notationChart.destroy();
    notationChart = null;
  }
  if (tracingChart) {
    tracingChart.destroy();
    tracingChart = null;
  }
  if (memorizationChart) {
    memorizationChart.destroy();
    memorizationChart = null;
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
