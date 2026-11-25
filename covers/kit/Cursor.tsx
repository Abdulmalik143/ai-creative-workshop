"use client";

import type { RefObject } from "react";
import type { V } from "./math";

/** A named multiplayer cursor. Position it with place(); it starts hidden. */
export function Cursor({ color, label, refEl }: { color: string; label: string; refEl: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={refEl} className="pointer-events-none absolute left-0 top-0 z-50 will-change-transform" style={{ opacity: 0 }}>
      <svg width="34" height="40" viewBox="0 0 34 40" className="absolute left-0 top-0 drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]">
        <path d="M3 2 L3 30 L10 23.5 L15.5 36 L21 33.6 L15.6 21.4 L25 20.6 Z" fill={color} stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
      <span
        className="absolute left-[26px] top-[34px] whitespace-nowrap rounded-full px-[18px] py-[8px] text-[26px] font-bold leading-none text-white"
        style={{ background: color }}
      >
        {label}
      </span>
    </div>
  );
}

export function place(el: HTMLElement | null, v: V, opacity = 1) {
  if (!el) return;
  el.style.transform = `translate(${v.x}px, ${v.y}px)`;
  el.style.opacity = String(opacity);
}
