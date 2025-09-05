import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { DelayedBatchesData } from "@/types/manufacturing";

interface StackedBatchesChartProps {
  data: DelayedBatchesData[];
}

export const StackedBatchesChart = ({ data }: StackedBatchesChartProps) => {
  const chartData = data.map(item => ({
    line: item.line,
    delayed: item.delayedBatches,
    onTime: item.totalBatches - item.delayedBatches
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delayed vs On-Time Batches by Line</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="line" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Number of Batches', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="onTime" 
              stackId="a" 
              fill="hsl(var(--chart-2))" 
              name="On Time"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="delayed" 
              stackId="a" 
              fill="hsl(var(--destructive))" 
              name="Delayed"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};