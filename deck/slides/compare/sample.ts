"use client";

import { useEffect, useState } from "react";
import { loadCanvasFont } from "@/lib/fonts";
import { MEDIA } from "../../media/media";

/**
 * The shared stand-in for slides 05 and 06. The subject is not decided yet, so both sides show the same
 * neutral composition: a sun, a headline, two text lines and a button. The image side gets it as pixels,
 * the code side as live elements. Replace MEDIA.s05Image.src (and the copy below) when the real example is chosen.
 */
export const SAMPLE = {
  headline: "عنوان رئيسي",
  cta: "ابدأ",
  size: 440,
  colors: { sky1: "#0b1a3a", sky2: "#1e3fd8", sun: "#ff7a00", text: "#f6f8ff", line: "#a5d8ff", button: "#f6f8ff", buttonInk: "#05080d" },
} as const;

/** Where things sit, as fractions of the square, so the canvas and the DOM versions match exactly. */
export const LAYOUT = {
  sun: { x: 0.3, y: 0.3, r: 0.15 },
  headline: { right: 0.08, y: 0.56, size: 0.115 },
  lines: [
    { right: 0.08, y: 0.68, w: 0.56 },
    { right: 0.08, y: 0.745, w: 0.4 },
  ],
  button: { right: 0.08, y: 0.83, w: 0.3, h: 0.11 },
} as const;

/**
 * Draws the composition into a canvas, as an image generator would deliver it: pixels, slightly soft,
 * with grain. `t` (0..1) moves the scene for the frame-by-frame video on slide 06.
 */
export function drawSample(ctx: CanvasRenderingContext2D, px: number, family: string, t = 1) {
  const c = SAMPLE.colors;
  const g = ctx.createLinearGradient(0, 0, px, px);
  g.addColorStop(0, c.sky1);
  g.addColorStop(1, c.sky2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, px, px);
  // sun rises with t
  const sy = (LAYOUT.sun.y + (1 - t) * 0.22) * px;
  const halo = ctx.createRadialGradient(LAYOUT.sun.x * px, sy, 0, LAYOUT.sun.x * px, sy, LAYOUT.sun.r * px * 2.2);
  halo.addColorStop(0, "rgba(255,122,0,.45)");
  halo.addColorStop(1, "rgba(255,122,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = c.sun;
  ctx.beginPath();
  ctx.arc(LAYOUT.sun.x * px, sy, LAYOUT.sun.r * px, 0, Math.PI * 2);
  ctx.fill();
  // headline
  ctx.globalAlpha = Math.min(1, 0.2 + t);
  ctx.fillStyle = c.text;
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.font = `900 ${LAYOUT.headline.size * px}px ${family}`;
  ctx.fillText(SAMPLE.headline, (1 - LAYOUT.headline.right) * px, LAYOUT.headline.y * px);
  ctx.globalAlpha = 1;
  // lines grow with t
  ctx.fillStyle = c.line;
  for (const l of LAYOUT.lines) {
    const w = l.w * px * Math.min(1, 0.25 + t * 0.9);
    ctx.fillRect((1 - l.right) * px - w, l.y * px, w, px * 0.025);
  }
  // button
  const b = LAYOUT.button;
  ctx.fillStyle = c.button;
  const bx = (1 - b.right - b.w) * px;
  const by = b.y * px;
  ctx.beginPath();
  ctx.roundRect(bx, by, b.w * px, b.h * px, b.h * px * 0.3);
  ctx.fill();
  ctx.fillStyle = c.buttonInk;
  ctx.textAlign = "center";
  ctx.font = `700 ${b.h * px * 0.48}px ${family}`;
  ctx.fillText(SAMPLE.cta, bx + (b.w * px) / 2, by + b.h * px * 0.66);
  // grain: the generator's texture, and what the pixel lens will find
  const img = ctx.getImageData(0, 0, px, px);
  let seed = 7;
  for (let i = 0; i < img.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const n = ((seed / 2147483647) - 0.5) * 22;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/** The raster stand-in as data URLs (frame 0..n-1 for slide 06), or the real file once it exists. */
export function useRasterFrames(count = 1, px = 256) {
  const [frames, setFrames] = useState<string[]>([]);
  useEffect(() => {
    let gone = false;
    (async () => {
      const family = await loadCanvasFont(900, SAMPLE.headline);
      const cv = document.createElement("canvas");
      cv.width = cv.height = px;
      const ctx = cv.getContext("2d")!;
      const out: string[] = [];
      for (let i = 0; i < count; i++) {
        drawSample(ctx, px, family, count === 1 ? 1 : i / (count - 1));
        out.push(cv.toDataURL("image/png"));
      }
      if (!gone) setFrames(out);
    })();
    return () => {
      gone = true;
    };
  }, [count, px]);
  if (MEDIA.s05Image.src && count === 1) return [MEDIA.s05Image.src];
  return frames;
}
