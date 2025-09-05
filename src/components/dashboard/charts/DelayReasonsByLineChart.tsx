import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { DelayReasonsByLineData } from "@/services/api";

interface DelayReasonsByLineChartProps {
  data: DelayReasonsByLineData;
}

const lineColors = [
  'hsl(217.2193, 91.2195%, 59.8039%)',
  'hsl(217.2193, 91.2195%, 66%)',
  'hsl(217.2193, 91.2195%, 52%)',
  'hsl(217.2193, 91.2195%, 74%)',
  'hsl(217.2193, 91.2195%, 45%)',
  'hsl(217.2193, 91.2195%, 82%)',
  'hsl(217.2193, 91.2195%, 38%)',
  'hsl(217.2193, 91.2195%, 88%)',
  'hsl(217.2193, 91.2195%, 31%)',
  'hsl(217.2193, 91.2195%, 93%)'
];

export const DelayReasonsByLineChart = ({ data }: DelayReasonsByLineChartProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delay Reasons by Production Line</CardTitle>
        <CardDescription>
          Breakdown of delay causes across production lines (threshold: {data.threshold_days} days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
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
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => [
                value,
                name.replace('line_', 'Line ')
              ]}
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};