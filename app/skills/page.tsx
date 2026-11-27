import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkillExplorer } from "@/components/skill-explorer";
import { CTASection, PageHero } from "@/components/ui";
import { skillGroups, skillsFootnote } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Verified technical skills: Python and PyTorch, scikit-learn, MLflow and DVC, FastAPI, Zeek and network security analytics, Docker, CI/CD and Qiskit.",
  alternates: { canonical: "/skills/" },
  openGraph: {
    title: "Skills — Pujan Pandey",
    description:
      "An explorer of the tools behind the projects: machine learning, MLOps, security analytics, backend engineering and quantum computing.",
    url: "/skills/",
  },
};

export default function SkillsPage() {
  return (
    <>
      <PageHero
        eyebrow="Technical skills"
        title="A stack that shows up in the code."
        description="No percentage bars. Each category is grouped by where it is used: the tools, the sentence explaining what I actually did with them, and the case studies where you can check."
      >
      </PageHero>

      <section className="py-12 md:py-16">
        <div className="container-page">
          <SkillExplorer groups={skillGroups} />

          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-line bg-canvas-soft p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[11.5px] leading-relaxed text-quiet">
              {skillsFootnote}
            </p>
            <Link
              href="/projects"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-medium text-emerald-700 transition-colors hover:text-forest"
            >
              See the evidence
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-14 md:py-18">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "How I learn a tool",
              body: "Read the docs, build the smallest working version, then write the test that proves it works. Frameworks change; the debugging habit does not.",
            },
            {
              title: "What I am adding next",
              body: "Deeper Kubernetes for model serving, feature stores, and formal evaluation harnesses for LLM systems.",
            },
            {
              title: "What I do not claim",
              body: "Anything not in a repository. If a tool is listed, there is a commit, a pipeline or a notebook behind it.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="text-[13.5px] leading-snug">{item.title}</h2>
              <p className="mt-2 text-[12px] leading-relaxed text-quiet">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title="Need someone who can own the pipeline, not just the notebook?"
        description="I work across model training, evaluation, packaging, deployment and the monitoring that keeps it honest."
      />
    </>
  );
}
