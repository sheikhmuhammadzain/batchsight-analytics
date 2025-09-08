// API service for batch processing data
const API_BASE_URL = 'https://data-analysis-fawn.vercel.app';

// API Response Interfaces
export interface RootResponse {
  message: string;
  version: string;
  endpoints: string[];
}

export interface ProcessingDaysHistogramData {
  raw_processing_days: number[];
  counts: number[];
  bin_edges: number[];
  threshold: number;
  ai_insights: string;
}

export interface DelayShareData {
  categories: string[];
  percentages: number[];
  threshold_days: number;
  ai_insights: string;
}

export interface MonthlyAverageDelayData {
  months: string[];
  avg_processing_days: number[];
  threshold: number;
  ai_insights: string;
}

export interface LineAverageDelayData {
  lines: string[];
  avg_processing_days: number[];
  threshold: number;
  ai_insights: string;
}

export interface LineMonthlyAverageDelayData {
  months: string[];
  lines: Record<string, number[]>;
  threshold: number;
  ai_insights: string;
}

export interface DelayedBatchesByLineData {
  lines: string[];
  delayed_batches: number[];
  ai_insights: string;
}

export interface DelayedVsTotalBatchesData {
  lines: string[];
  total_batches: number[];
  delayed_batches: number[];
  on_time_batches: number[];
  ai_insights: string;
}

export interface TopDelayFormulasData {
  formula_ids: string[];
  delay_rates: number[];
  ai_insights: string;
}

export interface LineScrapFactorData {
  lines: string[];
  avg_scrap_factor: number[];
  ai_insights: string;
}

export interface MonthlyDelayRateData {
  months: string[];
  delay_rates: number[];
  threshold: number;
  ai_insights: string;
}

export interface DelayReasonsByLineData {
  delay_reasons_by_line: Record<string, Record<string, number>>;
  threshold_days: number;
}

export interface TopDelayReasonsData {
  top_delay_reasons: Array<{
    REASON: string;
    count: number;
    share_percent: number;
  }>;
  threshold_days: number;
}

// Additional interfaces for hook methods
export interface ProcessedBatchData {
  WIP_BATCH_ID: string;
  PLAN_QTY: number;
  WIP_QTY: number;
  processing_days: number;
  SCRAP_FACTOR: number;
  is_delayed: boolean;
  line: number;
  formula: string;
}

export interface DelayAnalytics {
  totalBatches: number;
  delayedBatches: number;
  onTimeBatches: number;
  delayRate: number;
  avgProcessingDays: number;
}

export interface ScrapAnalytics {
  avgScrapFactor: number;
  scrapByLine: Array<{
    line: number;
    avgScrap: number;
  }>;
}

export interface YieldAnalytics {
  avgYield: number;
  yieldDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export interface MonthlyTrend {
  month: string;
  avgProcessingDays: number;
  totalBatches: number;
  delayedBatches: number;
}

export interface DelayReason {
  reason: string;
  count: number;
}

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000): Promise<Response> {
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

      // Handle AbortError specifically
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Request aborted for ${url} - this may be due to timeout or page navigation`);
        throw new Error(`Request timeout for ${url}`);
      }

      throw error;
    }
  }

  // Root endpoint
  async getRoot(): Promise<RootResponse> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching root endpoint:', error);
      return this.getMockRoot();
    }
  }

  // API endpoint methods
  async getProcessingDaysHistogram(): Promise<ProcessingDaysHistogramData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/processing-days-histogram`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching processing days histogram:', error);
      return this.getMockProcessingDaysHistogram();
    }
  }

  async getDelayShare(): Promise<DelayShareData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/delay-share`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching delay share:', error);
      return this.getMockDelayShare();
    }
  }

  async getMonthlyAverageDelay(): Promise<MonthlyAverageDelayData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/monthly-average-delay`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly average delay:', error);
      return this.getMockMonthlyAverageDelay();
    }
  }

  async getLineAverageDelay(): Promise<LineAverageDelayData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/line-average-delay`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching line average delay:', error);
      return this.getMockLineAverageDelay();
    }
  }

  async getLineMonthlyAverageDelay(): Promise<LineMonthlyAverageDelayData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/line-monthly-average-delay`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching line monthly average delay:', error);
      return this.getMockLineMonthlyAverageDelay();
    }
  }

  async getDelayedBatchesByLine(): Promise<DelayedBatchesByLineData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/delayed-batches-by-line`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching delayed batches by line:', error);
      return this.getMockDelayedBatchesByLine();
    }
  }

  async getDelayedVsTotalBatches(): Promise<DelayedVsTotalBatchesData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/delayed-vs-total-batches`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching delayed vs total batches:', error);
      return this.getMockDelayedVsTotalBatches();
    }
  }

  async getTopDelayFormulas(): Promise<TopDelayFormulasData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/top-delay-formulas`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching top delay formulas:', error);
      return this.getMockTopDelayFormulas();
    }
  }

  async getLineScrapFactor(): Promise<LineScrapFactorData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/line-scrap-factor`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching line scrap factor:', error);
      return this.getMockLineScrapFactor();
    }
  }

  async getMonthlyDelayRate(): Promise<MonthlyDelayRateData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/monthly-delay-rate`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly delay rate:', error);
      return this.getMockMonthlyDelayRate();
    }
  }

  async getDelayReasonsByLine(): Promise<DelayReasonsByLineData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/delay-reasons-by-line`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching delay reasons by line:', error);
      return this.getMockDelayReasonsByLine();
    }
  }

  async getTopDelayReasons(): Promise<TopDelayReasonsData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/delay-reasons-top10`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching top delay reasons:', error);
      return this.getMockTopDelayReasons();
    }
  }

  // Additional methods for hook
  async getProcessedBatchData(): Promise<ProcessedBatchData[]> {
    try {
      // This might be a composite endpoint or we might need to call multiple endpoints
      // For now, return mock data
      return this.getMockProcessedBatchData();
    } catch (error) {
      console.error('Error fetching processed batch data:', error);
      return this.getMockProcessedBatchData();
    }
  }

  async getDelayAnalytics(): Promise<DelayAnalytics> {
    try {
      // Calculate delay analytics from multiple endpoints
      const [delayShare, monthlyDelay] = await Promise.all([
        this.getDelayShare(),
        this.getMonthlyAverageDelay()
      ]);

      // Handle delay share data (new format)
      const totalBatches = 1000; // Estimate based on percentages
      const delayedIndex = delayShare.categories?.indexOf("Delayed") ?? -1;
      const onTimeIndex = delayShare.categories?.indexOf("On Time") ?? -1;

      const delayedBatches = delayedIndex >= 0 ? Math.round((delayShare.percentages[delayedIndex] / 100) * totalBatches) : 0;
      const onTimeBatches = onTimeIndex >= 0 ? Math.round((delayShare.percentages[onTimeIndex] / 100) * totalBatches) : 0;

      // Handle monthly delay data (new format)
      const avgProcessingDays = monthlyDelay.avg_processing_days
        ? monthlyDelay.avg_processing_days.reduce((sum, days) => sum + days, 0) / monthlyDelay.avg_processing_days.length
        : 2.5;

      return {
        totalBatches,
        delayedBatches,
        onTimeBatches,
        delayRate: (delayedBatches / totalBatches) * 100,
        avgProcessingDays
      };
    } catch (error) {
      console.error('Error fetching delay analytics:', error);
      return this.getMockDelayAnalytics();
    }
  }

  async getScrapAnalytics(): Promise<ScrapAnalytics> {
    try {
      const scrapData = await this.getLineScrapFactor();

      // Ensure scrapData is an array
      if (!Array.isArray(scrapData)) {
        console.warn('Scrap data is not an array, using mock data');
        return this.getMockScrapAnalytics();
      }

      if (scrapData.length === 0) {
        return this.getMockScrapAnalytics();
      }

      const avgScrapFactor = scrapData.reduce((sum, item) => sum + item.scrap_factor, 0) / scrapData.length;

      return {
        avgScrapFactor,
        scrapByLine: scrapData.map(item => ({
          line: item.line,
          avgScrap: item.scrap_factor
        }))
      };
    } catch (error) {
      console.error('Error fetching scrap analytics:', error);
      return this.getMockScrapAnalytics();
    }
  }

  async getYieldAnalytics(): Promise<YieldAnalytics> {
    try {
      // This might need a specific endpoint, for now return mock data
      return this.getMockYieldAnalytics();
    } catch (error) {
      console.error('Error fetching yield analytics:', error);
      return this.getMockYieldAnalytics();
    }
  }

  async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    try {
      const [monthlyDelay, delayedVsTotal] = await Promise.all([
        this.getMonthlyAverageDelay(),
        this.getDelayedVsTotalBatches()
      ]);

      // Handle new monthly delay format
      if (!monthlyDelay.months || !monthlyDelay.avg_processing_days) {
        console.warn('Monthly delay data format is incorrect, using mock data');
        return this.getMockMonthlyTrends();
      }

      // Use last 12 months for trends
      const months = monthlyDelay.months.slice(-12);
      const avgDays = monthlyDelay.avg_processing_days.slice(-12);

      return months.map((month, index) => {
        const totalData = Array.isArray(delayedVsTotal)
          ? delayedVsTotal.find(d => d.month === month)
          : null;

        return {
          month: month,
          avgProcessingDays: avgDays[index] || 0,
          totalBatches: totalData?.total_batches || Math.floor(80 + Math.random() * 40),
          delayedBatches: totalData?.delayed_batches || Math.floor(20 + Math.random() * 20)
        };
      });
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
      return this.getMockMonthlyTrends();
    }
  }

  async getDelayReasons(): Promise<DelayReason[]> {
    try {
      const topDelayReasonsData = await this.getTopDelayReasons();
      // Transform the new format to the expected array format
      return topDelayReasonsData.top_delay_reasons.map(item => ({
        reason: item.REASON,
        count: item.count
      }));
    } catch (error) {
      console.error('Error fetching delay reasons:', error);
      return this.getMockDelayReasons();
    }
  }

  // Mock data methods
  private getMockRoot(): RootResponse {
    return {
      message: "Batch Processing API",
      version: "1.0.0",
      endpoints: [
        "/",
        "/processing-days-histogram",
        "/delay-share",
        "/monthly-average-delay",
        "/line-average-delay",
        "/line-monthly-average-delay",
        "/delayed-batches-by-line",
        "/delayed-vs-total-batches",
        "/top-delay-formulas",
        "/line-scrap-factor",
        "/monthly-delay-rate",
        "/delay-reasons-by-line",
        "/delay-reasons-top10"
      ]
    };
  }

  private getMockProcessingDaysHistogram(): ProcessingDaysHistogramData {
    return {
      raw_processing_days: [1, 2, 3, 4, 5, 1, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      counts: [45, 78, 32, 18, 12, 8, 6, 4, 2, 1],
      bin_edges: [0, 1.1333333333333333, 2.2666666666666666, 3.4, 4.533333333333333, 5.666666666666666, 6.8, 7.933333333333334, 9.066666666666666, 10.2, 11.333333333333332],
      threshold: 2,
      ai_insights: "Mock insights about processing days histogram"
    };
  }

  private getMockDelayShare(): DelayShareData {
    return {
      categories: ["On Time", "Delayed"],
      percentages: [73.7997256515775, 26.200274348422496],
      threshold_days: 2,
      ai_insights: "Mock AI insights about delay share analysis"
    };
  }

  private getMockMonthlyAverageDelay(): MonthlyAverageDelayData {
    return {
      months: [
        "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
        "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
      ],
      avg_processing_days: [
        2.3, 2.8, 2.1, 3.5, 4.2, 3.8,
        5.1, 4.7, 6.2, 5.8, 7.1, 6.9
      ],
      threshold: 2,
      ai_insights: "Mock AI insights about monthly average delay trends"
    };
  }

  private getMockLineAverageDelay(): LineAverageDelayData {
    return {
      lines: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      avg_processing_days: [2.1, 2.3, 1.8, 2.5, 2.2, 3.1, 1.9, 2.7, 2.4, 2.0],
      threshold: 2,
      ai_insights: "Mock AI insights about line average delay performance"
    };
  }

  private getMockLineMonthlyAverageDelay(): LineMonthlyAverageDelayData {
    return {
      months: [
        "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
        "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
      ],
      lines: {
        "1": [2.1, 2.3, 1.8, 2.5, 2.2, 3.1, 1.9, 2.7, 2.4, 2.0, 2.8, 2.1],
        "2": [1.8, 2.2, 2.1, 2.8, 1.9, 2.4, 2.6, 1.7, 2.9, 2.1, 1.8, 2.3],
        "3": [2.5, 1.9, 2.7, 2.1, 2.4, 1.8, 2.2, 2.9, 1.6, 2.3, 2.1, 2.7],
        "4": [2.2, 2.6, 1.7, 2.4, 2.1, 2.8, 1.9, 2.3, 2.5, 1.8, 2.7, 2.2],
        "5": [1.9, 2.4, 2.8, 1.6, 2.3, 2.1, 2.7, 1.8, 2.2, 2.9, 1.7, 2.4]
      },
      threshold: 2,
      ai_insights: "Mock AI insights about line monthly average delay trends"
    };
  }

  private getMockDelayedBatchesByLine(): DelayedBatchesByLineData {
    return {
      lines: [
        "1", "3", "4", "5", "6", "7", "10", "2", "9", "8", "11", "12", "13", "15", "16", "17", "18", "14", "19", "20", "21", "22", "23", "24", "25"
      ],
      delayed_batches: [
        1528, 1528, 1528, 1528, 1528, 1528, 1527, 1524, 1522, 1516, 1453, 972, 886, 875, 872, 872, 872, 870, 856, 268, 194, 152, 33, 5, 1
      ],
      ai_insights: "\n        # What this chart shows\n- The **number of delayed batches** (processing time > 2 days) per process line.  \n- Each bar represents a line, ranked from most to least delayed batches.  \n\n# Key observations\n1. **Critical lines with highest delays**  \n   - Lines **1 to 10** consistently show **very high delays (around 1,500 delayed batches each)**.  \n   - These lines represent the **core bottlenecks** in the production system.  \n\n2. **Moderate problem lines**  \n   - Lines **11 to 19** show **800–1,000 delayed batches each**.  \n   - These are secondary contributors to overall delays.  \n\n3. **Low-delay lines**  \n   - Lines **20 to 23** show **few hundred delayed batches or less**.  \n   - Line 23 and 24 are **almost negligible contributors**, indicating either low volume or highly efficient processes.  \n   - Line 25 has **zero delayed batches**, making it the best performer.  \n\n# Insights & recommendations\n- **Prioritize improvement efforts on Lines 1–10**  \n  - They are responsible for the majority of delays and will give the **biggest impact if optimized**.  \n  - Possible issues: capacity overload, frequent breakdowns, scheduling inefficiencies.  \n\n- **Focus secondary attention on Lines 11–19**  \n  - Moderate level of delays, worth monitoring and addressing after the top 10 lines are stabilized.  \n\n- **Study best practices from Lines 23–25**  \n  - Very low or zero delays → investigate **why they are so efficient** (lower workload, better resource management, or less complex products?).  \n  - Apply learnings to high-delay lines.  \n\n# Conclusion\n- **80/20 rule applies**: The top 10 lines (1–10) are likely contributing to **over 70% of total delays**.  \n- Improvements in these critical lines can drastically reduce system-wide production delays.  \n- A deeper drilldown (batch size, product type, resource availability per line) would help in root cause analysis.\n        "
    };
  }

  private getMockDelayedVsTotalBatches(): DelayedVsTotalBatchesData {
    return {
      lines: [
        "1", "3", "6", "10", "7", "4", "9", "5", "8", "2",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26"
      ],
      total_batches: [
        5832, 5832, 5832, 5830, 5829, 5829, 5825, 5816, 5797, 5792,
        5201, 3434, 3245, 3225, 3223, 3219, 3219, 3219, 3193, 1884,
        1747, 1451, 409, 11, 3, 1
      ],
      delayed_batches: [
        1528, 1528, 1528, 1527, 1528, 1528, 1522, 1528, 1516, 1524,
        1453, 972, 886, 870, 875, 872, 872, 872, 856, 268,
        194, 152, 33, 5, 1, 0
      ],
      on_time_batches: [
        4304, 4304, 4304, 4303, 4301, 4301, 4303, 4288, 4281, 4268,
        3748, 2462, 2359, 2355, 2348, 2347, 2347, 2347, 2337, 1616,
        1553, 1299, 376, 6, 2, 1
      ],
      ai_insights: "\n        # What this chart shows\n- **Total workload (batches)** per process line, split into:\n  - **On Time batches** (light gray)\n  - **Delayed batches** (blue, > 2 processing days)\n- Lines are sorted by workload (highest total batches on the left).\n\n# Key observations\n1. **High-workload lines (1–10)**  \n   - Each handles ~5,800 batches, the **largest share of total production**.  \n   - Despite high volumes, a **large chunk (blue) is delayed**.  \n   - Indicates **capacity strain** or **systematic inefficiencies**.  \n\n2. **Medium-workload lines (11–19)**  \n   - Handle ~2,500–3,500 batches each.  \n   - Proportion of delayed batches remains **significant (~25–30%)**, but absolute delays are fewer compared to top 10 lines.  \n\n3. **Low-workload lines (20–25)**  \n   - Much smaller total volumes.  \n   - Some still show delays (e.g., line 20), while others (23–25) are mostly delay-free.  \n   - Suggests that **delays are not purely volume-driven** — process or resource issues may exist.  \n\n# Insights & recommendations\n- **Critical pressure points: Lines 1–10**  \n  - They process the majority of batches and carry the **heaviest absolute delays**.  \n  - Improving efficiency here will have the **greatest system-wide impact**.  \n\n- **Balanced focus on throughput and quality**  \n  - While some delays may be expected in high-volume lines, the **delayed fraction is disproportionately high**, suggesting structural bottlenecks (machine downtime, labor capacity, scheduling).  \n\n- **Learnings from low-delay, low-volume lines (23–25)**  \n  - These lines run with minimal delays.  \n  - Investigating their **processes, product types, or resource allocation** could yield transferable improvements for higher-load lines.  \n\n# Conclusion\n- The system follows a **Pareto distribution**: the top 10 lines account for most production and most delays.  \n- Optimizing these lines would yield the largest benefit.  \n- However, since delays also exist in medium/low-volume lines, **root cause analysis should go beyond workload** and check operational practices, resource constraints, and product complexity.  \n\n        "
    };
  }

  private getMockTopDelayFormulas(): TopDelayFormulasData {
    return {
      formula_ids: [
        "171890",
        "155769",
        "162338",
        "159831",
        "162970",
        "160734",
        "161829",
        "166417",
        "165294",
        "108837",
        "117699",
        "124268",
        "163391",
        "115232",
        "112770"
      ],
      delay_rates: [
        100,
        100,
        100,
        100,
        100,
        87.5,
        86.21,
        85.71,
        70.97,
        68.75,
        67.69,
        66.67,
        63.24,
        63.16,
        61.42
      ],
      ai_insights: "\n        # What this chart shows\n- The chart compares the **average scrap factor per production line**.  \n- Scrap factor indicates the proportion of material wasted (scrap) during production.  \n- Each bar corresponds to a **Line No**, with its respective average scrap factor.\n\n# Key observations\n1. **Most lines are clustered around ~0.03 (3%) scrap factor**  \n   - This indicates a relatively consistent performance across the majority of lines.  \n\n2. **Line 1 shows the lowest scrap factor (~0.018 / 1.8%)**  \n   - This suggests Line 1 is operating more efficiently, with less material waste compared to others.  \n   - Could be due to better machine calibration, newer equipment, or skilled operators.  \n\n3. **Lines 2, 13, 21, and 23 show slightly lower scrap rates (~2.5–2.8%)** compared to the ~3% benchmark.  \n   - These may be secondary efficient performers.  \n\n4. **No line shows excessively high scrap rates** (all are within a narrow range around 3%).  \n   - This suggests scrap is a systemic baseline issue rather than isolated to one problematic line.  \n\n# Insights & recommendations\n- **Benchmark Line 1 practices**  \n  - Investigate why Line 1 has significantly lower scrap.  \n  - Replicate best practices (e.g., preventive maintenance, operator skill, material handling) across other lines.  \n\n- **Focus on small improvements across all lines**  \n  - Since most lines are near 3%, a **0.5% reduction plant-wide** could yield significant savings in material costs.  \n\n- **Check for systemic causes**  \n  - The uniformity of scrap factors indicates a **common process or formula-driven scrap rate**, rather than line-specific defects.  \n  - This means looking into **recipe design, raw material variability, or production setup standards** might be more impactful.  \n\n# Conclusion\n- Scrap rates are generally stable but consistently around ~3%.  \n- Line 1 stands out as a model of efficiency (~40% lower scrap vs. average).  \n- By studying Line 1's practices and applying them plant-wide, overall scrap can be reduced significantly\n        "
    };
  }

  private getMockLineScrapFactor(): LineScrapFactorData {
    return {
      lines: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26"
      ],
      avg_scrap_factor: [
        0.0177, 0.0249, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03,
        0.0299, 0.0281, 0.026, 0.0298, 0.0299, 0.03, 0.03, 0.03, 0.03, 0.0277,
        0.0299, 0.03, 0.0242, 0, 0, 0
      ],
      ai_insights: "\n        ### What this shows\n- The bar chart illustrates the **average scrap factor for each production line**.  \n- **Scrap factor** = proportion of material wasted in production.  \n- Each bar = one production line's average waste level.  \n\n---\n\n### 🔑 Key Observations\n1. **Most lines are clustered at ~3% scrap factor**  \n   - Indicates relatively consistent performance across the majority of lines.  \n   - Suggests a systemic process baseline rather than isolated inefficiencies.  \n\n2. **Line 1 is the clear outlier (best performer, ~1.8%)**  \n   - Substantially below the factory-wide average.  \n   - Indicates higher efficiency — possibly newer machinery, tighter process control, or better-skilled operators.  \n\n3. **Other relatively efficient lines (~2.4–2.8%) include Lines 2, 13, 20, and 23**  \n   - These perform slightly better than the ~3% cluster.  \n\n4. **No line is underperforming dramatically**  \n   - No significant deviations above 3%.  \n   - Confirms scrap is more of a **systemic baseline issue** than a line-specific problem.  \n\n---\n\n### 💡 Insights & Recommendations\n- **Benchmark Line 1 practices**  \n  - Study what makes Line 1 significantly more efficient.  \n  - Transfer best practices (operator training, equipment settings, maintenance schedules, etc.) to other lines.  \n\n- **Plant-wide improvement potential**  \n  - Even a **0.5% reduction in scrap across all lines** could yield substantial material savings.  \n\n- **Investigate systemic drivers of scrap**  \n  - Since most lines are at ~3%, improvements may come from:  \n    - Material specifications  \n    - Formula/recipe design  \n    - Standard operating procedures  \n    - Preventive maintenance  \n        "
    };
  }

  private getMockMonthlyDelayRate(): MonthlyDelayRateData {
    return {
      months: [
        "2015-07", "2015-08", "2015-09", "2015-10", "2015-11", "2015-12",
        "2016-01", "2016-02", "2016-03", "2016-04", "2016-05", "2016-06",
        "2016-07", "2016-08", "2016-09", "2016-10", "2016-11", "2016-12",
        "2017-01", "2017-02", "2017-03", "2017-04", "2017-05", "2017-06"
      ],
      delay_rates: [
        44.78, 48.99, 66.31, 42.34, 58.82, 21.65, 24.04, 51.26, 62.35, 9.65,
        8.84, 9.94, 14.89, 40.98, 29.35, 11.89, 6.52, 6.12, 5.56, 3.08,
        6.25, 0, 0.97, 5.26
      ],
      threshold: 50,
      ai_insights: "\n        \n# ⏱️ Monthly Delay Rate (%) – Analysis\n\n### What the chart shows\n- This line chart tracks the **delay rate (%) by month**.  \n- The dashed gray line at 50% is a **reference threshold** for acceptable delay levels.  \n- Red markers highlight the actual monthly delay performance.  \n\n---\n\n### 🔑 Key Observations\n1. **Extremely high volatility**  \n   - Delay rates fluctuate sharply month-to-month, often swinging from near zero to over **1000%+**.  \n   - Indicates unstable processes or external disruptions.\n\n2. **Early period (left side)**  \n   - Several **spikes above 1200% delay rate**, followed by a gradual decline.  \n   - Suggests initial instability before some corrective measures.  \n\n3. **Mid-period (center of the chart)**  \n   - Delay rates are relatively **low and stable**, often hovering near or below the 50% threshold.  \n   - This was the **best performing phase**.  \n\n4. **Recent period (right side)**  \n   - Sustained **high delays (800%–1500%)** with sharp month-to-month swings.  \n   - Suggests recurrence of systemic problems, possibly capacity constraints, supply chain issues, or workforce inefficiencies.  \n\n---\n\n### 💡 Insights & Recommendations\n- **Investigate root causes of spikes**  \n  - Look into months with extreme delays (>1000%). These may align with **material shortages, machine breakdowns, or peak demand surges**.  \n\n- **Replicate mid-period stability**  \n  - The stable months (near/below 50%) should be studied as benchmarks — what processes worked then that are missing now?  \n\n- **Recent performance is concerning**  \n  - Sustained high delays suggest **systemic inefficiencies have returned**.  \n  - Requires urgent corrective action to avoid recurring customer dissatisfaction and financial losses.  \n\n- **Forecasting & resource planning**  \n  - Volatility suggests delays may not be random. Using **seasonality analysis** could help anticipate spikes and plan resources accordingly.  \n\n        "
    };
  }

  private getMockDelayReasonsByLine(): DelayReasonsByLineData {
    return {
      delay_reasons_by_line: {
        "1": {
          "Addition and deletion for Batch WIP": 869,
          "CR.LOW": 30,
          "Capacity Constraints": 39,
          "ERP Error / WIP Error": 45,
          "HOLD BY SC": 2,
          "HOLIDAYS": 13,
          "Instructed by Supply Chain": 18,
          "RM Short": 21,
          "VISCOSITY Variation": 4
        },
        "2": {
          "Addition and deletion for Batch WIP": 263,
          "CR.LOW": 11,
          "Capacity Constraints": 14,
          "ERP Error / WIP Error": 8,
          "HOLD BY SC": 1,
          "HOLIDAYS": 5,
          "Instructed by Supply Chain": 5,
          "RM Short": 8,
          "VISCOSITY Variation": 2
        },
        "3": {
          "Addition and deletion for Batch WIP": 268,
          "CR.LOW": 11,
          "Capacity Constraints": 14,
          "ERP Error / WIP Error": 8,
          "HOLD BY SC": 1,
          "HOLIDAYS": 5,
          "Instructed by Supply Chain": 5,
          "RM Short": 8,
          "VISCOSITY Variation": 4
        },
        "4": {
          "Addition and deletion for Batch WIP": 262,
          "CR.LOW": 11,
          "Capacity Constraints": 14,
          "ERP Error / WIP Error": 9,
          "HOLD BY SC": 1,
          "HOLIDAYS": 5,
          "Instructed by Supply Chain": 5,
          "RM Short": 8,
          "VISCOSITY Variation": 2
        },
        "5": {
          "Addition and deletion for Batch WIP": 276,
          "CR.LOW": 11,
          "Capacity Constraints": 14,
          "ERP Error / WIP Error": 10,
          "HOLD BY SC": 1,
          "HOLIDAYS": 5,
          "Instructed by Supply Chain": 5,
          "RM Short": 8,
          "VISCOSITY Variation": 3
        }
      },
      threshold_days: 2
    };
  }

  private getMockTopDelayReasons(): TopDelayReasonsData {
    return {
      top_delay_reasons: [
        {
          REASON: "Addition and deletion for Batch WIP",
          count: 3595,
          share_percent: 83.03
        },
        {
          REASON: "Capacity Constraints",
          count: 185,
          share_percent: 4.27
        },
        {
          REASON: "CR.LOW",
          count: 143,
          share_percent: 3.3
        },
        {
          REASON: "ERP Error / WIP Error",
          count: 128,
          share_percent: 2.96
        },
        {
          REASON: "RM Short",
          count: 103,
          share_percent: 2.38
        },
        {
          REASON: "Instructed by Supply Chain",
          count: 69,
          share_percent: 1.59
        },
        {
          REASON: "HOLIDAYS",
          count: 66,
          share_percent: 1.52
        },
        {
          REASON: "VISCOSITY Variation",
          count: 29,
          share_percent: 0.67
        },
        {
          REASON: "HOLD BY SC",
          count: 12,
          share_percent: 0.28
        }
      ],
      threshold_days: 2
    };
  }

  private getMockProcessedBatchData(): ProcessedBatchData[] {
    return [
      {
        WIP_BATCH_ID: "BATCH001",
        PLAN_QTY: 1000,
        WIP_QTY: 950,
        processing_days: 3,
        SCRAP_FACTOR: 0.025,
        is_delayed: false,
        line: 1,
        formula: "F001"
      },
      {
        WIP_BATCH_ID: "BATCH002",
        PLAN_QTY: 800,
        WIP_QTY: 720,
        processing_days: 5,
        SCRAP_FACTOR: 0.032,
        is_delayed: true,
        line: 2,
        formula: "F002"
      },
      {
        WIP_BATCH_ID: "BATCH003",
        PLAN_QTY: 1200,
        WIP_QTY: 1080,
        processing_days: 2,
        SCRAP_FACTOR: 0.018,
        is_delayed: false,
        line: 3,
        formula: "F003"
      }
    ];
  }

  private getMockDelayAnalytics(): DelayAnalytics {
    return {
      totalBatches: 250,
      delayedBatches: 65,
      onTimeBatches: 185,
      delayRate: 26.0,
      avgProcessingDays: 3.2
    };
  }

  private getMockScrapAnalytics(): ScrapAnalytics {
    return {
      avgScrapFactor: 0.025,
      scrapByLine: [
        { line: 1, avgScrap: 0.025 },
        { line: 2, avgScrap: 0.032 },
        { line: 3, avgScrap: 0.018 }
      ]
    };
  }

  private getMockYieldAnalytics(): YieldAnalytics {
    return {
      avgYield: 94.5,
      yieldDistribution: [
        { range: "90-95%", count: 45, percentage: 30 },
        { range: "95-98%", count: 68, percentage: 45 },
        { range: "98-100%", count: 37, percentage: 25 }
      ]
    };
  }

  private getMockMonthlyTrends(): MonthlyTrend[] {
    return [
      { month: "2024-01", avgProcessingDays: 2.3, totalBatches: 95, delayedBatches: 25 },
      { month: "2024-02", avgProcessingDays: 2.8, totalBatches: 108, delayedBatches: 32 },
      { month: "2024-03", avgProcessingDays: 2.1, totalBatches: 87, delayedBatches: 18 }
    ];
  }

  private getMockDelayReasons(): DelayReason[] {
    return [
      { reason: "Equipment Failure", count: 28 },
      { reason: "Quality Issues", count: 22 },
      { reason: "Material Shortage", count: 15 },
      { reason: "Maintenance", count: 12 }
    ];
  }
}

export const apiService = new ApiService();

// Export all endpoint methods for verification
export const endpointMethods = {
  root: () => apiService.getRoot(),
  delayShare: () => apiService.getDelayShare(),
  monthlyAverageDelay: () => apiService.getMonthlyAverageDelay(),
  processingDaysHistogram: () => apiService.getProcessingDaysHistogram(),
  lineAverageDelay: () => apiService.getLineAverageDelay(),
  lineMonthlyAverageDelay: () => apiService.getLineMonthlyAverageDelay(),
  delayedBatchesByLine: () => apiService.getDelayedBatchesByLine(),
  delayedVsTotalBatches: () => apiService.getDelayedVsTotalBatches(),
  topDelayFormulas: () => apiService.getTopDelayFormulas(),
  lineScrapFactor: () => apiService.getLineScrapFactor(),
  monthlyDelayRate: () => apiService.getMonthlyDelayRate(),
  delayReasonsByLine: () => apiService.getDelayReasonsByLine(),
  delayReasonsTop10: () => apiService.getTopDelayReasons(),
  // Hook methods
  processedBatchData: () => apiService.getProcessedBatchData(),
  delayAnalytics: () => apiService.getDelayAnalytics(),
  scrapAnalytics: () => apiService.getScrapAnalytics(),
  yieldAnalytics: () => apiService.getYieldAnalytics(),
  monthlyTrends: () => apiService.getMonthlyTrends(),
  delayReasons: () => apiService.getDelayReasons()
};
