"use client";

import { useEffect, useState } from "react";

/**
 * Staged components take an optional `step`. When the presentation drives it, that value wins.
 * When it is undefined the component plays itself: it walks through its stages on a timer and loops.
 */
export function useStep(total: number, step: number | undefined, replay: number, every = 2800) {
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    setAuto(0);
    if (step !== undefined) return;
    const id = setInterval(() => setAuto((s) => (s + 1) % (total + 2)), every);
    return () => clearInterval(id);
  }, [step, replay, total, every]);
  const s = step !== undefined ? step : Math.min(auto, total - 1);
  return Math.max(0, Math.min(total - 1, s));
}
