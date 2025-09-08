import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TopDelayFormulasData } from "@/services/api";
import { InsightsButton } from "@/components/InsightsButton";
import { useState } from "react";
import { ChartInsightsModal, ChartInsight } from "../ChartInsightsModal";

interface TopDelayFormulasChartProps {
  data: TopDelayFormulasData;
}

export const TopDelayFormulasChart = ({ data }: TopDelayFormulasChartProps) => {
  const [showInsights, setShowInsights] = useState(false);
  // Validate data structure
  if (!data || !Array.isArray(data.formula_ids) || !Array.isArray(data.delay_rates)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Delay Formulas</CardTitle>
          <CardDescription>Loading formula delay data...</CardDescription>
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
  const chartData = data.formula_ids.map((formulaId, index) => ({
    formula: formulaId,
    delayRate: data.delay_rates[index] || 0,
  }));

  // Calculate cumulative percentages for Pareto analysis
  const totalDelay = chartData.reduce((sum, item) => sum + item.delayRate, 0);
  let cumulativeSum = 0;
  const chartDataWithCumulative = chartData.map((item) => {
    cumulativeSum += item.delayRate;
    return {
      ...item,
      cumulativePercentage: (cumulativeSum / totalDelay) * 100,
    };
  });

  const top = chartData[0];
  const avg = chartData.reduce((s, d) => s + d.delayRate, 0) / chartData.length;
  const insights: ChartInsight[] = [
    {
      title: "Top Delay Formulas (Pareto)",
      description: `Average delay rate among top formulas is ${avg.toFixed(1)}%. Highest is ${top?.delayRate ?? 0}% for formula ${top?.formula ?? ''}.`,
      type: 'info',
      impact: 'medium',
      metrics: [
        { label: "Average Delay Rate", value: `${avg.toFixed(1)}%` },
        { label: "Top Formula", value: top?.formula ?? 'N/A' },
        { label: "Top Formula Rate", value: `${top?.delayRate ?? 0}%` },
      ],
      recommendations: [
        "Prioritize investigation of highest-delay formulas",
        "Review recipe and process parameters for top contributors",
        "Implement targeted corrective actions and monitor impact",
      ]
    }
  ];

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Delay Formulas (Pareto Analysis)</CardTitle>
          <CardDescription>
            Formula delay rates ranked by performance impact
          </CardDescription>
        </div>
        <InsightsButton onClick={() => setShowInsights(true)} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartDataWithCumulative}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formula"
              className="text-xs fill-muted-foreground"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Delay Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'cumulativePercentage') return [`${value.toFixed(1)}%`, 'Cumulative %'];
                return [`${value}%`, 'Delay Rate'];
              }}
              labelFormatter={(label: string) => `Formula ${label}`}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="delayRate"
              fill="hsl(217.2193, 91.2195%, 59.8039%)"
              name="Delay Rate %"
              radius={[2, 2, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <ChartInsightsModal
      isOpen={showInsights}
      onClose={() => setShowInsights(false)}
      chartTitle="Top Delay Formulas"
      insights={insights}
      aiText={data.ai_insights}
    />
    </>
  );
};