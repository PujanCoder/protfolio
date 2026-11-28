import Link from "next/link";
import type { ReactNode } from "react";

/** Minimal markdown subset: headings, paragraphs, lists, quotes, code fences and inline emphasis. */

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(INLINE).filter((part) => part !== "");
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-canvas-soft px-1 py-0.5 font-mono text-[0.92em] text-forest ring-1 ring-line-soft"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = href.startsWith("http");
      return external ? (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-forest underline decoration-emerald-300 decoration-1 underline-offset-2 hover:decoration-emerald-600"
        >
          {label}
        </a>
      ) : (
        <Link
          key={key}
          href={href}
          className="text-forest underline decoration-emerald-300 decoration-1 underline-offset-2 hover:decoration-emerald-600"
        >
          {label}
        </Link>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; code: string };

export function parseMarkdown(source: string): Block[] {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const line of lines) {
    if (code) {
      if (line.trim().startsWith("```")) {
        blocks.push({ type: "code", code: code.join("\n") });
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }
    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();
      code = [];
      continue;
    }
    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: line.slice(2) });
      continue;
    }
    const bullet = line.match(/^- (.*)$/);
    if (bullet) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    const ordered = line.match(/^\d+\. (.*)$/);
    if (ordered) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  if (code) blocks.push({ type: "code", code: code.join("\n") });
  return blocks;
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.type === "h2") {
          return (
            <h2
              key={key}
              className="pt-3 text-[clamp(1.15rem,1.9vw,1.4rem)] font-medium leading-snug tracking-[-0.01em] text-forest"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={key} className="pt-1 text-[1.02rem] font-medium text-ink">
              {block.text}
            </h3>
          );
        }
        if (block.type === "p") {
          return (
            <p key={key} className="text-[14.5px] leading-[1.75] text-ink-soft">
              {inline(block.text, key)}
            </p>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-emerald-400 bg-emerald-50/40 px-4 py-3 text-[13.5px] leading-relaxed text-ink-soft"
            >
              {inline(block.text, key)}
            </blockquote>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type === "ul" ? "ul" : "ol";
          return (
            <Tag
              key={key}
              className={`space-y-2 pl-5 text-[14.5px] leading-[1.7] text-ink-soft ${
                block.type === "ul" ? "list-disc" : "list-decimal"
              } marker:text-emerald-500`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{inline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "code") {
          return (
            <pre
              key={key}
              className="overflow-x-auto rounded-xl border border-line bg-[#0d1a14] p-4 text-[12px] leading-relaxed text-emerald-50"
            >
              <code>{block.code}</code>
            </pre>
          );
        }
        return null;
      })}
    </div>
  );
}
