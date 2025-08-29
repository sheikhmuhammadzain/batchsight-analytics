import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { MonthlyDelayRateData } from "@/services/api";
import { AIInsights } from "@/components/AIInsights";
import { CustomAreaChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";

interface MonthlyDelayRateChartProps {
  data: MonthlyDelayRateData;
}

export const MonthlyDelayRateChart = ({ data }: MonthlyDelayRateChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.months) || !Array.isArray(data.delay_rates)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Delay Rate</CardTitle>
          <CardDescription>Loading monthly delay rate data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = data.months.map((month, index) => ({
    month,
    delay_rate: data.delay_rates[index] || 0,
  }));

  // Chart configuration for shadcn
  const chartConfig = {
    delay_rate: {
      label: "Delay Rate",
      color: "hsl(217.2193, 91.2195%, 59.8039%)",
    },
  } satisfies ChartConfig;

  const avgDelayRate = chartData.reduce((sum, item) => sum + item.delay_rate, 0) / chartData.length;
  const maxDelayRate = Math.max(...chartData.map(item => item.delay_rate));
  const trend = chartData.length > 1 ? (chartData[chartData.length - 1].delay_rate - chartData[0].delay_rate) : 0;

  const insightType: 'negative' | 'warning' | 'positive' | 'info' = avgDelayRate > 25 ? 'negative' : avgDelayRate > 15 ? 'warning' : 'positive';
  const insightImpact: 'high' | 'medium' | 'low' = avgDelayRate > 25 ? 'high' : 'medium';

  const insights = [
    {
      title: "Monthly Delay Rate Trends",
      description: `Average monthly delay rate is ${avgDelayRate.toFixed(1)}%. ${trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable'} trend observed.`,
      type: insightType,
      impact: insightImpact,
      metrics: [
        { label: "Average Delay Rate", value: `${avgDelayRate.toFixed(1)}%` },
        { label: "Peak Delay Rate", value: `${maxDelayRate.toFixed(1)}%` },
        { label: "Trend", value: trend > 0 ? "Worsening" : trend < 0 ? "Improving" : "Stable" }
      ],
      recommendations: [
        "Monitor seasonal patterns in delay rates",
        "Investigate months with peak delay rates",
        "Implement preventive measures during high-risk periods",
        "Set monthly improvement targets based on historical data"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Delay Rate</CardTitle>
            <CardDescription>
              Percentage of delayed batches by month
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent className="p-6">
          <CustomAreaChart
            data={chartData}
            config={chartConfig}
            dataKeys={["delay_rate"]}
            xAxisKey="month"
            className="h-[350px] w-full"
            stacked={false}
            referenceLine={{ y: data.threshold, label: `${data.threshold}% Threshold` }}
          />
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
        chartTitle="Monthly Delay Rate"
        insights={insights}
      />
    </>
  );
};