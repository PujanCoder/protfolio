# Pujan Pandey — Portfolio

A multi-page engineering portfolio for **Pujan Pandey** (AI/ML engineer, MLOps developer,
cybersecurity enthusiast), built as a static Next.js site. Every claim on the site traces
back to a public repository: evaluation numbers come from project READMEs, stack lists come
from dependency files, and limitations are published next to the results.

Live pages: home, about, projects, six project case studies, achievements, skills, education,
contact, and a 404.

## Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, static export)                    |
| Language   | TypeScript (strict)                                       |
| Styling    | Tailwind CSS v4 with a design-token theme in `globals.css` |
| Motion     | Framer Motion (respects `prefers-reduced-motion`)          |
| Icons      | Lucide                                                    |
| Type       | Geist Sans / Geist Mono                                   |
| Output     | Fully static (`out/`), no server runtime                   |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
npm test           # Vitest suites for the quantum simulator and model labs
```

## Structure

```
app/
  layout.tsx                 metadata, JSON-LD Person schema, header/footer shell
  page.tsx                   home: hero, stat strip, featured work, achievements, about, GitHub, skills
  about/                     narrative, journey, capabilities, engineering principles
  projects/                  filterable explorer + archive of other repositories
  projects/[slug]/           case study template (metrics, problem, approach, architecture, limits)
  achievements/              Qiskit Advocate panel, hackathons, leadership, timeline
  skills/                    tabbed skill explorer grouped by where each tool is used
  education/                 academic background, self-directed tracks, next steps
  contact/                   contact details and validated email-draft form
  activity/                  live GitHub statistics, event log and language mix
  quantum-lab/               browser statevector simulator, Bloch sphere, Qiskit comparisons
  labs/[slug]/               runnable labs: NDR operating point, retrain gate, BPE tokenizer
  sitemap.ts, robots.ts      SEO routes
components/                  UI primitives, project card + motif, architecture flow, GitHub panel
  assistant/ask-pujan.tsx    floating chat widget (streaming, Escape to close, suggestions)
  activity/                  Recharts contribution and language charts
  labs/                      NDR, medical gate and tokenizer lab clients
  quantum/                   Bloch sphere, circuit diagram, guided demos
lib/
  profile.ts                 identity, tagline, roles, links
  projects.ts                six case studies + archive (single source of truth)
  achievements.ts            recognition, hackathons, leadership, timeline
  skills.ts                  skill groups with evidence sentences and project links
  education.ts               academic record and self-directed curriculum
  github.ts                  GitHub API access with committed-snapshot fallback
  assistant/knowledge.ts     curated, source-linked answer base for the assistant
  labs/                      exact arithmetic and algorithms behind each lab
  quantum/                   statevector linear algebra and Qiskit circuit translations
tests/                       Vitest suites asserting the published metrics and algorithms
src/data/github-snapshot.json  last good GitHub payload used when the API is unavailable
scripts/                     GitHub snapshot fetch, OG image generator
```

## Content rules

- **No invented numbers.** Metrics are copied from the project READMEs, with the dataset and
  split named next to them.
- **No invented links.** Only repositories that exist are linked; there are no placeholder
  demo URLs. Repositories without a live deployment link only to their source.
- **Limitations are published.** Each case study has a "Known limitations" block, including a
  documented zero-recall cross-dataset probe on the NDR platform.
- **No personal data beyond what is intentional.** No date of birth, address, or academic
  records.

## GitHub integration

`lib/github.ts` fetches the public profile, repository list, language mix and recent
contribution counts from the GitHub REST API at build time. If the request fails or is rate
limited, it falls back to `src/data/github-snapshot.json` and the UI labels the data as a
snapshot, so the build never breaks and the page never implies live data it does not have.

Refresh the snapshot with:

```bash
npm run gh:snapshot
```

## Assistant

The assistant answers from `lib/assistant/knowledge.ts` and nothing else — retrieval runs in
the browser (`lib/assistant/answer.ts`), so it works on a static host with no API key, no
server and no cold start. When a question matches no entry it says so and points at the
email address rather than guessing.

Adding live generation is a server-side change, not a client one: put a route handler back
under `app/api/assistant/`, call the provider there with `SYSTEM_PROMPT` + `buildContext()`,
and keep `OPENAI_API_KEY` in the host's environment. Keys must never reach the browser.

## Deployment

The site is deployed and publicly served from GitHub Pages:

**https://pujancoder.github.io/protfolio/**

### GitHub Pages (current, no server, no credentials)

`.github/workflows/deploy-pages.yml` runs on every push to `main` (and `portfolio-v1` while
the PR is open): `npm ci` → static export → typecheck, lint, tests → push `out/` to the
`gh-pages` branch, which Pages serves.

Locally:

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/protfolio \
NEXT_PUBLIC_SITE_URL=https://pujancoder.github.io/protfolio npm run build
# -> out/
```

`NEXT_PUBLIC_BASE_PATH` must match the repository name, because project sites are served
from `/<repo>/`. Plain `<a>` elements use `withBase()` from `lib/base-path.ts`; `<Link>`
handles the prefix itself.

### Vercel (optional, keeps server features)

Vercel needs a token (or the dashboard) to deploy — this repository has not been linked to a
Vercel project, so no Vercel URL exists. To deploy there:

```bash
npx vercel login          # or set VERCEL_TOKEN
npx vercel link           # link to the GitHub repository
npx vercel --prod         # build and deploy
```

Keep the default Next.js preset (`npm run build`, no output-directory override) so redirects
and security headers from `next.config.ts` stay active. Set `NEXT_PUBLIC_SITE_URL` to the
Vercel domain. Images are already `unoptimized`, so no image pipeline is required.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_BASE_PATH` | Pages only | `/<repo>` prefix for project sites |
| `STATIC_EXPORT` | Pages only | `1` sets `output: "export"` |
| `GITHUB_TOKEN` | optional | Higher GitHub API rate limit for the activity page snapshot |

`npm run gh:snapshot` regenerates `lib/github-snapshot.json`; the activity page falls back to
it (and says so) when the public API is rate limited.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus rings, `aria-*` state on tabs and filters.
- Colour contrast checked against the light canvas; motion disabled under
  `prefers-reduced-motion`, and revealed content stays visible without JavaScript.
- Static HTML for every route; the only client-side data fetch on first paint is the
  assistant, which waits for user input. Unoptimised images are disabled deliberately so the
  build works on any host without an image pipeline.
- The interactive labs state their own provenance: each one separates the published numbers
  from the synthetic distribution used to make the interaction legible.
