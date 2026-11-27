"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Gauge, Radio, ShieldAlert } from "lucide-react";
import {
  NDR_TOTAL,
  NDR_TOTAL_ATTACKS,
  NDR_TOTAL_BENIGN,
  operatingPoint,
  sampleFlow,
  type Flow,
} from "@/lib/labs/ndr";

const fmt = new Intl.NumberFormat("en-US");

export function NdrLab() {
  const [threshold, setThreshold] = useState(0.95);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [streaming, setStreaming] = useState(false);

  const point = useMemo(() => operatingPoint(threshold), [threshold]);
  const atPublished = Math.abs(threshold - 0.95) < 1e-9;

  const stream = () => {
    setStreaming(true);
    const batch = Array.from({ length: 18 }, (_, index) => sampleFlow(Date.now() + index));
    setFlows(batch);
    window.setTimeout(() => setStreaming(false), 420);
  };

  const misclassified = flows.filter((flow) => (flow.score >= threshold) !== flow.attack);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mono-label">Decision threshold</p>
              <p className="mt-1 text-[12px] text-quiet">
                HistGradientBoosting outputs a probability. The threshold turns it into an alert.
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
            aria-label="Decision threshold"
          />
          <div className="mt-1 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
            <span>0.50 · alert everything</span>
            <span>0.975 · alert almost nothing</span>
          </div>

          {atPublished && (
            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[11.5px] leading-relaxed text-emerald-900">
              At 0.95 this distribution reproduces the published F1 of 0.973 and the 3.56%
              false-positive rate over 44,734 flows. Precision and recall land within 0.3 points
              of the published 0.963 and 0.983, which the README rounds independently.
            </p>
          )}

          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {[
              { label: "Precision", value: point.precision.toFixed(3) },
              { label: "Recall", value: point.recall.toFixed(3) },
              { label: "F1", value: point.f1.toFixed(3) },
              { label: "FPR", value: `${(point.fpr * 100).toFixed(2)}%` },
            ].map((metric) => (
              <div key={metric.label} className="bg-white px-3 py-3">
                <dt className="mono-label">{metric.label}</dt>
                <dd className="mt-1 font-mono text-[17px] leading-none text-forest">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-quiet">
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="h-3 w-3" />
                False positives against the 5% budget
              </span>
              <span className="font-mono">{(point.fpr * 100).toFixed(2)}% / 5.00%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas-soft">
              <motion.div
                className={`h-full rounded-full ${point.fpr > 0.05 ? "bg-rose-500" : "bg-emerald-600"}`}
                initial={false}
                animate={{ width: `${Math.min((point.fpr / 0.05) * 100, 100)}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {point.fpr > 0.05 && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-700">
                <ShieldAlert className="h-3 w-3" />
                Over budget: {fmt.format(point.fp)} benign flows would page an analyst.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <p className="mono-label">Confusion matrix</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "True positive", value: point.tp, tone: "emerald" },
              { label: "False positive", value: point.fp, tone: "rose" },
              { label: "False negative", value: point.fn, tone: "amber" },
              { label: "True negative", value: point.tn, tone: "neutral" },
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
                <p className="mt-1 font-mono text-[16px] leading-none text-ink">
                  {fmt.format(cell.value)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-quiet">
            {fmt.format(NDR_TOTAL)} flows: {fmt.format(NDR_TOTAL_ATTACKS)} attacks,{" "}
            {fmt.format(NDR_TOTAL_BENIGN)} benign. {fmt.format(point.alerts)} alerts fire at this
            threshold.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="mono-label">Live flow inspector</p>
            <p className="mt-1 text-[11.5px] text-quiet">
              Synthetic flows sampled from the same score distribution.
            </p>
          </div>
          <button
            type="button"
            onClick={stream}
            className="inline-flex items-center gap-1.5 rounded-md bg-forest px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-800"
          >
            <Radio className={`h-3 w-3 ${streaming ? "animate-pulse" : ""}`} />
            Stream 18 flows
          </button>
        </div>

        <div className="mt-4 min-h-[300px]">
          {flows.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-canvas-soft/40 px-6 text-center">
              <Activity className="h-5 w-5 text-quiet" />
              <p className="mt-2 text-[12px] text-quiet">
                No flows yet. Stream a batch to see how the threshold classifies each one.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {flows.map((flow) => {
                const alert = flow.score >= threshold;
                return (
                  <motion.li
                    key={flow.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-[52px_1fr_auto] items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 font-mono text-[10.5px] hover:border-line hover:bg-canvas-soft/50"
                  >
                    <span className="text-quiet">{flow.service}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-ink">{flow.score.toFixed(3)}</span>
                      <span className="h-1 w-16 overflow-hidden rounded-full bg-canvas-soft">
                        <span
                          className="block h-full rounded-full bg-emerald-500"
                          style={{ width: `${flow.score * 100}%` }}
                        />
                      </span>
                      <span className="text-quiet/80">
                        {flow.bytes > 1_000_000 ? "large" : "small"} · {flow.duration.toFixed(2)}s
                      </span>
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-[0.08em] ${
                        alert
                          ? flow.attack
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-700"
                          : flow.attack
                            ? "bg-amber-100 text-amber-800"
                            : "bg-canvas-soft text-quiet"
                      }`}
                    >
                      {alert ? (flow.attack ? "attack" : "false alarm") : flow.attack ? "missed" : "benign"}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>

        {flows.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px]">
            <span className="text-quiet">
              {flows.filter((flow) => flow.attack).length} attacks in batch ·{" "}
              {misclassified.length} misclassified
            </span>
            <span className="font-mono text-[10.5px] text-forest">
              {(((flows.length - misclassified.length) / flows.length) * 100).toFixed(0)}% correct
            </span>
          </div>
        )}

        <p className="mt-4 border-t border-line pt-3 text-[10.5px] leading-relaxed text-quiet">
          The score distribution here is synthetic and calibrated to the published operating point.
          It is a teaching aid, not the model&apos;s real score histogram — the confusion arithmetic
          over those bins is exact.
        </p>
      </div>
    </div>
  );
}
