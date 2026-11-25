"use client";

import { useEffect, useRef } from "react";
import { WAMDA_CLIPS, WAMDA_H, WAMDA_PALETTE, WAMDA_W } from "./sprites";

export type WamdaClip = "idle" | "run" | "wave" | "shrug" | "think" | "lookR" | "lookL" | "hop" | "stand" | "greet";
export type WamdaMode = "silhouette" | "reveal" | "color";

const FPS: Record<WamdaClip, number> = { idle: 3, run: 11, wave: 5, shrug: 2.5, think: 2, lookR: 4, lookL: 4, hop: 5, stand: 1, greet: 8 };

/**
 * Two clips made from the video's frames, for a greeting where only the hand moves (deck slide 07, 2026-11-24).
 * `wave` alternates walking and hand-up frames, so the whole body moves. Instead:
 *   stand = wave frame 1 (standing, hand raised), held still
 *   greet = the same frame with only the raised hand turned about the wrist; the body's pixels never change
 * The turn is done on the sprite grid (each new pixel looks up its source), so the hand stays crisp pixel art.
 */
const HAND = { x0: 48, x1: 59, y0: 28, y1: 38, px: 48.5, py: 38 }; // the raised hand in wave[1], and its wrist
const GREET_DEG = [0, 8, 14, 8, 0, -8, -12, -8]; // one wave per second at 8 fps
function turnHand(base: Uint8Array, deg: number): Uint8Array {
  const inHand = (x: number, y: number) => x >= HAND.x0 && x <= HAND.x1 && y >= HAND.y0 && y <= HAND.y1 && base[y * WAMDA_W + x] !== 0;
  const out = base.slice();
  for (let y = HAND.y0; y <= HAND.y1; y++) for (let x = HAND.x0; x <= HAND.x1; x++) if (inHand(x, y)) out[y * WAMDA_W + x] = 0;
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  for (let ty = HAND.y0 - 7; ty <= HAND.y1 + 2; ty++) {
    for (let tx = HAND.x0 - 7; tx <= HAND.x1 + 6; tx++) {
      if (tx < 0 || ty < 0 || tx >= WAMDA_W || ty >= WAMDA_H) continue;
      const dx = tx + 0.5 - HAND.px;
      const dy = ty + 0.5 - HAND.py;
      const sx = Math.floor(HAND.px + dx * c + dy * s);
      const sy = Math.floor(HAND.py - dx * s + dy * c);
      if (inHand(sx, sy)) out[ty * WAMDA_W + tx] = base[sy * WAMDA_W + sx];
    }
  }
  return out;
}

let decoded: Record<string, Uint8Array[]> | null = null;
function frames(clip: string): Uint8Array[] {
  if (!decoded) {
    decoded = {};
    for (const [name, list] of Object.entries(WAMDA_CLIPS)) {
      decoded[name] = list.map((b64) => {
        const bin = atob(b64);
        const out = new Uint8Array(WAMDA_W * WAMDA_H);
        for (let i = 0; i < bin.length; i++) {
          const b = bin.charCodeAt(i);
          const a = i * 2;
          if (a < out.length) out[a] = b >> 4;
          if (a + 1 < out.length) out[a + 1] = b & 15;
        }
        return out;
      });
    }
    const hand = decoded.wave[1];
    decoded.stand = [hand];
    decoded.greet = GREET_DEG.map((d) => turnHand(hand, d));
  }
  return decoded[clip] ?? decoded.idle;
}

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const PAL = WAMDA_PALETTE.map(hex);
// reveal order: a scan from the hood down, broken up by noise so it reads as pixels, not a wipe
const THR = new Float32Array(WAMDA_W * WAMDA_H).map((_, i) => {
  const x = i % WAMDA_W;
  const y = Math.floor(i / WAMDA_W);
  const n = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
  return (y / WAMDA_H) * 0.72 + n * 0.28;
});

export type WamdaProps = {
  clip?: WamdaClip | string;
  mode?: WamdaMode;
  /** screen px per sprite pixel */
  scale?: number;
  flip?: boolean;
  /** ms the silhouette waits before turning orange (mode = reveal) */
  revealDelay?: number;
  revealMs?: number;
  /** restart the reveal */
  replay?: number;
  fps?: number;
  className?: string;
  onRevealed?: () => void;
};

/**
 * Wamda as pixel art: a 72x76 sprite drawn from palette indices, so it stays crisp at any scale.
 * silhouette = solid black with a 1px sage rim; reveal = silhouette that turns orange pixel by pixel.
 */
export function Wamda({
  clip = "idle",
  mode = "color",
  scale = 8,
  flip = false,
  revealDelay = 700,
  revealMs = 1500,
  replay = 0,
  fps,
  className = "",
  onRevealed,
}: WamdaProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onRevealed);
  cb.current = onRevealed;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const list = frames(clip);
    const img = ctx.createImageData(WAMDA_W, WAMDA_H);
    const rate = fps ?? FPS[clip as WamdaClip] ?? 4;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    let told = false;
    const draw = (now: number) => {
      const el = Math.max(0, now - t0);
      const f = reduce ? 0 : Math.floor((el / 1000) * rate) % list.length;
      const px = list[f];
      let p = mode === "color" ? 1 : mode === "silhouette" ? 0 : Math.min(1, Math.max(0, (el - revealDelay) / revealMs));
      if (reduce && mode === "reveal") p = 1;
      for (let i = 0; i < px.length; i++) {
        const v = px[i];
        const o = i * 4;
        if (!v) {
          img.data[o + 3] = 0;
          continue;
        }
        const x = i % WAMDA_W;
        const lit = THR[i] < p * 1.02;
        // rim: an opaque pixel touching empty space
        const edge = !px[i - 1] || !px[i + 1] || !px[i - WAMDA_W] || !px[i + WAMDA_W] || x === 0;
        if (lit) {
          img.data[o] = PAL[v - 1][0];
          img.data[o + 1] = PAL[v - 1][1];
          img.data[o + 2] = PAL[v - 1][2];
        } else if (edge) {
          img.data[o] = 179;
          img.data[o + 1] = 196;
          img.data[o + 2] = 198;
        } else {
          img.data[o] = img.data[o + 1] = img.data[o + 2] = 3;
        }
        img.data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      if (p >= 1 && !told && mode === "reveal") {
        told = true;
        cb.current?.();
      }
      const animating = !reduce && (list.length > 1 || (mode === "reveal" && p < 1));
      if (animating) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [clip, mode, replay, fps, revealDelay, revealMs]);

  return (
    <canvas
      ref={ref}
      width={WAMDA_W}
      height={WAMDA_H}
      role="img"
      aria-label="ومضة"
      className={className}
      style={{ width: WAMDA_W * scale, height: WAMDA_H * scale, imageRendering: "pixelated", transform: flip ? "scaleX(-1)" : undefined }}
    />
  );
}
