import { cn } from "@/lib/cn";
import { Sparkle } from "./Icons";

/** Small marker for AI-related work. */
export function AiBadge({ className, label = "AI" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "ai-sheen inline-flex items-center gap-1.5 rounded-full border border-ember/40 px-2.5 py-0.5 font-mono text-[0.68rem] font-medium tracking-[0.08em] text-ember",
        className,
      )}
    >
      <Sparkle size={11} />
      {label}
    </span>
  );
}
