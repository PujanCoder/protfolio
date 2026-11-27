import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { PostIndex } from "@/components/writing/post-index";
import { Badge, CTASection, PageHero } from "@/components/ui";
import { researchPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Research Notes",
  description:
    "Engineering research notes on cross-dataset model failure, quality gates that reject their own retrains, measured inference latency, and what exact quantum simulation hides.",
  alternates: { canonical: "/research/" },
  openGraph: {
    title: "Research Notes — Pujan Pandey",
    description:
      "Measured results and their conditions: distribution shift, promotion gates, latency benchmarks and quantum simulation limits.",
    url: "/research/",
  },
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Notes from inside the failures."
        description="Four investigations, each tied to a repository you can open. The pattern is the same every time: measure the thing, then publish the condition that makes the measurement meaningful."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <FlaskConical className="h-3 w-3" />
            {researchPosts.length} notes
          </Badge>
          <Badge tone="neutral">Reproducible claims</Badge>
          <Badge tone="neutral">Limitations included</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <PostIndex posts={researchPosts} kind="research" />
        </div>
      </section>

      <CTASection
        title="Want to challenge a result?"
        description="Every note links to the code and the recorded metrics. If a number looks wrong, I would rather find out than leave it standing."
      />
    </>
  );
}
