import type { Project } from "@/lib/projects";

type MotifProps = {
  motif: Project["motif"];
  className?: string;
};

// Decorative system sketches. They are deliberately abstract and are never
// presented as screenshots of a running system.
export function ProjectMotif({ motif, className }: MotifProps) {
  const stroke = "#059669";
  const faint = "#a7f3d0";

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fade-${motif}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d1fae5" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="320" height="200" fill="#f8faf9" />
      <g stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="0.5">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="200" />
        ))}
        {[40, 80, 120, 160].map((y) => (
          <line key={`h-${y}`} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>

      {motif === "signal" && (
        <g>
          <path
            d="M0 150 L36 138 L62 146 L92 118 L120 126 L150 96 L178 108 L206 74 L234 86 L262 52 L290 62 L320 40 L320 200 L0 200 Z"
            fill={`url(#fade-${motif})`}
          />
          <path
            d="M0 150 L36 138 L62 146 L92 118 L120 126 L150 96 L178 108 L206 74 L234 86 L262 52 L290 62 L320 40"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <line
            x1="0"
            y1="118"
            x2="320"
            y2="118"
            stroke={stroke}
            strokeWidth="0.9"
            strokeDasharray="4 5"
            strokeOpacity="0.45"
          />
          {[40, 80, 120, 160, 200, 240, 280].map((x, index) => (
            <rect
              key={`bar-${x}`}
              x={x - 5}
              y={168 - (index % 3) * 12}
              width="10"
              height={22 + (index % 4) * 8}
              rx="1.5"
              fill={faint}
              fillOpacity="0.6"
            />
          ))}
          <circle cx="262" cy="52" r="3.4" fill={stroke} />
          <circle cx="262" cy="52" r="8" fill="none" stroke={stroke} strokeOpacity="0.3" />
        </g>
      )}

      {motif === "scan" && (
        <g>
          {[92, 70, 48].map((r, index) => (
            <rect
              key={r}
              x={160 - r}
              y={100 - r * 0.82}
              width={r * 2}
              height={r * 1.64}
              rx={r * 0.5}
              fill="none"
              stroke={stroke}
              strokeOpacity={0.16 + index * 0.16}
            />
          ))}
          <rect x="118" y="62" width="84" height="76" rx="4" fill="none" stroke={stroke} strokeWidth="1.4" />
          <rect x="118" y="62" width="84" height="14" fill={faint} fillOpacity="0.55" />
          <line x1="160" y1="30" x2="160" y2="170" stroke={stroke} strokeOpacity="0.22" strokeDasharray="3 4" />
          <line x1="70" y1="100" x2="250" y2="100" stroke={stroke} strokeOpacity="0.22" strokeDasharray="3 4" />
          <circle cx="160" cy="100" r="3" fill={stroke} />
          <circle cx="196" cy="118" r="2.4" fill="#0d9488" />
        </g>
      )}

      {motif === "tokens" && (
        <g>
          {Array.from({ length: 18 }).map((_, index) => {
            const col = index % 6;
            const row = Math.floor(index / 6);
            const width = [34, 22, 44, 28, 18, 38][(index * 5) % 6];
            return (
              <rect
                key={index}
                x={26 + col * 46}
                y={40 + row * 42}
                width={width}
                height="18"
                rx="3"
                fill={index % 7 === 3 ? faint : "#ffffff"}
                fillOpacity={index % 7 === 3 ? 0.9 : 1}
                stroke={stroke}
                strokeOpacity="0.28"
              />
            );
          })}
          <path d="M26 172 L294 172" stroke={stroke} strokeOpacity="0.3" />
          <rect x="26" y="166" width="96" height="4" rx="2" fill={stroke} fillOpacity="0.7" />
        </g>
      )}

      {motif === "graph" && (
        <g>
          {[
            [160, 46],
            [86, 96],
            [234, 92],
            [60, 156],
            [160, 148],
            [258, 152],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={index === 0 ? 7 : 5}
              fill={index === 0 ? stroke : "#ffffff"}
              stroke={stroke}
              strokeWidth="1.6"
            />
          ))}
          <g stroke={stroke} strokeOpacity="0.4" strokeWidth="1.1">
            <line x1="160" y1="46" x2="86" y2="96" />
            <line x1="160" y1="46" x2="234" y2="92" />
            <line x1="86" y1="96" x2="60" y2="156" />
            <line x1="86" y1="96" x2="160" y2="148" />
            <line x1="234" y1="92" x2="160" y2="148" />
            <line x1="234" y1="92" x2="258" y2="152" />
            <line x1="160" y1="46" x2="160" y2="148" strokeDasharray="3 4" />
          </g>
        </g>
      )}

      {motif === "film" && (
        <g>
          <rect x="20" y="34" width="280" height="30" rx="4" fill="#ffffff" stroke={stroke} strokeOpacity="0.3" />
          <text x="32" y="53" fontFamily="ui-monospace, monospace" fontSize="9" fill={stroke} letterSpacing="1.6">
            TRANSCRIPT
          </text>
          {Array.from({ length: 22 }).map((_, index) => (
            <rect
              key={index}
              x={32 + index * 12}
              y={80 + (index % 3) * 6}
              width="7"
              height={18 + (index % 4) * 6}
              rx="2"
              fill={index % 5 === 0 ? stroke : faint}
              fillOpacity={index % 5 === 0 ? 0.6 : 0.55}
            />
          ))}
          <rect x="20" y="132" width="120" height="26" rx="4" fill="#ffffff" stroke={stroke} strokeOpacity="0.35" />
          <text x="32" y="149" fontFamily="ui-monospace, monospace" fontSize="8.5" fill={stroke} letterSpacing="1.2">
            OCR TEXT
          </text>
          <rect x="152" y="132" width="148" height="26" rx="4" fill={faint} fillOpacity="0.45" stroke={stroke} strokeOpacity="0.3" />
          <rect x="162" y="141" width="86" height="3" rx="1.5" fill={stroke} fillOpacity="0.5" />
          <rect x="162" y="148" width="60" height="3" rx="1.5" fill={stroke} fillOpacity="0.3" />
        </g>
      )}

      {motif === "ledger" && (
        <g>
          {Array.from({ length: 7 }).map((_, row) => (
            <g key={row}>
              <rect
                x="24"
                y={30 + row * 22}
                width="272"
                height="16"
                rx="3"
                fill={row === 4 ? faint : "#ffffff"}
                fillOpacity={row === 4 ? 0.75 : 1}
                stroke={stroke}
                strokeOpacity={row === 4 ? 0.45 : 0.18}
              />
              {[0, 1, 2, 3].map((col) => (
                <rect
                  key={col}
                  x={34 + col * 66}
                  y={36 + row * 22}
                  width={[44, 30, 38, 26][col]}
                  height="4"
                  rx="2"
                  fill={row === 4 ? stroke : "#9ca3af"}
                  fillOpacity={row === 4 ? 0.8 : 0.32}
                />
              ))}
            </g>
          ))}
          <circle cx="284" cy="132" r="3.5" fill="#d97706" />
        </g>
      )}
    </svg>
  );
}
