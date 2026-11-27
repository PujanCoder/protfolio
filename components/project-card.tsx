import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectMotif } from "@/components/project-motif";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/80 hover:shadow-[0_22px_45px_-30px_rgba(6,78,59,0.5)]">
      <div className="relative h-40 overflow-hidden border-b border-line">
        <ProjectMotif
          motif={project.motif}
          className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-emerald-200/80 bg-white/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-800">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full border border-line bg-white/90 px-2 py-0.5 font-mono text-[9.5px] text-quiet">
          {project.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.13em] text-quiet">
          {project.kicker}
        </p>
        <h3 className="mt-2 text-[16.5px] leading-snug">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-emerald-700 after:absolute after:inset-0 after:z-10"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-quiet">
          {project.subtitle}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3.5">
          {project.metrics.slice(0, 3).map((metric) => (
            <div key={metric.label}>
              <dd className="font-mono text-[14px] leading-none tracking-tight text-forest">
                {metric.value}
              </dd>
              <dt className="mt-1.5 text-[10px] leading-snug text-quiet">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-700">
            Read case study
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="relative z-20 inline-flex items-center gap-1 text-[11.5px] text-quiet transition-colors hover:text-forest"
          >
            Repository
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
