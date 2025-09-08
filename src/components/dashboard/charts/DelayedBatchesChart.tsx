import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DelayedBatchesData } from "@/types/manufacturing";
import { useState } from "react";
import { InsightsButton } from "@/components/InsightsButton";
import { ChartInsightsModal, ChartInsight } from "../ChartInsightsModal";

interface DelayedBatchesChartProps {
  data: DelayedBatchesData[];
}

export const DelayedBatchesChart = ({ data }: DelayedBatchesChartProps) => {
  const [showInsights, setShowInsights] = useState(false);
  const sortedData = [...data].sort((a, b) => b.delayedBatches - a.delayedBatches);

  const totalDelayed = sortedData.reduce((s, d) => s + d.delayedBatches, 0);
  const top = sortedData[0];
  const insights: ChartInsight[] = [
    {
      title: "Delayed Batches by Line",
      description: `Total delayed batches: ${totalDelayed.toLocaleString()}. Worst performing line: ${top?.line} with ${top?.delayedBatches} delayed batches.`,
      type: 'info',
      impact: 'medium',
      metrics: [
        { label: "Total Delayed", value: totalDelayed },
        { label: "Worst Line", value: top?.line ?? 'N/A' },
        { label: "Worst Line Delayed", value: top?.delayedBatches ?? 0 },
      ],
      recommendations: [
        "Prioritize top delayed lines for root-cause analysis",
        "Check capacity and scheduling constraints on worst lines",
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delayed Batches by Production Line</CardTitle>
          <InsightsButton onClick={() => setShowInsights(true)} />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number"
                className="text-xs fill-muted-foreground"
                label={{ value: 'Number of Delayed Batches', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="category"
                dataKey="line"
                className="text-xs fill-muted-foreground"
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '6px'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} batches`,
                  'Delayed Batches'
                ]}
                labelFormatter={(label: any) => `Line ${label}`}
              />
              <Bar 
                dataKey="delayedBatches" 
                fill="hsl(var(--destructive))"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Delayed Batches by Production Line"
        insights={insights}
      />
    </>
  );
};