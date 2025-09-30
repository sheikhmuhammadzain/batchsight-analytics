"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface TornadoChartProps {
  data: Array<{
    label: string
    value: number
    status?: string
    color?: string
  }>
  title?: string
  className?: string
  valueFormatter?: (value: number) => string
}

const STATUS_COLORS: Record<string, string> = {
  "QTY_CHANGED": "hsl(var(--chart-1))",
  "EXCESS_OR_NEW (ACT_ONLY)": "hsl(var(--chart-2))",
  "UNUSED": "hsl(var(--chart-3))",
  "default": "hsl(var(--primary))"
}

export function TornadoChart({ 
  data, 
  title,
  className = "min-h-[400px] w-full",
  valueFormatter = (value) => value.toLocaleString()
}: TornadoChartProps) {
  const config: ChartConfig = {
    value: {
      label: "Cost Variance",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ChartContainer config={config} className="h-[400px] w-full">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tickFormatter={valueFormatter}
          />
          <YAxis 
            type="category" 
            dataKey="label" 
            width={90}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.label}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {valueFormatter(data.value)}
                      </span>
                      {data.status && (
                        <span className="text-[0.70rem] text-muted-foreground">
                          Status: {data.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || STATUS_COLORS[entry.status || 'default'] || STATUS_COLORS.default}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
