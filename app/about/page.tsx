import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CTASection, PageHero } from "@/components/ui";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pujan Pandey's technical journey: quantum computing with Qiskit, machine learning engineering, MLOps and security analytics — and the philosophy behind the work.",
  alternates: { canonical: "/about/" },
};

const journey = [
  {
    phase: "The start",
    title: "Quantum computing first",
    body: "Shor's algorithm was the thing that made computation feel strange and worth chasing. I implemented it in Qiskit, then Grover's search, phase estimation, teleportation and superdense coding — not to collect notebooks, but to understand why each step is necessary.",
  },
  {
    phase: "The shift",
    title: "From circuits to models",
    body: "Quantum experiments kept hitting the same wall: the interesting failure was never the maths, it was the data and the evaluation. That pushed me toward applied machine learning — stratified splits, leakage, threshold selection, and metrics that survive a different dataset.",
  },
  {
    phase: "The discipline",
    title: "MLOps as the real problem",
    body: "A model in a notebook is a hypothesis. A model with a pipeline, a registry, a quality gate and a rollback path is a decision. Building the NDR platform and the medical-imaging pipeline taught me where production actually breaks: contracts, drift, restarts and silent failures.",
  },
  {
    phase: "Now",
    title: "Systems, not demos",
    body: "Today I build detection platforms, deep-learning implementations from scratch and agentic systems — each with tests, CI and a limitations section. I would rather publish a 0.00 recall result than pretend a model generalises.",
  },
];

const capabilities = [
  {
    title: "Machine learning engineering",
    body: "Feature contracts shared between training and inference, threshold selection against a false-positive budget, and evaluation reported with the split it came from.",
    points: [
      "HistGradientBoosting across 298k deduplicated flows",
      "ResNet18 transfer learning for chest X-ray triage",
      "Cross-dataset probes published, including the failures",
    ],
  },
  {
    title: "MLOps and platform work",
    body: "Pipelines that someone else can rerun: DVC stages, MLflow runs, model registry promotion, retraining and recovery automation.",
    points: [
      "DVC pipelines with tracked stages and artifacts",
      "Quality gates that compare a candidate against a baseline",
      "Prometheus and Grafana monitoring for drift and latency",
    ],
  },
  {
    title: "Detection engineering",
    body: "Turning raw telemetry into alerts an analyst can act on, with the model and the rules kept deliberately separate so each signal stays explainable.",
    points: [
      "Incremental Zeek log ingestion with offset persistence",
      "Ten behavioural rule detectors alongside the classifier",
      "Alert de-duplication with evidence attached per event",
    ],
  },
];

const principles = [
  {
    title: "Measure before claiming",
    body: "Latency percentiles, throughput and false-positive rates are in the README because they were measured, not estimated.",
  },
  {
    title: "Publish the failure modes",
    body: "The NDR platform documents a cross-dataset probe with zero recall. Hiding that would make every other number meaningless.",
  },
  {
    title: "Reproducibility is a feature",
    body: "Pinned dependencies, seeded splits, DVC-tracked artifacts and tests that fail when a contract drifts.",
  },
  {
    title: "Keep the interface honest",
    body: "Replay data is tagged, an idle sensor says it is idle, and no dashboard fabricates activity to look busy.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A builder's path from quantum circuits to production machine learning."
        description="I am Pujan Pandey, an AI/ML engineer in Butwal, Nepal. I study computer science, build systems that can be measured, and keep the parts that fail visible."
      >
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-quiet">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            {profile.location} · {profile.timezone}
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-forest"
          >
            <Mail className="h-3.5 w-3.5 text-emerald-600" />
            {profile.email}
          </a>
        </div>
      </PageHero>

      <section className="py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <p className="mono-label">The short version</p>
            <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
              I like the part of engineering where the number has to mean
              something.
            </h2>
            <p className="prose-body mt-5">
              My work sits on the engineering side of machine learning. I build
              pipelines that ingest continuously, models that are evaluated
              against a stated budget, and interfaces that tell the truth about
              how fresh a number is. The interesting problems are rarely in the
              model definition — they are in the data contract, the split, the
              restart, the alert that nobody trusts.
            </p>
            <p className="prose-body">
              Before that, quantum computing was my entry point. Implementing
              Shor&apos;s algorithm and Grover&apos;s search in Qiskit taught me
              to reason about state, measurement and probability in a way that
              transferred directly to thinking about uncertainty in ML systems.
              It also set the habit: build the thing, then explain precisely why
              it works and where it stops working.
            </p>
            <p className="prose-body">
              I am early in my career and deliberate about it. Rather than
              listing frameworks, I would rather point at the network detection
              platform that tails real Zeek logs, the GPT-2 clone with a
              tokenizer written from scratch, and the medical-imaging pipeline
              where a model only reaches production after passing a gate.
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-line bg-canvas-soft p-6">
            <p className="mono-label">At a glance</p>
            <dl className="mt-4 space-y-4 text-[12.5px]">
              {[
                { label: "Based in", value: `${profile.location} · ${profile.timezone}` },
                { label: "Focus", value: "Applied ML, MLOps, detection engineering" },
                { label: "Also building", value: "Qiskit experiments, LLM agent systems" },
                { label: "Currently", value: "Deepening production ML and security analytics" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-ink-soft">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-3.5">
              <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-800">
                <Sparkles className="h-3.5 w-3.5" />
                Open to work
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-quiet">
                {profile.availability}
              </p>
            </div>
            <Link
              href="/contact"
              className="group mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700 transition-colors hover:text-forest"
            >
              Start a conversation
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-16 md:py-20">
        <div className="container-page">
          <p className="mono-label">The journey</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
            Four turns that shaped how I build.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {journey.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-xl border border-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-emerald-700">
                      {item.phase}
                    </span>
                    <span className="font-mono text-[10px] text-quiet/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[15.5px] leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-quiet">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="container-page">
          <p className="mono-label">What I actually do</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
            Three kinds of work, all grounded in repositories.
          </h2>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-white p-6">
                <h3 className="text-[14.5px] leading-snug">{item.title}</h3>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-quiet">
                  {item.body}
                </p>
                <ul className="mt-4 space-y-2 border-t border-line-soft pt-4">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[11.5px] leading-relaxed text-ink-soft"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-emerald-50/40 py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="mono-label">Engineering philosophy</p>
            <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
              Four rules I do not break for a nicer demo.
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-quiet">
              These are the habits that came out of building systems meant to run
              unattended — and out of publishing the numbers that did not flatter
              me.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {principles.map((item, index) => (
              <li
                key={item.title}
                className="rounded-xl border border-emerald-100 bg-white p-5"
              >
                <span className="font-mono text-[10px] text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[13.5px] leading-snug">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-quiet">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mono-label">Where I am going</p>
            <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
              The next three problems.
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-quiet">
              I am looking for a team where machine learning is treated as
              infrastructure: monitored, versioned and owned by someone.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              {
                title: "Production ML at a real scale",
                body: "Models with SLAs, drift alarms and on-call ownership — the environment where MLOps decisions stop being theoretical.",
              },
              {
                title: "The ML and security intersection",
                body: "Detection systems that are honest about adversarial traffic, and ML systems that are themselves defensible.",
              },
              {
                title: "Quantum algorithms with practical intent",
                body: "Continuing Qiskit work with an eye on where quantum methods complement classical ML rather than replace it.",
              },
            ].map((item) => (
              <li key={item.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="text-[13.5px] leading-snug">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-quiet">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Want the detailed version?"
        description="The projects page has the architecture, the numbers and the limitations. The achievements page covers the recognition and leadership record."
      />
    </>
  );
}
