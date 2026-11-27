import type { Metadata } from "next";
import { ArrowUpRight, Github, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Badge, CTASection, PageHero, SectionHeader, StatStrip } from "@/components/ui";
import { ContributionChart, LanguageChart } from "@/components/activity/activity-charts";
import { formatSnapshotDate, getGithubData } from "@/lib/github";

export const metadata: Metadata = {
  title: "Engineering Activity",
  description:
    "Public GitHub activity for Pujan Pandey: repositories, language distribution, stars and recent commits, fetched from the GitHub API with a cached snapshot fallback.",
  alternates: { canonical: "/activity/" },
  openGraph: {
    title: "Engineering Activity — Pujan Pandey",
    description:
      "Repository statistics, language distribution and recent GitHub activity, with the data source and freshness stated.",
    url: "/activity/",
  },
};

export default async function ActivityPage() {
  const data = await getGithubData();
  const live = data.source === "live";
  const totalEvents = data.activity.reduce((sum, day) => sum + day.count, 0);

  return (
    <>
      <PageHero
        eyebrow="Engineering activity"
        title="What the commit history actually says."
        description="Repository statistics and recent activity pulled from the GitHub API. Nothing here is typed by hand: if the API is rate limited, the page falls back to a dated snapshot and says so."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <Github className="h-3 w-3" />
            @{data.login}
          </Badge>
          <Badge tone={live ? "emerald" : "amber"}>
            <RefreshCw className="h-3 w-3" />
            {live ? "Live GitHub API" : `Snapshot ${formatSnapshotDate(data.generatedAt)}`}
          </Badge>
        </div>
      </PageHero>
      <section className="border-b border-line bg-white">
        <div className="container-page py-10 md:py-12">
          <StatStrip
            items={[
              { value: String(data.publicRepos), label: "Public repositories", note: "GitHub" },
              { value: String(data.totalStars), label: "Stars earned", note: "all public repos" },
              { value: String(data.followers), label: "Followers", note: "GitHub" },
              { value: String(totalEvents), label: "Recent events", note: "last 90 days" },
            ]}
          />
        </div>
      </section>
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-6 py-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10 md:py-14">
          <div>
            <SectionHeader eyebrow="Commit activity" title="Public events over the last 90 days" />
            <div className="mt-5 rounded-2xl border border-line bg-white p-4">
              <ContributionChart data={data.activity} />
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Languages" title="Where the code actually goes" />
            <div className="mt-5 rounded-2xl border border-line bg-white p-4">
              <LanguageChart data={data.languages} />
              <ul className="mt-2 space-y-1">
                {data.languages.slice(0, 5).map((language) => (
                  <li key={language.name} className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-soft">{language.name}</span>
                    <span className="font-mono text-quiet">{language.percent.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-canvas-soft/40">
        <div className="container-page py-12 md:py-14">
          <SectionHeader eyebrow="Repositories" title="Recently updated work" description="Ordered by the most recent push, straight from the API response." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentRepos.map((repo) => (
              <Reveal key={repo.repo}>
                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col justify-between rounded-xl border border-line bg-white p-4 transition-colors hover:border-emerald-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[12px] text-forest">{repo.repo}</p>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-quiet transition-colors group-hover:text-emerald" />
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-quiet">{repo.label}</p>
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-quiet">
                    {repo.displayDate}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-14">
          <SectionHeader eyebrow="Event log" title="Latest public actions" />
          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line">
            {data.recent.map((event, index) => (
              <li key={`${event.repo}-${event.date}-${index}`} className="flex flex-wrap items-baseline justify-between gap-2 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[12.5px] text-ink">{event.label}</p>
                  <a href={event.repoUrl} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-emerald hover:underline">
                    {event.repo}
                  </a>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-quiet">{event.displayDate}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-quiet">
            The GitHub events endpoint only exposes roughly 90 days of public activity and is rate limited
            to 60 unauthenticated requests per hour. This page caches the response and falls back to the
            committed snapshot when the limit is reached, so the numbers are never silently stale.
          </p>
        </div>
      </section>

      <CTASection
        title="Want the full repository list?"
        description="Every public repository, including the ones not written up here, is on GitHub."
      />
    </>
  );
}
