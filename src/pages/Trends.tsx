import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { MonthlyDelayChart } from "@/components/dashboard/charts/MonthlyDelayChart";
import { MonthlyDelayRateChart } from "@/components/dashboard/charts/MonthlyDelayRateChart";
import { LineMonthlyAverageDelayChart } from "@/components/dashboard/charts/LineMonthlyAverageDelayChart";
import { LineAverageDelayChart } from "@/components/dashboard/charts/LineAverageDelayChart";

const Trends: React.FC = () => {
  const {
    monthlyAverageDelay,
    monthlyDelayRate,
    lineMonthlyAverageDelay,
    lineAverageDelay,
    isLoading,
    error,
  } = useManufacturingData();

  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Trends</h1>
          <p className="text-muted-foreground mt-2">
            Month-over-month performance and per-line trend analysis.
          </p>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">Loading trends…</div>
        ) : error ? (
          <div className="py-10 text-center text-destructive">Failed to load some trend datasets. Showing available charts.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {monthlyAverageDelay && typeof monthlyAverageDelay === "object" && !Array.isArray(monthlyAverageDelay) ? (
            <MonthlyDelayChart data={monthlyAverageDelay} />
          ) : null}
          {monthlyDelayRate ? (
            <MonthlyDelayRateChart data={monthlyDelayRate} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {lineMonthlyAverageDelay ? (
            <LineMonthlyAverageDelayChart data={lineMonthlyAverageDelay} />
          ) : null}
          {lineAverageDelay ? (
            <LineAverageDelayChart data={lineAverageDelay} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default Trends;
