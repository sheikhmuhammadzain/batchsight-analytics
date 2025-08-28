import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DelayedBatchesData } from "@/types/manufacturing";

interface DelayedBatchesChartProps {
  data: DelayedBatchesData[];
}

export const DelayedBatchesChart = ({ data }: DelayedBatchesChartProps) => {
  const sortedData = [...data].sort((a, b) => b.delayedBatches - a.delayedBatches);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delayed Batches by Production Line</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Number of Delayed Batches', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category"
              dataKey="line"
              className="text-xs fill-muted-foreground"
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} batches (${((value / props.payload.totalBatches) * 100).toFixed(1)}%)`,
                'Delayed Batches'
              ]}
            />
            <Bar 
              dataKey="delayedBatches" 
              fill="hsl(var(--destructive))"
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};