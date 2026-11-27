"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Stethoscope, XCircle } from "lucide-react";
import {
  NORMAL_IMAGES,
  RECALL_FLOOR,
  TB_POSITIVES,
  TOTAL_IMAGES,
  gateAt,
} from "@/lib/labs/medical";

export function MedicalLab() {
  const [threshold, setThreshold] = useState(0.95);
  const gate = useMemo(() => gateAt(threshold), [threshold]);
  const atRecorded = Math.abs(threshold - 0.95) < 1e-9;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mono-label">Operating threshold</p>
            <p className="mt-1 text-[12px] text-quiet">
              ResNet18 outputs a probability per chest X-ray. The threshold decides who is
              flagged for review.
            </p>
          </div>
          <span className="rounded-md border border-forest/20 bg-emerald-50 px-2 py-1 font-mono text-[13px] text-forest">
            {threshold.toFixed(3)}
          </span>
        </div>

        <input
          type="range"
          min={0.5}
          max={0.975}
          step={0.025}
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
          className="mt-4 h-1.5 w-full accent-emerald-700"
          aria-label="Operating threshold"
        />
        <div className="mt-1 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
          <span>0.50 · flag everything</span>
          <span>0.975 · flag almost nothing</span>
        </div>

        {atRecorded && (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[11.5px] leading-relaxed text-emerald-900">
            This is the recorded retrain: 26 of 110 tuberculosis cases caught, 546 of 630 images
            correct. Accuracy 0.867, weighted F1 0.830, TB recall 0.236 — all three published
            numbers reproduced exactly by this confusion matrix.
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "TB recall", value: gate.recall.toFixed(3) },
            { label: "Accuracy", value: gate.accuracy.toFixed(3) },
            { label: "Weighted F1", value: gate.weightedF1.toFixed(3) },
            { label: "Precision", value: gate.precision.toFixed(3) },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-line bg-canvas-soft/40 p-3">
              <p className="mono-label">{metric.label}</p>
              <p className="mt-1 font-mono text-[16px] leading-none text-forest">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] text-quiet">
            <span>Recall against the 0.80 promotion floor</span>
            <span className="font-mono">{gate.recall.toFixed(3)} / {RECALL_FLOOR.toFixed(2)}</span>
          </div>
          <div className="relative mt-1.5 h-2.5 overflow-hidden rounded-full bg-canvas-soft">
            <motion.div
              className={`h-full rounded-full ${gate.passesGate ? "bg-emerald-600" : "bg-rose-500"}`}
              initial={false}
              animate={{ width: `${Math.min(gate.recall * 100, 100)}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <span
              className="absolute top-0 h-full w-0.5 bg-forest/70"
              style={{ left: `${RECALL_FLOOR * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-quiet">
            Lowering the threshold raises recall and lowers precision. The floor exists because a
            missed tuberculosis case is the failure that matters.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div
          className={`rounded-2xl border p-5 sm:p-6 ${
            gate.passesGate
              ? "border-emerald-200 bg-emerald-50/60"
              : "border-rose-200 bg-rose-50/50"
          }`}
        >
          <div className="flex items-center gap-2">
            {gate.passesGate ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-600" />
            )}
            <p className="mono-label">Quality gate</p>
          </div>
          <p className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
            {gate.passesGate ? "Candidate promoted" : "Candidate rejected"}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-quiet">
            {gate.passesGate
              ? "Recall clears the floor. The registry would accept this candidate."
              : `TB recall ${gate.recall.toFixed(3)} is below the ${RECALL_FLOOR.toFixed(2)} floor. The registry refuses the promotion regardless of accuracy.`}
          </p>
          <ul className="mt-3 space-y-1.5 border-t border-current/10 pt-3 text-[11.5px]">
            <li className="flex items-center justify-between">
              <span className="text-ink-soft">TB recall ≥ 0.80 (published floor)</span>
              <span className={gate.passesGate ? "text-emerald-700" : "text-rose-600"}>
                {gate.passesGate ? "pass" : "fail"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-ink-soft">Accuracy and F1 vs baseline</span>
              <span className="text-quiet">relative check</span>
            </li>
          </ul>
          <p className="mt-2 text-[10.5px] leading-relaxed text-quiet">
            The accuracy and F1 comparisons are relative to the registered baseline, whose values
            are not published. The published blocker was the recall floor, which is what this
            simulation evaluates.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5 text-quiet" />
            <p className="mono-label">Confusion matrix</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "TB caught (TP)", value: gate.tp, tone: "emerald" },
              { label: "TB missed (FN)", value: gate.fn, tone: "rose" },
              { label: "Normal flagged (FP)", value: gate.fp, tone: "amber" },
              { label: "Normal cleared (TN)", value: gate.tn, tone: "neutral" },
            ].map((cell) => (
              <div
                key={cell.label}
                className={`rounded-xl border p-3 ${
                  cell.tone === "emerald"
                    ? "border-emerald-200 bg-emerald-50/70"
                    : cell.tone === "rose"
                      ? "border-rose-200 bg-rose-50/60"
                      : cell.tone === "amber"
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-line bg-canvas-soft/50"
                }`}
              >
                <p className="mono-label">{cell.label}</p>
                <p className="mt-1 font-mono text-[16px] leading-none text-ink">{cell.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-quiet">
            {TOTAL_IMAGES} evaluation images: {TB_POSITIVES} tuberculosis, {NORMAL_IMAGES} normal.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[12px] font-medium text-amber-900">
            Why a 0.867 accuracy model was rejected
          </p>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-amber-900/80">
            Predicting &ldquo;normal&rdquo; for almost everything scores well on a dataset that is
            83% normal. Recall exposes it: {gate.fn} of {TB_POSITIVES} tuberculosis cases would
            have been missed. Aggregate accuracy is a bad gatekeeper for a screening model.
          </p>
        </div>
      </div>
    </div>
  );
}
