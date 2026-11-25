"use client";

import { useRef } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { LIGHT as C, DARK as D } from "../../kit/theme";
import { clamp, ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * LIGHT. A motion-design easing editor. The title enters along the curve.
 * The mind drags a handle to any value; the agent rounds it to a value you could write down, and the title uses that.
 */

const GX = 126;
const GY = 330;
const GS = 470;
const P2: V = { x: 0.25, y: 1 };
const PERIOD = 5.6;
const DUR = 1.15;
const bez = (a: number, b: number, k: number) => 3 * (1 - k) * (1 - k) * k * a + 3 * (1 - k) * k * k * b + k * k * k;
function solveY(p1: V, p2: V, x: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 22; i++) {
    const m = (lo + hi) / 2;
    if (bez(p1.x, p2.x, m) < x) lo = m;
    else hi = m;
  }
  return bez(p1.y, p2.y, (lo + hi) / 2);
}
const sx = (v: number) => GX + v * GS;
const sy = (v: number) => GY + (1 - v) * GS;
const snap = (v: number) => Math.round(v / 0.05) * 0.05;
const rawAt = (t: number): V => {
  if (t < 0.6) return { x: 0.7, y: 0.9 };
  if (t < 1.6) return { x: lerp(0.7, 0.12, ease(seg(t, 0.6, 1.6))), y: lerp(0.9, 0.82, ease(seg(t, 0.6, 1.6))) };
  if (t < 2.7) return { x: lerp(0.12, 0.272, ease(seg(t, 1.6, 2.7))), y: lerp(0.82, 0.121, ease(seg(t, 1.6, 2.7))) };
  return { x: 0.272, y: 0.121 };
};
const fmt = (p: V) => `cubic-bezier(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${P2.x.toFixed(2)}, ${P2.y.toFixed(2)})`;

function Scene() {
  const { pointer, active } = useStage();
  const rawPath = useRef<SVGPathElement>(null);
  const curvePath = useRef<SVGPathElement>(null);
  const hA = useRef<SVGGElement>(null);
  const hRaw = useRef<SVGCircleElement>(null);
  const hLine1 = useRef<SVGLineElement>(null);
  const hLine2 = useRef<SVGLineElement>(null);
  const hRawLine = useRef<SVGLineElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const roSnap = useRef<HTMLSpanElement>(null);
  const roRaw = useRef<HTMLSpanElement>(null);
  const l1 = useRef<HTMLSpanElement>(null);
  const l2 = useRef<HTMLSpanElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const raw = useRef<V>({ x: 0.7, y: 0.9 });
  const follow = useRef(newFollow());

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const live = active && t > 4 && p.inside;
      const inGraph = p.x > GX - 70 && p.x < GX + GS + 70 && p.y > GY - 90 && p.y < GY + GS + 90;
      const want: V = live && inGraph ? { x: clamp((p.x - GX) / GS, 0, 1), y: clamp(1 - (p.y - GY) / GS, -0.3, 1.3) } : rawAt(t);
      const k = live ? 0.35 : 1;
      raw.current.x += (want.x - raw.current.x) * k;
      raw.current.y += (want.y - raw.current.y) * k;
      const r = raw.current;
      const s: V = { x: clamp(snap(r.x), 0, 1), y: snap(r.y) };

      const d = (a: V) => `M${sx(0)} ${sy(0)}C${sx(a.x)} ${sy(a.y)} ${sx(P2.x)} ${sy(P2.y)} ${sx(1)} ${sy(1)}`;
      rawPath.current!.setAttribute("d", d(r));
      curvePath.current!.setAttribute("d", d(s));
      hLine1.current!.setAttribute("x2", String(sx(s.x)));
      hLine1.current!.setAttribute("y2", String(sy(s.y)));
      hLine2.current!.setAttribute("x2", String(sx(P2.x)));
      hLine2.current!.setAttribute("y2", String(sy(P2.y)));
      hRawLine.current!.setAttribute("x2", String(sx(r.x)));
      hRawLine.current!.setAttribute("y2", String(sy(r.y)));
      hRaw.current!.setAttribute("cx", String(sx(r.x)));
      hRaw.current!.setAttribute("cy", String(sy(r.y)));
      const g = hA.current!;
      g.querySelector<SVGRectElement>("[data-h=p1]")!.setAttribute("x", String(sx(s.x) - 12));
      g.querySelector<SVGRectElement>("[data-h=p1]")!.setAttribute("y", String(sy(s.y) - 12));

      // the title enters along the agent's curve, then holds, then goes round again
      const lt = t > 0.5 ? (t - 0.5) % PERIOD : 99;
      const ent = (delay: number) => {
        const tau = clamp((lt - delay) / DUR, 0, 1);
        return lt === 99 ? 1 : solveY(s, P2, tau);
      };
      const place2 = (el: HTMLElement | null, pv: number) => {
        if (!el) return;
        el.style.transform = `translateX(${(-(1 - pv) * 320).toFixed(1)}px)`;
        el.style.opacity = String(clamp(pv * 1.4, 0, 1));
        el.style.filter = `blur(${(Math.abs(1 - pv) * 12).toFixed(1)}px)`;
      };
      place2(l1.current, ent(0));
      place2(l2.current, ent(0.16));
      const tauNow = clamp(lt / DUR, 0, 1);
      dot.current!.setAttribute("cx", String(sx(tauNow)));
      dot.current!.setAttribute("cy", String(sy(solveY(s, P2, tauNow))));
      dot.current!.style.opacity = lt === 99 ? "0" : "1";

      roSnap.current!.textContent = fmt(s);
      roRaw.current!.textContent = fmt(r);

      const scripted: { mind: V; agent: V } = {
        mind: t < 0.6 ? { x: lerp(1500, sx(0.7), ease(seg(t, 0.2, 0.6))), y: lerp(160, sy(0.9), ease(seg(t, 0.2, 0.6))) } : { x: sx(r.x), y: sy(r.y) },
        agent: { x: lerp(1100, sx(s.x) + 20, ease(seg(t, 1.3, 2.4))), y: lerp(980, sy(s.y) + 30, ease(seg(t, 1.3, 2.4))) },
      };
      const cur = stepFollow(follow.current, { t, liveFrom: 4, active, pointer: p, scripted, agentTarget: { x: sx(s.x) + 20, y: sy(s.y) + 30 }, agentK: 0.14 });
      place(mindRef.current, cur.mind, seg(t, 0.2, 0.5));
      place(agentRef.current, cur.agent, seg(t, 1.3, 1.7));
    },
    { poster: 3.9 },
  );

  return (
    <div className="absolute inset-0" style={{ background: C.bg }}>
      {/* the dark graph panel carries the lockup */}
      <div className="absolute left-[56px] top-[90px] h-[900px] w-[640px] rounded-[26px]" style={{ background: D.panel, boxShadow: "0 30px 60px rgba(15,17,23,0.28)" }}>
        <RakayaLogo height={44} className="absolute right-[40px] top-[36px]" />
        <span className="absolute left-[40px] top-[44px] text-[28px] font-bold leading-none" style={{ color: D.text }}>التسارع</span>
        <span className="absolute bottom-[38px] left-[40px] text-[26px] leading-none" style={{ color: D.dim }}>تقديم: عبدالملك الهندي</span>
      </div>

      <svg className="absolute inset-0" width="1920" height="1080" aria-hidden style={{ overflow: "visible" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={sx(0)} x2={sx(1)} y1={sy(v)} y2={sy(v)} stroke="#2c303d" strokeWidth="1.5" />
            <line y1={sy(0)} y2={sy(1)} x1={sx(v)} x2={sx(v)} stroke="#2c303d" strokeWidth="1.5" />
          </g>
        ))}
        <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="#454a5c" strokeWidth="2" strokeDasharray="6 8" />
        <path ref={rawPath} fill="none" stroke={D.mind} strokeWidth="3" strokeDasharray="8 7" />
        <line ref={hRawLine} x1={sx(0)} y1={sy(0)} stroke={D.mind} strokeWidth="2" opacity="0.7" />
        <circle ref={hRaw} r="11" fill="none" stroke={D.mind} strokeWidth="3.5" />
        <path ref={curvePath} fill="none" stroke={D.agent} strokeWidth="6" strokeLinecap="round" />
        <g ref={hA}>
          <line ref={hLine1} x1={sx(0)} y1={sy(0)} stroke="#cdd3ff" strokeWidth="2.5" />
          <line ref={hLine2} x1={sx(1)} y1={sy(1)} stroke="#cdd3ff" strokeWidth="2.5" />
          <rect data-h="p1" width="24" height="24" rx="5" fill={D.agent} stroke="#fff" strokeWidth="3" />
          <rect x={sx(P2.x) - 12} y={sy(P2.y) - 12} width="24" height="24" rx="5" fill={D.agent} stroke="#fff" strokeWidth="3" />
        </g>
        <circle ref={dot} r="9" fill="#fff" stroke={D.agent} strokeWidth="4" />
      </svg>

      <div dir="ltr" className="absolute left-[96px] top-[820px] w-[560px]">
        <span ref={roRaw} className="block whitespace-nowrap text-[22px] tabular-nums leading-none line-through decoration-[2px]" style={{ color: D.mind }} />
        <span ref={roSnap} className="mt-[14px] block whitespace-nowrap text-[27px] font-semibold tabular-nums leading-none" style={{ color: D.text }} />
      </div>

      {/* the preview: the title travels the curve */}
      <h1 className="absolute right-[130px] top-[270px] text-[130px] font-black leading-[1.06]" style={{ color: C.text }}>
        <span ref={l1} className="block whitespace-nowrap will-change-transform">الذكاء الاصطناعي</span>
        <span ref={l2} className="block whitespace-nowrap will-change-transform">في المجالات الإبداعية</span>
      </h1>
      <p className="absolute right-[130px] top-[640px] text-[62px] font-bold leading-none">
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </p>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Curve({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
