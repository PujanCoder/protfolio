export type ArchFile = { path: string; note: string };

export type ArchNode = {
  id: string;
  label: string;
  role: string;
  purpose: string;
  input: string;
  output: string;
  tech: string[];
  detail: string;
  files: ArchFile[];
};

export type ArchSystem = {
  slug: string;
  name: string;
  kicker: string;
  repo: string;
  summary: string;
  stack: string[];
  nodes: ArchNode[];
  caveat: string;
};

const ndr: ArchSystem = {
  slug: "network-intrusion-detection",
  name: "Network Intrusion Detection",
  kicker: "Real-time detection platform",
  repo: "https://github.com/PujanCoder/Network-Intrusion-Detection-Advanced-MLOps",
  summary:
    "Zeek connection telemetry is tailed incrementally, mapped to a 23-feature contract, scored by a gradient-boosted classifier with rule detectors running alongside it, and streamed to a security dashboard over WebSocket.",
  stack: ["Python 3.13", "FastAPI", "scikit-learn", "SQLite", "Zeek", "React 19", "WebSocket"],
  caveat:
    "Metadata-only detection: flow features, no payload inspection. Cross-dataset transfer is weak and published as such.",
  nodes: [
    {
      id: "ingest",
      label: "Data ingestion",
      role: "Zeek conn.log to durable queue",
      purpose:
        "Read network telemetry continuously without losing or duplicating events when files rotate or the process restarts.",
      input: "Zeek conn.log (TSV or JSON), live interface or replay file",
      output: "New log lines, de-duplicated, with a persisted byte offset",
      tech: ["Python threads", "SQLite checkpoints", "Zeek"],
      detail:
        "One daemon thread polls the log directory every 0.5 s, reads only bytes past the stored offset, and commits the new offset to SQLite. Rotation and truncation are detected by inode and size, and a partial trailing line is held back until it completes.",
      files: [
        { path: "src/realtime/reader.py", note: "Offset-persisted tailing loop" },
        { path: "src/ingestion/zeek/checkpoints.py", note: "Checkpoint storage" },
        { path: "src/realtime/zeek_parser.py", note: "TSV and JSON parsing" },
      ],
    },
    {
      id: "clean",
      label: "Data cleaning",
      role: "Normalise and de-duplicate",
      purpose:
        "Turn raw log lines into canonical records so training and serving see identical field semantics.",
      input: "Raw Zeek records",
      output: "Typed connection records with a stable fingerprint",
      tech: ["pandas", "NumPy"],
      detail:
        "Field names are normalised across Zeek versions, missing values are filled with documented sentinels, and duplicate connections are collapsed using a fingerprint before they reach the model or the database.",
      files: [
        { path: "src/features/data_cleaning.py", note: "Cleaning rules" },
        { path: "src/ingestion/zeek/dedup.py", note: "Fingerprint de-duplication" },
        { path: "src/ingestion/zeek/normalizers/base.py", note: "Schema normalisation" },
      ],
    },
    {
      id: "features",
      label: "Feature engineering",
      role: "One 23-feature contract",
      purpose:
        "Guarantee that the features used at training time are exactly the features used at inference time.",
      input: "Cleaned connection records",
      output: "23 numeric features, fixed order and dtype",
      tech: ["pandas", "scikit-learn pipelines"],
      detail:
        "A single extractor module is imported by both the training pipeline and the FastAPI service. A contract test asserts that the saved artefact's expected columns match the extractor's output, so schema drift fails CI instead of silently degrading accuracy.",
      files: [
        { path: "src/realtime/features.py", note: "Serving-side extractor" },
        { path: "src/features/feature_transformation.py", note: "Training-side transforms" },
        { path: "tests/test_feature_contract.py", note: "Contract test" },
      ],
    },
    {
      id: "train",
      label: "Model training",
      role: "Multi-dataset gradient boosting",
      purpose:
        "Train a classifier on heterogeneous public datasets and fix an operating threshold that matches a false-positive budget.",
      input: "298k deduplicated flows from CICIDS2017, UNSW-NB15 and NSL-KDD",
      output: "Model artefact plus metadata (features, threshold, seed)",
      tech: ["HistGradientBoosting", "DVC", "MLflow"],
      detail:
        "Records from three datasets are deduplicated from 434k to 298k and split 208,755 / 44,733 / 44,734 with stratification by dataset and label. The decision threshold is set to 0.95 to hold a 5% false-positive budget instead of maximising accuracy.",
      files: [
        { path: "src/realtime/training.py", note: "Live-model training" },
        { path: "src/models/train_zeek_model.py", note: "Zeek feature training" },
        { path: "dvc.yaml", note: "Pipeline stages" },
        { path: "params.yaml", note: "Threshold and split parameters" },
      ],
    },
    {
      id: "evaluate",
      label: "Model evaluation",
      role: "Held-out and cross-dataset",
      purpose:
        "Report what the model actually does on data it has not seen, including the cases where it fails.",
      input: "Held-out split and external datasets",
      output: "Metrics, confusion matrix, model card",
      tech: ["scikit-learn metrics", "pytest"],
      detail:
        "Held-out results are 0.973 F1, 0.963 precision and 0.983 recall on 44,734 flows with a 3.56% false-positive rate. Cross-dataset results are published next to them: UNSW-NB15 reaches 0.939 F1, NSL-KDD 0.492 recall, and a zero-day probe trained without NSL-KDD scores 0.00 recall.",
      files: [
        { path: "src/models/evaluate_model.py", note: "Evaluation entry point" },
        { path: "reports/zeek_model/model_card.md", note: "Model card with limitations" },
        { path: "reports/zeek_model/evaluation.json", note: "Recorded metrics" },
      ],
    },
    {
      id: "inference",
      label: "Inference",
      role: "FastAPI plus WebSocket fan-out",
      purpose:
        "Score flows as they arrive and push results to every connected dashboard without polling.",
      input: "Feature vectors from the live reader",
      output: "Predictions, alerts and WebSocket messages",
      tech: ["FastAPI", "WebSocket", "Uvicorn", "Docker"],
      detail:
        "Inference is measured, not estimated: p50 2.23 ms and p95 2.92 ms across 2,000 flows, at 432 flows/s. Remote sensor ingestion is authenticated with an API key and fails closed with 503 when the key is not configured.",
      files: [
        { path: "src/serving/app.py", note: "Application factory" },
        { path: "src/serving/routes/ingest.py", note: "Authenticated ingestion" },
        { path: "src/serving/ws.py", note: "WebSocket fan-out" },
        { path: "src/serving/zeek_predictor.py", note: "Scoring path" },
      ],
    },
    {
      id: "monitor",
      label: "Monitoring",
      role: "Dashboard and sensor health",
      purpose:
        "Make freshness, latency and model behaviour visible, and refuse to display activity that did not happen.",
      input: "SQLite tables: events, predictions, alerts, ingestion state",
      output: "Seven dashboard views, alert triage, model and sensor health",
      tech: ["SQLite", "React 19", "Recharts", "Evidently"],
      detail:
        "Every figure on the dashboard is read from SQLite. Inference latency and event-to-database delay are measured, replay data is tagged and shown behind a banner, and an idle sensor reports \"No new network events received.\" rather than inventing traffic.",
      files: [
        { path: "src/realtime/store.py", note: "Persistence layer" },
        { path: "src/serving/routes/dashboard.py", note: "Aggregate queries" },
        { path: "frontend/src/pages/Overview.tsx", note: "Live dashboard view" },
        { path: "frontend/src/hooks/useLiveStream.ts", note: "WebSocket client" },
      ],
    },
    {
      id: "rules",
      label: "Rule detectors",
      role: "Ten behavioural checks",
      purpose:
        "Catch obvious behaviour the model might miss, and keep the two signals distinguishable for the analyst.",
      input: "The same normalised connection records",
      output: "Rule alerts with severity, category and evidence",
      tech: ["Python", "pytest"],
      detail:
        "Ten detectors run independently of the classifier and attach severity and evidence. Alerts are de-duplicated per event and rule, so a model miss can still surface as a rule hit without double-counting.",
      files: [
        { path: "src/realtime/detectors.py", note: "Detector implementations" },
        { path: "tests/test_realtime_detectors.py", note: "Detector tests" },
      ],
    },
  ],
};

const medical: ArchSystem = {
  slug: "medical-imaging-mlops",
  name: "Medical Imaging MLOps",
  kicker: "Self-healing training pipeline",
  repo: "https://github.com/PujanCoder/Medical-imaging-MLOps",
  summary:
    "A tuberculosis chest X-ray pipeline that trains a ResNet18 with MLflow tracking, validates every candidate against a baseline before promotion, and routes nine failure classes through recovery policies that are themselves verified.",
  stack: ["Python", "PyTorch", "MLflow", "DVC", "FastAPI", "Prometheus", "Docker"],
  caveat:
    "Thresholds are engineering demo thresholds, not clinical validation. The evaluation set has only 110 tuberculosis-positive images.",
  nodes: [
    {
      id: "validate",
      label: "Dataset validation",
      role: "Integrity before training",
      purpose:
        "Fail early if the dataset is incomplete, imbalanced in an unexpected way, or not reproducible.",
      input: "Chest X-ray dataset with normal and tuberculosis classes",
      output: "Validated manifest and a reproducible split",
      tech: ["Python", "pandas", "DVC"],
      detail:
        "Integrity checks and a fixed seed produce a 70/15/15 split that is recorded in params, so a rerun produces the same partition.",
      files: [
        { path: "src/data/ingestion.py", note: "Dataset ingestion" },
        { path: "scripts/download_data.py", note: "Data fetch" },
        { path: "params.yaml", note: "Split and training parameters" },
      ],
    },
    {
      id: "preprocess",
      label: "Preprocessing",
      role: "Images to tensors",
      purpose:
        "Produce deterministic model input: resized, normalised 224 px tensors in batches of 16.",
      input: "Raw images",
      output: "Normalised tensors plus label tensors",
      tech: ["PyTorch", "torchvision"],
      detail:
        "Resizing, normalisation and augmentation live in one preprocessing module used by training, evaluation and the API, so serving cannot drift from training.",
      files: [
        { path: "src/data/preprocessing.py", note: "Transforms" },
        { path: "src/features/image_features.py", note: "Feature extraction helpers" },
      ],
    },
    {
      id: "train",
      label: "Training",
      role: "ResNet18 transfer learning",
      purpose:
        "Fine-tune a pretrained backbone on a small dataset without overfitting to 630 test images.",
      input: "Training split tensors",
      output: "Checkpoint and an MLflow run with metrics",
      tech: ["PyTorch", "MLflow", "DVC"],
      detail:
        "Every run is tracked in MLflow with parameters, metrics and the resulting artefact, so a candidate can be compared to the registered baseline rather than to memory.",
      files: [
        { path: "src/models/train.py", note: "Training loop" },
        { path: "configs/model_config.yaml", note: "Architecture and optimiser" },
        { path: "dvc.yaml", note: "Pipeline definition" },
      ],
    },
    {
      id: "evaluate",
      label: "Evaluation",
      role: "Per-class recall, not just accuracy",
      purpose:
        "Measure the metric that matters clinically, recall on the positive class, alongside accuracy and weighted F1.",
      input: "Held-out test split",
      output: "Accuracy, F1, per-class recall, confusion matrix",
      tech: ["scikit-learn metrics", "pytest"],
      detail:
        "The recorded retrain produced 0.867 accuracy and 0.830 weighted F1 but only 0.236 tuberculosis recall, which is why the gate rejected it.",
      files: [
        { path: "src/evaluation/evaluate.py", note: "Metric computation" },
        {
          path: "artifacts/retrained_evaluation/evaluation_metrics.json",
          note: "Recorded metrics",
        },
      ],
    },
    {
      id: "gate",
      label: "Quality gate",
      role: "Promote or reject",
      purpose:
        "Stop a regression from reaching the registry, even when its headline accuracy looks better.",
      input: "Candidate metrics and the registered baseline",
      output: "Promote or reject decision with a reason",
      tech: ["Python", "pytest"],
      detail:
        "The gate compares candidate and baseline on a recall floor and an accuracy delta. A candidate that improves accuracy while collapsing positive-class recall is rejected, which is exactly what happened on the recorded retrain.",
      files: [
        { path: "src/automation/model_quality_gate.py", note: "Gate rules" },
        { path: "src/automation/retraining.py", note: "Retrain orchestration" },
        { path: "tests/unit/test_model_quality_gate.py", note: "Gate tests" },
      ],
    },
    {
      id: "serve",
      label: "Serving",
      role: "FastAPI inference",
      purpose:
        "Expose the promoted model with health and metrics endpoints that monitoring can scrape.",
      input: "Image uploads",
      output: "Prediction, confidence, Prometheus metrics",
      tech: ["FastAPI", "Docker", "Prometheus"],
      detail:
        "The API loads the registry version, validates the payload schema, and exposes health and metrics routes used by the container healthcheck and Prometheus.",
      files: [
        { path: "api/main.py", note: "Service entry point" },
        { path: "src/api/predict.py", note: "Inference handler" },
        { path: "api/schemas.py", note: "Request and response models" },
      ],
    },
    {
      id: "monitor",
      label: "Monitoring",
      role: "Drift and model health",
      purpose:
        "Detect input drift and degraded predictions before a human notices them in the output.",
      input: "Prediction logs and reference distributions",
      output: "Drift reports and alertable metrics",
      tech: ["Drift checks", "Prometheus", "Grafana"],
      detail:
        "Data drift is computed against the training reference distribution and exposed with model metrics on a Prometheus scrape endpoint, with Grafana dashboards for the series that matter.",
      files: [
        { path: "src/monitoring/data_drift.py", note: "Drift computation" },
        { path: "src/monitoring/model_monitor.py", note: "Model health" },
        { path: "monitoring/prometheus/prometheus.yml", note: "Scrape config" },
      ],
    },
    {
      id: "recover",
      label: "Failure recovery",
      role: "Detect, analyse, recover, verify",
      purpose:
        "Treat failures as a pipeline problem with a documented response, not an exception to be restarted by hand.",
      input: "Failure signals from the pipeline",
      output: "Applied recovery policy and a validation verdict",
      tech: ["Python", "pytest"],
      detail:
        "Nine failure classes are detected and routed through policies to a recovery engine, then a validator checks that recovery actually worked instead of assuming it. Integration tests drive the whole autopilot flow.",
      files: [
        { path: "src/automation/failure_detector.py", note: "Failure classification" },
        { path: "src/automation/recovery_engine.py", note: "Recovery execution" },
        { path: "src/automation/recovery_validator.py", note: "Post-recovery checks" },
        { path: "tests/integration/test_autopilot_flow.py", note: "End-to-end flow" },
      ],
    },
  ],
};

const gpt2: ArchSystem = {
  slug: "gpt2-clone",
  name: "GPT-2 Clone",
  kicker: "Transformer from first principles",
  repo: "https://github.com/PujanCoder/GPT-2-CLONE",
  summary:
    "GPT-2 reimplemented in PyTorch without the transformers library: a byte-level BPE tokenizer with the genuine 50,257-token vocabulary, causal self-attention, pre-norm transformer blocks and a weight-tied language-model head.",
  stack: ["PyTorch", "NumPy", "regex", "pytest"],
  caveat:
    "Training and generation entry points are scaffolding; there is no trained checkpoint, so the model is validated structurally and by unit tests rather than by a loss curve.",
  nodes: [
    {
      id: "tokenizer",
      label: "Byte-level BPE",
      role: "Text to token IDs",
      purpose:
        "Reproduce GPT-2 tokenisation exactly so token IDs match the reference model.",
      input: "Raw UTF-8 text",
      output: "Token IDs in the 50,257-token vocabulary",
      tech: ["Python", "regex", "json"],
      detail:
        "Text is pre-tokenised with GPT-2's regex pattern, mapped to reversible unicode byte symbols, then merged by lowest rank from the shipped merge table with a per-token cache.",
      files: [
        { path: "tokenizer/bpe.py", note: "Merge algorithm" },
        { path: "tokenizer/byte_encoder.py", note: "Byte to unicode mapping" },
        { path: "tokenizer/tokenizer.py", note: "Encode and decode API" },
        { path: "vocab.json", note: "Vocabulary and merges" },
      ],
    },
    {
      id: "embed",
      label: "Embeddings",
      role: "Tokens plus positions",
      purpose:
        "Turn token IDs into vectors and add a learned positional signal for the 1,024-token context.",
      input: "Token IDs of shape (batch, sequence)",
      output: "Activations of shape (batch, sequence, 768)",
      tech: ["nn.Embedding"],
      detail:
        "Token embeddings and a learned positional embedding table are summed and passed through dropout, matching GPT-2's parameterisation rather than using sinusoidal positions.",
      files: [
        { path: "model/embeddings.py", note: "Embedding module" },
        { path: "config.py", note: "n_embd, n_head, n_layer, context" },
      ],
    },
    {
      id: "attention",
      label: "Causal self-attention",
      role: "12 heads, masked",
      purpose:
        "Let each position attend to earlier positions only, so the model cannot see the token it must predict.",
      input: "Sequence activations",
      output: "Attention output of the same shape",
      tech: ["PyTorch", "scaled dot-product attention"],
      detail:
        "Queries, keys and values are projected to 12 heads of 64 dimensions, scaled by 1/sqrt(d_k), masked above the diagonal, softmaxed, and recombined through an output projection.",
      files: [
        { path: "model/attention.py", note: "Multi-head causal attention" },
        { path: "tests/test_attention.py", note: "Causality and shape tests" },
      ],
    },
    {
      id: "mlp",
      label: "Feed-forward block",
      role: "4x expansion, GELU",
      purpose:
        "Provide per-position nonlinear capacity after attention mixes information across the sequence.",
      input: "Attention output",
      output: "Same-shape activations",
      tech: ["PyTorch", "GELU"],
      detail:
        "Two linear layers with a 4x hidden expansion and a GELU nonlinearity, matching GPT-2's block width.",
      files: [
        { path: "model/mlp.py", note: "MLP module" },
        { path: "tests/test_mlp.py", note: "Shape tests" },
      ],
    },
    {
      id: "block",
      label: "Transformer block",
      role: "Pre-norm residuals",
      purpose:
        "Stack attention and MLP with layer normalisation before each sublayer and residual connections around both.",
      input: "Sequence activations",
      output: "Sequence activations",
      tech: ["PyTorch", "LayerNorm"],
      detail:
        "Pre-norm residual blocks are what make a 12-layer stack trainable without warm-up gymnastics; the implementation keeps that ordering explicit.",
      files: [
        { path: "model/block.py", note: "Block composition" },
        { path: "model/transformer_block.py", note: "Block variant" },
        { path: "model/layer_norm.py", note: "Normalisation" },
      ],
    },
    {
      id: "head",
      label: "Language-model head",
      role: "Weight-tied logits",
      purpose:
        "Project the final hidden state back to vocabulary space, reusing the embedding matrix.",
      input: "Final normalised activations",
      output: "Logits of shape (batch, sequence, 50,257)",
      tech: ["PyTorch", "tied weights"],
      detail:
        "The output projection shares weights with the token embedding, which cuts parameters and is the GPT-2 convention.",
      files: [
        { path: "model/gpt2.py", note: "Model assembly" },
        { path: "tests/test_transformer_block.py", note: "End-to-end shape tests" },
      ],
    },
    {
      id: "train",
      label: "Training loop",
      role: "Sliding-window next token",
      purpose:
        "Produce input and target pairs with a configurable stride and run the optimisation loop.",
      input: "Tokenised corpus",
      output: "Checkpoints (scaffolding)",
      tech: ["PyTorch", "AdamW"],
      detail:
        "The dataset loader yields overlapping windows with a configurable stride; the training entry point is deliberately scaffolding and the README says so rather than claiming a trained model.",
      files: [
        { path: "train.py", note: "Training entry point" },
        { path: "dataset.py", note: "Window construction" },
        { path: "dataloader.py", note: "Batching" },
      ],
    },
    {
      id: "generate",
      label: "Generation",
      role: "Autoregressive sampling",
      purpose: "Sample continuations token by token from the model's own predictions.",
      input: "A prompt",
      output: "Generated token sequence",
      tech: ["PyTorch"],
      detail:
        "Generation loops forward passes, samples from the distribution, and appends the sampled token until the requested length is reached.",
      files: [
        { path: "generate.py", note: "Sampling loop" },
        { path: "tests/test_run.py", note: "Smoke test" },
      ],
    },
  ],
};

export const archSystems: ArchSystem[] = [ndr, medical, gpt2];

export function getArchSystem(slug: string) {
  return archSystems.find((system) => system.slug === slug);
}

export function archFileUrl(system: ArchSystem, path: string) {
  return `${system.repo}/blob/main/${path}`;
}
