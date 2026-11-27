import { describe, expect, it } from "vitest";
import { applyCircuit, basisLabel, blochVector, createState, probabilities } from "@/lib/quantum/statevector";

const close = (a: number, b: number, tolerance = 1e-9) => Math.abs(a - b) < tolerance;

describe("statevector simulator", () => {
  it("normalises the initial state", () => {
    const state = createState(2);
    expect(probabilities(state).reduce((sum, p) => sum + p, 0)).toBeCloseTo(1, 12);
  });

  it("builds a Bell state from H then CNOT", () => {
    const state = applyCircuit(
      [
        { gate: "h", target: 0 },
        { gate: "cx", control: 0, target: 1 },
      ],
      2,
    );
    const probs = probabilities(state);
    expect(probs[0]).toBeCloseTo(0.5, 12);
    expect(probs[3]).toBeCloseTo(0.5, 12);
    expect(probs[1]).toBeCloseTo(0, 12);
    expect(probs[2]).toBeCloseTo(0, 12);
    expect(basisLabel(2, 0)).toBe("00");
    expect(basisLabel(2, 3)).toBe("11");
  });

  it("points a |0> qubit at the north pole of the Bloch sphere", () => {
    const [x, y, z] = blochVector(createState(1), 1, 0);
    expect(close(x, 0)).toBe(true);
    expect(close(y, 0)).toBe(true);
    expect(close(z, 1)).toBe(true);
  });

  it("points a |1> qubit at the south pole", () => {
    const state = applyCircuit([{ gate: "x", target: 0 }], 1);
    const [, , z] = blochVector(state, 1, 0);
    expect(z).toBeCloseTo(-1, 12);
  });
});
