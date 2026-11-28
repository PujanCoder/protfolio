"use client";

import { Briefcase, TerminalSquare } from "lucide-react";
import { useMode, type Mode } from "@/components/mode/mode-provider";

const options: { value: Mode; label: string; hint: string; Icon: typeof Briefcase }[] = [
  { value: "recruiter", label: "Recruiter", hint: "Summary, strengths and CVs", Icon: Briefcase },
  { value: "engineer", label: "Engineer", hint: "Architecture, labs and research", Icon: TerminalSquare },
];

export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useMode();

  return (
    <div
      role="group"
      aria-label="Browsing mode"
      className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-canvas-soft p-0.5"
    >
      {options.map(({ value, label, hint, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={active}
            title={hint}
            className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${
              active
                ? "bg-white text-forest shadow-[0_1px_2px_rgba(6,78,59,0.12)]"
                : "text-quiet hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className={compact ? "sr-only sm:not-sr-only" : undefined}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
