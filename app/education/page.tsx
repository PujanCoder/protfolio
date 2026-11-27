import type { Metadata } from "next";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { CTASection, PageHero } from "@/components/ui";
import {
  education,
  higherEducationInterests,
  selfDirected,
} from "@/lib/education";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Academic background and self-directed learning: secondary schooling at Everest English Boarding School, Class 12 computer science, and the projects that carried the rest.",
  alternates: { canonical: "/education/" },
  openGraph: {
    title: "Education — Pujan Pandey",
    description:
      "Formal schooling in Nepal plus the self-directed work in quantum computing, MLOps and deep learning that shaped the engineering practice.",
    url: "/education/",
  },
};

export default function EducationPage() {
  return (
    <>
      <PageHero
        eyebrow="Education"
        title="Formal study, and the projects that carried the rest."
        description="School gave me the fundamentals. The repositories are where the engineering habits came from — built, broken, tested and documented outside the syllabus."
      />

      <section className="py-14 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="mono-label">Academic background</p>
            <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
              Computer science, in Nepal.
            </h2>
            <p className="prose-body mt-5">
              My formal education is in computer science. Class 10 at Everest
              English Boarding School, then higher secondary study in computer
              science — where the coursework started overlapping with what I was
              already building on my own.
            </p>
            <p className="prose-body">
              I have deliberately left out personal details that do not belong on
              a public site: no date of birth, no home address, no academic
              records. What matters here is the technical direction.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                Currently exploring higher-education pathways in cyber security,
                artificial intelligence and emerging technologies.
              </p>
            </div>
          </div>

          <ol className="relative space-y-5 border-l border-line pl-6">
            {education.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.72rem] top-5 h-2 w-2 rounded-full border-2 border-white bg-emerald-600"
                />
                <div className="rounded-xl border border-line bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[15px] leading-snug">
                      {entry.level} — {entry.title}
                    </h3>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                      {entry.institution ?? "Nepal"}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {entry.focus.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-line-soft bg-canvas-soft px-2 py-1 font-mono text-[10px] leading-none text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-quiet">
                    {entry.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-14 md:py-20">
        <div className="container-page">
          <p className="mono-label">Self-directed</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
            The curriculum I set myself.
          </h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-quiet">
            Four tracks, each with a public repository you can read end to end.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {selfDirected.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_40px_-30px_rgba(6,78,59,0.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[14px] leading-snug text-forest">{item.title}</h3>
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-quiet transition-colors group-hover:text-emerald-700" />
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-quiet">{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14 md:py-20">
        <div className="container-page">
          <p className="mono-label">Next</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
            Where I want to study further.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {higherEducationInterests.map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="text-[13.5px] leading-snug">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-quiet">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Hiring for an internship or junior role?"
        description="I am looking for a team where I can work on production machine learning with real users, real constraints and real evaluation."
      />
    </>
  );
}
