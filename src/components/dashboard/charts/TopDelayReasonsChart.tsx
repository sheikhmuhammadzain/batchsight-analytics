import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { TopDelayReasonsData } from "@/services/api";

interface TopDelayReasonsChartProps {
  data: TopDelayReasonsData;
}

export const TopDelayReasonsChart = ({ data }: TopDelayReasonsChartProps) => {
  // Validate data structure
  if (!data || !data.top_delay_reasons || !Array.isArray(data.top_delay_reasons)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Delay Reasons</CardTitle>
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

  // Transform data for chart (keep incoming order)
  const chartData = data.top_delay_reasons.map((item, index) => ({
    reason: item.REASON,
    count: item.count,
    sharePercent: item.share_percent,
    fill: 'hsl(217.2193, 91.2195%, 59.8039%)'
  }));

  const totalIncidents = chartData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...chartData.map((d) => d.count));

  const formatCount = (v: number) =>
    v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Delay Reasons</CardTitle>
        <CardDescription>
          Top 10 delay causes ranked by incident count (threshold: {data.threshold_days} days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={440}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-xs fill-muted-foreground"
              domain={[0, Math.ceil(maxCount * 1.1)]}
              tickFormatter={formatCount}
              label={{ value: 'Number of Incidents', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="category"
              dataKey="reason"
              className="text-xs fill-muted-foreground"
              width={240}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'count') return [value.toLocaleString(), 'Incidents'];
                if (name === 'sharePercent') return [`${value}%`, 'Share'];
                return [value, name];
              }}
              labelFormatter={(label: string) => `Reason: ${label}`}
            />
            <Bar
              dataKey="count"
              radius={[0, 2, 2, 0]}
              fill="hsl(217.2193, 91.2195%, 59.8039%)"
            >
              <LabelList dataKey="count" position="right" formatter={(v: number) => v.toLocaleString()} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Total Incidents:</strong> {totalIncidents.toLocaleString()}
            </div>
            <div>
              <strong>Top Reason:</strong> {chartData[0]?.reason} ({chartData[0]?.sharePercent}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};