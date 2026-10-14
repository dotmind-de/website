"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { spring } from "@/lib/motion";

/** Hairline reading-progress indicator at the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, spring.progress);
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-ember"
      style={{ scaleX }}
    />
  );
}
