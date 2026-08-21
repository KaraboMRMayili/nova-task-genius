import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const title = "AI Chatbot — Synthetix";
const description =
  "Chat with an AI workplace assistant that helps you draft, plan, prioritize and think through work problems.";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me say no to a meeting request politely",
  "Turn this week's goals into three focus themes",
  "What questions should I ask in a vendor review?",
  "Rewrite this update so it's clearer for executives",
];

function messageText(message: { parts: Array<{ type: string; text?: string }> }) {
  return message.parts
    .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
    .join("")
    .trim();
}

function ChatPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => toast.error(error.message || "The assistant could not respond."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <div className="flex h-[calc(100vh-53px)] flex-col lg:h-screen">
      <header className="border-b border-border bg-surface px-5 py-4 lg:px-12">
        <h1 className="text-lg font-medium tracking-tight">AI Chatbot</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Interactive workplace assistant · responses are AI-generated and should be verified
        </p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Ask anything about your work — drafting, planning, summarizing or decision-making.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg bg-elevated p-3 text-left text-sm text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = messageText(message);
            if (!text) return null;
            return message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {text}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex gap-3">
                <div className="mt-1 size-6 shrink-0 rounded-md bg-primary" aria-hidden />
                <div className="ai-prose min-w-0 flex-1">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-surface px-5 py-4 lg:px-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder="Ask the workplace assistant…"
            className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl bg-elevated px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-ring/40"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground"
              aria-label="Stop generating"
            >
              <Square className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </form>
        <p className="mx-auto mt-3 max-w-3xl text-[11px] text-muted-foreground">
          Synthetix can make mistakes. Don't share confidential or personal data.
        </p>
      </div>
    </div>
  );
}
