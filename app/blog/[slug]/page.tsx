import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/writing/article";
import { blogPosts, getPost } from "@/lib/writing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("blog", slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}/`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost("blog", slug);
  if (!post) notFound();
  return <Article post={post} />;
}
