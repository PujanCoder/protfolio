import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/writing/article";
import { getPost, researchPosts } from "@/lib/writing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return researchPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("research", slug);
  if (!post) return { title: "Note not found" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/research/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/research/${post.slug}/`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function ResearchNotePage({ params }: Params) {
  const { slug } = await params;
  const post = getPost("research", slug);
  if (!post) notFound();
  return <Article post={post} />;
}
