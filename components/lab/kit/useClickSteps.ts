"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Click-driven stages for the presentation: every click moves to the next stage, ← goes back, R restarts.
 * Returns `bind` to spread on the element that should receive the clicks (or pass `global` to listen on the window).
 */
export function useClickSteps(total: number, { global = false, initial = 0 }: { global?: boolean; initial?: number } = {}) {
  const [step, setStep] = useState(initial);
  const next = useCallback(() => setStep((s) => Math.min(total - 1, s + 1)), [total]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const reset = useCallback(() => setStep(0), []);

  useEffect(() => {
    if (!global) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowLeft") (e.preventDefault(), next());
      else if (e.key === "ArrowRight") prev();
      else if (e.key === "r" || e.key === "R") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [global, next, prev, reset]);

  const bind = {
    onClick: (e: React.MouseEvent) => (e.shiftKey ? prev() : next()),
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      prev();
    },
  };
  return { step, total, next, prev, reset, bind, atEnd: step === total - 1 };
}
