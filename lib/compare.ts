export type CompareProject = {
  slug: string;
  name: string;
  short: string;
  repo: string;
};

export type CompareRow = {
  id: string;
  label: string;
  hint: string;
  values: Record<string, string>;
};

export const compareProjects: CompareProject[] = [
  {
    slug: "network-intrusion-detection",
    name: "Network Intrusion Detection",
    short: "NDR",
    repo: "https://github.com/PujanCoder/Network-Intrusion-Detection-Advanced-MLOps",
  },
  {
    slug: "medical-imaging-mlops",
    name: "Medical Imaging MLOps",
    short: "Medical",
    repo: "https://github.com/PujanCoder/Medical-imaging-MLOps",
  },
  {
    slug: "gpt2-clone",
    name: "GPT-2 Clone",
    short: "GPT-2",
    repo: "https://github.com/PujanCoder/GPT-2-CLONE",
  },
];

export const compareRows: CompareRow[] = [
  {
    id: "problem",
    label: "Problem solved",
    hint: "What the system is actually for",
    values: {
      "network-intrusion-detection":
        "Score live network connections and surface attacks with evidence an analyst can act on, while staying honest about where the model fails.",
      "medical-imaging-mlops":
        "Automate training, promotion, monitoring and recovery for a chest X-ray classifier so a bad candidate cannot reach production.",
      "gpt2-clone":
        "Understand the transformer by rebuilding GPT-2 from its components instead of importing it, with tokenisation identical to the reference model.",
    },
  },
  {
    id: "architecture",
    label: "Architecture",
    hint: "How the pieces connect",
    values: {
      "network-intrusion-detection":
        "Tailer to feature extractor to gradient-boosted classifier plus rule detectors, persisted in SQLite, served by FastAPI and fanned out over WebSocket to a React dashboard.",
      "medical-imaging-mlops":
        "DVC pipeline stages with MLflow tracking, a quality gate against the registered baseline, a FastAPI service, Prometheus and Grafana, and a failure autopilot with a post-recovery validator.",
      "gpt2-clone":
        "Tokenizer to embeddings to 12 pre-norm transformer blocks (causal attention plus GELU MLP) to a weight-tied LM head, with separate training and generation entry points.",
    },
  },
  {
    id: "data",
    label: "Data processing",
    hint: "Where the inputs come from and how they are shaped",
    values: {
      "network-intrusion-detection":
        "434k raw records from CICIDS2017, UNSW-NB15 and NSL-KDD deduplicated to 298k, split 208,755 / 44,733 / 44,734 with stratification by dataset and label; 23 features shared by training and serving.",
      "medical-imaging-mlops":
        "Chest X-ray images resized to 224 px tensors in batches of 16, 70/15/15 split with a fixed seed; the evaluation set holds 630 images, of which 110 are tuberculosis-positive.",
      "gpt2-clone":
        "Raw UTF-8 text pre-tokenised with GPT-2's regex, byte-encoded to reversible unicode, merged by rank from the real 50,257-token vocabulary; windows of 1,024 tokens with a configurable stride.",
    },
  },
  {
    id: "model",
    label: "Model approach",
    hint: "The learning method, not the marketing",
    values: {
      "network-intrusion-detection":
        "HistGradientBoosting with the operating threshold fixed at 0.95 to hold a 5% false-positive budget, plus ten independent behavioural rule detectors.",
      "medical-imaging-mlops":
        "ResNet18 transfer learning, with promotion decided by a quality gate rather than by the training run that produced it.",
      "gpt2-clone":
        "GPT-2 parameterisation implemented directly: learned positional embeddings, multi-head causal attention, 4x GELU MLP, pre-norm residuals, tied output weights.",
    },
  },
  {
    id: "evaluation",
    label: "Evaluation",
    hint: "The numbers, with their conditions",
    values: {
      "network-intrusion-detection":
        "0.973 F1, 0.963 precision, 0.983 recall, 3.56% false-positive rate on 44,734 held-out flows. Cross-dataset: UNSW-NB15 0.939 F1, NSL-KDD 0.492 recall, zero-day probe 0.00 recall.",
      "medical-imaging-mlops":
        "Recorded retrain: 0.867 accuracy, 0.830 weighted F1, 0.236 tuberculosis recall. The gate rejected the candidate because recall sat below the 0.80 floor.",
      "gpt2-clone":
        "Six pytest modules cover attention causality, embedding shapes, the MLP, the transformer block, tokenizer round-trips and an end-to-end run. No loss curve: no checkpoint is claimed.",
    },
  },
  {
    id: "deployment",
    label: "Deployment",
    hint: "How it runs outside the author's laptop",
    values: {
      "network-intrusion-detection":
        "FastAPI service in Docker, deployed to Render with a CI/CD workflow; authenticated sensor ingestion; frontend built by Vite in the same pipeline.",
      "medical-imaging-mlops":
        "Containerised API with health and metrics endpoints, Prometheus scrape configuration and Grafana dashboards, plus CI, deployment and training workflows in GitHub Actions.",
      "gpt2-clone":
        "Not deployed. It is a reference implementation and test suite; the README states that training and generation are scaffolding.",
    },
  },
  {
    id: "monitoring",
    label: "Monitoring",
    hint: "What you can see after it ships",
    values: {
      "network-intrusion-detection":
        "Measured p50 2.23 ms and p95 2.92 ms over 2,000 flows, event-to-database delay, sensor health, replay labelling and an idle state that reports no traffic instead of fabricating it.",
      "medical-imaging-mlops":
        "Data drift against the training reference distribution, model health metrics, Prometheus series and Grafana dashboards, with a failure detector that classifies nine failure modes.",
      "gpt2-clone":
        "Test-time validation only. There is no serving telemetry because there is no service.",
    },
  },
  {
    id: "hardest",
    label: "Hardest constraint",
    hint: "The honest limiting factor",
    values: {
      "network-intrusion-detection":
        "Cross-dataset generalisation: a model trained without NSL-KDD scores 0.00 recall on it. The platform publishes that rather than tuning it away.",
      "medical-imaging-mlops":
        "Only 110 positive test images, so recall estimates are wide. Thresholds are engineering demo values, not clinical validation.",
      "gpt2-clone":
        "Scale: a faithful architecture without a trained checkpoint proves structure, not language ability.",
    },
  },
  {
    id: "stack",
    label: "Primary stack",
    hint: "Languages and frameworks",
    values: {
      "network-intrusion-detection":
        "Python 3.13, FastAPI, scikit-learn, pandas, SQLite, Zeek, DVC, MLflow, React 19, TypeScript, Recharts, Docker, GitHub Actions",
      "medical-imaging-mlops":
        "Python, PyTorch, torchvision, MLflow, DVC, FastAPI, Prometheus, Grafana, Docker, GitHub Actions",
      "gpt2-clone": "Python, PyTorch, NumPy, regex, pytest",
    },
  },
];

export function valueFor(row: CompareRow, slug: string) {
  return row.values[slug] ?? "";
}
