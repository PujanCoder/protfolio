import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-soft opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <div className="container-page relative py-14 md:py-20">
        <p className="mono-label">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.06]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-quiet md:text-[15.5px]">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mono-label">{eyebrow}</p> : null}
        <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-quiet">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-emerald-700 transition-colors hover:text-forest"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function StatStrip({
  items,
}: {
  items: readonly { value: string; label: string; note?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-5 py-5">
          <dd className="font-mono text-[20px] leading-none tracking-tight text-forest">
            {item.value}
          </dd>
          <dt className="mt-2 text-[11.5px] leading-snug text-quiet">
            {item.label}
          </dt>
          {item.note ? (
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet/70">
              {item.note}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function CTASection({
  title = "Let's build something that has to work.",
  description = "If you are working on applied ML, MLOps, detection engineering or quantum computing, I would like to hear about it.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="border-t border-line bg-emerald-50/60">
      <div className="container-page flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <p className="mono-label">Next step</p>
          <h2 className="mt-3 max-w-xl text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-quiet">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-forest-deep"
          >
            Contact me
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="https://github.com/PujanCoder"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-forest/20 bg-white px-5 py-3 text-[13px] font-medium text-forest transition-colors hover:border-forest/40"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export function Badge({
  children,
  tone = "emerald",
}: {
  children: ReactNode;
  tone?: "emerald" | "neutral" | "amber";
}) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    neutral: "border-line bg-white text-quiet",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
