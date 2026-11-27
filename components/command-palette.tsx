"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { allRoutes } from "@/lib/navigation";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return allRoutes;
    return allRoutes.filter((route) =>
      `${route.label} ${route.description ?? ""} ${route.href}`.toLowerCase().includes(needle),
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function go(href: string) {
    close();
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[active];
      if (target) go(target.href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-[12px] text-quiet transition-colors hover:border-forest/30 hover:text-forest md:inline-flex"
        aria-label="Search the site"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden rounded border border-line bg-canvas-soft px-1.5 py-0.5 font-mono text-[10px] text-quiet lg:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Close search"
            onClick={close}
            className="absolute inset-0 bg-forest-deep/25 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <Search className="h-4 w-4 text-quiet" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages, labs and case studies"
                aria-label="Search pages"
                aria-controls="palette-results"
                className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-quiet/70"
              />
              <kbd className="rounded border border-line bg-canvas-soft px-1.5 py-0.5 font-mono text-[10px] text-quiet">
                esc
              </kbd>
            </div>
            <ul
              id="palette-results"
              ref={listRef}
              className="max-h-[52vh] overflow-y-auto p-1.5"
              role="listbox"
              aria-label="Results"
            >
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-[12.5px] text-quiet">
                  Nothing matches “{query}”. Try “architecture”, “quantum” or “cv”.
                </li>
              ) : (
                results.map((route, index) => (
                  <li key={route.href} role="option" aria-selected={index === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(route.href)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        index === active ? "bg-emerald-50 text-forest" : "text-ink-soft"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium">{route.label}</span>
                        {route.description ? (
                          <span className="block truncate text-[11.5px] text-quiet">
                            {route.description}
                          </span>
                        ) : null}
                      </span>
                      {index === active ? (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-line" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
