"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface ComparisonChartProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  standardKey: string
  actualKey: string
  xAxisKey: string
  title?: string
  className?: string
  showVarianceLine?: boolean
  varianceKey?: string
}

export function ComparisonChart({ 
  data, 
  config, 
  standardKey,
  actualKey,
  xAxisKey, 
  title,
  className = "min-h-[400px] w-full",
  showVarianceLine = false,
  varianceKey = "variance"
}: ComparisonChartProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <ChartContainer config={config} className="h-[400px] w-full">
        <ComposedChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis yAxisId="left" />
          {showVarianceLine && <YAxis yAxisId="right" orientation="right" />}
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar 
            yAxisId="left"
            dataKey={standardKey} 
            fill={(config as any)[standardKey]?.color || "hsl(var(--chart-1))"}
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="left"
            dataKey={actualKey} 
            fill={(config as any)[actualKey]?.color || "hsl(var(--chart-2))"}
            radius={[4, 4, 0, 0]}
          />
          {showVarianceLine && varianceKey && (
            <Line 
              yAxisId="right"
              type="monotone"
              dataKey={varianceKey}
              stroke={(config as any)[varianceKey]?.color || "hsl(var(--destructive))"}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          )}
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
