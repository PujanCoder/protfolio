import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { PlaygroundTabs } from "@/components/playground/playground-tabs";
import { Badge, CTASection, PageHero, SectionHeader } from "@/components/ui";
import { datasetMeta } from "@/lib/playground/dataset";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "An interactive engineering playground: train models in the browser, tokenise text with byte-level BPE, inspect causal attention, and explore a dataset with live preprocessing and evaluation.",
  alternates: { canonical: "/playground/" },
  openGraph: {
    title: "Engineering Playground — Pujan Pandey",
    description:
      "Machine learning, NLP and data science modules that run entirely in your browser on a labelled synthetic dataset.",
    url: "/playground/",
  },
};

export default function PlaygroundPage() {
  return (
    <>
      <PageHero
        eyebrow="Playground"
        title="Change a parameter. Watch the numbers move."
        description="Three modules built on real implementations rather than screenshots: gradient descent, k-nearest neighbours, a decision stump, byte-level BPE, causal attention and a confusion matrix you can perturb. The dataset is synthetic and says so."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <FlaskConical className="h-3 w-3" />
            {datasetMeta.rows} synthetic rows
          </Badge>
          <Badge tone="neutral">Client-side computation</Badge>
          <Badge tone="neutral">Deterministic seed</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <PlaygroundTabs />
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page py-12 md:py-14">
          <SectionHeader
            eyebrow="Beyond the demo"
            title="Where these techniques are used for real."
            description="The playground is a teaching tool. The projects below are the production versions, with real datasets and measured results."
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/labs/network-intrusion-detection/",
                label: "NDR operating point",
                note: "Threshold trade-offs on 44,734 held-out flows",
              },
              {
                href: "/cybersecurity-lab/",
                label: "Cybersecurity lab",
                note: "Detection pipeline and alert triage",
              },
              {
                href: "/labs/gpt2-clone/",
                label: "BPE tokenizer lab",
                note: "The tokenizer behind the GPT-2 clone",
              },
              {
                href: "/architecture/",
                label: "Architecture explorer",
                note: "How the real systems are wired",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-line bg-white p-4 transition-colors hover:border-forest/25"
              >
                <p className="text-[13px] font-medium text-ink group-hover:text-forest">{item.label}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-quiet">{item.note}</p>
                <ArrowRight className="mt-3 h-3.5 w-3.5 text-quiet transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Prefer the code to the widget?"
        description="Every module here mirrors something implemented in Python in a public repository. The links above go straight to the source."
      />
    </>
  );
}
