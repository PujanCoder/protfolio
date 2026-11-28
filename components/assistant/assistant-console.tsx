"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, RotateCcw, ShieldCheck, Sparkles, User } from "lucide-react";
import { useAssistantChat } from "@/components/assistant/use-chat";

const SUGGESTIONS = [
  "What is the NDR platform and how does it work?",
  "Why was the medical imaging retrain rejected?",
  "How did you implement GPT-2 from scratch?",
  "What are the measured latency numbers?",
  "What quantum computing work is public?",
  "How do I get in touch about a role?",
  "What are the limits of the NDR model?",
  "Which projects show MLOps experience?",
];

export function AssistantConsole() {
  const { messages, busy, mode, error, ask, reset } = useAssistantChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function submit(question: string) {
    if (busy || !question.trim()) return;
    setInput("");
    void ask(question);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-line bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13px] font-medium text-ink">Ask Pujan AI</p>
              <p className="text-[10.5px] text-quiet">
                {mode === "live"
                  ? "Live model, grounded in portfolio data"
                  : "Retrieval mode, grounded in portfolio data"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-quiet transition-colors hover:text-forest disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            New chat
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-6 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[16px] font-medium text-ink">
                Ask about the engineering, not the adjectives.
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">
                Answers come from a curated knowledge base of published facts — metrics, stack,
                architecture decisions and limitations. If something is not published, the assistant
                says so instead of guessing.
              </p>
            </div>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" ? (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              ) : null}
              <div
                className={
                  message.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white"
                    : "max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-canvas-soft/60 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-soft"
                }
              >
                {message.content ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <span className="inline-flex items-center gap-2 text-quiet">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Retrieving from the portfolio…
                  </span>
                )}
              </div>
              {message.role === "user" ? (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-canvas-soft text-quiet">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          ))}

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11.5px] text-rose-700"
            >
              {error} — try again, or email pujanpandey012@gmail.com.
            </p>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
          className="border-t border-line px-3 py-3 md:px-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-line px-2.5 py-2 focus-within:border-emerald-500">
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              maxLength={500}
              placeholder="Ask about a project, a metric, a decision…"
              className="max-h-28 min-h-[26px] flex-1 resize-none bg-transparent px-1 py-1 text-[12.5px] text-ink outline-none placeholder:text-quiet/70"
            />
            <button
              type="submit"
              disabled={busy || input.trim().length === 0}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-forest px-3 text-[11.5px] font-medium text-white transition-colors hover:bg-forest-deep disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
              Ask
            </button>
          </div>
          <p className="mt-2 text-[10.5px] text-quiet">
            Enter to send, Shift + Enter for a new line. Rate limited to 20 questions a minute.
          </p>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Try one of these</p>
          <div className="mt-3 space-y-1.5">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submit(suggestion)}
                disabled={busy}
                className="block w-full rounded-lg border border-line px-3 py-2 text-left text-[11.5px] leading-snug text-ink-soft transition-colors hover:border-emerald-300 hover:bg-emerald-50/60 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-canvas-soft/60 p-4">
          <p className="mono-label flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            How this works
          </p>
          <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-quiet">
            <li>Answers are retrieved from a curated knowledge base of published facts.</li>
            <li>With an API key configured server-side, a model composes the answer from those facts.</li>
            <li>Without a key the endpoint still answers, in retrieval mode, and says so.</li>
            <li>No key ever reaches the browser: the request is server-side and rate limited per IP.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
