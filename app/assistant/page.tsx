import type { Metadata } from "next";
import { Badge, PageHero } from "@/components/ui";
import { AssistantConsole } from "@/components/assistant/assistant-console";
import { Bot, Lock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Ask Pujan AI",
  description:
    "A grounded assistant that answers questions about Pujan Pandey's projects, engineering decisions, metrics, skills and availability — with streaming responses and a deterministic fallback.",
  alternates: { canonical: "/assistant/" },
  openGraph: {
    title: "Ask Pujan AI — Pujan Pandey",
    description:
      "Ask about the NDR platform, the medical MLOps pipeline, the GPT-2 clone, quantum work or hiring.",
    url: "/assistant/",
  },
};

export default function AssistantPage() {
  return (
    <>
      <PageHero
        eyebrow="Assistant"
        title="Ask Pujan AI."
        description="A retrieval-grounded assistant over this portfolio. It knows the published metrics, the architecture decisions and the limitations, and it will tell you when something is not documented rather than inventing an answer."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Zap className="h-3 w-3" />
            Streaming responses
          </Badge>
          <Badge tone="neutral">
            <Lock className="h-3 w-3" />
            Server-side keys
          </Badge>
          <Badge tone="neutral">
            <Bot className="h-3 w-3" />
            Retrieval fallback
          </Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <AssistantConsole />
        </div>
      </section>
    </>
  );
}
