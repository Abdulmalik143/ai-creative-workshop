"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { EASE } from "../theme";
import { prefersReducedMotion } from "./beats";

type From = "up" | "down" | "start" | "end" | "scale" | "fade" | "pop";

const OFF: Record<From, string> = {
  up: "translateY(28px)",
  down: "translateY(-28px)",
  // RTL: "start" is the right side
  start: "translateX(40px)",
  end: "translateX(-40px)",
  scale: "scale(.9)",
  pop: "scale(.6)",
  fade: "none",
};

/** Shows its children when `on`, with a short transition. Stays mounted, so layout never jumps. */
export function Show({
  on,
  from = "up",
  delay = 0,
  dur = 600,
  className = "",
  style,
  children,
  as: Tag = "div",
}: {
  on: boolean;
  from?: From;
  delay?: number;
  dur?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: "div" | "span" | "li" | "section" | "p";
}) {
  return (
    <Tag
      className={className}
      aria-hidden={on ? undefined : true}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : OFF[from],
        transition: `opacity ${dur * 0.8}ms ease ${on ? delay : 0}ms, transform ${dur}ms ${from === "pop" ? "cubic-bezier(.3,1.5,.5,1)" : EASE} ${on ? delay : 0}ms`,
        pointerEvents: on ? undefined : "none",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Types text out. Arabic is revealed by growing a substring, never by splitting letters into spans,
 * so letters keep their joins while typing.
 */
export function Typed({
  text,
  play,
  cps = 24,
  delay = 0,
  caret = true,
  onDone,
}: {
  text: string;
  /** start typing when true; false shows nothing */
  play: boolean;
  cps?: number;
  delay?: number;
  caret?: boolean;
  onDone?: () => void;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!play) {
      setN(0);
      return;
    }
    if (prefersReducedMotion()) {
      setN(text.length);
      onDone?.();
      return;
    }
    let raf = 0;
    let done = false;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.max(0, Math.floor(((now - t0) / 1000) * cps)));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
      else if (!done) {
        done = true;
        onDone?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, play, cps, delay]);
  const typing = play && n < text.length;
  return (
    <>
      {text.slice(0, n)}
      {caret && play && (
        <span
          aria-hidden
          className="inline-block h-[0.85em] w-[0.08em] translate-y-[0.12em] bg-current"
          style={{ marginInlineStart: "0.06em", animation: typing ? "none" : "lab-caret 0.9s steps(1) infinite", opacity: typing ? 1 : 0.8 }}
        />
      )}
    </>
  );
}
