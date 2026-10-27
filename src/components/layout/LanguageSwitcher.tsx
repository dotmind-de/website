"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export type LanguageOption = { code: Locale; native: string; short: string };

/** Same page in another language. */
function useSwitchHref() {
  const pathname = usePathname() ?? "/";
  const path = stripLocale(pathname);
  return (code: Locale) => localePath(code, path);
}

/**
 * Header switcher: the current language code as a quiet button; the menu lists every
 * language in its own script (no flags — languages aren't countries) and keeps the page.
 */
export function LanguageSwitcher({
  lang,
  languages,
  label,
  chooseLabel,
}: {
  lang: Locale;
  languages: LanguageOption[];
  label: string;
  chooseLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const hrefFor = useSwitchHref();
  const current = languages.find((l) => l.code === lang)!;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${chooseLabel} — ${label}: ${current.native}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-3 font-mono text-[0.72rem] tracking-[0.08em] transition-colors",
          open ? "border-bone/60 text-bone" : "border-line-strong text-muted hover:border-bone/50 hover:text-bone",
        )}
      >
        {current.short}
        <svg aria-hidden width="9" height="9" viewBox="0 0 10 10" className={cn("transition-transform", open && "rotate-180")}>
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          className="absolute end-0 top-[calc(100%+0.6rem)] z-[70] min-w-[13rem] overflow-hidden rounded-[6px] border border-line-strong bg-ink-2/98 p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md"
        >
          {languages.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <Link
                  href={hrefFor(l.code)}
                  hrefLang={l.code}
                  lang={l.code}
                  dir={l.code === "fa" || l.code === "ar" ? "rtl" : "ltr"}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-6 rounded-[4px] px-3 py-2.5 text-[0.95rem] transition-colors",
                    active ? "bg-bone/[0.06] text-bone" : "text-muted hover:bg-bone/[0.04] hover:text-bone",
                  )}
                >
                  <span>{l.native}</span>
                  <span className={cn("font-mono text-[0.68rem]", active ? "text-ember" : "text-subtle")}>{l.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Compact language row for the mobile menu and the footer. */
export function LanguageList({
  lang,
  languages,
  label,
  onNavigate,
  className,
}: {
  lang: Locale;
  languages: LanguageOption[];
  label: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const hrefFor = useSwitchHref();
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap gap-2">
        {languages.map((l) => {
          const active = l.code === lang;
          return (
            <li key={l.code}>
              <Link
                href={hrefFor(l.code)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={active ? "true" : undefined}
                onClick={onNavigate}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                  active ? "border-ember/70 text-bone" : "border-line-strong text-muted hover:border-bone/50 hover:text-bone",
                )}
              >
                {l.native}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
