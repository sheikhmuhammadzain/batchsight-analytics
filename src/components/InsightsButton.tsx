import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import React from "react";

type InsightsButtonProps = {
  onClick: () => void;
  className?: string;
};

export const InsightsButton: React.FC<InsightsButtonProps> = ({ onClick, className }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label="View insights"
      className={"ml-auto gap-2 text-foreground hover:bg-muted " + (className ?? "")}
    >
      <Info className="h-4 w-4" />
      <span className="hidden sm:inline">View Insights</span>
    </Button>
  );
};

export default InsightsButton;
