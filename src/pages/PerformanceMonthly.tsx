import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { MonthlyDelayChart } from "@/components/dashboard/charts/MonthlyDelayChart";
import { MonthlyDelayRateChart } from "@/components/dashboard/charts/MonthlyDelayRateChart";
import { TopDelayReasonsChart } from "@/components/dashboard/charts/TopDelayReasonsChart";
import { DelayReasonsByLineChart } from "@/components/dashboard/charts/DelayReasonsByLineChart";

const PerformanceMonthly: React.FC = () => {
  const { monthlyAverageDelay, monthlyDelayRate, topDelayReasons, delayReasonsByLine, isLoading, error } = useManufacturingData();
  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Performance - Monthly</h1>
          <p className="text-muted-foreground mt-2">Month-wise delay and reason breakdown for Berger manufacturing.</p>
        </div>

        {isLoading ? (
          <div className="py-2 text-muted-foreground">Loading monthly performance…</div>
        ) : error ? (
          <div className="py-2 text-destructive">Some datasets failed to load. Showing available charts.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {monthlyAverageDelay && typeof monthlyAverageDelay === 'object' && !Array.isArray(monthlyAverageDelay) ? (
            <MonthlyDelayChart data={monthlyAverageDelay} />
          ) : null}
          {monthlyDelayRate ? (
            <MonthlyDelayRateChart data={monthlyDelayRate} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topDelayReasons ? (
            <TopDelayReasonsChart data={topDelayReasons} />
          ) : null}
          {delayReasonsByLine ? (
            <DelayReasonsByLineChart data={delayReasonsByLine} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default PerformanceMonthly;
