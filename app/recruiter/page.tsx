import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  Trophy,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Badge, PageHero, SectionHeader } from "@/components/ui";
import { achievements } from "@/lib/achievements";
import { cvVariants, variantSpecs } from "@/lib/cv/content";
import { education } from "@/lib/education";
import { profile } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Recruiter View",
  description:
    "A hiring-focused summary of Pujan Pandey: AI/ML engineer and MLOps developer in Nepal, with four downloadable CV variants, verified projects, achievements and education.",
  alternates: { canonical: "/recruiter/" },
  openGraph: {
    title: "Recruiter View — Pujan Pandey",
    description:
      "Summary, strongest projects, verified achievements and four CV variants generated from the same verified source.",
    url: "/recruiter/",
  },
};

const cvNotes: Record<(typeof cvVariants)[number], string> = {
  "ai-ml": "Modelling, evaluation and deep learning work first.",
  mlops: "Pipelines, registries, gates and monitoring first.",
  security: "Detection engineering and network telemetry first.",
  general: "Balanced software engineering framing.",
};

const strengths = skillGroups
  .filter((group) => ["ai-ml", "mlops", "deep-learning", "backend", "cybersecurity", "quantum"].includes(group.id))
  .map((group) => ({
    title: group.title,
    items: group.items.slice(0, 6),
    evidence: group.evidence,
  }));

const featured = projects.filter((project) => project.featured).slice(0, 4);

export default function RecruiterPage() {
  return (
    <>
      <PageHero
        eyebrow="For recruiters and hiring teams"
        title="The short version, with the receipts attached."
        description="Nine seconds is the average first pass. Here is the summary, the strongest work, the verified record, and four CVs that all come from the same source of truth — no inflated titles, no invented employers."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Briefcase className="h-3 w-3" />
            {profile.availability}
          </Badge>
          <Badge tone="neutral">{profile.location}</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-10 py-12 md:py-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="mono-label">Profile</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight">
              {profile.shortRole}, working on the engineering side of machine learning.
            </h2>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
              Two of the three flagship systems are production-shaped rather than notebook-shaped: a
              real-time network intrusion platform with streaming ingestion, a model registry and a
              security dashboard, and a medical-imaging pipeline whose promotion gate rejected its own
              retrain because recall fell on the held-out set. The third, a GPT-2 clone written from
              scratch in PyTorch, exists to show the transformer internals are understood rather than
              imported.
            </p>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-quiet">
              What that means for a hiring decision: the code is public, the metrics are recorded, the
              CI actually runs, and every claim on this site links to a file or a run you can check.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-canvas-soft/60 p-4">
                <p className="mono-label">Strongest evidence</p>
                <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
                  <li>0.973 F1 on 44,734 held-out network flows, with the failing cross-dataset probe published beside it.</li>
                  <li>A quality gate that rejected its own retrain at 0.236 tuberculosis recall.</li>
                  <li>GPT-2 reimplemented in PyTorch without the transformers library.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-line bg-canvas-soft/60 p-4">
                <p className="mono-label">What I am looking for</p>
                <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
                  <li>AI/ML engineering with production constraints.</li>
                  <li>MLOps ownership: pipelines, promotion, monitoring.</li>
                  <li>Detection engineering and security analytics.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas-soft/60 p-5">
            <p className="mono-label">Contact</p>
            <ul className="mt-3 space-y-2.5 text-[13px]">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-forest"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-forest"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  github.com/{profile.githubHandle}
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-forest"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              </li>
            </ul>
            <div className="mt-5 border-t border-line pt-4">
              <p className="mono-label">Location</p>
              <p className="mt-1.5 text-[12.5px] text-ink-soft">
                {profile.location} · {profile.timezone}
              </p>
            </div>
            <Link
              href="/contact/"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-forest-deep"
            >
              Contact me
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page py-12 md:py-14">
          <SectionHeader
            eyebrow="CV"
            title="Four CVs, one source of truth."
            description="Each version reorders the same verified facts for a different role. No variant invents experience, dates or employers."
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cvVariants.map((variant) => {
              const spec = variantSpecs[variant];
              return (
                <a
                  key={variant}
                  href={`/api/cv/${variant}`}
                  className="group flex flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-forest/30"
                >
                  <Download className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span className="mt-3 text-[13.5px] font-medium text-ink group-hover:text-forest">
                    {spec.label}
                  </span>
                  <span className="mt-1.5 flex-1 text-[11.5px] leading-relaxed text-quiet">
                    {cvNotes[variant]}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
                    Download PDF
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>
              );
            })}
          </div>
          <p className="mt-4 text-[11.5px] text-quiet">
            PDFs are generated on the server from the same data that renders this site, so they cannot
            drift from the projects below.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <SectionHeader
            eyebrow="Selected work"
            title="Four systems worth reading."
            action={{ href: "/projects/", label: "All case studies" }}
          />
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {featured.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}/`}
                className="group rounded-xl border border-line p-5 transition-colors hover:border-forest/25"
              >
                <p className="mono-label">{project.kicker}</p>
                <h3 className="mt-2 text-[15px] leading-snug text-ink group-hover:text-forest">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-quiet">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.metrics.slice(0, 3).map((metric) => (
                    <span
                      key={metric.label}
                      className="rounded-md bg-canvas-soft px-2 py-1 font-mono text-[10px] text-forest"
                    >
                      {metric.label}: {metric.value}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page grid gap-10 py-12 md:py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader eyebrow="Technical strengths" title="Where the depth actually is." />
            <div className="mt-6 space-y-3">
              {strengths.map((group) => (
                <div key={group.title} className="rounded-xl border border-line bg-white p-4">
                  <p className="text-[13px] font-medium text-forest">{group.title}</p>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-quiet">{group.evidence}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-quiet"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Record" title="Verified recognition." />
            <ul className="mt-6 space-y-2.5">
              {achievements
                .slice()
                .sort((a, b) => a.order - b.order)
                .slice(0, 6)
                .map((item) => (
                  <li key={item.slug} className="flex items-start gap-3 rounded-lg border border-line bg-white p-3.5">
                    <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>
                      <span className="block text-[12.5px] font-medium text-ink">{item.title}</span>
                      <span className="block text-[11px] text-quiet">
                        {item.org}
                        {item.period ? ` · ${item.period}` : ""}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>

            <div className="mt-8">
              <SectionHeader eyebrow="Education" title="Academic record." />
              <ul className="mt-5 space-y-2.5">
                {education.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 rounded-lg border border-line bg-white p-3.5">
                    <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>
                      <span className="block text-[12.5px] font-medium text-ink">
                        {entry.level} — {entry.title}
                      </span>
                      <span className="block text-[11px] text-quiet">
                        {entry.institution ?? "Institution not published"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/education/"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 hover:text-forest"
              >
                Full education and self-directed study
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
