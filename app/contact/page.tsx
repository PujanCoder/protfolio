import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Pujan Pandey about AI/ML engineering, MLOps, cybersecurity, open-source collaboration or quantum computing.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Contact — Pujan Pandey",
    description:
      "Open to AI/ML engineering, MLOps and security engineering opportunities, plus open-source collaboration.",
    url: "/contact/",
  },
};

const collaborationAreas = [
  {
    title: "AI/ML projects",
    body: "Applied models where evaluation, data quality and failure modes are part of the brief.",
  },
  {
    title: "MLOps engineering",
    body: "Pipelines, experiment tracking, model registries, quality gates and monitoring.",
  },
  {
    title: "Cybersecurity",
    body: "Detection engineering, network telemetry and alert triage — including ML-assisted detection.",
  },
  {
    title: "Open-source",
    body: "Python tooling, Qiskit examples and small, well-tested libraries.",
  },
  {
    title: "Quantum computing",
    body: "Qiskit experiments and quantum machine-learning study groups.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell me what you are building, and what has to work."
        description="The fastest route is email. I read everything and reply to anything specific — a problem, a repository, a role or a collaboration."
      />

      <section className="py-14 md:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="mono-label">Direct</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-[13.5px] font-medium text-forest transition-colors hover:text-emerald-700"
                >
                  <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                  {profile.email}
                </a>
                <CopyEmailButton />
              </div>
              <dl className="mt-5 space-y-3 border-t border-line-soft pt-4 text-[12px]">
                <div className="flex items-center gap-2 text-quiet">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <dt className="sr-only">Location</dt>
                  <dd>
                    {profile.location} · {profile.timezone}
                  </dd>
                </div>
                <div className="flex items-center gap-2 text-quiet">
                  <Clock className="h-3.5 w-3.5 text-emerald-600" />
                  <dt className="sr-only">Response time</dt>
                  <dd>Usually within two working days</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-[12.5px] text-ink-soft transition-colors hover:border-emerald-200 hover:text-forest"
              >
                <span className="inline-flex items-center gap-2">
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-quiet" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-[12.5px] text-ink-soft transition-colors hover:border-emerald-200 hover:text-forest"
              >
                <span className="inline-flex items-center gap-2">
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-quiet" />
              </a>
            </div>

            <div className="rounded-xl border border-line bg-canvas-soft p-5">
              <p className="mono-label">Good reasons to write</p>
              <ul className="mt-3 space-y-3">
                {collaborationAreas.map((area) => (
                  <li key={area.title}>
                    <p className="text-[12.5px] font-medium text-ink">{area.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-quiet">
                      {area.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
