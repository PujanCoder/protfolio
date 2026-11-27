import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/projects";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-soft opacity-60 [mask-image:radial-gradient(75%_60%_at_50%_20%,black,transparent_78%)]"
      />
      <div className="container-page relative py-20 md:py-28">
        <p className="mono-label">404 · page not found</p>
        <h1 className="mt-4 max-w-2xl text-[clamp(2rem,4.4vw,3rem)] leading-[1.05]">
          This route does not exist — but the work does.
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-quiet">
          The link may be out of date. Everything public lives under the projects
          page, and every case study is linked from there.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-forest-deep"
          >
            Browse projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-forest/25 hover:text-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back home
          </Link>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="mono-label">Popular case studies</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-4 transition-colors hover:border-emerald-200"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-quiet">
                    {project.category}
                  </span>
                  <span className="mt-2 text-[13px] font-medium leading-snug text-ink group-hover:text-forest">
                    {project.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
