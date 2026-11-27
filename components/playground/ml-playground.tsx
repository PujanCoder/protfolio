"use client";

import { useMemo, useState } from "react";
import { Brain, Info, Sliders } from "lucide-react";
import {
  datasetMeta,
  featureKeys,
  featureMeta,
  playgroundDataset,
  splitDataset,
  type FeatureKey,
  type PlaygroundRow,
} from "@/lib/playground/dataset";
import {
  evaluate,
  knnProbability,
  logisticProbability,
  trainKnn,
  trainLogistic,
  trainStump,
  stumpProbability,
  type Metrics,
} from "@/lib/playground/models";

type ModelName = "logistic" | "knn" | "stump";

const modelLabels: Record<ModelName, string> = {
  logistic: "Logistic regression",
  knn: "k-nearest neighbours",
  stump: "Decision stump",
};

const defaults: Record<FeatureKey, number> = {
  duration: 1.2,
  bytesOut: 3,
  packets: 7,
  failedConns: 6,
  distinctPorts: 12,
};

const ranges: Record<FeatureKey, { min: number; max: number; step: number }> = {
  duration: { min: 0, max: 30, step: 0.1 },
  bytesOut: { min: 0, max: 80, step: 0.5 },
  packets: { min: 1, max: 80, step: 1 },
  failedConns: { min: 0, max: 20, step: 1 },
  distinctPorts: { min: 1, max: 40, step: 1 },
};

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function MlPlayground() {
  const [selected, setSelected] = useState<FeatureKey[]>(["failedConns", "distinctPorts", "bytesOut"]);
  const [model, setModel] = useState<ModelName>("logistic");
  const [probe, setProbe] = useState<PlaygroundRow>({ id: -1, label: 0, ...defaults });

  const keys = useMemo<FeatureKey[]>(
    () => (selected.length > 0 ? selected : ["failedConns"]),
    [selected],
  );
  const { train, test } = useMemo(() => splitDataset(playgroundDataset), []);

  const models = useMemo(() => {
    const logistic = trainLogistic(train, keys);
    const knn = trainKnn(train, keys, 5);
    const stump = trainStump(train, keys);
    return { logistic, knn, stump };
  }, [train, keys]);

  const metrics = useMemo<Record<ModelName, Metrics>>(() => {
    const score = (probability: (row: PlaygroundRow) => number) =>
      evaluate(test.map((row) => ({ probability: probability(row), actual: row.label })));
    return {
      logistic: score((row) => logisticProbability(models.logistic, row)),
      knn: score((row) => knnProbability(models.knn, row)),
      stump: score((row) => stumpProbability(models.stump, row)),
    };
  }, [models, test]);

  const prediction = useMemo(() => {
    if (model === "logistic") return logisticProbability(models.logistic, probe);
    if (model === "knn") return knnProbability(models.knn, probe);
    return stumpProbability(models.stump, probe);
  }, [model, models, probe]);

  const importance = useMemo(() => {
    const max = Math.max(...models.logistic.weights.map((weight) => Math.abs(weight)), 1e-6);
    return models.logistic.keys.map((key, index) => ({
      key,
      weight: models.logistic.weights[index],
      relative: Math.abs(models.logistic.weights[index]) / max,
    }));
  }, [models.logistic]);

  const verdict = prediction >= 0.5 ? "suspicious pattern" : "benign-looking";
  const confidence = prediction >= 0.5 ? prediction : 1 - prediction;

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-start">
      <div className="space-y-4">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label flex items-center gap-1.5">
            <Sliders className="h-3 w-3" aria-hidden="true" />
            Features the model may use
          </p>
          <div className="mt-3 space-y-1.5">
            {featureKeys.map((key) => {
              const active = keys.includes(key);
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line px-2.5 py-2 transition-colors hover:border-emerald-300"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => {
                      setSelected((current) =>
                        current.includes(key)
                          ? current.filter((item) => item !== key)
                          : [...current, key],
                      );
                    }}
                    className="mt-0.5 h-3.5 w-3.5 accent-emerald-600"
                  />
                  <span>
                    <span className={`block text-[12px] ${active ? "text-ink" : "text-quiet"}`}>
                      {featureMeta[key].label}
                    </span>
                    <span className="block text-[10.5px] text-quiet">{featureMeta[key].note}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-2.5 text-[10.5px] text-quiet">
            Deselect everything to see the models run on a single feature.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Model</p>
          <div className="mt-3 space-y-1.5">
            {(Object.keys(modelLabels) as ModelName[]).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setModel(name)}
                aria-pressed={model === name}
                className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[12px] transition-colors ${
                  model === name
                    ? "border-forest bg-emerald-50/70 text-forest"
                    : "border-line text-ink-soft hover:border-emerald-300"
                }`}
              >
                {modelLabels[name]}
                <span className="font-mono text-[10px] text-quiet">
                  {percent(metrics[name].accuracy)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mono-label">Craft a connection</p>
              <h3 className="mt-1.5 text-[16px] text-ink">Predict with the selected model</h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                prediction >= 0.5
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              {verdict}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featureKeys.map((key) => (
              <label key={key} className="block">
                <span className="flex items-center justify-between text-[11px] text-quiet">
                  <span>{featureMeta[key].label}</span>
                  <span className="font-mono text-forest">
                    {probe[key]}
                    {featureMeta[key].unit === "count" ? "" : ` ${featureMeta[key].unit}`}
                  </span>
                </span>
                <input
                  type="range"
                  min={ranges[key].min}
                  max={ranges[key].max}
                  step={ranges[key].step}
                  value={probe[key]}
                  onChange={(event) =>
                    setProbe((current) => ({ ...current, [key]: Number(event.target.value) }))
                  }
                  className="mt-1.5 w-full accent-emerald-600"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-line-soft bg-canvas-soft/70 p-3.5">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-quiet">Probability of the suspicious class</span>
              <span className="font-mono text-forest">{percent(prediction)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all ${
                  prediction >= 0.5 ? "bg-rose-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.max(prediction * 100, 2)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-quiet">
              Confidence in the label: <span className="text-ink-soft">{percent(confidence)}</span>. The
              decision threshold is 0.5; move the sliders to see where the model flips.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="mono-label flex items-center gap-1.5">
              <Brain className="h-3 w-3" aria-hidden="true" />
              Model comparison
            </p>
            <table className="mt-3 w-full text-left text-[11.5px]">
              <thead>
                <tr className="text-quiet">
                  <th scope="col" className="pb-1.5 font-normal">Model</th>
                  <th scope="col" className="pb-1.5 text-right font-normal">Acc</th>
                  <th scope="col" className="pb-1.5 text-right font-normal">Prec</th>
                  <th scope="col" className="pb-1.5 text-right font-normal">Rec</th>
                  <th scope="col" className="pb-1.5 text-right font-normal">F1</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(modelLabels) as ModelName[]).map((name) => (
                  <tr key={name} className="border-t border-line-soft">
                    <td className="py-1.5 text-ink-soft">{modelLabels[name]}</td>
                    <td className="py-1.5 text-right font-mono text-forest">{percent(metrics[name].accuracy)}</td>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{percent(metrics[name].precision)}</td>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{percent(metrics[name].recall)}</td>
                    <td className="py-1.5 text-right font-mono text-ink-soft">{percent(metrics[name].f1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2.5 text-[10.5px] leading-relaxed text-quiet">
              {test.length} held-out rows, {keys.length} feature{keys.length === 1 ? "" : "s"}.
              {datasetMeta.note}
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-4">
            <p className="mono-label">Feature importance</p>
            <p className="mt-1 text-[10.5px] text-quiet">Logistic weights on standardised features</p>
            <ul className="mt-3 space-y-2">
              {importance.map((item) => (
                <li key={item.key}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-soft">{featureMeta[item.key].label}</span>
                    <span className="font-mono text-quiet">{item.weight.toFixed(2)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
                    <div
                      className={`h-full rounded-full ${item.weight >= 0 ? "bg-emerald-500" : "bg-slate-400"}`}
                      style={{ width: `${Math.max(item.relative * 100, 3)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-quiet">
              <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              Positive weights push toward the suspicious class. A feature that flips sign when you
              change the selection is a sign the two features are carrying the same signal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
