import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FlaskConical, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge, CTASection, PageHero } from "@/components/ui";
import { NdrLab } from "@/components/labs/ndr-lab";
import { MedicalLab } from "@/components/labs/medical-lab";
import { TokenizerLab } from "@/components/labs/tokenizer-lab";
import { getProject } from "@/lib/projects";

type LabSlug = "network-intrusion-detection" | "medical-imaging-mlops" | "gpt2-clone";

type LabMeta = {
  title: string;
  eyebrow: string;
  description: string;
  labTitle: string;
  labBlurb: string;
  real: string[];
  simulated: string[];
};

const LABS: Record<LabSlug, LabMeta> = {
  "network-intrusion-detection": {
    eyebrow: "Interactive lab · detection",
    title: "Move the alert threshold, watch the analyst queue change.",
    description:
      "The NDR platform scores every Zeek connection. This lab reproduces the arithmetic that turns a score into an alert, so you can see exactly what the published 0.973 F1 buys and what it costs at other operating points.",
    labTitle: "Operating-point explorer",
    labBlurb:
      "Drag the threshold to trade recall against analyst workload, then stream synthetic flows to see individual verdicts.",
    real: [
      "The published held-out metrics: F1 0.973, precision 0.963, recall 0.983, FPR 3.56% over 44,734 flows at a 0.95 threshold.",
      "The 5% false-positive budget the project sets for itself.",
      "The confusion arithmetic — every count is computed from the bins, not typed in.",
    ],
    simulated: [
      "The score distribution is synthetic, shaped so threshold 0.95 reproduces the published point.",
      "Flows in the inspector are sampled from that distribution, not from live Zeek traffic.",
      "No model runs in your browser: the classifier itself lives in the repository.",
    ],
  },
  "medical-imaging-mlops": {
    eyebrow: "Interactive lab · MLOps",
    title: "A model with 0.867 accuracy that the registry refused.",
    description:
      "The medical imaging platform retrained ResNet18 and got 0.867 accuracy, then blocked its own promotion. This lab reproduces the confusion matrix implied by the published numbers and lets you test the quality gate yourself.",
    labTitle: "Triage gate simulator",
    labBlurb:
      "Lower the threshold until tuberculosis recall clears the 0.80 floor, and watch precision pay for it.",
    real: [
      "The recorded run: 0.867 accuracy, 0.830 weighted F1, 0.236 TB recall, 630 images (110 TB, 520 normal).",
      "The 0.80 recall floor that caused the rejection.",
      "The confusion matrix implied by those published metrics: 26 TP, 84 FN, 520 TN, 0 FP.",
    ],
    simulated: [
      "The score bins are synthetic, constrained to reproduce the recorded operating point exactly.",
      "The accuracy and F1 baseline comparisons are relative and not reproducible here, because the baseline values are not published.",
      "No image is classified in your browser.",
    ],
  },
  "gpt2-clone": {
    eyebrow: "Interactive lab · tokenisation",
    title: "Read the model's alphabet, one merge at a time.",
    description:
      "Before a transformer sees a single number, the tokenizer has already made decisions. This lab trains a real byte-level BPE merge table in your browser so you can watch text become tokens and back again.",
    labTitle: "Byte-level BPE tokenizer",
    labBlurb:
      "Type anything: the merge table is trained live, every token is reversible, and the context cost is measured against GPT-2's 1,024-token window.",
    real: [
      "The BPE algorithm: byte-level symbols, most-frequent-pair merges, applied in rank order.",
      "The merge table is trained in your browser on a fixed technical corpus.",
      "Round-trip decoding is verified on every keystroke.",
    ],
    simulated: [
      "The vocabulary is small (a few hundred merges), not GPT-2's 50,257 tokens.",
      "This is not the GPT-2 Clone model doing inference — no weights load here.",
      "The repository's tokenizer uses GPT-2's exact regex, byte-to-unicode map and merges.txt.",
    ],
  },
};

const isLabSlug = (slug: string): slug is LabSlug => slug in LABS;

export function generateStaticParams() {
  return Object.keys(LABS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isLabSlug(slug)) return { title: "Lab not found" };
  const meta = LABS[slug];
  return {
    title: `${meta.labTitle} — Interactive lab`,
    description: meta.description,
    alternates: { canonical: `/labs/${slug}/` },
    openGraph: {
      title: `${meta.labTitle} — Pujan Pandey`,
      description: meta.description,
      url: `/labs/${slug}/`,
    },
  };
}

function LabBody({ slug }: { slug: LabSlug }) {
  if (slug === "network-intrusion-detection") return <NdrLab />;
  if (slug === "medical-imaging-mlops") return <MedicalLab />;
  return <TokenizerLab />;
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLabSlug(slug)) notFound();

  const meta = LABS[slug];
  const project = getProject(slug);

  return (
    <>
      <PageHero eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <FlaskConical className="h-3 w-3" />
            Interactive
          </Badge>
          <Badge tone="neutral">Runs client-side</Badge>
          <Badge tone="amber">
            <TriangleAlert className="h-3 w-3" />
            Educational simulation
          </Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[clamp(1.3rem,2.2vw,1.6rem)] leading-tight">{meta.labTitle}</h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-quiet">{meta.labBlurb}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/projects/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
              >
                Case study
              </Link>
              {project ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
                >
                  Repository
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            <LabBody slug={slug} />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page grid gap-5 py-12 md:grid-cols-2 md:py-14">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-[12.5px] font-medium text-forest">
              <ShieldCheck className="h-3.5 w-3.5" />
              What is real here
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-ink-soft">
              {meta.real.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <p className="flex items-center gap-2 text-[12.5px] font-medium text-amber-900">
              <TriangleAlert className="h-3.5 w-3.5" />
              What is simulated
            </p>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-amber-900/80">
              {meta.simulated.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        title="Want the full system, not the demo?"
        description="The repositories contain the pipelines, tests and evaluation notebooks behind these numbers. I am happy to walk through any of them."
      />

      <div className="container-page py-8">
        <Link href="/projects" className="text-[12.5px] text-quiet transition-colors hover:text-forest">
          ← Back to all projects
        </Link>
      </div>
    </>
  );
}
