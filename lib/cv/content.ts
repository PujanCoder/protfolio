import { achievements } from "@/lib/achievements";
import { education } from "@/lib/education";
import { profile } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

export const cvVariants = ["ai-ml", "mlops", "security", "general"] as const;
export type CvVariant = (typeof cvVariants)[number];

export function isCvVariant(value: string): value is CvVariant {
  return (cvVariants as readonly string[]).includes(value);
}

type VariantSpec = {
  label: string;
  headline: string;
  summary: string;
  skillOrder: string[];
  projectOrder: string[];
  highlightsPerProject: number;
};

export const variantSpecs: Record<CvVariant, VariantSpec> = {
  "ai-ml": {
    label: "AI/ML Engineer",
    headline: "AI/ML Engineer — machine learning systems, evaluation and deep learning",
    summary:
      "AI/ML engineer who builds models that hold up outside a notebook: stratified multi-dataset training, held-out evaluation reported with its failure modes, and inference that runs behind a real API. Implements transformer internals directly in PyTorch (GPT-2 architecture, byte-level BPE) rather than only calling a library.",
    skillOrder: ["ai-ml", "deep-learning", "programming", "llm", "mlops", "backend", "quantum"],
    projectOrder: [
      "network-intrusion-detection",
      "gpt2-clone",
      "medical-imaging-mlops",
      "credit-card-fraud-mlops",
    ],
    highlightsPerProject: 3,
  },
  mlops: {
    label: "MLOps Engineer",
    headline: "MLOps Engineer — reproducible pipelines, registries, quality gates and monitoring",
    summary:
      "MLOps engineer focused on the parts of machine learning that decide whether a model can ship: DVC pipelines, MLflow tracking, a registry that refuses regressions, retraining with rollback, drift monitoring, and CI that builds and tests both images. The medical-imaging platform's quality gate rejected its own retrain on recall, which is the behaviour the gate exists for.",
    skillOrder: ["mlops", "devops", "backend", "programming", "ai-ml", "cybersecurity"],
    projectOrder: [
      "medical-imaging-mlops",
      "network-intrusion-detection",
      "credit-card-fraud-mlops",
      "complaineqa-pipeline",
    ],
    highlightsPerProject: 3,
  },
  security: {
    label: "Cybersecurity-focused Developer",
    headline: "Security-focused developer — detection engineering and network telemetry",
    summary:
      "Security-minded engineer who builds detection systems rather than slides about them: Zeek connection telemetry ingested incrementally, a 23-feature contract shared by training and serving, behavioural rule detectors alongside a gradient-boosted classifier, and a dashboard that labels replay data and reports measured latency instead of inventing activity.",
    skillOrder: ["cybersecurity", "programming", "backend", "mlops", "devops", "ai-ml"],
    projectOrder: [
      "network-intrusion-detection",
      "credit-card-fraud-mlops",
      "medical-imaging-mlops",
      "gpt2-clone",
    ],
    highlightsPerProject: 3,
  },
  general: {
    label: "Software Developer",
    headline: "Software developer — machine learning, backend services and interfaces",
    summary:
      "Developer working across machine learning, backend services and frontend interfaces. Ships complete systems: a FastAPI and React detection platform, a self-healing MLOps pipeline, a GPT-2 implementation written module by module, and LLM agent applications with tests and CI around them.",
    skillOrder: ["programming", "backend", "ai-ml", "mlops", "devops", "cybersecurity", "llm"],
    projectOrder: [
      "network-intrusion-detection",
      "medical-imaging-mlops",
      "gpt2-clone",
      "tripmate-multi-agent",
    ],
    highlightsPerProject: 2,
  },
};

export type CvBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "entry"; title: string; meta: string; bullets: string[] }
  | { kind: "bullets"; bullets: string[] }
  | { kind: "lines"; lines: string[] };

export type CvSection = { title: string; blocks: CvBlock[] };

export type CvDocument = {
  variant: CvVariant;
  label: string;
  name: string;
  headline: string;
  contact: string[];
  sections: CvSection[];
  footer: string;
};

const bySlug = new Map(projects.map((project) => [project.slug, project]));

function projectBlocks(spec: VariantSpec): CvBlock[] {
  return spec.projectOrder.flatMap((slug) => {
    const project = bySlug.get(slug);
    if (!project) return [];
    return [
      {
        kind: "entry" as const,
        title: project.title,
        meta: `${project.tags.slice(0, 5).join(" · ")} — ${project.repo.replace("https://", "")}`,
        bullets: [
          project.summary,
          ...project.metrics
            .slice(0, 3)
            .map((metric) => `${metric.label}: ${metric.value}${metric.note ? ` (${metric.note})` : ""}`),
          ...project.highlights.slice(0, spec.highlightsPerProject),
        ],
      },
    ];
  });
}

function skillBlocks(spec: VariantSpec): CvBlock[] {
  const groups = spec.skillOrder
    .map((id) => skillGroups.find((group) => group.id === id))
    .filter((group): group is NonNullable<typeof group> => Boolean(group));
  return [
    {
      kind: "lines",
      lines: groups.map((group) => `${group.title}: ${group.items.join(", ")}`),
    },
  ];
}

function achievementBlocks(): CvBlock[] {
  return [
    {
      kind: "bullets",
      bullets: achievements
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((item) =>
          [item.title, item.org, item.period].filter(Boolean).join(" — "),
        ),
    },
  ];
}

function educationBlocks(): CvBlock[] {
  return education.map((entry) => ({
    kind: "entry" as const,
    title: `${entry.level} — ${entry.title}`,
    meta: entry.institution ?? "",
    bullets: entry.focus.length > 0 ? [entry.focus.join(", ")] : [],
  }));
}

export function buildCv(variant: CvVariant): CvDocument {
  const spec = variantSpecs[variant];

  return {
    variant,
    label: spec.label,
    name: profile.name,
    headline: spec.headline,
    contact: [
      profile.location,
      profile.email,
      `github.com/${profile.githubHandle}`,
      "linkedin.com/in/pujan-pandey-0583b1321",
    ],
    sections: [
      { title: "Profile", blocks: [{ kind: "paragraph", text: spec.summary }] },
      { title: "Selected projects", blocks: projectBlocks(spec) },
      { title: "Technical skills", blocks: skillBlocks(spec) },
      { title: "Recognition and leadership", blocks: achievementBlocks() },
      { title: "Education", blocks: educationBlocks() },
      {
        title: "Elsewhere",
        blocks: [
          {
            kind: "lines",
            lines: [
              `GitHub: ${profile.github}`,
              `LinkedIn: ${profile.linkedin}`,
              `Portfolio: pujanpandey.vercel.app`,
              `Email: ${profile.email}`,
            ],
          },
        ],
      },
    ],
    footer:
      "Every claim in this CV traces to a public repository at github.com/PujanCoder.",
  };
}
