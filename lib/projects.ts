export type ProjectCategory =
  | "Security"
  | "MLOps"
  | "Deep Learning"
  | "LLM & Agents"
  | "ML Applications"
  | "Quantum";

export type Metric = { label: string; value: string; note?: string };

export type FlowStage = { stage: string; detail: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  subtitle: string;
  year: string;
  category: ProjectCategory;
  tags: string[];
  repo: string;
  summary: string;
  problem: string;
  approach: { title: string; body: string }[];
  flow: FlowStage[];
  stack: string[];
  metrics: Metric[];
  highlights: string[];
  limitations: string[];
  motif: "signal" | "scan" | "tokens" | "graph" | "film" | "ledger";
  accent: "iris" | "mint" | "amber" | "rose";
  featured: boolean;
  detail: boolean;
};

const repo = (name: string) => `https://github.com/PujanCoder/${name}`;

export const projects: Project[] = [
  {
    slug: "network-intrusion-detection",
    title: "Network Intrusion Detection — Advanced MLOps",
    kicker: "Real-time NDR platform",
    subtitle:
      "Zeek-driven network detection with a multi-dataset flow classifier, ten rule detectors, a FastAPI backend and a live security dashboard.",
    year: "2026",
    category: "Security",
    tags: ["Zeek", "FastAPI", "WebSocket", "scikit-learn", "React 19", "Docker"],
    repo: repo("Network-Intrusion-Detection-Advanced-MLOps"),
    summary:
      "A working network detection and response platform built on top of a CICIDS2017 ML pipeline. It tails Zeek connection logs, scores every flow with a gradient-boosted classifier, enriches alerts with behavioural rules, and streams the result to a seven-view security dashboard over WebSocket.",
    problem:
      "A batch notebook that scores a CSV is not a detection system. Real traffic arrives continuously, logs rotate mid-line, processes restart, and analysts need to know how fresh a number is. The harder problem is honesty: a model that scores 0.98 in-distribution can collapse on traffic it has never seen, and a dashboard that hides that is worse than no dashboard.",
    approach: [
      {
        title: "Incremental ingestion that survives reality",
        body:
          "One daemon thread polls the Zeek log directory every 0.5 s, reads only new bytes, and persists byte offsets in SQLite so a restart resumes exactly where it stopped. Rotation, truncation and partial trailing lines are handled explicitly and covered by tests.",
      },
      {
        title: "One feature contract, two consumers",
        body:
          "A single 23-feature extractor is imported by both training and inference, so the feature schema cannot drift between the notebook and the API. A contract test fails the build if the saved artefacts and the extractor disagree.",
      },
      {
        title: "Multi-dataset training with a deliberate threshold",
        body:
          "HistGradientBoosting is trained on 298k deduplicated flows from CICIDS2017, UNSW-NB15 and NSL-KDD. The operating threshold is set to 0.95 to hold a 5% false-positive budget instead of maximising accuracy.",
      },
      {
        title: "Rules alongside the model",
        body:
          "Ten behavioural detectors run independently of the classifier and attach severity, category and evidence. Alerts are de-duplicated per event and rule, so a model miss can still surface as a rule hit — and the two signals stay distinguishable.",
      },
      {
        title: "A dashboard that refuses to lie",
        body:
          "Every figure is read from SQLite, not synthesised. Inference latency and event-to-database delay are measured, replay data is tagged and shown behind a banner, and an idle sensor reports “No new network events received.” instead of inventing activity.",
      },
    ],
    flow: [
      { stage: "Capture", detail: "Zeek conn.log (TSV or JSON) from a live interface or replay" },
      { stage: "Ingest", detail: "reader.py — offset-persisted tailing, rotation and truncation handling" },
      { stage: "Features", detail: "23-feature extractor shared by training and inference" },
      { stage: "Detect", detail: "HistGradientBoosting @ 0.95 threshold + 10 rule detectors" },
      { stage: "Persist", detail: "SQLite — events, predictions, alerts, ingestion state, dead letters" },
      { stage: "Serve", detail: "FastAPI REST + WebSocket fan-out, authenticated sensor ingestion" },
      { stage: "Observe", detail: "React 19 dashboard — live stream, analytics, model and sensor health" },
    ],
    stack: [
      "Python 3.13",
      "FastAPI",
      "WebSocket",
      "scikit-learn",
      "pandas",
      "NumPy",
      "SQLite",
      "Zeek",
      "Evidently",
      "MLflow",
      "DVC",
      "DagsHub",
      "React 19",
      "TypeScript",
      "Vite",
      "Recharts",
      "Docker",
      "GitHub Actions",
      "Render",
    ],
    metrics: [
      { label: "Held-out F1", value: "0.973", note: "44,734 flows" },
      { label: "Precision", value: "0.963", note: "held-out test" },
      { label: "Recall", value: "0.983", note: "held-out test" },
      { label: "False-positive rate", value: "3.56%", note: "5% budget" },
      { label: "p50 latency", value: "2.23 ms", note: "2,000 flows" },
      { label: "p95 latency", value: "2.92 ms", note: "2,000 flows" },
      { label: "Throughput", value: "432/s", note: "measured" },
      { label: "Tests", value: "85", note: "passing" },
    ],
    highlights: [
      "434k raw records across three public datasets, deduplicated to 298k and split 208,755 / 44,733 / 44,734 with stratification by dataset and label.",
      "Cross-dataset results are reported, not hidden: UNSW-NB15 official test reaches 0.939 F1, NSL-KDD reaches 0.492 recall, and a zero-day probe trained without NSL-KDD scores 0.00 recall. The model card states that it does not transfer.",
      "CI runs 85 tests, ruff, DVC validation, an API smoke test against a live server, a TypeScript type-check and production frontend build, plus both Docker images.",
      "Remote sensor ingestion is authenticated with NDR_API_KEY and fails closed with a 503 when the key is not configured.",
      "The original batch pipeline (DVC stages, MLflow tracking, DagsHub remote) is preserved and reported separately from the live model.",
    ],
    limitations: [
      "Metadata-only detection: flow features, no payload inspection.",
      "Cross-dataset transfer is weak; the model is a decision-support tool, not an unattended production sensor.",
      "SQLite storage is single-node, and authentication is opt-in rather than enforced by default.",
      "Detector thresholds are heuristic and need per-site tuning.",
    ],
    motif: "signal",
    accent: "mint",
    featured: true,
    detail: true,
  },
  {
    slug: "medical-imaging-mlops",
    title: "Medical Imaging MLOps",
    kicker: "Self-healing training pipeline",
    subtitle:
      "A tuberculosis chest X-ray platform that automates validation, training, registry promotion, monitoring, failure recovery and retraining.",
    year: "2026",
    category: "MLOps",
    tags: ["PyTorch", "MLflow", "FastAPI", "Prometheus", "Grafana", "Docker"],
    repo: repo("Medical-imaging-MLOps"),
    summary:
      "An end-to-end MLOps system for chest X-ray classification. ResNet18 transfer learning is only the beginning: the pipeline tracks every run in MLflow, serves the model behind FastAPI, watches it with Prometheus, recovers from classified failures automatically, and refuses to promote a retrained model that is worse than the baseline.",
    problem:
      "Most MLOps demonstrations stop at train → evaluate → deploy. The expensive failures happen afterwards: a broken data path, a training job that dies at epoch nine, a retrain that quietly degrades recall on the class that matters. A pipeline needs to detect those conditions, act on them, and keep a human in control of promotion.",
    approach: [
      {
        title: "Reproducible training, not notebook state",
        body:
          "A six-stage pipeline handles ingestion, preprocessing, training, evaluation, registry and monitoring. Images are resized to 224 px with a deterministic 70/15/15 split at seed 42, and every run is tracked in MLflow with a registered model version.",
      },
      {
        title: "Failure autopilot",
        body:
          "A detector classifies failures into data, preprocessing, training, runtime, resource, evaluation, artifact, connection and configuration categories. An analyser selects a recovery policy, the engine executes it, and a validator decides whether the stage actually recovered or should escalate.",
      },
      {
        title: "A quality gate with real authority",
        body:
          "Candidates are compared against the current baseline on accuracy, F1 and tuberculosis recall, with absolute floors and maximum allowed degradation. Passing training is not enough: a candidate that loses recall on the positive class is rejected.",
      },
      {
        title: "Observability as part of the model",
        body:
          "FastAPI exposes health and metrics endpoints, Prometheus scrapes them, and Grafana visualises model and API behaviour. Data drift and performance monitoring sit alongside the service rather than in a separate notebook.",
      },
    ],
    flow: [
      { stage: "Validate", detail: "Dataset integrity, class balance and split reproducibility" },
      { stage: "Preprocess", detail: "224 px tensors, batch 16, 70/15/15 split, seed 42" },
      { stage: "Train", detail: "ResNet18 transfer learning, tracked in MLflow" },
      { stage: "Evaluate", detail: "Accuracy, F1, per-class recall, confusion matrix" },
      { stage: "Register", detail: "MLflow Model Registry versioning" },
      { stage: "Serve", detail: "FastAPI inference with health and metrics endpoints" },
      { stage: "Observe", detail: "Prometheus metrics, Grafana dashboards, drift checks" },
      { stage: "Recover", detail: "Failure detector → analyser → policy → engine → validator" },
      { stage: "Gate", detail: "Candidate vs baseline: promote or reject" },
    ],
    stack: [
      "PyTorch",
      "Torchvision",
      "scikit-learn",
      "MLflow",
      "FastAPI",
      "Prometheus",
      "Grafana",
      "Docker",
      "DVC",
      "GitHub Actions",
      "pytest",
      "Conda",
    ],
    metrics: [
      { label: "Retrain accuracy", value: "0.867", note: "630 test images" },
      { label: "Weighted F1", value: "0.830", note: "recorded retrain" },
      { label: "TB recall", value: "0.236", note: "below 0.80 gate" },
      { label: "Gate decision", value: "Rejected", note: "candidate not promoted" },
    ],
    highlights: [
      "The recorded retraining run produced 0.867 accuracy and 0.830 weighted F1, but only 0.236 recall on tuberculosis against a 0.80 floor — exactly the case the quality gate exists to catch. The candidate was not promoted.",
      "Nine distinct failure classes are detected and routed to recovery policies, with a validator that verifies recovery instead of assuming it.",
      "Unit and integration tests cover the failure detector, analyser, recovery policies, recovery engine, autopilot flow, quality gate and API endpoints.",
      "The evaluation set contains 630 images (520 normal, 110 tuberculosis), which is small enough that positive-class recall is noisy — a limitation the project states rather than hides.",
    ],
    limitations: [
      "Quality thresholds are engineering demo thresholds, not clinical validation or medical-device approval.",
      "Only 110 tuberculosis-positive test images, so recall estimates have wide confidence intervals.",
      "The dataset is committed to the repository, which makes clones heavy.",
    ],
    motif: "scan",
    accent: "iris",
    featured: true,
    detail: true,
  },
  {
    slug: "gpt2-clone",
    title: "GPT-2 Clone",
    kicker: "Transformer from first principles",
    subtitle:
      "A GPT-2 architecture and byte-level BPE tokenizer implemented in PyTorch without transformers, tested module by module.",
    year: "2026",
    category: "Deep Learning",
    tags: ["PyTorch", "Transformers", "BPE", "pytest"],
    repo: repo("GPT-2-CLONE"),
    summary:
      "A from-scratch implementation of the GPT-2 architecture: multi-head causal self-attention, pre-normalised transformer blocks, GELU MLPs, tied embeddings, and a working byte-level byte-pair-encoding tokenizer that round-trips text through GPT-2's real vocabulary and merge table.",
    problem:
      "Calling a model API teaches you the interface, not the machine. Attention masks, weight tying, byte-level tokenisation and residual stream normalisation are the parts that matter when something breaks in a real model — and they are invisible behind a library call.",
    approach: [
      {
        title: "Attention written out",
        body:
          "A fused query-key-value projection, explicit head splitting, scaled dot-product scores, a non-persistent causal mask buffer and an output projection — implemented directly rather than imported.",
      },
      {
        title: "The full block, correctly ordered",
        body:
          "Pre-layer-norm residual blocks, GELU MLPs at four times the embedding width, learned positional embeddings and a final normalisation before the language-model head.",
      },
      {
        title: "Weight tying",
        body:
          "The output head shares weights with the token embedding matrix, removing 38.6M redundant parameters at the 50,257 × 768 configuration.",
      },
      {
        title: "A real tokenizer",
        body:
          "GPT-2's exact pre-tokenisation regex, a reversible byte-to-unicode mapping, ordered merge ranks, a merge cache, and encode/decode paths that reproduce the original text — validated against the real vocab.json and merges.txt.",
      },
    ],
    flow: [
      { stage: "Text", detail: "Raw input string" },
      { stage: "Pre-tokenise", detail: "GPT-2 regex pattern, contractions and whitespace aware" },
      { stage: "Byte encode", detail: "UTF-8 bytes mapped to reversible unicode symbols" },
      { stage: "BPE", detail: "Ordered merges applied by lowest rank, cached per token" },
      { stage: "Embed", detail: "Token + learned positional embeddings, dropout" },
      { stage: "Transform", detail: "12 blocks: causal attention + GELU MLP, pre-norm residuals" },
      { stage: "Predict", detail: "Final norm → weight-tied LM head → 50,257 logits" },
    ],
    stack: ["Python", "PyTorch", "NumPy", "regex", "pytest"],
    metrics: [
      { label: "Vocabulary", value: "50,257", note: "GPT-2 BPE" },
      { label: "Context", value: "1,024", note: "tokens" },
      { label: "Layers / heads", value: "12 / 12", note: "768 dim" },
      { label: "Test modules", value: "6", note: "attention → tokenizer" },
    ],
    highlights: [
      "Six pytest modules cover attention, embeddings, the MLP, the transformer block, the tokenizer and an end-to-end encode/decode run.",
      "The tokenizer ships with the genuine 50,257-token vocabulary and the full merge table, so token IDs match GPT-2 rather than an approximation.",
      "The dataset loader produces sliding-window input/target pairs with a configurable stride, ready for next-token training.",
      "The implementation is deliberately dependency-light: torch, regex, numpy and pytest. No transformers, no tokenizers library.",
    ],
    limitations: [
      "Training and generation entry points are still scaffolding; there is no trained checkpoint in the repository yet.",
      "The model has been validated structurally and by unit tests, not by a loss curve on a real corpus.",
    ],
    motif: "tokens",
    accent: "amber",
    featured: true,
    detail: true,
  },
  {
    slug: "tripmate-multi-agent",
    title: "TripMate — Multi-Agent Travel System",
    kicker: "LangGraph + MCP",
    subtitle:
      "A stateful travel planner that coordinates three MCP tool servers, persists conversation threads in Postgres, and isolates tool failures.",
    year: "2026",
    category: "LLM & Agents",
    tags: ["LangGraph", "MCP", "FastAPI", "PostgreSQL", "Docker"],
    repo: repo("Multi_Agent_Travel_System"),
    summary:
      "A LangGraph agent that turns a natural-language trip request into flights, weather and a day-by-day itinerary. Tool access is delegated to three independent MCP servers — Tavily over streamable HTTP, AviationStack over stdio, and a custom FastMCP weather server — while thread state is checkpointed in Postgres.",
    problem:
      "A travel plan needs live data from unrelated providers. Stuffing every API into one prompt produces a fragile chain where one dead endpoint takes down the whole request, and where the agent forgets the conversation between turns.",
    approach: [
      {
        title: "Typed graph state",
        body:
          "A LangGraph StateGraph carries messages, flight results, hotel results, weather, itinerary and an LLM-call counter, so each node has an explicit contract instead of sharing a loose dictionary.",
      },
      {
        title: "Three MCP servers, three transports",
        body:
          "Tavily is reached over streamable HTTP, AviationStack runs as a stdio server through uvx, and a local FastMCP server wraps OpenWeather. Each server is loaded independently, so a broken tool degrades one capability instead of the graph.",
      },
      {
        title: "Durable threads",
        body:
          "PostgresSaver checkpoints graph state per thread_id, giving the conversation memory that survives a process restart rather than living in a Python variable.",
      },
      {
        title: "A deployable service",
        body:
          "FastAPI serves the Jinja2 interface, a JSON travel endpoint and a health check; the whole app runs from a python:3.11-slim image with a single uvicorn command.",
      },
    ],
    flow: [
      { stage: "Request", detail: "Natural-language trip query + optional thread_id" },
      { stage: "Graph", detail: "LangGraph StateGraph with typed travel state" },
      { stage: "Tools", detail: "MCP: Tavily (HTTP) · AviationStack (stdio) · Weather (FastMCP)" },
      { stage: "Reason", detail: "ChatGroq gpt-oss-120b composes flights, weather and itinerary" },
      { stage: "Persist", detail: "Postgres checkpointer keyed by thread_id" },
      { stage: "Respond", detail: "FastAPI JSON: answer, flights, hotels, itinerary, LLM calls" },
    ],
    stack: [
      "LangGraph",
      "LangChain",
      "MCP",
      "ChatGroq",
      "FastAPI",
      "PostgreSQL",
      "psycopg",
      "Jinja2",
      "Docker",
    ],
    metrics: [
      { label: "MCP servers", value: "3", note: "HTTP + 2 stdio" },
      { label: "Transports", value: "3", note: "HTTP, stdio, in-process" },
      { label: "Memory", value: "Postgres", note: "per-thread checkpoints" },
    ],
    highlights: [
      "Tool isolation is deliberate: get_all_tools() loads each MCP server in its own try block, so one unavailable provider does not prevent the others from loading.",
      "State is fully typed, including an LLM-call counter, which makes agent cost visible in the API response.",
      "The Dockerfile installs build tools, pins every dependency and exposes a single uvicorn entry point, so the service runs identically locally and in a container.",
      "Airport and country resolution uses airportsdata and pycountry instead of a hand-written city table alone.",
    ],
    limitations: [
      "Requires API keys for Groq, Tavily, AviationStack and OpenWeather, plus a Postgres URL.",
      "Flight data quality depends on the AviationStack plan; the free tier is limited.",
    ],
    motif: "graph",
    accent: "mint",
    featured: true,
    detail: true,
  },
  {
    slug: "complaineqa-pipeline",
    title: "ComplaineQAPipeline",
    kicker: "Video compliance auditing",
    subtitle:
      "A LangGraph workflow that indexes YouTube video transcripts and on-screen text with Azure Video Indexer, then audits content against policy documents.",
    year: "2026",
    category: "LLM & Agents",
    tags: ["LangGraph", "Azure AI Search", "RAG", "FastAPI", "OpenTelemetry"],
    repo: repo("ComplaineQAPipeline"),
    summary:
      "A retrieval-augmented compliance pipeline for video. It downloads a YouTube video, sends it to Azure Video Indexer, extracts transcript and OCR insights, indexes them in Azure AI Search, and runs a LangGraph audit that returns structured compliance issues with evidence.",
    problem:
      "Manual review of long-form video is slow and inconsistent, and the risky content is often spoken rather than written. An auditor needs searchable transcript and on-screen text, evidence for every finding, and a trace of how the conclusion was reached.",
    approach: [
      {
        title: "Index the video, not just the caption",
        body:
          "Azure Video Indexer supplies both the transcript and OCR of on-screen text; the pipeline normalises those insights into documents before any retrieval happens.",
      },
      {
        title: "Graph-structured audit",
        body:
          "A LangGraph workflow with a typed VideoAuditState moves from indexing to retrieval to issue extraction, emitting a structured compliance-issue schema rather than free-form prose.",
      },
      {
        title: "Retrieval over policy and content",
        body:
          "Azure AI Search stores the video evidence alongside indexed policy PDFs, so findings are grounded in both what was said and what the rules require.",
      },
      {
        title: "Telemetry from the start",
        body:
          "OpenTelemetry exports to Application Insights and LangSmith traces each graph step, so a bad audit can be debugged instead of guessed at.",
      },
    ],
    flow: [
      { stage: "Acquire", detail: "YouTube download, local media cleanup after upload" },
      { stage: "Index", detail: "Azure Video Indexer: transcript, OCR, insights" },
      { stage: "Chunk", detail: "Normalise insights and policy PDFs into documents" },
      { stage: "Store", detail: "Azure AI Search vector index" },
      { stage: "Audit", detail: "LangGraph nodes retrieve evidence and classify issues" },
      { stage: "Report", detail: "Structured issues + FastAPI service + tracing" },
    ],
    stack: [
      "LangGraph",
      "LangChain",
      "Azure Video Indexer",
      "Azure AI Search",
      "Azure OpenAI",
      "LangSmith",
      "OpenTelemetry",
      "FastAPI",
      "uv",
      "Redis",
      "PostgreSQL",
    ],
    metrics: [
      { label: "Orchestration", value: "LangGraph", note: "typed state" },
      { label: "Modalities", value: "2", note: "transcript + OCR" },
      { label: "Tracing", value: "2 layers", note: "LangSmith + App Insights" },
    ],
    highlights: [
      "Two source modalities are indexed, which catches violations that exist only on screen as text overlays.",
      "The audit output is a typed schema, so downstream systems can act on findings without parsing prose.",
      "A separate document-indexing script handles policy PDFs, keeping the retrieval corpus versionable and independent of any single video.",
      "Temporary media is deleted immediately after upload, which keeps the container from accumulating large files.",
    ],
    limitations: [
      "The repository README still describes the earlier summarisation scope; backend/src/graph is the current source of truth.",
      "Requires Azure Video Indexer, Azure AI Search and Azure OpenAI resources, so it cannot be run end-to-end without cloud credentials.",
    ],
    motif: "film",
    accent: "rose",
    featured: true,
    detail: true,
  },
  {
    slug: "credit-card-fraud-mlops",
    title: "Credit Card Fraud Detection — MLOps",
    kicker: "Reproducible pipeline",
    subtitle:
      "A DVC-orchestrated fraud detection pipeline with an S3 remote, MLflow tracking, a Flask inference API and CI.",
    year: "2026",
    category: "MLOps",
    tags: ["DVC", "MLflow", "AWS S3", "Flask", "GitHub Actions"],
    repo: repo("Credit-Card-Fraud-Detection-_-MLOps"),
    summary:
      "A reproducible machine-learning project where data, pipeline stages and model artefacts are versioned, experiments are tracked, and the resulting model is served through a small Flask API with a health check.",
    problem:
      "Fraud models are only useful if they can be rebuilt. When data lives in a notebook and preprocessing lives in someone's head, a result cannot be reproduced, compared or rolled back.",
    approach: [
      {
        title: "Pipeline as code",
        body:
          "Four DVC stages — ingestion, transformation, training, evaluation — are declared in dvc.yaml and locked in dvc.lock, so a fresh clone can reproduce the same artefacts with one command.",
      },
      {
        title: "Data outside git",
        body:
          "Datasets and model binaries are DVC-tracked with an S3 remote, keeping the repository small while preserving exact versions of every artefact.",
      },
      {
        title: "Tracked experiments",
        body:
          "MLflow records parameters, metrics and artefacts per run, which makes model comparison a query instead of a memory exercise.",
      },
      {
        title: "Serving and CI",
        body:
          "A Flask application exposes /health and /predict; GitHub Actions runs the test suite and environment checks on every push, and tox standardises the test environment.",
      },
    ],
    flow: [
      { stage: "Ingest", detail: "dvc.yaml stage 1 — raw data into artefacts" },
      { stage: "Transform", detail: "Preprocessing and feature engineering" },
      { stage: "Train", detail: "Model fitting with MLflow-tracked parameters" },
      { stage: "Evaluate", detail: "Metrics and reports written to reports/" },
      { stage: "Serve", detail: "Flask /predict + /health" },
    ],
    stack: [
      "Python",
      "scikit-learn",
      "pandas",
      "NumPy",
      "DVC",
      "dvc-s3",
      "AWS S3",
      "MLflow",
      "Flask",
      "GitHub Actions",
      "tox",
      "Docker",
    ],
    metrics: [
      { label: "DVC stages", value: "4", note: "locked pipeline" },
      { label: "API routes", value: "2", note: "/health, /predict" },
      { label: "Remote", value: "S3", note: "versioned artefacts" },
    ],
    highlights: [
      "dvc.lock pins the exact dependency graph, so reproducing a result does not depend on local file state.",
      "The Flask app is importable and testable without starting a server, which keeps CI fast.",
      "Environment validation and tox configuration make dependency problems visible before training starts.",
      "A Makefile wraps the common commands so the workflow is discoverable.",
    ],
    limitations: [
      "The API is a demonstration service without authentication or rate limiting.",
      "No recorded evaluation metrics are published in the repository yet.",
    ],
    motif: "ledger",
    accent: "iris",
    featured: true,
    detail: true,
  },
];

export const detailProjects = projects.filter((p) => p.detail);
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function neighbours(slug: string) {
  const list = detailProjects;
  const index = list.findIndex((p) => p.slug === slug);
  return {
    previous: index > 0 ? list[index - 1] : list[list.length - 1],
    next: index < list.length - 1 ? list[index + 1] : list[0],
  };
}

export type ArchiveProject = {
  title: string;
  description: string;
  stack: string[];
  repo: string;
  category: ProjectCategory;
  year: string;
  note?: string;
};

export const archiveProjects: ArchiveProject[] = [
  {
    title: "AI YouTube Summarizer",
    category: "LLM & Agents",
    year: "2026",
    description:
      "Streamlit application that turns a YouTube transcript into a summary, key insights, chapter timestamps and a TL;DR, then answers questions over the transcript with a FAISS-backed RAG chain. Includes disk caching keyed by video, model and length, plus PDF/TXT/JSON export.",
    stack: ["Streamlit", "LangChain", "FAISS", "Groq", "OpenAI"],
    repo: repo("AI-YouTube-Video-Summarizer"),
  },
  {
    title: "Smart_CuraPath",
    category: "ML Applications",
    year: "2025",
    description:
      "Flask symptom checker that encodes symptoms into a binary vector for a Random Forest classifier, then narrows the differential with a rule-based follow-up question engine before returning a predicted condition.",
    stack: ["Flask", "scikit-learn", "Random Forest", "pandas"],
    repo: repo("Smart_CuraPath"),
    note: "Local data paths need adjusting before it runs outside the author's machine.",
  },
  {
    title: "Forest Cover Predictor",
    category: "ML Applications",
    year: "2026",
    description:
      "Flask and vanilla-JavaScript interface for a Decision Tree trained on 55 features to classify seven forest cover types across Roosevelt National Forest, with probability bars and prediction history.",
    stack: ["Flask", "scikit-learn", "JavaScript", "CSS"],
    repo: repo("forest-cover-predictor"),
  },
  {
    title: "Capstone MLOps — IMDB Sentiment",
    category: "MLOps",
    year: "2026",
    description:
      "Five-stage DVC pipeline (ingestion, preprocessing, feature engineering, training, evaluation) with a Streamlit front end, experiment tracking and GitHub Actions CI. A deliberate exercise in pipeline structure over model complexity.",
    stack: ["DVC", "scikit-learn", "Streamlit", "GitHub Actions"],
    repo: repo("Capstone-_-MLOPS-Project"),
  },
  {
    title: "MLOps — Vehicle Insurance Pipeline",
    category: "MLOps",
    year: "2026",
    description:
      "Training and prediction pipelines with MongoDB ingestion, AWS S3 model storage and a modular src layout, built to practise production-style packaging rather than a single script.",
    stack: ["Python", "MongoDB", "AWS S3", "Docker"],
    repo: repo("MLOps-Project---Vehicle-Insurance-Data-Pipeline"),
    note: "Partially implemented: ingestion and configuration layers are complete.",
  },
  {
    title: "Quantum Computing Suite",
    category: "Quantum",
    year: "2025 — 2026",
    description:
      "Qiskit implementations of Shor's algorithm, Grover's search, quantum phase estimation, teleportation, superdense coding and the double-slit experiment, plus quantum machine-learning experiments using QSVM kernels.",
    stack: ["Qiskit", "Python", "Jupyter"],
    repo: repo("Shor-s-Algorithm"),
  },
];

export const quantumRepos = [
  { name: "Shor's Algorithm", href: repo("Shor-s-Algorithm") },
  { name: "Grover's Algorithm", href: repo("Grover_Algorithm") },
  { name: "Quantum Phase Estimation", href: repo("Quantum_Phase_Estimation") },
  { name: "Quantum Teleportation", href: repo("Quantum-Teleportation") },
  { name: "Superdense Coding", href: repo("Superdense-Coding") },
  { name: "Double Slit Experiment", href: repo("Double_Slit_Experiment") },
  {
    name: "QSVM — Breast Cancer",
    href: repo("Breast_Cancer-Prediction-using-Quantum-Machine-Learning-QSVM-"),
  },
  {
    name: "QML — Card Fraud",
    href: repo("Credit-Card-Fraud-Detection-using-Quantum-Machine-Learning"),
  },
];
