import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { footerGroups } from "@/lib/navigation";
import { profile } from "@/lib/profile";
import { withBase } from "@/lib/base-path";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas-soft">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest text-[12.5px] font-semibold text-white">
                PP
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{profile.name}</p>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-quiet">
                  {profile.location}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-quiet">
              Building intelligent systems and exploring what&apos;s possible — from
              production ML pipelines to quantum circuits.
            </p>

            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[13px] text-quiet transition-colors hover:text-forest"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[13px] text-quiet transition-colors hover:text-forest"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-[13px] text-quiet transition-colors hover:text-forest"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </a>
              </li>
              <li>
                {/* File download, not a page navigation, so a plain anchor is correct here. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href={withBase("/cv/pujan-pandey-cv-general.pdf")}
                  download
                  className="inline-flex items-center gap-2 text-[13px] text-quiet transition-colors hover:text-forest"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CV (PDF)
                </a>
              </li>
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="mono-label">{group.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-quiet transition-colors hover:text-forest"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[11.5px] text-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js,
            TypeScript and Tailwind CSS.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em]">
            Every claim links back to a public repository
          </p>
        </div>
      </div>
    </footer>
  );
}
