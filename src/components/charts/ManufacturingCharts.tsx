"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig } from "@/components/ui/chart"
import { CustomBarChart, CustomLineChart, CustomAreaChart, CustomPieChart } from "./index"

// Sample manufacturing data
const productionData = [
  { month: "Jan", production: 186, quality: 80, efficiency: 75 },
  { month: "Feb", production: 305, quality: 200, efficiency: 85 },
  { month: "Mar", production: 237, quality: 120, efficiency: 90 },
  { month: "Apr", production: 273, quality: 190, efficiency: 88 },
  { month: "May", production: 209, quality: 130, efficiency: 92 },
  { month: "Jun", production: 214, quality: 140, efficiency: 95 },
]

const defectData = [
  { name: "Material Defects", value: 35 },
  { name: "Process Defects", value: 25 },
  { name: "Equipment Defects", value: 20 },
  { name: "Human Error", value: 15 },
  { name: "Other", value: 5 },
]

const efficiencyTrendData = [
  { week: "W1", efficiency: 78, target: 85 },
  { week: "W2", efficiency: 82, target: 85 },
  { week: "W3", efficiency: 85, target: 85 },
  { week: "W4", efficiency: 88, target: 85 },
  { week: "W5", efficiency: 90, target: 85 },
  { week: "W6", efficiency: 87, target: 85 },
]

// Chart configurations
const productionConfig = {
  production: {
    label: "Production Units",
    color: "hsl(var(--chart-1))",
  },
  quality: {
    label: "Quality Score",
    color: "hsl(var(--chart-2))",
  },
  efficiency: {
    label: "Efficiency %",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const defectConfig = {
  "material-defects": {
    label: "Material Defects",
    color: "hsl(var(--chart-1))",
  },
  "process-defects": {
    label: "Process Defects", 
    color: "hsl(var(--chart-2))",
  },
  "equipment-defects": {
    label: "Equipment Defects",
    color: "hsl(var(--chart-3))",
  },
  "human-error": {
    label: "Human Error",
    color: "hsl(var(--chart-4))",
  },
  "other": {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const efficiencyConfig = {
  efficiency: {
    label: "Actual Efficiency",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Efficiency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ManufacturingCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Production Overview Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Production Overview</CardTitle>
          <CardDescription>
            Monthly production, quality, and efficiency metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomBarChart
            data={productionData}
            config={productionConfig}
            dataKeys={["production", "quality", "efficiency"]}
            xAxisKey="month"
            className="h-[300px]"
          />
        </CardContent>
      </Card>

      {/* Defect Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Defect Distribution</CardTitle>
          <CardDescription>
            Breakdown of defect types in manufacturing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomPieChart
            data={defectData}
            config={defectConfig}
            className="h-[300px]"
          />
        </CardContent>
      </Card>

      {/* Efficiency Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Trend</CardTitle>
          <CardDescription>
            Weekly efficiency vs target performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomLineChart
            data={efficiencyTrendData}
            config={efficiencyConfig}
            dataKeys={["efficiency", "target"]}
            xAxisKey="week"
            className="h-[300px]"
          />
        </CardContent>
      </Card>

      {/* Production Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Production Trend</CardTitle>
          <CardDescription>
            Stacked view of production metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomAreaChart
            data={productionData}
            config={productionConfig}
            dataKeys={["production", "quality"]}
            xAxisKey="month"
            className="h-[300px]"
            stacked={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
