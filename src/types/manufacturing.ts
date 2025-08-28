export interface ProcessingDaysData {
  days: number;
  count: number;
}

export interface DelayShareData {
  category: string;
  value: number;
  percentage: number;
}

export interface MonthlyDelayData {
  month: string;
  averageDelay: number;
}

export interface LineDelayData {
  line: string;
  averageDelay: number;
  month?: string;
}

export interface DelayedBatchesData {
  line: string;
  delayedBatches: number;
  totalBatches: number;
}

export interface TopDelayFormulasData {
  formula: string;
  delayCount: number;
  cumulativePercentage: number;
}

export interface ScrapFactorData {
  line: string;
  scrapFactor: number;
  severity: number;
}

export interface DelayReasonData {
  reason: string;
  count: number;
  line?: string;
}

export interface KPIData {
  totalBatches: number;
  delayedPercentage: number;
  averageDelay: number;
  scrapFactor: number;
}

export interface FilterOptions {
  lines: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  delayThreshold: number;
}