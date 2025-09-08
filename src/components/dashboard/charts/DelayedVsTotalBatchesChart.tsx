import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { InsightsButton } from "@/components/InsightsButton";
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

  const chartConfig: ChartConfig = {
    on_time_batches: {
      label: "On Time Batches",
      color: "hsla(var(--chart-2))",
    },
    delayed_batches: {
      label: "Delayed Batches",
      color: "hsl(var(--chart-1))",
    },
    delay_rate: {
      label: "Delay Rate %",
      color: "hsl(var(--chart-3))",
    },
  };

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
          <InsightsButton onClick={() => setShowInsights(true)} />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => {
                  if (name === 'delay_rate') return [`${(value as number).toFixed(1)}%`, 'Delay Rate'];
                  return [value as any, name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())];
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
          </ChartContainer>
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Delayed vs Total Batches by Line"
        insights={insights}
        aiText={data.ai_insights}
      />
    </>
  );
};
