import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { ProcessingDaysHistogramData } from "@/services/api";
import { CustomBarChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";

interface ProcessingDaysHistogramChartProps {
  data: ProcessingDaysHistogramData;
}

export const ProcessingDaysHistogramChart = ({ data }: ProcessingDaysHistogramChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Transform data for shadcn charts
  const chartData = data.counts.map((count, index) => ({
    days: data.bin_edges[index],
    count: count
  }));

  const chartConfig = {
    count: {
      label: "Batch Count",
      color: "hsl(217.2193, 91.2195%, 59.8039%)",
    },
  } satisfies ChartConfig;

  const insights = [
    {
      title: "Processing Days Distribution",
      description: "Most batches are processed within the standard timeframe, with some outliers requiring extended processing time.",
      type: 'info' as const,
      impact: 'medium' as const,
      metrics: [
        { label: "Peak Processing Days", value: Math.max(...data.counts) },
        { label: "Total Batches", value: data.counts.reduce((sum, count) => sum + count, 0) },
        { label: "Avg Days", value: (data.raw_processing_days.reduce((sum, days) => sum + days, 0) / data.raw_processing_days.length).toFixed(1) }
      ],
      recommendations: [
        "Monitor batches taking more than 3 days for potential bottlenecks",
        "Analyze patterns in processing time distribution",
        "Consider capacity optimization for peak processing periods"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Processing Days Histogram</CardTitle>
            <CardDescription>
              Distribution of batch processing times across all production lines
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Insights
          </Button>
        </CardHeader>
        <CardContent>
          <CustomBarChart
            data={chartData}
            config={chartConfig}
            dataKeys={["count"]}
            xAxisKey="days"
            className="h-[300px]"
          />
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Processing Days Histogram"
        insights={insights}
      />
    </>
  );
};
