"use client";

import { useReducedMotion } from "motion/react";
import type { AiDomain } from "@/content/profile";

/** Satellite positions in a 400×400 viewBox, clockwise from top-left. */
const NODES = [
  { x: 78, y: 86 },
  { x: 322, y: 86 },
  { x: 322, y: 314 },
  { x: 78, y: 314 },
];
const CORE = { x: 200, y: 200 };

/** Gentle curve from the core to a satellite. */
const edgePath = (n: { x: number; y: number }, bend: number) => {
  const mx = (CORE.x + n.x) / 2 + bend;
  const my = (CORE.y + n.y) / 2 - bend;
  return `M${CORE.x},${CORE.y} Q${mx},${my} ${n.x},${n.y}`;
};

/** Decorative secondary neurons around each satellite. */
const NEURONS = NODES.flatMap((n, i) =>
  [0, 28, 56].map((spread, k) => {
    // Fan outward and away from the label: down for top nodes, up for bottom nodes.
    const v = n.y < CORE.y ? 1 : -1;
    const deg = n.x < CORE.x ? 180 - v * spread : v * spread;
    const angle = deg * (Math.PI / 180);
    const r = 40 + k * 8;
    return { from: n, x: n.x + Math.cos(angle) * r, y: n.y + Math.sin(angle) * r, key: `${i}-${k}` };
  }),
);

/**
 * AI core connected to the four domains. The active domain's edge lights up
 * and carries faster signals. Purely decorative (aria-hidden): the list beside
 * it carries the content.
 */
export function NeuralDiagram({
  domains,
  active,
  onSelect,
}: {
  domains: AiDomain[];
  active: number;
  onSelect?: (i: number) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="#f2a05b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f2a05b" stopOpacity="0" />
        </radialGradient>
        {NODES.map((n, i) => (
          <path key={i} id={`edge-${i}`} d={edgePath(n, i % 2 ? 26 : -26)} />
        ))}
      </defs>

      {/* Orbits */}
      <g className="spin-slow" style={{ transformOrigin: "200px 200px" }}>
        <circle cx={200} cy={200} r={150} fill="none" stroke="rgb(237 235 230 / 0.08)" strokeDasharray="2 7" />
        <circle cx={350} cy={200} r={2.5} fill="#f2a05b" opacity={0.7} />
      </g>
      <circle cx={200} cy={200} r={96} fill="none" stroke="rgb(237 235 230 / 0.06)" />

      {/* Secondary neurons */}
      {NEURONS.map((d) => (
        <g key={d.key} opacity={0.5}>
          <line x1={d.from.x} y1={d.from.y} x2={d.x} y2={d.y} stroke="rgb(237 235 230 / 0.12)" />
          <circle cx={d.x} cy={d.y} r={1.8} fill="rgb(237 235 230 / 0.4)" />
        </g>
      ))}

      {/* Edges + signals */}
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g key={i}>
            <use
              href={`#edge-${i}`}
              fill="none"
              stroke={on ? "#f2a05b" : "rgb(237 235 230 / 0.16)"}
              strokeWidth={on ? 1.4 : 1}
              style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
            />
            {!reduced && (
              <circle r={on ? 3.2 : 2} fill="#f2a05b" opacity={on ? 1 : 0.55}>
                <animateMotion
                  dur={on ? "1.4s" : `${3 + i * 0.6}s`}
                  repeatCount="indefinite"
                  keyPoints={i % 2 ? "0;1" : "1;0"}
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath href={`#edge-${i}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        );
      })}

      {/* Core */}
      <circle cx={200} cy={200} r={78} fill="url(#core-glow)" />
      <circle cx={200} cy={200} r={42} fill="#111113" stroke="#f2a05b" strokeWidth={1.2} />
      <text
        x={200}
        y={208}
        textAnchor="middle"
        fill="#edebe6"
        style={{ font: "600 24px var(--font-geist), sans-serif", letterSpacing: "-0.04em" }}
      >
        AI
      </text>

      {/* Satellites */}
      {NODES.map((n, i) => {
        const on = i === active;
        return (
          <g
            key={i}
            onMouseEnter={() => onSelect?.(i)}
            style={{ cursor: onSelect ? "pointer" : undefined }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={on ? 9 : 6}
              fill={on ? "#f2a05b" : "#0a0a0b"}
              stroke="#f2a05b"
              strokeWidth={1.2}
              style={{ transition: "r 0.4s, fill 0.4s" }}
            />
            {on && !reduced && (
              <circle cx={n.x} cy={n.y} r={9} fill="none" stroke="#f2a05b">
                <animate attributeName="r" from="9" to="24" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <text
              x={n.x}
              y={n.y + (n.y < 200 ? -20 : 30)}
              textAnchor="middle"
              fill={on ? "#edebe6" : "#9a9893"}
              style={{ font: "500 13px var(--font-geist-mono), monospace", letterSpacing: "0.08em", transition: "fill 0.4s" }}
            >
              {domains[i]?.title.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
