import type { MetadataRoute } from "next";
import { detailProjects } from "@/lib/projects";
import { blogPosts, researchPosts } from "@/lib/writing";

export const dynamic = "force-static";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pujanpandey.vercel.app";

const pages = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/recruiter/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/architecture/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/compare/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/playground/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/cybersecurity-lab/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/assistant/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/journey/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/research/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/achievements/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/quantum-lab/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/activity/", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/skills/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/education/", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/contact/", priority: 0.7, changeFrequency: "yearly" as const },
];

const writing = [...researchPosts, ...blogPosts].map(
  (post) => `/${post.kind}/${post.slug}/`,
);

const labs = [
  "/labs/network-intrusion-detection/",
  "/labs/medical-imaging-mlops/",
  "/labs/gpt2-clone/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...pages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...writing.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...labs.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...detailProjects.map((project) => ({
      url: `${base}/projects/${project.slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
