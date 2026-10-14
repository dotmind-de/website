"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Section surface with a soft ambient glow that follows the pointer.
 * Writes CSS variables directly (no React re-render per move).
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`group/spot relative isolate ${className ?? ""}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-700 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 40%), rgb(242 160 91 / 0.13), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
