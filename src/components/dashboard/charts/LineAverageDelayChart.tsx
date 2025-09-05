import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { LineAverageDelayData } from "@/services/api";

interface LineAverageDelayChartProps {
  data: LineAverageDelayData;
}

export const LineAverageDelayChart = ({ data }: LineAverageDelayChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.lines) || !Array.isArray(data.avg_processing_days)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Average Delay</CardTitle>
          <CardDescription>Loading line average delay data...</CardDescription>
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
  const chartData = data.lines.map((line, index) => ({
    line: line,
    average_delay: Math.round((data.avg_processing_days[index] || 0) * 10) / 10, // Round to 1 decimal
    avg_processing_days: data.avg_processing_days[index] || 0
  }));

  const avgDelay = data.avg_processing_days.reduce((sum, delay) => sum + delay, 0) / data.avg_processing_days.length;
  const maxDelay = Math.max(...data.avg_processing_days);
  const problematicLines = data.avg_processing_days.filter(delay => delay > data.threshold).length;

  const insights = [
    {
      title: "Line Performance Analysis",
      description: `Average delay across all lines is ${avgDelay.toFixed(1)} days. ${problematicLines} lines exceed the ${data.threshold}-day threshold.`,
      type: problematicLines > data.lines.length / 2 ? 'negative' as const : problematicLines > 0 ? 'warning' as const : 'positive' as const,
      impact: problematicLines > data.lines.length / 2 ? 'high' as const : 'medium' as const,
      metrics: [
        { label: "Average Delay", value: `${avgDelay.toFixed(1)} days` },
        { label: "Worst Line", value: `${maxDelay.toFixed(1)} days` },
        { label: "Lines Above Threshold", value: `${problematicLines} lines` }
      ],
      recommendations: [
        `Focus improvement efforts on lines with delays > ${data.threshold} days`,
        "Investigate root causes for high-delay production lines",
        "Share best practices from fastest-performing lines",
        "Consider resource reallocation to balance line performance"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Line Average Delay</CardTitle>
            <CardDescription>
              Average processing delay by production line (threshold: {data.threshold} days)
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="line"
                className="text-xs fill-muted-foreground"
                label={{ value: 'Production Line', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                label={{ value: 'Average Delay (Days)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)} days`, 'Average Delay']}
                labelFormatter={(label: string) => `Line ${label}`}
              />
              <ReferenceLine
                y={data.threshold}
                stroke="hsl(217.2193, 91.2195%, 59.8039%)"
                strokeDasharray="5 5"
                label={{ value: "Delay Threshold", position: "top" }}
              />
              <Bar
                dataKey="average_delay"
                fill="hsl(217.2193, 91.2195%, 59.8039%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
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
        chartTitle="Line Average Delay"
        insights={insights}
      />
    </>
  );
};
