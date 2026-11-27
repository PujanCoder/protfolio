import type { Post } from "@/lib/writing/research";

const repo = (name: string) => `https://github.com/PujanCoder/${name}`;

export const blogPosts: Post[] = [
  {
    slug: "gpt2-from-scratch-tensor-shapes",
    kind: "blog",
    title: "Writing GPT-2 from scratch: what the tensor shapes teach you",
    summary:
      "Rebuilding GPT-2 without the transformers library turns an architecture diagram into a list of shape constraints. A walkthrough of the module order and the two mistakes that shape-checking catches.",
    category: "Deep learning",
    date: "2026-02-02",
    readingMinutes: 8,
    tags: ["GPT-2", "PyTorch", "transformers", "attention"],
    body: `## Why rebuild it

You can use a transformer without understanding it. Importing a pretrained model and calling \`generate\` is a legitimate engineering choice, and most of the time it is the right one.

Building it once is still worth doing, because an architecture diagram is a picture and a shape is a constraint. The moment you write the attention block yourself, the diagram stops being optional.

## The module order

GPT-2 small, as implemented:

1. Token embedding, 50,257 x 768, plus a learned position embedding of the same width.
2. Twelve identical blocks. Each block is layer norm, causal self-attention, residual add, layer norm, MLP, residual add.
3. Final layer norm.
4. Language-model head, weight-tied to the token embedding.

The pre-norm ordering matters. Normalising before each sublayer keeps the residual stream clean, which is what lets twelve layers stack without the training instabilities that post-norm transformers hit.

## Shape check one: the head split

Attention projects to 768 dimensions, then reshapes to 12 heads of 64. If you reshape the wrong way, the model still runs. It just attends across a scrambled subspace.

The correct reshape is (batch, seq, 768) to (batch, seq, 12, 64) then transpose to (batch, 12, seq, 64). Transposing before splitting the head dimension silently mixes features across heads. Nothing errors. Accuracy quietly degrades.

That is the single most useful thing a from-scratch implementation teaches: some bugs have no exception.

## Shape check two: the causal mask

A causal mask is an upper-triangular block of negative infinity added to the attention scores before softmax. Two details:

- It must be added before the softmax, not after, or the probabilities will not sum to one.
- It must broadcast over the head dimension, not the batch dimension.

A test that asserts "position 0 cannot attend to position 1" catches both. Without that test, a wrong mask looks like a model that learns slightly worse, which is indistinguishable from a learning-rate problem.

## What is deliberately not finished

The repository ships training and generation entry points as scaffolding. There is no checkpoint, and the README says so. A faithful architecture without training proves structure, not language ability.

The value is in the six pytest modules: attention causality, embedding shapes, the MLP, the transformer block, tokenizer round-trips, and an end-to-end run. Those are the parts that can be verified without a GPU.

## If you want to do the same

Start with the tokenizer. Byte-level BPE is where most of the surprising behaviour lives, because it decides what a "word" is before the model sees a single number. Then attention, then the block, then the head. Write the shape test before the module.`,
    evidence: [
      { label: "GPT-2 clone", href: repo("GPT-2-CLONE") },
      { label: "Attention module", href: `${repo("GPT-2-CLONE")}/blob/main/model/attention.py` },
      { label: "Run the tokenizer lab", href: "/labs/gpt2-clone/" },
    ],
  },
  {
    slug: "the-feature-contract",
    kind: "blog",
    title: "The feature contract that stops training and serving from drifting",
    summary:
      "Most silent ML regressions are not model bugs. They are two copies of a feature transform that stopped agreeing. A short account of the contract test that fails the build instead.",
    category: "MLOps",
    date: "2026-01-25",
    readingMinutes: 5,
    tags: ["feature engineering", "testing", "MLOps", "sklearn"],
    body: `## The failure mode

A notebook computes 23 features. A service computes the same 23 features, written six months later by the same person, in a different file. Both run. Neither errors.

Then the model's precision drops from 0.96 to 0.71 and nobody knows why, because the only visible symptom is a number on a dashboard.

## Why it happens

Feature code is copied, not shared. The copy drifts in small ways:

- A missing value filled with 0 in one place and the column mean in the other.
- A duration in milliseconds in training, seconds in serving.
- One extra column appended at the end, shifting nothing but changing the matrix width.

None of these are exceptions. All of them change the input distribution.

## The fix: one extractor, one test

The NDR platform imports a single extractor module from both the training pipeline and the API. The test asserts that the saved artefact's expected column list equals the extractor's output for a fixture row, in order and with matching dtypes.

\`\`\`python
def test_feature_contract(model_metadata, fixture_flow):
    features = extract_features(fixture_flow)
    assert list(features.keys()) == model_metadata["feature_names"]
    assert len(features) == 23
\`\`\`

If someone reorders the columns or adds a feature without retraining, CI fails. That is the whole trick: make the drift a build error instead of a production mystery.

## What it does not catch

- **Semantic drift.** If the source system starts reporting duration in a different unit, the contract still passes. Only distribution monitoring catches that.
- **Leakage.** A feature computed from the label passes every shape test.
- **Preprocessing drift.** Scaling is fitted on training data; if the serving path refits, the contract holds and the numbers still move.

So the contract is necessary and not sufficient. It removes one class of silent failure, which is the class that happens most often.

## The general principle

Every boundary between a training environment and a serving environment is a place where two copies of the same logic can disagree. Find those boundaries and put an assertion on them. The assertion is cheaper than the incident.`,
    evidence: [
      {
        label: "Contract test",
        href: `${repo("Network-Intrusion-Detection-Advanced-MLOps")}/blob/main/tests/test_feature_contract.py`,
      },
      {
        label: "Serving extractor",
        href: `${repo("Network-Intrusion-Detection-Advanced-MLOps")}/blob/main/src/realtime/features.py`,
      },
    ],
  },
  {
    slug: "reading-a-confusion-matrix",
    kind: "blog",
    title: "Reading a confusion matrix like an engineer",
    summary:
      "Accuracy is a summary. A confusion matrix is a description. A practical walkthrough of the four cells, which one costs money, and how to pick a threshold that matches the cost of being wrong.",
    category: "Evaluation",
    date: "2026-01-12",
    readingMinutes: 6,
    tags: ["evaluation", "metrics", "thresholds"],
    body: `## Four cells, two kinds of mistake

A binary classifier produces four outcomes:

- **True positive** — flagged, and it was real.
- **False positive** — flagged, and it was not. This costs analyst time.
- **False negative** — not flagged, and it was real. This costs an incident.
- **True negative** — not flagged, and it was not. This is the boring majority.

Accuracy collapses all four into one number, which means it treats the two mistakes as equally expensive. They almost never are.

## Precision and recall are cost statements

**Precision** = TP / (TP + FP). Of everything you flagged, how much was real. Low precision means your team is chasing noise.

**Recall** = TP / (TP + FN). Of everything real, how much you caught. Low recall means incidents you never saw.

You cannot maximise both. The threshold is the dial between them, and choosing it is a product decision disguised as a hyperparameter.

## A worked example

The NDR model at threshold 0.95, on 44,734 held-out flows:

- precision 0.963, recall 0.983, F1 0.973, false-positive rate 3.56%.

Drop the threshold to 0.5 and recall climbs toward 1.0 while precision falls and the alert queue fills with benign flows. The model did not change. The operating point did.

That is why the platform fixes the threshold against a false-positive budget instead of maximising accuracy: the budget is a staffing constraint, and the model should respect it.

## The medical version

The chest X-ray pipeline has the opposite cost structure. A missed tuberculosis case is far worse than a false alarm, so the gate enforces a recall floor of 0.80 and will reject a candidate that improves accuracy while missing cases.

A 0.867-accuracy model was rejected at 0.236 positive-class recall. On accuracy alone it looked fine. On the matrix it was dangerous.

## How to choose a threshold

1. Write down the cost of a false positive and a false negative, in whatever units you have (minutes, currency, risk).
2. Sweep the threshold and compute both counts at each point.
3. Pick the point where the marginal cost of one more false positive equals the marginal benefit of one fewer false negative.
4. Write the choice down, because the next person will otherwise re-tune it by feel.

The matrix is not a diagnostic. It is a ledger.`,
    evidence: [
      { label: "NDR operating-point lab", href: "/labs/network-intrusion-detection/" },
      { label: "Medical gate lab", href: "/labs/medical-imaging-mlops/" },
      { label: "Playground confusion matrix", href: "/playground/" },
    ],
  },
  {
    slug: "byte-level-bpe-step-by-step",
    kind: "blog",
    title: "Byte-level BPE, step by step",
    summary:
      "How GPT-2 turns text into 50,257 possible tokens: a regex pre-tokeniser, a reversible byte map, and an ordered merge table applied by rank. Includes the reason tokenisation is not a preprocessing detail.",
    category: "NLP",
    date: "2025-12-30",
    readingMinutes: 7,
    tags: ["tokenization", "BPE", "GPT-2", "NLP"],
    body: `## The problem tokenisation solves

A neural network needs fixed-size integer inputs. Text is a variable-length sequence of unicode code points. Something has to map one to the other, and that something decides what the model can see.

Word-level vocabularies choke on typos and rare words. Character-level vocabularies make sequences long and attention expensive. Byte-level BPE sits between them: common strings become single tokens, rare strings fall back to bytes.

## Step 1: pre-tokenise

GPT-2 splits text with a regex before any merging, roughly: contractions, letter runs, number runs, punctuation runs, and whitespace. Pre-tokenisation prevents merges from crossing word boundaries, so "the cat" never becomes a single token.

## Step 2: map bytes to printable unicode

There are 256 possible bytes, and some of them are unprintable control characters. GPT-2 maps each byte to a printable unicode symbol with a reversible table, so the tokenizer can operate on strings while remaining lossless for arbitrary UTF-8.

That reversibility is the point: decode(encode(text)) == text for any input, including emoji and invalid sequences.

## Step 3: apply merges by rank

The merge table is an ordered list of byte-pair merges learned on a corpus. Encoding a string means:

1. Start with the byte sequence for each pre-token.
2. Find the pair with the lowest merge rank.
3. Merge it. Repeat until no pair has a rank.

The order is the model. "low" and "er" merge into "lower" only if that pair has a rank, and the rank was learned from frequency.

## Why this is not a preprocessing detail

Tokenisation determines:

- **Sequence length**, and therefore attention cost.
- **What counts as a unit of meaning.** " 2026" with a leading space is a different token from "2026".
- **Robustness.** Byte fallback means no input is ever out-of-vocabulary, but a rare word costs many tokens.

A model that is "bad at numbers" is often a tokenizer that splits numbers into inconsistent chunks. The architecture is not at fault; the vocabulary is.

## Try it

The tokenizer lab trains a small merge table in the browser from a fixed corpus, so you can watch the pairs collapse. The repository version ships the real 50,257-token vocabulary and merge table, which is why its token IDs match GPT-2's rather than approximating them.`,
    evidence: [
      { label: "BPE implementation", href: `${repo("GPT-2-CLONE")}/blob/main/tokenizer/bpe.py` },
      { label: "Tokenizer lab", href: "/labs/gpt2-clone/" },
      { label: "NLP playground", href: "/playground/" },
    ],
  },
];
