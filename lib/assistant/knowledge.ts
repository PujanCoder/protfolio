/**
 * Controlled knowledge base for "Ask Pujan".
 *
 * Everything here is derived from public repositories, the site's own case
 * studies, or Pujan's own account of his record. The assistant is instructed
 * (and the retrieval fallback is structurally limited) to answer from this
 * text only — it must not invent employers, metrics, dates or capabilities.
 */

export type KnowledgeEntry = {
  id: string;
  title: string;
  topics: string[];
  answer: string;
  links?: { label: string; href: string }[];
};

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: "who",
    title: "Who Pujan is",
    topics: ["who", "background", "about", "introduction", "summary", "profile"],
    answer:
      "Pujan Pandey is an AI/ML engineer based in Butwal, Nepal, working on the engineering side of machine learning: streaming detection pipelines, model registries, quality gates, observability, and the evaluation discipline that keeps a model honest after deployment. Alongside production ML he implements the fundamentals directly — a GPT-2 transformer and byte-level tokenizer written in PyTorch without the transformers library — and explores quantum computing with Qiskit as an IBM Quantum Qiskit Advocate.",
    links: [{ label: "About page", href: "/about" }],
  },
  {
    id: "positioning",
    title: "Roles and focus",
    topics: ["role", "positioning", "title", "focus", "interests", "specialisation"],
    answer:
      "His positioning is AI/ML Engineer · MLOps Developer · Cybersecurity Enthusiast · Quantum Computing Enthusiast. In practice that means applied machine learning with deployment and monitoring attached, detection engineering for network security, and quantum computing as a research interest he keeps public through Qiskit notebooks.",
  },
  {
    id: "ndr",
    title: "Network Intrusion Detection — Advanced MLOps",
    topics: ["ndr", "network", "intrusion", "detection", "zeek", "security", "soc", "mlops"],
    answer:
      "The Network Intrusion Detection platform is a real-time NDR system: Zeek connection logs are tailed incrementally into SQLite, a 23-feature extractor shared by training and inference scores each flow with HistGradientBoosting at a 0.95 threshold, ten behavioural rule detectors run alongside the model, and a FastAPI backend streams results to a React security dashboard over WebSocket. On 44,734 held-out flows it reports F1 0.973, precision 0.963, recall 0.983 and a 3.56% false-positive rate against a 5% budget, with p50 latency of 2.23 ms and 432 flows/s throughput. It is explicit about the limit: a zero-day probe trained without NSL-KDD scores 0.00 recall, so the model card states that it does not transfer across datasets.",
    links: [
      { label: "Case study", href: "/projects/network-intrusion-detection" },
      { label: "Interactive lab", href: "/labs/network-intrusion-detection" },
    ],
  },
  {
    id: "medical",
    title: "Medical Imaging MLOps",
    topics: ["medical", "imaging", "x-ray", "tuberculosis", "healthcare", "quality", "gate"],
    answer:
      "Medical Imaging MLOps is a self-healing training platform for tuberculosis chest X-rays. ResNet18 transfer learning sits inside a six-stage pipeline with MLflow tracking, a model registry, Prometheus/Grafana monitoring, a failure autopilot that classifies nine failure modes and routes them to recovery policies, and a quality gate that can refuse a promotion. That gate is not theoretical: the recorded retrain reached 0.867 accuracy and 0.830 weighted F1 but only 0.236 recall on tuberculosis against a 0.80 floor, so it was rejected. The evaluation set is 630 images (520 normal, 110 tuberculosis), which the project states as a limitation.",
    links: [
      { label: "Case study", href: "/projects/medical-imaging-mlops" },
      { label: "Interactive lab", href: "/labs/medical-imaging-mlops" },
    ],
  },
  {
    id: "gpt2",
    title: "GPT-2 Clone",
    topics: ["gpt", "gpt2", "transformer", "attention", "tokenizer", "bpe", "deep", "learning"],
    answer:
      "The GPT-2 Clone is a from-scratch PyTorch implementation of the GPT-2 architecture — multi-head causal self-attention with an explicit causal mask, pre-normalised transformer blocks, GELU MLPs at four times the embedding width, learned positional embeddings and tied input/output embeddings — plus a working byte-level BPE tokenizer that reproduces GPT-2's real vocabulary and merge table. Weight tying removes 38.6M redundant parameters at the 50,257 × 768 configuration. Every module is tested, including attention shapes and the encode/decode round trip.",
    links: [
      { label: "Case study", href: "/projects/gpt2-clone" },
      { label: "Tokenizer lab", href: "/labs/gpt2-clone" },
    ],
  },
  {
    id: "quantum",
    title: "Quantum computing and Qiskit",
    topics: ["quantum", "qiskit", "ibm", "qubit", "advocate", "bloch", "circuit"],
    answer:
      "Pujan is part of the IBM Quantum Qiskit Advocate community, recognised for sustained Qiskit work. The public evidence is a set of runnable notebooks: Shor's algorithm, Grover's search, quantum phase estimation, teleportation, superdense coding, the double-slit experiment with and without an observer, quantum chemistry simulation, and quantum machine learning experiments using QSVM kernels for breast-cancer classification and card-fraud detection. The site's quantum lab is an exact 1–3 qubit statevector simulator running in the browser — it is educational and does not execute on IBM hardware.",
    links: [{ label: "Quantum lab", href: "/quantum-lab" }],
  },
  {
    id: "achievements",
    title: "Achievements",
    topics: ["achievement", "award", "hackathon", "recognition", "competition", "nepathon", "club"],
    answer:
      "Verified recognition: IBM Quantum Qiskit Advocate (community recognition, evidenced by public Qiskit repositories); a third-place finish as part of a team in a national-level hackathon, building and pitching a working prototype inside the event window; participation in Nepathon; and technical leadership as IT Club Secretary, with earlier leadership as Child Club Tole President. The achievements page marks any entry that still needs an external certificate or event link rather than overstating it.",
    links: [{ label: "Achievements", href: "/achievements" }],
  },
  {
    id: "skills",
    title: "Technical skills",
    topics: ["skills", "stack", "technology", "languages", "tools", "frameworks", "libraries"],
    answer:
      "Programming: Python, TypeScript, JavaScript, SQL, Bash, HTML/CSS. Machine learning: PyTorch, scikit-learn, NumPy, pandas, transformer architecture, CNNs and transfer learning. MLOps: MLflow, DVC, model registries, quality gates, Prometheus, Grafana, Evidently. Backend: FastAPI, REST, WebSocket, SQLite. Cybersecurity: Zeek, network flow analysis, rule-based detection. Frontend and tooling: React, Next.js, Tailwind CSS, Docker, GitHub Actions, Git, Linux. Every entry on the skills page links to the repository or case study where it is actually used.",
    links: [{ label: "Skills", href: "/skills" }],
  },
  {
    id: "engineering",
    title: "How he works",
    topics: ["approach", "philosophy", "process", "engineering", "quality", "testing", "values"],
    answer:
      "The through-line is evaluation honesty. Pipelines get tests, thresholds get justified against a stated budget, cross-dataset results get published even when they are bad (the NDR model card reports 0.00 recall on a zero-day probe), and known limitations sit next to the metrics rather than in a footnote. He prefers a working system with a documented failure mode over a notebook with a good number.",
  },
  {
    id: "collaboration",
    title: "Working together",
    topics: ["hire", "collaborate", "collaboration", "opportunity", "internship", "available", "freelance"],
    answer:
      "Pujan is open to AI/ML and MLOps roles, internships and collaborations, particularly where evaluation, data quality and failure modes are part of the brief. The fastest route is email — pujanpandey012@gmail.com — with a sentence about the problem rather than a long pitch. He usually replies within two working days.",
    links: [{ label: "Contact", href: "/contact" }],
  },
  {
    id: "contact",
    title: "Contact details",
    topics: ["contact", "email", "reach", "linkedin", "github", "location"],
    answer:
      "Email: pujanpandey012@gmail.com. GitHub: github.com/PujanCoder. LinkedIn: linkedin.com/in/pujan-pandey-0583b1321. Based in Butwal, Nepal (NPT, UTC+05:45).",
    links: [{ label: "Contact page", href: "/contact" }],
  },
  {
    id: "education",
    title: "Education",
    topics: ["education", "study", "school", "college", "degree", "learning"],
    answer:
      "Formal study is in computer science in Nepal: secondary education at Everest English Boarding School, then higher secondary study in computer science. Most of the engineering practice is self-directed and public — quantum computing with Qiskit, production machine learning, transformers from first principles, and security analytics — each track backed by a repository. He is currently exploring higher-education pathways in cyber security, artificial intelligence and emerging technologies.",
    links: [{ label: "Education", href: "/education" }],
  },
  {
    id: "other-projects",
    title: "Other projects",
    topics: ["projects", "portfolio", "other", "tripmate", "complaineqa", "fraud", "agents"],
    answer:
      "Beyond the three flagship systems there is a credit-card fraud detection MLOps pipeline, TripMate (a multi-agent travel planner), ComplainEQA (a retrieval-based complaint analysis pipeline), and a set of smaller repositories covering data analysis, Python tooling and Qiskit experiments. The project archive lists each one with an honest note about its current state, including the ones that need local data paths adjusted before they run.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "site",
    title: "About this site",
    topics: ["site", "website", "built", "nextjs", "how"],
    answer:
      "This portfolio is a Next.js 15 App Router site in TypeScript with Tailwind CSS v4, Framer Motion, React Three Fiber for the Bloch sphere, Recharts for the activity analytics, and a small exact quantum simulator written for the lab. GitHub data is fetched server-side with caching and falls back to a committed snapshot when the API is rate limited.",
  },
];

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "was", "were", "what",
  "who", "how", "does", "do", "did", "can", "you", "your", "his", "he", "she", "it", "that", "this",
  "with", "about", "tell", "me", "please", "give", "show", "would", "could", "should", "i", "my",
  "we", "they", "be", "been", "has", "have", "had", "at", "by", "from", "as", "any", "more", "most",
  "work", "works", "working", "there", "their", "them", "if", "so", "than", "then", "into", "over",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word));
}

const looseMatch = (term: string, candidate: string) =>
  candidate === term ||
  candidate.startsWith(term) ||
  term.startsWith(candidate) ||
  (term.length > 3 && candidate.includes(term)) ||
  (candidate.length > 3 && term.includes(candidate));

export function retrieve(query: string, limit = 2): KnowledgeEntry[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored = KNOWLEDGE_BASE.map((entry) => {
    const haystack = [entry.title, ...entry.topics, entry.answer].join(" ").toLowerCase();
    const topicWords = [entry.title, ...entry.topics].join(" ").toLowerCase().split(/\s+/);
    let score = 0;

    for (const term of terms) {
      if (topicWords.some((word) => looseMatch(term, word))) score += 3;
      if (haystack.includes(term)) score += 1;
    }

    return { entry, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.entry);
}

export function buildContext(entries: KnowledgeEntry[]): string {
  return entries.map((entry) => `### ${entry.title}\n${entry.answer}`).join("\n\n");
}

export const SYSTEM_PROMPT = `You are "Ask Pujan", an assistant embedded in Pujan Pandey's engineering portfolio.

Rules:
- Answer only from the CONTEXT block. If the context does not contain the answer, say so plainly and point to the relevant page or repository.
- Never invent employers, dates, metrics, clients, certifications or capabilities.
- Be concise and concrete: two to five sentences, or a short list when comparing things.
- Write in third person about Pujan ("he built", "the project reports"), never roleplay as him.
- If asked about hiring or collaboration, mention email pujanpandey012@gmail.com.
- Refer to interactive labs as educational simulations when relevant; never claim a live model is running.`;
