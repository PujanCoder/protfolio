import type { GateName, Operation } from "./statevector";

export type GateMeta = {
  name: GateName;
  label: string;
  title: string;
  blurb: string;
  matrix: string[][];
  param?: { min: number; max: number; step: number; default: number; unit: string };
};

export const GATES: GateMeta[] = [
  {
    name: "h",
    label: "H",
    title: "Hadamard",
    blurb: "Creates an equal superposition: |0⟩ becomes (|0⟩ + |1⟩)/√2.",
    matrix: [
      ["1/√2", "1/√2"],
      ["1/√2", "−1/√2"],
    ],
  },
  {
    name: "x",
    label: "X",
    title: "Pauli-X",
    blurb: "The bit flip. Swaps the amplitudes of |0⟩ and |1⟩.",
    matrix: [
      ["0", "1"],
      ["1", "0"],
    ],
  },
  {
    name: "y",
    label: "Y",
    title: "Pauli-Y",
    blurb: "Bit flip with a phase twist: rotation by π around the y axis.",
    matrix: [
      ["0", "−i"],
      ["i", "0"],
    ],
  },
  {
    name: "z",
    label: "Z",
    title: "Pauli-Z",
    blurb: "Phase flip. Leaves |0⟩ alone and multiplies |1⟩ by −1.",
    matrix: [
      ["1", "0"],
      ["0", "−1"],
    ],
  },
  {
    name: "s",
    label: "S",
    title: "S (√Z)",
    blurb: "Quarter turn: applies a phase of i to |1⟩.",
    matrix: [
      ["1", "0"],
      ["0", "i"],
    ],
  },
  {
    name: "t",
    label: "T",
    title: "T (√S)",
    blurb: "Eighth turn: applies e^{iπ/4} to |1⟩. The non-Clifford workhorse.",
    matrix: [
      ["1", "0"],
      ["0", "e^{iπ/4}"],
    ],
  },
  {
    name: "rx",
    label: "Rx",
    title: "Rotation around X",
    blurb: "Continuous rotation of the Bloch vector around the x axis.",
    matrix: [
      ["cos(θ/2)", "−i·sin(θ/2)"],
      ["−i·sin(θ/2)", "cos(θ/2)"],
    ],
    param: { min: 0, max: 2 * Math.PI, step: Math.PI / 12, default: Math.PI / 2, unit: "rad" },
  },
  {
    name: "ry",
    label: "Ry",
    title: "Rotation around Y",
    blurb: "Continuous rotation around the y axis; Ry(π) is a bit flip.",
    matrix: [
      ["cos(θ/2)", "−sin(θ/2)"],
      ["sin(θ/2)", "cos(θ/2)"],
    ],
    param: { min: 0, max: 2 * Math.PI, step: Math.PI / 12, default: Math.PI / 2, unit: "rad" },
  },
  {
    name: "rz",
    label: "Rz",
    title: "Rotation around Z",
    blurb: "Rotates the phase only; probabilities stay unchanged.",
    matrix: [
      ["e^{−iθ/2}", "0"],
      ["0", "e^{iθ/2}"],
    ],
    param: { min: 0, max: 2 * Math.PI, step: Math.PI / 12, default: Math.PI / 2, unit: "rad" },
  },
];

export const GATE_BY_NAME = new Map(GATES.map((gate) => [gate.name, gate]));

export type CircuitPreset = {
  id: string;
  title: string;
  blurb: string;
  qubits: number;
  operations: Operation[];
  takeaway: string;
};

export const PRESETS: CircuitPreset[] = [
  {
    id: "superposition",
    title: "Superposition",
    blurb: "One Hadamard on a single qubit.",
    qubits: 1,
    operations: [{ gate: "h", target: 0 }],
    takeaway:
      "The state is not 0 or 1 — it is both, with a definite relative phase. Measure and you still only ever see one bit.",
  },
  {
    id: "bell",
    title: "Bell pair",
    blurb: "H then CNOT — the canonical entangled state.",
    qubits: 2,
    operations: [
      { gate: "h", target: 0 },
      { gate: "cx", control: 0, target: 1 },
    ],
    takeaway:
      "Neither qubit has a definite value, yet the pair is perfectly correlated: 00 and 11 only, never 01 or 10.",
  },
  {
    id: "phase",
    title: "Phase kickback",
    blurb: "H, then S on the same qubit: same probabilities, different state.",
    qubits: 1,
    operations: [
      { gate: "h", target: 0 },
      { gate: "s", target: 0 },
    ],
    takeaway:
      "Measurement statistics cannot see the phase. That is exactly why interference needs gates before the measurement, not after.",
  },
  {
    id: "ghz",
    title: "GHZ state",
    blurb: "Three qubits in a single shared superposition.",
    qubits: 3,
    operations: [
      { gate: "h", target: 0 },
      { gate: "cx", control: 0, target: 1 },
      { gate: "cx", control: 1, target: 2 },
    ],
    takeaway:
      "All three qubits collapse together. GHZ states are the standard test bed for multi-qubit entanglement.",
  },
];

export function qiskitSource(operations: Operation[], qubits: number): string {
  const lines = operations.map((op) => {
    if (op.gate === "cx") {
      return `circuit.cx(${op.control}, ${op.target})`;
    }
    if (op.angle !== undefined && ["rx", "ry", "rz"].includes(op.gate)) {
      return `circuit.${op.gate}(${op.angle.toFixed(4)}, ${op.target})`;
    }
    return `circuit.${op.gate}(${op.target})`;
  });

  return [
    "from qiskit import QuantumCircuit",
    "from qiskit_aer import AerSimulator",
    "",
    `circuit = QuantumCircuit(${qubits}, ${qubits})`,
    ...lines,
    `circuit.measure(range(${qubits}), range(${qubits}))`,
    "",
    "result = AerSimulator().run(circuit, shots=1024).result()",
    "print(result.get_counts())",
  ].join("\n");
}

export function operationLabel(op: Operation): string {
  if (op.gate === "cx") return `CX ${op.control}→${op.target}`;
  const meta = GATE_BY_NAME.get(op.gate);
  const base = meta?.label ?? op.gate.toUpperCase();
  if (op.angle !== undefined && ["rx", "ry", "rz"].includes(op.gate)) {
    return `${base}(${(op.angle / Math.PI).toFixed(2)}π) q${op.target}`;
  }
  return `${base} q${op.target}`;
}
