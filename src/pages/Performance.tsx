import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { KPICards } from "@/components/dashboard/KPICards";
import { DelayShareChart } from "@/components/dashboard/charts/DelayShareChart";
import { LineAverageDelayChart } from "@/components/dashboard/charts/LineAverageDelayChart";
import { DelayedVsTotalBatchesChart } from "@/components/dashboard/charts/DelayedVsTotalBatchesChart";
import type { KPIData } from "@/types/manufacturing";

const Performance: React.FC = () => {
  const { delayAnalytics, scrapAnalytics, delayShare, lineAverageDelay, delayedVsTotalBatches, isLoading, error } = useManufacturingData();

  const kpis: KPIData | null = delayAnalytics && scrapAnalytics
    ? {
        totalBatches: delayAnalytics.totalBatches,
        delayedPercentage: Number(delayAnalytics.delayRate.toFixed(1)),
        averageDelay: Number(delayAnalytics.avgProcessingDays.toFixed(1)),
        scrapFactor: Number(((scrapAnalytics.avgScrapFactor || 0) * 100).toFixed(1)),
      }
    : null;

  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Performance</h1>
            <p className="text-muted-foreground mt-2">Overall production performance and delay KPIs</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Link className="underline text-primary" to="/performance/monthly">Monthly</Link>
            <Link className="underline text-primary" to="/performance/quarterly">Quarterly</Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-2 text-muted-foreground">Loading performance KPIs…</div>
        ) : error ? (
          <div className="py-2 text-destructive">Some data failed to load. Showing available sections.</div>
        ) : null}

        {kpis ? <KPICards data={kpis} /> : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {delayShare && typeof delayShare === 'object' && !Array.isArray(delayShare) ? (
            <DelayShareChart data={delayShare} />
          ) : null}

          {lineAverageDelay ? (
            <LineAverageDelayChart data={lineAverageDelay} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {delayedVsTotalBatches ? (
            <DelayedVsTotalBatchesChart data={delayedVsTotalBatches} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default Performance;
