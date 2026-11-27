import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Atom, Trophy, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CTASection, PageHero } from "@/components/ui";
import { achievements, achievementTimeline } from "@/lib/achievements";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "IBM Quantum Qiskit Advocate, a third-place national hackathon finish, Nepathon participation and technical leadership as IT Club secretary.",
  alternates: { canonical: "/achievements/" },
  openGraph: {
    title: "Achievements — Pujan Pandey",
    description:
      "Quantum computing recognition, hackathon placements and technical leadership, with the evidence behind each claim.",
    url: "/achievements/",
  },
};

const qiskit = achievements.find((item) => item.slug === "qiskit-advocate")!;
const hackathons = achievements.filter((item) => item.category === "Hackathon");
const leadership = achievements.filter((item) => item.category === "Leadership");

function CircuitSketch() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <g stroke="#34d399" strokeOpacity="0.45" strokeWidth="1">
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="24" y1={y} x2="296" y2={y} />
        ))}
      </g>
      <g fill="none" stroke="#a7f3d0" strokeWidth="1.3">
        <rect x="66" y="26" width="30" height="28" rx="4" />
        <rect x="126" y="66" width="30" height="28" rx="4" />
        <rect x="186" y="26" width="30" height="28" rx="4" />
        <rect x="246" y="106" width="30" height="28" rx="4" />
      </g>
      <g fill="#a7f3d0" fontFamily="ui-monospace, monospace" fontSize="10" textAnchor="middle">
        <text x="81" y="45">H</text>
        <text x="141" y="85">X</text>
        <text x="201" y="45">M</text>
        <text x="261" y="125">M</text>
      </g>
      <g stroke="#6ee7b7" strokeWidth="1.2">
        <line x1="156" y1="80" x2="156" y2="120" />
        <line x1="146" y1="120" x2="166" y2="120" />
        <circle cx="156" cy="80" r="3.4" fill="#6ee7b7" />
        <line x1="276" y1="40" x2="276" y2="120" strokeDasharray="3 4" />
      </g>
      <g stroke="#059669" strokeOpacity="0.35" strokeDasharray="2 5">
        <line x1="24" y1="150" x2="296" y2="150" />
      </g>
      <text
        x="24"
        y="170"
        fill="#6ee7b7"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        letterSpacing="1.6"
      >
        4 QUBITS · 2 MEASUREMENTS
      </text>
    </svg>
  );
}

export default function AchievementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Achievements"
        title="Recognition, competitions and leadership."
        description="A record of what has been recognised so far: quantum computing advocacy, hackathon placements and technical leadership at school and in the community."
      />

      <section className="py-14 md:py-20">
        <div className="container-page">
          <article className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#6ee7b7_1px,transparent_1px)] [background-size:22px_22px]"
            />
            <div className="relative grid gap-8 p-7 md:grid-cols-[1.25fr_0.75fr] md:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-emerald-200">
                    <Atom className="h-3 w-3" />
                    Quantum computing
                  </span>
                  {qiskit.period ? (
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-emerald-300/80">
                      {qiskit.period}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-5 max-w-xl text-[clamp(1.6rem,3vw,2.3rem)] leading-tight text-white">
                  {qiskit.title}
                </h2>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-emerald-300">
                  {qiskit.org}
                </p>

                <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-emerald-50/85">
                  {qiskit.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {qiskit.detail.map((line) => (
                    <li key={line} className="flex gap-3 text-[12.5px] leading-relaxed text-emerald-50/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-300" />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-300/80">
                    Evidence in public repositories
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {qiskit.evidence.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-950/40 px-2.5 py-1.5 font-mono text-[10px] text-emerald-100 transition-colors hover:border-emerald-300/60 hover:text-white"
                        >
                          {item.label}
                          <ArrowUpRight className="h-2.5 w-2.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="hidden items-center md:flex">
                <div className="w-full rounded-xl border border-emerald-400/25 bg-emerald-950/40 p-4">
                  <CircuitSketch />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-14 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono-label">Hackathons</p>
              <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">
                Building under a deadline.
              </h2>
            </div>
            <Trophy className="hidden h-6 w-6 text-emerald-600 sm:block" aria-hidden="true" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {hackathons.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-amber-800">
                      {item.badge}
                    </span>
                    <span className="font-mono text-[10px] text-quiet/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[14.5px] leading-snug">{item.title}</h3>
                  <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                    {item.org}
                  </p>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-quiet">
                    {item.summary}
                  </p>
                  {item.detail.length > 0 ? (
                    <ul className="mt-4 space-y-2 border-t border-line-soft pt-3.5">
                      {item.detail.map((line) => (
                        <li key={line} className="text-[11.5px] leading-relaxed text-ink-soft">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono-label">Leadership</p>
              <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">
                Organising, not just attending.
              </h2>
            </div>
            <Users className="hidden h-6 w-6 text-emerald-600 sm:block" aria-hidden="true" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {leadership.map((item) => (
              <article key={item.slug} className="rounded-xl border border-line bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] leading-snug">{item.title}</h3>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                      {item.org}
                    </p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <Users className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-[12.5px] leading-relaxed text-quiet">
                  {item.summary}
                </p>
                {item.detail.length > 0 ? (
                  <ul className="mt-4 space-y-2 border-t border-line-soft pt-3.5">
                    {item.detail.map((line) => (
                      <li key={line} className="flex gap-2 text-[11.5px] leading-relaxed text-ink-soft">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-14 md:py-20">
        <div className="container-page">
          <p className="mono-label">Timeline</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">
            How the work accumulated.
          </h2>

          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {achievementTimeline.map((item) => (
              <li key={`${item.year}-${item.title}`} className="relative border-t border-line pt-5">
                <span
                  aria-hidden="true"
                  className="absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-emerald-600"
                />
                <p className="font-mono text-[10.5px] tracking-[0.12em] text-emerald-700">
                  {item.year}
                </p>
                <h3 className="mt-2 text-[13.5px] leading-snug">{item.title}</h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-quiet">{item.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-2xl text-[11.5px] leading-relaxed text-quiet">
            Where a claim depends on an external record — a certificate, an event
            page or an organiser announcement — the link is added as soon as it is
            public.{" "}
            <Link href="/contact" className="text-emerald-700 hover:text-forest">
              Get in touch
            </Link>{" "}
            if you need supporting documentation.
          </p>
        </div>
      </section>

      <CTASection
        title="Building a team that ships?"
        description="I am looking for AI/ML and MLOps work where the evaluation, the deployment and the monitoring all matter."
      />
    </>
  );
}
