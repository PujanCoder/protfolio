"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import type { ArchiveProject, Project, ProjectCategory } from "@/lib/projects";

type Filter = "All" | ProjectCategory;

export function ProjectsExplorer({
  projects,
  archive,
}: {
  projects: Project[];
  archive: ArchiveProject[];
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const categories = useMemo(() => {
    const set = new Set<Filter>(["All"]);
    projects.forEach((project) => set.add(project.category));
    archive.forEach((item) => set.add(item.category));
    return [...set];
  }, [projects, archive]);

  const visibleProjects = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );
  const visibleArchive = archive.filter(
    (item) => filter === "All" || item.category === filter,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by category">
        {categories.map((category) => {
          const active = filter === category;
          const count =
            category === "All"
              ? projects.length + archive.length
              : projects.filter((p) => p.category === category).length +
                archive.filter((a) => a.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${
                active
                  ? "border-forest bg-forest text-white"
                  : "border-line bg-white text-quiet hover:border-forest/30 hover:text-forest"
              }`}
            >
              {category}
              <span
                className={`font-mono text-[9.5px] ${
                  active ? "text-emerald-100" : "text-quiet/70"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-canvas-soft px-5 py-8 text-center text-[13px] text-quiet">
          No case study in this category yet — the repository list below covers
          the rest of the work.
        </p>
      ) : null}

      {visibleArchive.length > 0 ? (
        <div className="mt-14">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h2 className="text-[15px] font-medium text-forest">
              Other public repositories
            </h2>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
              {visibleArchive.length} projects
            </span>
          </div>
          <ul className="divide-y divide-line-soft">
            {visibleArchive.map((item) => (
              <li key={item.title} className="py-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[14px] font-medium text-ink">{item.title}</h3>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                    {item.category} · {item.year}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-[12.5px] leading-relaxed text-quiet">
                  {item.description}
                </p>
                {item.note ? (
                  <p className="mt-2 text-[11.5px] text-amber-700">{item.note}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {item.stack.map((tag) => (
                      <li
                        key={tag}
                        className="rounded border border-line-soft bg-canvas-soft px-1.5 py-1 font-mono text-[9.5px] leading-none text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-[11.5px] text-emerald-700 transition-colors hover:text-forest"
                  >
                    Repository
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
