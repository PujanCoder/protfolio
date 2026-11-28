"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  journeyCategories,
  journeyEntries,
  type JourneyCategory,
} from "@/lib/journey";

const categoryTone: Record<JourneyCategory, string> = {
  Engineering: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Quantum: "border-sky-200 bg-sky-50 text-sky-800",
  Recognition: "border-amber-200 bg-amber-50 text-amber-900",
  Hackathon: "border-violet-200 bg-violet-50 text-violet-800",
  Leadership: "border-teal-200 bg-teal-50 text-teal-800",
  Education: "border-slate-200 bg-slate-50 text-slate-700",
};

export function JourneyTimeline() {
  const [filter, setFilter] = useState<JourneyCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      filter === "all"
        ? journeyEntries
        : journeyEntries.filter((entry) => entry.category === filter),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`rounded-full border px-3 py-1.5 text-[11.5px] transition-colors ${
            filter === "all"
              ? "border-forest bg-forest text-white"
              : "border-line bg-white text-quiet hover:border-forest/30 hover:text-forest"
          }`}
        >
          All {journeyEntries.length}
        </button>
        {journeyCategories.map((category) => {
          const count = journeyEntries.filter((entry) => entry.category === category).length;
          const active = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-[11.5px] transition-colors ${
                active
                  ? "border-forest bg-forest text-white"
                  : "border-line bg-white text-quiet hover:border-forest/30 hover:text-forest"
              }`}
            >
              {category} {count}
            </button>
          );
        })}
      </div>

      <ol className="mt-8 space-y-3">
        {entries.map((entry) => {
          const open = openId === entry.id;
          return (
            <li key={entry.id} className="relative pl-6">
              <span
                aria-hidden="true"
                className="absolute left-0 top-4 h-2 w-2 rounded-full bg-emerald-600 ring-4 ring-emerald-50"
              />
              <span aria-hidden="true" className="absolute bottom-0 left-[3.5px] top-7 w-px bg-line" />
              <div className="rounded-xl border border-line bg-white transition-colors hover:border-forest/20">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : entry.id)}
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-4 p-4 text-left"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] ${categoryTone[entry.category]}`}
                      >
                        {entry.category}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-quiet">
                        {entry.year ?? entry.period}
                      </span>
                    </span>
                    <span className="mt-2 block text-[14.5px] font-medium leading-snug text-ink">
                      {entry.title}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-quiet">{entry.org}</span>
                    <span className="mt-2 block text-[12.5px] leading-relaxed text-quiet">
                      {entry.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-quiet transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-line-soft px-4 py-4">
                        <ul className="space-y-2">
                          {entry.detail.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {entry.links?.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {entry.links.map((link) =>
                              link.href.startsWith("/") ? (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
                                >
                                  {link.label}
                                </Link>
                              ) : (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
                                >
                                  {link.label}
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              ),
                            )}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
