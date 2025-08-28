"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ReferenceLine, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AreaChartProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  dataKeys: string[]
  xAxisKey: string
  title?: string
  className?: string
  stacked?: boolean
  referenceLine?: { y: number; label: string }
}

export function CustomAreaChart({ 
  data, 
  config, 
  dataKeys, 
  xAxisKey, 
  title,
  className = "min-h-[200px] w-full",
  stacked = false,
  referenceLine
}: AreaChartProps) {
  return (
    <ChartContainer config={config} className={className}>
      <AreaChart accessibilityLayer data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          tickFormatter={(value) => 
            typeof value === 'string' && value.includes('-') 
              ? value.split('-')[1] + '/' + value.split('-')[0].slice(-2)
              : value
          }
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke="hsl(217.2193, 91.2195%, 59.8039%)"
            strokeDasharray="5 5"
            label={{ value: referenceLine.label, position: "top" }}
          />
        )}
        {dataKeys.map((key, index) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            fill={(config as any)[key]?.color || `var(--color-${key}, hsl(217.2193, 91.2195%, 59.8039%))`}
            fillOpacity={0.4}
            stroke={(config as any)[key]?.color || `var(--color-${key}, hsl(217.2193, 91.2195%, 59.8039%))`}
            strokeWidth={2}
            stackId={stacked ? "a" : undefined}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
