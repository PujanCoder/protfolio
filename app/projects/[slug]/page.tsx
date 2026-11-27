import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { MetricGrid } from "@/components/metric-grid";
import { ProjectMotif } from "@/components/project-motif";
import { CTASection } from "@/components/ui";
import { getProject, neighbours, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects
    .filter((project) => project.detail)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      title: `${project.title} — Pujan Pandey`,
      description: project.subtitle,
      url: `/projects/${project.slug}/`,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.detail) {
    notFound();
  }

  const { previous, next } = neighbours(project.slug);

  return (
    <>
      <section className="border-b border-line bg-canvas-soft">
        <div className="container-page py-10 md:py-14">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-[12px] text-quiet transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-700">
            {project.kicker} / {project.category} / {project.year}
          </p>

          <h1 className="mt-3 max-w-4xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.06]">
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-quiet">
            {project.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-forest-deep"
            >
              View repository
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-quiet">
              github.com/PujanCoder
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-page">
          <MetricGrid metrics={project.metrics} />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:gap-14">
            <div>
              <div>
                <p className="mono-label">Overview</p>
                <p className="prose-body mt-3">{project.summary}</p>
              </div>

              <div className="mt-10">
                <p className="mono-label">The problem</p>
                <p className="prose-body mt-3">{project.problem}</p>
              </div>

              <div className="mt-10">
                <p className="mono-label">Approach</p>
                <ol className="mt-5 space-y-6">
                  {project.approach.map((item, index) => (
                    <li key={item.title} className="relative border-l border-line pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"
                      />
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1.5 text-[14.5px] leading-snug">{item.title}</h2>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-10">
                <p className="mono-label">Architecture</p>
                <div className="mt-4 rounded-xl border border-line bg-canvas-soft p-5">
                  <ArchitectureFlow stages={project.flow} />
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <p className="mono-label">What it gets right</p>
                  <ul className="mt-3 space-y-2.5">
                    {project.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[11.5px] leading-relaxed text-ink-soft"
                      >
                        <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-5">
                  <p className="mono-label text-amber-700">Known limitations</p>
                  <ul className="mt-3 space-y-2.5">
                    {project.limitations.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[11.5px] leading-relaxed text-ink-soft"
                      >
                        <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside className="h-fit space-y-4 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl border border-line bg-white">
                <ProjectMotif motif={project.motif} className="h-32 w-full" />
                <div className="border-t border-line p-5">
                  <p className="mono-label">Stack</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-line-soft bg-canvas-soft px-2 py-1 font-mono text-[10px] leading-none text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-white p-5">
                <p className="mono-label">Tags</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-quiet"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 text-[12.5px] text-ink-soft transition-colors hover:border-emerald-200 hover:text-forest"
              >
                Source code
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </aside>
          </div>

          <nav
            aria-label="Project navigation"
            className="mt-14 grid gap-4 border-t border-line pt-6 sm:grid-cols-2"
          >
            <Link
              href={`/projects/${previous.slug}`}
              className="group rounded-xl border border-line bg-white p-4 transition-colors hover:border-emerald-200"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </span>
              <p className="mt-1.5 text-[13px] font-medium text-ink group-hover:text-forest">
                {previous.title}
              </p>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-xl border border-line bg-white p-4 text-right transition-colors hover:border-emerald-200"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                Next
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
              <p className="mt-1.5 text-[13px] font-medium text-ink group-hover:text-forest">
                {next.title}
              </p>
            </Link>
          </nav>
        </div>
      </section>

      <CTASection
        title="Want to talk through the architecture?"
        description="I am happy to walk through any decision here — the evaluation strategy, the ingestion design, or why a model was not promoted."
      />
    </>
  );
}
