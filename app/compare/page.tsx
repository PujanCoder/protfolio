import type { Metadata } from "next";
import { ArrowUpRight, Scale } from "lucide-react";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { Badge, CTASection, PageHero, SectionHeader } from "@/components/ui";
import { compareProjects } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Compare Projects",
  description:
    "A side-by-side engineering comparison of the network intrusion detection platform, the medical imaging MLOps pipeline and the GPT-2 clone: problem, architecture, data, model, evaluation, deployment, monitoring and limitations.",
  alternates: { canonical: "/compare/" },
  openGraph: {
    title: "Compare Projects — Pujan Pandey",
    description:
      "Three systems compared on the dimensions that decide whether software survives contact with production.",
    url: "/compare/",
  },
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Comparison"
        title="Three systems, one honest scoreboard."
        description="The same nine questions asked of each project: what problem it solves, how it is built, how the data is handled, what the model does, how it was evaluated, where it runs, what you can observe, and what actually limits it."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Scale className="h-3 w-3" />
            {compareProjects.length} systems
          </Badge>
          <Badge tone="neutral">Nine dimensions</Badge>
          <Badge tone="neutral">No rounding up</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <ComparisonTable />
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page py-12 md:py-14">
          <SectionHeader
            eyebrow="How to read this"
            title="The differences are the point."
            description="Three projects that share a discipline but not a shape: one is a live detection system, one is a pipeline that polices itself, and one is a reference implementation with no service at all."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Detection needs freshness",
                body: "The NDR platform is judged on latency and false positives, which is why both are measured rather than estimated, and why replay data is labelled.",
              },
              {
                title: "Promotion needs a gate",
                body: "The medical pipeline is judged on what it refuses. Its most important recorded behaviour is a rejected retrain, not a successful one.",
              },
              {
                title: "Understanding needs subtraction",
                body: "The GPT-2 clone removes the transformers library entirely. Its value is structural fidelity and tests, and it says so instead of claiming a trained model.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="text-[14px] font-medium text-forest">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {compareProjects.map((project) => (
              <a
                key={project.slug}
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
              >
                {project.short} repository
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Compare them with your own constraints."
        description="If your context is latency, auditability or model risk, the trade-offs differ. Happy to walk through them."
      />
    </>
  );
}
