export type LabPage = {
  slug: "network-intrusion-detection" | "medical-imaging-mlops" | "gpt2-clone";
  project: string;
  title: string;
  summary: string;
  measures: string;
};

export const labPages: LabPage[] = [
  {
    slug: "network-intrusion-detection",
    project: "Network Intrusion Detection",
    title: "Operating point explorer",
    summary:
      "Move the alert threshold and watch recall trade against analyst workload, using the published held-out metrics over 44,734 flows.",
    measures: "F1 0.973 at threshold 0.95",
  },
  {
    slug: "medical-imaging-mlops",
    project: "Medical Imaging MLOps",
    title: "Quality gate arithmetic",
    summary:
      "Replay the promotion decision for a retrain that reached 0.867 accuracy but only 0.236 recall on tuberculosis, and see why the gate refused it.",
    measures: "Recall floor 0.236 vs baseline",
  },
  {
    slug: "gpt2-clone",
    project: "GPT-2 Clone",
    title: "Byte-level BPE tokenizer",
    summary:
      "Run the merge loop one step at a time and watch a byte-level vocabulary form, with the token ids the model would actually see.",
    measures: "50,257-token GPT-2 vocabulary",
  },
];
