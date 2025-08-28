import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

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
}

export const ChartInsightsModal = ({ isOpen, onClose, chartTitle, insights }: ChartInsightsModalProps) => {
  const getInsightIcon = (type: ChartInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: ChartInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{chartTitle} - Insights</DialogTitle>
          <DialogDescription>
            Detailed analysis and recommendations based on your manufacturing data
          </DialogDescription>
        </DialogHeader>

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
