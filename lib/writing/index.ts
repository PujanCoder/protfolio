import { blogPosts } from "@/lib/writing/blog";
import { researchPosts, type Post, type PostKind } from "@/lib/writing/research";

export type { Post, PostKind };
export { blogPosts, researchPosts };

export const allPosts: Post[] = [...researchPosts, ...blogPosts].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
);

export function getPost(kind: PostKind, slug: string) {
  const source = kind === "research" ? researchPosts : blogPosts;
  return source.find((post) => post.slug === slug);
}

export function relatedPosts(kind: PostKind, slug: string, limit = 2) {
  const source = kind === "research" ? researchPosts : blogPosts;
  const current = source.find((post) => post.slug === slug);
  if (!current) return source.slice(0, limit);
  return source
    .filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const overlap = (post: Post) =>
        post.tags.filter((tag) => current.tags.includes(tag)).length;
      return overlap(b) - overlap(a);
    })
    .slice(0, limit);
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function postCategories(posts: Post[]) {
  return Array.from(new Set(posts.map((post) => post.category))).sort();
}
