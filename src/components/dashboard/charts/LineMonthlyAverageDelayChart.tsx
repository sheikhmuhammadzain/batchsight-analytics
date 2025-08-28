import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { LineMonthlyAverageDelayData } from "@/services/api";
import { AIInsights } from "@/components/AIInsights";

interface LineMonthlyAverageDelayChartProps {
  data: LineMonthlyAverageDelayData;
}

export const LineMonthlyAverageDelayChart = ({ data }: LineMonthlyAverageDelayChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.months) || !data.lines || typeof data.lines !== 'object') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Monthly Average Delay</CardTitle>
          <CardDescription>Loading line monthly delay data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data from API format to chart format
  const chartData = data.months.map((month, monthIndex) => {
    const dataPoint: any = { month };
    Object.keys(data.lines).forEach(lineKey => {
      const lineData = data.lines[lineKey];
      if (Array.isArray(lineData) && lineData[monthIndex] !== undefined) {
        dataPoint[`line_${lineKey}`] = lineData[monthIndex];
      }
    });
    return dataPoint;
  });

  const uniqueLines = Object.keys(data.lines).map(key => parseInt(key)).sort((a, b) => a - b);
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const insights = [
    {
      title: "Monthly Line Performance Trends",
      description: "Track how each production line's delay performance changes over time to identify seasonal patterns and improvement opportunities.",
      type: 'info' as const,
      impact: 'medium' as const,
      metrics: [
        { label: "Lines Tracked", value: uniqueLines.length },
        { label: "Months Analyzed", value: chartData.length },
        { label: "Data Points", value: data.length }
      ],
      recommendations: [
        "Identify lines with consistently high delays across months",
        "Look for seasonal patterns in line performance",
        "Compare improvement trajectories between different lines",
        "Focus on lines showing deteriorating trends"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Line Monthly Average Delay</CardTitle>
            <CardDescription>
              Monthly delay trends by production line (threshold: {data.threshold} days)
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Average Delay (Days)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [
                  `${value?.toFixed(1)} days`,
                  name.replace('line_', 'Line ')
                ]}
              />
              <ReferenceLine
                y={data.threshold}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                label={{ value: "Delay Threshold", position: "top" }}
              />
              <Legend />
              {uniqueLines.map((line, index) => (
                <Line
                  key={line}
                  type="monotone"
                  dataKey={`line_${line}`}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={`Line ${line}`}
                />
              ))}
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
        chartTitle="Line Monthly Average Delay"
        insights={insights}
      />
    </>
  );
};
