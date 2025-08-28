import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { AIInsights } from "@/components/AIInsights";
import { useChartInsights } from "@/hooks/useChartInsights";
import { DelayShareData } from "@/services/api";

interface DelayShareChartProps {
  data: DelayShareData;
}

const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--destructive))'];

export const DelayShareChart = ({ data }: DelayShareChartProps) => {
  const [showInsights, setShowInsights] = useState(false);

  // Validate data structure
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.percentages)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delay Share Distribution</CardTitle>
          <CardDescription>Loading delay share data...</CardDescription>
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
  const chartData = data.categories.map((category, index) => ({
    name: category,
    value: Math.round((data.percentages[index] || 0) * 10) / 10, // Round to 1 decimal
    percentage: data.percentages[index] || 0
  }));

  // Calculate delay analytics from data
  const delayedIndex = data.categories.indexOf("Delayed");
  const onTimeIndex = data.categories.indexOf("On Time");

  const delayAnalytics = {
    totalBatches: 1000, // This would need to be calculated from actual data
    delayedBatches: Math.round((data.percentages[delayedIndex] / 100) * 1000),
    onTimeBatches: Math.round((data.percentages[onTimeIndex] / 100) * 1000),
    delayRate: data.percentages[delayedIndex],
    avgProcessingDays: data.threshold_days + 0.5 // Estimate based on threshold
  };

  const { delayShareInsights } = useChartInsights(delayAnalytics);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percentage * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delay Share Distribution</CardTitle>
            <CardDescription>
              Percentage of batches delayed vs on-time (threshold: {data.threshold_days} days)
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
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string) => [
                  `${value}% (${Math.round((value / 100) * 1000)} batches)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
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
        chartTitle="Delay Share Distribution"
        insights={delayShareInsights}
      />
    </>
  );
};