"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { reveal, staggerContainer, viewport, type RevealVariant } from "@/lib/motion";

type Tag = "div" | "section" | "article" | "header" | "li" | "ul" | "ol" | "p" | "span" | "figure";

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
};

/** Reveals its content once when scrolled into view. */
export function Reveal({ children, as = "div", variant = "fadeUp", delay = 0, className }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={reveal[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = {
  children: ReactNode;
  as?: Tag;
  each?: number;
  delay?: number;
  className?: string;
};

/** Parent that staggers `<StaggerItem>` children when scrolled into view. */
export function Stagger({ children, as = "div", each, delay, className }: StaggerProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={staggerContainer(each, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  as = "div",
  variant = "fadeUp",
  className,
}: {
  children: ReactNode;
  as?: Tag;
  variant?: RevealVariant;
  className?: string;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={reveal[variant]}>
      {children}
    </Comp>
  );
}
