import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DelayReasonData } from "@/types/manufacturing";

interface TopDelayReasonsChartProps {
  data: DelayReasonData[];
}

export const TopDelayReasonsChart = ({ data }: TopDelayReasonsChartProps) => {
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  const chartData = sortedData.map((item, index) => ({
    ...item,
    fill: index < 3 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-7))'
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Delay Reasons</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Number of Incidents', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category"
              dataKey="reason"
              className="text-xs fill-muted-foreground"
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => [value, 'Incidents']}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};