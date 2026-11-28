"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, FileCode2, Info } from "lucide-react";
import { archFileUrl, type ArchSystem } from "@/lib/architecture";

export function ArchitectureExplorer({ systems }: { systems: ArchSystem[] }) {
  const [systemSlug, setSystemSlug] = useState(systems[0].slug);
  const [nodeId, setNodeId] = useState(systems[0].nodes[0].id);

  const system = useMemo(
    () => systems.find((item) => item.slug === systemSlug) ?? systems[0],
    [systems, systemSlug],
  );
  const node = system.nodes.find((item) => item.id === nodeId) ?? system.nodes[0];

  function selectSystem(slug: string) {
    const next = systems.find((item) => item.slug === slug);
    setSystemSlug(slug);
    if (next) setNodeId(next.nodes[0].id);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Systems"
        className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-canvas-soft p-1.5"
      >
        {systems.map((item) => {
          const active = item.slug === system.slug;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectSystem(item.slug)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-left transition-colors ${
                active ? "bg-white shadow-sm" : "hover:bg-white/60"
              }`}
            >
              <span className={`block text-[13px] font-medium ${active ? "text-forest" : "text-ink-soft"}`}>
                {item.name}
              </span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                {item.kicker}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 max-w-3xl text-[13.5px] leading-relaxed text-quiet">{system.summary}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute left-[15px] top-3 bottom-3 w-px bg-line"
          />
          {system.nodes.map((item, index) => {
            const active = item.id === node.id;
            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => setNodeId(item.id)}
                  aria-current={active ? "step" : undefined}
                  className={`group flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${
                    active ? "bg-emerald-50/80" : "hover:bg-canvas-soft"
                  }`}
                >
                  <span
                    className={`relative z-10 mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-line bg-white text-quiet group-hover:border-emerald-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-[13px] font-medium ${active ? "text-forest" : "text-ink"}`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-quiet">
                      {item.role}
                    </span>
                  </span>
                </button>
                {index < system.nodes.length - 1 ? (
                  <span className="ml-[15px] flex h-3 items-center" aria-hidden="true">
                    <ArrowDown className="h-3 w-3 text-line" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${system.slug}-${node.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-line bg-white p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mono-label">{node.role}</p>
                  <h3 className="mt-2 text-[19px] leading-tight text-forest">{node.label}</h3>
                </div>
                <a
                  href={system.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
                >
                  Repository
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{node.purpose}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line-soft bg-canvas-soft/70 p-3">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">Input</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-ink-soft">{node.input}</p>
                </div>
                <div className="rounded-xl border border-line-soft bg-canvas-soft/70 p-3">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">Output</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-ink-soft">{node.output}</p>
                </div>
              </div>

              <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">{node.detail}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {node.tech.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-canvas-soft px-2 py-0.5 font-mono text-[10px] text-quiet"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 border-t border-line-soft pt-4">
                <p className="mono-label">Source</p>
                <ul className="mt-2.5 space-y-1.5">
                  {node.files.map((file) => (
                    <li key={file.path}>
                      <a
                        href={archFileUrl(system, file.path)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-start gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-canvas-soft"
                      >
                        <FileCode2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block break-all font-mono text-[11.5px] text-forest group-hover:underline">
                            {file.path}
                          </span>
                          <span className="block text-[11px] text-quiet">{file.note}</span>
                        </span>
                        <ArrowRight className="ml-auto mt-1 h-3 w-3 shrink-0 text-line transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] leading-relaxed text-amber-900">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {system.caveat}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
