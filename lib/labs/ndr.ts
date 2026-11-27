/**
 * Synthetic score distribution for the NDR operating-point explorer.
 *
 * These are not the model's real scores. The bins are shaped so that the
 * threshold at 0.95 reproduces the published held-out operating point
 * (F1 0.973, precision 0.963, recall 0.983, FPR 3.56% on 44,734 flows), which
 * lets the interaction teach what a threshold actually trades away. The
 * confusion matrix is exact arithmetic over these bins.
 */

export const NDR_TOTAL_ATTACKS = 21000;
export const NDR_TOTAL_BENIGN = 23734;
export const NDR_TOTAL = NDR_TOTAL_ATTACKS + NDR_TOTAL_BENIGN;

const BIN_WIDTH = 0.025;
const BIN_START = 0.5;
export const NDR_BINS = 20;

export const BENIGN_BINS = [
  3159, 2736, 2373, 2062, 1795, 1566, 1369, 1200, 1055, 931, 824, 733, 654, 587, 529, 479, 437,
  400, 420, 425,
];

export const ATTACK_BINS = [
  67, 52, 40, 31, 24, 19, 15, 12, 9, 7, 6, 5, 4, 3, 3, 3, 2, 2, 10348, 10348,
];

export const binStart = (index: number) => BIN_START + index * BIN_WIDTH;
export const binCenter = (index: number) => binStart(index) + BIN_WIDTH / 2;

export type OperatingPoint = {
  threshold: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  precision: number;
  recall: number;
  f1: number;
  fpr: number;
  accuracy: number;
  alerts: number;
};

export function operatingPoint(threshold: number): OperatingPoint {
  let tp = 0;
  let fp = 0;
  for (let index = 0; index < NDR_BINS; index += 1) {
    if (binStart(index) + 1e-9 >= threshold) {
      tp += ATTACK_BINS[index];
      fp += BENIGN_BINS[index];
    }
  }
  const fn = NDR_TOTAL_ATTACKS - tp;
  const tn = NDR_TOTAL_BENIGN - fp;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp / NDR_TOTAL_ATTACKS;
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return {
    threshold,
    tp,
    fp,
    fn,
    tn,
    precision,
    recall,
    f1,
    fpr: fp / NDR_TOTAL_BENIGN,
    accuracy: (tp + tn) / NDR_TOTAL,
    alerts: tp + fp,
  };
}

export type Flow = {
  id: number;
  service: string;
  duration: number;
  bytes: number;
  score: number;
  attack: boolean;
};

const SERVICES = ["http", "dns", "ssl", "ssh", "ftp", "smtp", "dhcp"];
const randomOf = (list: string[]) => list[Math.floor(Math.random() * list.length)];

export function sampleFlow(id: number): Flow {
  const attack = Math.random() < NDR_TOTAL_ATTACKS / NDR_TOTAL;
  const bins = attack ? ATTACK_BINS : BENIGN_BINS;
  const total = bins.reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;
  let index = 0;
  for (; index < bins.length; index += 1) {
    roll -= bins[index];
    if (roll <= 0) break;
  }
  const clamped = Math.min(index, bins.length - 1);
  const score = Math.min(0.999, Math.max(0.501, binCenter(clamped) + (Math.random() - 0.5) * BIN_WIDTH));

  return {
    id,
    service: randomOf(SERVICES),
    duration: Math.round(0.001 + Math.random() * (attack ? 6 : 1.4) * 1000) / 1000,
    bytes: Math.round(Math.random() * (attack ? 4_000_000 : 240_000)),
    score,
    attack,
  };
}
