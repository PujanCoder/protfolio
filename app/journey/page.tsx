import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { JourneyTimeline } from "@/components/journey/journey-timeline";
import { Badge, CTASection, PageHero, SectionHeader } from "@/components/ui";
import { journeyEntries } from "@/lib/journey";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "An interactive timeline of verified milestones: education, IT Club secretary, community leadership, hackathons including a national third place, Qiskit work, the IBM Quantum Qiskit Advocate community, and production ML systems.",
  alternates: { canonical: "/journey/" },
  openGraph: {
    title: "Journey — Pujan Pandey",
    description: "Verified milestones, in order, with the evidence attached.",
    url: "/journey/",
  },
};

export default function JourneyPage() {
  return (
    <>
      <PageHero
        eyebrow="Journey"
        title="Twelve milestones, no invented dates."
        description="Everything below is either a public repository, a role I held, or a result I was part of. Where a date is not verifiable the entry says so instead of guessing."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Route className="h-3 w-3" />
            {journeyEntries.length} entries
          </Badge>
          <Badge tone="neutral">Filter by category</Badge>
          <Badge tone="neutral">Expand for evidence</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <JourneyTimeline />
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page py-12 md:py-14">
          <SectionHeader
            eyebrow="Read more"
            title="The timeline is the index, not the argument."
            description="Each milestone links to something you can open: a repository, a lab, or a page that explains the engineering."
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/achievements/", label: "Achievements", note: "Qiskit Advocate, hackathons, leadership" },
              { href: "/projects/", label: "Case studies", note: "Six systems with measured results" },
              { href: "/quantum-lab/", label: "Quantum lab", note: "Circuits you can run in the browser" },
              { href: "/recruiter/", label: "Recruiter view", note: "Summary and downloadable CVs" },
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
        title="The next milestone is a team."
        description="I am looking for AI/ML, MLOps or security engineering work where the system has to survive production."
      />
    </>
  );
}
