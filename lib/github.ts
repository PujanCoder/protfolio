import snapshotJson from "@/src/data/github-snapshot.json";

type SnapshotRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  size: number;
  topics: string[];
  homepage: string | null;
  createdAt: string;
  pushedAt: string;
  archived: boolean;
};

type SnapshotEvent = { type: string; repo: string; createdAt: string };

type Snapshot = {
  generatedAt: string;
  user: {
    login: string;
    name: string | null;
    bio: string | null;
    location: string | null;
    email: string | null;
    avatarUrl: string;
    htmlUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
  };
  repos: SnapshotRepo[];
  events: SnapshotEvent[];
  languages: Record<string, Record<string, number>>;
};

const snapshot = snapshotJson as unknown as Snapshot;

export type GithubLanguage = { name: string; percent: number; bytes: number };

export type GithubRepoActivity = {
  repo: string;
  repoUrl: string;
  count: number;
  label: string;
  type: string;
  displayDate: string;
};

export type GithubEvent = {
  type: string;
  label: string;
  repo: string;
  repoUrl: string;
  date: string;
  displayDate: string;
};

export type GithubData = {
  login: string;
  name: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  location: string | null;
  memberSince: string;
  languages: GithubLanguage[];
  recentRepos: GithubRepoActivity[];
  recent: GithubEvent[];
  activity: { date: string; label: string; count: number }[];
  topRepos: SnapshotRepo[];
  generatedAt: string;
  source: "live" | "snapshot";
};

const LANGUAGE_LABELS: Record<string, string> = {
  "Jupyter Notebook": "Jupyter",
  TypeScript: "TypeScript",
  JavaScript: "JavaScript",
  Python: "Python",
  HTML: "HTML",
  CSS: "CSS",
  Shell: "Shell",
  Dockerfile: "Docker",
  Makefile: "Make",
};

const EVENT_LABELS: Record<string, string> = {
  PushEvent: "Pushed commits",
  PullRequestEvent: "Opened or updated a pull request",
  PullRequestReviewEvent: "Reviewed a pull request",
  CreateEvent: "Created a branch or tag",
  DeleteEvent: "Deleted a branch or tag",
  IssuesEvent: "Updated an issue",
  IssueCommentEvent: "Commented on an issue",
  WatchEvent: "Starred a repository",
  ForkEvent: "Forked a repository",
  ReleaseEvent: "Published a release",
  PublicEvent: "Made a repository public",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

// Notebook JSON and bundled HTML/CSS dwarf real source and misrepresent the
// stack, so they are excluded from the composition chart.
const EXCLUDED_COMPOSITION_LANGUAGES = new Set([
  "Jupyter Notebook",
  "HTML",
  "CSS",
]);

function aggregateLanguages(
  languages: Record<string, Record<string, number>>,
): GithubLanguage[] {
  const totals = new Map<string, number>();

  for (const repoLanguages of Object.values(languages)) {
    for (const [language, bytes] of Object.entries(repoLanguages)) {
      if (EXCLUDED_COMPOSITION_LANGUAGES.has(language)) continue;
      totals.set(language, (totals.get(language) ?? 0) + bytes);
    }
  }

  const all = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const sum = all.reduce((acc, [, bytes]) => acc + bytes, 0);
  if (!sum) return [];

  const top = all
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name: LANGUAGE_LABELS[name] ?? name,
      bytes,
      percent: Math.round((bytes / sum) * 1000) / 10,
    }))
    .filter((language) => language.percent >= 0.1);

  const shown = new Set(top.map((language) => language.name));
  const restBytes = all
    .filter(([name]) => !shown.has(LANGUAGE_LABELS[name] ?? name))
    .reduce((acc, [, bytes]) => acc + bytes, 0);
  if (restBytes > 0) {
    top.push({
      name: "Other",
      bytes: restBytes,
      percent: Math.round((restBytes / sum) * 1000) / 10,
    });
  }

  return top;
}

function buildActivity(events: SnapshotEvent[]) {
  const counts = new Map<string, number>();

  for (const event of events) {
    const day = event.createdAt.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const days: { date: string; label: string; count: number }[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i -= 1) {
    const day = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i),
    );
    const key = day.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(day),
      count: counts.get(key) ?? 0,
    });
  }

  return days;
}

function buildRecentRepos(
  events: SnapshotEvent[],
  login: string,
): GithubRepoActivity[] {
  const grouped = new Map<string, { count: number; latest: SnapshotEvent }>();

  for (const event of events) {
    if (!event.repo.startsWith(`${login}/`)) continue;
    const entry = grouped.get(event.repo);
    if (entry) entry.count += 1;
    else grouped.set(event.repo, { count: 1, latest: event });
  }

  return [...grouped.entries()].slice(0, 5).map(([repo, { count, latest }]) => ({
    repo: repo.split("/")[1] ?? repo,
    repoUrl: `https://github.com/${repo}`,
    count,
    label: EVENT_LABELS[latest.type] ?? latest.type.replace(/Event$/, ""),
    type: latest.type,
    displayDate: formatDate(latest.createdAt),
  }));
}

function buildRecent(events: SnapshotEvent[]): GithubEvent[] {
  return events.slice(0, 6).map((event) => ({
    type: event.type,
    label: EVENT_LABELS[event.type] ?? event.type.replace(/Event$/, ""),
    repo: event.repo.split("/")[1] ?? event.repo,
    repoUrl: `https://github.com/${event.repo}`,
    date: event.createdAt,
    displayDate: formatDate(event.createdAt),
  }));
}

async function loadLive(token: string): Promise<Snapshot | null> {
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "pujan-portfolio",
  };

  try {
    const request = (url: string) =>
      fetch(url, { headers, signal: AbortSignal.timeout(8000) }).then((res) => {
        if (!res.ok) throw new Error(`${res.status} for ${url}`);
        return res.json();
      });

    const [user, repos, events] = await Promise.all([
      request("https://api.github.com/users/PujanCoder"),
      request("https://api.github.com/users/PujanCoder/repos?per_page=100&sort=pushed"),
      request("https://api.github.com/users/PujanCoder/events/public?per_page=100"),
    ]);

    return {
      ...snapshot,
      generatedAt: new Date().toISOString(),
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        location: user.location,
        email: user.email,
        avatarUrl: user.avatar_url,
        htmlUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: user.created_at,
      },
      repos: repos
        .filter((repo: { fork: boolean }) => !repo.fork)
        .map(
          (repo: {
            name: string;
            description: string | null;
            html_url: string;
            language: string | null;
            stargazers_count: number;
            forks_count: number;
            size: number;
            topics?: string[];
            homepage: string | null;
            created_at: string;
            pushed_at: string;
            archived: boolean;
          }) => ({
            name: repo.name,
            description: repo.description,
            htmlUrl: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            size: repo.size,
            topics: repo.topics ?? [],
            homepage: repo.homepage,
            createdAt: repo.created_at,
            pushedAt: repo.pushed_at,
            archived: repo.archived,
          }),
        ),
      events: events.slice(0, 100).map(
        (event: { type: string; repo?: { name: string }; created_at: string }) => ({
          type: event.type,
          repo: event.repo?.name ?? "",
          createdAt: event.created_at,
        }),
      ),
    };
  } catch (error) {
    console.warn(
      `[github] live fetch failed, using committed snapshot: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}

export async function getGithubData(): Promise<GithubData> {
  const token = process.env.GITHUB_TOKEN;
  const live = token ? await loadLive(token) : null;
  const data = live ?? snapshot;

  const topRepos = [...data.repos]
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, 6);

  return {
    login: data.user.login,
    name: data.user.name ?? data.user.login,
    avatarUrl: data.user.avatarUrl,
    htmlUrl: data.user.htmlUrl,
    publicRepos: data.user.publicRepos,
    followers: data.user.followers,
    following: data.user.following,
    totalStars: data.repos.reduce((acc, repo) => acc + repo.stars, 0),
    location: data.user.location?.replace(/\s+,/g, ",").trim() ?? null,
    memberSince: new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(data.user.createdAt)),
    languages: aggregateLanguages(data.languages),
    recentRepos: buildRecentRepos(data.events, data.user.login),
    recent: buildRecent(data.events),
    activity: buildActivity(data.events),
    topRepos,
    generatedAt: data.generatedAt,
    source: live ? "live" : "snapshot",
  };
}

export function formatSnapshotDate(iso: string) {
  return formatDate(iso);
}
