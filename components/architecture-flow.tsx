import type { FlowStage } from "@/lib/projects";

export function ArchitectureFlow({ stages }: { stages: FlowStage[] }) {
  return (
    <ol className="relative">
      {stages.map((stage, index) => (
        <li key={stage.stage} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 font-mono text-[9.5px] text-emerald-800">
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < stages.length - 1 ? (
              <span
                aria-hidden="true"
                className="w-px flex-1 bg-gradient-to-b from-emerald-200 via-emerald-100 to-transparent"
              />
            ) : null}
          </div>
          <div className={index < stages.length - 1 ? "pb-6" : "pb-0"}>
            <p className="text-[12.5px] font-medium leading-7 text-ink">
              {stage.stage}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-quiet">
              {stage.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
