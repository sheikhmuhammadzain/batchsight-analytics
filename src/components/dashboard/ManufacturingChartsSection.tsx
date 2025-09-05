import { ProcessingDaysHistogram } from "./charts/ProcessingDaysHistogram";
import { DelayShareChart } from "./charts/DelayShareChart";
import { MonthlyDelayChart } from "./charts/MonthlyDelayChart";
import { LineAverageDelayChart } from "./charts/LineAverageDelayChart";
import { LineMonthlyAverageDelayChart } from "./charts/LineMonthlyAverageDelayChart";
import { DelayedBatchesByLineChart } from "./charts/DelayedBatchesByLineChart";
import { DelayedVsTotalBatchesChart } from "./charts/DelayedVsTotalBatchesChart";
import { TopDelayFormulasChart } from "./charts/TopDelayFormulasChart";
import { LineScrapFactorChart } from "./charts/LineScrapFactorChart";
import { MonthlyDelayRateChart } from "./charts/MonthlyDelayRateChart";
import { DelayReasonsByLineChart } from "./charts/DelayReasonsByLineChart";
import { TopDelayReasonsChart } from "./charts/TopDelayReasonsChart";
import { useManufacturingData } from "@/hooks/useManufacturingData";

export const ManufacturingChartsSection = () => {
  const {
    delayShare,
    monthlyAverageDelay,
    lineAverageDelay,
    lineMonthlyAverageDelay,
    delayedBatchesByLine,
    delayedVsTotalBatches,
    topDelayFormulas,
    lineScrapFactor,
    monthlyDelayRate,
    delayReasonsByLine,
    topDelayReasons,
    processingDaysHistogram,
    isLoading,
    error,
  } = useManufacturingData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-muted-foreground">Loading Berger Paint analytics…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-destructive">Failed to load charts. Showing placeholders.</span>
      </div>
    );
  }

  const delayShareData = delayShare && typeof delayShare === 'object' && !Array.isArray(delayShare) ? delayShare : null;
  const monthlyDelayData = monthlyAverageDelay && typeof monthlyAverageDelay === 'object' && !Array.isArray(monthlyAverageDelay) ? monthlyAverageDelay : null;

  return (
    <div className="space-y-10">
      {/* First row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {processingDaysHistogram ? (
            <ProcessingDaysHistogram data={processingDaysHistogram} />
          ) : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {delayShareData ? <DelayShareChart data={delayShareData} /> : null}
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {monthlyDelayData ? <MonthlyDelayChart data={monthlyDelayData} /> : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {lineAverageDelay ? <LineAverageDelayChart data={lineAverageDelay} /> : null}
        </div>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {lineMonthlyAverageDelay ? <LineMonthlyAverageDelayChart data={lineMonthlyAverageDelay} /> : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {delayedBatchesByLine ? <DelayedBatchesByLineChart data={delayedBatchesByLine} /> : null}
        </div>
      </div>

      {/* Fourth row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {delayedVsTotalBatches ? <DelayedVsTotalBatchesChart data={delayedVsTotalBatches} /> : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {topDelayFormulas ? <TopDelayFormulasChart data={topDelayFormulas} /> : null}
        </div>
      </div>

      {/* Fifth row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {lineScrapFactor ? <LineScrapFactorChart data={lineScrapFactor} /> : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {monthlyDelayRate ? <MonthlyDelayRateChart data={monthlyDelayRate} /> : null}
        </div>
      </div>

      {/* Sixth row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 chart-card min-h-[420px]">
          {delayReasonsByLine ? <DelayReasonsByLineChart data={delayReasonsByLine} /> : null}
        </div>
        <div className="space-y-4 chart-card min-h-[420px]">
          {topDelayReasons ? <TopDelayReasonsChart data={topDelayReasons} /> : null}
        </div>
      </div>
    </div>
  );
};


