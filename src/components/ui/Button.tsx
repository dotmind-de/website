import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRight, ArrowUpRight } from "./Icons";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type ButtonLinkProps = {
  href: string;
  children: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Extra context for screen readers, appended visually hidden. */
  srSuffix?: string;
};

const isExternal = (href: string) => /^(https?:)?\/\//.test(href);

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-colors duration-300 isolate";

const sizes: Record<Size, string> = {
  md: "h-14 pl-7 pr-6 text-[0.95rem]",
  sm: "h-10 pl-5 pr-4 text-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-bone text-ink",
  ghost: "border border-line-strong text-bone hover:border-bone/60",
};

/**
 * Pill button link with a text roll + fill wipe on hover.
 * External links get an ↗ icon, open in a new tab and announce it.
 */
export function ButtonLink({ href, children, variant = "primary", size = "md", className, srSuffix }: ButtonLinkProps) {
  const external = isExternal(href);
  const Icon = external ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 translate-y-full rounded-full bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        />
      )}
      <span className="text-roll">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <Icon
        size={size === "md" ? 18 : 15}
        className={cn(
          "transition-transform duration-500 ease-[var(--ease-out-expo)]",
          external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1",
        )}
      />
      {srSuffix && <span className="sr-only"> {srSuffix}</span>}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  const classes = cn(base, sizes[size], variants[variant], className);

  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Inline text link with animated underline and arrow. External links use ↗. */
export function ArrowLink({
  href,
  children,
  className,
  srSuffix,
}: {
  href: string;
  children: string;
  className?: string;
  srSuffix?: string;
}) {
  const external = isExternal(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    "group inline-flex items-center gap-2 font-medium text-bone transition-colors hover:text-ember focus-visible:text-ember",
    className,
  );
  const inner = (
    <>
      <span className="link-underline pb-0.5">{children}</span>
      <Icon
        size={15}
        className={cn(
          "transition-transform duration-500 ease-[var(--ease-out-expo)]",
          external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1",
        )}
      />
      {srSuffix && <span className="sr-only"> {srSuffix}</span>}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
