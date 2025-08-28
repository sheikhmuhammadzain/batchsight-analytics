import {
  ProcessingDaysData,
  DelayShareData,
  MonthlyDelayData,
  LineDelayData,
  DelayedBatchesData,
  TopDelayFormulasData,
  ScrapFactorData,
  DelayReasonData,
  KPIData
} from '../types/manufacturing';

export const processingDaysData: ProcessingDaysData[] = [
  { days: 1, count: 45 },
  { days: 2, count: 78 },
  { days: 3, count: 123 },
  { days: 4, count: 89 },
  { days: 5, count: 67 },
  { days: 6, count: 34 },
  { days: 7, count: 23 },
  { days: 8, count: 12 },
  { days: 9, count: 8 },
  { days: 10, count: 5 }
];

export const delayShareData: DelayShareData[] = [
  { category: 'On Time', value: 1847, percentage: 73.2 },
  { category: 'Delayed', value: 678, percentage: 26.8 }
];

export const monthlyDelayData: MonthlyDelayData[] = [
  { month: 'Jan', averageDelay: 4.2 },
  { month: 'Feb', averageDelay: 3.8 },
  { month: 'Mar', averageDelay: 5.1 },
  { month: 'Apr', averageDelay: 4.7 },
  { month: 'May', averageDelay: 6.2 },
  { month: 'Jun', averageDelay: 5.8 },
  { month: 'Jul', averageDelay: 7.1 },
  { month: 'Aug', averageDelay: 6.9 },
  { month: 'Sep', averageDelay: 5.4 },
  { month: 'Oct', averageDelay: 4.9 },
  { month: 'Nov', averageDelay: 5.2 },
  { month: 'Dec', averageDelay: 4.6 }
];

export const lineDelayData: LineDelayData[] = [
  { line: 'Line A', averageDelay: 5.2 },
  { line: 'Line B', averageDelay: 4.8 },
  { line: 'Line C', averageDelay: 6.1 },
  { line: 'Line D', averageDelay: 3.9 },
  { line: 'Line E', averageDelay: 7.3 }
];

export const lineMonthlyDelayData = [
  { month: 'Jan', 'Line A': 4.2, 'Line B': 3.8, 'Line C': 5.1, 'Line D': 3.2, 'Line E': 6.8 },
  { month: 'Feb', 'Line A': 3.9, 'Line B': 4.1, 'Line C': 4.8, 'Line D': 3.5, 'Line E': 6.2 },
  { month: 'Mar', 'Line A': 5.1, 'Line B': 4.9, 'Line C': 6.2, 'Line D': 4.1, 'Line E': 7.8 },
  { month: 'Apr', 'Line A': 4.7, 'Line B': 4.5, 'Line C': 5.9, 'Line D': 3.8, 'Line E': 7.1 },
  { month: 'May', 'Line A': 6.2, 'Line B': 5.8, 'Line C': 7.1, 'Line D': 4.9, 'Line E': 8.4 },
  { month: 'Jun', 'Line A': 5.8, 'Line B': 5.2, 'Line C': 6.8, 'Line D': 4.6, 'Line E': 8.1 }
];

export const delayedBatchesData: DelayedBatchesData[] = [
  { line: 'Line A', delayedBatches: 142, totalBatches: 456 },
  { line: 'Line B', delayedBatches: 98, totalBatches: 398 },
  { line: 'Line C', delayedBatches: 187, totalBatches: 512 },
  { line: 'Line D', delayedBatches: 67, totalBatches: 324 },
  { line: 'Line E', delayedBatches: 203, totalBatches: 478 }
];

export const topDelayFormulasData: TopDelayFormulasData[] = [
  { formula: 'FML-A201', delayCount: 45, cumulativePercentage: 22.5 },
  { formula: 'FML-B189', delayCount: 38, cumulativePercentage: 41.5 },
  { formula: 'FML-C156', delayCount: 32, cumulativePercentage: 57.5 },
  { formula: 'FML-D143', delayCount: 28, cumulativePercentage: 71.5 },
  { formula: 'FML-E127', delayCount: 24, cumulativePercentage: 83.5 },
  { formula: 'FML-F112', delayCount: 18, cumulativePercentage: 92.5 },
  { formula: 'FML-G98', delayCount: 15, cumulativePercentage: 100 }
];

export const scrapFactorData: ScrapFactorData[] = [
  { line: 'Line A', scrapFactor: 2.3, severity: 23 },
  { line: 'Line B', scrapFactor: 1.8, severity: 18 },
  { line: 'Line C', scrapFactor: 3.7, severity: 37 },
  { line: 'Line D', scrapFactor: 1.2, severity: 12 },
  { line: 'Line E', scrapFactor: 4.1, severity: 41 }
];

export const monthlyDelayRateData = [
  { month: 'Jan', delayRate: 24.2 },
  { month: 'Feb', delayRate: 22.8 },
  { month: 'Mar', delayRate: 28.1 },
  { month: 'Apr', delayRate: 26.7 },
  { month: 'May', delayRate: 31.2 },
  { month: 'Jun', delayRate: 29.8 },
  { month: 'Jul', delayRate: 33.1 },
  { month: 'Aug', delayRate: 32.9 },
  { month: 'Sep', delayRate: 28.4 },
  { month: 'Oct', delayRate: 26.9 },
  { month: 'Nov', delayRate: 27.2 },
  { month: 'Dec', delayRate: 25.6 }
];

export const delayReasonsByLineData = [
  { reason: 'Equipment Failure', 'Line A': 15, 'Line B': 12, 'Line C': 22, 'Line D': 8, 'Line E': 18 },
  { reason: 'Material Shortage', 'Line A': 8, 'Line B': 6, 'Line C': 12, 'Line D': 4, 'Line E': 14 },
  { reason: 'Quality Issues', 'Line A': 12, 'Line B': 9, 'Line C': 16, 'Line D': 7, 'Line E': 11 },
  { reason: 'Maintenance', 'Line A': 6, 'Line B': 8, 'Line C': 9, 'Line D': 5, 'Line E': 7 },
  { reason: 'Staff Shortage', 'Line A': 4, 'Line B': 3, 'Line C': 7, 'Line D': 2, 'Line E': 9 }
];

export const delayReasonsTop10Data: DelayReasonData[] = [
  { reason: 'Equipment Failure', count: 75 },
  { reason: 'Material Shortage', count: 44 },
  { reason: 'Quality Control Issues', count: 55 },
  { reason: 'Maintenance Downtime', count: 35 },
  { reason: 'Staff Shortage', count: 25 },
  { reason: 'Power Outage', count: 18 },
  { reason: 'Supply Chain Delay', count: 22 },
  { reason: 'Temperature Control', count: 16 },
  { reason: 'Calibration Issues', count: 14 },
  { reason: 'Raw Material Quality', count: 12 }
];

export const kpiData: KPIData = {
  totalBatches: 2525,
  delayedPercentage: 26.8,
  averageDelay: 5.2,
  scrapFactor: 2.6
};

export const manufacturingLines = [
  'Line A',
  'Line B', 
  'Line C',
  'Line D',
  'Line E'
];