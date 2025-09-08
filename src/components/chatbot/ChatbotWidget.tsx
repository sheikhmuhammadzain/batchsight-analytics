"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time?: string;
};

const demoAssistantGreeting =
  "Hi! I\'m your BatchSight Assistant. Ask me about delays, scrap factor, monthly trends, or line performance. (This is a UI preview — backend to be connected.)";

export function ChatbotWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: crypto.randomUUID(), role: "assistant", content: demoAssistantGreeting },
  ]);
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

    // Placeholder assistant reply (to be replaced with real backend call)
    const reply: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Thanks for your question! I\'ll analyze the relevant charts and KPIs for this request once the backend is connected.",
    };

    // Simulate latency so the UI feels natural
    setTimeout(() => setMessages((prev) => [...prev, reply]), 500);
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
          {/* max-h keeps the panel within the viewport; adjust 140px to match bottom offset + margins */}
          <Card className="border shadow-xl flex flex-col max-h-[calc(100dvh-120px)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 flex-none">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>BA</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <div className="text-sm font-medium">BatchSight Assistant</div>
                  <div className="text-xs text-muted-foreground">Context-aware (UI only)</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="px-3 py-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}> 
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

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
              <Button type="submit" disabled={!input.trim()} size="icon" aria-label="Send message">
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
