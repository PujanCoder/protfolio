"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SkillGroup } from "@/lib/skills";
import { getProject } from "@/lib/projects";

export function SkillExplorer({ groups }: { groups: SkillGroup[] }) {
  const [activeId, setActiveId] = useState(groups[0]?.id ?? "");
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
      <div
        role="tablist"
        aria-label="Skill categories"
        aria-orientation="vertical"
        className="flex flex-wrap gap-1.5 lg:flex-col"
      >
        {groups.map((group) => {
          const selected = group.id === active.id;
          return (
            <button
              key={group.id}
              role="tab"
              id={`tab-${group.id}`}
              aria-selected={selected}
              aria-controls={`panel-${group.id}`}
              onClick={() => setActiveId(group.id)}
              className={`rounded-lg border px-3.5 py-2.5 text-left text-[12px] transition-colors lg:w-full lg:text-[12.5px] ${
                selected
                  ? "border-forest/25 bg-emerald-50 font-medium text-forest"
                  : "border-transparent text-quiet hover:bg-canvas-soft hover:text-ink"
              }`}
            >
              {group.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="rounded-xl border border-line bg-white p-6 md:p-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[18px] leading-snug">{active.title}</h2>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
            {active.items.length} tools
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-quiet">{active.caption}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {active.items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-line bg-canvas-soft px-2.5 py-1.5 font-mono text-[11px] text-ink-soft transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
          <p className="mono-label">Where it shows up</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
            {active.evidence}
          </p>
        </div>

        {active.projectSlugs.length > 0 ? (
          <div className="mt-5">
            <p className="mono-label">Related case studies</p>
            <ul className="mt-2.5 space-y-1.5">
              {active.projectSlugs.map((slug) => {
                const project = getProject(slug);
                if (!project) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/projects/${slug}`}
                      className="group inline-flex items-center gap-1.5 text-[12.5px] text-emerald-700 transition-colors hover:text-forest"
                    >
                      {project.title}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
