"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { apiService } from "@/services/api"
import type { FormulaDiffOverview, PortfolioTornado, TopFormulasVariance, StatusMix } from "@/services/api"
import { TornadoChart } from "@/components/charts/TornadoChart"
import { StackedBarChart } from "@/components/charts/StackedBarChart"
import { ComparisonChart } from "@/components/charts/ComparisonChart"
import { DataTableAdvanced, ColumnDef } from "@/components/charts/DataTableAdvanced"
import { ChartConfig } from "@/components/ui/chart"
import { AIInsights } from "@/components/AIInsights"

function numberFmt(n: number, digits = 0) {
  return n.toLocaleString(undefined, { maximumFractionDigits: digits })
}

export function FormulaAnalysisDashboard() {
  const [overview, setOverview] = React.useState<FormulaDiffOverview | null>(null)
  const [tornado, setTornado] = React.useState<PortfolioTornado | null>(null)
  const [topFormulas, setTopFormulas] = React.useState<TopFormulasVariance | null>(null)
  const [statusMix, setStatusMix] = React.useState<StatusMix | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)
  const [persistEnabled, setPersistEnabled] = React.useState<boolean>(apiService.isPersistentCacheEnabled())
  const [sources, setSources] = React.useState<{ overview?: string; tornado?: string; topFormulas?: string; statusMix?: string }>({})

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [overviewData, tornadoData, formulasData, statusData] = await Promise.all([
        apiService.getFormulaDiffOverview(),
        apiService.getPortfolioTornado(),
        apiService.getTopFormulasVariance(),
        apiService.getStatusMix(),
      ])
      setOverview(overviewData)
      setTornado(tornadoData)
      setTopFormulas(formulasData)
      setStatusMix(statusData)
      setLastUpdated(new Date())
      setSources({
        overview: apiService.getLastCacheSource('formula-diff-overview') || undefined,
        tornado: apiService.getLastCacheSource('portfolio-tornado') || undefined,
        topFormulas: apiService.getLastCacheSource('top-formulas-variance') || undefined,
        statusMix: apiService.getLastCacheSource('status-mix') || undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Error fetching formula analysis data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = async () => {
    apiService.clearCache()
    await fetchData()
  }

  const handleTogglePersist = async () => {
    apiService.enablePersistentCache(!persistEnabled)
    setPersistEnabled(!persistEnabled)
  }

  const handleClearPersistent = async () => {
    apiService.clearPersistentCache()
    apiService.clearCache()
    await fetchData()
  }

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!overview || !tornado || !topFormulas || !statusMix) return null

  // Portfolio Tornado data mapping
  const tornadoData = tornado.ingredient_ids.map((id, i) => ({
    label: String(id),
    value: tornado.cost_variance[i],
    status: tornado.status?.[i],
  }))

  // Status mix data mapping
  const statusChartData = statusMix.formula_ids.map((fid, i) => ({
    formula: String(fid),
    Excess: statusMix.excess_cnt[i] || 0,
    Unused: statusMix.unused_cnt[i] || 0,
    Changed: statusMix.changed_cnt[i] || 0,
    Unchanged: statusMix.unchanged_cnt[i] || 0,
  }))

  const statusConfig: ChartConfig = {
    Excess: { label: "Excess", color: "hsl(var(--chart-1))" },
    Unused: { label: "Unused", color: "hsl(var(--chart-2))" },
    Changed: { label: "Changed", color: "hsl(var(--chart-3))" },
    Unchanged: { label: "Unchanged", color: "hsl(var(--chart-4))" },
  }

  // Top formulas comparison mapping
  const comparisonData = topFormulas.formula_ids.map((fid, i) => ({
    formula: String(fid),
    std_cost: topFormulas.std_cost[i] || 0,
    act_cost: topFormulas.act_cost[i] || 0,
    variance: topFormulas.cost_variance[i] || 0,
  }))

  const comparisonConfig: ChartConfig = {
    std_cost: { label: "Standard Cost", color: "hsl(var(--chart-1))" },
    act_cost: { label: "Actual Cost", color: "hsl(var(--chart-2))" },
    variance: { label: "Cost Variance", color: "hsl(var(--destructive))" },
  }

  // Table columns for overview
  type Row = (typeof overview.items)[number]
  const columns: ColumnDef<Row>[] = [
    { key: "FORMULA_ID", header: "Formula", accessor: (r) => r.FORMULA_ID, sortable: true },
    { key: "STD_COST", header: "Std Cost", accessor: (r) => r.STD_COST, sortable: true, formatter: (v) => "$" + numberFmt(v) },
    { key: "ACT_COST", header: "Act Cost", accessor: (r) => r.ACT_COST, sortable: true, formatter: (v) => "$" + numberFmt(v) },
    { key: "COST_VAR", header: "Variance", accessor: (r) => r.COST_VAR, sortable: true, formatter: (v) => "$" + numberFmt(v) },
    { key: "VARIANCE_%", header: "Variance %", accessor: (r) => r["VARIANCE_%"], sortable: true, formatter: (v) => numberFmt(v, 2) + "%" },
    { key: "BATCHES_TOUCHED", header: "Batches", accessor: (r) => r.BATCHES_TOUCHED, sortable: true },
    { key: "EXCESS_CNT", header: "Excess", accessor: (r) => r.EXCESS_CNT },
    { key: "UNUSED_CNT", header: "Unused", accessor: (r) => r.UNUSED_CNT },
    { key: "CHANGED_CNT", header: "Changed", accessor: (r) => r.CHANGED_CNT },
    { key: "UNCHANGED_CNT", header: "Unchanged", accessor: (r) => r.UNCHANGED_CNT },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Formula Cost & Variance Analysis</h2>
          <p className="text-sm text-muted-foreground">Portfolio-wide and per-formula insights</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <Badge variant="secondary">Updated {lastUpdated.toLocaleTimeString()}</Badge>
          )}
          <Badge variant={persistEnabled ? "default" : "outline"} title="Persistent cache (localStorage)">
            Persist: {persistEnabled ? "On" : "Off"}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleTogglePersist}>
            {persistEnabled ? "Disable Persist" : "Enable Persist"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearPersistent}>
            Clear Persisted
          </Button>
        </div>
      </div>

      {/* AI Insights from overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Automated analysis of key drivers and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <AIInsights text={overview.ai_insights} />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Ingredients by Absolute Cost Variance</CardTitle>
              {sources.tornado && <Badge variant="outline">Cache: {sources.tornado}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <TornadoChart 
              data={tornadoData}
              valueFormatter={(v) => "$" + numberFmt(v)}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status Mix per Formula</CardTitle>
              {sources.statusMix && <Badge variant="outline">Cache: {sources.statusMix}</Badge>}
            </div>
            <CardDescription>Excess, Unused, Changed, Unchanged counts</CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart 
              data={statusChartData}
              config={statusConfig}
              dataKeys={["Excess", "Unused", "Changed", "Unchanged"]}
              xAxisKey="formula"
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Standard vs Actual Cost</CardTitle>
              {sources.topFormulas && <Badge variant="outline">Cache: {sources.topFormulas}</Badge>}
            </div>
            <CardDescription>Top formulas by total cost variance</CardDescription>
          </CardHeader>
          <CardContent>
            <ComparisonChart 
              data={comparisonData}
              config={comparisonConfig}
              standardKey="std_cost"
              actualKey="act_cost"
              xAxisKey="formula"
              showVarianceLine
              varianceKey="variance"
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Formula Detail</CardTitle>
            {sources.overview && <Badge variant="outline">Cache: {sources.overview}</Badge>}
          </div>
          <CardDescription>Sorted by cost variance and usage deviations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced 
            data={overview.items}
            columns={columns}
            title={"Formulas: " + numberFmt(overview.formulas)}
            searchPlaceholder="Search formula ID..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full" />
        <Skeleton className="h-[420px] w-full xl:col-span-2" />
      </div>
      <Skeleton className="h-[420px] w-full" />
    </div>
  )
}

export default FormulaAnalysisDashboard
