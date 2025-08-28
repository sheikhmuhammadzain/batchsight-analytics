import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScrapDelayData {
  category: string;
  avgScrapFactor: number;
  batchCount: number;
}

interface ScrapDelayCorrelationChartProps {
  data: ScrapDelayData[];
  title?: string;
}

export const ScrapDelayCorrelationChart = ({ data, title = "Scrap Factor: Delayed vs On-Time Batches" }: ScrapDelayCorrelationChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Comparison of average scrap factors between delayed and on-time batches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Avg Scrap Factor"]}
              labelFormatter={(label) => `Batch Status: ${label}`}
            />
            <Bar 
              dataKey="avgScrapFactor" 
              fill="#82ca9d"
              name="Avg Scrap Factor"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
