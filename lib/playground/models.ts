import type { FeatureKey, PlaygroundRow } from "@/lib/playground/dataset";

export type Stats = { mean: number[]; std: number[] };

export function fitStats(rows: PlaygroundRow[], keys: FeatureKey[]): Stats {
  const mean = keys.map(
    (key) => rows.reduce((total, row) => total + row[key], 0) / Math.max(rows.length, 1),
  );
  const std = keys.map((key, index) => {
    const variance =
      rows.reduce((total, row) => total + (row[key] - mean[index]) ** 2, 0) / Math.max(rows.length, 1);
    return Math.sqrt(variance) || 1;
  });
  return { mean, std };
}

export function vectorize(row: PlaygroundRow, keys: FeatureKey[], stats: Stats) {
  return keys.map((key, index) => (row[key] - stats.mean[index]) / stats.std[index]);
}

export type LogisticModel = { weights: number[]; bias: number; keys: FeatureKey[]; stats: Stats };

const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));

export function trainLogistic(
  rows: PlaygroundRow[],
  keys: FeatureKey[],
  { epochs = 400, lr = 0.35, l2 = 0.001 } = {},
): LogisticModel {
  const stats = fitStats(rows, keys);
  const X = rows.map((row) => vectorize(row, keys, stats));
  const y = rows.map((row) => row.label);
  const weights = new Array(keys.length).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    const gradW = new Array(keys.length).fill(0);
    let gradB = 0;
    for (let index = 0; index < X.length; index += 1) {
      let score = bias;
      for (let feature = 0; feature < weights.length; feature += 1) {
        score += weights[feature] * X[index][feature];
      }
      const error = sigmoid(score) - y[index];
      for (let feature = 0; feature < weights.length; feature += 1) {
        gradW[feature] += error * X[index][feature];
      }
      gradB += error;
    }
    for (let feature = 0; feature < weights.length; feature += 1) {
      weights[feature] -= (lr * (gradW[feature] / X.length + l2 * weights[feature]));
    }
    bias -= (lr * gradB) / X.length;
  }

  return { weights, bias, keys, stats };
}

export function logisticProbability(model: LogisticModel, row: PlaygroundRow) {
  const vector = vectorize(row, model.keys, model.stats);
  let score = model.bias;
  for (let index = 0; index < model.weights.length; index += 1) {
    score += model.weights[index] * vector[index];
  }
  return sigmoid(score);
}

export type KnnModel = { X: number[][]; y: number[]; keys: FeatureKey[]; stats: Stats; k: number };

export function trainKnn(rows: PlaygroundRow[], keys: FeatureKey[], k = 5): KnnModel {
  const stats = fitStats(rows, keys);
  return {
    X: rows.map((row) => vectorize(row, keys, stats)),
    y: rows.map((row) => row.label),
    keys,
    stats,
    k,
  };
}

export function knnProbability(model: KnnModel, row: PlaygroundRow) {
  const vector = vectorize(row, model.keys, model.stats);
  const distances = model.X.map((other, index) => {
    let total = 0;
    for (let feature = 0; feature < vector.length; feature += 1) {
      total += (vector[feature] - other[feature]) ** 2;
    }
    return { distance: Math.sqrt(total), label: model.y[index] };
  });
  distances.sort((a, b) => a.distance - b.distance);
  const neighbours = distances.slice(0, model.k);
  const positives = neighbours.filter((neighbour) => neighbour.label === 1).length;
  return positives / Math.max(neighbours.length, 1);
}

export type StumpModel = { key: FeatureKey; threshold: number; positiveAbove: boolean };

export function trainStump(rows: PlaygroundRow[], keys: FeatureKey[]): StumpModel {
  let best: StumpModel = { key: keys[0], threshold: 0, positiveAbove: true };
  let bestScore = -1;

  for (const key of keys) {
    const values = rows.map((row) => row[key]).sort((a, b) => a - b);
    const candidates = Array.from(
      new Set(
        Array.from({ length: 12 }, (_, index) => {
          const position = Math.floor((index + 1) * (values.length / 13));
          return values[Math.min(position, values.length - 1)];
        }),
      ),
    );
    for (const threshold of candidates) {
      for (const positiveAbove of [true, false]) {
        let correct = 0;
        for (const row of rows) {
          const above = row[key] > threshold;
          const prediction = above === positiveAbove ? 1 : 0;
          if (prediction === row.label) correct += 1;
        }
        const score = correct / rows.length;
        if (score > bestScore) {
          bestScore = score;
          best = { key, threshold, positiveAbove };
        }
      }
    }
  }
  return best;
}

export function stumpProbability(model: StumpModel, row: PlaygroundRow) {
  const above = row[model.key] > model.threshold;
  const positive = above === model.positiveAbove;
  return positive ? 0.85 : 0.15;
}

export type Metrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
};

export function evaluate(predictions: { probability: number; actual: number }[], threshold = 0.5): Metrics {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  for (const item of predictions) {
    const predicted = item.probability >= threshold ? 1 : 0;
    if (predicted === 1 && item.actual === 1) tp += 1;
    else if (predicted === 1 && item.actual === 0) fp += 1;
    else if (predicted === 0 && item.actual === 0) tn += 1;
    else fn += 1;
  }
  const total = tp + fp + tn + fn || 1;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  return {
    accuracy: (tp + tn) / total,
    precision,
    recall,
    f1: precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall),
    tp,
    fp,
    tn,
    fn,
  };
}

/** Permutation importance: how much accuracy drops when a feature is shuffled. */
export function permutationImportance(
  rows: PlaygroundRow[],
  keys: FeatureKey[],
  score: (rows: PlaygroundRow[], keys: FeatureKey[]) => number,
): { key: FeatureKey; drop: number }[] {
  const baseline = score(rows, keys);
  return keys
    .map((key, index) => {
      const shuffled = rows.map((row, position) => {
        const donor = rows[(position * 7 + 13) % rows.length];
        return { ...row, [key]: donor[key] } as PlaygroundRow;
      });
      const dropped = baseline - score(shuffled, keys);
      return { key: keys[index], drop: dropped };
    })
    .sort((a, b) => b.drop - a.drop);
}

/** Generic logistic regression for matrices the data-science playground builds itself. */
export function trainMatrix(
  X: number[][],
  y: number[],
  { epochs = 500, lr = 0.4, l2 = 0.001 } = {},
) {
  const width = X[0]?.length ?? 0;
  const weights = new Array(width).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    const gradW = new Array(width).fill(0);
    let gradB = 0;
    for (let row = 0; row < X.length; row += 1) {
      let score = bias;
      for (let column = 0; column < width; column += 1) {
        score += weights[column] * X[row][column];
      }
      const error = sigmoid(score) - y[row];
      for (let column = 0; column < width; column += 1) {
        gradW[column] += error * X[row][column];
      }
      gradB += error;
    }
    for (let column = 0; column < width; column += 1) {
      weights[column] -= (lr * (gradW[column] / X.length + l2 * weights[column]));
    }
    bias -= (lr * gradB) / X.length;
  }

  return { weights, bias };
}

export function predictMatrix(model: { weights: number[]; bias: number }, row: number[]) {
  let score = model.bias;
  for (let index = 0; index < model.weights.length; index += 1) {
    score += model.weights[index] * row[index];
  }
  return sigmoid(score);
}
