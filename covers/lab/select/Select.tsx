"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { LIGHT as C } from "../../kit/theme";
import { ease, lerp, noise, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";
import { measure, center, nearest, type Box } from "../../kit/measure";

/**
 * LIGHT. Selection tools. "عقل" lassos loosely around a word; "وكيل" returns the exact selection
 * with marching ants and the tools that belong to it.
 */

const L1 = ["الذكاء", "الاصطناعي"];
const L2 = ["في", "المجالات", "الإبداعية"];
const SUB = ["عقل يبدع", "ووكيل ينفّذ"];
const polyD = (pts: V[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");

function loopOf(b: Box): V[] {
  const c = center(b);
  const rx = b.w / 2 + 40;
  const ry = b.h / 2 + 30;
  return Array.from({ length: 84 }, (_, i) => {
    const a = -2.4 + (i / 83) * (Math.PI * 2 + 1);
    const w = 1 + 0.07 * Math.sin(a * 3) + (noise(i) - 0.5) * 0.06;
    return { x: c.x + Math.cos(a) * rx * w, y: c.y + Math.sin(a) * ry * w + (i / 83) * 8 };
  });
}

const Icon = ({ d, on }: { d: string; on?: boolean }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={on ? "#fff" : "#aab0c3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

function Scene() {
  const { scale, pointer, active } = useStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const lassoRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const selRef = useRef<SVGGElement>(null);
  const antsA = useRef<SVGRectElement>(null);
  const antsB = useRef<SVGRectElement>(null);
  const tint = useRef<SVGRectElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const follow = useRef(newFollow());
  const rect = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const trail = useRef<V[]>([]);

  useLayoutEffect(() => {
    const run = () => rootRef.current && scale && setBoxes(measure(rootRef.current, els.current, scale));
    run();
    document.fonts.ready.then(run);
  }, [scale]);

  useStageLoop(
    (t) => {
      if (boxes.length < 7) return;
      const p = pointer.current;
      const live = active && t > 5.2 && p.inside;
      const loop = loopOf(boxes[1]);
      let idx: number;
      if (live) idx = nearest(boxes, p);
      else idx = t < 3.9 ? 1 : 4;
      const hasSel = live || t > 2.8;

      // lasso drawn by the mind during the intro
      const lp = seg(t, 1.0, 2.5);
      const upto = Math.max(2, Math.floor(ease(lp) * (loop.length - 1)) + 1);
      lassoRef.current!.setAttribute("d", t < 1.0 || live ? "" : polyD(loop.slice(0, upto)));
      lassoRef.current!.style.opacity = String(1 - seg(t, 2.75, 3.05));

      // the agent's exact selection springs onto its target
      const b = boxes[idx];
      const tg = { x: b.x - 22, y: b.y + 4, w: b.w + 44, h: b.h - 6 };
      const r = rect.current;
      if (r.w === 0) Object.assign(r, tg);
      const k = hasSel ? 0.2 : 1;
      r.x += (tg.x - r.x) * k;
      r.y += (tg.y - r.y) * k;
      r.w += (tg.w - r.w) * k;
      r.h += (tg.h - r.h) * k;
      const on = hasSel ? 1 : 0;
      selRef.current!.style.opacity = String(on);
      for (const el of [antsA.current, antsB.current, tint.current]) {
        if (!el) continue;
        el.setAttribute("x", String(r.x));
        el.setAttribute("y", String(r.y));
        el.setAttribute("width", String(r.w));
        el.setAttribute("height", String(r.h));
      }
      antsA.current!.setAttribute("stroke-dashoffset", String(-t * 34));
      antsB.current!.setAttribute("stroke-dashoffset", String(-t * 34 + 14));
      bar.current!.style.transform = `translate(${r.x + r.w / 2 - 175}px, ${r.y + r.h + 26}px)`;
      bar.current!.style.opacity = String(hasSel ? seg(t, 3.0, 3.3) : 0);

      // freehand trail while you move
      if (live) {
        const l = trail.current[trail.current.length - 1];
        if (!l || Math.hypot(l.x - p.x, l.y - p.y) > 7) {
          trail.current.push({ x: p.x, y: p.y });
          if (trail.current.length > 40) trail.current.shift();
        } else if (trail.current.length) trail.current.shift();
      } else if (trail.current.length) trail.current.shift();
      trailRef.current!.setAttribute("d", trail.current.length > 2 ? polyD(trail.current) : "");

      const c = center(boxes[idx]);
      const scripted: { mind: V; agent: V } = {
        mind: t < 2.6 ? (() => { const q = loop[Math.min(loop.length - 1, Math.floor(ease(lp) * (loop.length - 1)))]; return t < 1.0 ? { x: lerp(1600, loop[0].x, ease(seg(t, 0.3, 1.0))), y: lerp(160, loop[0].y, ease(seg(t, 0.3, 1.0))) } : q; })()
          : { x: lerp(loop[loop.length - 1].x, boxes[4].x + 60, ease(seg(t, 3.5, 4.3))), y: lerp(loop[loop.length - 1].y, boxes[4].y + boxes[4].h, ease(seg(t, 3.5, 4.3))) },
        agent: { x: lerp(120, c.x + 60, ease(seg(t, 2.0, 2.9))), y: lerp(1000, c.y + 90, ease(seg(t, 2.0, 2.9))) },
      };
      if (t > 3.9) scripted.agent = { x: boxes[4].x + boxes[4].w * 0.5 + 40, y: boxes[4].y + boxes[4].h + 40 };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 5.2,
        active,
        pointer: p,
        scripted,
        agentTarget: { x: r.x + r.w - 10, y: r.y + r.h + 10 },
        agentK: 0.14,
      });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.7));
      place(agentRef.current, cur.agent, seg(t, 2.0, 2.4));
    },
    { poster: 5, extraDeps: [boxes] },
  );

  const w = (s: string, i: number) => (
    <span key={s} ref={(el) => { els.current[i] = el; }} className="inline-block px-[0.08em]">
      {s}
    </span>
  );

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ background: C.bg }}>
      <svg className="absolute inset-0" width="1920" height="1080" aria-hidden>
        <defs>
          <pattern id="sl-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill={C.dots} />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#sl-dots)" />
      </svg>

      {/* the toolbar: a dark pill carries the lockup */}
      <div className="absolute left-1/2 top-[40px] flex h-[84px] w-[1040px] -translate-x-1/2 items-center justify-between rounded-[42px] px-[40px]" style={{ background: C.bar, boxShadow: "0 18px 40px rgba(15,17,23,0.25)" }}>
        <RakayaLogo height={42} />
        <span className="text-[26px] leading-none" style={{ color: C.barText }}>تقديم: عبدالملك الهندي</span>
        <div className="flex items-center gap-[22px]" dir="ltr">
          <Icon d="M5 3l14 9-6 1.4L10 20z" />
          <Icon d="M4 12c0-5 4-8 8-8s8 3 8 7-3 6-7 6c-2 0-3 1-3 2" on />
          <Icon d="M4 4h16v16H4z" />
          <Icon d="M12 3v18M3 12h18" />
        </div>
      </div>

      <h1 className="absolute right-[170px] top-[218px] text-[186px] font-black leading-[1.04]" style={{ color: C.text }}>
        <span className="block whitespace-nowrap">{L1.map((s, i) => w(s, i))}</span>
        <span className="block whitespace-nowrap">{L2.map((s, i) => w(s, i + 2))}</span>
      </h1>
      <p className="absolute right-[170px] top-[744px] whitespace-nowrap text-[68px] font-bold leading-none">
        <span style={{ color: C.mind }}>{w(SUB[0], 5)}</span>
        <span style={{ color: C.dim }}>،</span> <span style={{ color: C.agent }}>{w(SUB[1], 6)}</span>
      </p>

      <svg className="pointer-events-none absolute inset-0" width="1920" height="1080" aria-hidden style={{ overflow: "visible" }}>
        <g ref={selRef} style={{ opacity: 0 }}>
          <rect ref={tint} rx="14" fill={C.agent} fillOpacity="0.12" />
          <rect ref={antsA} rx="14" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="14 14" />
          <rect ref={antsB} rx="14" fill="none" stroke={C.text} strokeWidth="4" strokeDasharray="14 14" />
        </g>
        <path ref={lassoRef} fill="none" stroke={C.mind} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 12" />
        <path ref={trailRef} fill="none" stroke={C.mind} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 12" />
      </svg>

      {/* the selection's own tools */}
      <div ref={bar} className="absolute left-0 top-0 flex h-[68px] w-[350px] items-center justify-center gap-[26px] rounded-[16px]" style={{ background: C.bar, opacity: 0, boxShadow: "0 14px 30px rgba(15,17,23,0.28)" }} dir="ltr">
        <Icon d="M5 9l7-6 7 6M12 3v14" />
        <Icon d="M8 8h11v11H8zM5 16V5h11" />
        <Icon d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" on />
        <Icon d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Select({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
