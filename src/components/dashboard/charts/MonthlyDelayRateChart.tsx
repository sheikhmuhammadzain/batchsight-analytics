import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface MonthlyDelayRateChartProps {
  data: { month: string; delayRate: number }[];
}

export const MonthlyDelayRateChart = ({ data }: MonthlyDelayRateChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Delay Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="delayRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-6))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-6))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              label={{ value: 'Delay Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => [`${value}%`, 'Delay Rate']}
            />
            <Area 
              type="monotone" 
              dataKey="delayRate" 
              stroke="hsl(var(--chart-6))"
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#delayRateGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};