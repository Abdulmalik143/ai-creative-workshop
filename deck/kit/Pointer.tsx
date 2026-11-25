"use client";

import { useEffect, useRef, useState } from "react";
import { D } from "../theme";
import { prefersReducedMotion } from "./beats";
import { CursorArrow, CursorTag } from "./CursorArrow";

/** A stop on a pointer's route, in stage coordinates. `at` is ms from the start of the move. */
export type Waypoint = { x: number; y: number; at: number; click?: boolean };

export const AGENT_LABEL = "الوكيل";
export const DESIGNER_LABEL = "المصمم";

/**
 * A named pointer that moves along a scripted route: the agent's (orange, «الوكيل») or the designer's (sky).
 * Same Figma-style arrowhead as the presenter's real cursor; the colour and the name tag tell them apart.
 * Its tip sits exactly on each waypoint.
 * Every stop is a place where something happens; the route is written next to the elements it builds,
 * with the same timings, so the pointer never wanders for decoration.
 *
 * play  = run the route now (from its first stop)
 * done  = the route is behind us: rest at the last stop
 * neither = hidden at the first stop
 */
export function Pointer({
  path,
  play,
  done = false,
  label = AGENT_LABEL,
  color = D.agent,
  ink = D.agentInk,
  size = 1,
}: {
  path: readonly Waypoint[];
  play: boolean;
  done?: boolean;
  label?: string;
  color?: string;
  ink?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tap, setTap] = useState(0);
  const key = path.map((p) => `${p.x},${p.y},${p.at},${p.click ? 1 : 0}`).join(";");

  useEffect(() => {
    const el = ref.current;
    if (!el || !path.length) return;
    const first = path[0];
    const last = path[path.length - 1];
    const tr = (p: Waypoint) => `translate(${p.x}px, ${p.y}px)`;
    if (done || (play && prefersReducedMotion())) {
      el.style.transform = tr(last);
      el.style.opacity = "1";
      return;
    }
    if (!play) {
      el.style.transform = tr(first);
      el.style.opacity = "0";
      return;
    }
    const total = Math.max(1, last.at);
    el.style.opacity = "1";
    el.style.transform = tr(first);
    const anim = el.animate(
      path.map((p) => ({ transform: tr(p), offset: Math.min(1, p.at / total), easing: "cubic-bezier(.55,0,.2,1)" })),
      { duration: total, fill: "forwards" },
    );
    anim.onfinish = () => {
      el.style.transform = tr(last);
    };
    const timers = path.filter((p) => p.click).map((p) => window.setTimeout(() => setTap((n) => n + 1), p.at + 40));
    return () => {
      anim.cancel();
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, done, key]);

  return (
    <div ref={ref} className="pointer-events-none absolute left-0 top-0 z-[60] will-change-transform" style={{ opacity: 0, transition: "opacity .3s" }} aria-hidden>
      <div style={{ transform: `scale(${size})`, transformOrigin: "0 0" }}>
        {tap > 0 && (
          <span
            key={tap}
            className="absolute -left-[26px] -top-[26px] h-[52px] w-[52px] rounded-full"
            style={{ border: `3px solid ${color}`, animation: "deck-tap .55s ease-out both" }}
          />
        )}
        <CursorArrow color={color} />
        <CursorTag label={label} color={color} ink={ink} />
      </div>
    </div>
  );
}
