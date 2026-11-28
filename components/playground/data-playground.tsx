"use client";

import { useMemo, useState } from "react";
import { Database, GitBranch } from "lucide-react";
import {
  datasetMeta,
  featureKeys,
  featureMeta,
  playgroundDataset,
  splitDataset,
  type FeatureKey,
} from "@/lib/playground/dataset";
import { evaluate, predictMatrix, trainMatrix } from "@/lib/playground/models";

type Preprocessing = "raw" | "standardise" | "log";

const preprocessingNotes: Record<Preprocessing, string> = {
  raw: "Values passed through untouched. Distances and gradients are dominated by the largest columns.",
  standardise: "Each column centred and scaled by its own standard deviation. This is what the NDR feature contract does before training.",
  log: "log1p applied to bytes out before scaling, to stop a handful of large transfers dominating the fit.",
};

function histogram(values: number[], bins = 10) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  for (const value of values) {
    const index = Math.min(bins - 1, Math.max(0, Math.floor((value - min) / width)));
    counts[index] += 1;
  }
  return counts;
}

export function DataPlayground() {
  const [feature, setFeature] = useState<FeatureKey>("failedConns");
  const [preprocessing, setPreprocessing] = useState<Preprocessing>("standardise");
  const [derived, setDerived] = useState(false);
  const [trainRatio, setTrainRatio] = useState(70);

  const column = useMemo(
    () => playgroundDataset.map((row) => row[feature]),
    [feature],
  );
  const bins = useMemo(() => histogram(column), [column]);
  const maxBin = Math.max(...bins, 1);

  const result = useMemo(() => {
    const { train, test } = splitDataset(playgroundDataset, trainRatio / 100);
    const buildRow = (row: (typeof playgroundDataset)[number]) => {
      const base = featureKeys.map((key) => {
        if (key === "bytesOut" && preprocessing === "log") return Math.log1p(row[key]);
        return row[key];
      });
      if (derived) base.push(row.bytesOut / Math.max(row.packets, 1));
      return base;
    };

    const rawTrain = train.map(buildRow);
    const rawTest = test.map(buildRow);
    const width = rawTrain[0].length;
    const mean = new Array(width).fill(0).map((_, index) =>
      rawTrain.reduce((total, row) => total + row[index], 0) / rawTrain.length,
    );
    const std = new Array(width).fill(0).map((_, index) => {
      const variance =
        rawTrain.reduce((total, row) => total + (row[index] - mean[index]) ** 2, 0) / rawTrain.length;
      return Math.sqrt(variance) || 1;
    });

    const scale = (row: number[]) =>
      preprocessing === "standardise" || preprocessing === "log"
        ? row.map((value, index) => (value - mean[index]) / std[index])
        : row;

    const model = trainMatrix(rawTrain.map(scale), train.map((row) => row.label));
    const predictions = rawTest.map((row, index) => ({
      probability: predictMatrix(model, scale(row)),
      actual: test[index].label,
    }));
    return { metrics: evaluate(predictions), train: train.length, test: test.length };
  }, [preprocessing, derived, trainRatio]);

  const positives = useMemo(
    () => playgroundDataset.filter((row) => row.label === 1).map((row) => row[feature]),
    [feature],
  );
  const negatives = useMemo(
    () => playgroundDataset.filter((row) => row.label === 0).map((row) => row[feature]),
    [feature],
  );
  const positiveBins = useMemo(() => histogram(positives), [positives]);
  const negativeBins = useMemo(() => histogram(negatives), [negatives]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="mono-label flex items-center gap-1.5">
              <Database className="h-3 w-3" aria-hidden="true" />
              Dataset
            </p>
            <div className="flex flex-wrap gap-1.5">
              {featureKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFeature(key)}
                  aria-pressed={feature === key}
                  className={`rounded-full border px-2.5 py-1 text-[10.5px] transition-colors ${
                    feature === key
                      ? "border-forest bg-forest text-white"
                      : "border-line text-quiet hover:border-emerald-300 hover:text-forest"
                  }`}
                >
                  {featureMeta[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[11px]">
              <caption className="sr-only">First ten rows of the synthetic dataset</caption>
              <thead>
                <tr className="text-quiet">
                  {featureKeys.map((key) => (
                    <th key={key} scope="col" className="pb-1.5 pr-3 font-normal">
                      {featureMeta[key].label}
                    </th>
                  ))}
                  <th scope="col" className="pb-1.5 font-normal">Label</th>
                </tr>
              </thead>
              <tbody>
                {playgroundDataset.slice(0, 10).map((row) => (
                  <tr key={row.id} className="border-t border-line-soft">
                    {featureKeys.map((key) => (
                      <td key={key} className="py-1.5 pr-3 font-mono text-ink-soft">
                        {row[key]}
                      </td>
                    ))}
                    <td className="py-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                          row.label === 1 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.label === 1 ? "suspicious" : "benign"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 text-[10.5px] text-quiet">
            {datasetMeta.rows} rows · {datasetMeta.negatives} benign · {datasetMeta.positives} suspicious.{" "}
            {datasetMeta.note}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Class balance</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(datasetMeta.negatives / datasetMeta.rows) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10.5px] text-quiet">
            <span>benign {((datasetMeta.negatives / datasetMeta.rows) * 100).toFixed(0)}%</span>
            <span>suspicious {((datasetMeta.positives / datasetMeta.rows) * 100).toFixed(0)}%</span>
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-quiet">
            Mild imbalance on purpose: accuracy alone would look flattering, which is why precision and
            recall are reported separately.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="mono-label">Distribution · {featureMeta[feature].label}</p>
          <p className="text-[10.5px] text-quiet">Green = benign, rose = suspicious, stacked per bin</p>
        </div>
        <div className="mt-4 flex h-32 items-end gap-1">
          {negativeBins.map((count, index) => {
            const positive = positiveBins[index] ?? 0;
            const total = Math.max(count + positive, 1);
            return (
              <div key={index} className="flex flex-1 flex-col justify-end gap-[1px]" title={`bin ${index + 1}: ${count} benign / ${positive} suspicious`}>
                <div
                  className="w-full rounded-t-[2px] bg-rose-400/80"
                  style={{ height: `${(positive / maxBin) * 100}%` }}
                />
                <div
                  className="w-full bg-emerald-500/80"
                  style={{ height: `${(count / maxBin) * 100}%` }}
                />
                <span className="sr-only">{total} rows</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="mono-label">Preprocessing</p>
            <div className="mt-3 space-y-1.5">
              {(Object.keys(preprocessingNotes) as Preprocessing[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreprocessing(option)}
                  aria-pressed={preprocessing === option}
                  className={`block w-full rounded-lg border px-2.5 py-2 text-left text-[11.5px] transition-colors ${
                    preprocessing === option
                      ? "border-forest bg-emerald-50/70 text-forest"
                      : "border-line text-ink-soft hover:border-emerald-300"
                  }`}
                >
                  {option === "raw" ? "None" : option === "log" ? "log1p + standardise" : "Standardise"}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[10.5px] leading-relaxed text-quiet">
              {preprocessingNotes[preprocessing]}
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-4">
            <p className="mono-label flex items-center gap-1.5">
              <GitBranch className="h-3 w-3" aria-hidden="true" />
              Feature engineering
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={derived}
                onChange={(event) => setDerived(event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-emerald-600"
              />
              <span>
                <span className="block text-[11.5px] text-ink">Add bytes per packet</span>
                <span className="block text-[10.5px] leading-relaxed text-quiet">
                  A ratio feature. Watch precision and recall when it is added.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="mono-label">Evaluation</p>
            <label className="flex items-center gap-2 text-[10.5px] text-quiet">
              Train split
              <input
                type="range"
                min={50}
                max={85}
                step={5}
                value={trainRatio}
                onChange={(event) => setTrainRatio(Number(event.target.value))}
                className="w-28 accent-emerald-600"
              />
              <span className="font-mono text-forest">{trainRatio}%</span>
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Accuracy", value: result.metrics.accuracy },
              { label: "Precision", value: result.metrics.precision },
              { label: "Recall", value: result.metrics.recall },
              { label: "F1", value: result.metrics.f1 },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-line-soft bg-canvas-soft/70 p-3">
                <p className="font-mono text-[16px] text-forest">{(metric.value * 100).toFixed(1)}%</p>
                <p className="mt-0.5 text-[10.5px] text-quiet">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="mono-label">Confusion matrix</p>
              <table className="mt-2 w-full text-left text-[11px]">
                <caption className="sr-only">Confusion matrix on the held-out split</caption>
                <thead>
                  <tr className="text-quiet">
                    <th scope="col" className="pb-1 font-normal" />
                    <th scope="col" className="pb-1 text-right font-normal">pred benign</th>
                    <th scope="col" className="pb-1 text-right font-normal">pred suspicious</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line-soft">
                    <th scope="row" className="py-1.5 text-left font-normal text-quiet">actual benign</th>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{result.metrics.tn}</td>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{result.metrics.fp}</td>
                  </tr>
                  <tr className="border-t border-line-soft">
                    <th scope="row" className="py-1.5 text-left font-normal text-quiet">actual suspicious</th>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{result.metrics.fn}</td>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{result.metrics.tp}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[11px] leading-relaxed text-quiet">
              <p>
                {result.train} training rows, {result.test} held out. Logistic regression trained in the
                browser with gradient descent.
              </p>
              <p className="mt-2">
                Flip preprocessing to <span className="text-ink-soft">None</span> and watch recall move:
                unscaled columns let the largest feature dominate the fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
