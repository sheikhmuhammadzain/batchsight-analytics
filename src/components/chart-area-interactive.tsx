"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", actual: 186, planned: 200 },
  { month: "Feb", actual: 305, planned: 280 },
  { month: "Mar", actual: 237, planned: 250 },
  { month: "Apr", actual: 273, planned: 260 },
  { month: "May", actual: 209, planned: 230 },
  { month: "Jun", actual: 214, planned: 220 },
  { month: "Jul", actual: 252, planned: 240 },
]

const config = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <ChartContainer config={config} className="min-h-[300px] w-full">
        <AreaChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area type="monotone" dataKey="planned" stroke="var(--color-planned)" fill="var(--color-planned)" fillOpacity={0.25} strokeWidth={2} />
          <Area type="monotone" dataKey="actual" stroke="var(--color-actual)" fill="var(--color-actual)" fillOpacity={0.4} strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}


