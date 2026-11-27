"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { CommandPalette } from "@/components/command-palette";
import { ModeToggle } from "@/components/mode/mode-toggle";
import { useMode } from "@/components/mode/mode-provider";
import { allRoutes, engineerNav, recruiterNav } from "@/lib/navigation";
import { profile } from "@/lib/profile";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { mode } = useMode();
  const [open, setOpen] = useState(false);
  const nav = mode === "recruiter" ? recruiterNav : engineerNav;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label={`${profile.name} — home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest text-[12.5px] font-semibold tracking-tight text-white transition-colors group-hover:bg-forest-deep">
            PP
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14.5px] font-semibold tracking-tight text-ink">
              {profile.name}
            </span>
            <span className="mt-1 hidden font-mono text-[9.5px] uppercase tracking-[0.16em] text-quiet sm:block">
              AI · ML · Quantum
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-2.5 py-2 text-[12.5px] transition-colors ${
                  active ? "font-medium text-forest" : "text-quiet hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2.5 -bottom-[13px] h-[2px] rounded-full bg-emerald-600 transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <ModeToggle compact />
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 rounded-lg border border-line px-3 py-2 text-[12.5px] text-ink-soft transition-colors hover:border-forest/30 hover:bg-emerald-50/60 hover:text-forest lg:inline-flex"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
            <ArrowUpRight className="h-3 w-3 text-quiet" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-canvas-soft xl:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-white xl:hidden">
        <nav aria-label="Mobile" className="container-page max-h-[calc(100vh-4rem)] overflow-y-auto py-3">
          <ul className="divide-y divide-line-soft">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-3 text-[14px] ${
                      active ? "font-medium text-forest" : "text-ink-soft"
                    }`}
                  >
                    {item.label}
                    {active ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mono-label mt-6">Every section</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4">
            {allRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="flex items-center justify-between border-b border-line-soft py-2 text-[12.5px] text-quiet"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-[13px] text-ink-soft"
          >
            <GitHubIcon className="h-4 w-4" />
            github.com/{profile.githubHandle}
            <ArrowUpRight className="h-3.5 w-3.5 text-quiet" />
          </a>
        </nav>
      </div>
    </header>
  );
}
