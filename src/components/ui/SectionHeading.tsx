import type { ReactNode } from "react";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { cn } from "@/lib/cn";

type Segment = string | { text: string; className?: string };

/**
 * Editorial section header: index + label on the left rail, headline on the right.
 */
export function SectionHeading({
  index,
  label,
  title,
  aside,
  id,
  className,
}: {
  index: string;
  label: string;
  title: Segment[];
  aside?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("grid-editorial gap-y-6 border-t border-line pt-6", className)}>
      <p className="t-label col-span-4 flex gap-3 text-muted md:col-span-2 lg:col-span-3">
        <span className="text-ember">({index})</span>
        <span>{label}</span>
      </p>
      <div className="col-span-4 md:col-span-6 lg:col-span-9">
        <AnimatedText as="h2" id={id} text={title} className="t-h2 max-w-[18ch]" />
        {aside && <div className="mt-8 max-w-xl text-muted">{aside}</div>}
      </div>
    </header>
  );
}

/** Serif-italic accent segment helper for headlines. */
export const accent = (text: string): Segment => ({ text, className: "serif-accent font-normal text-bone" });
