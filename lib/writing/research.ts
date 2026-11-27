export type PostKind = "research" | "blog";

export type Post = {
  slug: string;
  kind: PostKind;
  title: string;
  summary: string;
  category: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  body: string;
  evidence: { label: string; href: string }[];
};

const repo = (name: string) => `https://github.com/PujanCoder/${name}`;

export const researchPosts: Post[] = [
  {
    slug: "zero-recall-cross-dataset",
    kind: "research",
    title: "Why the detector scores zero on a dataset it has never seen",
    summary:
      "A cross-dataset probe trained without NSL-KDD reached 0.00 recall on it. This note records what that result means, why it is published next to the 0.973 F1, and what would have to change to fix it.",
    category: "Detection engineering",
    date: "2026-01-18",
    readingMinutes: 7,
    tags: ["NDR", "evaluation", "distribution shift", "security"],
    body: `## The result

The held-out number for the network intrusion detection model is 0.973 F1 on 44,734 flows. That number is real, and it is also the least interesting thing about the evaluation.

The interesting result is the probe: train the same pipeline without NSL-KDD, then score NSL-KDD. Recall is **0.00**. Not low. Zero. The model does not rank a single NSL-KDD attack above the threshold.

## Why this is not a bug

A model learns a decision boundary in the space of the features it was shown. NSL-KDD's feature semantics differ from CICIDS2017's: the same column name can carry a different scale, a different measurement window, or a different meaning entirely. When the semantics shift, the boundary lands somewhere meaningless, and a threshold tuned on the training distribution will classify everything as benign.

That is the honest description of most production drift incidents. The model is not broken. The world moved.

## What the probe is actually testing

The probe answers one question: does this model transfer to a dataset it was not trained on? The answer is no, and the platform reports that answer instead of hiding it behind an aggregate.

Three consequences follow:

- **The model is a decision-support tool, not an unattended sensor.** That sentence belongs in the model card, not in a footnote.
- **Monitoring has to watch inputs, not just outputs.** A drop in alert volume is the first symptom, and it looks identical to a quiet network.
- **Retraining is a distribution question.** Adding a dataset to training helps only if the feature contract is shared, which is why the extractor lives in one module.

## What I would do next

1. **Align features, not columns.** Write a per-dataset adapter that maps each source onto the shared 23-feature contract, with a test per adapter.
2. **Report per-dataset recall at a fixed false-positive budget.** A single F1 hides the shape of the failure.
3. **Add an out-of-distribution score.** A density estimate over the feature vector would let the platform say "this looks unlike anything I was trained on" instead of silently predicting benign.

## What this note is not

This is not a research finding about intrusion detection in general. It is a record of one measured result on one model, published so the number can be reproduced and challenged. The evaluation code and the recorded metrics are in the repository.`,
    evidence: [
      { label: "NDR platform", href: repo("Network-Intrusion-Detection-Advanced-MLOps") },
      {
        label: "Model card",
        href: `${repo("Network-Intrusion-Detection-Advanced-MLOps")}/blob/main/reports/zeek_model/model_card.md`,
      },
      { label: "Run the operating-point lab", href: "/labs/network-intrusion-detection/" },
    ],
  },
  {
    slug: "quality-gate-rejected-retrain",
    kind: "research",
    title: "A quality gate that rejected its own retrain",
    summary:
      "The recorded medical imaging retrain reached 0.867 accuracy and 0.830 weighted F1, then was rejected because tuberculosis recall fell to 0.236. This is the arithmetic behind that decision.",
    category: "MLOps",
    date: "2026-01-09",
    readingMinutes: 6,
    tags: ["MLOps", "model registry", "evaluation", "medical imaging"],
    body: `## The situation

A retraining run finished. Accuracy was 0.867. Weighted F1 was 0.830. On a dashboard that shows two numbers, the run looks like a success.

It was not promoted.

## The number that decided it

The evaluation set holds 630 images: 520 normal, 110 tuberculosis. The candidate caught 26 of the 110 positive cases. Recall on the positive class: **0.236**.

The gate's floor is 0.80. The candidate missed it by a wide margin, so the gate rejected the promotion and kept the registered baseline.

## Why accuracy hid the failure

With 82.5% of the test set in the negative class, a model that predicts "normal" for everything scores 0.825 accuracy. The candidate's 0.867 is better than that, which is exactly the trap: aggregate accuracy is dominated by the majority class, and the minority class is the one with clinical consequences.

Weighted F1 does not save you either. It weights each class by its support, so 520 correctly classified normals can outvote 84 missed cases.

## The gate, in words

The gate is not clever. It checks, in order:

- Is positive-class recall at or above the floor (0.80)?
- Did accuracy drop by more than the allowed delta against the baseline?
- Did weighted F1 regress?

A candidate that fails any check is rejected with a reason attached. The reason is stored with the run so the next person does not have to guess why the registry did not move.

## Why this is the interesting part of the project

Most MLOps demonstrations show a pipeline promoting a better model. The promotion path is the easy half: it is plumbing. The hard half is the refusal, because a refusal requires the team to have decided in advance which metric matters and what its floor is.

That decision is the engineering. Everything else is YAML.

## Limits of this result

- 110 positive images is a small evaluation set; a confidence interval on 26/110 is wide.
- The 0.80 floor is an engineering demo threshold, not a clinical standard.
- A rejected candidate is not a failed pipeline run. It is the pipeline working.

The lab below replays the arithmetic so the numbers can be checked without reading the repository.`,
    evidence: [
      { label: "Medical imaging MLOps", href: repo("Medical-imaging-MLOps") },
      {
        label: "Quality gate source",
        href: `${repo("Medical-imaging-MLOps")}/blob/main/src/automation/model_quality_gate.py`,
      },
      { label: "Run the gate lab", href: "/labs/medical-imaging-mlops/" },
    ],
  },
  {
    slug: "measuring-latency-in-detection",
    kind: "research",
    title: "Measuring inference latency instead of estimating it",
    summary:
      "The NDR API reports p50 2.23 ms and p95 2.92 ms over 2,000 flows. This note covers how those numbers were produced, what they exclude, and why a p95 without a percentile method is marketing.",
    category: "Performance",
    date: "2025-12-14",
    readingMinutes: 5,
    tags: ["latency", "FastAPI", "benchmarking", "observability"],
    body: `## Why measure at all

"Fast inference" is a claim. A percentile is a measurement. The difference matters because latency is the number an analyst feels when a dashboard lags behind the wire.

## Method

The benchmark scores 2,000 flows through the same predictor the API uses, on the same machine, in one process. Per-flow wall time is recorded around the scoring call only. Feature extraction is measured separately because it has a different cost profile.

From that sample:

- **p50: 2.23 ms** — the typical flow
- **p95: 2.92 ms** — the slow tail a user actually notices
- **throughput: 432 flows/s** single-process

## What these numbers exclude

- **Network time.** They are server-side, before the response leaves the process.
- **Feature extraction.** Parsing and the 23-feature transform are excluded deliberately, because mixing them into "inference" makes the number impossible to compare with anything.
- **Concurrency.** Single-process, sequential. Under load, queueing dominates and the percentile moves.
- **Cold start.** Model load is measured once at boot, not per request.

## Why the dashboard shows latency at all

The platform stores a measured inference latency with every event. If the p95 on the dashboard drifts from the benchmark, something changed: a bigger model, a slower disk, a database lock. That is the point of publishing the baseline. It turns a vague sense that things are slower into a comparison.

## The honesty rule

Replay data is tagged. If the sensor is fed from a file rather than a live interface, the dashboard says so, because latency measured on replay is not latency measured on the wire.

That is the same rule as the zero-recall probe: publish the condition next to the number, or the number will be read as something it is not.`,
    evidence: [
      {
        label: "Serving layer",
        href: `${repo("Network-Intrusion-Detection-Advanced-MLOps")}/tree/main/src/serving`,
      },
      {
        label: "Recorded validation",
        href: `${repo("Network-Intrusion-Detection-Advanced-MLOps")}/blob/main/reports/serving_validation.json`,
      },
    ],
  },
  {
    slug: "what-a-statevector-simulator-hides",
    kind: "research",
    title: "What an exact statevector simulator hides",
    summary:
      "The quantum lab computes amplitudes exactly, which is both its strength and its blind spot. A note on what a noise-free simulation can and cannot tell you before you spend time on hardware.",
    category: "Quantum computing",
    date: "2025-11-22",
    readingMinutes: 6,
    tags: ["quantum", "Qiskit", "simulation", "education"],
    body: `## The appeal of exactness

A statevector simulator multiplies complex vectors by 2x2 matrices. No sampling, no noise, no queue. If the mathematics says the amplitudes are 0.7071 and 0.7071, the simulator shows exactly that, and a Bell state looks perfect.

That is useful for learning and useless for predicting hardware behaviour.

## What it hides

- **Gate error.** Real two-qubit gates have error rates orders of magnitude above single-qubit gates. A circuit with 20 CNOTs on today's hardware is a different circuit.
- **Decoherence.** Amplitudes decay with time, and deep circuits take longer than coherence allows.
- **Readout error.** Measurement itself is a noisy classical process; a measured 0 and a prepared 0 are not the same event.
- **Connectivity.** Hardware only applies two-qubit gates between physical neighbours, so a circuit gets mapped and swapped, adding depth.

## Why the lab still shows exact numbers

Because the alternative is worse. A simulated noise model that does not match the device teaches a false intuition with extra steps. The lab states plainly: this is exact linear algebra, there is no noise model, and hardware counts will differ.

Where exactness helps is checking understanding. If you build a circuit and the amplitudes disagree with your prediction, one of the two is wrong, and the simulator is not the one with the bug.

## The bridge to hardware

The honest path from simulation to hardware is:

1. Predict the outcome analytically.
2. Confirm it on a simulator.
3. Run it on hardware with a transpiled circuit and read the counts.
4. Compare the counts to the prediction and attribute the difference to error, not to mystery.

Step 4 is where most tutorials stop, which is why most tutorials leave people confused about why their Bell state comes back 0.85/0.15 instead of 0.5/0.5.

## Related work

The Qiskit repositories linked below implement the same circuits for real: Shor, Grover, phase estimation, teleportation, superdense coding and quantum kernels. They are notebooks, not claims. Open one and run it.`,
    evidence: [
      { label: "Quantum lab", href: "/quantum-lab/" },
      { label: "Shor's algorithm", href: repo("Shor-s-Algorithm") },
      { label: "Grover's search", href: repo("Grover_Algorithm") },
    ],
  },
];
