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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FilterOptions } from "@/types/manufacturing";
import {
  kpiData,
  processingDaysData,
  delayShareData,
  monthlyDelayData,
  lineMonthlyDelayData,
  delayedBatchesData,
  topDelayFormulasData,
  scrapFactorData,
  monthlyDelayRateData,
  delayReasonsByLineData,
  delayReasonsTop10Data,
  manufacturingLines
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export const ManufacturingDashboard = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    lines: manufacturingLines,
    dateRange: { from: null, to: null },
    delayThreshold: 0
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
    
    // Simulate data refresh
    return new Promise(resolve => {
      setTimeout(() => {
        toast({
          title: "Data Refreshed",
          description: "Dashboard has been updated with latest data.",
        });
        resolve(void 0);
      }, 1500);
    });
  };

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="delays">Delay Analysis</TabsTrigger>
            <TabsTrigger value="production">Production Lines</TabsTrigger>
            <TabsTrigger value="quality">Quality & Reasons</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProcessingDaysHistogram data={processingDaysData} />
              <DelayShareChart data={delayShareData} />
              <MonthlyDelayChart data={monthlyDelayData} />
              <MonthlyDelayRateChart data={monthlyDelayRateData} />
            </div>
          </TabsContent>

          <TabsContent value="delays" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineDelayChart data={lineMonthlyDelayData} />
              <DelayedBatchesChart data={delayedBatchesData} />
              <StackedBatchesChart data={delayedBatchesData} />
              <TopDelayFormulasChart data={topDelayFormulasData} />
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrapFactorChart data={scrapFactorData} />
              <DelayedBatchesChart data={delayedBatchesData} />
              <LineDelayChart data={lineMonthlyDelayData} />
              <StackedBatchesChart data={delayedBatchesData} />
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <DelayReasonsByLineChart data={delayReasonsByLineData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopDelayReasonsChart data={delayReasonsTop10Data} />
                <ScrapFactorChart data={scrapFactorData} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};