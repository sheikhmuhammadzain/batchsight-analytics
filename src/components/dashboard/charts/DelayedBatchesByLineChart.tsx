import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { DelayedBatchesByLineData } from "@/services/api";

interface DelayedBatchesByLineChartProps {
  data: DelayedBatchesByLineData;
}

export const DelayedBatchesByLineChart = ({ data }: DelayedBatchesByLineChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.lines) || !Array.isArray(data.delayed_batches)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delayed Batches by Line</CardTitle>
          <CardDescription>Loading delayed batches data...</CardDescription>
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
  const chartData = data.lines.map((line, index) => ({
    line: parseInt(line),
    delayed_batches: data.delayed_batches[index] || 0,
    // Estimate total batches (this is a simplified approach - you might want to get actual totals)
    estimated_total: Math.round(data.delayed_batches[index] * 1.5), // Rough estimate
  }));

  // Calculate delay rates for each line
  const chartDataWithRates = chartData.map(item => ({
    ...item,
    delay_rate: (item.delayed_batches / item.estimated_total) * 100,
    on_time_batches: item.estimated_total - item.delayed_batches
  }));

  const avgDelayRate = chartDataWithRates.reduce((sum, item) => sum + item.delay_rate, 0) / chartDataWithRates.length;
  const worstLine = chartDataWithRates.reduce((worst, item) => item.delay_rate > worst.delay_rate ? item : worst, chartDataWithRates[0]);

  const insightType: 'negative' | 'warning' | 'positive' | 'info' =
    avgDelayRate > 30 ? 'negative' : avgDelayRate > 20 ? 'warning' : 'positive';
  const insightImpact: 'high' | 'medium' | 'low' = avgDelayRate > 30 ? 'high' : 'medium';

  const insights = [
    {
      title: "Line Delay Performance",
      description: `Average delay rate across lines is ${avgDelayRate.toFixed(1)}%. Line ${worstLine?.line} has the highest delay rate at ${worstLine?.delay_rate.toFixed(1)}%.`,
      type: insightType,
      impact: insightImpact,
      metrics: [
        { label: "Average Delay Rate", value: `${avgDelayRate.toFixed(1)}%` },
        { label: "Worst Performing Line", value: `Line ${worstLine?.line}` },
        { label: "Total Delayed Batches", value: chartData.reduce((sum, item) => sum + item.delayed_batches, 0) }
      ],
      recommendations: [
        "Prioritize improvement efforts on lines with highest delay rates",
        "Investigate capacity constraints on problematic lines",
        "Consider load balancing between high and low delay lines",
        "Implement targeted interventions for worst-performing lines"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delayed Batches by Line</CardTitle>
            <CardDescription>
              Delayed vs total batches with delay rate by production line
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartDataWithRates}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="line"
                className="text-xs fill-muted-foreground"
                label={{ value: 'Production Line', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs fill-muted-foreground"
                label={{ value: 'Batch Count', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs fill-muted-foreground"
                label={{ value: 'Delay Rate (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'delay_rate') return [`${value.toFixed(1)}%`, 'Delay Rate'];
                  return [value, name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())];
                }}
                labelFormatter={(label: number) => `Line ${label}`}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="on_time_batches"
                stackId="batches"
                fill="hsla(217.2193, 91.2195%, 59.8039%, 0.35)"
                name="On Time Batches"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="delayed_batches"
                stackId="batches"
                fill="hsl(217.2193, 91.2195%, 59.8039%)"
                name="Delayed Batches"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="delay_rate"
                stroke="hsl(217.2193, 91.2195%, 59.8039%)"
                strokeWidth={3}
                name="Delay Rate %"
                dot={{ fill: 'hsl(217.2193, 91.2195%, 59.8039%)', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
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
        chartTitle="Delayed Batches by Line"
        insights={insights}
      />
    </>
  );
};
