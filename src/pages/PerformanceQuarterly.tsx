import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { CustomBarChart } from "@/components/charts";
import type { ChartConfig } from "@/components/ui/chart";

type QuarterlyPoint = { quarter: string; avg_processing_days: number };

const PerformanceQuarterly: React.FC = () => {
  const { monthlyAverageDelay, isLoading, error } = useManufacturingData();

  // Aggregate monthly avg_processing_days into quarters
  const quarterlyData: QuarterlyPoint[] = React.useMemo(() => {
    if (!monthlyAverageDelay || !Array.isArray(monthlyAverageDelay.months)) return [];
    const map = new Map<string, { sum: number; count: number }>();
    monthlyAverageDelay.months.forEach((m, idx) => {
      // m format: YYYY-MM
      const [y, mm] = m.split("-");
      const monthNum = Number(mm);
      const q = monthNum <= 3 ? "Q1" : monthNum <= 6 ? "Q2" : monthNum <= 9 ? "Q3" : "Q4";
      const key = `${y} ${q}`;
      const val = monthlyAverageDelay.avg_processing_days[idx] || 0;
      const prev = map.get(key) || { sum: 0, count: 0 };
      map.set(key, { sum: prev.sum + val, count: prev.count + 1 });
    });
    return Array.from(map.entries())
      .sort(([a],[b]) => (a > b ? 1 : -1))
      .map(([key, { sum, count }]) => ({ quarter: key, avg_processing_days: Number((sum / Math.max(count,1)).toFixed(2)) }));
  }, [monthlyAverageDelay]);

  const chartConfig: ChartConfig = {
    avg_processing_days: { label: "Avg Processing Days", color: "hsl(var(--chart-1))" },
  } as any;

  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Performance - Quarterly</h1>
          <p className="text-muted-foreground mt-2">Quarterly aggregation of average processing time vs 2-day threshold.</p>
        </div>

        {isLoading ? (
          <div className="py-2 text-muted-foreground">Loading quarterly metrics…</div>
        ) : error ? (
          <div className="py-2 text-destructive">Failed to load some datasets. Showing available charts.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6">
          {quarterlyData.length > 0 ? (
            <CustomBarChart
              data={quarterlyData}
              config={chartConfig}
              dataKeys={["avg_processing_days"]}
              xAxisKey="quarter"
              title="Quarterly Average Processing Days"
              className="h-[320px] w-full"
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default PerformanceQuarterly;
