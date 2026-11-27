import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { PageHero } from "@/components/ui";
import { archiveProjects, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering case studies from Pujan Pandey: a real-time network intrusion detection platform, medical imaging MLOps, a GPT-2 clone from scratch, LLM agent systems and more.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    title: "Projects — Pujan Pandey",
    description:
      "Case studies covering MLOps, network intrusion detection, deep learning from scratch and LLM agent systems.",
    url: "/projects/",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Six case studies, each with the numbers and the limitations."
        description="Filter by discipline. Every card opens a full engineering write-up with architecture, evaluation results and the failure modes I could not solve."
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {[
            { value: String(projects.length), label: "case studies" },
            { value: String(archiveProjects.length), label: "other repositories" },
            { value: "3", label: "MLOps pipelines" },
            { value: "8", label: "Qiskit experiments" },
          ].map((item) => (
            <div key={item.label}>
              <dd className="font-mono text-[19px] leading-none text-forest">
                {item.value}
              </dd>
              <dt className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="py-12 md:py-16">
        <div className="container-page">
          <ProjectsExplorer projects={projects} archive={archiveProjects} />
        </div>
      </section>
    </>
  );
}
