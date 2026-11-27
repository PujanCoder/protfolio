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
npm run build      # static export into out/
npm run start      # serve the exported build
npm run lint       # ESLint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
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
  sitemap.ts, robots.ts      SEO routes
components/                  UI primitives, project card + motif, architecture flow, GitHub panel
lib/
  profile.ts                 identity, tagline, roles, links
  projects.ts                six case studies + archive (single source of truth)
  achievements.ts            recognition, hackathons, leadership, timeline
  skills.ts                  skill groups with evidence sentences and project links
  education.ts               academic record and self-directed curriculum
  github.ts                  GitHub API access with committed-snapshot fallback
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

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset **Next.js** is detected automatically; keep the default build command
   `npm run build` and output directory `.next` (Next handles the static export).
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL (for example
   `https://pujanpandey.vercel.app`) so canonical URLs, the sitemap and Open Graph tags point
   at the right host.
5. Deploy. Every subsequent push to `main` redeploys.

Netlify also works — `netlify.toml` is included (`publish = out`) if that is preferred.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus rings, `aria-*` state on tabs and filters.
- Colour contrast checked against the light canvas; motion disabled under
  `prefers-reduced-motion`, and revealed content stays visible without JavaScript.
- Static HTML for every route, no client-side data fetching on first paint, unoptimised
  images disabled only because the export has no image pipeline.
