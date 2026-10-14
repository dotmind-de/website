import type { Transition, Variants } from "motion/react";

/**
 * Central motion tokens. Components import from here instead of
 * hard-coding durations, curves or offsets.
 */

export const ease = {
  /** Arrivals — fast start, long soft landing. */
  out: [0.22, 1, 0.36, 1],
  /** Exits — accelerate away. */
  in: [0.55, 0, 1, 0.45],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.8,
  reveal: 1,
} as const;

export const stagger = {
  words: 0.035,
  items: 0.08,
} as const;

export const spring = {
  magnetic: { stiffness: 180, damping: 16, mass: 0.2 },
  cursorRing: { stiffness: 260, damping: 26, mass: 0.5 },
  progress: { stiffness: 120, damping: 30, restDelta: 0.001 },
} as const satisfies Record<string, Transition>;

/** Shared viewport trigger for scroll reveals: fire once, a little before fully in view. */
export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

export const reveal = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: duration.reveal, ease: ease.out } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: duration.slow, ease: ease.out } },
  },
  /** For children inside an overflow-hidden mask. */
  line: {
    hidden: { y: "110%" },
    visible: { y: "0%", transition: { duration: duration.reveal, ease: ease.out } },
  },
} satisfies Record<string, Variants>;

export type RevealVariant = keyof typeof reveal;

export const staggerContainer = (each: number = stagger.items, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren } },
});

/** Mobile menu / overlays: enter slow, exit ~60% of enter. */
export const overlay = {
  enter: { duration: 0.7, ease: ease.inOut },
  exit: { duration: 0.45, ease: ease.in },
} as const;
