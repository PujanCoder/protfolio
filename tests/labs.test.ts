import { describe, expect, it } from "vitest";
import { CORPUS, decode, encode, trainBpe } from "@/lib/labs/bpe";
import { NDR_TOTAL, NDR_TOTAL_ATTACKS, NDR_TOTAL_BENIGN, operatingPoint } from "@/lib/labs/ndr";
import { NORMAL_IMAGES, RECALL_FLOOR, TB_POSITIVES, TOTAL_IMAGES, gateAt } from "@/lib/labs/medical";

describe("byte-level BPE", () => {
  it("round-trips arbitrary text through encode and decode", () => {
    const merges = trainBpe(CORPUS, 40);
    const text = "Zeek conn.log → flows: 44,734. Naïve façade? ✓";
    expect(decode(encode(text, merges))).toBe(text);
  });

  it("learns merges that shrink the token count", () => {
    const merges = trainBpe(CORPUS, 60);
    const text = "Machine learning systems fail in the seams between components.";
    expect(encode(text, merges).length).toBeLessThan(encode(text, []).length);
  });
});

describe("intrusion detection operating point", () => {
  it("keeps the confusion matrix consistent with the dataset totals", () => {
    const point = operatingPoint(0.95);
    expect(point.tp + point.fn).toBe(NDR_TOTAL_ATTACKS);
    expect(point.fp + point.tn).toBe(NDR_TOTAL_BENIGN);
    expect(NDR_TOTAL).toBe(44734);
  });

  it("reproduces the published best threshold metrics", () => {
    const point = operatingPoint(0.95);
    expect(point.precision).toBeCloseTo(0.9608, 3);
    expect(point.recall).toBeCloseTo(0.9855, 3);
    expect(point.f1).toBeCloseTo(0.973, 3);
    expect(point.fpr).toBeLessThan(0.04);
  });

  it("trades recall for precision as the threshold rises", () => {
    const low = operatingPoint(0.2);
    const high = operatingPoint(0.8);
    expect(high.recall).toBeLessThanOrEqual(low.recall);
    expect(high.precision).toBeGreaterThanOrEqual(low.precision);
  });
});

describe("medical retrain quality gate", () => {
  it("reproduces the published rejected retrain", () => {
    const gate = gateAt(0.95);
    expect(gate.tp).toBe(26);
    expect(gate.recall).toBeCloseTo(26 / TB_POSITIVES, 6);
    expect(gate.tp + gate.tn).toBe(546);
    expect(gate.accuracy).toBeCloseTo(546 / TOTAL_IMAGES, 6);
    expect(gate.passesGate).toBe(false);
  });

  it("only passes the gate when sensitivity clears the floor", () => {
    const permissive = gateAt(0.9);
    expect(permissive.passesGate).toBe(permissive.recall >= RECALL_FLOOR);
    expect(gateAt(0.2).recall).toBeGreaterThanOrEqual(gateAt(0.95).recall);
  });

  it("keeps class totals intact at every threshold", () => {
    const gate = gateAt(0.3);
    expect(gate.tp + gate.fn).toBe(TB_POSITIVES);
    expect(gate.fp + gate.tn).toBe(NORMAL_IMAGES);
  });
});
