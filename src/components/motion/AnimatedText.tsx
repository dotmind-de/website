"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { reveal, stagger, staggerContainer, viewport } from "@/lib/motion";

type Segment = string | { text: string; className?: string };

type AnimatedTextProps = {
  /** Plain string, or segments to style individual words (e.g. a serif accent). */
  text: Segment | Segment[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Word-by-word masked reveal, triggered when scrolled into view.
 * Words stay real text nodes, so the heading reads normally to assistive tech.
 */
export function AnimatedText({ text, as = "h2", className, delay = 0, id }: AnimatedTextProps) {
  const Comp = motion[as] as typeof motion.h2;
  const segments = (Array.isArray(text) ? text : [text]).map((s) =>
    typeof s === "string" ? { text: s } : s,
  );

  const words = segments.flatMap((seg) =>
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, className: seg.className })),
  );

  return (
    <Comp
      id={id}
      className={className}
      variants={staggerContainer(stagger.words, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {words.map(({ word, className: wordClass }, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span className={`inline-block ${wordClass ?? ""}`} variants={reveal.line}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Comp>
  );
}
