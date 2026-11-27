"use client";

import { useState } from "react";
import { BarChart3, Brain, Braces, ShieldCheck } from "lucide-react";
import { DataPlayground } from "@/components/playground/data-playground";
import { MlPlayground } from "@/components/playground/ml-playground";
import { NlpPlayground } from "@/components/playground/nlp-playground";

const tabs = [
  {
    id: "ml",
    label: "Machine learning",
    Icon: Brain,
    blurb: "Train three models on a synthetic dataset, pick the features, and score a connection you build yourself.",
  },
  {
    id: "nlp",
    label: "NLP",
    Icon: Braces,
    blurb: "Byte-level BPE trained live, causal attention arithmetic, and the real GPT-2 shapes from the repository.",
  },
  {
    id: "data",
    label: "Data science",
    Icon: BarChart3,
    blurb: "Explore the dataset, change preprocessing, engineer a feature, and watch the metrics respond.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function PlaygroundTabs() {
  const [tab, setTab] = useState<TabId>("ml");
  const active = tabs.find((item) => item.id === tab) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Playground modules" className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-canvas-soft p-1.5">
        {tabs.map(({ id, label, Icon }) => {
          const selected = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                selected ? "bg-white text-forest shadow-sm" : "text-quiet hover:bg-white/60 hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-[11.5px] leading-relaxed text-emerald-900">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {active.blurb} Everything runs locally in your browser on a synthetic dataset — no real traffic, no
        external model calls, nothing to install.
      </p>

      <div className="mt-6">
        {tab === "ml" ? <MlPlayground /> : null}
        {tab === "nlp" ? <NlpPlayground /> : null}
        {tab === "data" ? <DataPlayground /> : null}
      </div>
    </div>
  );
}
