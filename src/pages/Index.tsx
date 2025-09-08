import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { SectionCards } from "@/components/section-cards";
import { ManufacturingChartsSection } from "@/components/dashboard/ManufacturingChartsSection";
import { BatchTable } from "@/components/BatchTable";
import batchTable from "@/data/batchTable.json";

const Index = () => {
  return (
    <AppLayout>
      <SectionCards />
      <BatchTable data={batchTable as any} />
      <div className="px-4 lg:px-6">
        <ManufacturingChartsSection />
      </div>
    </AppLayout>
  );
};

export default Index;
