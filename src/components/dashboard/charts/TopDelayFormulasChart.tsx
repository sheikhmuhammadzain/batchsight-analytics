import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TopDelayFormulasData } from "@/types/manufacturing";

interface TopDelayFormulasChartProps {
  data: TopDelayFormulasData[];
}

export const TopDelayFormulasChart = ({ data }: TopDelayFormulasChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Delay Formulas (Pareto Analysis)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
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
              label={{ value: 'Delay Count', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="delayCount" 
              fill="hsl(var(--chart-4))" 
              name="Delay Count"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulativePercentage" 
              stroke="hsl(var(--destructive))"
              strokeWidth={3}
              name="Cumulative %"
              dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};