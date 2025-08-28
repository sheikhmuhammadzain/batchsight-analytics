import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DelayReasonsByLineChartProps {
  data: any[];
}

const lineColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export const DelayReasonsByLineChart = ({ data }: DelayReasonsByLineChartProps) => {
  const lines = Object.keys(data[0] || {}).filter(key => key !== 'reason');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delay Reasons by Production Line</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="reason" 
              className="text-xs fill-muted-foreground"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Number of Incidents', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            {lines.map((line, index) => (
              <Bar
                key={line}
                dataKey={line}
                fill={lineColors[index % lineColors.length]}
                radius={index === lines.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};