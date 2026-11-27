import type { MetadataRoute } from "next";
import { detailProjects } from "@/lib/projects";

export const dynamic = "force-static";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pujanpandey.vercel.app";

const pages = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/projects/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/achievements/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/skills/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/education/", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/contact/", priority: 0.7, changeFrequency: "yearly" as const },
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
    ...detailProjects.map((project) => ({
      url: `${base}/projects/${project.slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
