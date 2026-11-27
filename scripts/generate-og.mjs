import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8faf9"/>
      <stop offset="0.55" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#ecfdf5"/>
    </linearGradient>
    <linearGradient id="chart" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#a7f3d0"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" stroke="#064e3b" stroke-opacity="0.06" fill="none"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#wash)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <g transform="translate(88 96)">
    <rect width="46" height="46" rx="12" fill="#064e3b"/>
    <text x="23" y="31" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="700" fill="#ffffff" text-anchor="middle">PP</text>
    <text x="62" y="20" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="600" fill="#111827">Pujan Pandey</text>
    <text x="62" y="38" font-family="monospace" font-size="10" letter-spacing="2.2" fill="#6b7280">AI · ML · QUANTUM</text>
  </g>

  <text x="88" y="262" font-family="Helvetica, Arial, sans-serif" font-size="74" font-weight="700" letter-spacing="-2.5" fill="#064e3b">Pujan Pandey</text>
  <text x="88" y="314" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#374151">Building intelligent systems.</text>
  <text x="88" y="350" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#374151">Exploring what&apos;s possible.</text>

  <text x="88" y="404" font-family="monospace" font-size="11.5" letter-spacing="2.4" fill="#047857">AI/ML ENGINEER · MLOPS DEVELOPER · CYBERSECURITY</text>

  <text x="88" y="436" font-family="monospace" font-size="11.5" fill="#6b7280">F1 0.973 · 298K FLOWS · 85 TESTS · p50 2.23 ms</text>

  <g transform="translate(88 486)">
    <rect x="0" y="0" width="206" height="32" rx="16" fill="#ecfdf5" stroke="#a7f3d0"/>
    <text x="18" y="21" font-family="monospace" font-size="10.5" letter-spacing="1.2" fill="#047857">OPEN TO WORK</text>
    <text x="230" y="21" font-family="monospace" font-size="10.5" letter-spacing="1.2" fill="#6b7280">github.com/PujanCoder</text>
  </g>

  <g transform="translate(760 150)">
    <rect width="352" height="352" rx="20" fill="#ffffff" stroke="#e5e7eb"/>
    <g stroke="#e5e7eb" stroke-dasharray="3 6">
      <line x1="28" y1="88" x2="324" y2="88"/>
      <line x1="28" y1="176" x2="324" y2="176"/>
      <line x1="28" y1="264" x2="324" y2="264"/>
    </g>
    <path d="M28 268 L76 240 L124 250 L172 200 L220 206 L268 158 L324 120" fill="none" stroke="url(#chart)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 268 L76 240 L124 250 L172 200 L220 206 L268 158 L324 120 L324 300 L28 300 Z" fill="#10b981" fill-opacity="0.08"/>
    <circle cx="324" cy="120" r="5.5" fill="#047857"/>
    <text x="28" y="330" font-family="monospace" font-size="10" letter-spacing="1.8" fill="#6b7280">DETECTION F1 BY SPLIT</text>
  </g>

  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="#064e3b" stroke-opacity="0.10"/>
</svg>`;

await mkdir("public", { recursive: true });
await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile("public/og.png");
console.log("public/og.png written (1200x630)");
