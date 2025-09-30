import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Trends from "./pages/Trends";
import Performance from "./pages/Performance";
import PerformanceMonthly from "./pages/PerformanceMonthly";
import PerformanceQuarterly from "./pages/PerformanceQuarterly";
import Production from "./pages/Production";
import Schedules from "./pages/Schedules";
import FormulaAnalysis from "./pages/FormulaAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/performance/monthly" element={<PerformanceMonthly />} />
              <Route path="/performance/quarterly" element={<PerformanceQuarterly />} />
              <Route path="/production" element={<Production />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/formula-analysis" element={<FormulaAnalysis />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
