import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ProcessingDaysData } from "@/types/manufacturing";

interface ProcessingDaysHistogramProps {
  data: ProcessingDaysData[];
}

export const ProcessingDaysHistogram = ({ data }: ProcessingDaysHistogramProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Days Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--chart-1))"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};