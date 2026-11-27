"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  ariaLabel?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  ariaLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel ?? label}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-quiet transition-colors hover:border-forest/30 hover:text-forest"
      }
    >
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
