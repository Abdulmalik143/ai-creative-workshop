"use client";

import { useEffect, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Timed beats inside one click: several movements that play by themselves after a single click.
 * `marks` are milliseconds from the moment `owner` became the current step.
 * Before the owner step: 0 beats. After it: every beat. During it: beats fire on their timers.
 * Going back to the owner step plays its beats again, which is what a presenter expects from "back".
 */
export function useBeats(step: number, owner: number, marks: readonly number[]) {
  const [n, setN] = useState(0);
  const key = marks.join(",");
  useEffect(() => {
    if (step !== owner) return;
    if (prefersReducedMotion()) {
      setN(marks.length);
      return;
    }
    setN(0);
    const timers = marks.map((ms, i) => window.setTimeout(() => setN(i + 1), ms));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, owner, key]);
  if (step < owner) return 0;
  if (step > owner) return marks.length;
  return n;
}

/** A clock in ms that runs while `on` is true and resets when it turns off. For continuous motion inside a step. */
export function useClock(on: boolean, fps = 30) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) {
      setT(0);
      return;
    }
    if (prefersReducedMotion()) {
      setT(1e9);
      return;
    }
    const t0 = performance.now();
    const id = window.setInterval(() => setT(performance.now() - t0), 1000 / fps);
    return () => clearInterval(id);
  }, [on, fps]);
  return t;
}
