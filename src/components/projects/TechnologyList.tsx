import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/cn";

/** Compact, typographic list of technologies (no logo wall). */
export function TechnologyList({
  items,
  className,
  emptyLabel = "Add technologies",
}: {
  items: string[];
  className?: string;
  emptyLabel?: string;
}) {
  if (items.length === 0) return <Placeholder className={className}>{emptyLabel}</Placeholder>;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Technologies">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] tracking-wide text-muted transition-colors duration-300 hover:border-ember/50 hover:text-bone"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
