"use client";

import { useEffect, useRef } from "react";
import { useStage } from "@/components/stage/Stage";

/**
 * Drives a draw callback with time in seconds since the cover (re)started.
 * Inactive stages (gallery thumbnails) and reduced-motion users get one
 * poster frame at `poster` seconds instead of a running loop.
 */
export function useStageLoop(
  draw: (t: number, dt: number) => void,
  { poster = 4, extraDeps = [] as unknown[] }: { poster?: number; extraDeps?: unknown[] } = {},
) {
  const { active, replay, scale, reducedMotion } = useStage();
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    if (!active || reducedMotion) {
      drawRef.current(poster, 0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    const tick = (now: number) => {
      drawRef.current((now - t0) / 1000, Math.min((now - last) / 1000, 0.1));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, replay, scale, reducedMotion, poster, ...extraDeps]);
}
