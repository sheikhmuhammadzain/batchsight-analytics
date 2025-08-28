import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterOptions } from "@/types/manufacturing";
import { manufacturingLines } from "@/data/mockData";

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: () => void;
  onRefresh: () => void;
}

export const FilterControls = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh 
}: FilterControlsProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLineToggle = (line: string, checked: boolean) => {
    const updatedLines = checked 
      ? [...filters.lines, line]
      : filters.lines.filter(l => l !== line);
    
    onFiltersChange({
      ...filters,
      lines: updatedLines
    });
  };

  const handleDelayThresholdChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      delayThreshold: value[0]
    });
  };

  const handleDateSelect = (date: Date | undefined, type: 'from' | 'to') => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date || null
      }
    });
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filters & Controls</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Production Lines */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Production Lines</Label>
            <div className="space-y-2">
              {manufacturingLines.map((line) => (
                <div key={line} className="flex items-center space-x-2">
                  <Checkbox
                    id={line}
                    checked={filters.lines.includes(line)}
                    onCheckedChange={(checked) => 
                      handleLineToggle(line, checked as boolean)
                    }
                  />
                  <Label htmlFor={line} className="text-sm">
                    {line}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "PPP")
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => handleDateSelect(date, 'from')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "PPP")
                    ) : (
                      <span>To date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => handleDateSelect(date, 'to')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Delay Threshold */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Delay Threshold: {filters.delayThreshold}h
            </Label>
            <Slider
              value={[filters.delayThreshold]}
              onValueChange={handleDelayThresholdChange}
              max={24}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>24h</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onFiltersChange({
                  lines: manufacturingLines,
                  dateRange: { from: null, to: null },
                  delayThreshold: 0
                })}
              >
                Reset Filters
              </Button>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Preset ranges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};