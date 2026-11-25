"use client";

import { useRef } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { DARK as C } from "../../kit/theme";
import { clamp, ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * DARK. A 3D viewport. The title is a solid with depth; the mind orbits the camera with the pointer,
 * the agent keeps the bounding box and the gizmo honest.
 */

const LAYERS = 24;
const DEPTH = 6;
const BOX = { w: 1600, h: 470, d: LAYERS * DEPTH };

const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(lerp(v, b[i], k)));

function Scene() {
  const { pointer, active } = useStage();
  const worldRef = useRef<HTMLDivElement>(null);
  const gx = useRef<SVGLineElement>(null);
  const gy = useRef<SVGLineElement>(null);
  const gz = useRef<SVGLineElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const cam = useRef({ ry: -24, rx: 14 });
  const follow = useRef(newFollow());

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const live = active && t > 3.5 && p.inside;
      let ty: number;
      let tx: number;
      if (live) {
        ty = clamp((p.x - 960) / 960, -1, 1) * 22;
        tx = 20 - clamp((p.y - 540) / 540, -1, 1) * 10;
      } else if (t < 3.2) {
        ty = lerp(-30, 5, ease(seg(t, 0.2, 3.2)));
        tx = lerp(30, 20, ease(seg(t, 0.2, 3.2)));
      } else {
        ty = 5 + 8 * Math.sin((t - 3.2) * 0.45);
        tx = 20 + 3 * Math.sin((t - 3.2) * 0.3);
      }
      const c = cam.current;
      c.ry += (ty - c.ry) * (live ? 0.1 : 1);
      c.rx += (tx - c.rx) * (live ? 0.1 : 1);
      if (!live && t < 3.2) {
        c.ry = ty;
        c.rx = tx;
      }
      worldRef.current!.style.transform = `rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;

      // gizmo: project the axes through the same rotation
      const ay = (c.ry * Math.PI) / 180;
      const ax = (c.rx * Math.PI) / 180;
      const proj = (v: number[]) => {
        // CSS: p' = Rx(Rotation) * Ry(...) * p
        const [x, y, z] = v;
        const x1 = x * Math.cos(ay) + z * Math.sin(ay);
        const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
        const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
        return [x1, y2];
      };
      const set = (el: SVGLineElement | null, v: number[]) => {
        if (!el) return;
        const [x, y] = proj(v);
        el.setAttribute("x2", String(60 + x * 44));
        el.setAttribute("y2", String(60 + y * 44));
      };
      set(gx.current, [1, 0, 0]);
      set(gy.current, [0, 1, 0]);
      set(gz.current, [0, 0, 1]);

      const scripted: { mind: V; agent: V } = {
        mind: { x: lerp(1600, 1380, ease(seg(t, 0.4, 3))), y: lerp(160, 360, ease(seg(t, 0.4, 3))) },
        agent: { x: 420, y: 760 },
      };
      const cur = stepFollow(follow.current, { t, liveFrom: 3.5, active, pointer: p, scripted, agentOffset: { x: -90, y: 90 }, agentK: 0.06 });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 1.2, 1.6));
    },
    { poster: 4 },
  );

  const layers = Array.from({ length: LAYERS }, (_, i) => i);
  const face = [244, 245, 248];
  const edgeA = [255, 79, 160];
  const edgeB = [40, 14, 38];
  const edge = (X: number, Y: number, Z: number, w: number, rot: string) => (
    <div className="absolute" style={{ left: X, top: Y, width: w, height: 2, background: C.agent, transform: `translateZ(${Z}px) ${rot}`, transformOrigin: "0 0", boxShadow: `0 0 10px ${C.agent}` }} />
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #171a2a 0%, #0c0d12 65%, #06070a 100%)" }}>
      <div className="absolute left-1/2 top-[760px] h-[150px] w-[1500px] -translate-x-1/2" style={{ background: `radial-gradient(ellipse at center, ${C.mind}40, transparent 68%)`, filter: "blur(18px)" }} />
      <div className="absolute inset-0" style={{ perspective: 1750, perspectiveOrigin: "50% 24%" }}>
        <div ref={worldRef} className="absolute" style={{ left: 960, top: 430, width: 0, height: 0, transformStyle: "preserve-3d" }}>
          {/* the solid title: stacked copies give it depth */}
          <div className="absolute" style={{ left: -850, top: -205, width: 1700, height: 410, transformStyle: "preserve-3d" }}>
            {layers.map((i) => {
              const col = i === 0 ? face : mix(edgeA, edgeB, (i - 1) / (LAYERS - 1));
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[172px] font-black leading-[1.04]"
                  style={{ transform: `translateZ(${-i * DEPTH}px)`, color: `rgb(${col.join(",")})` }}
                  aria-hidden={i !== 0}
                >
                  <span className="block whitespace-nowrap">الذكاء الاصطناعي</span>
                  <span className="block whitespace-nowrap">في المجالات الإبداعية</span>
                </div>
              );
            })}

            {/* the agent's bounding box */}
            <div className="absolute" style={{ left: 850 - BOX.w / 2, top: 205 - BOX.h / 2, width: BOX.w, height: BOX.h, transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0" style={{ border: `2px solid ${C.agent}` }} />
              <div className="absolute inset-0" style={{ border: `2px solid ${C.agent}88`, transform: `translateZ(${-BOX.d}px)` }} />
              {edge(0, 0, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(BOX.w, 0, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(0, BOX.h, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(BOX.w, BOX.h, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {[[0, 0], [BOX.w, 0], [0, BOX.h], [BOX.w, BOX.h]].map(([x, y], i) => (
                <div key={i} className="absolute h-[16px] w-[16px]" style={{ left: x - 8, top: y - 8, background: "#0c0d12", border: `3px solid ${C.agent}` }} />
              ))}
              <span dir="ltr" className="absolute left-0 rounded-[6px] px-[12px] py-[5px] text-[22px] font-semibold tabular-nums leading-none text-white" style={{ top: BOX.h + 16, background: C.agent }}>
                {BOX.w} × {BOX.h} × {BOX.d}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* gizmo */}
      <svg className="absolute left-[96px] top-[96px]" width="120" height="120" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="56" fill="#ffffff08" stroke="#ffffff22" />
        <line ref={gz} x1="60" y1="60" x2="60" y2="60" stroke={C.agent} strokeWidth="4" strokeLinecap="round" />
        <line ref={gy} x1="60" y1="60" x2="60" y2="60" stroke="#e8ebf4" strokeWidth="4" strokeLinecap="round" />
        <line ref={gx} x1="60" y1="60" x2="60" y2="60" stroke={C.mind} strokeWidth="4" strokeLinecap="round" />
      </svg>

      <p className="absolute bottom-[104px] right-[120px] text-[58px] font-medium leading-none">
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </p>
      <span className="absolute bottom-[110px] left-[110px] text-[28px] leading-none" style={{ color: C.dim }}>
        تقديم: عبدالملك الهندي
      </span>
      <RakayaLogo height={46} className="absolute right-[110px] top-[92px]" />
      <h1 className="sr-only">الذكاء الاصطناعي في المجالات الإبداعية</h1>
      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Viewport({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#0c0d12">
      <Scene />
    </Stage>
  );
}
