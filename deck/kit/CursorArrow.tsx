"use client";

import type { RefObject } from "react";
import { D } from "../theme";
import { asset } from "@/lib/asset";

/**
 * The deck's one pointer shape, a Figma-multiplayer-style arrowhead. The presenter's real mouse uses it as a CSS
 * cursor (public/deck/cursor.svg, same path, in blue); the agent's drawn pointer uses it in orange with its name tag.
 * Authored in a 32-unit box with the tip at (4, 3).
 */
export const ARROW_PATH = "M4 3 L11 25 L14.2 14.2 L25 10.6 Z";
export const ARROW_TIP = { x: 4, y: 3 };
/** where the click lands: the outer edge of the white outline at the tip, one unit past the path's vertex */
export const CURSOR_HOTSPOT = { x: 3, y: 2 };
export const CURSOR_CSS = `url("${asset("/deck/cursor.svg")}") ${CURSOR_HOTSPOT.x} ${CURSOR_HOTSPOT.y}, default`;

/** The arrow, drawn so that its tip sits exactly at the parent's (0, 0). `size` is the box edge in stage px. */
export function CursorArrow({ color, size = 44 }: { color: string; size?: number }) {
  const k = size / 32;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className="absolute"
      style={{ left: -ARROW_TIP.x * k, top: -ARROW_TIP.y * k, overflow: "visible", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))" }}
      aria-hidden
    >
      <path d={ARROW_PATH} fill="none" stroke={D.ink} strokeOpacity={0.55} strokeWidth={4.6} strokeLinejoin="round" />
      <path d={ARROW_PATH} fill={color} stroke="#ffffff" strokeWidth={2.2} strokeLinejoin="round" />
    </svg>
  );
}

/** The name tag that rides with an arrow, below and to the right of the tip (Figma style). */
export function CursorTag({ label, color, ink, size = 44 }: { label: string; color: string; ink: string; size?: number }) {
  const k = size / 32;
  return (
    <span
      className="absolute whitespace-nowrap rounded-full px-[18px] py-[8px] text-[26px] font-bold leading-none"
      style={{ left: 17 * k, top: 22 * k, background: color, color: ink, boxShadow: "0 8px 20px rgba(0,0,0,.35)" }}
    >
      {label}
    </span>
  );
}

/**
 * A positioned pointer driven by a ref (for the cover's per-frame loop): place it with covers/kit/Cursor's place().
 * Starts hidden.
 */
export function RefPointer({ refEl, label, color = D.agent, ink = D.agentInk }: { refEl: RefObject<HTMLDivElement | null>; label: string; color?: string; ink?: string }) {
  return (
    <div ref={refEl} className="pointer-events-none absolute left-0 top-0 z-50 will-change-transform" style={{ opacity: 0 }} aria-hidden>
      <CursorArrow color={color} />
      <CursorTag label={label} color={color} ink={ink} />
    </div>
  );
}
