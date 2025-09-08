import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { ProcessingDaysHistogramData } from "@/services/api";
import { useState } from "react";
import { InsightsButton } from "@/components/InsightsButton";
import { ChartInsightsModal, ChartInsight } from "../ChartInsightsModal";

interface ProcessingDaysHistogramProps {
  data: ProcessingDaysHistogramData;
}

export const ProcessingDaysHistogram = ({ data }: ProcessingDaysHistogramProps) => {
  const [showInsights, setShowInsights] = useState(false);
  // Validate data structure
  if (!data || !Array.isArray(data.counts) || !Array.isArray(data.bin_edges)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Days Distribution</CardTitle>
          <CardDescription>Loading processing days data...</CardDescription>
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
  const chartData = data.counts.map((count, index) => ({
    days: Math.round(((data.bin_edges[index] || 0) + (data.bin_edges[index + 1] || 0)) / 2 * 10) / 10,
    count: count || 0,
    range: `${(data.bin_edges[index] || 0).toFixed(1)}-${(data.bin_edges[index + 1] || 0).toFixed(1)}`
  }));

  // Basic insights
  const totalBatches = data.counts.reduce((s, c) => s + (c || 0), 0);
  const peak = chartData.reduce((max, d) => (d.count > max.count ? d : max), chartData[0] || { days: 0, count: 0 });
  const weightedSum = chartData.reduce((s, d) => s + d.days * d.count, 0);
  const avgDays = totalBatches > 0 ? weightedSum / totalBatches : 0;
  const insights: ChartInsight[] = [
    {
      title: "Processing Days Distribution",
      description: `Total of ${totalBatches.toLocaleString()} batches analyzed. Most common processing time is around ${peak.days} days. Average is ${avgDays.toFixed(1)} days (threshold: ${data.threshold} days).`,
      type: avgDays > data.threshold ? 'warning' : 'positive',
      impact: avgDays > data.threshold ? 'medium' : 'low',
      metrics: [
        { label: "Batches", value: totalBatches },
        { label: "Peak Bin (days)", value: peak.days },
        { label: "Average Days", value: avgDays.toFixed(1) }
      ],
      recommendations: [
        `Monitor tails beyond ${data.threshold} days for bottlenecks`,
        "Investigate recurring causes in high-day bins"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Processing Days Distribution</CardTitle>
            <CardDescription>
              Distribution of batch processing times
            </CardDescription>
          </div>
          <InsightsButton onClick={() => setShowInsights(true)} />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [value, 'Batch Count']}
                labelFormatter={(label: any) => `Days: ${label}`}
              />
              <ReferenceLine
                x={data.threshold}
                stroke="hsl(var(--primary))"
                strokeDasharray="5 5"
                label={{ value: "Delay Threshold", position: "top" }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Processing Days Distribution"
        insights={insights}
        aiText={data.ai_insights}
      />
    </>
  );
};