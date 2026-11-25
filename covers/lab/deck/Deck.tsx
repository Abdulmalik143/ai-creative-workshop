"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Stage, useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { LIGHT as C } from "../../kit/theme";
import { clamp, ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * LIGHT. A slide editor with the cover open inside it.
 * The mind drags the title's corner to any size at all (pink, dashed); the agent snaps it to a real value
 * (blue) and types it into the inspector.
 */

const S = { x: 400, y: 150, w: 1240, h: 697 };
const TITLE_RIGHT = S.x + S.w - 90;
const TITLE_TOP = S.y + 130;
const STEP = 4;
const BASE = 120;
const rawAt = (t: number) => {
  if (t < 1) return 120;
  if (t < 1.9) return lerp(120, 172, ease(seg(t, 1, 1.9)));
  if (t < 2.7) return lerp(172, 88, ease(seg(t, 1.9, 2.7)));
  if (t < 3.4) return lerp(88, 123.6, ease(seg(t, 2.7, 3.4)));
  return 123.6;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-[24px]" style={{ color: C.dim }}>{label}</span>
    {children}
  </div>
);

function Scene() {
  const { pointer, active } = useStage();
  const titleRef = useRef<HTMLDivElement>(null);
  const [nat, setNat] = useState({ w: 1017, h: 252 });
  const rawBox = useRef<SVGRectElement>(null);
  const snapBox = useRef<SVGGElement>(null);
  const snapRect = useRef<SVGRectElement>(null);
  const handles = useRef<(SVGRectElement | null)[]>([]);
  const numSnap = useRef<HTMLSpanElement>(null);
  const numRaw = useRef<HTMLSpanElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const follow = useRef(newFollow());
  const rawSize = useRef(BASE);

  useLayoutEffect(() => {
    const run = () => titleRef.current && setNat({ w: titleRef.current.offsetWidth, h: titleRef.current.offsetHeight });
    run();
    document.fonts.ready.then(run);
  }, []);

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const live = active && t > 4.2 && p.inside;
      const want = live ? lerp(80, 190, clamp((p.x - S.x) / S.w, 0, 1)) : rawAt(t);
      rawSize.current += (want - rawSize.current) * (live ? 0.3 : 1);
      const raw = rawSize.current;
      const snap = Math.round(raw / STEP) * STEP;
      const sc = snap / BASE;
      titleRef.current!.style.transform = `scale(${sc})`;

      const cy = TITLE_TOP + nat.h / 2;
      const rw = nat.w * (raw / BASE);
      const rh = nat.h * (raw / BASE);
      const sw = nat.w * sc;
      const sh = nat.h * sc;
      const rb = rawBox.current!;
      rb.setAttribute("x", String(TITLE_RIGHT - rw));
      rb.setAttribute("y", String(cy - rh / 2));
      rb.setAttribute("width", String(rw));
      rb.setAttribute("height", String(rh));
      rb.style.opacity = String(seg(t, 0.9, 1.2));
      const sr = snapRect.current!;
      sr.setAttribute("x", String(TITLE_RIGHT - sw));
      sr.setAttribute("y", String(cy - sh / 2));
      sr.setAttribute("width", String(sw));
      sr.setAttribute("height", String(sh));
      snapBox.current!.style.opacity = String(seg(t, 1.0, 1.3));
      const pts = [
        [TITLE_RIGHT - sw, cy - sh / 2], [TITLE_RIGHT - sw / 2, cy - sh / 2], [TITLE_RIGHT, cy - sh / 2],
        [TITLE_RIGHT - sw, cy], [TITLE_RIGHT, cy],
        [TITLE_RIGHT - sw, cy + sh / 2], [TITLE_RIGHT - sw / 2, cy + sh / 2], [TITLE_RIGHT, cy + sh / 2],
      ];
      handles.current.forEach((h, i) => {
        if (!h) return;
        h.setAttribute("x", String(pts[i][0] - 9));
        h.setAttribute("y", String(pts[i][1] - 9));
      });
      if (numSnap.current) numSnap.current.textContent = String(snap);
      if (numRaw.current) numRaw.current.textContent = raw.toFixed(1);

      const mindAt: V = { x: TITLE_RIGHT - rw - 4, y: cy + rh / 2 + 4 };
      const agentHome: V = { x: 230, y: 436 };
      const scripted = {
        mind: t < 1 ? { x: lerp(1500, mindAt.x, ease(seg(t, 0.3, 1))), y: lerp(160, mindAt.y, ease(seg(t, 0.3, 1))) } : mindAt,
        agent: { x: lerp(1200, agentHome.x, ease(seg(t, 1.4, 2.6))), y: lerp(1000, agentHome.y, ease(seg(t, 1.4, 2.6))) },
      };
      const cur = stepFollow(follow.current, { t, liveFrom: 4.2, active, pointer: p, scripted, agentTarget: { x: agentHome.x + 6, y: agentHome.y + 6 }, agentK: 0.1 });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.7));
      place(agentRef.current, cur.agent, seg(t, 1.4, 1.8));
    },
    { poster: 4.8, extraDeps: [nat] },
  );

  return (
    <div className="absolute inset-0" style={{ background: C.bg }}>
      {/* inspector */}
      <div className="absolute left-[40px] top-[100px] h-[640px] w-[320px] rounded-[22px] px-[28px] py-[30px]" style={{ background: C.panel, border: `1.5px solid ${C.line}`, boxShadow: "0 18px 36px rgba(15,17,23,0.08)" }}>
        <p className="mb-[26px] text-[30px] font-bold leading-none" style={{ color: C.text }}>النص</p>
        <div className="flex flex-col gap-[26px]">
          <Field label="الخط"><span className="text-[24px] font-semibold" style={{ color: C.text }}>ثمانية Sans</span></Field>
          <Field label="الوزن"><span className="text-[24px] font-semibold" style={{ color: C.text }}>أسود</span></Field>
          <div className="rounded-[16px] p-[18px]" style={{ background: C.panel2, border: `1.5px solid ${C.line}` }}>
            <div className="flex items-center justify-between">
              <span className="text-[24px]" style={{ color: C.dim }}>الحجم</span>
              <span dir="ltr" className="text-[24px] tabular-nums line-through decoration-[2px]" style={{ color: C.mind }}><span ref={numRaw}>120.0</span></span>
            </div>
            <div dir="ltr" className="mt-[8px] flex items-baseline justify-between">
              <span className="text-[24px]" style={{ color: C.dim }}>px</span>
              <span ref={numSnap} className="text-[74px] font-bold leading-none tabular-nums" style={{ color: C.agent }}>120</span>
            </div>
          </div>
          <Field label="المحاذاة">
            <div className="flex gap-[8px]">
              {[true, false, false].map((on, i) => (
                <span key={i} className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px]" style={{ background: on ? C.agent : C.panel2, border: `1.5px solid ${on ? C.agent : C.line}` }}>
                  <span className="block h-[16px] w-[18px]" style={{ borderTop: `3px solid ${on ? "#fff" : C.dim}`, borderBottom: `3px solid ${on ? "#fff" : C.dim}`, boxSizing: "content-box", height: 8 }} />
                </span>
              ))}
            </div>
          </Field>
          <Field label="اللون">
            <div className="flex gap-[10px]">
              <span className="h-[34px] w-[34px] rounded-full" style={{ background: "#0f1117", outline: `3px solid ${C.agent}`, outlineOffset: 3 }} />
              <span className="h-[34px] w-[34px] rounded-full" style={{ background: C.mind }} />
              <span className="h-[34px] w-[34px] rounded-full" style={{ background: C.agent }} />
            </div>
          </Field>
        </div>
      </div>

      {/* the slide */}
      <div className="absolute overflow-hidden rounded-[16px]" style={{ left: S.x, top: S.y, width: S.w, height: S.h, background: "#0e0f14", boxShadow: "0 40px 80px rgba(15,17,23,0.28)" }}>
        <div
          ref={titleRef}
          className="absolute text-[120px] font-black leading-[1.05]"
          style={{ right: S.w - (TITLE_RIGHT - S.x), top: TITLE_TOP - S.y, color: "#f4f5f8", transformOrigin: "right center", whiteSpace: "nowrap" }}
        >
          <h1 className="m-0 text-[inherit] font-[inherit] leading-[inherit]">
            <span className="block">الذكاء الاصطناعي</span>
            <span className="block">في المجالات الإبداعية</span>
          </h1>
        </div>
        <p className="absolute text-[48px] font-medium leading-none" style={{ right: S.w - (TITLE_RIGHT - S.x), top: 500 }}>
          <span style={{ color: "#ff4fa0" }}>عقل يبدع</span>
          <span style={{ color: "#8f95a9" }}>، </span>
          <span style={{ color: "#7787ff" }}>ووكيل ينفّذ</span>
        </p>
        <span className="absolute bottom-[34px] left-[40px] text-[26px] leading-none" style={{ color: "#8f95a9" }}>تقديم: عبدالملك الهندي</span>
      </div>

      <svg className="pointer-events-none absolute inset-0" width="1920" height="1080" aria-hidden style={{ overflow: "visible" }}>
        <rect ref={rawBox} fill="none" stroke={C.mind} strokeWidth="3" strokeDasharray="10 8" style={{ opacity: 0 }} />
        <g ref={snapBox} style={{ opacity: 0 }}>
          <rect ref={snapRect} fill="none" stroke={C.agent} strokeWidth="3.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} ref={(el) => { handles.current[i] = el; }} width="18" height="18" rx="4" fill="#fff" stroke={C.agent} strokeWidth="3.5" />
          ))}
        </g>
      </svg>

      {/* filmstrip: the dark column that carries the lockup */}
      <div className="absolute inset-y-0 right-0 w-[256px]" style={{ background: C.bar }}>
        <RakayaLogo height={44} className="absolute left-1/2 top-[42px] -translate-x-1/2" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute left-[28px] h-[114px] w-[200px] overflow-hidden rounded-[10px]" style={{ top: 150 + i * 146, background: i === 0 ? "#0e0f14" : "#1b1d27", outline: i === 0 ? `3px solid ${C.agent}` : "none", outlineOffset: 3 }}>
            {i === 0 ? (
              <div className="absolute right-[16px] top-[26px] flex flex-col gap-[6px]">
                <span className="h-[12px] w-[130px] rounded-[3px]" style={{ background: "#f4f5f8" }} />
                <span className="h-[12px] w-[100px] rounded-[3px]" style={{ background: "#f4f5f8" }} />
                <span className="mt-[8px] h-[6px] w-[70px] rounded-[3px]" style={{ background: C.mind }} />
              </div>
            ) : (
              <div className="absolute right-[16px] top-[26px] flex flex-col gap-[6px] opacity-40">
                <span className="h-[8px] w-[110px] rounded-[3px]" style={{ background: "#6f7690" }} />
                <span className="h-[8px] w-[80px] rounded-[3px]" style={{ background: "#6f7690" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Deck({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
