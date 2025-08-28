"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ManufacturingCharts } from "@/components/charts/ManufacturingCharts"
import { ChartInsightsModal, ChartInsight } from "./ChartInsightsModal"
import { BarChart3, LineChart, PieChart, TrendingUp, Activity, AlertCircle } from "lucide-react"

// Sample insights data
const sampleInsights: ChartInsight[] = [
  {
    title: "Production Efficiency Improvement",
    description: "Manufacturing efficiency has increased by 15% over the last quarter, exceeding target performance.",
    type: "positive",
    impact: "high",
    recommendations: [
      "Continue current optimization strategies",
      "Share best practices across all production lines",
      "Consider expanding successful processes to other facilities"
    ],
    metrics: [
      { label: "Current Efficiency", value: "94.5%", trend: "up" },
      { label: "Target Efficiency", value: "85%", trend: "stable" },
      { label: "Improvement", value: "+15%", trend: "up" }
    ]
  },
  {
    title: "Quality Control Alert",
    description: "Defect rates have increased slightly in the past month, requiring immediate attention.",
    type: "warning",
    impact: "medium",
    recommendations: [
      "Review quality control procedures",
      "Increase inspection frequency",
      "Provide additional training to operators"
    ],
    metrics: [
      { label: "Defect Rate", value: "2.3%", trend: "up" },
      { label: "Target Rate", value: "1.5%", trend: "stable" },
      { label: "Change", value: "+0.8%", trend: "up" }
    ]
  },
  {
    title: "Equipment Maintenance Due",
    description: "Several critical machines are approaching their scheduled maintenance windows.",
    type: "info",
    impact: "medium",
    recommendations: [
      "Schedule preventive maintenance",
      "Order replacement parts in advance",
      "Plan production around maintenance windows"
    ],
    metrics: [
      { label: "Machines Due", value: "5", trend: "stable" },
      { label: "Uptime", value: "98.2%", trend: "stable" },
      { label: "Next Service", value: "7 days", trend: "stable" }
    ]
  }
]

export function ChartsShowcase() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleChartClick = (chartTitle: string) => {
    setSelectedChart(chartTitle)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedChart(null)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manufacturing Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time insights and performance metrics powered by shadcn/ui charts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>Live Data</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% This Month</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Output</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.7%</div>
            <p className="text-xs text-muted-foreground">
              -0.3% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 medium, 1 low priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Interactive Charts</h2>
          <p className="text-sm text-muted-foreground">
            Click on any chart to view detailed insights and recommendations
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => handleChartClick("Production Overview")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Production Overview</span>
              </CardTitle>
              <CardDescription>
                Monthly production, quality, and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Click to view insights →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => handleChartClick("Efficiency Trends")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Efficiency Trends</span>
              </CardTitle>
              <CardDescription>
                Weekly efficiency vs target performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Click to view insights →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => handleChartClick("Quality Analysis")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Quality Analysis</span>
              </CardTitle>
              <CardDescription>
                Defect distribution and quality control metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Click to view insights →</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => handleChartClick("Performance Metrics")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription>
                Overall equipment effectiveness and KPI tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Click to view insights →</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Charts Display */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Detailed Analytics</h2>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
        <ManufacturingCharts />
      </div>

      {/* Chart Insights Modal */}
      <ChartInsightsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        chartTitle={selectedChart || "Chart Analysis"}
        insights={sampleInsights}
        chartType="bar"
      />
    </div>
  )
}
