"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time?: string;
  html?: string; // optional rich HTML for assistant messages
};

const demoAssistantGreeting =
  "Hi! I\'m your BatchSight Assistant. Ask me about delays, scrap factor, monthly trends, or line performance.";

export function ChatbotWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: crypto.randomUUID(), role: "assistant", content: demoAssistantGreeting },
  ]);
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "What is the delay rate this month?",
    "Which line has the highest average delay?",
    "Show top delay reasons this quarter.",
    "How does scrap factor trend by line?",
  ];

  React.useEffect(() => {
    if (open) {
      // Scroll to bottom when the widget opens or messages change
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [open, messages.length]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    // Send the query to local data-analysis backend
    void sendToAssistant(trimmed);
  }

  async function sendToAssistant(query: string) {
    try {
      setLoading(true);
      // Optional: show a temporary typing indicator
      const typingId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: typingId, role: "assistant", content: "Analyzing your request…" },
      ]);

      const params = new URLSearchParams({
        q: query,
        max_tokens: "1000",
        temperature: "0.7",
      });

      // Use Vite dev proxy to avoid CORS: see vite.config.ts (/data-api -> 127.0.0.1:8000)
      const resp = await fetch(`/data-api/query?${params.toString()}`,
        { headers: { accept: "application/json, text/html;q=0.9, */*;q=0.8" } }
      );

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      // Decide how to parse based on response content type
      const ct = resp.headers.get("content-type") || "";
      let assistantText = "";
      let assistantHtml = "";
      
      if (ct.includes("application/json")) {
        // API returned JSON with an HTML payload under `result`
        const data: any = await resp.json();
        const raw = typeof data?.result === "string" ? data.result : JSON.stringify(data, null, 2);
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(raw, "text/html");
          assistantHtml = (doc.body as HTMLElement)?.innerHTML || raw;
          assistantText = (doc.body?.textContent || raw).trim();
        } catch {
          assistantHtml = raw;
          assistantText = raw;
        }
      } else {
        // Treat as HTML response
        const html = await resp.text();
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const resultEl = doc.querySelector(".result") || doc.body;
          assistantText = (resultEl?.textContent || html).trim();
          assistantHtml = (resultEl as HTMLElement)?.innerHTML || doc.body.innerHTML || html;
        } catch {
          // Fallback to raw HTML text content if DOMParser fails
          assistantText = html;
          assistantHtml = html;
        }
      }

      // Replace the typing indicator with the real reply (keep both text and html)
      setMessages((prev) => prev.map(m => m.id === typingId ? ({ ...m, content: assistantText, html: assistantHtml }) : m));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: `Failed to fetch analysis: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full shadow-lg md:hover:scale-105 transition-transform"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-[88px] right-6 z-50 w-[92vw] max-w-[380px] md:max-w-[480px]">
          {/* Fixed height so the outer container can scroll */}
          <Card className="border shadow-xl flex flex-col h-[70vh] md:h-[75vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 flex-none">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>BA</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <div className="text-sm font-medium">BatchSight Assistant</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    Connected to Data Analysis API
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages (outer scroll) */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}> 
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words shadow-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                          : "bg-card text-card-foreground border border-border"
                      )}
                    >
                      {m.role === "assistant" && m.html ? (
                        <div className="chat-html max-w-full overflow-x-auto">
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none min-w-fit"
                            // NOTE: For production, sanitize with DOMPurify. Backend is local/trusted in dev.
                            dangerouslySetInnerHTML={{ __html: m.html }}
                          />
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="px-3 pb-2 flex flex-wrap gap-2 border-t bg-background/70 flex-none">
              {examplePrompts.map((p) => (
                <Badge
                  key={p}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setInput(p)}
                >
                  {p}
                </Badge>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 flex-none">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about delays, scrap, or trends…"
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || loading} size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
