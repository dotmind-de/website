"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/{}[]#*+=_ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * "Decoding" text: characters resolve left → right out of machine glyphs,
 * like a model producing output. Renders the final text on the server and
 * under reduced motion; the real text is always what screen readers get.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 38,
}: {
  text: string;
  className?: string;
  /** Seconds after entering the viewport. */
  delay?: number;
  /** Milliseconds per resolved character. */
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    let start = 0;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const resolved = Math.floor((now - start) / speed);
        if (resolved >= text.length) {
          setDisplay(text);
          return;
        }
        setDisplay(
          text
            .split("")
            .map((ch, i) =>
              ch === " " || i < resolved ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, reduced, text, delay, speed]);

  return (
    <span ref={ref} className={`relative inline-grid ${className ?? ""}`}>
      {/* Invisible real text reserves the final width — no layout shift while decoding */}
      <span aria-hidden className="invisible [grid-area:1/1]">
        {text}
      </span>
      <span aria-hidden className="overflow-hidden whitespace-nowrap [grid-area:1/1]">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
