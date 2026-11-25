"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";

/**
 * The cover as a design canvas in the middle of a session.
 * "عقل" draws a loose circle around a word; "وكيل" arrives, and replaces it with a precise highlight,
 * snaps the title into a selection with guides. Move the pointer: you are the mind, the agent cleans your line.
 */

const THEMES = {
  light: { mind: "#ff2d87", agent: "#3b4cff", ink: "#0f1117", bg: "#e9eaf0", dots: "#c4c8d6", bar: "#13141a", barText: "#aab0c3", hi: 0.1, handle: "#ffffff", chipText: "#ffffff" },
  dark: { mind: "#ff4fa0", agent: "#7a89ff", ink: "#f4f5f8", bg: "#0d0e13", dots: "#262a37", bar: "#07080b", barText: "#9aa0b4", hi: 0.2, handle: "#0d0e13", chipText: "#ffffff" },
};

type Box = { x: number; y: number; w: number; h: number };
type V = { x: number; y: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function noise(n: number) {
  return Math.sin(n * 12.9898) * 43758.5453 - Math.floor(Math.sin(n * 12.9898) * 43758.5453);
}

function loopPoints(b: Box): V[] {
  // a loose hand-drawn loop around the word: two slightly offset turns, wobbling radius
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const rx = b.w / 2 + 34;
  const ry = b.h / 2 + 26;
  const pts: V[] = [];
  const N = 90;
  for (let i = 0; i <= N; i++) {
    const a = -2.2 + (i / N) * (Math.PI * 2 + 0.9);
    const wob = 1 + 0.06 * Math.sin(a * 3 + 1) + (noise(i) - 0.5) * 0.05 + (i / N) * 0.07;
    pts.push({ x: cx + Math.cos(a) * rx * wob, y: cy + Math.sin(a) * ry * wob + (i / N) * 10 });
  }
  return pts;
}

const polyD = (pts: V[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");

function smoothD(pts: V[]) {
  if (pts.length < 3) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += `Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  return d;
}

function Cursor({ color, label, refEl }: { color: string; label: string; refEl: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={refEl} className="absolute left-0 top-0 will-change-transform" style={{ opacity: 0 }}>
      <svg width="34" height="40" viewBox="0 0 34 40" className="absolute left-0 top-0 drop-shadow-[0_6px_10px_rgba(15,17,23,0.25)]">
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

function CanvasScene({ dark }: { dark: boolean }) {
  const TH = dark ? THEMES.dark : THEMES.light;
  const MIND = TH.mind;
  const AGENT = TH.agent;
  const { scale, pointer, active } = useStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<{ word: Box; title: Box } | null>(null);

  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const scribbleRef = useRef<SVGPathElement>(null);
  const hiRef = useRef<SVGGElement>(null);
  const selRef = useRef<SVGGElement>(null);
  const guideRef = useRef<SVGGElement>(null);
  const rawRef = useRef<SVGPathElement>(null);
  const cleanRef = useRef<SVGPathElement>(null);
  const clickRef = useRef<SVGCircleElement>(null);

  const trail = useRef<V[]>([]);
  const free = useRef({ mind: { x: 0, y: 0, on: false }, agent: { x: 0, y: 0 } });

  const measure = useCallback(() => {
    const root = rootRef.current;
    const w = wordRef.current;
    const t = titleRef.current;
    if (!root || !w || !t || !scale) return;
    const rr = root.getBoundingClientRect();
    const box = (el: HTMLElement): Box => {
      const r = el.getBoundingClientRect();
      return { x: (r.left - rr.left) / scale, y: (r.top - rr.top) / scale, w: r.width / scale, h: r.height / scale };
    };
    setGeo({ word: box(w), title: box(t) });
  }, [scale]);

  useLayoutEffect(() => {
    measure();
    document.fonts.ready.then(measure);
  }, [measure]);

  useEffect(() => {
    free.current = { mind: { x: 0, y: 0, on: false }, agent: { x: 0, y: 0 } };
    trail.current = [];
  }, [active]);

  const loop = useRef<V[]>([]);
  useEffect(() => {
    if (geo) loop.current = loopPoints(geo.word);
  }, [geo]);

  useStageLoop(
    (t) => {
      if (!geo) return;
      const { word, title } = geo;
      const lp = loop.current;
      if (!lp.length) return;
      const set = (el: Element | null, v: string, prop = "opacity") => el && ((el as HTMLElement | SVGElement).style as CSSStyleDeclaration).setProperty(prop, v);

      // ---- mind: arrives from the top right, loops the word, parks at its clause
      const start: V = { x: 1840, y: 130 };
      const loopStart = lp[0];
      const park: V = { x: 1590, y: 800 };
      let mind: V;
      let loopProg = 0;
      if (t < 1.5) {
        const k = easeOut(seg(t, 0.2, 1.5));
        mind = { x: lerp(start.x, loopStart.x, k), y: lerp(start.y, loopStart.y, k) + Math.sin(k * Math.PI) * -60 };
      } else if (t < 2.9) {
        loopProg = ease(seg(t, 1.5, 2.9));
        const idx = Math.min(lp.length - 1, Math.floor(loopProg * (lp.length - 1)));
        mind = lp[idx];
      } else {
        const k = easeOut(seg(t, 3.2, 4.4));
        mind = { x: lerp(lp[lp.length - 1].x, park.x, k), y: lerp(lp[lp.length - 1].y, park.y, k) };
      }

      // ---- agent: arrives from the lower left, clicks the loop, replaces it, parks at its clause
      const aStart: V = { x: 60, y: 1010 };
      const wc: V = { x: word.x + word.w * 0.5, y: word.y + word.h * 0.5 };
      const aPark: V = { x: 620, y: 800 };
      let agent: V;
      if (t < 3.7) {
        const k = easeOut(seg(t, 2.5, 3.7));
        agent = { x: lerp(aStart.x, wc.x, k), y: lerp(aStart.y, wc.y + 18, k) };
      } else {
        const k = easeOut(seg(t, 4.4, 5.4));
        agent = { x: lerp(wc.x, aPark.x, k), y: lerp(wc.y + 18, aPark.y, k) };
      }

      // ---- interaction: after the intro the mind follows the pointer and the agent chases it
      const p = pointer.current;
      const f = free.current;
      if (active && t > 5.6 && p.inside) {
        if (!f.mind.on) { f.mind = { x: mind.x, y: mind.y, on: true }; f.agent = { x: agent.x, y: agent.y }; }
        f.mind.x += (p.x - f.mind.x) * 0.35;
        f.mind.y += (p.y - f.mind.y) * 0.35;
        f.agent.x += (f.mind.x - 60 - f.agent.x) * 0.07;
        f.agent.y += (f.mind.y + 70 - f.agent.y) * 0.07;
        const last = trail.current[trail.current.length - 1];
        if (!last || Math.hypot(last.x - f.mind.x, last.y - f.mind.y) > 6) {
          trail.current.push({ x: f.mind.x, y: f.mind.y });
          if (trail.current.length > 34) trail.current.shift();
        } else if (trail.current.length) {
          // standing still: the line is absorbed, so only a living gesture leaves ink
          trail.current.shift();
        }
        mind = f.mind;
        agent = f.agent;
      } else if (f.mind.on) {
        // pointer left: both glide back home
        f.mind.x += (park.x - f.mind.x) * 0.06;
        f.mind.y += (park.y - f.mind.y) * 0.06;
        f.agent.x += (aPark.x - f.agent.x) * 0.06;
        f.agent.y += (aPark.y - f.agent.y) * 0.06;
        if (trail.current.length) trail.current.shift();
        mind = f.mind;
        agent = f.agent;
        if (Math.hypot(f.mind.x - park.x, f.mind.y - park.y) < 2) f.mind.on = false;
      }

      mindRef.current!.style.transform = `translate(${mind.x}px, ${mind.y}px)`;
      agentRef.current!.style.transform = `translate(${agent.x}px, ${agent.y}px)`;
      set(mindRef.current, String(seg(t, 0.15, 0.5)));
      set(agentRef.current, String(seg(t, 2.5, 2.9)));

      // ---- scribble: drawn as the mind loops, erased when the agent clicks
      const upto = Math.max(2, Math.floor(loopProg * (lp.length - 1)) + 1);
      scribbleRef.current!.setAttribute("d", t < 1.5 ? "" : polyD(lp.slice(0, upto)));
      set(scribbleRef.current, String(1 - seg(t, 3.75, 4.05)));

      // ---- click ripple
      const ck = seg(t, 3.72, 4.15);
      clickRef.current!.setAttribute("cx", String(wc.x));
      clickRef.current!.setAttribute("cy", String(wc.y + 18));
      clickRef.current!.setAttribute("r", String(8 + ck * 70));
      set(clickRef.current, String(ck > 0 && ck < 1 ? 0.55 * (1 - ck) : 0));

      // ---- highlight: a precise rounded frame wipes in over the word
      const hk = easeOut(seg(t, 3.85, 4.4));
      set(hiRef.current, String(hk > 0 ? 1 : 0));
      hiRef.current!.style.clipPath = `inset(0 0 0 ${(1 - hk) * 100}%)`;

      // ---- selection + guides
      set(selRef.current, String(seg(t, 4.7, 5.2)));
      const g = seg(t, 5.0, 5.35) * (1 - seg(t, 7.2, 7.8));
      set(guideRef.current, String(g));

      // ---- interactive trail: raw line (mind) and the cleaned line (agent)
      const tr = trail.current;
      if (tr.length > 2 && rawRef.current && cleanRef.current) {
        const jitter = tr.map((q, i) => ({ x: q.x + (noise(i * 1.7 + Math.floor(t * 8)) - 0.5) * 7, y: q.y + (noise(i * 2.3 + Math.floor(t * 8)) - 0.5) * 7 }));
        rawRef.current.setAttribute("d", polyD(jitter));
        const avg = tr.map((_, i) => {
          const a = tr.slice(Math.max(0, i - 4), i + 1);
          return { x: a.reduce((s, q) => s + q.x, 0) / a.length, y: a.reduce((s, q) => s + q.y, 0) / a.length };
        });
        cleanRef.current.setAttribute("d", smoothD(avg));
        set(rawRef.current, "1");
        set(cleanRef.current, "1");
      } else if (rawRef.current && cleanRef.current) {
        rawRef.current.setAttribute("d", "");
        cleanRef.current.setAttribute("d", "");
      }
    },
    { poster: 5.9, extraDeps: [geo] },
  );

  const W = geo?.word;
  const T = geo?.title;
  const hx = W ? W.x - 18 : 0;
  const hy = W ? W.y + 8 : 0;
  const hw = W ? W.w + 36 : 0;
  const hh = W ? W.h - 10 : 0;
  const pad = 28;
  const handles = (x: number, y: number, w: number, h: number) =>
    [
      [x, y],
      [x + w / 2, y],
      [x + w, y],
      [x, y + h / 2],
      [x + w, y + h / 2],
      [x, y + h],
      [x + w / 2, y + h],
      [x + w, y + h],
    ] as const;

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* dot grid of the canvas */}
      <svg className="absolute inset-0" width={STAGE_W} height={STAGE_H} aria-hidden>
        <defs>
          <pattern id="cv-dots" width="40" height="40" patternUnits="userSpaceOnUse" x="10" y="10">
            <circle cx="1.5" cy="1.5" r="1.5" fill={TH.dots} />
          </pattern>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#cv-dots)" />
      </svg>

      {/* editor chrome: where the lockup and the presenter live */}
      <div className="absolute inset-x-0 top-0 flex h-[96px] items-center justify-between px-[56px]"
        style={{ background: TH.bar, borderBottom: dark ? "1px solid #232634" : "none" }}>
        <RakayaLogo height={46} />
        <span className="text-[28px] font-normal leading-none" style={{ color: TH.barText }}>تقديم: عبدالملك الهندي</span>
      </div>

      <h1
        ref={titleRef}
        className="absolute right-[170px] top-[262px] text-[184px] font-black leading-[1.02]"
        style={{ color: TH.ink }}
      >
        <span className="block">الذكاء الاصطناعي</span>
        <span className="block">
          في المجالات{" "}
          <span ref={wordRef} className="inline-block">
            الإبداعية
          </span>
        </span>
      </h1>

      <p className="absolute right-[170px] top-[736px] text-[70px] font-medium leading-none"
        style={{ color: TH.ink }}>
        <span style={{ color: MIND }}>عقل يبدع</span>، <span style={{ color: AGENT }}>ووكيل ينفّذ</span>
      </p>

      <svg className="absolute inset-0" width={STAGE_W} height={STAGE_H} aria-hidden style={{ overflow: "visible", direction: "ltr" }}>
        {/* guides */}
        <g ref={guideRef} style={{ opacity: 0 }}>
          {T && (
            <>
              <line x1={T.x + T.w + 0} y1={T.y - 90} x2={T.x + T.w} y2={880} stroke={MIND} strokeWidth="1.5" />
              <line x1={T.x - 30} y1={T.y + T.h + 40} x2={T.x + T.w + 60} y2={T.y + T.h + 40} stroke={MIND} strokeWidth="1.5" strokeDasharray="0" />
              <g transform={`translate(${T.x + T.w + 20} ${T.y - 62})`}>
                <rect width="52" height="30" rx="6" fill={MIND} />
                <text x="26" y="21" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
                  170
                </text>
              </g>
            </>
          )}
        </g>

        {/* the agent's precise highlight */}
        <g ref={hiRef} style={{ opacity: 0 }}>
          {W && (
            <>
              <rect x={hx} y={hy} width={hw} height={hh} rx="26" fill={AGENT} fillOpacity={TH.hi} stroke={AGENT} strokeWidth="3" />
              {handles(hx, hy, hw, hh)
                .filter((_, i) => i === 0 || i === 2 || i === 5 || i === 7)
                .map(([x, y], i) => (
                  <rect key={i} x={x - 8} y={y - 8} width="16" height="16" rx="3" fill={TH.handle} stroke={AGENT} strokeWidth="3" />
                ))}
            </>
          )}
        </g>

        {/* selection of the whole title */}
        <g ref={selRef} style={{ opacity: 0 }}>
          {T && (
            <>
              <rect x={T.x - pad} y={T.y - pad + 6} width={T.w + pad * 2} height={T.h + pad * 2 - 12} fill="none" stroke={AGENT} strokeWidth="2" />
              {handles(T.x - pad, T.y - pad + 6, T.w + pad * 2, T.h + pad * 2 - 12).map(([x, y], i) => (
                <rect key={i} x={x - 7} y={y - 7} width="14" height="14" fill={TH.handle} stroke={AGENT} strokeWidth="2.5" />
              ))}
              <g transform={`translate(${T.x + T.w / 2 - 74} ${T.y + T.h + pad + 4})`}>
                <rect width="148" height="34" rx="8" fill={AGENT} />
                <text x="74" y="23.5" textAnchor="middle" fontSize="19" fontWeight="600" fill="#fff" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
                  {Math.round(T.w)} × {Math.round(T.h)}
                </text>
              </g>
            </>
          )}
        </g>

        <path ref={scribbleRef} fill="none" stroke={MIND} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle ref={clickRef} r="0" fill="none" stroke={AGENT} strokeWidth="4" style={{ opacity: 0 }} />
        <path ref={rawRef} fill="none" stroke={MIND} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 }} />
        <path ref={cleanRef} fill="none" stroke={AGENT} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 }} />
      </svg>

      <Cursor color={AGENT} label="وكيل" refEl={agentRef} />
      <Cursor color={MIND} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Canvas({ active = true, replay = 0, dark = false }: { active?: boolean; replay?: number; dark?: boolean }) {
  return (
    <Stage active={active} replay={replay} background={dark ? THEMES.dark.bg : THEMES.light.bg}>
      <CanvasScene dark={dark} />
    </Stage>
  );
}

export function CanvasDark(props: { active?: boolean; replay?: number }) {
  return <Canvas {...props} dark />;
}
