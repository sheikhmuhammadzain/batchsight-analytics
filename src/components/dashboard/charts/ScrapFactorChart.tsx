import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { useChartInsights } from "@/hooks/useChartInsights";
import { ScrapFactorData } from "@/types/manufacturing";
import { InsightsButton } from "@/components/InsightsButton";

interface ScrapFactorChartProps {
  data: ScrapFactorData[];
}

export const ScrapFactorChart = ({ data }: ScrapFactorChartProps) => {
  const [showInsights, setShowInsights] = useState(false);
  
  // Calculate scrap analytics from data
  const scrapAnalytics = {
    avgScrapFactor: data.reduce((sum, d) => sum + d.scrapFactor, 0) / data.length,
    scrapByLine: data.map(d => ({
      line: parseInt(d.line),
      avgScrap: d.scrapFactor,
      batchCount: 100 // This would come from actual data
    }))
  };

  const { scrapFactorInsights } = useChartInsights(undefined, scrapAnalytics);

  const getBarColor = (scrapFactor: number) => {
    if (scrapFactor > 0.03) return "hsl(var(--destructive))";
    if (scrapFactor > 0.025) return "hsl(var(--warning))";
    return "hsl(var(--chart-2))";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Line Scrap Factor Analysis</CardTitle>
            <CardDescription>
              Material waste percentage by production line
            </CardDescription>
          </div>
          <InsightsButton onClick={() => setShowInsights(true)} />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="line"
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'Scrap Factor', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '6px'
                }}
                formatter={(value: number) => [
                  `${(value * 100).toFixed(2)}%`,
                  'Scrap Factor'
                ]}
                labelFormatter={(value) => `Line: ${value}`}
              />
              <Bar 
                dataKey="scrapFactor" 
                fill="hsl(217.2193, 91.2195%, 59.8039%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle="Scrap Factor Analysis"
        insights={scrapFactorInsights}
      />
    </>
  );
};