// API service for manufacturing data
const API_BASE_URL = 'https://vercel-deployment-mu-two.vercel.app';

export interface BatchData {
  FORMULA_ID: string;
  SCRAP_FACTOR: number;
  ROUTING_ID: string;
  WIP_BATCH_ID: string;
  WIP_BATCH_NO: string;
  WIP_ACT_START_DATE: string;
  WIP_CMPLT_DATE: string;
  BATCH_CLOSE_DATE: string;
  LINE_NO: number;
  WIP_TYPE: string;
  TRANSACTION_TYPE_NAME: string;
  INVENTORY_ITEM_ID: string;
  TRANSACTION_UOM: string;
  PLAN_QTY: number;
  ORIGINAL_QTY: number;
  WIP_QTY: number;
  WIP_PERIOD_NAME: string;
  WIP_RATE: number;
  WIP_VALUE: number;
  WIP_BATCH_STATUS: string;
  WIP_LOT_NUMBER: string;
  REASON: string;
  RESOURC: string;
}

export interface ProcessedBatchData extends BatchData {
  processing_days: number;
  is_delayed: boolean;
  yield_efficiency: number;
  month: string;
}

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getBatchData(): Promise<BatchData[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/batch-details`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching batch data:', error);
      // Return mock data as fallback
      return this.getMockBatchData();
    }
  }

  async getProcessedBatchData(): Promise<ProcessedBatchData[]> {
    const batchData = await this.getBatchData();
    return this.processBatchData(batchData);
  }

  private processBatchData(data: BatchData[]): ProcessedBatchData[] {
    return data.map(batch => {
      const startDate = new Date(batch.WIP_ACT_START_DATE);
      const completeDate = new Date(batch.WIP_CMPLT_DATE);
      const processing_days = Math.ceil((completeDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const is_delayed = processing_days > 2;
      const yield_efficiency = batch.PLAN_QTY > 0 ? batch.WIP_QTY / batch.PLAN_QTY : 0;
      const month = startDate.toISOString().substring(0, 7); // YYYY-MM format

      return {
        ...batch,
        processing_days,
        is_delayed,
        yield_efficiency,
        month
      };
    });
  }

  // Analytics methods
  async getDelayAnalytics() {
    const data = await this.getProcessedBatchData();
    
    const totalBatches = data.length;
    const delayedBatches = data.filter(b => b.is_delayed).length;
    const onTimeBatches = totalBatches - delayedBatches;
    const delayRate = totalBatches > 0 ? (delayedBatches / totalBatches) * 100 : 0;

    return {
      totalBatches,
      delayedBatches,
      onTimeBatches,
      delayRate,
      avgProcessingDays: data.reduce((sum, b) => sum + b.processing_days, 0) / totalBatches
    };
  }

  async getScrapAnalytics() {
    const data = await this.getProcessedBatchData();
    
    const avgScrapFactor = data.reduce((sum, b) => sum + b.SCRAP_FACTOR, 0) / data.length;
    const scrapByLine = this.groupBy(data, 'LINE_NO').map(([line, batches]) => ({
      line: parseInt(line),
      avgScrap: batches.reduce((sum, b) => sum + b.SCRAP_FACTOR, 0) / batches.length,
      batchCount: batches.length
    }));

    return {
      avgScrapFactor,
      scrapByLine: scrapByLine.sort((a, b) => a.line - b.line)
    };
  }

  async getYieldAnalytics() {
    const data = await this.getProcessedBatchData();
    
    const validYields = data.filter(b => b.yield_efficiency > 0 && b.yield_efficiency < 10); // Filter outliers
    const avgYield = validYields.reduce((sum, b) => sum + b.yield_efficiency, 0) / validYields.length;
    
    return {
      avgYield,
      yieldDistribution: this.getYieldDistribution(validYields),
      totalPlanned: data.reduce((sum, b) => sum + b.PLAN_QTY, 0),
      totalActual: data.reduce((sum, b) => sum + b.WIP_QTY, 0)
    };
  }

  async getMonthlyTrends() {
    const data = await this.getProcessedBatchData();
    
    const monthlyData = this.groupBy(data, 'month').map(([month, batches]) => {
      const delayed = batches.filter(b => b.is_delayed).length;
      const total = batches.length;
      
      return {
        month,
        delayRate: total > 0 ? (delayed / total) * 100 : 0,
        avgProcessingDays: batches.reduce((sum, b) => sum + b.processing_days, 0) / total,
        avgScrapFactor: batches.reduce((sum, b) => sum + b.SCRAP_FACTOR, 0) / total,
        totalBatches: total
      };
    });

    return monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  }

  async getDelayReasons() {
    const data = await this.getProcessedBatchData();
    const delayedBatches = data.filter(b => b.is_delayed && b.REASON);
    
    const reasonCounts = delayedBatches.reduce((acc, batch) => {
      acc[batch.REASON] = (acc[batch.REASON] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private groupBy<T>(array: T[], key: keyof T): [string, T[]][] {
    const grouped = array.reduce((acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, T[]>);

    return Object.entries(grouped);
  }

  private getYieldDistribution(data: ProcessedBatchData[]) {
    const bins = [0, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 5.0];
    const distribution = bins.slice(0, -1).map((bin, i) => ({
      range: `${bin}-${bins[i + 1]}`,
      count: data.filter(b => b.yield_efficiency >= bin && b.yield_efficiency < bins[i + 1]).length
    }));

    return distribution;
  }

  // Mock data fallback
  private getMockBatchData(): BatchData[] {
    return [
      {
        FORMULA_ID: "F001",
        SCRAP_FACTOR: 0.025,
        ROUTING_ID: "R001",
        WIP_BATCH_ID: "B001",
        WIP_BATCH_NO: "BN001",
        WIP_ACT_START_DATE: "2024-01-15T08:00:00Z",
        WIP_CMPLT_DATE: "2024-01-17T16:00:00Z",
        BATCH_CLOSE_DATE: "2024-01-17T18:00:00Z",
        LINE_NO: 1,
        WIP_TYPE: "Production",
        TRANSACTION_TYPE_NAME: "Manufacturing",
        INVENTORY_ITEM_ID: "I001",
        TRANSACTION_UOM: "KG",
        PLAN_QTY: 1000,
        ORIGINAL_QTY: 1000,
        WIP_QTY: 950,
        WIP_PERIOD_NAME: "2024-01",
        WIP_RATE: 25.5,
        WIP_VALUE: 24225,
        WIP_BATCH_STATUS: "Completed",
        WIP_LOT_NUMBER: "L001",
        REASON: "Normal Production",
        RESOURC: "Machine_A"
      }
      // Add more mock data as needed
    ];
  }
}

export const apiService = new ApiService();
