"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  MessageCircle, 
  X, 
  Send, 
  ChevronDown, 
  ChevronRight,
  Code2,
  BarChart3,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Maximize2,
  Minimize2
} from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time?: string;
  data?: {
    summary?: string;
    code?: string;
    figure?: string;
    result?: any;
    error?: string;
    executionTime?: number;
  };
};

function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

export function ChatbotWidget () {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { 
      id: randomId(), 
      role: "assistant", 
      content: "Hi! I'm your Batch Analytics Assistant. Ask me anything about batch prices, processing trends, or data insights." 
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);

  const examplePrompts = [
    "Tell me about the difference in the batch prices top 10",
    "Show me batch processing trends",
    "What are the top formulas by WIP value?",
    "Analyze scrap factors across lines",
    "Compare batch quantities by line",
    "Show delayed batches analysis",
  ];


  React.useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages.length]);



  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: randomId(),
      role: "user",
      content: trimmed,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    await sendToAssistant(trimmed);
  }

  async function sendToAssistant(query: string) {
    setLoading(true);
    const typingId = randomId();
    
    setMessages(prev => [...prev, {
      id: typingId,
      role: "assistant",
      content: "Analyzing your request..."
    }]);

    try {
      const response = await apiService.sendChatbotQuery(query);
      
      const assistantMessage: ChatMessage = {
        id: randomId(),
        role: "assistant",
        content: response,
      };

      setMessages(prev => prev.filter(m => m.id !== typingId).concat(assistantMessage));
    } catch (error) {
      setMessages(prev => prev.map(m => 
        m.id === typingId 
          ? { ...m, content: "❌ Connection error. Please check if the API is running." }
          : m
      ));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div className={cn(
          "fixed right-6 z-50",
          expanded ? "bottom-6 w-[96vw] max-w-[1100px]" : "bottom-24 w-[95vw] max-w-[480px]"
        )}>
          <Card className={cn(
            "border shadow-2xl flex flex-col bg-background/95 backdrop-blur",
            expanded ? "h-[90vh]" : "h-[80vh]"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">Batch Analytics Agent</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Ready</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/50"
                  onClick={() => setExpanded(v => !v)}
                  aria-label={expanded ? "Minimize" : "Expand"}
                >
                  {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-white/50" 
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1">
              <div className="px-4 py-4 space-y-4 overflow-x-auto">
                {/* Messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl shadow-sm",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2"
                          : "bg-card border"
                      )}
                    >
                      {msg.role === "assistant" && msg.data ? (
                        <AssistantMessage message={msg} />
                      ) : msg.role === "assistant" ? (
                        <div className={cn(
                          "text-sm px-4 py-2 prose prose-sm dark:prose-invert max-w-none",
                          "prose-p:my-2 prose-headings:my-3 prose-table:my-3",
                          "prose-td:border prose-th:border prose-td:p-2 prose-th:p-2"
                        )}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-sm">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Example Prompts */}
            <div className="px-3 py-2 border-t bg-muted/30">
              <div className="w-full overflow-x-auto">
                <div className="flex gap-2 pb-1 flex-nowrap w-max touch-pan-x">
                  {examplePrompts.map((prompt) => (
                    <Badge
                      key={prompt}
                      variant="secondary"
                      className="cursor-pointer whitespace-nowrap hover:bg-secondary/80 shrink-0"
                      onClick={() => setInput(prompt)}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about batch prices, trends, patterns..."
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || loading} 
                size="icon"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

// Component for formatted assistant messages
function AssistantMessage({ message }: { message: ChatMessage }) {
  const { data } = message;
  const [expandedSections, setExpandedSections] = React.useState({
    summary: true,
    visualization: true,
    result: false,
    code: false,
  });
  const [imgError, setImgError] = React.useState(false);
  const seriesData = React.useMemo(() => {
    if (data?.result?.type === "series" && data?.result?.data && typeof data.result.data === "object") {
      return Object.entries<any>(data.result.data).map(([name, value]) => ({
        name: String(name),
        value: Number(value),
      }));
    }
    return [] as Array<{ name: string; value: number }>;
  }, [data?.result]);

  // Attempt to derive a simple {name,value} dataset from a dataframe
  const dfBarData = React.useMemo(() => {
    if (data?.result?.type !== "dataframe" || !Array.isArray(data?.result?.data)) return [] as Array<{name:string; value:number}>;
    const columns: string[] = Array.isArray(data?.result?.columns) ? data.result.columns : [];
    if (!columns.length) return [];
    // Heuristic: pick first column as name, first numeric column as value (not equal to name)
    const nameCol = columns[0];
    let valueCol = columns.find((c) => c !== nameCol && data.result.data.some((row: any) => typeof row?.[c] === "number"));
    if (!valueCol) valueCol = columns.find((c) => c !== nameCol) || nameCol;
    return data.result.data.slice(0, 20).map((row: any) => ({
      name: String(row?.[nameCol]),
      value: Number(row?.[valueCol]),
    })).filter(d => Number.isFinite(d.value));
  }, [data?.result]);

  const chartData = seriesData.length ? seriesData : dfBarData;

  // Force Recharts to compute sizes when the collapsible opens or data changes
  React.useEffect(() => {
    if (expandedSections.visualization) {
      const id = setTimeout(() => {
        try { window.dispatchEvent(new Event("resize")); } catch {}
      }, 60);
      return () => clearTimeout(id);
    }
  }, [expandedSections.visualization, chartData.length]);

  // Build a reliable image source from base64; fall back to data URL if Blob creation fails
  const imageSrc = React.useMemo(() => {
    try {
      const b64 = (data?.figure || "").replace(/^data:image\/(png|jpeg);base64,/i, "").replace(/\s+/g, "");
      if (!b64) return "";
      // Convert base64 to Blob
      const byteString = atob(b64);
      const len = byteString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: "image/png" });
      return URL.createObjectURL(blob);
    } catch {
      // Fallback to data URL
      return data?.figure ? `data:image/png;base64,${(data.figure || "").replace(/^data:image\/(png|jpeg);base64,/i, "").replace(/\s+/g, "")}` : "";
    }
  }, [data?.figure]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!data) return <div className="px-4 py-2 text-sm">{message.content}</div>;

  return (
    <div className="rounded-2xl">
      {/* Summary */}
      {data.summary && (
        <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm text-foreground/90 leading-relaxed w-full">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.summary}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {data.error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800 dark:text-red-200">
              {data.error}
            </div>
          </div>
        </div>
      )}

      {/* Visualization */}
      {data.figure && (
        <Collapsible open={expandedSections.visualization}>
          <CollapsibleTrigger
            onClick={() => toggleSection("visualization")}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-muted/50 transition-colors border-b"
          >
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Visualization</span>
            {expandedSections.visualization ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent forceMount>
            <div className="p-3 bg-white dark:bg-gray-950 overflow-auto rounded-lg">
              {chartData.length > 0 ? (
                <div className="w-full" style={{ minWidth: Math.max(600, chartData.length * 90) }}>
                  <ChartContainer
                    config={{ value: { label: "Value", color: "hsl(var(--primary))" } }}
                    className="w-full h-[340px]"
                  >
                    <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 60, left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : !imgError && imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Analysis visualization"
                  className="block rounded-lg shadow-sm max-w-full h-auto"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-xs text-muted-foreground">
                  Unable to render chart image. {imageSrc && (
                    <a className="underline" href={imageSrc} target="_blank" rel="noreferrer">Open in new tab</a>
                  )}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Result Data */}
      {data.result && (
        <Collapsible open={expandedSections.result}>
          <CollapsibleTrigger
            onClick={() => toggleSection("result")}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-muted/50 transition-colors border-b"
          >
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">
              Result Data
              {data.result.type === "dataframe" && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({data.result.shape?.[0]} rows)
                </span>
              )}
            </span>
            {expandedSections.result ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 bg-muted/30">
              <ResultDisplay result={data.result} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Code */}
      {data.code && (
        <Collapsible open={expandedSections.code}>
          <CollapsibleTrigger
            onClick={() => toggleSection("code")}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-muted/50 transition-colors border-b"
          >
            <Code2 className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Generated Code</span>
            {expandedSections.code ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="h-[200px]">
              <pre className="p-3 text-xs bg-gray-950 text-gray-100 overflow-x-auto">
                <code>{data.code}</code>
              </pre>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Execution Time */}
      {data.executionTime && (
        <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/20">
          ⚡ Executed in {data.executionTime.toFixed(2)}s
        </div>
      )}
    </div>
  );
}

// Result display component
function ResultDisplay({ result }: { result: any }) {
  if (!result) return null;

  if (result.type === "dataframe") {
    return (
      <div className="w-full h-[200px] overflow-auto">
        <table className="w-max min-w-full text-xs">
          <thead className="bg-muted sticky top-0">
            <tr>
              {result.columns?.map((col: string) => (
                <th key={col} className="px-2 py-1 text-left font-medium border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.data?.slice(0, 10).map((row: any, idx: number) => (
              <tr key={idx} className="hover:bg-muted/50">
                {result.columns?.map((col: string) => (
                  <td key={col} className="px-2 py-1 border text-xs">
                    {JSON.stringify(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {result.data?.length > 10 && (
          <div className="text-xs text-muted-foreground p-2">
            Showing 10 of {result.data.length} rows
          </div>
        )}
      </div>
    );
  }

  if (result.type === "series") {
    return (
      <ScrollArea className="h-[150px]">
        <pre className="text-xs overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
      </ScrollArea>
    );
  }

  if (result.type === "value") {
    return (
      <div className="p-3 bg-background rounded-lg border">
        <div className="text-lg font-semibold">{JSON.stringify(result.data)}</div>
      </div>
    );
  }

  return null;
}

export default ChatbotWidget;