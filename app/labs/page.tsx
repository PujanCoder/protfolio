import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Badge, CTASection, PageHero } from "@/components/ui";
import { labPages } from "@/lib/labs";

export const metadata: Metadata = {
  title: "Interactive Labs",
  description:
    "Three browser labs built on real implementations: network intrusion thresholds, a medical imaging quality gate, and byte-level BPE merges. Every number is computed locally.",
  alternates: { canonical: "/labs/" },
  openGraph: {
    title: "Interactive Labs — Pujan Pandey",
    description:
      "Threshold trade-offs, promotion-gate arithmetic and BPE merges, computed in the browser from the same data the projects use.",
    url: "/labs/",
  },
};

export default function LabsPage() {
  return (
    <>
      <PageHero
        eyebrow="Labs"
        title="Three systems, three knobs to turn."
        description="Each lab isolates the decision that actually changes a project's behaviour: where the detection threshold sits, what a promotion gate refuses, and how byte-level merges build a vocabulary. Everything runs in your browser on the published data."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <FlaskConical className="h-3 w-3" />
            {labPages.length} labs
          </Badge>
          <Badge tone="neutral">Client-side computation</Badge>
          <Badge tone="neutral">Limits stated</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <div className="grid gap-3 md:grid-cols-3">
            {labPages.map((lab, index) => (
              <Reveal key={lab.slug} delay={index * 0.04}>
                <Link
                  href={`/labs/${lab.slug}/`}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_10px_30px_-22px_rgba(6,78,59,0.5)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-700">{lab.project}</p>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-quiet transition-colors group-hover:text-forest" />
                  </div>
                  <h2 className="mt-2 text-[15px] font-medium text-ink">{lab.title}</h2>
                  <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-quiet">{lab.summary}</p>
                  <p className="mt-4 border-t border-line-soft pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-quiet/80">
                    {lab.measures}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Prefer reading code to turning knobs?"
        description="Every lab links to the stage in the architecture explorer that implements it, and to the repository file behind that stage."
      />
    </>
  );
}
