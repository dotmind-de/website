import type { CSSProperties } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { AiBadge } from "@/components/ui/AiBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { rich } from "@/i18n/segments";
import { getHref, getMessages } from "@/i18n/server";
import { HeroField } from "./HeroField";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Hero. Text reveals are CSS keyframes (they run before hydration, so the
 * LCP text paints immediately); the ambient field and magnetic CTA hydrate after.
 */
export async function Hero() {
  const m = await getMessages();
  const t = m.hero;
  const href = await getHref();
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-28 md:pb-10 md:pt-36"
    >
      {/* Ambient layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="ambient-drift absolute -right-[20%] -top-[30%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(closest-side,rgb(242_160_91/0.16),transparent)] blur-2xl" />
        <div className="ambient-drift absolute -bottom-[40%] -left-[25%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(237_235_230/0.05),transparent)] blur-2xl [animation-delay:-11s]" />
        <HeroField className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_75%_70%_at_60%_45%,black_25%,transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="shell relative flex flex-1 flex-col">
        {/* Eyebrow */}
        <div className="fade-in t-label flex flex-wrap items-center justify-between gap-4 text-muted" style={i(0)}>
          <p className="flex items-center gap-3">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            {t.eyebrow}
          </p>
          <p className="hidden md:block">{t.portfolio} · {new Date().getFullYear()}</p>
        </div>

        <div className="mt-auto flex flex-col">
          {/* Brand — first in DOM for reading order, placed last visually */}
          <h1 id="hero-title" className="order-2 mt-10 md:mt-14">
            <span className="sr-only">{site.name} </span>
            <span className="line-mask block">
              <span className="block" style={i(2)}>
                <Logo title={null} className="block h-auto w-full max-w-[min(100%,68rem)] text-bone" />
              </span>
            </span>
            <span className="fade-in t-label mt-5 block text-muted md:mt-7" style={i(4)}>
              <span lang="en">
                {m.common.by} {site.founder}
              </span>
            </span>
          </h1>

          <div className="order-1 grid-editorial gap-y-10">
            {/* Roles */}
            <ul aria-label={t.disciplines} className="col-span-4 md:col-span-4 lg:col-span-5">
              {site.roles.map((role, n) => {
                const ai = role.startsWith("AI");
                return (
                  <li key={role} className="line-mask">
                    <span className="flex items-baseline gap-4 py-0.5" style={i(n)}>
                      <span className="font-mono text-xs text-ember">0{n + 1}</span>
                      <span className="t-h3 font-medium">
                        {ai ? <ScrambleText text={role} delay={0.9} className="text-ember" /> : role}
                      </span>
                      {ai && <AiBadge label={t.coreFocus} className="hidden self-center sm:inline-flex" />}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Statement + CTAs */}
            <div className="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-8">
              <p className="fade-in t-lead max-w-[32ch] text-muted" style={i(2)}>
                {rich(t.statement, "serif-accent text-[1.15em] text-bone")}
              </p>
              <div className="fade-in mt-8 flex flex-wrap items-center gap-3" style={i(4)}>
                <Magnetic>
                  <ButtonLink href={href("/projects")}>{t.viewWork}</ButtonLink>
                </Magnetic>
                <ButtonLink href={href("/contact")} variant="ghost">
                  {t.workTogether}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rail */}
        <div className="fade-in mt-8 flex items-end justify-between border-t border-line pt-5 md:mt-10" style={i(6)}>
          <a href="#intro" className="group flex items-center gap-3 text-sm text-muted hover:text-bone">
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-ember" />
            </span>
            <span className="link-underline">{t.scroll}</span>
          </a>
          <p className="t-label hidden text-muted sm:block">
            {t.rail.map((step, n) => (
              <span key={step}>
                {n > 0 && <span className="mx-1.5 text-ember rtl:inline-block rtl:-scale-x-100">→</span>}
                {step}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
