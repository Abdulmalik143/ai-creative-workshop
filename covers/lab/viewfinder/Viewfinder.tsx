"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Stage, useStage, STAGE_W } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { DARK as C } from "../../kit/theme";
import { clamp, ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";
import { measure, center, nearest, type Box } from "../../kit/measure";

/**
 * DARK. A camera viewfinder in the middle of a shot.
 * "عقل" points; "وكيل" is the autofocus: it locks onto the nearest word and everything else falls out of focus.
 */

const L1 = ["الذكاء", "الاصطناعي"];
const L2 = ["في", "المجالات", "الإبداعية"];
const SUB = ["عقل يبدع", "ووكيل ينفّذ"];

function Scene() {
  const { scale, pointer, active } = useStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const follow = useRef(newFollow());
  const focus = useRef<V>({ x: 960, y: 540 });
  const lock = useRef({ idx: -1, since: 0 });
  const rb = useRef({ x: 960, y: 540, w: 200, h: 120 });

  useLayoutEffect(() => {
    const run = () => {
      if (rootRef.current && scale) setBoxes(measure(rootRef.current, els.current, scale));
    };
    run();
    document.fonts.ready.then(run);
  }, [scale]);

  useStageLoop(
    (t) => {
      if (boxes.length < 7) return;
      const p = pointer.current;
      // scripted autofocus: hunts, locks the second word, then the last
      const target =
        t < 1.1 ? 0 : t < 2.9 ? 1 : 4;
      const hunting = t < 1.6 ? 1 - seg(t, 1.1, 1.6) : 0;
      const live = active && t > 4.5 && p.inside;
      const idx = live ? nearest(boxes, p) : target;
      const tc = center(boxes[idx]);
      const f = focus.current;
      const k = live ? 0.12 : 0.07;
      f.x += (tc.x - f.x) * k;
      f.y += (tc.y - f.y) * k;
      if (lock.current.idx !== idx) lock.current = { idx, since: t };

      // out-of-focus is a function of distance from the focus plane
      boxes.forEach((b, i) => {
        const c = center(b);
        const d = Math.hypot(c.x - f.x, c.y - f.y);
        const base = t < 0.9 ? 16 : 0;
        const blur = clamp(d / 110 - 0.45, 0, 8) + base * 0;
        const e = els.current[i]!;
        e.style.filter = `blur(${(blur + (t < 1.0 ? (1 - seg(t, 0.2, 1.0)) * 14 : 0)).toFixed(2)}px)`;
        e.style.opacity = String(clamp(1 - blur * 0.04, 0.62, 1));
      });

      // the AF frame eases onto its target; it breathes while hunting
      const b = boxes[idx];
      const r = rb.current;
      const pad = 22;
      r.x += (b.x - pad + (b.w + pad * 2) / 2 - r.x) * 0.2;
      r.y += (b.y - pad + (b.h + pad * 2) / 2 - r.y) * 0.2;
      r.w += (b.w + pad * 2 + hunting * 120 - r.w) * 0.2;
      r.h += (b.h + pad * 2 + hunting * 80 - r.h) * 0.2;
      const locked = t - lock.current.since > 0.45;
      const bx = boxRef.current!;
      bx.style.transform = `translate(${r.x - r.w / 2}px, ${r.y - r.h / 2}px)`;
      bx.style.width = `${r.w}px`;
      bx.style.height = `${r.h}px`;
      bx.style.opacity = String(seg(t, 0.8, 1.1));
      bx.style.setProperty("--af", locked ? "#ffffff" : C.agent);
      bx.style.setProperty("--afw", locked ? "5px" : "3px");
      if (chipRef.current) chipRef.current.style.opacity = locked ? "1" : "0";

      // cursors
      const scripted: { mind: V; agent: V } = {
        mind: { x: lerp(1500, tc.x + 40, ease(seg(t, 0.4, 2.0))), y: lerp(160, tc.y - 30, ease(seg(t, 0.4, 2.0))) },
        agent: { x: r.x + r.w / 2 - 12, y: r.y + r.h / 2 - 8 },
      };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 4.5,
        active,
        pointer: p,
        scripted,
        agentTarget: { x: r.x + r.w / 2 - 12, y: r.y + r.h / 2 - 8 },
        agentK: 0.2,
      });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 0.9, 1.2));
    },
    { poster: 3.8, extraDeps: [boxes] },
  );

  const w = (s: string, i: number) => (
    <span
      key={s}
      ref={(el) => {
        els.current[i] = el;
      }}
      className="inline-block px-[0.1em] will-change-[filter]"
    >
      {s}
    </span>
  );

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 62% 46%, #1b1f30 0%, #0d0e13 62%, #07080b 100%)" }} />
      {/* rule of thirds */}
      {[640, 1280].map((x) => (
        <div key={x} className="absolute top-0 h-full w-px" style={{ left: x, background: "rgba(255,255,255,0.07)" }} />
      ))}
      {[360, 720].map((y) => (
        <div key={y} className="absolute left-0 h-px w-full" style={{ top: y, background: "rgba(255,255,255,0.07)" }} />
      ))}
      {/* frame corners */}
      {[
        "left-[48px] top-[48px] border-l-[3px] border-t-[3px]",
        "right-[48px] top-[48px] border-r-[3px] border-t-[3px]",
        "bottom-[48px] left-[48px] border-b-[3px] border-l-[3px]",
        "bottom-[48px] right-[48px] border-b-[3px] border-r-[3px]",
      ].map((c) => (
        <div key={c} className={`absolute h-[64px] w-[64px] border-white/55 ${c}`} />
      ))}

      <h1 className="absolute right-[170px] top-[190px] text-[178px] font-black leading-[1.04]" style={{ color: C.text }}>
        <span className="block whitespace-nowrap">{L1.map((s, i) => w(s, i))}</span>
        <span className="block whitespace-nowrap">{L2.map((s, i) => w(s, i + 2))}</span>
      </h1>
      <p className="absolute right-[170px] top-[690px] whitespace-nowrap text-[70px] font-bold leading-none">
        <span style={{ color: C.mind }}>{w(SUB[0], 5)}</span>
        <span style={{ color: C.dim }}>،</span> <span style={{ color: C.agent }}>{w(SUB[1], 6)}</span>
      </p>

      {/* HUD */}
      <div className="absolute left-[104px] top-[96px] flex items-center gap-[14px] text-[26px] leading-none" style={{ color: C.text }} dir="ltr">
        <span className="h-[16px] w-[16px] rounded-full" style={{ background: C.mind, boxShadow: `0 0 14px ${C.mind}` }} />
        <span className="tabular-nums">REC 00:00:14:07</span>
      </div>
      <RakayaLogo height={44} className="absolute right-[104px] top-[92px]" />
      <span className="absolute bottom-[96px] left-[104px] text-[28px] leading-none" style={{ color: C.dim }}>
        تقديم: عبدالملك الهندي
      </span>
      <span dir="ltr" className="absolute bottom-[96px] right-[104px] text-[24px] tabular-nums leading-none" style={{ color: C.dim }}>
        ISO 400 · f/2.8 · 1/60
      </span>

      {/* the AF frame */}
      <div
        ref={boxRef}
        className="absolute left-0 top-0 opacity-0"
        style={{ ["--af" as string]: C.agent, ["--afw" as string]: "3px" }}
      >
        {[
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((c) => (
          <div key={c} className={`absolute h-[34px] w-[34px] ${c}`} style={{ borderColor: "var(--af)", borderWidth: "var(--afw)", borderStyle: "solid", borderTopWidth: c.includes("-t") ? "var(--afw)" : 0, borderBottomWidth: c.includes("-b") ? "var(--afw)" : 0, borderLeftWidth: c.includes("-l") ? "var(--afw)" : 0, borderRightWidth: c.includes("-r") ? "var(--afw)" : 0 }} />
        ))}
        <span ref={chipRef} className="absolute -top-[40px] left-0 rounded-[6px] px-[10px] py-[4px] text-[20px] font-bold leading-none text-black transition-opacity duration-150" style={{ background: "#fff", opacity: 0 }} dir="ltr">
          AF-L
        </span>
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Viewfinder({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#0b0c11">
      <Scene />
    </Stage>
  );
}
