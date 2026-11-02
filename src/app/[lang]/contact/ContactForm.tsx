"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "@/components/ui/Icons";
import { site } from "@/content/site";
import { localePath, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { sendInquiry } from "./actions";
import { BUDGETS, PROJECT_TYPES, TIMELINES, type Field, type InquiryState } from "./inquiry";

type T = Messages["contact"];

/** Project inquiry: works without JavaScript; with it, errors and success render in place. */
export function ContactForm({ lang, t, privacyLabel }: { lang: Locale; t: T; privacyLabel: string }) {
  // Remounting the form gives a clean slate for "send another inquiry".
  const [round, setRound] = useState(0);
  return <InquiryForm key={round} lang={lang} t={t} privacyLabel={privacyLabel} onReset={() => setRound((r) => r + 1)} />;
}

function InquiryForm({ lang, t, privacyLabel, onReset }: { lang: Locale; t: T; privacyLabel: string; onReset: () => void }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(sendInquiry, { status: "idle" });
  const started = useRef<HTMLInputElement>(null);
  const firstSeen = useRef(0);
  const summary = useRef<HTMLDivElement>(null);
  const f = t.form;

  // Time on the form (spam check). Re-applied after each response, since React resets the form.
  useEffect(() => {
    firstSeen.current ||= Date.now();
    if (started.current) started.current.value = String(firstSeen.current);
    if (state.status === "error") summary.current?.focus();
  }, [state]);

  if (state.status === "success") return <Success lang={lang} t={t} name={state.name} email={state.email} onReset={onReset} />;

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const errorList = Object.entries(errors) as [Field, string][];

  return (
    <form action={action} noValidate className="relative space-y-14 md:space-y-16" aria-describedby="form-note">
      <input type="hidden" name="lang" value={lang} />
      <input ref={started} type="hidden" name="started" defaultValue="" />
      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap opacity-0 [clip-path:inset(50%)]">
        <label>
          {f.honeypot}
          <input type="text" name="fax" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="rounded-[4px] border border-ember/50 bg-ember/[0.06] px-5 py-4 text-[0.95rem] outline-none"
        >
          {state.server ? (
            <p>
              {f.errors.server}{" "}
              <a href={`mailto:${site.email}`} className="text-ember underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          ) : (
            <>
              <p className="font-medium">{f.errors.summary}</p>
              <ul className="mt-2 space-y-1 text-muted">
                {errorList.map(([field, msg]) => (
                  <li key={field}>
                    <a href={`#f-${field}`} className="underline decoration-ember/60 underline-offset-4 hover:text-bone">
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <Group index="01" title={f.groups.project}>
        <Choice
          name="projectType"
          legend={f.projectType}
          options={PROJECT_TYPES.map((k) => ({ value: k, label: f.types[k] }))}
          value={values.projectType}
          error={errors.projectType}
          required
          wide
        />
        <TextField
          as="textarea"
          name="goal"
          label={f.goal}
          hint={f.goalHint}
          value={values.goal}
          error={errors.goal}
          required
        />
        <TextField name="website" label={f.website} hint={f.websiteHint} value={values.website} type="url" autoComplete="url" inputMode="url" dir="ltr" />
      </Group>

      <Group index="02" title={f.groups.frame}>
        <Choice name="budget" legend={f.budget} options={BUDGETS.map((k) => ({ value: k, label: f.budgets[k] }))} value={values.budget} />
        <Choice name="timeline" legend={f.timeline} options={TIMELINES.map((k) => ({ value: k, label: f.timelines[k] }))} value={values.timeline} />
      </Group>

      <Group index="03" title={f.groups.you}>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
          <TextField name="name" label={f.name} value={values.name} error={errors.name} autoComplete="name" required />
          <TextField name="company" label={f.company} hint={f.companyHint} value={values.company} autoComplete="organization" />
          <TextField name="email" label={f.email} value={values.email} error={errors.email} type="email" autoComplete="email" dir="ltr" required />
          <TextField name="phone" label={f.phone} hint={f.phoneHint} value={values.phone} type="tel" autoComplete="tel" dir="ltr" />
        </div>
      </Group>

      <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p id="form-note" className="max-w-md text-sm text-muted">
          {f.privacy}{" "}
          <Link href={localePath(lang, "/datenschutz")} className="link-underline text-bone">
            {privacyLabel}
          </Link>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex h-14 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full bg-bone pe-6 ps-7 text-[0.95rem] font-medium text-ink transition-opacity disabled:cursor-progress disabled:opacity-70"
        >
          {/* The brand dot breathes while sending; deep ember because the button is bone (light ground) */}
          {pending && <span aria-hidden className="dot-breathe h-2.5 w-2.5 rounded-full bg-[#C8641E]" />}
          <span aria-live="polite">{pending ? f.sending : f.submit}</span>
          {!pending && <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />}
        </button>
      </div>
    </form>
  );
}

function Group({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-y-8 md:grid-cols-[11rem_1fr] md:gap-x-10">
      <h3 className="t-label flex gap-3 text-muted md:pt-1">
        <span className="text-ember">{index}</span> {title}
      </h3>
      <div className="space-y-10">{children}</div>
    </section>
  );
}

const fieldBase =
  "w-full rounded-[4px] border bg-ink-2/60 px-4 py-3.5 text-[1rem] text-bone placeholder:text-subtle transition-colors focus:border-bone/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember/40";

function TextField({
  as = "input",
  name,
  label,
  hint,
  value,
  error,
  required,
  ...rest
}: {
  as?: "input" | "textarea";
  name: Field;
  label: string;
  hint?: string;
  value?: string;
  error?: string;
  required?: boolean;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "type" | "autoComplete" | "inputMode" | "dir">) {
  const id = `f-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    defaultValue: value,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cn(fieldBase, error ? "border-ember/70" : "border-line-strong", rest.dir === "ltr" && "rtl:text-right"),
  };
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-[0.95rem] text-bone">
        <span>
          {label}
          {required && <span aria-hidden className="ms-1 text-ember">*</span>}
        </span>
        {hint && as === "input" && (
          <span id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </span>
        )}
      </label>
      {hint && as === "textarea" && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="mt-3">
        {as === "textarea" ? <textarea rows={5} {...common} className={cn(common.className, "min-h-36 resize-y")} /> : <input {...rest} {...common} />}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

/** Radio group styled as chips; a real fieldset so it works with keyboard and screen readers. */
function Choice({
  name,
  legend,
  options,
  value,
  error,
  required,
  wide,
}: {
  name: Field;
  legend: string;
  options: { value: string; label: string }[];
  value?: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <fieldset id={id} tabIndex={-1} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className="outline-none">
      <legend className="text-[0.95rem] text-bone">
        {legend}
        {required && <span aria-hidden className="ms-1 text-ember">*</span>}
      </legend>
      <div className={cn("mt-4 grid gap-2", wide ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:flex sm:flex-wrap")}>
        {options.map((o) => (
          <label key={o.value} className="relative cursor-pointer">
            <input type="radio" name={name} value={o.value} defaultChecked={value === o.value} required={required} className="peer sr-only" />
            <span
              className={cn(
                "flex h-full min-h-12 items-center rounded-[4px] border px-4 py-2.5 text-sm text-muted transition-colors",
                "hover:border-bone/50 hover:text-bone",
                "peer-checked:border-ember peer-checked:bg-ember/[0.08] peer-checked:text-bone",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ember/50",
                error ? "border-ember/50" : "border-line-strong",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-ember">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Confirmation in place of the form: thanks by name, what happens next, and where to go from here. */
function Success({ lang, t, name, email, onReset }: { lang: Locale; t: T; name: string; email: string; onReset: () => void }) {
  const s = t.success;
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const first = name.split(" ")[0] || name;

  useEffect(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const item = (n: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.15 + n * 0.08, duration: 0.8, ease: ease.out } },
  });

  const [before, accent] = s.title;
  return (
    <div role="status" className="relative overflow-hidden rounded-[2px] border border-line px-6 py-12 md:px-12 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_0%,rgb(242_160_91/0.14),transparent_70%)]" />

      <motion.div {...item(0)} className="relative flex items-center gap-4">
        <svg aria-hidden viewBox="0 0 48 48" className="h-12 w-12">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ember/40" />
          <motion.path
            d="M15 24.5l6 6 12-13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ember"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1, transition: { delay: 0.3, duration: 0.7, ease: ease.out } }}
          />
        </svg>
        <p className="t-label text-ember">{s.label}</p>
      </motion.div>

      <motion.h3 {...item(1)} ref={heading} tabIndex={-1} className="t-h2 relative mt-8 outline-none">
        {before} <span className="serif-accent font-normal text-ember">{accent.replace(/^\*|\*$/g, "").replace("{name}", first)}</span>
      </motion.h3>
      <motion.p {...item(2)} className="t-lead relative mt-6 max-w-2xl text-muted">
        {s.text.split("{email}")[0]}
        <span dir="ltr" className="text-bone">
          {email}
        </span>
        {s.text.split("{email}")[1]}
      </motion.p>

      <motion.div {...item(3)} className="relative mt-12 border-t border-line pt-8">
        <p className="t-label text-muted">{s.nextTitle}</p>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {s.steps.map((step, n) => (
            <li key={step}>
              <span className="font-mono text-xs text-ember">0{n + 1}</span>
              <p className="mt-3 text-[0.95rem] text-bone/90">{step}</p>
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.p {...item(4)} className="relative mt-10 max-w-2xl rounded-[4px] bg-bone/[0.04] px-5 py-4 text-sm text-muted">
        {s.prepare}
      </motion.p>

      <motion.div {...item(5)} className="relative mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <Link
            href={localePath(lang, "/projects")}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-bone px-6 text-sm font-medium text-ink"
          >
            {s.seeWork}
            <ArrowRight size={14} className="rtl:-scale-x-100" />
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm text-bone hover:border-bone/60"
          >
            {s.another}
          </button>
        </div>
        <p className="text-xs text-muted">
          {s.noEmail}{" "}
          <a href={`mailto:${site.email}`} className="text-bone underline underline-offset-4" dir="ltr">
            {site.email}
          </a>
        </p>
      </motion.div>
    </div>
  );
}
