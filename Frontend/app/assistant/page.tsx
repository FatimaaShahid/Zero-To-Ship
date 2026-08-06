"use client";

import { FormEvent, useRef, useState, useEffect, ChangeEvent } from "react";
import { Send } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { streamAsk } from "@/lib/services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me about campus guidelines — library policy, bus routes, and more.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      for await (const chunk of streamAsk(query)) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Couldn't reach the assistant. Confirm ai_assistant is running and reachable.",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      <TopBar eyebrow="Retrieval · Milvus + LangChain" title="Ask Sentinel" />

      <div className="flex h-[calc(100vh-77px)] flex-col px-8 py-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "ml-auto max-w-[70%] rounded-lg rounded-tr-sm bg-panel-raised px-4 py-3 text-sm text-ink"
                  : "mr-auto max-w-[70%] rounded-lg rounded-tl-sm border border-line bg-panel px-4 py-3 font-mono text-sm leading-relaxed text-ink"
              }
            >
              {msg.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="e.g. How many books can undergraduates borrow?"
            disabled={isStreaming}
          />
          <Button type="submit" disabled={isStreaming || !input.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </div>
    </>
  );
}
