"use client";

import type { Operation } from "@/lib/quantum/statevector";
import { GATE_BY_NAME } from "@/lib/quantum/circuits";

type Props = {
  operations: Operation[];
  qubits: number;
  activeIndex?: number;
  onRemove?: (index: number) => void;
};

const COL = 62;
const ROW = 42;
const PAD_X = 54;
const PAD_Y = 26;

export function CircuitDiagram({ operations, qubits, activeIndex, onRemove }: Props) {
  const width = PAD_X * 2 + Math.max(operations.length, 1) * COL + 34;
  const height = PAD_Y * 2 + (qubits - 1) * ROW;

  const yFor = (qubit: number) => PAD_Y + qubit * ROW;
  const xFor = (index: number) => PAD_X + index * COL;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto h-auto w-full"
        style={{ maxWidth: `${width}px` }}
        role="img"
        aria-label={`Quantum circuit with ${qubits} qubits and ${operations.length} operations`}
      >
        {Array.from({ length: qubits }, (_, qubit) => (
          <g key={`wire-${qubit}`}>
            <line
              x1={PAD_X - 16}
              y1={yFor(qubit)}
              x2={width - PAD_X + 16}
              y2={yFor(qubit)}
              stroke="#d1d5db"
              strokeWidth="1.25"
            />
            <text
              x={PAD_X - 24}
              y={yFor(qubit) + 4}
              textAnchor="end"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              fill="#6b7280"
            >
              q{qubit}
            </text>
          </g>
        ))}

        {operations.map((op, index) => {
          const x = xFor(index);
          const isActive = activeIndex === index;
          const stroke = isActive ? "#047857" : "#111827";

          if (op.gate === "cx") {
            const yc = yFor(op.control);
            const yt = yFor(op.target);
            return (
              <g
                key={`op-${index}`}
                onClick={() => onRemove?.(index)}
                className={onRemove ? "cursor-pointer" : undefined}
              >
                <title>{`CNOT control q${op.control}, target q${op.target}`}</title>
                <line x1={x} y1={yc} x2={x} y2={yt} stroke={stroke} strokeWidth="1.4" />
                <circle cx={x} cy={yc} r="4" fill={stroke} />
                <circle cx={x} cy={yt} r="11" fill="#ffffff" stroke={stroke} strokeWidth="1.4" />
                <line x1={x - 11} y1={yt} x2={x + 11} y2={yt} stroke={stroke} strokeWidth="1.4" />
                <line x1={x} y1={yt - 11} x2={x} y2={yt + 11} stroke={stroke} strokeWidth="1.4" />
              </g>
            );
          }

          const meta = GATE_BY_NAME.get(op.gate);
          const label = meta?.label ?? op.gate.toUpperCase();
          const hasAngle = op.angle !== undefined && ["rx", "ry", "rz"].includes(op.gate);
          const y = yFor(op.target);

          return (
            <g
              key={`op-${index}`}
              onClick={() => onRemove?.(index)}
              className={onRemove ? "cursor-pointer" : undefined}
            >
              <title>{`${meta?.title ?? op.gate} on q${op.target}${hasAngle ? `, angle ${(op.angle! / Math.PI).toFixed(2)} pi` : ""}`}</title>
              <rect
                x={x - 19}
                y={y - 15}
                width="38"
                height="30"
                rx="7"
                fill={isActive ? "#ecfdf5" : "#ffffff"}
                stroke={stroke}
                strokeWidth="1.3"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize={hasAngle ? "9.5" : "11.5"}
                fill={stroke}
              >
                {hasAngle ? `${label}θ` : label}
              </text>
            </g>
          );
        })}

        {Array.from({ length: qubits }, (_, qubit) => {
          const x = xFor(Math.max(operations.length, 1)) + 6;
          return (
            <g key={`measure-${qubit}`}>
              <rect
                x={x - 15}
                y={yFor(qubit) - 14}
                width="30"
                height="28"
                rx="6"
                fill="#f8faf9"
                stroke="#9ca3af"
                strokeWidth="1.2"
              />
              <text
                x={x}
                y={yFor(qubit) + 4}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                fill="#4b5563"
              >
                M
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
