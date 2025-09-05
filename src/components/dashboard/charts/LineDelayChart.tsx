import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface LineDelayChartProps {
  data: any[];
}

const lineColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export const LineDelayChart = ({ data }: LineDelayChartProps) => {
  const lines = Object.keys(data[0] || {}).filter(key => key !== 'month');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Average Delay by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Average Delay (hours)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => [`${value}h`, name]}
            />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={line}
                type="monotone"
                dataKey={line}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};