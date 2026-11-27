"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { formatPostDate, postCategories, type Post, type PostKind } from "@/lib/writing";

export function PostIndex({ posts, kind }: { posts: Post[]; kind: PostKind }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const categories = useMemo(() => postCategories(posts), [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      if (!matchesCategory) return false;
      if (!needle) return true;
      return [post.title, post.summary, post.category, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search {kind === "research" ? "research notes" : "articles"}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-quiet" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, tags, topics…"
            className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-[12.5px] text-ink outline-none placeholder:text-quiet/70 focus:border-emerald-500"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              category === "all"
                ? "border-forest bg-forest text-white"
                : "border-line bg-white text-quiet hover:border-emerald-300 hover:text-forest"
            }`}
          >
            All {posts.length}
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                category === item
                  ? "border-forest bg-forest text-white"
                  : "border-line bg-white text-quiet hover:border-emerald-300 hover:text-forest"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-white px-4 py-8 text-center text-[12.5px] text-quiet">
          Nothing matches “{query}”. Try a tag like <span className="font-mono">MLOps</span> or clear the
          filters.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line-soft border-y border-line">
          {filtered.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${kind}/${post.slug}/`}
                className="group grid gap-2 py-5 transition-colors hover:bg-canvas-soft/50 md:grid-cols-[1fr_auto] md:items-start md:gap-6 md:px-2"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-emerald-700">
                      {post.category}
                    </span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                      {formatPostDate(post.date)} · {post.readingMinutes} min
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[15.5px] font-medium leading-snug text-ink group-hover:text-forest">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-quiet">{post.summary}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2 py-0.5 font-mono text-[9.5px] text-quiet"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-700 md:mt-1">
                  Read
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
