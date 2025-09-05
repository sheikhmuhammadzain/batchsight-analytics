import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { CustomBarChart, CustomLineChart } from "@/components/charts";
import { ChartConfig } from "@/components/ui/chart";

export interface ChartInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  impact: 'high' | 'medium' | 'low';
  recommendations?: string[];
  metrics?: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' }[];
}

interface ChartInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
  insights: ChartInsight[];
  chartData?: Array<Record<string, any>>;
  chartType?: 'bar' | 'line' | 'area' | 'pie';
}

export const ChartInsightsModal = ({ isOpen, onClose, chartTitle, insights, chartData, chartType = 'bar' }: ChartInsightsModalProps) => {
  // Sample chart data and configuration for demonstration
  const sampleChartData = chartData || [
    { period: "Q1", actual: 186, target: 200, efficiency: 93 },
    { period: "Q2", actual: 305, target: 280, efficiency: 109 },
    { period: "Q3", actual: 237, target: 250, efficiency: 95 },
    { period: "Q4", actual: 273, target: 260, efficiency: 105 },
  ];

  const chartConfig = {
    actual: {
      label: "Actual Performance",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target Performance", 
      color: "hsl(var(--chart-2))",
    },
    efficiency: {
      label: "Efficiency %",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <CustomLineChart
            data={sampleChartData}
            config={chartConfig}
            dataKeys={["actual", "target"]}
            xAxisKey="period"
            className="h-[250px]"
          />
        );
      case 'bar':
      default:
        return (
          <CustomBarChart
            data={sampleChartData}
            config={chartConfig}
            dataKeys={["actual", "target"]}
            xAxisKey="period"
            className="h-[250px]"
          />
        );
    }
  };
  const getInsightIcon = (type: ChartInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-[hsl(var(--chart-1))]" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[hsl(var(--chart-3))]" />;
      case 'info':
        return <Info className="h-5 w-5 text-[hsl(var(--chart-4))]" />;
    }
  };

  const getImpactColor = (impact: ChartInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-[hsl(var(--chart-3))]/10 text-[hsl(var(--chart-3))]';
      case 'low':
        return 'bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))]';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-[hsl(var(--chart-1))]" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{chartTitle} - Insights</DialogTitle>
          <DialogDescription>
            Detailed analysis and recommendations based on your manufacturing data
          </DialogDescription>
        </DialogHeader>

        {/* Chart Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Visualization</CardTitle>
            <CardDescription>
              Interactive chart showing key metrics and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{insight.description}</p>

              {insight.metrics && insight.metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insight.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.label}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-2xl font-bold mt-1">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {insight.recommendations && insight.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
