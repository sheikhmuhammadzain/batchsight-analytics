import { useMemo } from 'react';
import { ChartInsight } from '@/components/dashboard/ChartInsightsModal';

interface DelayAnalytics {
  totalBatches: number;
  delayedBatches: number;
  onTimeBatches: number;
  delayRate: number;
  avgProcessingDays: number;
}

interface ScrapAnalytics {
  avgScrapFactor: number;
  scrapByLine: Array<{ line: number; avgScrap: number; batchCount: number }>;
}

interface YieldAnalytics {
  avgYield: number;
  totalPlanned: number;
  totalActual: number;
}

interface MonthlyTrend {
  month: string;
  delayRate: number;
  avgProcessingDays: number;
  avgScrapFactor: number;
  totalBatches: number;
}

export const useChartInsights = (
  delayAnalytics?: DelayAnalytics,
  scrapAnalytics?: ScrapAnalytics,
  yieldAnalytics?: YieldAnalytics,
  monthlyTrends?: MonthlyTrend[]
) => {
  const delayShareInsights = useMemo((): ChartInsight[] => {
    if (!delayAnalytics) return [];

    const insights: ChartInsight[] = [];

    // Overall performance insight
    if (delayAnalytics.delayRate > 50) {
      insights.push({
        title: "Critical Delay Performance",
        description: `${delayAnalytics.delayRate.toFixed(1)}% of batches are delayed beyond the 2-day threshold. This indicates systemic operational issues that require immediate attention.`,
        type: 'negative',
        impact: 'high',
        metrics: [
          { label: "Delayed Batches", value: delayAnalytics.delayedBatches, trend: 'up' },
          { label: "Delay Rate", value: `${delayAnalytics.delayRate.toFixed(1)}%`, trend: 'up' },
          { label: "Avg Processing Days", value: delayAnalytics.avgProcessingDays.toFixed(1), trend: 'up' }
        ],
        recommendations: [
          "Conduct immediate root cause analysis on top delayed production lines",
          "Review capacity planning and resource allocation",
          "Implement emergency response protocols for critical delays",
          "Consider temporary workforce augmentation or equipment upgrades"
        ]
      });
    } else if (delayAnalytics.delayRate > 25) {
      insights.push({
        title: "Moderate Delay Concerns",
        description: `${delayAnalytics.delayRate.toFixed(1)}% of batches are experiencing delays. While not critical, this trend requires monitoring and corrective action.`,
        type: 'warning',
        impact: 'medium',
        metrics: [
          { label: "Delayed Batches", value: delayAnalytics.delayedBatches },
          { label: "Delay Rate", value: `${delayAnalytics.delayRate.toFixed(1)}%` },
          { label: "On-Time Batches", value: delayAnalytics.onTimeBatches, trend: 'stable' }
        ],
        recommendations: [
          "Analyze delay patterns by production line and time period",
          "Review preventive maintenance schedules",
          "Optimize batch scheduling and sequencing",
          "Monitor raw material supply chain reliability"
        ]
      });
    } else {
      insights.push({
        title: "Good Delay Performance",
        description: `Only ${delayAnalytics.delayRate.toFixed(1)}% of batches are delayed. Your production system is performing well within acceptable parameters.`,
        type: 'positive',
        impact: 'low',
        metrics: [
          { label: "On-Time Rate", value: `${(100 - delayAnalytics.delayRate).toFixed(1)}%`, trend: 'stable' },
          { label: "Total Batches", value: delayAnalytics.totalBatches },
          { label: "Avg Processing", value: `${delayAnalytics.avgProcessingDays.toFixed(1)} days` }
        ],
        recommendations: [
          "Maintain current operational practices",
          "Document best practices for knowledge sharing",
          "Continue monitoring for early warning signs",
          "Consider optimizations for even better performance"
        ]
      });
    }

    return insights;
  }, [delayAnalytics]);

  const scrapFactorInsights = useMemo((): ChartInsight[] => {
    if (!scrapAnalytics) return [];

    const insights: ChartInsight[] = [];
    const highScrapLines = scrapAnalytics.scrapByLine.filter(line => line.avgScrap > 0.03);
    const bestPerformingLine = scrapAnalytics.scrapByLine.reduce((min, line) => 
      line.avgScrap < min.avgScrap ? line : min
    );

    // Overall scrap performance
    if (scrapAnalytics.avgScrapFactor > 0.035) {
      insights.push({
        title: "High Material Waste",
        description: `Average scrap factor of ${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}% indicates significant material waste across production lines.`,
        type: 'negative',
        impact: 'high',
        metrics: [
          { label: "Avg Scrap Factor", value: `${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}%`, trend: 'up' },
          { label: "High-Scrap Lines", value: highScrapLines.length },
          { label: "Best Line Performance", value: `${(bestPerformingLine.avgScrap * 100).toFixed(2)}%` }
        ],
        recommendations: [
          "Focus on lines with scrap factors above 3%",
          "Benchmark against best-performing line practices",
          "Review material handling and storage procedures",
          "Implement real-time quality monitoring systems"
        ]
      });
    } else if (scrapAnalytics.avgScrapFactor > 0.025) {
      insights.push({
        title: "Moderate Scrap Levels",
        description: `Scrap factor of ${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}% is within acceptable range but has room for improvement.`,
        type: 'warning',
        impact: 'medium',
        metrics: [
          { label: "Avg Scrap Factor", value: `${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}%` },
          { label: "Lines Above 3%", value: highScrapLines.length },
          { label: "Improvement Potential", value: `${((scrapAnalytics.avgScrapFactor - bestPerformingLine.avgScrap) * 100).toFixed(2)}%` }
        ],
        recommendations: [
          "Study best practices from top-performing lines",
          "Implement operator training programs",
          "Review equipment calibration schedules",
          "Optimize raw material specifications"
        ]
      });
    } else {
      insights.push({
        title: "Excellent Scrap Control",
        description: `Low scrap factor of ${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}% demonstrates excellent material utilization and process control.`,
        type: 'positive',
        impact: 'low',
        metrics: [
          { label: "Avg Scrap Factor", value: `${(scrapAnalytics.avgScrapFactor * 100).toFixed(2)}%`, trend: 'stable' },
          { label: "Best Line", value: `Line ${bestPerformingLine.line}` },
          { label: "Consistency", value: "High" }
        ],
        recommendations: [
          "Document current best practices",
          "Share successful methods across all lines",
          "Maintain current quality standards",
          "Consider setting even more ambitious targets"
        ]
      });
    }

    return insights;
  }, [scrapAnalytics]);

  const yieldEfficiencyInsights = useMemo((): ChartInsight[] => {
    if (!yieldAnalytics) return [];

    const insights: ChartInsight[] = [];
    const efficiencyRate = (yieldAnalytics.totalActual / yieldAnalytics.totalPlanned) * 100;

    if (efficiencyRate < 80) {
      insights.push({
        title: "Low Yield Efficiency",
        description: `Overall yield efficiency of ${efficiencyRate.toFixed(1)}% indicates significant gaps between planned and actual production.`,
        type: 'negative',
        impact: 'high',
        metrics: [
          { label: "Yield Efficiency", value: `${efficiencyRate.toFixed(1)}%`, trend: 'down' },
          { label: "Total Planned", value: yieldAnalytics.totalPlanned.toLocaleString() },
          { label: "Total Actual", value: yieldAnalytics.totalActual.toLocaleString() }
        ],
        recommendations: [
          "Review production planning accuracy",
          "Investigate systematic underproduction causes",
          "Improve demand forecasting methods",
          "Analyze equipment capacity constraints"
        ]
      });
    } else if (efficiencyRate > 120) {
      insights.push({
        title: "Overproduction Detected",
        description: `Yield efficiency of ${efficiencyRate.toFixed(1)}% indicates consistent overproduction, which may lead to inventory costs.`,
        type: 'warning',
        impact: 'medium',
        metrics: [
          { label: "Yield Efficiency", value: `${efficiencyRate.toFixed(1)}%`, trend: 'up' },
          { label: "Excess Production", value: `${((yieldAnalytics.totalActual - yieldAnalytics.totalPlanned) / yieldAnalytics.totalPlanned * 100).toFixed(1)}%` },
          { label: "Avg Yield", value: yieldAnalytics.avgYield.toFixed(2) }
        ],
        recommendations: [
          "Review and adjust production planning targets",
          "Implement just-in-time production principles",
          "Optimize inventory management",
          "Consider demand-driven production scheduling"
        ]
      });
    } else {
      insights.push({
        title: "Optimal Yield Performance",
        description: `Yield efficiency of ${efficiencyRate.toFixed(1)}% demonstrates excellent alignment between planning and execution.`,
        type: 'positive',
        impact: 'low',
        metrics: [
          { label: "Yield Efficiency", value: `${efficiencyRate.toFixed(1)}%`, trend: 'stable' },
          { label: "Planning Accuracy", value: "High" },
          { label: "Avg Yield", value: yieldAnalytics.avgYield.toFixed(2) }
        ],
        recommendations: [
          "Maintain current planning processes",
          "Continue monitoring yield consistency",
          "Share planning best practices",
          "Focus on other optimization areas"
        ]
      });
    }

    return insights;
  }, [yieldAnalytics]);

  const monthlyTrendInsights = useMemo((): ChartInsight[] => {
    if (!monthlyTrends || monthlyTrends.length < 3) return [];

    const insights: ChartInsight[] = [];
    const recent = monthlyTrends.slice(-3);
    const earlier = monthlyTrends.slice(0, -3);
    
    const recentAvgDelay = recent.reduce((sum, t) => sum + t.delayRate, 0) / recent.length;
    const earlierAvgDelay = earlier.length > 0 ? earlier.reduce((sum, t) => sum + t.delayRate, 0) / earlier.length : recentAvgDelay;
    
    const trend = recentAvgDelay > earlierAvgDelay ? 'worsening' : recentAvgDelay < earlierAvgDelay ? 'improving' : 'stable';

    if (trend === 'worsening') {
      insights.push({
        title: "Deteriorating Performance Trend",
        description: `Recent months show increasing delay rates (${recentAvgDelay.toFixed(1)}% vs ${earlierAvgDelay.toFixed(1)}% earlier). Immediate intervention required.`,
        type: 'negative',
        impact: 'high',
        metrics: [
          { label: "Recent Avg Delay", value: `${recentAvgDelay.toFixed(1)}%`, trend: 'up' },
          { label: "Earlier Avg Delay", value: `${earlierAvgDelay.toFixed(1)}%` },
          { label: "Trend Direction", value: "Worsening", trend: 'down' }
        ],
        recommendations: [
          "Conduct urgent operational review",
          "Identify recent changes that may have caused deterioration",
          "Implement corrective action plan immediately",
          "Increase monitoring frequency"
        ]
      });
    } else if (trend === 'improving') {
      insights.push({
        title: "Positive Performance Trend",
        description: `Performance is improving with recent delay rates at ${recentAvgDelay.toFixed(1)}% compared to ${earlierAvgDelay.toFixed(1)}% earlier.`,
        type: 'positive',
        impact: 'medium',
        metrics: [
          { label: "Recent Avg Delay", value: `${recentAvgDelay.toFixed(1)}%`, trend: 'down' },
          { label: "Improvement", value: `${(earlierAvgDelay - recentAvgDelay).toFixed(1)}%` },
          { label: "Trend Direction", value: "Improving", trend: 'up' }
        ],
        recommendations: [
          "Continue current improvement initiatives",
          "Document successful changes for replication",
          "Maintain momentum with additional optimizations",
          "Set new performance targets"
        ]
      });
    }

    return insights;
  }, [monthlyTrends]);

  return {
    delayShareInsights,
    scrapFactorInsights,
    yieldEfficiencyInsights,
    monthlyTrendInsights
  };
};
