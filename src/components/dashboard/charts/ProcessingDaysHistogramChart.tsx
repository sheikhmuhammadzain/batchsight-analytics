import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { ProcessingDaysHistogramData } from "@/services/api";

interface ProcessingDaysHistogramChartProps {
  data: ProcessingDaysHistogramData[];
}

export const ProcessingDaysHistogramChart = ({ data }: ProcessingDaysHistogramChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  const insights = [
    {
      title: "Processing Days Distribution",
      description: "Most batches are processed within the standard timeframe, with some outliers requiring extended processing time.",
      type: 'info' as const,
      impact: 'medium' as const,
      metrics: [
        { label: "Peak Processing Days", value: data.reduce((max, item) => item.count > max.count ? item : max, data[0])?.days || 0 },
        { label: "Total Batches", value: data.reduce((sum, item) => sum + item.count, 0) },
        { label: "Avg Days", value: (data.reduce((sum, item) => sum + (item.days * item.count), 0) / data.reduce((sum, item) => sum + item.count, 0)).toFixed(1) }
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="days" 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Processing Days', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Batch Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [`${value} batches`, 'Count']}
                labelFormatter={(label: number) => `${label} days`}
              />
              <ReferenceLine x={2} stroke="red" strokeDasharray="5 5" label="Target Threshold" />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--chart-1))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
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
