import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/lib/profile";

const pages = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/quantum-lab", label: "Quantum Lab" },
  { href: "/activity", label: "Activity" },
  { href: "/achievements", label: "Achievements" },
  { href: "/skills", label: "Skills" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas-soft">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
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
              Building intelligent systems and exploring what&apos;s possible —
              from production ML pipelines to quantum circuits.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mono-label">Pages</p>
            <ul className="mt-4 space-y-2.5">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-[13px] text-quiet transition-colors hover:text-forest"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mono-label">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
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
            </ul>
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
