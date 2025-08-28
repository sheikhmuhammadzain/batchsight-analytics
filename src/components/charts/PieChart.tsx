"use client"

import { Cell, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface PieChartProps {
  data: Array<{ name: string; value: number; fill?: string }>
  config: ChartConfig
  title?: string
  className?: string
  showLegend?: boolean
}

export function CustomPieChart({ 
  data, 
  config, 
  title,
  className = "min-h-[200px] w-full",
  showLegend = true
}: PieChartProps) {
  // Add colors from config to data
  const dataWithColors = data.map((item) => ({
    ...item,
    fill:
      item.fill ||
      (config as any)[item.name]?.color ||
      `var(--color-${item.name.toLowerCase().replace(/\s+/g, '-')}, hsl(217.2193, 91.2195%, 59.8039%))`
  }))

  return (
    <ChartContainer config={config} className={className}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Pie
          data={dataWithColors}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="hsl(217.2193, 91.2195%, 59.8039%)"
          dataKey="value"
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
