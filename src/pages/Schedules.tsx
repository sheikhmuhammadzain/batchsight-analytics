import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { MonthlyDelayRateChart } from "@/components/dashboard/charts/MonthlyDelayRateChart";
import { DelayReasonsByLineChart } from "@/components/dashboard/charts/DelayReasonsByLineChart";
import { ProcessingDaysHistogram } from "@/components/dashboard/charts/ProcessingDaysHistogram";

const Schedules: React.FC = () => {
  const { monthlyDelayRate, delayReasonsByLine, processingDaysHistogram, isLoading, error } = useManufacturingData();
  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Schedules</h1>
          <p className="text-muted-foreground mt-2">
            Planning helpers driven by delay trends and reasons to optimize scheduling.
          </p>
        </div>

        {isLoading ? (
          <div className="py-2 text-muted-foreground">Loading scheduling insights…</div>
        ) : error ? (
          <div className="py-2 text-destructive">Some data failed to load. Showing available charts.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {monthlyDelayRate ? (
            <MonthlyDelayRateChart data={monthlyDelayRate} />
          ) : null}
          {delayReasonsByLine ? (
            <DelayReasonsByLineChart data={delayReasonsByLine} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {processingDaysHistogram ? (
            <ProcessingDaysHistogram data={processingDaysHistogram} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default Schedules;
