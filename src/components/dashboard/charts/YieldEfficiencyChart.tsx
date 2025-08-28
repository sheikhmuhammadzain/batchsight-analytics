import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface YieldData {
  range: string;
  count: number;
}

interface YieldEfficiencyChartProps {
  data: YieldData[];
  title?: string;
}

export const YieldEfficiencyChart = ({ data, title = "Yield Efficiency Distribution" }: YieldEfficiencyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Distribution of batch yield efficiency (Actual/Planned output ratio)
        </CardDescription>
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
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
