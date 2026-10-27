"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/content/site";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { LanguageList, LanguageSwitcher, type LanguageOption } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";
import { ease, overlay } from "@/lib/motion";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

type NavProps = { lang: Locale; t: Messages["nav"]; languages: LanguageOption[] };

export function Navigation({ lang, t, languages }: NavProps) {
  const pathname = stripLocale(usePathname() ?? "/");
  const href = (path: string) => localePath(lang, path);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), [setOpen]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "absolute inset-0 -z-10 border-b transition-all duration-500",
          scrolled ? "border-line bg-ink/75 backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      />
      <div
        className={cn(
          "shell flex items-center justify-between transition-[height] duration-500 ease-[var(--ease-out-expo)]",
          scrolled ? "h-16" : "h-16 md:h-24",
        )}
      >
        <Link
          href={href("/")}
          className="group relative z-[61] flex items-center gap-3 text-bone"
          aria-label={`${site.name} by ${site.founder} — ${t.homeLabel}`}
        >
          <Logo title={null} intro className="block h-5 w-auto md:h-[22px]" />
          <span lang="en" className="t-label hidden whitespace-nowrap text-[0.62rem] text-muted transition-colors group-hover:text-bone md:inline">
            by {site.founder}
          </span>
        </Link>

        <nav aria-label={t.primary} className="hidden md:block">
          <ul className="flex items-center gap-10">
            {site.nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-baseline gap-1.5 text-sm transition-colors duration-300",
                      active ? "text-bone" : "text-muted hover:text-bone",
                    )}
                  >
                    <span aria-hidden className={cn("font-mono text-[0.62rem]", active ? "text-ember" : "text-muted/70 group-hover:text-ember")}>
                      0{i + 1}
                    </span>
                    <span className="link-underline">{t[item.key]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher lang={lang} languages={languages} label={t.language} chooseLabel={t.chooseLanguage} />
          <Magnetic strength={0.25}>
            <ButtonLink href={href("/contact")} size="sm">
              {t.letsTalk}
            </ButtonLink>
          </Magnetic>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-[61] -mr-3 flex h-11 items-center gap-3 px-3 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? t.close : t.menu}</span>
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 h-px w-full bg-bone transition-transform duration-500 ease-[var(--ease-out-expo)]",
                open ? "top-1/2 rotate-45" : "top-0.5",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-px w-full bg-bone transition-transform duration-500 ease-[var(--ease-out-expo)]",
                open ? "top-1/2 -rotate-45" : "bottom-0.5",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <MobileMenu
            pathname={pathname}
            onClose={close}
            returnFocusTo={toggleRef}
            lang={lang}
            t={t}
            languages={languages}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileMenu({
  pathname,
  onClose,
  returnFocusTo,
  lang,
  t,
  languages,
}: {
  pathname: string;
  onClose: () => void;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
} & NavProps) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const toggle = returnFocusTo.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [onClose, returnFocusTo]);

  const links = [{ key: "home" as const, href: "/" }, ...site.nav];

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.siteMenu}
      className="fixed inset-0 z-60 flex flex-col bg-ink-2 pt-24 md:hidden"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)", transition: overlay.enter }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: overlay.exit }}
    >
      <nav aria-label={t.mobile} className="shell flex-1">
        <ul className="border-t border-line">
          {links.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
            return (
              <li key={item.href} className="overflow-hidden border-b border-line">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0%", transition: { delay: 0.25 + i * 0.06, duration: 0.8, ease: ease.out } }}
                  exit={{ y: "100%", transition: { duration: 0.3, ease: ease.in } }}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={localePath(lang, item.href)}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline justify-between py-5 text-[2.6rem] font-semibold leading-none tracking-[-0.045em]"
                  >
                    <span className={active ? "text-ember" : undefined}>{t[item.key]}</span>
                    <span aria-hidden className="font-mono text-xs text-muted">0{i + 1}</span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>
      <motion.div
        className="shell space-y-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.55, duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <LanguageList lang={lang} languages={languages} label={t.language} onNavigate={onClose} className="pb-4" />
        <p className="t-label text-muted">{t.getInTouch}</p>
        {site.email ? (
          <a href={`mailto:${site.email}`} className="block text-lg">
            {site.email}
          </a>
        ) : (
          <Placeholder>Email address</Placeholder>
        )}
        {site.phone && (
          <a href={site.phone.href} className="block text-lg">
            {site.phone.display}
          </a>
        )}
        {site.whatsapp && (
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="block text-lg">
            WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
