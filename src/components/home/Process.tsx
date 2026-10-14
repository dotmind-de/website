"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, accent } from "@/components/ui/SectionHeading";
import { process } from "@/content/profile";
import { spring } from "@/lib/motion";

/** Six steps revealed progressively; a hairline fills as you read down the list. */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, spring.progress);

  return (
    <section aria-labelledby="process-title" className="shell py-28 md:py-40">
      <SectionHeading
        id="process-title"
        index="05"
        label="Process"
        title={["From first question to", accent("launch.")]}
        aside="A clear, repeatable path — so you always know where the project stands and what happens next."
      />

      <div className="grid-editorial mt-16 md:mt-24">
        <div className="relative col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4">
          {/* Progress rail */}
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <motion.div className="h-full w-full origin-top bg-ember" style={{ scaleY }} />
          </div>

          <ol ref={listRef}>
            {process.map((step, n) => (
              <Reveal as="li" key={step.title} className="group relative pl-8 md:pl-14">
                <span
                  aria-hidden
                  className="absolute left-0 top-9 h-2 w-2 -translate-x-1/2 rounded-full border border-ember bg-ink transition-colors duration-300 group-hover:bg-ember md:top-12"
                />
                <div className="grid gap-3 border-b border-line py-8 md:grid-cols-[6rem_1fr_1.2fr] md:items-baseline md:gap-8 md:py-10">
                  <span className="font-mono text-sm text-ember">0{n + 1}</span>
                  <h3 className="t-h3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    {step.title}
                  </h3>
                  <p className="text-muted">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
