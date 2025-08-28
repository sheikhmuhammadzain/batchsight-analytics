import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { LineScrapFactorData } from "@/services/api";

interface LineScrapFactorChartProps {
  data: LineScrapFactorData;
}

export const LineScrapFactorChart = ({ data }: LineScrapFactorChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.lines) || !Array.isArray(data.avg_scrap_factor)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Scrap Factor</CardTitle>
          <CardDescription>Loading scrap factor data...</CardDescription>
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
    scrap_factor: data.avg_scrap_factor[index] || 0,
  }));

  const avgScrapFactor = chartData.reduce((sum, item) => sum + item.scrap_factor, 0) / chartData.length;
  const maxScrapFactor = Math.max(...chartData.map(item => item.scrap_factor));
  const highScrapLines = chartData.filter(item => item.scrap_factor > 0.03).length;

  const insights = [
    {
      title: "Line Scrap Factor Analysis",
      description: `Average scrap factor is ${(avgScrapFactor * 100).toFixed(2)}%. ${highScrapLines} lines exceed the 3% threshold.`,
      type: avgScrapFactor > 0.035 ? 'negative' : avgScrapFactor > 0.025 ? 'warning' : 'positive' as const,
      impact: avgScrapFactor > 0.035 ? 'high' : 'medium' as const,
      metrics: [
        { label: "Average Scrap Factor", value: `${(avgScrapFactor * 100).toFixed(2)}%` },
        { label: "Highest Scrap Factor", value: `${(maxScrapFactor * 100).toFixed(2)}%` },
        { label: "Lines Above 3%", value: highScrapLines }
      ],
      recommendations: [
        "Focus on lines with scrap factors above 3%",
        "Investigate material handling procedures on high-scrap lines",
        "Implement quality control measures to reduce waste",
        "Share best practices from low-scrap performing lines"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Line Scrap Factor</CardTitle>
            <CardDescription>
              Material waste percentage by production line
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="line" 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Production Line', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Scrap Factor (%)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Scrap Factor']}
                labelFormatter={(label: number) => `Line ${label}`}
              />
              <ReferenceLine y={0.03} stroke="red" strokeDasharray="5 5" label="3% Threshold" />
              <Bar
                dataKey="scrap_factor"
                fill="hsl(var(--chart-3))"
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
        chartTitle="Line Scrap Factor"
        insights={insights}
      />
    </>
  );
};
