import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { PostIndex } from "@/components/writing/post-index";
import { Badge, CTASection, PageHero } from "@/components/ui";
import { blogPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical writing on implementing GPT-2 from scratch, feature contracts between training and serving, reading confusion matrices, and byte-level BPE tokenisation.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Writing — Pujan Pandey",
    description:
      "Practical notes on deep learning implementation, MLOps testing and evaluation.",
    url: "/blog/",
  },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="Explanations, not announcements."
        description="Four pieces written to be useful to someone doing the work: how the tensor shapes constrain a transformer, why feature code drifts, how to read a confusion matrix as a cost statement, and what tokenisation decides before the model sees anything."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <PenLine className="h-3 w-3" />
            {blogPosts.length} articles
          </Badge>
          <Badge tone="neutral">Code-linked</Badge>
          <Badge tone="neutral">No tutorials-for-traffic</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <PostIndex posts={blogPosts} kind="blog" />
        </div>
      </section>

      <CTASection
        title="Want a topic covered?"
        description="If you are working through something adjacent to these systems, ask. The assistant on this site can also point you at the relevant code."
      />
    </>
  );
}
