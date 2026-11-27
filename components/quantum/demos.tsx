"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Dices, RotateCcw } from "lucide-react";
import {
  applyCircuit,
  sampleCounts,
  type Counts,
  type Operation,
} from "@/lib/quantum/statevector";

const H: Operation[] = [{ gate: "h", target: 0 }];
const BELL: Operation[] = [
  { gate: "h", target: 0 },
  { gate: "cx", control: 0, target: 1 },
];

const SHOT_OPTIONS = [10, 100, 1000, 10000];

export function SuperpositionDemo() {
  const [shots, setShots] = useState(100);
  const [counts, setCounts] = useState<Counts | null>(null);

  const state = useMemo(() => applyCircuit(H, 1), []);
  const result = counts ?? { "0": shots / 2, "1": shots / 2 };
  const total = Object.values(result).reduce((sum, value) => sum + value, 0) || 1;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 sm:p-6">
      <p className="mono-label">Superposition</p>
      <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
        One gate, two outcomes, no preference
      </h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">
        H maps |0⟩ to (|0⟩+|1⟩)/√2. The amplitudes are equal, so every shot is a coin flip with
        p = 0.5 — and the histogram only settles as the sample grows.
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {SHOT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setShots(option);
              setCounts(null);
            }}
            aria-pressed={shots === option}
            className={`rounded-md border px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
              shots === option
                ? "border-forest/30 bg-emerald-50 text-forest"
                : "border-line text-quiet hover:text-ink"
            }`}
          >
            {option} shots
          </button>
        ))}
      </div>

      <div className="mx-auto mt-4 flex h-32 w-full max-w-[260px] items-end gap-3">
        {["0", "1"].map((key) => {
          const value = result[key] ?? 0;
          const share = (value / total) * 100;
          return (
            <div key={key} className="flex h-full flex-1 flex-col justify-end">
              <span className="mb-1 text-center font-mono text-[10.5px] text-quiet">
                {share.toFixed(1)}%
              </span>
              <motion.div
                className="rounded-t-md bg-gradient-to-t from-forest to-emerald-500"
                initial={false}
                animate={{ height: `${Math.max(share, 2)}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="mt-1.5 text-center font-mono text-[11px] text-ink">|{key}⟩</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
        <p className="font-mono text-[10.5px] text-quiet">
          {counts
            ? `${counts["0"] ?? 0} zeros · ${counts["1"] ?? 0} ones`
            : "Expected split shown until you measure"}
        </p>
        <button
          type="button"
          onClick={() => setCounts(sampleCounts(state, 1, shots))}
          className="inline-flex items-center gap-1.5 rounded-md bg-forest px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-800"
        >
          <Dices className="h-3 w-3" />
          Measure
        </button>
      </div>
    </div>
  );
}

type Trial = { id: number; q0: string; q1: string };

export function EntanglementDemo() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const state = useMemo(() => applyCircuit(BELL, 2), []);

  const measure = (batch: number) => {
    const next: Trial[] = [];
    for (let i = 0; i < batch; i += 1) {
      const single = sampleCounts(state, 2, 1);
      const bitstring = Object.keys(single)[0] ?? "00";
      next.push({
        id: trials.length + i + 1,
        q0: bitstring[0],
        q1: bitstring[1],
      });
    }
    setTrials((prev) => [...next, ...prev].slice(0, 24));
  };

  const matched = trials.filter((trial) => trial.q0 === trial.q1).length;
  const zerosOnQ0 = trials.filter((trial) => trial.q0 === "0").length;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 sm:p-6">
      <p className="mono-label">Entanglement</p>
      <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
        Two qubits, one shared outcome
      </h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">
        The Bell pair (|00⟩+|11⟩)/√2 never produces 01 or 10. Each qubit alone looks like a fair
        coin, yet the pair is perfectly correlated.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => measure(8)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-forest px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-800"
        >
          <Dices className="h-3 w-3" />
          Measure 8 pairs
        </button>
        <button
          type="button"
          onClick={() => setTrials([])}
          aria-label="Reset measurements"
          className="inline-flex items-center justify-center rounded-md border border-line px-2.5 py-1.5 text-quiet transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-4 flex-1">
        <div className="grid grid-cols-[28px_1fr_1fr] gap-x-3 border-b border-line pb-1.5">
          <span className="mono-label">#</span>
          <span className="mono-label">q0</span>
          <span className="mono-label">q1</span>
        </div>
        <div className="mt-1 max-h-[132px] space-y-1 overflow-y-auto pr-1">
          {trials.length === 0 && (
            <p className="py-6 text-center text-[11.5px] text-quiet">
              No measurements yet.
            </p>
          )}
          {trials.map((trial) => (
            <motion.div
              key={trial.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[28px_1fr_1fr] gap-x-3 font-mono text-[11px]"
            >
              <span className="text-quiet">{trial.id}</span>
              <span className={trial.q0 === "1" ? "text-forest" : "text-ink"}>{trial.q0}</span>
              <span className={trial.q1 === "1" ? "text-forest" : "text-ink"}>{trial.q1}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
        <div>
          <dt className="mono-label">q0 = q1</dt>
          <dd className="mt-0.5 font-mono text-[13px] text-forest">
            {trials.length === 0 ? "—" : `${matched}/${trials.length}`}
          </dd>
        </div>
        <div>
          <dt className="mono-label">q0 = 0</dt>
          <dd className="mt-0.5 font-mono text-[13px] text-ink">
            {trials.length === 0 ? "—" : `${zerosOnQ0}/${trials.length}`}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[10.5px] leading-relaxed text-quiet">
        Left is always 100%. Right drifts around 50% — the local view is random, the joint view is
        not.
      </p>
    </div>
  );
}
