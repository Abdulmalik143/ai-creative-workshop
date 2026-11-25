"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { LIGHT as C } from "../../kit/theme";
import { clamp, ease, lerp, seg, noise, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";
import { measure, center, type Box } from "../../kit/measure";

/**
 * LIGHT. A whiteboard of sticky notes. The mind throws them around (the pointer pushes them away);
 * the agent sets each one back square on the grid, and the guides flash as it lands.
 */

const NOTES = [
  { t: "الذكاء", bg: C.mind, fg: "#fff", row: 0 },
  { t: "الاصطناعي", bg: "#ffffff", fg: "#0f1117", row: 0 },
  { t: "في", bg: C.agent, fg: "#fff", row: 1 },
  { t: "المجالات", bg: "#ffffff", fg: "#0f1117", row: 1 },
  { t: "الإبداعية", bg: C.mind, fg: "#fff", row: 1 },
];
const SCATTER = NOTES.map((_, i) => ({ dx: (noise(i + 2) - 0.5) * 360, dy: (noise(i + 7) - 0.5) * 300, r: (noise(i + 13) - 0.5) * 26 }));

type S = { x: number; y: number; r: number; vx: number; vy: number; vr: number };

function Scene() {
  const { scale, pointer, active } = useStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const noteEls = useRef<(HTMLDivElement | null)[]>([]);
  const guideEls = useRef<(HTMLDivElement | null)[]>([]);
  const [homes, setHomes] = useState<Box[]>([]);
  const st = useRef<S[]>(NOTES.map((_, i) => ({ x: SCATTER[i].dx, y: SCATTER[i].dy, r: SCATTER[i].r, vx: 0, vy: 0, vr: 0 })));
  const flash = useRef<number[]>(NOTES.map(() => 0));
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const follow = useRef(newFollow());

  useLayoutEffect(() => {
    const run = () => {
      const r = rootRef.current;
      if (!r || !scale) return;
      // homes are measured with transforms cleared
      const prev = noteEls.current.map((e) => e?.style.transform ?? "");
      noteEls.current.forEach((e) => e && (e.style.transform = "none"));
      setHomes(measure(r, noteEls.current, scale));
      noteEls.current.forEach((e, i) => e && (e.style.transform = prev[i]));
    };
    run();
    document.fonts.ready.then(run);
  }, [scale]);

  useStageLoop(
    (t, dt) => {
      if (!homes.length) return;
      const p = pointer.current;
      const live = active && t > 4.3 && p.inside;
      const d = Math.min(0.05, Math.max(0.008, dt || 0.016));
      const poster = !active;
      let worst = -1;
      let worstD = 0;
      NOTES.forEach((_, i) => {
        const s = st.current[i];
        const el = noteEls.current[i]!;
        const home = center(homes[i]);
        if (poster) {
          s.x = 0; s.y = 0; s.r = 0; s.vx = s.vy = s.vr = 0;
        } else {
          // released one by one: the agent sets each back square
          const release = 1.1 + i * 0.4;
          if (t > release) {
            const k = 170;
            const c = 20;
            s.vx += (-k * s.x - c * s.vx) * d;
            s.vy += (-k * s.y - c * s.vy) * d;
            s.vr += (-k * 1.2 * s.r - c * 0.9 * s.vr) * d;
          } else {
            s.x = SCATTER[i].dx;
            s.y = SCATTER[i].dy;
            s.r = SCATTER[i].r;
          }
          if (live) {
            const dx = home.x + s.x - p.x;
            const dy = home.y + s.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 380) {
              const f = Math.pow(1 - dist / 380, 2) * 5200;
              s.vx += (dx / (dist + 1)) * f * d;
              s.vy += (dy / (dist + 1)) * f * d;
              s.vr += ((dx > 0 ? 1 : -1) * (1 - dist / 380) * 260 + (noise(i) - 0.5) * 40) * d;
            }
          }
          s.x += s.vx * d;
          s.y += s.vy * d;
          s.r += s.vr * d;
        }
        const off = Math.hypot(s.x, s.y) + Math.abs(s.r) * 3;
        if (off > worstD && t > 1.1) {
          worstD = off;
          worst = i;
        }
        // guides flash while a note is landing
        const landing = t > 1.1 + i * 0.4 && off < 12 && flash.current[i] === 0 && !poster;
        if (landing && (t < 1.1 + i * 0.4 + 1.6 || live)) flash.current[i] = 1;
        flash.current[i] *= 0.94;
        if (flash.current[i] < 0.02) flash.current[i] = 0;
        const g = guideEls.current[i];
        if (g) g.style.opacity = String(poster ? (i === 4 ? 1 : 0) : flash.current[i]);
        const lift = clamp(off / 140, 0, 1);
        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
        el.style.boxShadow = `0 ${14 + lift * 26}px ${24 + lift * 30}px rgba(15,17,23,${0.14 + lift * 0.12})`;
      });

      const scripted: { mind: V; agent: V } = {
        mind: { x: lerp(1650, 1010, ease(seg(t, 0.3, 1.4))), y: lerp(160, 760, ease(seg(t, 0.3, 1.4))) },
        agent: (() => {
          const idx = clamp(Math.floor((t - 1.1) / 0.4), 0, 4);
          const c = center(homes[idx]);
          return t < 1.1 ? { x: lerp(120, c.x, ease(seg(t, 0.3, 1.1))), y: lerp(1000, c.y, ease(seg(t, 0.3, 1.1))) } : t < 3.3 ? { x: c.x - 40, y: c.y + 50 } : { x: lerp(c.x - 40, 700, ease(seg(t, 3.3, 4))), y: lerp(c.y + 50, 880, ease(seg(t, 3.3, 4))) };
        })(),
      };
      let agentTarget: V | null = null;
      if (worst >= 0 && worstD > 18) {
        const c = center(homes[worst]);
        agentTarget = { x: c.x + st.current[worst].x - 30, y: c.y + st.current[worst].y + 60 };
      }
      const cur = stepFollow(follow.current, { t, liveFrom: 4.3, active, pointer: p, scripted, agentTarget, agentK: 0.14 });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 0.3, 0.6));
    },
    { poster: 4.6, extraDeps: [homes] },
  );

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ background: "#f3f4f9" }}>
      <svg className="absolute inset-0" width="1920" height="1080" aria-hidden>
        <defs>
          <pattern id="bd-dots" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#c9cddb" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#bd-dots)" />
      </svg>

      <h1 className="sr-only">الذكاء الاصطناعي في المجالات الإبداعية</h1>
      <div className="absolute right-[150px] top-[150px] flex flex-col items-start gap-[34px]" style={{ direction: "rtl" }}>
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-[26px]">
            {NOTES.map((n, i) =>
              n.row === row ? (
                <div
                  key={i}
                  ref={(el) => { noteEls.current[i] = el; }}
                  className="relative flex h-[200px] items-center justify-center rounded-[10px] px-[44px] text-[118px] font-black leading-none will-change-transform"
                  style={{ background: n.bg, color: n.fg }}
                >
                  {n.t}
                  <span className="absolute bottom-0 left-0 h-[34px] w-[34px]" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(15,17,23,0.14) 50%)", borderBottomLeftRadius: 10 }} />
                </div>
              ) : null,
            )}
          </div>
        ))}
      </div>

      {/* alignment guides */}
      {homes.length > 0 &&
        homes.map((b, i) => (
          <div key={i} className="pointer-events-none absolute" ref={(el) => { guideEls.current[i] = el; }} style={{ opacity: 0 }}>
            <div className="absolute h-[2px]" style={{ left: b.x - 40, width: b.w + 80, top: b.y, background: C.agent }} />
            <div className="absolute h-[2px]" style={{ left: b.x - 40, width: b.w + 80, top: b.y + b.h, background: C.agent }} />
            <div className="absolute w-[2px]" style={{ left: b.x + b.w, top: b.y - 40, height: b.h + 80, background: C.agent }} />
          </div>
        ))}

      <p className="absolute right-[150px] top-[690px] text-[72px] font-bold leading-none">
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </p>

      {/* the dark toolbar carries the lockup */}
      <div className="absolute bottom-[44px] left-1/2 flex h-[88px] w-[820px] -translate-x-1/2 items-center justify-between rounded-[44px] px-[44px]" style={{ background: C.bar, boxShadow: "0 18px 40px rgba(15,17,23,0.28)" }}>
        <RakayaLogo height={44} />
        <span className="text-[27px] leading-none" style={{ color: C.barText }}>تقديم: عبدالملك الهندي</span>
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Board({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#f3f4f9">
      <Scene />
    </Stage>
  );
}
