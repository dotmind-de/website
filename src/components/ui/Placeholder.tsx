import { cn } from "@/lib/cn";

/**
 * Visible, honest marker for information that hasn't been provided yet.
 * Screen readers hear "Placeholder: …".
 */
export function Placeholder({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border border-dashed border-ember/45 bg-ember-soft/40 px-2 py-0.5 align-middle font-mono text-[0.72rem] leading-snug tracking-wide text-ember/90",
        className,
      )}
    >
      <span className="sr-only">Placeholder: </span>
      <span aria-hidden className="opacity-70">
        [
      </span>
      {children}
      <span aria-hidden className="opacity-70">
        ]
      </span>
    </span>
  );
}

/** Renders the value, or a placeholder describing what to add. */
export function OrPlaceholder({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <Placeholder>{label}</Placeholder>;
}
