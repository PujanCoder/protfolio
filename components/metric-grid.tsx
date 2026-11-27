import type { Metric } from "@/lib/projects";

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white px-4 py-4">
          <dd className="font-mono text-[17px] leading-none tracking-tight text-forest">
            {metric.value}
          </dd>
          <dt className="mt-2 text-[10.5px] leading-snug text-quiet">
            {metric.label}
          </dt>
          {metric.note ? (
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet/70">
              {metric.note}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
