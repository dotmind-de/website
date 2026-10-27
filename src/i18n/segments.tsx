import { Fragment, type ReactNode } from "react";
import { accent } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const isAccent = (s: string) => s.startsWith("*") && s.endsWith("*") && s.length > 2;
const strip = (s: string) => s.slice(1, -1);

/** ["Four disciplines,", "*one*", "way"] → segments for <SectionHeading> / <AnimatedText>. */
export const toSegments = (parts: string[]) => parts.map((p) => (isAccent(p) ? accent(strip(p)) : p));

/** Same input, rendered as inline nodes with the serif accent. */
export function rich(parts: string[] | string, accentClass = "serif-accent font-normal"): ReactNode {
  const list = typeof parts === "string" ? [parts] : parts;
  return list.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {isAccent(p) ? <span className={cn(accentClass)}>{strip(p)}</span> : p}
    </Fragment>
  ));
}

/** "Hello {name}" + { name: "Reza" } → "Hello Reza" */
export const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
