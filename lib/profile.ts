export const profile = {
  name: "Pujan Pandey",
  tagline: "Building intelligent systems. Exploring what's possible.",
  altTagline:
    "From machine learning to quantum computing — engineering the future.",
  role: "AI/ML Engineer · MLOps Developer · Cybersecurity Enthusiast",
  roles: [
    "AI/ML Engineer",
    "MLOps Developer",
    "Cybersecurity Enthusiast",
    "Quantum Computing Enthusiast",
    "Deep Learning Developer",
  ],
  shortRole: "AI/ML Engineer & MLOps Developer",
  roleLine:
    "AI/ML Engineer · MLOps Developer · Cybersecurity · Quantum Computing",
  location: "Butwal, Nepal",
  timezone: "NPT (UTC+05:45)",
  email: "pujanpandey012@gmail.com",
  github: "https://github.com/PujanCoder",
  githubHandle: "PujanCoder",
  linkedin: "https://linkedin.com/in/pujan-pandey-0583b1321",
  avatar: "https://avatars.githubusercontent.com/u/177131339?v=4",
  positioning:
    "I build machine-learning systems that survive contact with production — not notebooks that stop at a validation score.",
  intro:
    "I work on the engineering side of machine learning: streaming detection pipelines, model registries, quality gates, failure recovery and the observability that tells you whether a model is still telling the truth. Alongside that I implement the fundamentals directly — a GPT-2 transformer and byte-level BPE tokenizer written from scratch in PyTorch — and explore quantum computing with Qiskit.",
  summary:
    "AI/ML engineer based in Butwal, Nepal, working across applied machine learning, MLOps and security engineering, with a parallel interest in quantum computing. I care about measurable behaviour, honest evaluation and systems that fail loudly instead of silently.",
  availability:
    "Open to AI/ML engineering, MLOps and security engineering opportunities, plus open-source collaboration.",
} as const;

export const heroStats = [
  { value: "0.973", label: "F1 on held-out intrusion data", note: "44,734 flows" },
  { value: "85", label: "automated tests passing", note: "NDR platform" },
  { value: "2.23 ms", label: "p50 inference latency", note: "measured, 2,000 flows" },
  { value: "43", label: "public repositories", note: "GitHub" },
] as const;

export const focusAreas = [
  {
    title: "Applied machine learning",
    body: "Classification, transfer learning and evaluation done on real splits with the failure modes written down.",
  },
  {
    title: "MLOps engineering",
    body: "DVC pipelines, MLflow tracking, model quality gates, retraining and rollback paths.",
  },
  {
    title: "Detection engineering",
    body: "Zeek telemetry, flow features, rule detectors and alert triage for network security.",
  },
  {
    title: "Quantum computing",
    body: "Qiskit implementations of core algorithms and quantum machine-learning experiments.",
  },
] as const;
