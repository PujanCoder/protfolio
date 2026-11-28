"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Columns3, Rows3 } from "lucide-react";
import { compareProjects, compareRows } from "@/lib/compare";

export function ComparisonTable() {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "stacked">("table");

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-quiet">
          {compareRows.length} dimensions · {compareProjects.length} systems · every cell traceable to a
          repository
        </p>
        <div className="inline-flex rounded-lg border border-line bg-canvas-soft p-0.5 lg:hidden">
          <button
            type="button"
            onClick={() => setView("stacked")}
            aria-pressed={view === "stacked"}
            className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11.5px] ${
              view === "stacked" ? "bg-white text-forest shadow-sm" : "text-quiet"
            }`}
          >
            <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />
            Stacked
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11.5px] ${
              view === "table" ? "bg-white text-forest shadow-sm" : "text-quiet"
            }`}
          >
            <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
            Table
          </button>
        </div>
      </div>

      <div className={view === "table" ? "overflow-x-auto" : "hidden lg:block lg:overflow-x-auto"}>
        <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Comparison of three engineering projects across problem, architecture, data processing,
            model approach, evaluation, deployment, monitoring, hardest constraint and stack.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-[168px] bg-white pb-3 pr-4 align-bottom">
                <span className="mono-label">Dimension</span>
              </th>
              {compareProjects.map((project) => (
                <th key={project.slug} scope="col" className="pb-3 pr-4 align-bottom">
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="group inline-flex items-start gap-1 text-[13.5px] font-medium leading-snug text-ink hover:text-forest"
                  >
                    {project.name}
                    <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-quiet group-hover:text-emerald-600" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => {
              const active = activeRow === row.id;
              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setActiveRow(row.id)}
                  onFocus={() => setActiveRow(row.id)}
                  className={active ? "bg-emerald-50/50" : undefined}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-t border-line py-4 pr-4 align-top ${
                      active ? "bg-emerald-50/50" : "bg-white"
                    }`}
                  >
                    <span className="block text-[12.5px] font-medium text-forest">{row.label}</span>
                    <span className="mt-1 block text-[10.5px] leading-snug text-quiet">{row.hint}</span>
                  </th>
                  {compareProjects.map((project) => (
                    <td
                      key={project.slug}
                      className="border-t border-line py-4 pr-4 align-top text-[12.5px] leading-relaxed text-ink-soft"
                    >
                      {row.values[project.slug]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={`mt-6 space-y-4 lg:hidden ${view === "stacked" ? "" : "hidden"}`}>
        {compareProjects.map((project) => (
          <div key={project.slug} className="rounded-xl border border-line bg-white p-4">
            <Link href={`/projects/${project.slug}/`} className="text-[14px] font-medium text-forest">
              {project.name}
            </Link>
            <dl className="mt-3 space-y-3">
              {compareRows.map((row) => (
                <div key={row.id}>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                    {row.values[project.slug]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
