import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { DelayShareChart } from "@/components/dashboard/charts/DelayShareChart";
import { MonthlyDelayChart } from "@/components/dashboard/charts/MonthlyDelayChart";
import { DelayedVsTotalBatchesChart } from "@/components/dashboard/charts/DelayedVsTotalBatchesChart";
import { TopDelayReasonsChart } from "@/components/dashboard/charts/TopDelayReasonsChart";

const Analytics: React.FC = () => {
  const {
    delayShare,
    monthlyAverageDelay,
    delayedVsTotalBatches,
    topDelayReasons,
    isLoading,
    error,
  } = useManufacturingData();

  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Live KPIs and insights driven by Berger production data.
          </p>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">Loading analytics…</div>
        ) : error ? (
          <div className="py-10 text-center text-destructive">Failed to load analytics. Showing what is available.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {delayShare && typeof delayShare === "object" && !Array.isArray(delayShare) ? (
            <DelayShareChart data={delayShare} />
          ) : null}
          {monthlyAverageDelay && typeof monthlyAverageDelay === "object" && !Array.isArray(monthlyAverageDelay) ? (
            <MonthlyDelayChart data={monthlyAverageDelay} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {delayedVsTotalBatches ? (
            <DelayedVsTotalBatchesChart data={delayedVsTotalBatches} />
          ) : null}
          {topDelayReasons ? (
            <TopDelayReasonsChart data={topDelayReasons} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
