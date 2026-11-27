import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { formatSnapshotDate, getGithubData } from "@/lib/github";

export async function GithubPanel() {
  const data = await getGithubData();
  const maxActivity = Math.max(...data.activity.map((day) => day.count), 1);
  const totalActivity = data.activity.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-center gap-3.5">
          <span className="relative inline-flex h-12 w-12 shrink-0 rounded-full border border-emerald-200 bg-emerald-50 p-[2px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.avatarUrl}
              alt={`${data.name} on GitHub`}
              width={48}
              height={48}
              loading="lazy"
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-ink">{data.name}</p>
            <a
              href={data.htmlUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[11px] text-quiet transition-colors hover:text-emerald-700"
            >
              @{data.login}
            </a>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line-soft pt-4">
          {[
            { label: data.publicRepos === 1 ? "Repo" : "Repos", value: data.publicRepos },
            { label: data.followers === 1 ? "Follower" : "Followers", value: data.followers },
            { label: data.totalStars === 1 ? "Star" : "Stars", value: data.totalStars },
          ].map((stat) => (
            <div key={stat.label}>
              <dd className="font-mono text-[17px] leading-none text-forest">
                {stat.value}
              </dd>
              <dt className="mt-1.5 text-[10px] text-quiet">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 ${
              data.source === "live"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-line bg-canvas-soft text-quiet"
            }`}
          >
            <span
              className={`h-1 w-1 rounded-full ${
                data.source === "live" ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {data.source === "live" ? "live api" : "snapshot"}
          </span>
          <span>{formatSnapshotDate(data.generatedAt)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">Language mix</p>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-quiet">
            source bytes
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {data.languages.slice(0, 5).map((language) => (
            <li key={language.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11.5px] text-ink-soft">{language.name}</span>
                <span className="font-mono text-[10px] text-quiet">
                  {language.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-emerald-50">
                <div
                  className="h-full rounded-full bg-emerald-500/80"
                  style={{ width: `${Math.max(language.percent, 1.5)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">Last 14 days</p>
          <span className="font-mono text-[10px] text-quiet">{totalActivity} events</span>
        </div>
        <div
          className="mt-5 flex h-20 items-end gap-1.5"
          role="img"
          aria-label={`Public GitHub events for the last 14 days, ${totalActivity} total`}
        >
          {data.activity.map((day) => (
            <div key={day.date} className="group relative flex-1">
              <div
                className="w-full rounded-sm bg-emerald-500/70 transition-colors group-hover:bg-emerald-600"
                style={{
                  height: `${10 + (day.count / maxActivity) * 66}px`,
                  opacity: day.count === 0 ? 0.2 : 1,
                }}
              />
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[9px] text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {day.label}: {day.count}
              </span>
            </div>
          ))}
        </div>
        <a
          href={`${data.htmlUrl}?tab=overview`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 border-t border-line-soft pt-3.5 text-[11px] text-quiet transition-colors hover:text-emerald-700"
        >
          <GitHubIcon className="h-3.5 w-3.5" />
          Full contribution graph
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
