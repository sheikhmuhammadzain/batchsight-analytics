import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { MonthlyDelayRateData } from "@/services/api";
import { AIInsights } from "@/components/AIInsights";

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

  const avgDelayRate = chartData.reduce((sum, item) => sum + item.delay_rate, 0) / chartData.length;
  const maxDelayRate = Math.max(...chartData.map(item => item.delay_rate));
  const trend = chartData.length > 1 ? (chartData[chartData.length - 1].delay_rate - chartData[0].delay_rate) : 0;

  const insightType = avgDelayRate > 25 ? 'negative' : avgDelayRate > 15 ? 'warning' : 'positive';
  const insightImpact = avgDelayRate > 25 ? 'high' : 'medium';

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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="delayRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-6))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-6))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                label={{ value: 'Delay Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Delay Rate']}
              />
              <ReferenceLine
                y={data.threshold}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                label={`${data.threshold}% Threshold`}
              />
              <Area
                type="monotone"
                dataKey="delay_rate"
                stroke="hsl(var(--chart-6))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#delayRateGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
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