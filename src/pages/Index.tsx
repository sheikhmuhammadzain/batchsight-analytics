import { AppSidebar, SidebarProvider, SidebarInset } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
// Removed demo area chart section per request
// Removed old payments table
import { ManufacturingChartsSection } from "@/components/dashboard/ManufacturingChartsSection";
import { BatchTable } from "@/components/BatchTable";
// import data from "@/data/data.json";
import batchTable from "@/data/batchTable.json";
import React from "react";

const Index = () => {
  return (
    <SidebarProvider
      style={{
        // Matches shadcn admin kit scale
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <BatchTable data={batchTable as any} />
              <div className="px-4 lg:px-6">
                <ManufacturingChartsSection />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
