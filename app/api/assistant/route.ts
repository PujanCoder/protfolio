import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  buildContext,
  retrieve,
  type KnowledgeEntry,
} from "@/lib/assistant/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const buckets = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 500) buckets.clear();
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function parseMessages(payload: unknown): ChatMessage[] | null {
  if (!payload || typeof payload !== "object") return null;
  const raw = (payload as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim().slice(0, MAX_CHARS);
    if (!trimmed) return null;
    messages.push({ role, content: trimmed });
  }

  return messages[messages.length - 1]?.role === "user" ? messages : null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function composeFallback(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) {
    return "I could not find that in Pujan's verified profile, and this assistant is not allowed to guess. The fastest way to get a real answer is email: pujanpandey012@gmail.com. You can also ask about the NDR platform, the medical imaging pipeline, the GPT-2 clone, quantum computing with Qiskit, or his skills.";
  }
  const [primary, secondary] = entries;
  const parts = [primary.answer];
  if (secondary) parts.push("Related: " + secondary.answer);
  const links = entries.flatMap((entry) => entry.links ?? []);
  if (links.length > 0) {
    parts.push("Where to look: " + links.map((link) => link.label + " (" + link.href + ")").join(", ") + ".");
  }
  return parts.join("\n\n");
}

function fallbackStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = text.match(/\S+\s*/g) ?? [text];
  let index = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index >= words.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(words[index]));
      index += 1;
      await sleep(18);
    },
  });
}

function textResponse(body: string, mode: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "x-assistant-mode": mode },
  });
}

async function liveStream(
  messages: ChatMessage[],
  context: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const upstream = await fetch(baseUrl + "/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.3,
      max_tokens: 420,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\nCONTEXT:\n" + context },
        ...messages,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) return null;
  return upstream.body.pipeThrough(sseToText());
}
const NL = String.fromCharCode(10);

function sseToText(): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const events = buffer.split(NL + NL);
      buffer = events.pop() ?? "";
      for (const event of events) {
        for (const line of event.split(NL)) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
          } catch {
            continue;
          }
        }
      }
    },
  });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  if (isRateLimited(ip)) {
    return textResponse(
      "Too many questions in a minute. Give it a moment and try again.",
      "rate-limited",
      429,
    );
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return textResponse("Send a JSON body with a messages array.", "invalid", 400);
  }

  const messages = parseMessages(payload);
  if (!messages) {
    return textResponse("The last message must be a user question.", "invalid", 400);
  }
  const question = messages[messages.length - 1].content;
  const entries = retrieve(question, 2);
  const context = buildContext(entries);

  try {
    const live = await liveStream(messages, context);
    if (live) {
      return new NextResponse(live, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-assistant-mode": "live",
        },
      });
    }
  } catch {
    // fall through to retrieval mode
  }
  const answer = composeFallback(entries);
  return new NextResponse(fallbackStream(answer), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-assistant-mode": "retrieval",
    },
  });
}
