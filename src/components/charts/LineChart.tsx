"use client"

import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  dataKeys: string[]
  xAxisKey: string
  title?: string
  className?: string
  showLegend?: boolean
  referenceLine?: { y: number; label: string }
}

export function CustomLineChart({ 
  data, 
  config, 
  dataKeys, 
  xAxisKey, 
  title,
  className = "min-h-[200px] w-full",
  showLegend = true,
  referenceLine
}: LineChartProps) {
  return (
    <ChartContainer config={config} className={className}>
      <LineChart accessibilityLayer data={data}>
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
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && (
          <ChartLegend 
            content={<ChartLegendContent />} 
            wrapperStyle={{ paddingTop: "20px" }}
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
          />
        )}
        {referenceLine && (
          <ReferenceLine
            y={referenceLine.y}
            stroke="hsl(217.2193, 91.2195%, 59.8039%)"
            strokeDasharray="5 5"
            label={{ value: referenceLine.label, position: "top" }}
          />
        )}
        {dataKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={(config as any)[key]?.color || `var(--color-${key}, hsl(217.2193, 91.2195%, 59.8039%))`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
