"use client";

import { useCallback, useRef, useState } from "react";
import { answerLocally } from "@/lib/assistant/answer";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatState = {
  messages: ChatMessage[];
  busy: boolean;
  mode: string;
  error: string;
  ask: (question: string) => Promise<void>;
  reset: () => void;
};

const MAX_CHARS = 2000;

/**
 * Answers come from lib/assistant/knowledge.ts in the browser, so the console
 * works on a fully static deployment with no server and no API key.
 */
export function useAssistantChat(): ChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim().slice(0, MAX_CHARS);
    if (!trimmed) return;

    if (timer.current) clearInterval(timer.current);
    setBusy(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);

    const { text, mode: answerMode } = answerLocally(trimmed);
    setMode(answerMode);

    const words = text.match(/\S+\s*/g) ?? [text];
    await new Promise<void>((resolve) => {
      let index = 0;
      timer.current = setInterval(() => {
        index += 1;
        const partial = words.slice(0, index).join("");
        setMessages((prev) =>
          prev.map((message, i) => (i === prev.length - 1 ? { ...message, content: partial } : message)),
        );
        if (index >= words.length) {
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          resolve();
        }
      }, 18);
    });

    setBusy(false);
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setMessages([]);
    setError("");
    setMode("");
  }, []);

  return { messages, busy, mode, error, ask, reset };
}
