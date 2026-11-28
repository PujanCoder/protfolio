import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes } from "lucide-react";
import { ArchitectureExplorer } from "@/components/architecture/explorer";
import { Badge, CTASection, PageHero } from "@/components/ui";
import { archSystems } from "@/lib/architecture";

export const metadata: Metadata = {
  title: "Architecture Explorer",
  description:
    "Click through the real architecture of three systems: a real-time network intrusion detection platform, a self-healing medical imaging MLOps pipeline, and a GPT-2 transformer implemented from scratch.",
  alternates: { canonical: "/architecture/" },
  openGraph: {
    title: "Architecture Explorer — Pujan Pandey",
    description:
      "Every stage is clickable: purpose, input, output, technologies and the source files that implement it.",
    url: "/architecture/",
  },
};

export default function ArchitecturePage() {
  return (
    <>
      <PageHero
        eyebrow="Systems"
        title="Read the pipeline, then open the file."
        description="Three systems, stage by stage. Every node lists what goes in, what comes out, which technologies do the work, and the exact files in the repository that implement it — so the diagram can be checked rather than trusted."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Boxes className="h-3 w-3" />
            {archSystems.length} systems
          </Badge>
          <Badge tone="neutral">
            {archSystems.reduce((total, system) => total + system.nodes.length, 0)} stages
          </Badge>
          <Badge tone="neutral">
            {archSystems.reduce(
              (total, system) =>
                total + system.nodes.reduce((count, node) => count + node.files.length, 0),
              0,
            )}{" "}
            source references
          </Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <ArchitectureExplorer systems={archSystems} />
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page grid gap-4 py-12 md:grid-cols-3">
          {archSystems.map((system) => (
            <Link
              key={system.slug}
              href={`/projects/${system.slug}/`}
              className="group rounded-xl border border-line bg-white p-5 transition-colors hover:border-forest/25"
            >
              <p className="mono-label">{system.kicker}</p>
              <h2 className="mt-2 text-[16px] leading-tight text-ink group-hover:text-forest">
                {system.name}
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-quiet">
                {system.stack.slice(0, 4).join(" · ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
                Read the case study
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        title="Want the trade-offs, not just the boxes?"
        description="The case studies carry the measured results, the rejected candidates and the limitations I could not solve."
      />
    </>
  );
}
