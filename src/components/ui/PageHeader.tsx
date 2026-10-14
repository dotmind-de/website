import type { CSSProperties, ReactNode } from "react";

/**
 * Inner-page hero. `lines` render as masked lines (CSS reveal, pre-hydration).
 * Each line can be a string or a node (e.g. with a serif accent).
 */
export function PageHeader({
  eyebrow,
  lines,
  intro,
  children,
}: {
  eyebrow: ReactNode;
  lines: ReactNode[];
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="shell pb-16 pt-36 md:pb-24 md:pt-48">
      <p className="fade-in t-label flex flex-wrap items-center gap-3 text-muted" style={{ "--i": 0 } as CSSProperties}>
        {eyebrow}
      </p>
      <h1 className="t-h1 mt-8">
        {lines.map((line, n) => (
          <span key={n} className="line-mask">
            <span style={{ "--i": n + 1 } as CSSProperties}>{line}</span>
          </span>
        ))}
      </h1>
      {intro && (
        <div className="fade-in t-lead mt-10 max-w-2xl text-muted" style={{ "--i": lines.length + 1 } as CSSProperties}>
          {intro}
        </div>
      )}
      {children}
    </header>
  );
}
