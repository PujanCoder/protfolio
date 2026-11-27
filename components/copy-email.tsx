"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/lib/profile";

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${profile.email}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-quiet transition-colors hover:border-forest/30 hover:text-forest"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
