/**
 * A small, exact statevector simulator for educational use.
 *
 * Qubit 0 is the most significant bit, so a measured bitstring reads
 * q0 q1 ... q(n-1), matching how Qiskit prints counts.
 * Everything here is pure and synchronous so it can be unit tested.
 */

export type Complex = { re: number; im: number };

export type GateName =
  | "h"
  | "x"
  | "y"
  | "z"
  | "s"
  | "sdg"
  | "t"
  | "tdg"
  | "rx"
  | "ry"
  | "rz";

export type Operation =
  | { gate: GateName; target: number; angle?: number }
  | { gate: "cx"; control: number; target: number };

export type Statevector = Complex[];

export const c = (re: number, im = 0): Complex => ({ re, im });

export const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const scale = (a: Complex, k: number): Complex => ({
  re: a.re * k,
  im: a.im * k,
});

export const conj = (a: Complex): Complex => ({ re: a.re, im: -a.im });

export const abs2 = (a: Complex): number => a.re * a.re + a.im * a.im;

export const magnitude = (a: Complex): number => Math.sqrt(abs2(a));

export function createState(qubits: number, index = 0): Statevector {
  const size = 2 ** qubits;
  return Array.from({ length: size }, (_, i) => (i === index ? c(1) : c(0)));
}

export function normalize(state: Statevector): Statevector {
  const norm = Math.sqrt(state.reduce((sum, amp) => sum + abs2(amp), 0));
  if (norm === 0) return state;
  return state.map((amp) => scale(amp, 1 / norm));
}

const SQRT1_2 = Math.SQRT1_2;

function gateMatrix(op: Operation): Complex[][] {
  switch (op.gate) {
    case "h":
      return [
        [c(SQRT1_2), c(SQRT1_2)],
        [c(SQRT1_2), c(-SQRT1_2)],
      ];
    case "x":
      return [
        [c(0), c(1)],
        [c(1), c(0)],
      ];
    case "y":
      return [
        [c(0), c(0, -1)],
        [c(0, 1), c(0)],
      ];
    case "z":
      return [
        [c(1), c(0)],
        [c(0), c(-1)],
      ];
    case "s":
      return [
        [c(1), c(0)],
        [c(0), c(0, 1)],
      ];
    case "sdg":
      return [
        [c(1), c(0)],
        [c(0), c(0, -1)],
      ];
    case "t":
      return [
        [c(1), c(0)],
        [c(0), c(Math.SQRT1_2, Math.SQRT1_2)],
      ];
    case "tdg":
      return [
        [c(1), c(0)],
        [c(0), c(Math.SQRT1_2, -Math.SQRT1_2)],
      ];
    case "rx": {
      const theta = op.angle ?? 0;
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [
        [c(cos), c(0, -sin)],
        [c(0, -sin), c(cos)],
      ];
    }
    case "ry": {
      const theta = op.angle ?? 0;
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [
        [c(cos), c(-sin)],
        [c(sin), c(cos)],
      ];
    }
    case "rz": {
      const theta = op.angle ?? 0;
      return [
        [c(Math.cos(-theta / 2), Math.sin(-theta / 2)), c(0)],
        [c(0), c(Math.cos(theta / 2), Math.sin(theta / 2))],
      ];
    }
    default:
      throw new Error(`Unsupported gate: ${op.gate}`);
  }
}

const bitMask = (qubits: number, qubit: number) => 2 ** (qubits - 1 - qubit);
const hasBit = (index: number, mask: number) => (index & mask) !== 0;

export function applyOperation(
  state: Statevector,
  op: Operation,
  qubits: number,
): Statevector {
  const next = state.map((amp) => ({ ...amp }));

  if (op.gate === "cx") {
    const controlMask = bitMask(qubits, op.control);
    const targetMask = bitMask(qubits, op.target);
    for (let i = 0; i < next.length; i += 1) {
      if (!hasBit(i, controlMask) || hasBit(i, targetMask)) continue;
      const j = i | targetMask;
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
    }
    return next;
  }

  const mask = bitMask(qubits, op.target);
  const matrix = gateMatrix(op);
  for (let i = 0; i < next.length; i += 1) {
    if (hasBit(i, mask)) continue;
    const j = i | mask;
    const a0 = state[i];
    const a1 = state[j];
    next[i] = add(mul(matrix[0][0], a0), mul(matrix[0][1], a1));
    next[j] = add(mul(matrix[1][0], a0), mul(matrix[1][1], a1));
  }
  return next;
}

export function applyCircuit(
  operations: Operation[],
  qubits: number,
  initialIndex = 0,
): Statevector {
  return operations.reduce(
    (state, op) => applyOperation(state, op, qubits),
    createState(qubits, initialIndex),
  );
}

export function probabilities(state: Statevector): number[] {
  const total = state.reduce((sum, amp) => sum + abs2(amp), 0) || 1;
  return state.map((amp) => abs2(amp) / total);
}

export function basisLabel(qubits: number, index: number): string {
  return index.toString(2).padStart(qubits, "0");
}

/**
 * Reduced Bloch vector for one qubit, computed from the partial trace.
 * Returns a unit-length vector for pure single-qubit states and a shorter
 * vector for entangled qubits, which is the physically meaningful result.
 */
export function blochVector(
  state: Statevector,
  qubits: number,
  qubit: number,
): [number, number, number] {
  const mask = bitMask(qubits, qubit);
  let rho00 = 0;
  let rho11 = 0;
  let rho01: Complex = c(0);

  for (let i = 0; i < state.length; i += 1) {
    if (hasBit(i, mask)) {
      rho11 += abs2(state[i]);
    } else {
      rho00 += abs2(state[i]);
      rho01 = add(rho01, mul(state[i], conj(state[i | mask])));
    }
  }

  const x = 2 * rho01.re;
  const y = -2 * rho01.im;
  const z = rho00 - rho11;
  return [x, y, z];
}

export type Counts = Record<string, number>;

export function sampleCounts(
  state: Statevector,
  qubits: number,
  shots: number,
  random: () => number = Math.random,
): Counts {
  const probs = probabilities(state);
  const cumulative: number[] = [];
  let running = 0;
  for (const p of probs) {
    running += p;
    cumulative.push(running);
  }

  const counts: Counts = {};
  for (let shot = 0; shot < shots; shot += 1) {
    const r = random();
    let index = cumulative.findIndex((value) => r <= value);
    if (index === -1) index = probs.length - 1;
    const label = basisLabel(qubits, index);
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}

export function stateToAmplitudes(state: Statevector, qubits: number) {
  return state.map((amp, index) => ({
    label: `|${basisLabel(qubits, index)}⟩`,
    re: amp.re,
    im: amp.im,
    probability: abs2(amp),
  }));
}
