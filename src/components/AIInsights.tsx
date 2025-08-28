import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type Props = {
  text: string | null | undefined;
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(md: string): string {
  // bold **text**
  return md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let html: string[] = [];
  let inUL = false;
  let inOL = false;

  const closeLists = () => {
    if (inUL) {
      html.push("</ul>");
      inUL = false;
    }
    if (inOL) {
      html.push("</ol>");
      inOL = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeLists();
      continue;
    }

    // Headings (#, ##, ###)
    const hMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (hMatch) {
      closeLists();
      const level = hMatch[1].length;
      const tag = level === 1 ? "h4" : level === 2 ? "h5" : "h6";
      html.push(`<${tag}>${renderInline(escapeHtml(hMatch[2]))}</${tag}>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      if (!inOL) {
        closeLists();
        html.push("<ol class=\"list-decimal ml-6 space-y-1\">");
        inOL = true;
      }
      const content = line.replace(/^\d+\.\s+/, "");
      html.push(`<li>${renderInline(escapeHtml(content))}</li>`);
      continue;
    }

    // Unordered list
    if (/^(\-|\*)\s+/.test(line)) {
      if (!inUL) {
        closeLists();
        html.push("<ul class=\"list-disc ml-6 space-y-1\">");
        inUL = true;
      }
      const content = line.replace(/^(\-|\*)\s+/, "");
      html.push(`<li>${renderInline(escapeHtml(content))}</li>`);
      continue;
    }

    // Paragraph
    closeLists();
    html.push(`<p>${renderInline(escapeHtml(line))}</p>`);
  }

  closeLists();
  return html.join("");
}

export const AIInsights: React.FC<Props> = ({ text }) => {
  if (!text) return null;
  const html = markdownToHtml(text);
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
        <ChevronDown className="h-4 w-4" /> View AI Insights
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div
          className="text-sm text-muted-foreground leading-relaxed space-y-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AIInsights;


