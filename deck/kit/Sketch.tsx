"use client";

import type { CSSProperties } from "react";

/**
 * The deck's hand-drawn stroke: diagrams, connectors and arrows look sketched, panels and type stay clean.
 * Paths are generated, not filtered, so they cost nothing to render. The jitter is seeded, so a slide draws
 * the same sketch every time.
 */

type P = [number, number];

function rng(seed: number) {
  let s = Math.abs(Math.floor(seed * 9301 + 49297)) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
}

/** A line from a to b that bows a little, like a pen stroke. */
export function sketchLine([x1, y1]: P, [x2, y2]: P, seed = 1, amp = 1): string {
  const r = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const bow = Math.min(18, len * 0.03) * amp;
  const a = 0.25 + r() * 0.1;
  const b = 0.75 + r() * 0.1;
  const o1 = bow * (r() * 2);
  const o2 = bow * (r() * 2);
  const c1: P = [x1 + (x2 - x1) * a + nx * o1, y1 + (y2 - y1) * a + ny * o1];
  const c2: P = [x1 + (x2 - x1) * b + nx * o2, y1 + (y2 - y1) * b + ny * o2];
  const j = 1.6 * amp;
  return `M${(x1 + r() * j).toFixed(1)} ${(y1 + r() * j).toFixed(1)} C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${(x2 + r() * j).toFixed(1)} ${(y2 + r() * j).toFixed(1)}`;
}

/** A smooth hand-drawn curve through points (Catmull-Rom), each point nudged a little. */
export function sketchCurve(points: P[], seed = 1, amp = 1): string {
  const r = rng(seed);
  const pts = points.map(([x, y], i) => (i === 0 || i === points.length - 1 ? [x, y] : [x + r() * 6 * amp, y + r() * 6 * amp]) as P);
  if (pts.length < 3) return sketchLine(pts[0], pts[pts.length - 1], seed, amp);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A rectangle drawn as four strokes that overshoot their corners slightly. */
export function sketchRect(x: number, y: number, w: number, h: number, seed = 1, amp = 1): string {
  const o = 7 * amp;
  return [
    sketchLine([x - o, y], [x + w + o * 0.4, y], seed, amp * 0.5),
    sketchLine([x + w, y - o * 0.6], [x + w, y + h + o], seed + 1, amp * 0.5),
    sketchLine([x + w + o * 0.5, y + h], [x - o * 0.3, y + h], seed + 2, amp * 0.5),
    sketchLine([x, y + h + o * 0.4], [x, y - o * 0.5], seed + 3, amp * 0.5),
  ].join(" ");
}

/** Two short strokes forming an open arrow head at (x, y), pointing along `angle` (radians). */
export function sketchArrowHead([x, y]: P, angle: number, size = 22, seed = 1): string {
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  return [
    sketchLine([x + Math.cos(a1) * size, y + Math.sin(a1) * size], [x, y], seed, 0.4),
    sketchLine([x, y], [x + Math.cos(a2) * size, y + Math.sin(a2) * size], seed + 5, 0.4),
  ].join(" ");
}

/**
 * Draws a sketched path. `draw` animates it on (pen moving along the path); `double` adds a fainter second
 * pass with a different seed, the way a quick sketch goes over a line twice.
 */
export function Stroke({
  d,
  d2,
  color,
  width = 4,
  draw = true,
  delay = 0,
  dur = 900,
  dash,
  opacity = 1,
  style,
}: {
  d: string;
  /** optional second pass */
  d2?: string;
  color: string;
  width?: number;
  /** false hides the stroke (and rewinds it) */
  draw?: boolean;
  delay?: number;
  dur?: number;
  /** dashed stroke: drawn on with opacity instead of dash offset */
  dash?: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  const base: CSSProperties = dash
    ? { opacity: draw ? opacity : 0, transition: `opacity ${dur}ms ease ${draw ? delay : 0}ms` }
    : {
        strokeDasharray: 1,
        strokeDashoffset: draw ? 0 : 1,
        opacity: draw ? opacity : 0,
        transition: `stroke-dashoffset ${dur}ms cubic-bezier(.55,.1,.3,1) ${draw ? delay : 0}ms, opacity 200ms linear ${draw ? delay : 0}ms`,
      };
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={color} strokeWidth={width} pathLength={dash ? undefined : 1} strokeDasharray={dash} style={{ ...base, ...style }} />
      {d2 && (
        <path
          d={d2}
          stroke={color}
          strokeWidth={Math.max(1.5, width * 0.45)}
          pathLength={dash ? undefined : 1}
          strokeDasharray={dash}
          style={{ ...base, opacity: draw ? opacity * 0.45 : 0, transitionDelay: `${draw ? delay + dur * 0.35 : 0}ms`, ...style }}
        />
      )}
    </g>
  );
}

/** A sketched connector with an arrow head at the end. */
export function Arrow({
  from,
  to,
  bend = 0,
  color,
  width = 4,
  draw = true,
  delay = 0,
  dur = 800,
  seed = 1,
  head = true,
  dash,
}: {
  from: P;
  to: P;
  /** curvature: pixels the middle bows to the side */
  bend?: number;
  color: string;
  width?: number;
  draw?: boolean;
  delay?: number;
  dur?: number;
  seed?: number;
  head?: boolean;
  dash?: string;
}) {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
  const nx = -(to[1] - from[1]) / len;
  const ny = (to[0] - from[0]) / len;
  const mid: P = [mx + nx * bend, my + ny * bend];
  const d = bend ? sketchCurve([from, mid, to], seed) : sketchLine(from, to, seed);
  const d2 = bend ? sketchCurve([from, [mid[0] + 3, mid[1] - 2], to], seed + 7) : sketchLine(from, to, seed + 7);
  // the head follows the last segment's direction
  const tail: P = bend ? [mid[0] + (to[0] - mid[0]) * 0.8, mid[1] + (to[1] - mid[1]) * 0.8] : from;
  const angle = Math.atan2(to[1] - tail[1], to[0] - tail[0]);
  return (
    <>
      <Stroke d={d} d2={dash ? undefined : d2} color={color} width={width} draw={draw} delay={delay} dur={dur} dash={dash} />
      {head && <Stroke d={sketchArrowHead(to, angle, 18 + width * 2, seed)} color={color} width={width} draw={draw} delay={delay + dur * 0.85} dur={260} />}
    </>
  );
}

/** Full-stage SVG layer for strokes, authored in stage coordinates. */
export function SketchLayer({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 ${className}`} width={1920} height={1080} viewBox="0 0 1920 1080" style={style} aria-hidden>
      {children}
    </svg>
  );
}
