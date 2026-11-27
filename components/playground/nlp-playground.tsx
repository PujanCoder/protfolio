"use client";

import { useMemo, useState } from "react";
import { Info, Layers, Wand2 } from "lucide-react";
import { CORPUS, byteLength, decode, encode, tokenDisplay, trainBpe } from "@/lib/labs/bpe";

const GPT2_CONFIG = [
  { label: "vocabulary", value: "50,257" },
  { label: "context", value: "1,024 tokens" },
  { label: "layers", value: "12" },
  { label: "heads", value: "12" },
  { label: "embedding dim", value: "768" },
  { label: "head dim", value: "64" },
];

const SHAPES = [
  { stage: "input ids", shape: "(batch, seq)", note: "integers in 0..50256" },
  { stage: "token embedding", shape: "(batch, seq, 768)", note: "lookup table, 50,257 x 768" },
  { stage: "position embedding", shape: "(batch, seq, 768)", note: "learned, added to token embeddings" },
  { stage: "attention", shape: "(batch, 12, seq, seq)", note: "scaled dot-product, causal mask" },
  { stage: "block output", shape: "(batch, seq, 768)", note: "pre-norm residual, 12 blocks" },
  { stage: "logits", shape: "(batch, seq, 50,257)", note: "weight-tied with the embedding" },
];

function hashEmbedding(token: string, dim = 8) {
  let seed = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    seed ^= token.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  const vector: number[] = [];
  for (let index = 0; index < dim; index += 1) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    vector.push(((seed >>> 0) % 2000) / 1000 - 1);
  }
  return vector;
}

function attentionMatrix(tokens: string[]) {
  const dim = 8;
  const vectors = tokens.map((token) => hashEmbedding(token, dim));
  const scale = Math.sqrt(dim);
  const matrix: number[][] = [];
  for (let row = 0; row < tokens.length; row += 1) {
    const scores: number[] = [];
    for (let column = 0; column < tokens.length; column += 1) {
      if (column > row) {
        scores.push(-Infinity);
        continue;
      }
      let dot = 0;
      for (let index = 0; index < dim; index += 1) {
        dot += vectors[row][index] * vectors[column][index];
      }
      scores.push(dot / scale);
    }
    const max = Math.max(...scores.filter((score) => Number.isFinite(score)));
    const exps = scores.map((score) => (Number.isFinite(score) ? Math.exp(score - max) : 0));
    const total = exps.reduce((sum, value) => sum + value, 0) || 1;
    matrix.push(exps.map((value) => value / total));
  }
  return matrix;
}

const SAMPLE = "Detection systems fail at the seam between ingestion and inference.";

export function NlpPlayground() {
  const [text, setText] = useState(SAMPLE);
  const merges = useMemo(() => trainBpe(CORPUS, 240), []);
  const tokens = useMemo(() => encode(text, merges), [text, merges]);
  const roundTrip = useMemo(() => decode(tokens) === text, [tokens, text]);
  const bytes = byteLength(text);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).slice(0, 12), [text]);
  const attention = useMemo(() => attentionMatrix(words), [words]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-white p-4">
        <label htmlFor="nlp-input" className="mono-label flex items-center gap-1.5">
          <Wand2 className="h-3 w-3" aria-hidden="true" />
          Text to tokenise
        </label>
        <textarea
          id="nlp-input"
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 400))}
          rows={3}
          className="mt-2.5 w-full resize-none rounded-lg border border-line px-3 py-2 text-[12.5px] text-ink outline-none focus:border-emerald-500"
        />
        <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-quiet">
          <span>{bytes} bytes</span>
          <span>{tokens.length} tokens</span>
          <span>{words.length} words shown in the attention view</span>
          <span className={roundTrip ? "text-emerald-700" : "text-rose-700"}>
            {roundTrip ? "round-trip verified" : "round-trip mismatch"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mono-label">Byte-level BPE output</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tokens.slice(0, 80).map((token, index) => (
            <span
              key={`${index}-${token.join("-")}`}
              className="rounded-md border border-emerald-100 bg-emerald-50/70 px-1.5 py-1 font-mono text-[10.5px] text-forest"
              title={`${token.length} byte(s): ${token.join(",")}`}
            >
              {tokenDisplay(token) || "·"}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10.5px] leading-relaxed text-quiet">
          Merge table trained live from the portfolio corpus in {merges.length} merges. The GPT-2 tokenizer
          in the repository ships the real 50,257-token vocabulary and merge table instead of learning one,
          so token IDs match the reference model.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label flex items-center gap-1.5">
            <Layers className="h-3 w-3" aria-hidden="true" />
            Attention weights (causal)
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="border-collapse">
              <caption className="sr-only">
                Attention weights for the first {words.length} words, lower triangular because the mask is
                causal.
              </caption>
              <thead>
                <tr>
                  <th className="w-14" />
                  {words.map((word, index) => (
                    <th
                      key={`${word}-${index}`}
                      scope="col"
                      className="h-16 w-6 align-bottom text-[8px] font-normal text-quiet"
                    >
                      <span className="inline-block -rotate-45 whitespace-nowrap">{word.slice(0, 8)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attention.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <th scope="row" className="pr-2 text-right text-[9px] font-normal text-quiet">
                      {words[rowIndex].slice(0, 8)}
                    </th>
                    {row.map((weight, columnIndex) => (
                      <td key={columnIndex} className="p-[1px]">
                        <span
                          className="block h-5 w-5 rounded-[2px]"
                          style={{
                            backgroundColor:
                              columnIndex > rowIndex
                                ? "#f3f4f6"
                                : `rgba(5, 150, 105, ${0.08 + weight * 0.9})`,
                          }}
                          title={
                            columnIndex > rowIndex
                              ? "masked"
                              : `${words[rowIndex]} → ${words[columnIndex]}: ${(weight * 100).toFixed(1)}%`
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-quiet">
            <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            The arithmetic is real: QKᵀ / √d, masked above the diagonal, softmax per row. The vectors are
            deterministic hashes of each word, not a trained model&apos;s embeddings, so treat the pattern as a
            demonstration of the mechanism rather than a linguistic finding.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Transformer shapes</p>
          <p className="mt-1 text-[10.5px] text-quiet">GPT-2 small, as implemented in the repository</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {GPT2_CONFIG.map((item) => (
              <span
                key={item.label}
                className="rounded-md border border-line bg-canvas-soft px-2 py-1 font-mono text-[10px] text-ink-soft"
              >
                {item.label}: <span className="text-forest">{item.value}</span>
              </span>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {SHAPES.map((item) => (
              <li key={item.stage} className="rounded-lg border border-line-soft bg-canvas-soft/60 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11.5px] text-ink-soft">{item.stage}</span>
                  <span className="font-mono text-[10px] text-forest">{item.shape}</span>
                </div>
                <p className="mt-0.5 text-[10.5px] text-quiet">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
