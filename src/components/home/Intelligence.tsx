"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TokenStream } from "@/components/motion/TokenStream";
import { AiBadge } from "@/components/ui/AiBadge";
import { SectionHeading, type HeadingSegment } from "@/components/ui/SectionHeading";
import type { AiDomain } from "@/content/profile";
import type { Messages } from "@/i18n/messages/en";
import { cn } from "@/lib/cn";
import { NeuralDiagram } from "./NeuralDiagram";

/**
 * "Built for the age of AI": AI across the lifecycle, from design to smart home.
 * The diagram cycles through domains while in view; hovering a domain (or its
 * node) takes over and pauses the cycle.
 */
export function Intelligence({
  aiDomains,
  t,
  title,
}: {
  aiDomains: AiDomain[];
  t: Messages["intelligence"];
  title: HeadingSegment[];
}) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || held || reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % aiDomains.length), 3200);
    return () => window.clearInterval(id);
  }, [inView, held, reduced, aiDomains.length]);

  return (
    <section id="ai" aria-labelledby="ai-title" className="shell scroll-mt-20 py-28 md:py-40">
      <SectionHeading
        id="ai-title"
        index="02"
        label={t.label}
        title={title}
      />

      <div className="grid-editorial mt-12 gap-y-10 md:mt-16">
        <div className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-8 lg:col-start-4">
          <TokenStream
            className="t-lead max-w-3xl text-bone/90"
            text={t.text}
          />
        </div>
      </div>

      <div
        ref={ref}
        className="grid-editorial mt-16 items-center gap-y-12 md:mt-24"
        onMouseLeave={() => setHeld(false)}
      >
        {/* Diagram */}
        <Reveal variant="scale" className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-1">
          <div className="relative mx-auto max-w-[480px]">
            <div className="absolute inset-[12%] rounded-full bg-ember/5 blur-3xl" aria-hidden />
            <NeuralDiagram
              domains={aiDomains}
              active={active}
              onSelect={(i) => {
                setHeld(true);
                setActive(i);
              }}
            />
          </div>
        </Reveal>

        {/* Domains */}
        <ol className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          {aiDomains.map((d, i) => {
            const on = i === active;
            return (
              <li
                key={d.id}
                onMouseEnter={() => {
                  setHeld(true);
                  setActive(i);
                }}
                className={cn(
                  "relative border-t border-line py-7 ps-6 transition-colors duration-500 last:border-b md:py-8",
                  on ? "text-bone" : "text-muted",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute start-0 top-0 h-full w-px origin-top bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)]",
                    on ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="flex items-baseline gap-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                    <span className="font-mono text-xs font-normal text-ember">0{i + 1}</span>
                    {d.title}
                  </h3>
                  <span className="t-label text-muted">{d.kicker}</span>
                </div>
                <p className="mt-3 max-w-lg text-[0.95rem] text-muted">{d.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${d.title} — ${t.capabilities}`}>
                  {d.points.map((p) => (
                    <li
                      key={p}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-[0.7rem] transition-colors duration-500",
                        on ? "border-ember/40 text-bone" : "border-line text-muted",
                      )}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal className="mt-14 flex flex-wrap items-center gap-4 text-sm text-muted">
        <AiBadge label={t.badge} />
        <span>{t.note}</span>
      </Reveal>
    </section>
  );
}
