import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { profile } from "@/lib/profile";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pujanpandey.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pujan Pandey — AI/ML Engineer & MLOps Developer",
    template: "%s — Pujan Pandey",
  },
  description:
    "Pujan Pandey is an AI/ML engineer and MLOps developer in Butwal, Nepal, building production machine-learning systems, network intrusion detection platforms and quantum computing experiments.",
  keywords: [
    "Pujan Pandey",
    "AI engineer Nepal",
    "MLOps engineer",
    "machine learning portfolio",
    "network intrusion detection",
    "Qiskit",
    "quantum computing",
    "FastAPI",
    "MLflow",
    "DVC",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    title: "Pujan Pandey — AI/ML Engineer & MLOps Developer",
    description:
      "Building intelligent systems. Exploring what's possible. Machine learning, MLOps, security engineering and quantum computing.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Pujan Pandey — AI/ML Engineer" },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pujan Pandey — AI/ML Engineer & MLOps Developer",
    description:
      "Building intelligent systems. Exploring what's possible. Machine learning, MLOps, security engineering and quantum computing.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: "AI/ML Engineer",
  description: profile.summary,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Butwal",
    addressCountry: "NP",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Machine Learning",
    "MLOps",
    "Deep Learning",
    "Cybersecurity",
    "Quantum Computing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2.5 focus:text-[13px] focus:text-white"
        >
          Skip to content
        </a>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
