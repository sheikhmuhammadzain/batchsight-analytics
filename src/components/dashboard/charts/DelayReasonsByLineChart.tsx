import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { DelayReasonsByLineData } from "@/services/api";
import { useState } from "react";
import { ChartInsightsModal, ChartInsight } from "../ChartInsightsModal";
import { InsightsButton } from "@/components/InsightsButton";
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";

interface DelayReasonsByLineChartProps {
  data: DelayReasonsByLineData;
}

const lineColors = [
  'hsl(var(--primary))',
  'hsl(var(--primary) / 0.9)',
  'hsl(var(--primary) / 0.8)',
  'hsl(var(--primary) / 0.7)',
  'hsl(var(--primary) / 0.6)',
  'hsl(var(--primary) / 0.5)',
  'hsl(var(--primary) / 0.4)',
  'hsl(var(--primary) / 0.3)',
  'hsl(var(--primary) / 0.2)',
  'hsl(var(--primary) / 0.1)'
];

export const DelayReasonsByLineChart = ({ data }: DelayReasonsByLineChartProps) => {
  const [showInsights, setShowInsights] = useState(false);
  // Validate data structure
  if (!data || !data.delay_reasons_by_line || typeof data.delay_reasons_by_line !== 'object') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delay Reasons by Production Line</CardTitle>
          <CardDescription>Loading delay reasons data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all unique delay reasons across all lines
  const allReasons = new Set<string>();
  Object.values(data.delay_reasons_by_line).forEach((lineReasons: Record<string, number>) => {
    Object.keys(lineReasons).forEach(reason => allReasons.add(reason));
  });

  // Transform data for stacked bar chart
  const chartData = Array.from(allReasons).map(reason => {
    const dataPoint: any = { reason };
    Object.keys(data.delay_reasons_by_line).forEach(line => {
      dataPoint[`line_${line}`] = data.delay_reasons_by_line[line][reason] || 0;
    });
    return dataPoint;
  });

  const lines = Object.keys(data.delay_reasons_by_line).sort((a, b) => parseInt(a) - parseInt(b));

  // Build simple insights
  const totalsByReason: Record<string, number> = {};
  Object.values(data.delay_reasons_by_line).forEach((lineReasons: Record<string, number>) => {
    Object.entries(lineReasons).forEach(([reason, count]) => {
      totalsByReason[reason] = (totalsByReason[reason] || 0) + count;
    });
  });
  const totalIncidents = Object.values(totalsByReason).reduce((s, v) => s + v, 0);
  const topReason = Object.entries(totalsByReason).sort((a, b) => b[1] - a[1])[0];
  const insights: ChartInsight[] = [
    {
      title: "Delay Reasons Overview",
      description: `Aggregated across lines, total incidents are ${totalIncidents.toLocaleString()}. Top reason is ${topReason?.[0] ?? 'N/A'} with ${topReason?.[1] ?? 0} incidents. Threshold: ${data.threshold_days} days.`,
      type: 'info',
      impact: 'medium',
      metrics: [
        { label: "Total Incidents", value: totalIncidents },
        { label: "Top Reason", value: topReason?.[0] ?? 'N/A' },
        { label: "Top Reason Count", value: topReason?.[1] ?? 0 }
      ],
      recommendations: [
        "Prioritize root-cause actions for the top 3 reasons",
        "Align preventive measures with lines most impacted",
        "Track reduction week-over-week"
      ]
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delay Reasons by Production Line</CardTitle>
            <CardDescription>
              Breakdown of delay causes across production lines (threshold: {data.threshold_days} days)
            </CardDescription>
          </div>
          <InsightsButton onClick={() => setShowInsights(true)} />
        </CardHeader>
        <CardContent>
          {/* Provide ChartContainer context so ChartTooltipContent can render */}
          {(() => {
            const chartConfig = lines.reduce((cfg, line, idx) => {
              cfg[`line_${line}`] = {
                label: `Line ${line}`,
                color: lineColors[idx % lineColors.length],
              };
              return cfg;
            }, {} as Record<string, any>) satisfies ChartConfig;

            return (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="reason"
                    className="text-xs fill-muted-foreground"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    label={{ value: 'Number of Incidents', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(label: string) => label}
                    formatter={(value: number, name: string) => {
                      // Hide zero-value lines to reduce noise
                      if (!value) return null
                      return [Number(value), name.replace('line_', 'Line ')]
                    }}
                    itemSorter={(item: any) => -((item?.value ?? 0) as number)}
                  />
                  <Legend />
                  {lines.map((line, index) => (
                    <Bar
                      key={line}
                      dataKey={`line_${line}`}
                      stackId="reasons"
                      fill={lineColors[index % lineColors.length]}
                      name={`Line ${line}`}
                      radius={index === lines.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            );
          })()}
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Delay Reasons by Production Line"
        insights={insights}
      />
    </>
  );
};