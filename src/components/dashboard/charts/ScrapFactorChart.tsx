import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ScrapFactorData } from "@/types/manufacturing";

interface ScrapFactorChartProps {
  data: ScrapFactorData[];
}

export const ScrapFactorChart = ({ data }: ScrapFactorChartProps) => {
  const chartData = data.map((item, index) => ({
    ...item,
    x: index + 1,
    y: item.scrapFactor
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Scrap Factor Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="category"
              dataKey="line"
              className="text-xs fill-muted-foreground"
              name="Production Line"
            />
            <YAxis 
              type="number"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Scrap Factor (%)', angle: -90, position: 'insideLeft' }}
              name="Scrap Factor"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}% (Severity: ${props.payload.severity})`,
                'Scrap Factor'
              ]}
              labelFormatter={(value) => `Line: ${value}`}
            />
            <Scatter 
              dataKey="scrapFactor" 
              fill="hsl(var(--chart-5))"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};