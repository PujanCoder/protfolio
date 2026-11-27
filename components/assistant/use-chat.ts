"use client";

import { useCallback, useState } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatState = {
  messages: ChatMessage[];
  busy: boolean;
  mode: string;
  error: string;
  ask: (question: string) => Promise<void>;
  reset: () => void;
};

/** Streams answers from /api/assistant, which is grounded in the published portfolio data. */
export function useAssistantChat(): ChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;
      setBusy(true);
      setError("");
      const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages([...history, { role: "assistant", content: "" }]);

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
    },
    [messages],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError("");
    setMode("");
  }, []);

  return { messages, busy, mode, error, ask, reset };
}
