import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { GithubPanel } from "@/components/github-panel";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { CTASection, SectionHeader, StatStrip } from "@/components/ui";
import { featuredAchievements } from "@/lib/achievements";
import { heroStats, profile } from "@/lib/profile";
import { featuredProjects } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

const achievementIcons = {
  Quantum: Atom,
  Hackathon: Trophy,
  Leadership: Users,
  Recognition: ShieldCheck,
} as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-soft opacity-60 [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-emerald-100/60 blur-[100px]"
        />

        <div className="container-page relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-emerald-800">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {profile.location} · open to AI/ML work
            </p>

            <h1 className="mt-6 text-[clamp(2.6rem,6vw,4rem)] leading-[0.98] tracking-[-0.04em]">
              {profile.name}
            </h1>

            <p className="mt-5 max-w-xl text-[clamp(1.15rem,2.3vw,1.5rem)] leading-snug tracking-[-0.02em] text-ink-soft">
              {profile.tagline}
            </p>

            <p className="mt-5 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-emerald-800">
              {profile.roleLine}
            </p>

            <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-quiet">
              {profile.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-forest-deep"
              >
                View my projects
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/achievements"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-forest/25 hover:text-forest"
              >
                Explore achievements
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-1 py-3 text-[13px] text-quiet transition-colors hover:text-forest"
              >
                <GitHubIcon className="h-4 w-4" />
                github.com/{profile.githubHandle}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[1.6rem] bg-gradient-to-br from-emerald-100/70 via-white to-emerald-50 blur-[2px]"
            />
            <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_60px_-40px_rgba(6,78,59,0.45)]">
              <div className="overflow-hidden rounded-xl border border-line bg-canvas-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={`${profile.name}, AI/ML engineer`}
                  width={480}
                  height={480}
                  className="aspect-square w-full object-cover"
                  fetchPriority="high"
                />
              </div>
              <div className="px-1 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14.5px] font-semibold text-ink">{profile.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-quiet">
                      {profile.location} · {profile.timezone}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line-soft pt-3.5">
                  {[
                    { value: "43", label: "repos" },
                    { value: "85", label: "tests" },
                    { value: "0.973", label: "F1" },
                  ].map((item) => (
                    <div key={item.label}>
                      <dd className="font-mono text-[13.5px] leading-none text-forest">
                        {item.value}
                      </dd>
                      <dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
                        {item.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-12 md:py-14">
        <div className="container-page">
          <StatStrip items={heroStats} />
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Selected work"
            title="Systems built to be measured, not just demonstrated."
            description="Each case study documents the architecture, the evaluation numbers and the limitations I could not solve. Repository links point at the actual code."
            action={{ href: "/projects", label: "All projects" }}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Achievements"
            title="Recognition, competitions and leadership."
            description="Quantum computing recognition, hackathon placements and technical leadership — each with the evidence I can point to."
            action={{ href: "/achievements", label: "Full achievements page" }}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredAchievements.map((achievement, index) => {
              const Icon = achievementIcons[achievement.category];
              return (
                <Reveal key={achievement.slug} delay={index * 0.05}>
                  <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      {achievement.badge ? (
                        <span className="rounded-full border border-line bg-canvas-soft px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
                          {achievement.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-[15px] leading-snug">{achievement.title}</h3>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet">
                      {achievement.org}
                      {achievement.period ? ` · ${achievement.period}` : ""}
                    </p>
                    <p className="mt-3 text-[12.5px] leading-relaxed text-quiet">
                      {achievement.summary}
                    </p>
                    <Link
                      href="/achievements"
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[12px] font-medium text-emerald-700 transition-colors hover:text-forest"
                    >
                      Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="mono-label">About</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] leading-tight">
              I care about what happens after the model is trained.
            </h2>
            <p className="prose-body mt-5">
              I started with quantum algorithms — Shor&apos;s, Grover&apos;s, phase
              estimation — and kept following the same instinct: take the system
              apart until the numbers mean something. That instinct moved me
              toward machine learning engineering, where the hard part is rarely
              the model. It is the data contract, the evaluation split, the
              latency budget, the alert that nobody trusts.
            </p>
            <p className="prose-body">
              The network detection platform is the clearest example. It scores
              Zeek connection logs with a gradient-boosted classifier and streams
              results to a dashboard — but the part I am proudest of is the
              restraint: measured p50 and p95 latency, replay data tagged so it
              cannot masquerade as live traffic, and a published cross-dataset
              probe that scored zero recall. A detector that hides its failure
              modes is a liability.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-emerald-700 transition-colors hover:text-forest"
              >
                Read the full profile
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/education"
                className="inline-flex items-center gap-2 text-[13px] text-quiet transition-colors hover:text-forest"
              >
                Education and learning path
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <p className="mono-label">How I work</p>
            <ul className="mt-4 space-y-4">
              {[
                {
                  title: "Measured, not asserted",
                  body: "Latency, false-positive rate and throughput are reported because they were measured.",
                },
                {
                  title: "Failures stay visible",
                  body: "A zero-day probe that scores 0.00 recall is published next to the 0.973 F1.",
                },
                {
                  title: "Reproducible by default",
                  body: "DVC stages, pinned dependencies, seeded splits and locked pipelines.",
                },
                {
                  title: "Promotion is a decision",
                  body: "Quality gates compare a candidate against the baseline before anything ships.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-3.5">
                  <span className="mt-0.5 font-mono text-[10px] text-emerald-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-quiet">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="GitHub"
            title="The work is public and continuously updated."
            description="Repository counts, language composition and recent activity come from the GitHub API at build time, with a committed snapshot as fallback if the API is rate-limited."
            action={{ href: profile.github, label: `@${profile.githubHandle}` }}
          />
          <div className="mt-10">
            <GithubPanel />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-soft py-16 md:py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Skills"
            title="A stack that shows up in the code."
            description="Grouped by where it is used. Nothing here is aspirational — each item traces back to a repository."
            action={{ href: "/skills", label: "Explore skills" }}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.slice(0, 4).map((group) => (
              <div key={group.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="text-[13px] font-medium leading-snug text-ink">
                  {group.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.slice(0, 5).map((item) => (
                    <li
                      key={item}
                      className="rounded border border-line-soft bg-canvas-soft px-2 py-1 font-mono text-[10px] leading-none text-ink-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
