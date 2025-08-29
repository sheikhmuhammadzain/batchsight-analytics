import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { LineMonthlyAverageDelayData } from "@/services/api";
import { AIInsights } from "@/components/AIInsights";
import { CustomLineChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";

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
  const colors = [
    'hsl(217.2193, 91.2195%, 59.8039%)',
    'hsl(217.2193, 91.2195%, 66%)',
    'hsl(217.2193, 91.2195%, 52%)',
    'hsl(217.2193, 91.2195%, 74%)',
    'hsl(217.2193, 91.2195%, 45%)',
  ];

  // Create chart configuration for shadcn
  const chartConfig = uniqueLines.reduce((config, line, index) => {
    config[`line_${line}`] = {
      label: `Line ${line}`,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as Record<string, any>) satisfies ChartConfig;

  const insights = [
    {
      title: "Monthly Line Performance Trends",
      description: "Track how each production line's delay performance changes over time to identify seasonal patterns and improvement opportunities.",
      type: 'info' as const,
      impact: 'medium' as const,
      metrics: [
        { label: "Lines Tracked", value: uniqueLines.length },
        { label: "Months Analyzed", value: chartData.length },
        { label: "Data Points", value: chartData.length * uniqueLines.length }
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
            <CardTitle>Monthly Average Delay Trend</CardTitle>
            <CardDescription>
              Average processing time per month with 2-day threshold
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <CustomLineChart
              data={chartData}
              config={chartConfig}
              dataKeys={uniqueLines.slice(0, 6).map(line => `line_${line}`)}
              xAxisKey="month"
              className="h-[350px] w-full"
              showLegend={false}
              referenceLine={{ y: data.threshold, label: "2-Day Threshold" }}
            />
          </div>
          {uniqueLines.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-4 pt-4 border-t">
              {uniqueLines.slice(0, 6).map((line, index) => (
                <div key={line} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-muted-foreground">Line {line}</span>
                </div>
              ))}
              {uniqueLines.length > 6 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">+{uniqueLines.length - 6} more lines</span>
                </div>
              )}
            </div>
          )}
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
