"use client";

import { useEffect, useRef } from "react";

const EMBER = "242,160,91";
const BONE = "237,235,230";

type Pulse = { horizontal: boolean; line: number; pos: number; speed: number; dir: 1 | -1 };

/**
 * Ambient "neural field" behind the hero.
 * - Grid of nodes with a slow diagonal light band (ambient movement).
 * - Near the pointer, nodes activate and link to their neighbours — a small
 *   neural mesh that follows the cursor.
 * - Signal pulses travel along grid lines like data through a network.
 * Plain 2D canvas: no WebGL, DPR capped at 2, paused off-screen / tab hidden.
 * One static frame under reduced motion.
 */
export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const GAP = fine ? 28 : 34;
    const RADIUS = 210;
    const LINK = 0.14; // activation needed to draw a synapse
    const PULSES = fine ? 7 : 4;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let ox = 0;
    let oy = 0;
    let base = new Float32Array(0); // x,y pairs
    let pos = new Float32Array(0); // displaced x,y pairs
    let act = new Float32Array(0); // activation per node
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    const spawn = (p?: Pulse): Pulse => {
      const horizontal = Math.random() < 0.6;
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      const extent = horizontal ? w : h;
      const next = p ?? ({} as Pulse);
      next.horizontal = horizontal;
      next.line = Math.floor(Math.random() * (horizontal ? rows : cols));
      next.dir = dir;
      next.speed = 0.12 + Math.random() * 0.22; // px per ms
      next.pos = dir === 1 ? -Math.random() * extent * 0.8 : extent + Math.random() * extent * 0.8;
      return next;
    };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      ox = (w - (cols - 1) * GAP) / 2;
      oy = (h - (rows - 1) * GAP) / 2;
      base = new Float32Array(cols * rows * 2);
      pos = new Float32Array(cols * rows * 2);
      act = new Float32Array(cols * rows);
      let k = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          base[k++] = ox + c * GAP;
          base[k++] = oy + r * GAP;
        }
      }
      pulses = Array.from({ length: PULSES }, () => spawn());
      if (reduced) draw(0, 0);
    }

    function draw(t: number, dt: number) {
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      ctx!.clearRect(0, 0, w, h);

      // Nodes
      for (let n = 0, i = 0; i < base.length; n++, i += 2) {
        const x = base[i];
        const y = base[i + 1];
        const band = 0.5 + 0.5 * Math.sin(x * 0.0035 + y * 0.0055 - t * 0.00035);
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inf = dist < RADIUS ? 1 - dist / RADIUS : 0;
        const a = inf * inf;
        act[n] = a;
        const push = a * 8;
        const px = dist > 0 ? x + (dx / dist) * push : x;
        const py = dist > 0 ? y + (dy / dist) * push : y;
        pos[i] = px;
        pos[i + 1] = py;
        const size = 1.2 + a * 2.4;

        if (a > 0.04) {
          ctx!.fillStyle = `rgba(${EMBER},${0.3 + a * 0.7})`;
        } else {
          ctx!.fillStyle = `rgba(${BONE},${0.07 + band * band * 0.2})`;
        }
        ctx!.fillRect(px - size / 2, py - size / 2, size, size);
      }

      // Synapses between active neighbours (right, down, both diagonals)
      ctx!.lineWidth = 0.7;
      for (let n = 0; n < act.length; n++) {
        const a = act[n];
        if (a < LINK) continue;
        const c = n % cols;
        const neighbours = [
          c < cols - 1 ? n + 1 : -1,
          n + cols,
          c < cols - 1 ? n + cols + 1 : -1,
          c > 0 ? n + cols - 1 : -1,
        ];
        for (const m of neighbours) {
          if (m < 0 || m >= act.length || act[m] < LINK) continue;
          ctx!.strokeStyle = `rgba(${EMBER},${Math.min(a, act[m]) * 0.55})`;
          ctx!.beginPath();
          ctx!.moveTo(pos[n * 2], pos[n * 2 + 1]);
          ctx!.lineTo(pos[m * 2], pos[m * 2 + 1]);
          ctx!.stroke();
        }
      }

      // Signal pulses along grid lines
      if (!reduced) {
        const TRAIL = 110;
        ctx!.lineWidth = 1;
        for (const p of pulses) {
          p.pos += p.speed * p.dir * dt;
          const extent = p.horizontal ? w : h;
          if ((p.dir === 1 && p.pos - TRAIL > extent) || (p.dir === -1 && p.pos + TRAIL < 0)) spawn(p);
          const fixed = p.horizontal ? oy + p.line * GAP : ox + p.line * GAP;
          const head = p.pos;
          const tail = p.pos - TRAIL * p.dir;
          const [x1, y1, x2, y2] = p.horizontal ? [tail, fixed, head, fixed] : [fixed, tail, fixed, head];
          const g = ctx!.createLinearGradient(x1, y1, x2, y2);
          g.addColorStop(0, `rgba(${EMBER},0)`);
          g.addColorStop(1, `rgba(${EMBER},0.55)`);
          ctx!.strokeStyle = g;
          ctx!.beginPath();
          ctx!.moveTo(x1, y1);
          ctx!.lineTo(x2, y2);
          ctx!.stroke();
          ctx!.fillStyle = `rgba(${EMBER},0.9)`;
          ctx!.fillRect(x2 - 1.5, y2 - 1.5, 3, 3);
        }
      }
    }

    function loop(t: number) {
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (!raf && visible && !document.hidden && !reduced) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
    };
    const onPointerOut = () => {
      pointer.tx = -1e4;
      pointer.ty = -1e4;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    if (fine && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerOut);
    }
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
