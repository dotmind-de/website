"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Moves its child vertically against the scroll. Place inside an
 * overflow-hidden frame; the child is scaled up slightly so edges never show.
 */
export function Parallax({
  children,
  amount = 8,
  className,
}: {
  children: ReactNode;
  /** Travel in percent of the element's own height. */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={`h-full w-full ${className ?? ""}`}>
      <motion.div
        className="h-full w-full"
        style={reduced ? undefined : { y, scale: 1 + (amount * 2.2) / 100 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
