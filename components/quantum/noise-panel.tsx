"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Waves } from "lucide-react";
import { abs2, applyCircuit, applyOperation, type Statevector } from "@/lib/quantum/statevector";

/** Depolarising channel applied to each qubit after the Bell pair is prepared. */
function applyDepolarising(state: Statevector, qubit: number, rate: number) {
  const gates: ("i" | "x" | "y" | "z")[] = ["i", "x", "y", "z"];
  const branches = gates.map((gate) => {
    const probability = gate === "i" ? 1 - rate : rate / 3;
    const next =
      gate === "i"
        ? state
        : applyOperation(state, { gate, target: qubit }, 2);
    return { probability, state: next };
  });
  return branches;
}

export function NoisePanel() {
  const [rate, setRate] = useState(0.08);

  const bell = useMemo(
    () =>
      applyCircuit(
        [
          { gate: "h", target: 0 },
          { gate: "cx", control: 0, target: 1 },
        ],
        2,
      ),
    [],
  );

  const analysis = useMemo(() => {
    const qubit0 = applyDepolarising(bell, 0, rate);
    const branches: { weight: number; state: Statevector }[] = [];
    for (const a of qubit0) {
      for (const b of applyDepolarising(a.state, 1, rate)) {
        branches.push({ weight: a.probability * b.probability, state: b.state });
      }
    }

    // Fidelity with |Phi+> = (|00> + |11>) / sqrt(2): |<Phi+|psi>|^2 per branch, weighted.
    const fidelity = branches.reduce((total, branch) => {
      const amplitude = (branch.state[0].re + branch.state[3].re) / Math.SQRT2;
      const imaginary = (branch.state[0].im + branch.state[3].im) / Math.SQRT2;
      return total + branch.weight * (amplitude * amplitude + imaginary * imaginary);
    }, 0);

    const mixed = [0, 0, 0, 0];
    for (const branch of branches) {
      for (let index = 0; index < 4; index += 1) {
        mixed[index] += branch.weight * abs2(branch.state[index]);
      }
    }

    const norm = Math.sqrt(mixed.reduce((total, value) => total + value, 0)) || 1;
    // Two-qubit depolarising noise produces a Werner-like state, where C = max(0, 2F - 1).
    const concurrence = Math.max(0, 2 * fidelity - 1);

    return { fidelity, mixed: mixed.map((value) => value / norm), concurrence, branches: branches.length };
  }, [bell, rate]);

  const purity = analysis.mixed.reduce((total, value) => total + value * value, 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mono-label flex items-center gap-1.5">
            <Waves className="h-3 w-3" aria-hidden="true" />
            Noise model
          </p>
          <h3 className="mt-1.5 text-[16px] text-ink">What hardware does to a Bell pair</h3>
        </div>
        <span className="rounded-full border border-line bg-canvas-soft px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
          depolarising · simulated
        </span>
      </div>

      <label className="mt-4 block">
        <span className="flex items-center justify-between text-[11.5px] text-quiet">
          <span>Error rate per qubit</span>
          <span className="font-mono text-forest">{(rate * 100).toFixed(0)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={0.4}
          step={0.01}
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          className="mt-1.5 w-full accent-emerald-600"
        />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Fidelity with Φ⁺", value: analysis.fidelity },
          { label: "Concurrence", value: Math.max(analysis.concurrence, 0) },
          { label: "Purity", value: purity },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-line-soft bg-canvas-soft/70 p-3">
            <p className="font-mono text-[17px] leading-none text-forest">{metric.value.toFixed(3)}</p>
            <p className="mt-1 text-[10.5px] text-quiet">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="mono-label">Measurement distribution</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {analysis.mixed.map((probability, index) => (
            <div key={index} className="rounded-lg border border-line-soft p-2">
              <div className="flex h-14 items-end">
                <div
                  className="w-full rounded-t-[2px] bg-emerald-500/80"
                  style={{ height: `${Math.max(probability * 100, 2)}%` }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[9.5px] text-quiet">
                |{index.toString(2).padStart(2, "0")}⟩
              </p>
              <p className="font-mono text-[10px] text-ink-soft">{(probability * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-quiet">
          {analysis.branches} weighted branches enumerated exactly. At 0% the state is a pure Bell pair with
          fidelity 1.000; as the rate rises the off-diagonal terms decay and the distribution flattens toward
          25% each, which is what a fully depolarised pair looks like.
        </p>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        This is a textbook depolarising channel, not a calibration model for any specific device. Real
        hardware also has readout error, crosstalk and drift. No IBM hardware is executed anywhere on this
        site.
      </p>
    </div>
  );
}
