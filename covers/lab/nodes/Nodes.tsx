"use client";

import { useRef } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { LIGHT as C } from "../../kit/theme";
import { ease, easeOut, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * LIGHT. A node graph. "عقل" drags a loose cable with the pointer; "وكيل" is the socket that catches it
 * and turns it into a clean connection.
 */

type N = { x: number; y: number; w: number; h: number };
const A: N = { x: 1230, y: 540, w: 340, h: 270 };
const B: N = { x: 780, y: 620, w: 340, h: 270 };
const Cn: N = { x: 250, y: 540, w: 420, h: 310 };
const HEAD = 64;

const pOut1 = (n: N): V => ({ x: n.x, y: n.y + HEAD + 52 });
const pOut2 = (n: N): V => ({ x: n.x, y: n.y + HEAD + 130 });
const pIn1 = (n: N): V => ({ x: n.x + n.w, y: n.y + HEAD + 52 });
const pIn2 = (n: N): V => ({ x: n.x + n.w, y: n.y + HEAD + 130 });
const TARGETS = [pIn2(B), pIn2(Cn)];

const wire = (a: V, b: V) => {
  const d = Math.max(70, Math.abs(a.x - b.x) * 0.5);
  return `M${a.x} ${a.y}C${a.x - d} ${a.y} ${b.x + d} ${b.y} ${b.x} ${b.y}`;
};
const loose = (a: V, e: V, sag: number) => `M${a.x} ${a.y}C${a.x - 120} ${a.y + sag} ${e.x + 100} ${e.y + sag + 40} ${e.x} ${e.y}`;

function Scene() {
  const { pointer, active } = useStage();
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const looseRef = useRef<SVGPathElement>(null);
  const cleanRef = useRef<SVGPathElement>(null);
  const flowA = useRef<SVGPathElement>(null);
  const flowB = useRef<SVGPathElement>(null);
  const flowC = useRef<SVGPathElement>(null);
  const endRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const glowB = useRef<HTMLDivElement>(null);
  const glowC = useRef<HTMLDivElement>(null);
  const follow = useRef(newFollow());
  const snap = useRef({ idx: -1, at: 0 });
  const end = useRef<V>({ x: 1330, y: 900 });

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const src = pOut2(A);
      const live = active && t > 4 && p.inside;

      // where the loose end is, and whether a socket has caught it
      let want: V;
      let snapped = -1;
      if (live) {
        want = { x: p.x, y: p.y };
        let bd = 175;
        TARGETS.forEach((tg, i) => {
          const d = Math.hypot(p.x - tg.x, p.y - tg.y);
          if (d < bd) {
            bd = d;
            snapped = i;
          }
        });
      } else if (t < 3.1) {
        const k = ease(seg(t, 0.9, 3.0));
        want = { x: lerp(1380, 1170, k) + Math.sin(t * 5) * (1 - k) * 30, y: lerp(950, 830, k) + Math.cos(t * 4) * (1 - k) * 24 };
      } else {
        want = TARGETS[0];
        snapped = 0;
      }
      if (snap.current.idx !== snapped) snap.current = { idx: snapped, at: t };
      const tgt = snapped >= 0 ? TARGETS[snapped] : want;
      end.current.x += (tgt.x - end.current.x) * (snapped >= 0 ? 0.3 : live ? 0.35 : 1);
      end.current.y += (tgt.y - end.current.y) * (snapped >= 0 ? 0.3 : live ? 0.35 : 1);
      const e = end.current;

      const lp = looseRef.current!;
      const cp = cleanRef.current!;
      if (snapped >= 0) {
        cp.setAttribute("d", wire(src, e));
        cp.style.opacity = "1";
        lp.style.opacity = "0";
      } else {
        lp.setAttribute("d", loose(src, e, 90 + Math.sin(t * 3) * 8));
        lp.style.opacity = String(seg(t, 0.7, 1));
        cp.style.opacity = "0";
      }
      endRef.current!.setAttribute("transform", `translate(${e.x} ${e.y})`);
      endRef.current!.style.opacity = String(seg(t, 0.7, 1));
      endRef.current!.querySelector("circle")!.setAttribute("fill", snapped >= 0 ? C.agent : C.mind);

      // pulse on catch
      const since = t - snap.current.at;
      const ring = ringRef.current!;
      if (snapped >= 0 && since < 0.6) {
        ring.setAttribute("cx", String(e.x));
        ring.setAttribute("cy", String(e.y));
        ring.setAttribute("r", String(14 + since * 70));
        ring.style.opacity = String(1 - since / 0.6);
      } else ring.style.opacity = "0";

      // current flowing along the connected wires
      const off = -t * 70;
      [flowA.current, flowB.current, flowC.current].forEach((el) => el && el.setAttribute("stroke-dashoffset", String(off)));
      glowB.current!.style.opacity = snapped === 0 ? "1" : "0";
      glowC.current!.style.opacity = snapped === 1 ? "1" : "0";

      // cursors
      const nearestPort = TARGETS.reduce((a, tg) => (Math.hypot(tg.x - e.x, tg.y - e.y) < Math.hypot(a.x - e.x, a.y - e.y) ? tg : a), TARGETS[0]);
      const scripted: { mind: V; agent: V } = {
        mind: t < 3.1 ? { x: e.x - 6, y: e.y - 4 } : { x: 1190, y: 960 },
        agent: { x: lerp(300, pIn2(B).x - 10, easeOut(seg(t, 1.8, 3.1))), y: lerp(1000, pIn2(B).y + 14, easeOut(seg(t, 1.8, 3.1))) },
      };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 4,
        active,
        pointer: p,
        scripted,
        agentTarget: { x: nearestPort.x - 14, y: nearestPort.y + 18 },
        agentK: 0.12,
      });
      place(mindRef.current, cur.mind, seg(t, 0.5, 0.9));
      place(agentRef.current, cur.agent, seg(t, 1.8, 2.2));
    },
    { poster: 4.4 },
  );

  const card = (n: N) => ({ left: n.x, top: n.y, width: n.w, height: n.h, background: C.panel, border: `1.5px solid ${C.line}`, boxShadow: "0 18px 36px rgba(15,17,23,0.10)" });
  const port = (v: V, color: string) => <circle cx={v.x} cy={v.y} r="11" fill="#fff" stroke={color} strokeWidth="4" />;

  return (
    <div className="absolute inset-0" style={{ background: C.bg }}>
      <svg className="absolute inset-0" width="1920" height="1080" aria-hidden>
        <defs>
          <pattern id="nd-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill={C.dots} />
          </pattern>
        </defs>
        <rect width="1760" height="1080" fill="url(#nd-dots)" />
      </svg>

      <h1 className="absolute right-[280px] top-[88px] text-[158px] font-black leading-[1.03]" style={{ color: C.text }}>
        <span className="block whitespace-nowrap">الذكاء الاصطناعي</span>
        <span className="block whitespace-nowrap">في المجالات الإبداعية</span>
      </h1>

      {/* nodes */}
      <div className="absolute rounded-[20px]" style={card(A)}>
        <div className="flex items-center px-[24px] text-[34px] font-bold text-white" style={{ height: HEAD, background: C.mind, borderRadius: "18px 18px 0 0" }}>عقل يبدع</div>
        <svg className="absolute inset-x-0 bottom-0" height={A.h - HEAD} width={A.w} viewBox={`0 0 ${A.w} ${A.h - HEAD}`} aria-hidden>
          <path d="M40 150 C70 40 110 40 130 110 S 190 190 215 90 S 270 60 300 120" fill="none" stroke={C.mind} strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute rounded-[20px]" style={card(B)}>
        <div className="flex items-center px-[24px] text-[34px] font-bold text-white" style={{ height: HEAD, background: C.agent, borderRadius: "18px 18px 0 0" }}>ووكيل ينفّذ</div>
        <div className="absolute inset-x-[28px] bottom-[28px] grid grid-cols-5 gap-[10px]" style={{ top: HEAD + 24 }}>
          {Array.from({ length: 15 }, (_, i) => (
            <span key={i} className="rounded-[7px]" style={{ background: i % 4 === 0 ? C.agent : `${C.agent}26` }} />
          ))}
        </div>
      </div>
      <div ref={glowB} className="pointer-events-none absolute rounded-[22px] transition-opacity duration-200" style={{ left: B.x - 6, top: B.y - 6, width: B.w + 12, height: B.h + 12, boxShadow: `0 0 0 3px ${C.agent}, 0 0 36px ${C.agent}66`, opacity: 0 }} />
      <div className="absolute rounded-[20px]" style={card(Cn)}>
        <div className="flex items-center px-[24px] text-[34px] font-bold" style={{ height: HEAD, background: C.bar, color: "#e9ecf5", borderRadius: "18px 18px 0 0" }}>الناتج</div>
        <div className="absolute inset-x-[24px] bottom-[24px] flex flex-col items-center justify-center rounded-[12px] text-[36px] font-black leading-[1.15]" style={{ top: HEAD + 22, background: "#0f1117", color: "#f4f5f8" }}>
          <span>الذكاء الاصطناعي</span>
          <span>في المجالات الإبداعية</span>
        </div>
      </div>
      <div ref={glowC} className="pointer-events-none absolute rounded-[22px] transition-opacity duration-200" style={{ left: Cn.x - 6, top: Cn.y - 6, width: Cn.w + 12, height: Cn.h + 12, boxShadow: `0 0 0 3px ${C.agent}, 0 0 36px ${C.agent}66`, opacity: 0 }} />

      <svg className="pointer-events-none absolute inset-0" width="1920" height="1080" aria-hidden style={{ overflow: "visible" }}>
        {/* connected wires */}
        <path d={wire(pOut1(A), pIn1(B))} fill="none" stroke={C.agent} strokeWidth="5" strokeLinecap="round" />
        <path ref={flowA} d={wire(pOut1(A), pIn1(B))} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 30" opacity="0.8" />
        <path d={wire(pOut1(B), pIn1(Cn))} fill="none" stroke={C.agent} strokeWidth="5" strokeLinecap="round" />
        <path ref={flowB} d={wire(pOut1(B), pIn1(Cn))} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 30" opacity="0.8" />
        {/* the cable you hold */}
        <path ref={looseRef} fill="none" stroke={C.mind} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 0" style={{ opacity: 0 }} />
        <path ref={cleanRef} fill="none" stroke={C.agent} strokeWidth="6" strokeLinecap="round" style={{ opacity: 0 }} />
        <path ref={flowC} fill="none" stroke="none" />
        {[pOut1(A), pOut2(A), pOut1(B)].map((v, i) => <g key={i}>{port(v, i === 2 ? C.agent : C.mind)}</g>)}
        {[pIn1(B), pIn2(B), pIn1(Cn), pIn2(Cn)].map((v, i) => <g key={i}>{port(v, C.agent)}</g>)}
        <circle ref={ringRef} r="14" fill="none" stroke={C.agent} strokeWidth="4" style={{ opacity: 0 }} />
        <g ref={endRef} style={{ opacity: 0 }}>
          <circle r="13" fill={C.mind} stroke="#fff" strokeWidth="4" />
        </g>
      </svg>

      {/* the dark rail carries the lockup */}
      <div className="absolute inset-y-0 right-0 w-[160px]" style={{ background: C.bar }}>
        <RakayaLogo height={48} className="absolute left-1/2 top-[64px] -translate-x-1/2" />
        <p className="absolute inset-x-0 bottom-[72px] px-[14px] text-center text-[23px] leading-[1.5]" style={{ color: C.barText }}>
          تقديم:<br />عبدالملك<br />الهندي
        </p>
      </div>
      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Nodes({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
