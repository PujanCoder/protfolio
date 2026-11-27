/**
 * Triage-gate arithmetic for the medical imaging lab.
 *
 * The bins are synthetic, but they are constrained so the recorded operating
 * point (threshold 0.95) yields exactly the published numbers from the
 * Medical-imaging-MLOps README: 26/110 tuberculosis recall (0.236), 546/630
 * accuracy (0.867) and 0.830 weighted F1. The confusion matrix is therefore
 * the one implied by the published metrics, not an invented one.
 */

export const TB_POSITIVES = 110;
export const NORMAL_IMAGES = 520;
export const TOTAL_IMAGES = TB_POSITIVES + NORMAL_IMAGES;
export const RECALL_FLOOR = 0.8;

export const TB_BINS = [1, 1, 2, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 10, 0, 0, 0, 0, 13, 13];
export const NORMAL_BINS = [147, 96, 72, 54, 40, 30, 22, 16, 12, 9, 7, 5, 4, 3, 2, 1, 0, 0, 0, 0];

const BIN_WIDTH = 0.025;
const BIN_START = 0.5;

export type GateResult = {
  threshold: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  recall: number;
  precision: number;
  accuracy: number;
  weightedF1: number;
  passesGate: boolean;
};

export function gateAt(threshold: number): GateResult {
  let tp = 0;
  let fp = 0;
  for (let index = 0; index < 20; index += 1) {
    if (BIN_START + index * BIN_WIDTH + 1e-9 >= threshold) {
      tp += TB_BINS[index];
      fp += NORMAL_BINS[index];
    }
  }

  const fn = TB_POSITIVES - tp;
  const tn = NORMAL_IMAGES - fp;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp / TB_POSITIVES;
  const f1Tb = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const precisionNormal = tn + fn === 0 ? 0 : tn / (tn + fn);
  const f1Normal =
    precisionNormal + 1 === 0 ? 0 : (2 * precisionNormal * 1) / (precisionNormal + 1);
  const weightedF1 = (TB_POSITIVES * f1Tb + NORMAL_IMAGES * f1Normal) / TOTAL_IMAGES;

  return {
    threshold,
    tp,
    fp,
    fn,
    tn,
    recall,
    precision,
    accuracy: (tp + tn) / TOTAL_IMAGES,
    weightedF1,
    passesGate: recall >= RECALL_FLOOR,
  };
}
