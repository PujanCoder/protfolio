import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { Markdown } from "@/components/writing/markdown";
import { CTASection } from "@/components/ui";
import { formatPostDate, relatedPosts, type Post } from "@/lib/writing";

export function Article({ post }: { post: Post }) {
  const related = relatedPosts(post.kind, post.slug);
  const label = post.kind === "research" ? "Research" : "Writing";

  return (
    <>
      <article className="border-b border-line bg-white">
        <div className="container-page max-w-3xl py-12 md:py-16">
          <Link
            href={`/${post.kind}/`}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-quiet transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-3 w-3" />
            All {label.toLowerCase()}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-emerald-800">
              {post.category}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-quiet">
              {formatPostDate(post.date)} · {post.readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.02em] text-forest">
            {post.title}
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">{post.summary}</p>

          <div className="mt-6 flex flex-wrap gap-1.5 border-y border-line py-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-canvas-soft px-2 py-0.5 font-mono text-[9.5px] text-quiet"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Markdown source={post.body} />
          </div>

          <div className="mt-10 rounded-xl border border-line bg-canvas-soft/60 p-5">
            <p className="mono-label flex items-center gap-1.5">
              <FileText className="h-3 w-3" aria-hidden="true" />
              Evidence
            </p>
            <ul className="mt-3 space-y-2">
              {post.evidence.map((item) =>
                item.href.startsWith("/") ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft transition-colors hover:text-forest"
                    >
                      <ArrowRight className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft transition-colors hover:text-forest"
                    >
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-b border-line bg-canvas-soft/60">
          <div className="container-page max-w-3xl py-10">
            <p className="mono-label">Keep reading</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.kind}/${item.slug}/`}
                  className="group rounded-xl border border-line bg-white p-4 transition-colors hover:border-forest/25"
                >
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-quiet">
                    {item.category}
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink group-hover:text-forest">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        title="Questions about the method?"
        description="I am happy to walk through the code, the numbers, or the parts that did not work."
      />
    </>
  );
}
