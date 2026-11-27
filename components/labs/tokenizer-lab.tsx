"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Layers } from "lucide-react";
import {
  CORPUS,
  byteLength,
  decode,
  encode,
  tokenDisplay,
  trainBpe,
} from "@/lib/labs/bpe";

const MERGES = 140;
const SAMPLE =
  "Tokenisation is the part of a language model you can see. The model never reads characters: it reads integers, and the merge table decides which integers exist.";

export function TokenizerLab() {
  const merges = useMemo(() => trainBpe(CORPUS, MERGES), []);
  const [text, setText] = useState(SAMPLE);

  const tokens = useMemo(() => encode(text, merges), [text, merges]);
  const roundTrip = useMemo(() => decode(tokens) === text, [tokens, text]);
  const bytes = byteLength(text);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const contextUsed = Math.min((tokens.length / 1024) * 100, 100);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="mono-label">Input text</p>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-quiet transition-colors hover:text-forest"
            >
              Reset
            </button>
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            aria-label="Text to tokenise"
            className="mt-3 w-full resize-none rounded-xl border border-line bg-canvas-soft/40 px-3.5 py-3 text-[13px] leading-relaxed text-ink outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-600/20"
          />

          <div className="mt-4">
            <p className="mono-label">Tokens · {tokens.length}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {tokens.slice(0, 220).map((token, index) => (
                <span
                  key={`${index}-${token.join("-")}`}
                  className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${
                    index % 2 === 0
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-line bg-white text-ink-soft"
                  }`}
                  title={`bytes: ${token.join(" ")}`}
                >
                  {tokenDisplay(token)}
                </span>
              ))}
              {tokens.length > 220 && (
                <span className="px-1.5 py-0.5 font-mono text-[11px] text-quiet">
                  +{tokens.length - 220} more
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-canvas-soft/40 px-3 py-2">
            {roundTrip ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            )}
            <p className="text-[11px] leading-relaxed text-ink-soft">
              {roundTrip
                ? "Round-trip verified: decoding the token ids reproduces the input byte for byte."
                : "Round-trip mismatch. This should not happen with a byte-level vocabulary."}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <p className="mono-label">Compression</p>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Bytes", value: bytes },
                { label: "Tokens", value: tokens.length },
                { label: "Words", value: words },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-canvas-soft/40 p-2.5">
                  <dt className="mono-label">{item.label}</dt>
                  <dd className="mt-1 font-mono text-[15px] leading-none text-forest">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-quiet">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-3 w-3" />
                  GPT-2 context window (1,024 tokens)
                </span>
                <span className="font-mono">{contextUsed.toFixed(1)}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas-soft">
                <div
                  className="h-full rounded-full bg-forest/80 transition-[width] duration-500"
                  style={{ width: `${Math.max(contextUsed, 1)}%` }}
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-quiet">
              {bytes} bytes become {tokens.length} tokens (
              {(bytes / Math.max(tokens.length, 1)).toFixed(2)} bytes per token). Rare words
              fragment into more tokens, and every token costs context.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <p className="mono-label">Learned merges · {merges.length}</p>
            <p className="mt-1 text-[11px] text-quiet">
              Trained in your browser on a {byteLength(CORPUS)}-byte technical corpus. Most frequent
              pair first.
            </p>
            <ol className="mt-3 max-h-[168px] space-y-1 overflow-y-auto pr-1">
              {merges.slice(0, 60).map((merge, index) => (
                <li
                  key={merge.join("-")}
                  className="flex items-center gap-2 font-mono text-[10.5px] text-ink-soft"
                >
                  <span className="w-6 text-right text-quiet/70">{index + 1}</span>
                  <span className="rounded border border-line bg-canvas-soft/60 px-1.5 py-0.5">
                    {tokenDisplay(merge)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-canvas-soft/50 p-4">
        <p className="text-[11.5px] leading-relaxed text-quiet">
          This is the real algorithm with a small vocabulary: bytes first, then the most frequent
          adjacent pair is merged and the table grows. The GPT-2 Clone repository ships the other
          half — GPT-2&apos;s exact pre-tokenisation regex, byte-to-unicode mapping and its
          50,257-token vocabulary, validated against the original vocab.json and merges.txt.
        </p>
      </div>
    </div>
  );
}
