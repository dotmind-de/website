"use client";

import { motion } from "motion/react";
import { Sparkle } from "@/components/ui/Icons";
import type { JourneyStage } from "@/content/profile";
import { ease, reveal, staggerContainer, viewport } from "@/lib/motion";

/**
 * Professional journey. Horizontal on large screens (the line draws left → right
 * as stages appear), vertical on smaller screens. Native scroll — no pinning.
 */
/** Index of the "Artificial Intelligence" stage. */
const AI = 4;

export function Timeline({ journey }: { journey: JourneyStage[] }) {
  return (
    <motion.ol
      className="relative grid gap-y-12 xl:grid-cols-6 xl:gap-x-8"
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {/* Horizontal rail (xl) */}
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 top-[0.3rem] hidden h-px origin-left bg-line-strong rtl:origin-right xl:block"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 1.6, ease: ease.inOut } },
        }}
      />
      {/* Vertical rail (< xl) */}
      <span aria-hidden className="absolute bottom-0 start-[0.3rem] top-2 w-px bg-line-strong xl:hidden" />

      {journey.map((stage, n) => (
        <motion.li key={stage.title} variants={reveal.fadeUp} className="group relative ps-8 xl:ps-0 xl:pt-10">
          <span
            aria-hidden
            className={`absolute start-0 top-0 h-[0.6rem] w-[0.6rem] rounded-full border border-ember transition-colors ${
              n === journey.length - 1 ? "bg-ember" : "bg-ink group-hover:bg-ember"
            }`}
          />
          <p className="t-label flex flex-wrap items-center gap-2 text-muted">
            <span className="text-ember">0{n + 1}</span>
            {stage.period}
          </p>
          <h3 className="mt-4 flex items-center gap-2 text-xl font-semibold tracking-[-0.025em] md:text-2xl">
            {stage.title}
            {n === AI && <Sparkle size={14} className="text-ember" />}
          </h3>
          <p className="t-label mt-2 text-bone/70">{stage.context}</p>
          <p className="mt-4 max-w-sm text-[0.95rem] text-muted">{stage.description}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
