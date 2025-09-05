import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { useChartInsights } from "@/hooks/useChartInsights";
import { MonthlyAverageDelayData } from "@/services/api";

interface MonthlyDelayChartProps {
  data: MonthlyAverageDelayData;
}

export const MonthlyDelayChart = ({ data }: MonthlyDelayChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.months) || !Array.isArray(data.avg_processing_days)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Average Delay Trend</CardTitle>
          <CardDescription>Loading monthly delay data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform API data into chart format
  const chartData = data.months.map((month, index) => ({
    month: month,
    averageDelay: Math.round((data.avg_processing_days[index] || 0) * 10) / 10, // Round to 1 decimal
    avg_processing_days: data.avg_processing_days[index] || 0
  }));

  // Transform data for insights (using last 12 months for recent trends)
  const recentMonths = data.months.slice(-12);
  const recentDelays = data.avg_processing_days.slice(-12);

  const monthlyTrends = recentMonths.map((month, index) => ({
    month: month,
    delayRate: (recentDelays[index] > data.threshold ? 1 : 0) * 100, // Simple delay rate calculation
    avgProcessingDays: recentDelays[index],
    avgScrapFactor: 0.028,
    totalBatches: Math.floor(100 + Math.random() * 50) // Mock batch count
  }));

  const { monthlyTrendInsights } = useChartInsights(undefined, undefined, undefined, monthlyTrends);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Average Delay Trend</CardTitle>
            <CardDescription>
              Average processing time per month with {data.threshold}-day threshold
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs fill-muted-foreground"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                label={{ value: 'Processing Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)} days`, 'Avg Processing Time']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <ReferenceLine
                y={data.threshold}
                stroke="hsl(217.2193, 91.2195%, 59.8039%)"
                strokeDasharray="5 5"
                label={{ value: "Delay Threshold", position: "top" }}
              />
              <Line
                type="monotone"
                dataKey="averageDelay"
                stroke="hsl(217.2193, 91.2195%, 59.8039%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(217.2193, 91.2195%, 59.8039%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(217.2193, 91.2195%, 59.8039%)', strokeWidth: 2 }}
              />
            </LineChart>
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
        chartTitle="Monthly Delay Trends"
        insights={monthlyTrendInsights}
      />
    </>
  );
};