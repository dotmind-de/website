"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Text that "streams" in word by word with a blinking caret, the way a
 * language model writes. Words are real text from the start (hidden via
 * opacity), so layout never shifts and assistive tech reads the full sentence.
 */
export function TokenStream({
  text,
  className,
  interval = 55,
}: {
  text: string;
  className?: string;
  /** Milliseconds per token. */
  interval?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const tokens = text.split(/(\s+)/).filter(Boolean);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= tokens.length) window.clearInterval(id);
        return Math.min(c + 1, tokens.length);
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [inView, reduced, tokens.length, interval]);

  const shown = reduced ? tokens.length : count;
  const done = shown >= tokens.length;

  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => (
        <span key={i} style={{ opacity: i < shown ? 1 : 0 }} className="transition-opacity duration-300">
          {t}
        </span>
      ))}
      <span
        aria-hidden
        className={`ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.12em] bg-ember ${done ? "caret-blink" : ""}`}
      />
    </p>
  );
}
