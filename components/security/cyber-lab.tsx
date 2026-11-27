"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, Pause, Play, Radar, ShieldAlert } from "lucide-react";
import Link from "next/link";
import {
  alertTimeline,
  categoryCounts,
  generateEvents,
  scoreHistogram,
} from "@/lib/security/simulator";
import { NDR_TOTAL, operatingPoint } from "@/lib/labs/ndr";

const categoryTone: Record<string, string> = {
  benign: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  DDoS: "bg-rose-50 text-rose-700 ring-rose-200",
  "Port Scan": "bg-amber-50 text-amber-800 ring-amber-200",
  "Brute Force": "bg-orange-50 text-orange-800 ring-orange-200",
  Botnet: "bg-violet-50 text-violet-700 ring-violet-200",
  "Web Attack": "bg-sky-50 text-sky-700 ring-sky-200",
};

export function CyberLab() {
  const events = useMemo(() => generateEvents(72), []);
  const [threshold, setThreshold] = useState(0.95);
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [playing, setPlaying] = useState(true);
  const [window, setWindow] = useState(24);

  const point = useMemo(() => operatingPoint(threshold), [threshold]);
  const visible = events.slice(0, window);
  const selected = visible.find((event) => event.id === selectedId) ?? visible[0];

  const flagged = visible.filter((event) => event.score >= threshold);
  const benignCount = visible.filter((event) => event.label === "benign").length;
  const attackCount = visible.length - benignCount;
  const timeline = useMemo(() => alertTimeline(visible), [visible]);
  const histogram = useMemo(() => scoreHistogram(visible), [visible]);
  const counts = useMemo(() => categoryCounts(visible), [visible]);
  const maxTimeline = Math.max(...timeline.map((bucket) => bucket.attacks + bucket.benign), 1);
  const maxHistogram = Math.max(...histogram, 1);

  const zeekRow = selected
    ? {
        ts: selected.ts.toFixed(6),
        uid: selected.uid,
        "id.orig_h": selected.src,
        "id.orig_p": String(selected.srcPort),
        "id.resp_h": selected.dst,
        "id.resp_p": String(selected.dstPort),
        proto: selected.proto,
        service: selected.service,
        duration: selected.duration.toFixed(3),
        orig_bytes: String(selected.origBytes),
        resp_bytes: String(selected.respBytes),
        conn_state: selected.connState,
      }
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
        <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-amber-900">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-medium">Simulated telemetry.</strong> Events are generated from the
            published score distributions of the NDR model. The labels describe what each event
            represents in the simulation; nothing here is captured traffic or a live attack.
          </span>
        </p>
        <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-amber-900 ring-1 ring-amber-200">
          no live sensor
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Events in window", value: String(visible.length), note: `${benignCount} benign · ${attackCount} labelled` },
          { label: "Flagged at threshold", value: String(flagged.length), note: `score ≥ ${threshold.toFixed(2)}` },
          { label: "Precision @ threshold", value: point.precision.toFixed(3), note: `${point.fp.toLocaleString()} false positives` },
          { label: "Recall @ threshold", value: point.recall.toFixed(3), note: `${point.fn.toLocaleString()} misses` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-white px-4 py-3.5">
            <p className="font-mono text-[19px] leading-none text-forest">{stat.value}</p>
            <p className="mt-1.5 text-[11px] text-ink-soft">{stat.label}</p>
            <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <Radar className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <p className="text-[12.5px] font-medium text-ink">Live stream</p>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-700">
                simulated
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-pressed={playing}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-[10.5px] text-quiet transition-colors hover:text-forest"
              >
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {playing ? "Pause" : "Resume"}
              </button>
              <label className="flex items-center gap-1.5 text-[10.5px] text-quiet">
                window
                <input
                  type="range"
                  min={12}
                  max={72}
                  step={6}
                  value={window}
                  onChange={(event) => setWindow(Number(event.target.value))}
                  className="w-20 accent-emerald-600"
                />
                <span className="font-mono text-forest">{window}</span>
              </label>
            </div>
          </div>

          <ul className="max-h-[320px] divide-y divide-line-soft overflow-y-auto">
            {visible.map((event) => {
              const flaggedEvent = event.score >= threshold;
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(event.id)}
                    aria-pressed={event.id === selected?.id}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                      event.id === selected?.id ? "bg-emerald-50/70" : "hover:bg-canvas-soft"
                    } ${playing ? "" : "opacity-90"}`}
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] ring-1 ${categoryTone[event.label]}`}
                    >
                      {event.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-quiet">
                      {event.src}:{event.srcPort} → {event.dst}:{event.dstPort} · {event.proto}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-line-soft">
                        <span
                          className={`block h-full rounded-full ${flaggedEvent ? "bg-rose-500" : "bg-emerald-500"}`}
                          style={{ width: `${event.score * 100}%` }}
                        />
                      </span>
                      <span
                        className={`w-9 text-right font-mono text-[10px] ${
                          flaggedEvent ? "text-rose-700" : "text-quiet"
                        }`}
                      >
                        {event.score.toFixed(2)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="mono-label flex items-center gap-1.5">
                <Activity className="h-3 w-3" aria-hidden="true" />
                Detection timeline
              </p>
              <p className="text-[10px] text-quiet">events per window</p>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1.5">
              {timeline.map((bucket) => (
                <div key={bucket.bucket} className="flex flex-1 flex-col justify-end gap-[2px]">
                  <div
                    className="w-full rounded-t-[2px] bg-rose-400"
                    style={{ height: `${(bucket.attacks / maxTimeline) * 100}%` }}
                    title={`${bucket.attacks} labelled attack events`}
                  />
                  <div
                    className="w-full bg-emerald-400"
                    style={{ height: `${(bucket.benign / maxTimeline) * 100}%` }}
                    title={`${bucket.benign} benign events`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-quiet">
              {timeline.reduce((total, bucket) => total + bucket.rules, 0)} rule hits alongside the
              classifier across the window.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="mono-label">Score distribution</p>
              <p className="text-[10px] text-quiet">threshold {threshold.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex h-20 items-end gap-1">
              {histogram.map((count, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-[2px] ${index / 10 >= threshold ? "bg-rose-400" : "bg-emerald-400"}`}
                  style={{ height: `${Math.max((count / maxHistogram) * 100, 2)}%` }}
                  title={`${index * 10}-${index * 10 + 10}%: ${count} events`}
                />
              ))}
            </div>
            <label className="mt-3 block">
              <span className="flex items-center justify-between text-[10.5px] text-quiet">
                <span>Decision threshold</span>
                <span className="font-mono text-forest">{threshold.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={0.5}
                max={0.99}
                step={0.01}
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="mt-1.5 w-full accent-emerald-600"
              />
            </label>
            <p className="mt-2 text-[10.5px] leading-relaxed text-quiet">
              At {threshold.toFixed(2)} the model flags {point.alerts.toLocaleString()} of{" "}
              {NDR_TOTAL.toLocaleString()} published flows, with F1 {point.f1.toFixed(3)} and a{" "}
              {(point.fpr * 100).toFixed(2)}% false-positive rate.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Zeek event · selected connection</p>
          {zeekRow ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10.5px]">
              {Object.entries(zeekRow).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-2 border-b border-line-soft pb-1">
                  <dt className="text-quiet">{key}</dt>
                  <dd className="truncate text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <p className="mt-3 text-[10.5px] leading-relaxed text-quiet">
            Field names follow Zeek&apos;s <span className="font-mono">conn.log</span>. The platform tails this
            file with a persisted byte offset, so a restart resumes instead of replaying.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <p className="mono-label">Classification breakdown</p>
          <ul className="mt-3 space-y-1.5">
            {Array.from(counts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([label, count]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`w-24 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[9px] uppercase ring-1 ${categoryTone[label] ?? "bg-canvas-soft text-quiet ring-line"}`}>
                    {label}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                    <span
                      className="block h-full rounded-full bg-forest/70"
                      style={{ width: `${(count / visible.length) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 text-right font-mono text-[10px] text-quiet">{count}</span>
                </li>
              ))}
          </ul>
          {selected && selected.rules.length > 0 ? (
            <div className="mt-4 rounded-lg border border-line-soft bg-canvas-soft/60 p-3">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                Rule detectors on the selected event
              </p>
              <ul className="mt-1.5 space-y-1">
                {selected.rules.map((rule) => (
                  <li key={rule} className="font-mono text-[10.5px] text-forest">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-[10.5px] text-quiet">
              The selected event triggered no behavioural rules. Rule hits stay separate from model
              scores so an analyst can tell which signal fired.
            </p>
          )}
          <Link
            href="/architecture/"
            className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-700 hover:text-forest"
          >
            Open the full architecture explorer
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
