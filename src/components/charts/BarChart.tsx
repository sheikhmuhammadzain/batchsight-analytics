"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  dataKeys: string[]
  xAxisKey: string
  title?: string
  className?: string
}

export function CustomBarChart({ 
  data, 
  config, 
  dataKeys, 
  xAxisKey, 
  title,
  className = "min-h-[200px] w-full"
}: BarChartProps) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => 
            typeof value === 'string' && value.length > 10 
              ? value.slice(0, 10) + '...' 
              : value
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {dataKeys.map((key) => (
          <Bar 
            key={key}
            dataKey={key} 
            fill={(config as any)[key]?.color || `var(--color-${key}, hsl(var(--primary)))`} 
            radius={4} 
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
