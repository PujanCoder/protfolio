"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Play, RotateCcw, Trash2 } from "lucide-react";
import {
  applyCircuit,
  blochVector,
  sampleCounts,
  stateToAmplitudes,
  type Operation,
} from "@/lib/quantum/statevector";
import {
  GATES,
  PRESETS,
  operationLabel,
  qiskitSource,
  type CircuitPreset,
} from "@/lib/quantum/circuits";
import { CircuitDiagram } from "@/components/quantum/circuit-diagram";
import { CopyButton } from "@/components/copy-button";

const BlochSphere = dynamic(() => import("@/components/quantum/bloch-sphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-xl border border-line bg-canvas-soft/60 sm:h-[340px]">
      <span className="mono-label">Loading Bloch sphere…</span>
    </div>
  ),
});

const formatAmplitude = (re: number, im: number) => {
  const round = (value: number) => {
    const fixed = Math.abs(value) < 1e-9 ? 0 : value;
    return fixed.toFixed(3).replace("-0.000", "0.000");
  };
  if (Math.abs(im) < 1e-9) return round(re);
  return `${round(re)} ${im < 0 ? "−" : "+"} ${round(Math.abs(im))}i`;
};

export function GateExplorer() {
  const [qubits, setQubits] = useState(1);
  const [operations, setOperations] = useState<Operation[]>(PRESETS[0].operations);
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [angle, setAngle] = useState(Math.PI / 2);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [readoutQubit, setReadoutQubit] = useState(0);

  const state = useMemo(() => applyCircuit(operations, qubits), [operations, qubits]);
  const amplitudes = useMemo(
    () => stateToAmplitudes(state, qubits).filter((row) => row.probability > 1e-9),
    [state, qubits],
  );
  const vector = useMemo(
    () => blochVector(state, qubits, Math.min(readoutQubit, qubits - 1)),
    [state, qubits, readoutQubit],
  );
  const purity = Math.hypot(vector[0], vector[1], vector[2]);
  const code = useMemo(() => qiskitSource(operations, qubits), [operations, qubits]);

  useEffect(() => {
    setCounts(null);
  }, [operations, qubits]);

  const addGate = (gate: (typeof GATES)[number]) => {
    const target = Math.min(readoutQubit, qubits - 1);
    const op: Operation =
      gate.param !== undefined
        ? { gate: gate.name, target, angle }
        : { gate: gate.name, target };
    setOperations((prev) => [...prev, op]);
    setPresetId("");
  };

  const addCnot = () => {
    if (qubits < 2) return;
    const control = 0;
    const target = qubits > 1 ? 1 : 0;
    setOperations((prev) => [...prev, { gate: "cx", control, target }]);
    setPresetId("");
  };

  const loadPreset = (preset: CircuitPreset) => {
    setQubits(preset.qubits);
    setOperations(preset.operations);
    setPresetId(preset.id);
    setReadoutQubit(0);
  };

  const runShots = () => {
    setCounts(sampleCounts(state, qubits, 1024));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono-label">Circuit</p>
              <p className="mt-1 text-[12px] text-quiet">
                Click a gate to remove it. Everything is recomputed exactly, not sampled.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-line p-0.5" role="group" aria-label="Qubit count">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setQubits(count);
                      setReadoutQubit((prev) => Math.min(prev, count - 1));
                      setOperations((prev) =>
                        prev.filter((op) =>
                          op.gate === "cx"
                            ? op.control < count && op.target < count
                            : op.target < count,
                        ),
                      );
                      setPresetId("");
                    }}
                    aria-pressed={qubits === count}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      qubits === count
                        ? "bg-forest text-white"
                        : "text-quiet hover:bg-canvas-soft hover:text-ink"
                    }`}
                  >
                    {count}q
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOperations([]);
                  setPresetId("");
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-quiet transition-colors hover:border-forest/30 hover:text-forest"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-canvas-soft/50 p-3 sm:p-4">
            <CircuitDiagram
              operations={operations}
              qubits={qubits}
              onRemove={(index) =>
                setOperations((prev) => prev.filter((_, i) => i !== index))
              }
            />
          </div>

          <div className="mt-5">
            <p className="mono-label">Add a gate</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GATES.map((gate) => (
                <button
                  key={gate.name}
                  type="button"
                  onClick={() => addGate(gate)}
                  title={`${gate.title} — ${gate.blurb}`}
                  className="group inline-flex min-w-[46px] flex-col items-center rounded-lg border border-line px-2.5 py-1.5 transition-colors hover:border-forest/40 hover:bg-emerald-50"
                >
                  <span className="font-mono text-[12px] font-medium text-ink">{gate.label}</span>
                  <span className="text-[9px] text-quiet group-hover:text-forest">{gate.title.split(" ")[0]}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={addCnot}
                disabled={qubits < 2}
                title={qubits < 2 ? "CNOT needs at least two qubits" : "CNOT between q0 and q1"}
                className="inline-flex min-w-[46px] flex-col items-center rounded-lg border border-line px-2.5 py-1.5 transition-colors enabled:hover:border-forest/40 enabled:hover:bg-emerald-50 disabled:opacity-40"
              >
                <span className="font-mono text-[12px] font-medium text-ink">CX</span>
                <span className="text-[9px] text-quiet">0→1</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[11.5px] text-ink-soft">
              <span className="mono-label">Angle</span>
              <input
                type="range"
                min={0}
                max={2 * Math.PI}
                step={Math.PI / 12}
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
                className="h-1.5 w-36 accent-emerald-700"
                aria-label="Rotation angle for Rx, Ry and Rz"
              />
              <span className="font-mono text-[11px] text-quiet">
                {(angle / Math.PI).toFixed(2)}π
              </span>
            </label>
            <span className="text-[11px] text-quiet">Used by Rx, Ry and Rz when added.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="mono-label">Presets</p>
            {presetId ? (
              <p className="text-[11px] text-quiet">
                {PRESETS.find((preset) => preset.id === presetId)?.blurb}
              </p>
            ) : (
              <p className="text-[11px] text-quiet">Custom circuit</p>
            )}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PRESETS.map((preset) => {
              const active = preset.id === presetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  aria-pressed={active}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-forest/30 bg-emerald-50"
                      : "border-line hover:border-forest/25 hover:bg-canvas-soft/60"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-ink">{preset.title}</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                      {preset.qubits}q
                    </span>
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-relaxed text-quiet">
                    {preset.takeaway}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mono-label">Bloch sphere</p>
              <p className="mt-1 text-[11.5px] text-quiet">
                Drag to orbit. Reduced state of q{Math.min(readoutQubit, qubits - 1)}.
              </p>
            </div>
            {qubits > 1 && (
              <div className="flex rounded-lg border border-line p-0.5">
                {Array.from({ length: qubits }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setReadoutQubit(index)}
                    aria-pressed={readoutQubit === index}
                    className={`rounded-md px-2 py-1 font-mono text-[10px] transition-colors ${
                      readoutQubit === index
                        ? "bg-forest text-white"
                        : "text-quiet hover:text-ink"
                    }`}
                  >
                    q{index}
                  </button>
                ))}
              </div>
            )}
          </div>

          <BlochSphere vector={vector} />

          <dl className="mt-3 grid grid-cols-4 gap-2 border-t border-line pt-3">
            {[
              { label: "⟨X⟩", value: vector[0] },
              { label: "⟨Y⟩", value: vector[1] },
              { label: "⟨Z⟩", value: vector[2] },
              { label: "|r|", value: purity },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                  {item.label}
                </dt>
                <dd className="mt-0.5 font-mono text-[12px] text-ink">
                  {item.value.toFixed(3)}
                </dd>
              </div>
            ))}
          </dl>
          {purity < 0.999 && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-[11px] text-amber-900">
              |r| &lt; 1: this qubit is entangled with the rest of the register, so it has no
              definite state of its own.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="mono-label">Statevector</p>
            <button
              type="button"
              onClick={runShots}
              className="inline-flex items-center gap-1.5 rounded-md bg-forest px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-800"
            >
              <Play className="h-3 w-3" />
              Run 1024 shots
            </button>
          </div>

          <ul className="mt-3 space-y-1.5">
            {amplitudes.map((row) => (
              <li key={row.label} className="grid grid-cols-[64px_1fr_54px] items-center gap-2">
                <span className="font-mono text-[11.5px] text-ink">{row.label}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-canvas-soft">
                  <motion.span
                    className="block h-full rounded-full bg-emerald-600"
                    initial={false}
                    animate={{ width: `${Math.max(row.probability * 100, 1)}%` }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
                <span className="text-right font-mono text-[10.5px] text-quiet">
                  {(row.probability * 100).toFixed(1)}%
                </span>
                <span className="col-span-3 -mt-0.5 font-mono text-[10px] text-quiet">
                  amplitude {formatAmplitude(row.re, row.im)}
                </span>
              </li>
            ))}
          </ul>

          {counts && (
            <div className="mt-4 rounded-xl border border-line bg-canvas-soft/50 p-3">
              <p className="mono-label">Measured counts</p>
              <ul className="mt-2 space-y-1">
                {Object.entries(counts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label, count]) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className="w-14 font-mono text-[11px] text-ink">|{label}⟩</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                        <span
                          className="block h-full rounded-full bg-forest/70"
                          style={{ width: `${(count / 1024) * 100}%` }}
                        />
                      </span>
                      <span className="w-12 text-right font-mono text-[10.5px] text-quiet">
                        {count}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-[#0b1512] p-5 text-emerald-50 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
              Qiskit equivalent
            </p>
            <CopyButton
              value={code}
              label="Copy"
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-emerald-200 transition-colors hover:border-emerald-300/60 hover:text-white"
            />
          </div>
          <pre className="mt-3 overflow-x-auto text-[11px] leading-relaxed text-emerald-100/90">
            <code>{code}</code>
          </pre>
          <p className="mt-3 border-t border-emerald-400/15 pt-3 text-[10.5px] leading-relaxed text-emerald-200/70">
            Runs on the local Aer simulator. Nothing in this lab touches IBM hardware.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas-soft/50 px-3 py-2">
          <RotateCcw className="h-3.5 w-3.5 text-quiet" />
          <p className="text-[11px] text-quiet">
            {operations.length === 0
              ? "Empty circuit: the register stays in |00…0⟩."
              : `${operations.length} operation${operations.length === 1 ? "" : "s"}: ${operations.map(operationLabel).join(" · ")}`}
          </p>
        </div>
      </div>
    </div>
  );
}
