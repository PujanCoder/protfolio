/**
 * Deterministic synthetic dataset for the playground.
 *
 * These rows are generated, not captured. They exist so the modelling code in
 * the browser has something reproducible to train on. They are shaped like
 * connection records so the vocabulary is familiar, but they are not traffic
 * and they are not from any of the real datasets used by the NDR platform.
 */

export type PlaygroundRow = {
  id: number;
  duration: number;
  bytesOut: number;
  packets: number;
  failedConns: number;
  distinctPorts: number;
  label: 0 | 1;
};

export const featureKeys = [
  "duration",
  "bytesOut",
  "packets",
  "failedConns",
  "distinctPorts",
] as const;

export type FeatureKey = (typeof featureKeys)[number];

export const featureMeta: Record<FeatureKey, { label: string; unit: string; note: string }> = {
  duration: { label: "Duration", unit: "s", note: "How long the connection stayed open" },
  bytesOut: { label: "Bytes out", unit: "KB", note: "Payload sent by the client" },
  packets: { label: "Packets", unit: "count", note: "Packets in the connection" },
  failedConns: { label: "Failed connections", unit: "count", note: "Refused or reset attempts" },
  distinctPorts: { label: "Distinct ports", unit: "count", note: "Unique destination ports touched" },
};

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random: () => number) {
  const u = Math.max(random(), 1e-9);
  const v = Math.max(random(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function build(seed: number, label: 0 | 1, count: number): PlaygroundRow[] {
  const random = mulberry32(seed);
  const rows: PlaygroundRow[] = [];
  for (let index = 0; index < count; index += 1) {
    const hostile = label === 1;
    const duration = Math.max(0.01, (hostile ? 1.4 : 6.5) * Math.exp(0.8 * normal(random)));
    const bytesOut = Math.max(0.2, (hostile ? 2.4 : 18) * Math.exp(0.9 * normal(random)));
    const packets = Math.max(1, Math.round((hostile ? 6 : 22) * Math.exp(0.6 * normal(random))));
    const failedConns = Math.max(0, Math.round((hostile ? 5.5 : 0.6) + 2.4 * normal(random)));
    const distinctPorts = Math.max(1, Math.round((hostile ? 11 : 2.2) + 3 * normal(random)));
    rows.push({
      id: index,
      duration: Math.round(duration * 100) / 100,
      bytesOut: Math.round(bytesOut * 10) / 10,
      packets,
      failedConns,
      distinctPorts,
      label,
    });
  }
  return rows;
}

const benign = build(20260227, 0, 110).map((row) => ({ ...row, id: row.id }));
const suspicious = build(7, 1, 90).map((row) => ({ ...row, id: row.id + 110 }));

export const playgroundDataset: PlaygroundRow[] = [...benign, ...suspicious];

export const datasetMeta = {
  rows: playgroundDataset.length,
  positives: suspicious.length,
  negatives: benign.length,
  note: "Generated with a fixed seed from two overlapping distributions. Not captured traffic.",
};

/** Deterministic split so every visitor trains and tests on the same rows. */
export function splitDataset(rows: PlaygroundRow[], trainRatio = 0.7) {
  const random = mulberry32(99);
  const shuffled = rows.slice();
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const cutoff = Math.floor(shuffled.length * trainRatio);
  return { train: shuffled.slice(0, cutoff), test: shuffled.slice(cutoff) };
}
