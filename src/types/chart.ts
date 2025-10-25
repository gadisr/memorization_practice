/**
 * Chart-related type definitions for progress visualization
 */

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string | string[];
  backgroundColor?: string | string[];
  fill?: boolean;
  tension?: number;
  borderWidth?: number;
}

export interface ProcessedSessionData {
  date: string;
  accuracy: number;
  speed: number;
  quality: number;
  drillType: string;
}

export interface DrillTypeStats {
  drillType: string;
  averageAccuracy: number;
  averageSpeed: number;
  sessionCount: number;
}

export interface TimeRangeFilter {
  days: number | 'all';
  label: string;
}

export interface DrillFilter {
  value: string;
  label: string;
}

export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      mode: 'index' | 'point' | 'nearest' | 'single' | 'label' | 'x-axis' | 'dataset';
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      min?: number;
      max?: number;
    };
  };
}
