import type { Metadata } from "next";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { CyberLab } from "@/components/security/cyber-lab";
import { Badge, CTASection, PageHero, SectionHeader } from "@/components/ui";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Cybersecurity Lab",
  description:
    "An interactive network intrusion detection demonstration: simulated Zeek connection telemetry, benign and malicious categories, a DDoS burst, a detection timeline, confidence visualisation and the published model metrics.",
  alternates: { canonical: "/cybersecurity-lab/" },
  openGraph: {
    title: "Cybersecurity Lab — Pujan Pandey",
    description:
      "How the NDR platform scores connections, with a threshold you can move and a timeline you can read.",
    url: "/cybersecurity-lab/",
  },
};

const ndr = projects.find((project) => project.slug === "network-intrusion-detection")!;

export default function CybersecurityLabPage() {
  return (
    <>
      <PageHero
        eyebrow="Cybersecurity lab"
        title="Detection, with the honest labels on."
        description="A simulation of the NDR platform's scoring path: Zeek-style connection records, a gradient-boosted score, rule detectors running alongside it, and a threshold you can move to watch precision and recall trade against each other."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <ShieldCheck className="h-3 w-3" />
            Defensive only
          </Badge>
          <Badge tone="neutral">Simulated telemetry</Badge>
          <Badge tone="amber">Published metrics, not live</Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <CyberLab />
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:py-14">
          <div>
            <SectionHeader
              eyebrow="How this is built"
              title="The demo mirrors the platform, it does not replace it."
              description="Every number in the panels above either comes from the published evaluation or is computed from the simulated window. The platform itself runs against real Zeek logs in the repository."
            />
            <ul className="mt-6 space-y-2.5">
              {ndr.flow.map((stage, index) => (
                <li key={stage.stage} className="flex gap-3 rounded-lg border border-line bg-white px-3.5 py-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 font-mono text-[9.5px] text-emerald-700">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-medium text-ink">{stage.stage}</span>
                    <span className="block text-[11.5px] leading-relaxed text-quiet">{stage.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="mono-label">Published held-out results</p>
              <ul className="mt-3 space-y-1.5 text-[11.5px]">
                {ndr.metrics.map((metric) => (
                  <li key={metric.label} className="flex items-baseline justify-between gap-2 border-b border-line-soft pb-1.5">
                    <span className="text-quiet">{metric.label}</span>
                    <span className="font-mono text-forest">
                      {metric.value}
                      {metric.note ? <span className="ml-1 text-[9.5px] text-quiet">{metric.note}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-line bg-white p-4">
              <p className="mono-label">Where it fails</p>
              <ul className="mt-2.5 space-y-2">
                {ndr.limitations.map((item) => (
                  <li key={item} className="flex gap-2 text-[11.5px] leading-relaxed text-quiet">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={ndr.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[11.5px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
            >
              Read the platform source
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      <CTASection
        title="Security work is judged on false positives."
        description="If you are building detection systems and care about analyst time, that is the conversation I want to have."
      />
    </>
  );
}
