/**
 * Regenerates src/data/github-snapshot.json from the public GitHub API.
 * Run with a token for higher rate limits: GITHUB_TOKEN=... npm run gh:snapshot
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const USER = "PujanCoder";
const OUT = path.join(process.cwd(), "src", "data", "github-snapshot.json");

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "pujan-portfolio-build",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function get(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const user = await get(`https://api.github.com/users/${USER}`);
const repos = await get(
  `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
);
const events = await get(
  `https://api.github.com/users/${USER}/events/public?per_page=100`,
);

const owned = repos.filter((r) => !r.fork);
const featured = [
  "Network-Intrusion-Detection-Advanced-MLOps",
  "Medical-imaging-MLOps",
  "GPT-2-CLONE",
  "Multi_Agent_Travel_System",
  "ComplaineQAPipeline",
  "Credit-Card-Fraud-Detection-_-MLOps",
  "AI-YouTube-Video-Summarizer",
  "Smart_CuraPath",
  "forest-cover-predictor",
  "Capstone-_-MLOPS-Project",
];

const languages = {};
for (const name of featured) {
  try {
    const data = await get(
      `https://api.github.com/repos/${USER}/${name}/languages`,
    );
    languages[name] = data;
  } catch (error) {
    console.warn(`skip languages for ${name}: ${error.message}`);
  }
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  user: {
    login: user.login,
    name: user.name,
    bio: user.bio,
    location: user.location,
    blog: user.blog,
    email: user.email,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at,
  },
  repos: owned.map((r) => ({
    name: r.name,
    description: r.description,
    htmlUrl: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    size: r.size,
    topics: r.topics ?? [],
    homepage: r.homepage,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    archived: r.archived,
  })),
  events: events.slice(0, 100).map((e) => ({
    type: e.type,
    repo: e.repo?.name,
    createdAt: e.created_at,
  })),
  languages,
};

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
  `wrote ${OUT} — ${snapshot.repos.length} repos, ${snapshot.events.length} events`,
);
