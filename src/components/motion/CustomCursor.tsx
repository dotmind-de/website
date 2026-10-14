"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointerMotion } from "@/lib/hooks";
import { spring } from "@/lib/motion";

type CursorState = { mode: "default" | "link" | "view" | "hidden"; label?: string };

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";

/**
 * Small dot + trailing ring. The ring grows on interactive elements and shows a
 * label over elements with `data-cursor="view"` (+ optional `data-cursor-label`).
 * Only mounts for fine pointers with motion allowed.
 */
export function CustomCursor() {
  const enabled = useFinePointerMotion();
  return enabled ? <Cursor /> : null;
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, spring.cursorRing);
  const ry = useSpring(y, spring.cursorRing);
  const [state, setState] = useState<CursorState>({ mode: "hidden" });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest<HTMLElement>(INTERACTIVE);
      const next: CursorState = !el
        ? { mode: "default" }
        : el.dataset.cursor === "view"
          ? { mode: "view", label: el.dataset.cursorLabel ?? "View" }
          : { mode: "link" };
      setState((prev) => (prev.mode === next.mode && prev.label === next.label ? prev : next));
    };
    const onLeave = () => setState({ mode: "hidden" });
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  const ringSize = state.mode === "view" ? 88 : state.mode === "link" ? 52 : 30;
  const hidden = state.mode === "hidden";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* Ring */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.85 : 1,
          backgroundColor: state.mode === "view" ? "rgba(242,160,91,1)" : "rgba(242,160,91,0)",
          borderColor: state.mode === "link" ? "rgba(242,160,91,0.9)" : "rgba(237,235,230,0.35)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <AnimatePresence>
          {state.mode === "view" && (
            <motion.span
              key={state.label}
              className="t-label relative text-[0.65rem] text-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-bone"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden || state.mode === "view" ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
