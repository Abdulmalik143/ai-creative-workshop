"use client";

import { useEffect, useRef, useState } from "react";
import { useStage } from "@/components/stage/Stage";
import { useStageLoop } from "@/lib/useStageLoop";
import { T, MONO, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";
import { clamp, ease, lerp, seg } from "@/covers/kit/math";

const SRC = 256; // the generated image is 256x256: every one of its pixels is real
const VIEW = { x: 150, y: 150, s: 720 }; // image on stage
const LENS = { x: 960, y: 150, s: 720 }; // magnified view
const ZOOM = [1, 6, 24];

/**
 * A generated image, and a lens that shows what it is made of: pixels.
 * Move the pointer over the image; the lens follows. Stage 3 draws the pixel grid and reads the colour of the pixel under the centre.
 */
export function PixelZoom({ step, replay = 0 }: LabProps) {
  const s = useStep(3, step, replay, 3600);
  const { pointer, active } = useStage();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const src = useRef<HTMLCanvasElement | null>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const swatch = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 128, y: 96 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const im = new Image();
    im.src = "/lab/generated.png";
    im.onload = () => {
      imgRef.current = im;
      const c = document.createElement("canvas");
      c.width = c.height = SRC;
      c.getContext("2d")!.drawImage(im, 0, 0);
      src.current = c;
      setReady(true);
    };
  }, []);

  useStageLoop(
    (t) => {
      const cv = lens.current;
      if (!cv || !src.current) return;
      const z = ZOOM[s];
      const p = pointer.current;
      // the lens follows the pointer over the image, otherwise it wanders over the face
      let tx: number;
      let ty: number;
      if (active && p.inside && p.x > VIEW.x && p.x < VIEW.x + VIEW.s && p.y > VIEW.y && p.y < VIEW.y + VIEW.s) {
        tx = ((p.x - VIEW.x) / VIEW.s) * SRC;
        ty = ((p.y - VIEW.y) / VIEW.s) * SRC;
      } else {
        tx = 128 + Math.sin(t * 0.5) * 24;
        ty = 92 + Math.cos(t * 0.37) * 12;
      }
      pos.current.x += (tx - pos.current.x) * 0.15;
      pos.current.y += (ty - pos.current.y) * 0.15;
      const reg = SRC / z; // image pixels across the lens
      const sx = clamp(pos.current.x - reg / 2, 0, SRC - reg);
      const sy = clamp(pos.current.y - reg / 2, 0, SRC - reg);
      const ctx = cv.getContext("2d")!;
      cv.width = cv.height = 720;
      ctx.imageSmoothingEnabled = z < 4;
      ctx.drawImage(src.current, sx, sy, reg, reg, 0, 0, 720, 720);
      const cell = 720 / reg;
      if (cell >= 18) {
        ctx.strokeStyle = "rgba(242,245,245,0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= reg; i++) {
          ctx.moveTo(i * cell, 0);
          ctx.lineTo(i * cell, 720);
          ctx.moveTo(0, i * cell);
          ctx.lineTo(720, i * cell);
        }
        ctx.stroke();
        // the pixel at the centre
        const cx = Math.floor(sx + reg / 2);
        const cy = Math.floor(sy + reg / 2);
        const d = src.current.getContext("2d")!.getImageData(cx, cy, 1, 1).data;
        const hex = "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
        const px = (cx - sx) * cell;
        const py = (cy - sy) * cell;
        ctx.strokeStyle = T.orange;
        ctx.lineWidth = 4;
        ctx.strokeRect(px + 2, py + 2, cell - 4, cell - 4);
        if (read.current) read.current.textContent = `${hex}  ·  (${cx}, ${cy})`;
        if (swatch.current) swatch.current.style.background = hex;
      }
      if (box.current) {
        const w = (reg / SRC) * VIEW.s;
        const x = VIEW.x + (sx / SRC) * VIEW.s;
        const y = VIEW.y + (sy / SRC) * VIEW.s;
        box.current.style.transform = `translate(${x}px, ${y}px)`;
        box.current.style.width = box.current.style.height = `${w}px`;
        box.current.style.opacity = String(s === 0 ? 0 : 1);
      }
    },
    { poster: 3, extraDeps: [ready, s] },
  );

  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/lab/generated.png" alt="صورة مولّدة" className="absolute rounded-[16px] object-cover" style={{ left: VIEW.x, top: VIEW.y, width: VIEW.s, height: VIEW.s, outline: `1.5px solid ${T.line}` }} />
      <div ref={box} className="absolute left-0 top-0" style={{ border: `3px solid ${T.orange}`, boxShadow: "0 0 0 9999px rgba(7,11,14,0.4)", opacity: 0, transition: "opacity .4s" }} />
      <canvas ref={lens} width={720} height={720} className="absolute rounded-[16px]" style={{ left: LENS.x, top: LENS.y, width: LENS.s, height: LENS.s, imageRendering: "pixelated", outline: `1.5px solid ${T.lineStrong}`, opacity: s === 0 ? 0.35 : 1, transition: "opacity .5s" }} />
      <div className="absolute flex items-center gap-[18px]" dir="ltr" style={{ left: LENS.x, top: LENS.y + LENS.s + 26, fontFamily: MONO, fontSize: 28, color: T.sage, opacity: s === 2 ? 1 : 0, transition: "opacity .4s" }}>
        <span ref={swatch} className="h-[34px] w-[34px] rounded-[6px]" style={{ outline: `1.5px solid ${T.lineStrong}` }} />
        <span ref={read} />
      </div>
      <p className="absolute right-[150px] top-[62px] text-[44px] font-bold" style={{ color: T.mist }}>
        {["صورة مولّدة", `تكبير ×${ZOOM[1]}`, `تكبير ×${ZOOM[2]}: هذه هي البكسلات`][s]}
      </p>
    </div>
  );
}
