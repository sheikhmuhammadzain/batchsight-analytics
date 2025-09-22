"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Upload,
  CheckCircle2
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
      content: "Hi! I'm your Alarm Analytics Assistant. Upload your CSV data and ask me anything about alarm patterns, trends, or anomalies." 
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const examplePrompts = [
    "Top 10 FORMULA_ID by count of WIP_BATCH_ID",
    "Top 10 FORMULA_ID by average SCRAP_FACTOR",
    "Histogram of PLAN_QTY (bins=30)",
    "Monthly sum of WIP_QTY by WIP_PERIOD_NAME",
    "Top 10 LINE_NO by total WIP_QTY",
    "Counts of TRANSACTION_TYPE_NAME",
    "Top 10 INVENTORY_ITEM_ID by total PLAN_QTY",
    "Distribution of SCRAP_FACTOR",
    "Top 5 PLAN_QTY",
    "Rows with WIP_BATCH_STATUS == 'Closed' sorted by WIP_VALUE desc (show top 10)",
  ];

  React.useEffect(() => {
    checkDataStatus();
  }, []);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages.length]);

  async function checkDataStatus() {
    try {
      const response = await fetch("http://localhost:8000/api/status");
      const data = await response.json();
      setDataLoaded(data.data_loaded);
    } catch (error) {
      console.error("Failed to check status:", error);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload-data", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setDataLoaded(true);
        setMessages(prev => [...prev, {
          id: randomId(),
          role: "assistant",
          content: `✅ Data loaded successfully! ${data.stats.rows} rows with ${data.stats.total_alarms} alarms detected. Ask me anything about your data.`
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: randomId(),
        role: "assistant",
        content: "❌ Failed to upload file. Please try again."
      }]);
    } finally {
      setUploadProgress(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !dataLoaded) return;

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
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
          include_code: true,
          include_visualization: true,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.answer) {
        const assistantMessage: ChatMessage = {
          id: randomId(),
          role: "assistant",
          content: data.answer.summary || "Analysis complete. See details below.",
          data: {
            summary: data.answer.summary,
            code: data.answer.code,
            figure: data.answer.execution?.figure,
            result: data.answer.execution?.result,
            error: data.answer.execution?.error,
            executionTime: data.execution_time
          }
        };

        setMessages(prev => prev.filter(m => m.id !== typingId).concat(assistantMessage));
      } else {
        setMessages(prev => prev.map(m => 
          m.id === typingId 
            ? { ...m, content: `❌ ${data.error || "Failed to analyze request"}` }
            : m
        ));
      }
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
        <div className="fixed bottom-24 right-6 z-50 w-[95vw] max-w-[480px]">
          <Card className="border shadow-2xl flex flex-col h-[80vh] bg-background/95 backdrop-blur">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">Alarm Analytics Agent</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {dataLoaded ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>Data loaded</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        <span>No data loaded</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-white/50" 
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1">
              <div className="px-4 py-4 space-y-4">
                {/* Upload Section if no data */}
                {!dataLoaded && (
                  <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium">Upload CSV Data</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadProgress}
                    >
                      {uploadProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Choose CSV File"
                      )}
                    </Button>
                  </Card>
                )}

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
                      ) : (
                        <div className={cn(
                          "text-sm",
                          msg.role === "user" ? "" : "px-4 py-2"
                        )}>
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
            {dataLoaded && (
              <div className="px-3 py-2 border-t bg-muted/30">
                <ScrollArea className="w-full" orientation="horizontal">
                  <div className="flex gap-2 pb-1">
                    {examplePrompts.map((prompt) => (
                      <Badge
                        key={prompt}
                        variant="secondary"
                        className="cursor-pointer whitespace-nowrap hover:bg-secondary/80"
                        onClick={() => setInput(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dataLoaded ? "Ask about alarms, trends, patterns..." : "Upload data first"}
                className="flex-1"
                disabled={!dataLoaded || loading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || loading || !dataLoaded} 
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!data) return <div className="px-4 py-2 text-sm">{message.content}</div>;

  return (
    <div className="overflow-hidden rounded-2xl">
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
          <CollapsibleContent>
            <div className="p-3 bg-white dark:bg-gray-950">
              <img
                src={`data:image/png;base64,${data.figure}`}
                alt="Analysis visualization"
                className="w-full rounded-lg shadow-sm"
              />
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
              <pre className="p-3 text-xs bg-gray-950 text-gray-100">
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
      <ScrollArea className="w-full h-[200px]">
        <table className="w-full text-xs">
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
      </ScrollArea>
    );
  }

  if (result.type === "series") {
    return (
      <ScrollArea className="h-[150px]">
        <pre className="text-xs">{JSON.stringify(result.data, null, 2)}</pre>
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