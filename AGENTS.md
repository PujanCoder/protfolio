# AGENTS.md

Portfolio for Pujan Pandey (AI/ML, MLOps, security, Qiskit). Next.js App Router + TypeScript +
Tailwind v4 + framer-motion + lucide-react. Every claim must trace to a public repository,
a recorded metric, or a file in this repo. No invented numbers, employers, or links.

## Commands
- `npm run dev` / `npm run build` / `npm start` (production, honors `PORT`)
- `npm run lint` (eslint via `next lint`), `npx tsc --noEmit`
- `npx vitest run` — unit tests in `tests/` (CV rendering, quantum maths, simulator)

## Layout
- `lib/` — content and maths: `profile.ts`, `projects.ts` (`detailProjects`), `architecture.ts`,
  `compare.ts`, `journey.ts`, `achievements.ts`, `education.ts`, `github.ts` (live API + snapshot
  fallback), `quantum/*` (statevector, circuits), `playground/*`, `security/simulator.ts`,
  `writing/*` (research + blog posts), `cv/*` (content → PDF).
- `app/` — one directory per route; `app/api/cv/[variant]/route.ts` renders the PDF,
  `app/api/assistant/route.ts` answers from the same grounded content.
- `components/` — grouped by feature (`architecture`, `assistant`, `compare`, `journey`,
  `playground`, `quantum`, `security`, `writing`), shared primitives in `components/ui.tsx`.
- `lib/navigation.ts` is the single source for nav, footer groups and the command palette; add any
  new route there and to `app/sitemap.ts`.

## Conventions
- Tailwind tokens: `text-ink`, `text-ink-soft`, `text-quiet`, `border-line`, `bg-canvas-soft`,
  `text-forest`, `mono-label`, `container-page`. Use them instead of raw hex.
- Numeric claims live in `lib/` next to their source, with a note on the dataset or run.
- Interactive demos are client components that compute locally; state the simulation limits in the UI.

## Gotchas
- The site uses `trailingSlash: true`; internal links need the trailing slash or they 308-redirect.
- Grid children that contain `<pre>` or `truncate` need `min-w-0`, otherwise mobile overflows
  horizontally (this bit `components/quantum/gate-explorer.tsx` and the quantum experiments grid).
- `next lint` is deprecated but still the configured linter; do not migrate without updating CI.
