"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { profile } from "@/lib/profile";

type Values = { name: string; email: string; message: string; website: string };

const initialValues: Values = { name: "", email: "", message: "", website: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "ready">("idle");
  const startedAt = useRef(0);

  const update =
    (field: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === "name" && !startedAt.current) startedAt.current = Date.now();
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setStatus("idle");
    };

  const validate = () => {
    const next: Partial<Record<keyof Values, string>> = {};
    if (values.name.trim().length < 2) {
      next.name = "Please enter your name (at least 2 characters).";
    }
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (values.message.trim().length < 20) {
      next.message = "Please add at least 20 characters of context.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.website.trim() !== "") return;
    if (!validate()) return;

    // Bots that skip validation still submit instantly; humans take longer.
    const elapsed = startedAt.current ? Date.now() - startedAt.current : 0;
    if (elapsed < 1200) return;

    const subject = `Portfolio enquiry — ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setStatus("ready");
  };

  const inputClass = (field: keyof Values) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder:text-quiet/60 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/25 ${
      errors[field]
        ? "border-rose-400"
        : "border-line hover:border-gray-300 focus:border-emerald-500"
    }`;

  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <div>
        <p className="mono-label">Send a message</p>
        <p className="mt-1.5 text-[12px] text-quiet">
          Opens a pre-filled draft in your mail client.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="relative mt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[11.5px] text-ink-soft">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass("name")}
              placeholder="Your name"
            />
            {errors.name ? (
              <p id="name-error" className="mt-1.5 text-[11px] text-rose-600">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-[11.5px] text-ink-soft">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass("email")}
              placeholder="you@company.com"
            />
            {errors.email ? (
              <p id="email-error" className="mt-1.5 text-[11px] text-rose-600">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="message" className="text-[11.5px] text-ink-soft">
              Message
            </label>
            <span className="font-mono text-[9.5px] text-quiet/70">
              {values.message.length}/1200
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={6}
            maxLength={1200}
            value={values.message}
            onChange={update("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            className={`${inputClass("message")} resize-y`}
            placeholder="What are you building, and what does success look like?"
          />
          {errors.message ? (
            <p id="message-error" className="mt-1.5 text-[11px] text-rose-600">
              {errors.message}
            </p>
          ) : (
            <p id="message-hint" className="mt-1.5 text-[10.5px] text-quiet/80">
              A sentence about the problem is more useful than a long pitch.
            </p>
          )}
        </div>

        <div aria-hidden="true" className="absolute left-0 top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={update("website")}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-forest-deep"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Open email draft
          </button>
          <p className="max-w-xs text-[10.5px] leading-relaxed text-quiet">
            Nothing is sent to a server and no data is stored. Validation runs in
            the browser before the draft opens.
          </p>
        </div>

        <p
          aria-live="polite"
          className={`mt-4 text-[11.5px] ${
            status === "ready" ? "text-emerald-700" : "sr-only"
          }`}
        >
          {status === "ready"
            ? "Your email client should open with the draft. If it does not, copy the address above."
            : ""}
        </p>
      </form>
    </div>
  );
}
