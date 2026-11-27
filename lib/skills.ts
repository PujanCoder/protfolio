export type SkillGroup = {
  id: string;
  title: string;
  caption: string;
  evidence: string;
  items: string[];
  projectSlugs: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    title: "Programming",
    caption: "Primary implementation languages across shipped repositories",
    evidence:
      "Python carries the ML and backend work; TypeScript and React run the detection dashboard; SQL and Bash handle storage and operations.",
    items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash", "HTML / CSS"],
    projectSlugs: ["network-intrusion-detection", "gpt2-clone"],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    caption: "Models trained, evaluated and served in-repo",
    evidence:
      "HistGradientBoosting on 298k deduplicated network flows, Random Forest and Decision Tree models for applied classification, with stratified splits and published metrics.",
    items: [
      "scikit-learn",
      "HistGradientBoosting",
      "Random Forest / Decision Trees",
      "NumPy",
      "pandas",
      "Model evaluation",
      "Feature engineering",
      "Matplotlib / Seaborn",
    ],
    projectSlugs: ["network-intrusion-detection", "credit-card-fraud-mlops"],
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    caption: "Architectures implemented and trained directly",
    evidence:
      "A GPT-2 transformer and byte-level BPE tokenizer written from scratch in PyTorch, plus ResNet18 transfer learning for chest X-ray classification.",
    items: [
      "PyTorch",
      "Torchvision",
      "Transformer architecture",
      "Multi-head attention",
      "Byte-level BPE tokenization",
      "ResNet18 transfer learning",
      "Computer vision",
      "NLP",
    ],
    projectSlugs: ["gpt2-clone", "medical-imaging-mlops"],
  },
  {
    id: "mlops",
    title: "MLOps & Experiment Tracking",
    caption: "Reproducibility, promotion control and observability",
    evidence:
      "DVC stages and MLflow tracking across pipelines, with model quality gates, retraining, failure recovery and Prometheus/Grafana monitoring in the medical-imaging platform.",
    items: [
      "MLflow",
      "MLflow Model Registry",
      "DVC",
      "Experiment tracking",
      "Model quality gates",
      "Automated retraining",
      "Failure recovery automation",
      "Data drift monitoring",
      "Prometheus",
      "Grafana",
    ],
    projectSlugs: ["medical-imaging-mlops", "credit-card-fraud-mlops"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Networking",
    caption: "Detection engineering and network telemetry",
    evidence:
      "Zeek connection logs are tailed incrementally, scored per flow, and enriched with ten behavioural rule detectors before alert triage.",
    items: [
      "Network intrusion detection",
      "Zeek conn.log",
      "CICIDS2017",
      "UNSW-NB15",
      "NSL-KDD",
      "Network flow analysis",
      "Rule-based detection",
      "Alert triage",
    ],
    projectSlugs: ["network-intrusion-detection"],
  },
  {
    id: "backend",
    title: "Backend Development",
    caption: "APIs and services behind the models",
    evidence:
      "FastAPI services with Pydantic contracts and WebSocket fan-out, Flask inference APIs, and SQLite/PostgreSQL persistence.",
    items: [
      "FastAPI",
      "Flask",
      "REST APIs",
      "WebSocket",
      "Pydantic",
      "Uvicorn",
      "SQLite",
      "PostgreSQL",
      "Redis",
    ],
    projectSlugs: ["network-intrusion-detection", "tripmate-multi-agent"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    caption: "Build, ship and reproduce",
    evidence:
      "Docker images for API and dashboard, GitHub Actions running tests, lint, DVC validation, a live API smoke test and a TypeScript build.",
    items: [
      "Docker",
      "Docker Compose",
      "GitHub Actions",
      "CI/CD",
      "AWS S3",
      "Render",
      "Netlify",
      "uv",
      "Conda",
      "tox",
      "ruff",
      "Makefile",
    ],
    projectSlugs: ["network-intrusion-detection", "credit-card-fraud-mlops"],
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    caption: "Qiskit implementations and quantum ML experiments",
    evidence:
      "Public Qiskit notebooks for Shor's algorithm, Grover's search, phase estimation, teleportation, superdense coding, the double-slit experiment and QSVM kernels.",
    items: [
      "Qiskit",
      "Quantum circuits",
      "Shor's algorithm",
      "Grover's search",
      "Quantum phase estimation",
      "Quantum teleportation",
      "Superdense coding",
      "Quantum Support Vector Machines",
    ],
    projectSlugs: [],
  },
  {
    id: "llm",
    title: "LLM Engineering & Agents",
    caption: "Retrieval, orchestration and tool-using systems",
    evidence:
      "LangGraph state machines with MCP tool servers and Postgres checkpoints, plus FAISS-backed retrieval for transcript question answering.",
    items: [
      "LangChain",
      "LangGraph",
      "LangSmith",
      "RAG",
      "FAISS",
      "MCP (Model Context Protocol)",
      "Azure OpenAI",
      "Groq",
      "Tavily",
    ],
    projectSlugs: ["tripmate-multi-agent", "complaineqa-pipeline"],
  },
];

export const skillsFootnote =
  "Every item above appears in a public repository. Notebooks and generated bundles are excluded from the language composition chart on the home page.";
