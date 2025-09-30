import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { FormulaAnalysisDashboard } from "@/components/dashboard/FormulaAnalysisDashboard";

const FormulaAnalysis = () => {
  return (
    <AppLayout>
      <div className="px-4 lg:px-6 py-4">
        <FormulaAnalysisDashboard />
      </div>
    </AppLayout>
  );
};

export default FormulaAnalysis;
