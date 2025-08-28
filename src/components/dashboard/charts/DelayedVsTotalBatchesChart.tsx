import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { DelayedVsTotalBatchesData } from "@/services/api";

interface DelayedVsTotalBatchesChartProps {
  data: DelayedVsTotalBatchesData;
}

export const DelayedVsTotalBatchesChart = ({ data }: DelayedVsTotalBatchesChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Transform data from API format to chart format
  const chartData = data.lines.map((line, index) => ({
    line,
    total_batches: data.total_batches[index],
    delayed_batches: data.delayed_batches[index],
    on_time_batches: data.on_time_batches[index],
    delay_rate: (data.delayed_batches[index] / data.total_batches[index]) * 100
  }));

  const avgDelayRate = chartData.reduce((sum, item) => sum + item.delay_rate, 0) / chartData.length;
  const totalBatches = chartData.reduce((sum, item) => sum + item.total_batches, 0);
  const totalDelayed = chartData.reduce((sum, item) => sum + item.delayed_batches, 0);

  const insightType: 'negative' | 'warning' | 'positive' | 'info' =
    avgDelayRate > 25 ? 'negative' : avgDelayRate > 15 ? 'warning' : 'positive';
  const insightImpact: 'high' | 'medium' | 'low' = avgDelayRate > 25 ? 'high' : 'medium';

  const insights = [
    {
      title: "Line Performance Analysis",
      description: `Overall delay rate is ${((totalDelayed / totalBatches) * 100).toFixed(1)}% across all production lines. Average delay rate per line is ${avgDelayRate.toFixed(1)}%.`,
      type: insightType,
      impact: insightImpact,
      metrics: [
        { label: "Total Batches", value: totalBatches },
        { label: "Total Delayed", value: totalDelayed },
        { label: "Overall Delay Rate", value: `${((totalDelayed / totalBatches) * 100).toFixed(1)}%` }
      ],
      recommendations: [
        "Focus improvement efforts on high-workload lines (1-10) for maximum impact",
        "Investigate low-delay, low-volume lines for best practices",
        "Monitor capacity strain in medium-workload lines (11-19)",
        "Address systemic inefficiencies beyond just workload considerations"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delayed vs Total Batches by Line</CardTitle>
            <CardDescription>
              Comparison of delayed and total batch volumes across production lines
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
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="line"
                className="text-xs fill-muted-foreground"
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
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="on_time_batches" 
                stackId="batches"
                fill="hsla(217.2193, 91.2195%, 59.8039%, 0.35)" 
                name="On Time Batches"
              />
              <Bar 
                yAxisId="left"
                dataKey="delayed_batches" 
                stackId="batches"
                fill="hsl(217.2193, 91.2195%, 59.8039%)" 
                name="Delayed Batches"
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
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Delayed vs Total Batches by Line"
        insights={insights}
      />
    </>
  );
};
