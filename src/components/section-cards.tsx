import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Clock, Gauge } from "lucide-react"
import { useManufacturingData } from "@/hooks/useManufacturingData"

export function SectionCards() {
  const { delayAnalytics, scrapAnalytics, isLoading } = useManufacturingData()

  const totalBatches = delayAnalytics?.totalBatches ?? 0
  const delayedRate = delayAnalytics?.delayRate ?? 0
  const avgProcessingDays = delayAnalytics?.avgProcessingDays ?? 0
  const avgScrap = (scrapAnalytics?.avgScrapFactor ?? 0) * 100

  return (
    <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : totalBatches.toLocaleString()}</div>
          <CardDescription>Across all lines</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Rate</CardTitle>
          <AlertTriangle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : `${delayedRate.toFixed(1)}%`}</div>
          <CardDescription>Share of delayed batches</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Processing Days</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : `${avgProcessingDays.toFixed(1)}d`}</div>
          <CardDescription>Rolling average</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Scrap Factor</CardTitle>
          <Gauge className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? '—' : `${avgScrap.toFixed(2)}%`}</div>
          <CardDescription>Plant-wide mean</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}


