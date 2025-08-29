import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { ChartInsightsModal } from "../ChartInsightsModal";
import { useChartInsights } from "@/hooks/useChartInsights";

interface YieldData {
  range: string;
  count: number;
}

interface YieldEfficiencyChartProps {
  data: YieldData[];
  title?: string;
}

export const YieldEfficiencyChart = ({ data, title = "Yield Efficiency Distribution" }: YieldEfficiencyChartProps) => {
  const [showInsights, setShowInsights] = useState(false);
  
  // Calculate yield analytics from data
  const totalBatches = data.reduce((sum, d) => sum + d.count, 0);
  const yieldAnalytics = {
    avgYield: 0.85, // This would be calculated from actual data
    totalPlanned: 100000,
    totalActual: 85000,
    yieldDistribution: data
  };

  const { yieldEfficiencyInsights } = useChartInsights(undefined, undefined, yieldAnalytics);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Distribution of batch yield efficiency (Actual/Planned output ratio)
            </CardDescription>
          </div>
            
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, "Batch Count"]}
                labelFormatter={(label) => `Yield Range: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#8884d8"
                name="Batches"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <ChartInsightsModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        chartTitle={title}
        insights={yieldEfficiencyInsights}
      />
    </>
  );
};
