export type EducationEntry = {
  id: string;
  level: string;
  title: string;
  institution?: string;
  focus: string[];
  note: string;
};

// TODO(content): add the Class 12 institution, and the years for both entries.
export const education: EducationEntry[] = [
  {
    id: "class-12",
    level: "Class 12",
    title: "Computer Science",
    focus: ["Computer science fundamentals", "Programming"],
    note: "Higher secondary study in computer science — the point where coursework turned into building software outside the syllabus.",
  },
  {
    id: "class-10",
    level: "Class 10",
    title: "Secondary education",
    institution: "Everest English Boarding School",
    focus: ["Secondary education"],
    note: "Completed secondary schooling at Everest English Boarding School in Nepal.",
  },
];

export const selfDirected = [
  {
    title: "Quantum computing",
    body: "Qiskit circuits for Shor's algorithm, Grover's search, phase estimation, teleportation, superdense coding and quantum machine-learning kernels.",
    href: "https://github.com/PujanCoder/Shor-s-Algorithm",
  },
  {
    title: "Production machine learning",
    body: "DVC pipelines, MLflow tracking, quality gates, retraining and rollback, learned by building the NDR and medical-imaging platforms end to end.",
    href: "https://github.com/PujanCoder/Network-Intrusion-Detection-Advanced-MLOps",
  },
  {
    title: "Transformers from first principles",
    body: "A GPT-2 architecture and byte-level BPE tokenizer implemented in PyTorch without the transformers library, module by module with tests.",
    href: "https://github.com/PujanCoder/GPT-2-CLONE",
  },
  {
    title: "Security analytics",
    body: "Network flow features, Zeek telemetry and rule-based detection built alongside a gradient-boosted classifier.",
    href: "https://github.com/PujanCoder/Network-Intrusion-Detection-Advanced-MLOps",
  },
];

export const higherEducationInterests = [
  {
    title: "Cyber security",
    body: "Detection engineering, network telemetry and the security of machine-learning systems themselves.",
  },
  {
    title: "Artificial intelligence",
    body: "Deep learning, evaluation and the engineering discipline required to keep models useful after deployment.",
  },
  {
    title: "Emerging technologies",
    body: "Quantum computing and agentic systems — areas where the tooling is still being defined.",
  },
];
