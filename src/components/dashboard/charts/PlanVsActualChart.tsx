import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface PlanActualData {
  planned: number;
  actual: number;
  batchId: string;
}

interface PlanVsActualChartProps {
  data: PlanActualData[];
  title?: string;
}

export const PlanVsActualChart = ({ data, title = "Plan vs Actual Production" }: PlanVsActualChartProps) => {
  // Filter out extreme outliers for better visualization
  const filteredData = data.filter(d => 
    d.planned > 0 && d.actual > 0 && 
    d.planned < 10000 && d.actual < 10000 &&
    d.actual / d.planned < 5 && d.actual / d.planned > 0.1
  );

  const maxValue = Math.max(
    ...filteredData.map(d => Math.max(d.planned, d.actual))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Comparison of planned vs actual production quantities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="planned" 
              type="number"
              name="Planned Qty"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              dataKey="actual" 
              type="number"
              name="Actual Qty"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => [value, name === "actual" ? "Actual Qty" : "Planned Qty"]}
              labelFormatter={() => ""}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p>Batch: {data.batchId}</p>
                      <p>Planned: {data.planned}</p>
                      <p>Actual: {data.actual}</p>
                      <p>Efficiency: {((data.actual / data.planned) * 100).toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              dataKey="actual" 
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <ReferenceLine 
              segment={[{ x: 0, y: 0 }, { x: maxValue, y: maxValue }]}
              stroke="red" 
              strokeDasharray="5 5"
              label={{ value: "Perfect Execution", position: "topLeft" }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
