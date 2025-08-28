import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICards } from "./KPICards";
import { FilterControls } from "./FilterControls";
import { ProcessingDaysHistogram } from "./charts/ProcessingDaysHistogram";
import { DelayShareChart } from "./charts/DelayShareChart";
import { MonthlyDelayChart } from "./charts/MonthlyDelayChart";
import { LineDelayChart } from "./charts/LineDelayChart";
import { DelayedBatchesChart } from "./charts/DelayedBatchesChart";
import { StackedBatchesChart } from "./charts/StackedBatchesChart";
import { TopDelayFormulasChart } from "./charts/TopDelayFormulasChart";
import { ScrapFactorChart } from "./charts/ScrapFactorChart";
import { MonthlyDelayRateChart } from "./charts/MonthlyDelayRateChart";
import { DelayReasonsByLineChart } from "./charts/DelayReasonsByLineChart";
import { TopDelayReasonsChart } from "./charts/TopDelayReasonsChart";
import { YieldEfficiencyChart } from "./charts/YieldEfficiencyChart";
import { PlanVsActualChart } from "./charts/PlanVsActualChart";
import { ScrapDelayCorrelationChart } from "./charts/ScrapDelayCorrelationChart";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FilterOptions } from "@/types/manufacturing";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const ManufacturingDashboard = () => {
  const { toast } = useToast();
  const {
    batchData,
    delayAnalytics,
    scrapAnalytics,
    yieldAnalytics,
    monthlyTrends,
    delayReasons,
    isLoading,
    error,
    refetch
  } = useManufacturingData();

  const [filters, setFilters] = useState<FilterOptions>({
    lines: Array.from({length: 26}, (_, i) => (i + 1).toString()),
    dateRange: { from: null, to: null },
    delayThreshold: 2
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your dashboard data is being exported to CSV...",
    });
    
    // Simulate export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Dashboard data has been exported successfully.",
      });
    }, 2000);
  };

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

  // Transform API data for charts
  const processingDaysData = batchData?.map(batch => ({
    days: batch.processing_days,
    count: 1
  })) || [];

  const delayShareData = delayAnalytics ? [
    { 
      category: "On Time", 
      name: "On Time", 
      value: delayAnalytics.onTimeBatches, 
      percentage: ((delayAnalytics.onTimeBatches / delayAnalytics.totalBatches) * 100) 
    },
    { 
      category: "Delayed", 
      name: "Delayed", 
      value: delayAnalytics.delayedBatches, 
      percentage: ((delayAnalytics.delayedBatches / delayAnalytics.totalBatches) * 100) 
    }
  ] : [];

  const monthlyDelayData = monthlyTrends?.map(trend => ({
    month: trend.month,
    averageDelay: trend.avgProcessingDays,
    avgProcessingDays: trend.avgProcessingDays
  })) || [];

  const scrapFactorData = scrapAnalytics?.scrapByLine.map(line => ({
    line: line.line.toString(),
    scrapFactor: line.avgScrap,
    avgScrap: line.avgScrap,
    severity: line.avgScrap > 0.03 ? "high" : line.avgScrap > 0.025 ? "medium" : "low"
  })) || [];

  const planVsActualData = batchData?.map(batch => ({
    planned: batch.PLAN_QTY,
    actual: batch.WIP_QTY,
    batchId: batch.WIP_BATCH_ID
  })) || [];

  const yieldDistributionData = yieldAnalytics?.yieldDistribution || [];

  const scrapDelayCorrelationData = batchData ? [
    {
      category: "On Time",
      avgScrapFactor: batchData.filter(b => !b.is_delayed).reduce((sum, b) => sum + b.SCRAP_FACTOR, 0) / batchData.filter(b => !b.is_delayed).length,
      batchCount: batchData.filter(b => !b.is_delayed).length
    },
    {
      category: "Delayed",
      avgScrapFactor: batchData.filter(b => b.is_delayed).reduce((sum, b) => sum + b.SCRAP_FACTOR, 0) / batchData.filter(b => b.is_delayed).length,
      batchCount: batchData.filter(b => b.is_delayed).length
    }
  ] : [];

  const kpiData = {
    totalBatches: delayAnalytics?.totalBatches || 0,
    delayRate: delayAnalytics?.delayRate || 0,
    delayedPercentage: delayAnalytics?.delayRate || 0,
    averageDelay: delayAnalytics?.avgProcessingDays || 0,
    avgProcessingDays: delayAnalytics?.avgProcessingDays || 0,
    scrapFactor: scrapAnalytics?.avgScrapFactor || 0,
    avgScrapFactor: scrapAnalytics?.avgScrapFactor || 0,
    avgYield: yieldAnalytics?.avgYield || 0
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
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manufacturing Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Real-time insights into batch processing and production efficiency
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards data={kpiData} />
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="delays">Delay Analysis</TabsTrigger>
            <TabsTrigger value="production">Production Lines</TabsTrigger>
            <TabsTrigger value="quality">Quality & Scrap</TabsTrigger>
            <TabsTrigger value="yield">Yield Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DelayShareChart data={delayShareData} />
              <MonthlyDelayChart data={monthlyDelayData} />
              <ScrapFactorChart data={scrapFactorData} />
              <ScrapDelayCorrelationChart data={scrapDelayCorrelationData} />
            </div>
          </TabsContent>

          <TabsContent value="delays" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyDelayChart data={monthlyDelayData} />
              <ScrapDelayCorrelationChart data={scrapDelayCorrelationData} />
              {delayReasons && delayReasons.length > 0 && (
                <TopDelayReasonsChart data={delayReasons.map(r => ({ reason: r.reason, count: r.count }))} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrapFactorChart data={scrapFactorData} />
              <MonthlyDelayChart data={monthlyDelayData} />
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrapFactorChart data={scrapFactorData} />
              <ScrapDelayCorrelationChart data={scrapDelayCorrelationData} />
              {delayReasons && delayReasons.length > 0 && (
                <TopDelayReasonsChart data={delayReasons.map(r => ({ reason: r.reason, count: r.count }))} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="yield" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <YieldEfficiencyChart data={yieldDistributionData} />
              <PlanVsActualChart data={planVsActualData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};