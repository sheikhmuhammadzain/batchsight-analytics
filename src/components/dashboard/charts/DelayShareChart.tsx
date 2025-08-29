import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { useChartInsights } from "@/hooks/useChartInsights";
import { DelayShareData } from "@/services/api";
import { CustomPieChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";

interface DelayShareChartProps {
  data: DelayShareData;
}

const PRIMARY_BLUE = 'hsl(217.2193, 91.2195%, 59.8039%)';
const PRIMARY_BLUE_SOFT = 'hsla(217.2193, 91.2195%, 59.8039%, 0.35)';

export const DelayShareChart = ({ data }: DelayShareChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.percentages)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delay Share Distribution</CardTitle>
          <CardDescription>Loading delay share data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform API data into chart format for shadcn pie chart
  const chartData = data.categories.map((category, index) => {
    const color = category === 'Delayed' ? PRIMARY_BLUE : PRIMARY_BLUE_SOFT;
    return {
      name: category,
      value: Math.round((data.percentages[index] || 0) * 10) / 10, // Round to 1 decimal
      fill: color
    };
  });

  // Chart configuration for shadcn
  const chartConfig = data.categories.reduce((config, category, index) => {
    const key = category.toLowerCase().replace(/\s+/g, '-');
    const color = category === 'Delayed' ? PRIMARY_BLUE : PRIMARY_BLUE_SOFT;
    config[key] = {
      label: category,
      color,
    };
    return config;
  }, {} as Record<string, any>) satisfies ChartConfig;

  // Calculate delay analytics from data
  const delayedIndex = data.categories.indexOf("Delayed");
  const onTimeIndex = data.categories.indexOf("On Time");

  const delayAnalytics = {
    totalBatches: 1000, // This would need to be calculated from actual data
    delayedBatches: Math.round((data.percentages[delayedIndex] / 100) * 1000),
    onTimeBatches: Math.round((data.percentages[onTimeIndex] / 100) * 1000),
    delayRate: data.percentages[delayedIndex],
    avgProcessingDays: data.threshold_days + 0.5 // Estimate based on threshold
  };

  const { delayShareInsights } = useChartInsights(delayAnalytics);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delay Share Distribution</CardTitle>
            <CardDescription>
              Percentage of batches delayed vs on-time (threshold: {data.threshold_days} days)
            </CardDescription>
          </div>
          
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col items-center">
            <CustomPieChart
              data={chartData}
              config={chartConfig}
              className="h-[300px] w-full max-w-[560px] aspect-auto"
              showLegend={true}
            />
          </div>
          {data.ai_insights && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-semibold text-sm mb-2">AI Insights</h4>
              <AIInsights text={data.ai_insights} />
            </div>
          )}
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Delay Share Distribution"
        insights={delayShareInsights}
      />
    </>
  );
};