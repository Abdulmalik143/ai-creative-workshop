"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { D, EASE, MONO } from "../../theme";
import { Typed } from "../../kit/Show";
import { prefersReducedMotion } from "../../kit/beats";
import { LAYOUT, SAMPLE } from "./sample";

// ---------- geometry shared by slides 05 and 06 ----------
export const PANEL = { y: 200, w: 840, h: 720 };
export const IMG_PANEL_X = 990; // right (RTL: first)
export const CODE_PANEL_X = 90;
export const MAIN = { dx: 360, dy: 116, s: SAMPLE.size }; // main element inside its panel
export const SIDE = { dx: 40, dy: 116, w: 290 }; // the narrow column beside it

/** `title` replaces the plain name when the heading needs its own markup (slide 06 swaps one of its words). */
export function PanelHead({ x, name, sub, color, title }: { x: number; name: string; sub: string; color: string; title?: ReactNode }) {
  return (
    <div className="absolute flex items-center justify-between" style={{ left: x + 40, top: PANEL.y + 34, width: PANEL.w - 80 }}>
      <h2 dir="ltr" aria-label={title ? name : undefined} className="m-0 text-[42px] font-black leading-none" style={{ color }}>
        {title ?? name}
      </h2>
      <span dir="ltr" className="rounded-full px-[16px] py-[7px] text-[20px] font-bold leading-none" style={{ color, border: `1.5px solid ${color}88`, fontFamily: MONO }}>
        {sub}
      </span>
    </div>
  );
}

export function PanelBox({ x, glow, y = PANEL.y, h = PANEL.h, on = true }: { x: number; glow?: string; y?: number; h?: number; on?: boolean }) {
  return (
    <div
      className="absolute rounded-[28px]"
      style={{ left: x, top: y, width: PANEL.w, height: h, background: "rgba(10,16,24,.9)", border: `1.5px solid ${glow ?? D.line}`, opacity: on ? 1 : 0, transition: "border-color .5s, opacity .6s ease" }}
    />
  );
}

// ---------- the code-built version of the sample ----------
export type DesignVars = { accent: string; radius: number; title: number };
export const BASE_VARS: DesignVars = { accent: SAMPLE.colors.sun, radius: 12, title: 50 };

/**
 * The sample as independent elements. `build` reveals it the way code writes it:
 * 1 headline (typed), 2 lines, 3 sun, 4 button, 5 the card fills in. `outlines` shows each element's box and tag.
 * `motion` runs the slide-06 animation; its CSS is exactly what the code window prints.
 */
export function SampleDesign({
  build = 5,
  outlines = false,
  vars = BASE_VARS,
  motion,
  style,
}: {
  build?: number;
  outlines?: boolean;
  vars?: DesignVars;
  motion?: { dur: number; ease: string; key: number } | null;
  style?: CSSProperties;
}) {
  const s = SAMPLE.size;
  const c = SAMPLE.colors;
  const anim = (name: string, delay = 0): CSSProperties | undefined =>
    motion ? { animation: `${name} ${motion.dur}s ${motion.ease} ${delay}s infinite alternate both` } : undefined;
  const tag = (label: string, on: boolean, extra: CSSProperties) =>
    outlines && on ? (
      <span className="pointer-events-none absolute" style={{ ...extra, border: `1.5px dashed ${D.sky}`, borderRadius: 6, animation: "lab-fade .3s both" }}>
        <span dir="ltr" className="absolute -top-[26px] left-0 rounded-[4px] px-[6px] py-[2px] text-[15px] font-bold leading-none" style={{ background: D.sky, color: D.ink, fontFamily: MONO }}>
          {label}
        </span>
      </span>
    ) : null;
  return (
    <div className="absolute overflow-visible" style={{ width: s, height: s, ...style }}>
      <div
        key={motion?.key}
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: vars.radius,
          background: build >= 5 ? `linear-gradient(135deg, ${c.sky1}, ${c.sky2})` : "rgba(255,255,255,.02)",
          outline: build >= 5 ? "none" : `1.5px dashed ${D.lineStrong}`,
          transition: `background .8s ease, border-radius .7s ${EASE}`,
        }}
      >
        {/* sun */}
        <div
          className="absolute rounded-full"
          style={{
            left: (LAYOUT.sun.x - LAYOUT.sun.r) * s,
            top: (LAYOUT.sun.y - LAYOUT.sun.r) * s,
            width: LAYOUT.sun.r * 2 * s,
            height: LAYOUT.sun.r * 2 * s,
            background: vars.accent,
            boxShadow: `0 0 ${s * 0.12}px ${vars.accent}88`,
            opacity: build >= 3 ? 1 : 0,
            transform: build >= 3 ? "none" : "scale(.3)",
            transition: `opacity .5s ease, transform .6s cubic-bezier(.3,1.5,.5,1), background .6s ease, box-shadow .6s ease`,
            ...anim("s06-rise"),
          }}
        />
        {/* headline */}
        <div
          className="absolute whitespace-nowrap font-black leading-none"
          style={{
            right: LAYOUT.headline.right * s,
            top: LAYOUT.headline.y * s - vars.title * 0.92,
            fontSize: vars.title,
            color: c.text,
            transition: `font-size .7s ${EASE}, top .7s ${EASE}`,
            ...anim("s06-fade", 0.1),
          }}
        >
          <Typed text={SAMPLE.headline} play={build >= 1} cps={build === 1 ? 7 : 1000} caret={build === 1} />
        </div>
        {/* lines */}
        {LAYOUT.lines.map((l, i) => (
          <div
            key={i}
            className="absolute origin-right rounded-full"
            style={{
              right: l.right * s,
              top: l.y * s,
              width: l.w * s,
              height: s * 0.025,
              background: c.line,
              transform: build >= 2 ? "scaleX(1)" : "scaleX(0)",
              transition: `transform .7s ${EASE} ${i * 0.15}s`,
              ...anim("s06-grow", 0.15 + i * 0.1),
            }}
          />
        ))}
        {/* button */}
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{
            right: LAYOUT.button.right * s,
            top: LAYOUT.button.y * s,
            width: LAYOUT.button.w * s,
            height: LAYOUT.button.h * s,
            borderRadius: Math.min(vars.radius, (LAYOUT.button.h * s) / 2),
            background: c.button,
            color: c.buttonInk,
            fontSize: LAYOUT.button.h * s * 0.46,
            opacity: build >= 4 ? 1 : 0,
            transform: build >= 4 ? "none" : "translateY(14px)",
            transition: `opacity .5s ease, transform .6s ${EASE}, border-radius .7s ${EASE}`,
          }}
        >
          {SAMPLE.cta}
        </div>
      </div>
      {/* element boxes, the way devtools shows them */}
      {tag("h1", build >= 1, { right: LAYOUT.headline.right * s - 8, top: LAYOUT.headline.y * s - vars.title - 4, width: s * 0.58, height: vars.title + 22 })}
      {tag("p", build >= 2, { right: LAYOUT.lines[0].right * s - 8, top: LAYOUT.lines[0].y * s - 10, width: LAYOUT.lines[0].w * s + 16, height: s * 0.11 })}
      {tag("div.sun", build >= 3, { left: (LAYOUT.sun.x - LAYOUT.sun.r) * s - 8, top: (LAYOUT.sun.y - LAYOUT.sun.r) * s - 8, width: LAYOUT.sun.r * 2 * s + 16, height: LAYOUT.sun.r * 2 * s + 16 })}
      {tag("button", build >= 4, { right: LAYOUT.button.right * s - 8, top: LAYOUT.button.y * s - 8, width: LAYOUT.button.w * s + 16, height: LAYOUT.button.h * s + 16 })}
    </div>
  );
}

/** The CSS the slide-06 elements run on: printed in the code window and injected, so the two never disagree. */
export function motionCss() {
  return `@keyframes s06-rise { from { transform: translateY(${(0.22 * SAMPLE.size).toFixed(0)}px); } to { transform: none; } }
@keyframes s06-grow { from { transform: scaleX(.25); } to { transform: scaleX(1); } }
@keyframes s06-fade { from { opacity: .2; } to { opacity: 1; } }`;
}

// ---------- a code window with values that change in front of the audience ----------
export type CodeLine = { pre: string; value?: string; post?: string; dim?: boolean };

export function CodeWindow({ file, lines, width, style, glow, fontSize = 18 }: { file: string; lines: CodeLine[]; width: number; style?: CSSProperties; glow?: boolean; fontSize?: number }) {
  return (
    <div className="absolute overflow-hidden rounded-[18px]" style={{ width, background: "#070c13", border: `1.5px solid ${glow ? D.agent : D.lineStrong}`, boxShadow: "0 24px 60px rgba(0,0,0,.5)", transition: "border-color .4s", ...style }}>
      <div className="flex h-[40px] items-center gap-[7px] px-[14px]" style={{ background: D.panel2, borderBottom: `1px solid ${D.line}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[9px] w-[9px] rounded-full" style={{ background: "#26384a" }} />
        ))}
        <span dir="ltr" className="mr-auto text-[16px] font-bold" style={{ color: D.dim, fontFamily: MONO }}>
          {file}
        </span>
      </div>
      <pre dir="ltr" className="m-0 whitespace-pre px-[16px] py-[12px] text-left" style={{ fontFamily: MONO, fontSize, lineHeight: 1.75, color: D.sky }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.dim ? D.dim : undefined, animation: "lab-fade .4s both" }}>
            {l.pre}
            {l.value !== undefined && <Value v={l.value} />}
            {l.post}
          </div>
        ))}
      </pre>
    </div>
  );
}

/** A value that, when it changes, is retyped and flashes orange. */
function Value({ v }: { v: string }) {
  const first = useRef(v);
  const changed = v !== first.current;
  return (
    <span key={v} className="rounded-[4px]" style={{ color: changed ? D.agentSoft : D.paper, animation: changed ? "lab-flash 1.4s both" : undefined }}>
      {changed ? <Typed text={v} play cps={16} caret={false} /> : v}
    </span>
  );
}

// ---------- the pixel lens ----------
/**
 * Magnifies a square of the generated image until its pixels show, then draws the pixel grid.
 * `region` is in source pixels of the 256x256 image.
 */
export function PixelLens({ src, on, region, size, style }: { src?: string; on: boolean; region: { x: number; y: number; s: number }; size: number; style?: CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !src) return;
    const ctx = cv.getContext("2d")!;
    const img = new Image();
    let raf = 0;
    let gone = false;
    img.onload = () => {
      if (gone) return;
      const W = img.naturalWidth;
      const k = W / 256; // the real file may be larger: keep the same region
      const t0 = performance.now();
      const dur = on && !prefersReducedMotion() ? 1400 : 0;
      const draw = (now: number) => {
        const p = on ? (dur ? Math.min(1, (now - t0) / dur) : 1) : 0;
        const e = 1 - Math.pow(1 - p, 3);
        const reg = (256 + (region.s - 256) * e) * k;
        const cx = (128 + (region.x + region.s / 2 - 128) * e) * k;
        const cy = (128 + (region.y + region.s / 2 - 128) * e) * k;
        ctx.imageSmoothingEnabled = e < 0.6;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, cx - reg / 2, cy - reg / 2, reg, reg, 0, 0, size, size);
        const cell = size / (reg / k);
        if (cell >= 9) {
          ctx.strokeStyle = `rgba(5,8,13,${Math.min(0.55, (cell - 9) / 14)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const off = ((cx - reg / 2) / k) % 1;
          for (let x = -off * cell; x <= size; x += cell) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
          }
          for (let y = -(((cy - reg / 2) / k) % 1) * cell; y <= size; y += cell) {
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
          }
          ctx.stroke();
        }
        if (p < 1) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    };
    img.src = src;
    return () => {
      gone = true;
      cancelAnimationFrame(raf);
    };
  }, [src, on, region.x, region.y, region.s, size]);
  return <canvas ref={ref} width={size} height={size} className="absolute rounded-[18px]" style={{ width: size, height: size, imageRendering: "pixelated", border: `2px solid ${D.agent}`, background: D.panel2, ...style }} />;
}

/** A flow row: chips joined by arrows, read right to left. */
export function Flow({ items, color, lit = -1, on, style }: { items: readonly string[]; color: string; lit?: number; on: boolean; style?: CSSProperties }): ReactNode {
  return (
    <div className="absolute flex items-center gap-[10px]" style={{ ...style }}>
      {items.map((t, i) => (
        <div key={t} className="flex items-center gap-[10px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(20px)", transition: `all .5s ${EASE} ${on ? i * 0.35 : 0}s` }}>
          <span
            dir={/[a-z]/i.test(t) ? "ltr" : undefined}
            className="whitespace-nowrap rounded-[12px] px-[14px] py-[9px] text-[21px] font-bold leading-none"
            style={{ color: i === lit ? D.ink : D.mist, background: i === lit ? color : D.panel2, border: `1.5px solid ${i === lit ? color : `${color}66`}`, fontFamily: /[a-z]/i.test(t) ? MONO : undefined, transition: "all .4s" }}
          >
            {t}
          </span>
          {i < items.length - 1 && (
            <svg width="34" height="20" viewBox="0 0 34 20" aria-hidden>
              <path d="M32 10 H4 M12 3 L3 10 L12 17" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
