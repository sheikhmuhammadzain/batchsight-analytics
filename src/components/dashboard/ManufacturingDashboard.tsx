import { ProcessingDaysHistogram } from "./charts/ProcessingDaysHistogram";
import { DelayShareChart } from "./charts/DelayShareChart";
import { MonthlyDelayChart } from "./charts/MonthlyDelayChart";
import { LineAverageDelayChart } from "./charts/LineAverageDelayChart";
import { LineMonthlyAverageDelayChart } from "./charts/LineMonthlyAverageDelayChart";
import { DelayedBatchesByLineChart } from "./charts/DelayedBatchesByLineChart";
import { DelayedVsTotalBatchesChart } from "./charts/DelayedVsTotalBatchesChart";
import { TopDelayFormulasChart } from "./charts/TopDelayFormulasChart";
import { LineScrapFactorChart } from "./charts/LineScrapFactorChart";
import { MonthlyDelayRateChart } from "./charts/MonthlyDelayRateChart";
import { DelayReasonsByLineChart } from "./charts/DelayReasonsByLineChart";
import { TopDelayReasonsChart } from "./charts/TopDelayReasonsChart";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart3, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomBarChart, CustomLineChart, CustomAreaChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";
import { ChartInsightsModal, ChartInsight } from "./ChartInsightsModal";
import { useState } from "react";

export const ManufacturingDashboard = () => {
  const { toast } = useToast();
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    delayShare,
    monthlyAverageDelay,
    lineAverageDelay,
    lineMonthlyAverageDelay,
    delayedBatchesByLine,
    delayedVsTotalBatches,
    topDelayFormulas,
    lineScrapFactor,
    monthlyDelayRate,
    delayReasonsByLine,
    topDelayReasons,
    processingDaysHistogram,
    isLoading,
    error,
    refetch
  } = useManufacturingData();

  // Show internal debug info only in development
  const isDev = (import.meta as any)?.env?.DEV;

  const handleRefresh = async () => {
    toast({
      title: "Refreshing Data",
      description: "Fetching latest manufacturing data...",
    });
    
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Dashboard has been updated with latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to fetch latest data. Using cached data.",
        variant: "destructive"
      });
    }
  };

  // Use delay share data directly from API with validation
  const delayShareData = (() => {
    if (!delayShare) return null;
    if (typeof delayShare === 'object' && !Array.isArray(delayShare)) return delayShare;
    console.warn('Delay share data has unexpected format:', delayShare);
    return null;
  })();

  // Use monthly average delay data directly from API with validation
  const monthlyDelayData = (() => {
    if (!monthlyAverageDelay) return null;
    if (typeof monthlyAverageDelay === 'object' && !Array.isArray(monthlyAverageDelay)) return monthlyAverageDelay;
    console.warn('Monthly average delay data has unexpected format:', monthlyAverageDelay);
    return null;
  })();

  // Sample data for shadcn charts integration
  const enhancedMetricsData = [
    { period: "Q1", efficiency: 85, target: 90, production: 1200 },
    { period: "Q2", efficiency: 88, target: 90, production: 1350 },
    { period: "Q3", efficiency: 92, target: 90, production: 1400 },
    { period: "Q4", efficiency: 94, target: 90, production: 1500 },
  ];

  const performanceTrendData = [
    { month: "Jan", actual: 186, planned: 200, efficiency: 93 },
    { month: "Feb", actual: 305, planned: 280, efficiency: 109 },
    { month: "Mar", actual: 237, planned: 250, efficiency: 95 },
    { month: "Apr", actual: 273, planned: 260, efficiency: 105 },
    { month: "May", actual: 209, planned: 230, efficiency: 91 },
    { month: "Jun", actual: 214, planned: 220, efficiency: 97 },
  ];

  const metricsConfig = {
    efficiency: {
      label: "Efficiency %",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target %",
      color: "hsl(var(--chart-2))",
    },
    production: {
      label: "Production Units",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const performanceConfig = {
    actual: {
      label: "Actual Output",
      color: "hsl(var(--chart-1))",
    },
    planned: {
      label: "Planned Output",
      color: "hsl(var(--chart-2))",
    },
    efficiency: {
      label: "Efficiency %",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const sampleInsights: ChartInsight[] = [
    {
      title: "Production Efficiency Improvement",
      description: "Manufacturing efficiency has increased by 15% over the last quarter, exceeding target performance.",
      type: "positive",
      impact: "high",
      recommendations: [
        "Continue current optimization strategies",
        "Share best practices across all production lines",
        "Consider expanding successful processes to other facilities"
      ],
      metrics: [
        { label: "Current Efficiency", value: "94.5%", trend: "up" },
        { label: "Target Efficiency", value: "90%", trend: "stable" },
        { label: "Improvement", value: "+4.5%", trend: "up" }
      ]
    }
  ];

  const handleChartClick = (chartTitle: string) => {
    setSelectedChart(chartTitle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChart(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading manufacturing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">Failed to fetch manufacturing data. Using fallback data.</p>
          <button onClick={handleRefresh} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Manufacturing Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Real-time insights into batch processing and production efficiency
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex justify-end gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-sm transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Debug Information (dev only) */}
        {isDev ? (
          <div className="mb-8 p-4 bg-muted border border-border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Processing Days Histogram:</strong> {processingDaysHistogram ? 'Available' : 'Not Available'}
              </div>
              <div>
                <strong>Delay Share:</strong> {delayShareData ? 'Available' : 'Not Available'}
              </div>
              <div>
                <strong>Monthly Delay:</strong> {monthlyDelayData ? 'Available' : 'Not Available'}
              </div>
              <div>
                <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        ) : null}

        {/* Manufacturing Analytics Charts - Ordered by API Endpoints */}
        <div className="space-y-10 ">
          {/* 1. Processing Days Histogram */}
          <div className="space-y-4">
            {(() => {
              try {
                if (processingDaysHistogram) {
                  return <ProcessingDaysHistogram data={processingDaysHistogram} />;
                } else {
                  return (
                    <div className="p-4 bg-muted border border-border rounded-md">
                      <p className="text-muted-foreground">Processing Days Histogram data not available</p>
                    </div>
                  );
                }
              } catch (error) {
                console.error('Error rendering ProcessingDaysHistogram:', error);
                return (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                    <p className="text-destructive">Error rendering Processing Days Histogram chart</p>
                    <p className="text-destructive/80 text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
                  </div>
                );
              }
            })()}
          </div>

          {/* 2. Delay Share */}
          <div className="space-y-4">
            {(() => {
              try {
                if (delayShareData) {
                  return <DelayShareChart data={delayShareData} />;
                } else {
                  return (
                    <div className="p-4 bg-muted border border-border rounded-md">
                      <p className="text-muted-foreground">Delay Share data not available</p>
                    </div>
                  );
                }
              } catch (error) {
                console.error('Error rendering DelayShareChart:', error);
                return (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                    <p className="text-destructive">Error rendering Delay Share chart</p>
                    <p className="text-destructive/80 text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
                  </div>
                );
              }
            })()}
          </div>

          {/* 3. Monthly Average Delay */}
          <div className="space-y-4">
            {monthlyDelayData ? (
              <MonthlyDelayChart data={monthlyDelayData} />
            ) : (
              <div className="p-4 bg-muted border border-border rounded-md">
                <p className="text-muted-foreground">Monthly Average Delay data not available</p>
              </div>
            )}
          </div>

          {/* 4. Line Average Delay */}
          <div className="space-y-4">
            {lineAverageDelay ? <LineAverageDelayChart data={lineAverageDelay} /> : null}
          </div>

          {/* 5. Line Monthly Average Delay */}
          <div className="space-y-4">
            {lineMonthlyAverageDelay ? <LineMonthlyAverageDelayChart data={lineMonthlyAverageDelay} /> : null}
          </div>

          {/* 6. Delayed Batches by Line */}
          <div className="space-y-4">
            {delayedBatchesByLine ? <DelayedBatchesByLineChart data={delayedBatchesByLine} /> : null}
          </div>

          {/* 7. Delayed vs Total Batches */}
          <div className="space-y-4">
            {delayedVsTotalBatches ? <DelayedVsTotalBatchesChart data={delayedVsTotalBatches} /> : null}
          </div>

          {/* 8. Top Delay Formulas */}
          <div className="space-y-4">
            {topDelayFormulas ? <TopDelayFormulasChart data={topDelayFormulas} /> : null}
          </div>

          {/* 9. Line Scrap Factor */}
          <div className="space-y-4">
            {lineScrapFactor ? <LineScrapFactorChart data={lineScrapFactor} /> : null}
          </div>

          {/* 10. Monthly Delay Rate */}
          <div className="space-y-4">
            {monthlyDelayRate ? <MonthlyDelayRateChart data={monthlyDelayRate} /> : null}
          </div>

          {/* 11. Delay Reasons by Line */}
          <div className="space-y-4">
            {delayReasonsByLine ? <DelayReasonsByLineChart data={delayReasonsByLine} /> : null}
          </div>

          {/* 12. Top Delay Reasons */}
          <div className="space-y-4">
            {topDelayReasons ? <TopDelayReasonsChart data={topDelayReasons} /> : null}
          </div>
        </div>

        {/* Chart Insights Modal */}
        <ChartInsightsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          chartTitle={selectedChart || "Chart Analysis"}
          insights={sampleInsights}
          chartType="bar"
        />
      </div>
    </div>
  );
};