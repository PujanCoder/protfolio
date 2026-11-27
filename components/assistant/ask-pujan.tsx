"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does the NDR platform actually do?",
  "Why was the medical imaging model rejected?",
  "How was the GPT-2 clone built?",
  "Is he open to MLOps roles?",
];

export function AskPujan() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const history: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/assistant/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      setMode(response.headers.get("x-assistant-mode") ?? "");
      if (!response.ok || !response.body) {
        throw new Error((await response.text()) || "The assistant is unavailable.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((message, index) =>
            index === prev.length - 1 ? { ...message, content: text } : message,
          ),
        );
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="ask-pujan-panel"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-[12.5px] font-medium text-forest shadow-[0_10px_30px_-12px_rgba(6,78,59,0.45)] transition-transform hover:-translate-y-0.5"
      >
        {open ? <X className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        {open ? "Close" : "Ask Pujan"}
      </button>
      {open && (
        <section
          id="ask-pujan-panel"
          aria-label="Ask Pujan assistant"
          className="fixed bottom-20 right-5 z-50 flex h-[min(560px,72vh)] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(6,78,59,0.45)]"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-ink">Ask Pujan</p>
              <p className="text-[10.5px] text-quiet">
                Answers from verified portfolio data only
              </p>
            </div>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
              {mode === "live" ? "live model" : "knowledge mode"}
            </span>
          </header>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div>
                <p className="text-[12px] leading-relaxed text-quiet">
                  Ask about the projects, the metrics behind them, the stack, or how to get in
                  touch. Every answer is grounded in what is published on this site.
                </p>
                <div className="mt-3 space-y-1.5">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => ask(suggestion)}
                      className="block w-full rounded-lg border border-line px-3 py-2 text-left text-[11.5px] text-ink-soft transition-colors hover:border-emerald-300 hover:bg-emerald-50/60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-forest px-3 py-2 text-[12px] leading-relaxed text-white"
                    : "max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-canvas-soft/60 px-3 py-2 text-[12px] leading-relaxed text-ink-soft"
                }
              >
                {message.content ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-quiet">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Searching the portfolio…
                  </span>
                )}
              </div>
            ))}
            {error && (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11.5px] text-rose-700">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
            className="border-t border-line px-3 py-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-line px-2 py-1.5 focus-within:border-emerald-500">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={500}
                placeholder="Ask about a project, a metric, the stack…"
                aria-label="Your question"
                className="min-w-0 flex-1 bg-transparent px-1.5 py-1 text-[12px] text-ink outline-none placeholder:text-quiet/70"
              />
              <button
                type="submit"
                disabled={busy || input.trim().length === 0}
                aria-label="Send question"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-white transition-colors disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
