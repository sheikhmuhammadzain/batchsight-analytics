"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface StackedBarChartProps {
  data: Array<Record<string, any>>
  config: ChartConfig
  dataKeys: string[]
  xAxisKey: string
  title?: string
  className?: string
  layout?: "horizontal" | "vertical"
}

export function StackedBarChart({ 
  data, 
  config, 
  dataKeys, 
  xAxisKey, 
  title,
  className = "min-h-[400px] w-full",
  layout = "horizontal"
}: StackedBarChartProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <ChartContainer config={config} className="h-[400px] w-full">
        <BarChart 
          data={data}
          layout={layout === "vertical" ? "vertical" : "horizontal"}
          margin={{ top: 20, right: 30, left: layout === "vertical" ? 100 : 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {layout === "horizontal" ? (
            <>
              <XAxis 
                dataKey={xAxisKey}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
            </>
          ) : (
            <>
              <XAxis type="number" />
              <YAxis 
                type="category"
                dataKey={xAxisKey} 
                width={90}
                tick={{ fontSize: 11 }}
              />
            </>
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {dataKeys.map((key) => (
            <Bar 
              key={key}
              dataKey={key} 
              stackId="a"
              fill={(config as any)[key]?.color || `var(--color-${key})`}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
