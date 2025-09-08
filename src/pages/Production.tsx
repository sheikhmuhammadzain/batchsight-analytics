import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useManufacturingData } from "@/hooks/useManufacturingData";
import { DelayedBatchesByLineChart } from "@/components/dashboard/charts/DelayedBatchesByLineChart";
import { LineScrapFactorChart } from "@/components/dashboard/charts/LineScrapFactorChart";
import { TopDelayFormulasChart } from "@/components/dashboard/charts/TopDelayFormulasChart";
import { DelayedVsTotalBatchesChart } from "@/components/dashboard/charts/DelayedVsTotalBatchesChart";

const Production: React.FC = () => {
  const { delayedBatchesByLine, lineScrapFactor, topDelayFormulas, delayedVsTotalBatches, isLoading, error } = useManufacturingData();
  return (
    <AppLayout>
      <div className="px-4 lg:px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Production</h1>
          <p className="text-muted-foreground mt-2">
            Operational view of lines, batches and scrap performance.
          </p>
        </div>

        {isLoading ? (
          <div className="py-2 text-muted-foreground">Loading production charts…</div>
        ) : error ? (
          <div className="py-2 text-destructive">Some data failed to load. Showing available sections.</div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {delayedBatchesByLine ? (
            <DelayedBatchesByLineChart data={delayedBatchesByLine} />
          ) : null}
          {lineScrapFactor ? (
            <LineScrapFactorChart data={lineScrapFactor} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topDelayFormulas ? (
            <TopDelayFormulasChart data={topDelayFormulas} />
          ) : null}
          {delayedVsTotalBatches ? (
            <DelayedVsTotalBatchesChart data={delayedVsTotalBatches} />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
};

export default Production;
