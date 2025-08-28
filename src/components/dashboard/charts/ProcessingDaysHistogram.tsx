import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { ProcessingDaysHistogramData } from "@/services/api";
import { AIInsights } from "@/components/AIInsights";

interface ProcessingDaysHistogramProps {
  data: ProcessingDaysHistogramData;
}

export const ProcessingDaysHistogram = ({ data }: ProcessingDaysHistogramProps) => {
  // Validate data structure
  if (!data || !Array.isArray(data.counts) || !Array.isArray(data.bin_edges)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Days Distribution</CardTitle>
          <CardDescription>Loading processing days data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform API data into chart format
  const chartData = data.counts.map((count, index) => ({
    days: Math.round(((data.bin_edges[index] || 0) + (data.bin_edges[index + 1] || 0)) / 2 * 10) / 10,
    count: count || 0,
    range: `${(data.bin_edges[index] || 0).toFixed(1)}-${(data.bin_edges[index + 1] || 0).toFixed(1)}`
  }));

    return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Days Distribution</CardTitle>
        {data.ai_insights && (
          <div className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
            <AIInsights text={data.ai_insights} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="days"
              className="text-xs fill-muted-foreground"
              label={{ value: 'Processing Days', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              label={{ value: 'Batch Count', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string, props: any) => [
                value,
                'Batch Count',
                `Range: ${props.payload.range}`
              ]}
            />
            <ReferenceLine
              x={data.threshold}
              stroke="hsl(217.2193, 91.2195%, 59.8039%)"
              strokeDasharray="5 5"
              label={{ value: "Delay Threshold", position: "top" }}
            />
            <Bar
              dataKey="count"
              fill="hsl(217.2193, 91.2195%, 59.8039%)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};