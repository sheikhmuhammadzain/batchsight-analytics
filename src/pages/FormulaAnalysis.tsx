import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { FormulaAnalysisDashboard } from "@/components/dashboard/FormulaAnalysisDashboard";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

const FormulaAnalysis = () => {
  return (
    <AppLayout>
      <div className="px-4 lg:px-6 py-4">
        <FormulaAnalysisDashboard />
      </div>
      <ChatbotWidget />
    </AppLayout>
  );
};

export default FormulaAnalysis;
