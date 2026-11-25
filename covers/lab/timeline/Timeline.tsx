"use client";

import { useMemo, useRef } from "react";
import { Stage, useStage, STAGE_W } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { DARK as C } from "../../kit/theme";
import { clamp, easeOutBack, ease, lerp, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * DARK. A video editor, right-to-left: time starts at the right edge and runs left.
 * The words of the title are clips. "عقل" lays them down loose; "وكيل" ripples them tight.
 * Scrub with your pointer: the playhead snaps to every cut and the monitor lights the word under it.
 */

const TL_R = 1722;
const TL_L = 112;
const GAP = 4;
const WORDS = [
  { t: "الذكاء", w: 290, line: 0 },
  { t: "الاصطناعي", w: 410, line: 0 },
  { t: "في", w: 140, line: 1 },
  { t: "المجالات", w: 330, line: 1 },
  { t: "الإبداعية", w: 370, line: 1 },
];
const ROUGH = [0, -52, 64, -40, 34]; // where the mind dropped each clip, relative to its true place
const HOLD = 760; // playhead rest position (distance from the right edge)

function Scene() {
  const { pointer, active } = useStage();
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const roughRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fixedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const headRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const follow = useRef(newFollow());
  const ph = useRef(TL_R - HOLD);

  // true (tight) layout: first word at the right edge
  const tight = useMemo(() => {
    let r = TL_R;
    return WORDS.map((w) => {
      const x = r - w.w; // left edge
      r = x - GAP;
      return { right: x + w.w, left: x };
    });
  }, []);
  const cuts = useMemo(() => [TL_R, ...tight.map((c) => c.left - GAP / 2)], [tight]);

  const wave = useMemo(() => {
    let d = "";
    for (let x = 0; x < 1540; x += 7) {
      const a = 8 + 34 * Math.abs(Math.sin(x * 0.021) * Math.cos(x * 0.0071 + 1)) + 10 * Math.abs(Math.sin(x * 0.11));
      d += `M${x} ${(50 - a).toFixed(1)}V${(50 + a).toFixed(1)}`;
    }
    return d;
  }, []);

  useStageLoop(
    (t) => {
      const p = pointer.current;
      // ---- clips: the agent ripples each one into place
      let snapFlash = 0;
      WORDS.forEach((w, i) => {
        const at = 1.25 + i * 0.42;
        const k = seg(t, at, at + 0.55);
        const x = tight[i].left + ROUGH[i] * (1 - easeOutBack(k));
        const el = clipRefs.current[i];
        if (el) el.style.transform = `translateX(${x - tight[i].left}px)`;
        roughRefs.current[i]!.style.opacity = String(1 - ease(k));
        fixedRefs.current[i]!.style.opacity = String(ease(k));
        if (k > 0 && k < 0.5) snapFlash = Math.max(snapFlash, 1 - k * 2);
        const flash = k > 0.45 ? Math.max(0, 1 - (k - 0.45) * 3) : 0;
        el!.style.boxShadow = flash > 0 ? `0 0 0 2px rgba(255,255,255,${flash * 0.9})` : "none";
      });

      // ---- playhead: plays across during the intro, then follows (and snaps to) the pointer
      const live = active && t > 5 && p.inside;
      let target: number;
      if (live) target = clamp(p.x, TL_L, TL_R);
      else if (t < 2.4) target = TL_R;
      else if (t < 5) target = lerp(TL_R, TL_R - HOLD, ease(seg(t, 2.4, 5)));
      else target = TL_R - HOLD;
      ph.current += (target - ph.current) * (live ? 0.4 : 1);
      let x = ph.current;
      let snapAt: number | null = null;
      for (const c of cuts) if (Math.abs(x - c) < 22) snapAt = c;
      if (snapAt !== null && live) x = snapAt;
      headRef.current!.style.transform = `translateX(${x}px)`;
      headRef.current!.style.opacity = String(seg(t, 2.2, 2.6));
      const sn = snapRef.current!;
      sn.style.opacity = snapAt !== null && live ? "1" : "0";
      sn.style.transform = `translateX(${snapAt ?? 0}px)`;

      // ---- monitor: the word under the playhead lights up; the timecode follows
      const under = tight.findIndex((c) => x <= c.right + 1 && x >= c.left - 1);
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const on = i === under && t > 2.6;
        el.style.color = on ? C.mind : C.text;
        el.style.textShadow = on ? `0 0 40px ${C.mind}66` : "none";
      });
      const secs = Math.max(0, (TL_R - x) / 60);
      const s = Math.floor(secs);
      const f = Math.floor((secs - s) * 24);
      if (tcRef.current) tcRef.current.textContent = `00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;

      // ---- cursors
      const nearest = cuts.reduce((a, c) => (Math.abs(c - x) < Math.abs(a - x) ? c : a), cuts[0]);
      const idx = clamp((t - 1.15) / 0.42, 0, 4);
      const lo = Math.floor(idx);
      const ax = lerp(tight[lo].left, tight[Math.min(4, lo + 1)].left, idx - lo) + 20;
      const intro = t < 3.7;
      const scripted: { mind: V; agent: V } = {
        mind: {
          x: t < 2.6 ? lerp(1700, TL_R, ease(seg(t, 0.8, 2.4))) : ph.current,
          y: t < 2.6 ? lerp(140, 736, ease(seg(t, 0.8, 2.4))) : 736,
        },
        agent: {
          x: intro ? (t < 1.15 ? lerp(90, tight[0].left + 20, ease(seg(t, 0.2, 1.15))) : ax) : lerp(ax, nearest + 18, ease(seg(t, 3.7, 4.6))),
          y: t < 1.15 ? lerp(1000, 866, ease(seg(t, 0.2, 1.15))) : 866,
        },
      };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 5,
        active,
        pointer: p,
        scripted,
        agentTarget: { x: nearest + 18, y: 870 },
        agentK: 0.16,
      });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.7));
      place(agentRef.current, cur.agent, seg(t, 0.3, 0.7));
    },
    { poster: 5.2 },
  );

  const ruler = useMemo(() => Array.from({ length: 28 }, (_, i) => i), []);

  return (
    <div className="absolute inset-0" style={{ background: C.bg }}>
      <div
        className="absolute inset-x-0 top-0 flex h-[84px] items-center justify-between px-[56px]"
        style={{ background: C.bar, borderBottom: `1px solid ${C.line}` }}
      >
        <RakayaLogo height={42} />
        <span className="text-[28px] leading-none" style={{ color: C.barText }}>
          تقديم: عبدالملك الهندي
        </span>
      </div>

      {/* program monitor */}
      <div
        className="absolute left-[300px] top-[112px] h-[500px] w-[1320px] overflow-hidden rounded-[18px]"
        style={{ background: "#050608", border: `2px solid ${C.line}` }}
      >
        <div className="absolute inset-[40px] rounded-[8px]" style={{ border: "1px dashed rgba(255,255,255,0.09)" }} />
        <span ref={tcRef} dir="ltr" className="absolute left-[28px] top-[22px] text-[26px] tabular-nums" style={{ color: C.dim }}>
          00:00:00
        </span>
        <h1 className="absolute inset-0 flex flex-col items-center justify-center text-[124px] font-black leading-[1.04]">
          {[0, 1].map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {WORDS.map((w, i) =>
                w.line === line ? (
                  <span
                    key={i}
                    ref={(el) => {
                      wordRefs.current[i] = el;
                    }}
                    className="inline-block px-[0.12em] transition-colors duration-150"
                    style={{ color: C.text }}
                  >
                    {w.t}
                  </span>
                ) : null,
              )}
            </span>
          ))}
        </h1>
      </div>
      <p className="absolute right-[300px] top-[638px] text-[46px] font-medium leading-none">
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </p>

      {/* timeline */}
      <div className="absolute left-[56px] top-[712px] h-[330px] w-[1808px] rounded-[16px]" style={{ background: "#10121a", border: `1px solid ${C.line}` }} />
      <div className="absolute right-[56px] top-[712px] flex h-[330px] w-[120px] flex-col justify-end gap-[0px] pb-[10px] pr-[28px]" dir="ltr" style={{ color: C.dim }}>
        <span className="absolute right-[34px] top-[110px] text-[22px] font-semibold">V2</span>
        <span className="absolute right-[34px] top-[196px] text-[22px] font-semibold">V1</span>
        <span className="absolute right-[34px] top-[276px] text-[22px] font-semibold">A1</span>
      </div>
      {/* ruler */}
      <div dir="ltr" className="absolute left-0 top-[722px] h-[30px] w-full" style={{ color: C.dim }}>
        {ruler.map((i) => (
          <div key={i} className="absolute top-0" style={{ left: TL_R - i * 60 }}>
            <div style={{ width: 1, height: i % 5 === 0 ? 16 : 8, background: C.line }} />
            {i % 5 === 0 && <span className="absolute left-[6px] top-[-4px] text-[18px] tabular-nums">{i / 5 * 5 / 1}</span>}
          </div>
        ))}
      </div>
      {/* track lanes */}
      {[762, 832, 922].map((y, i) => (
        <div key={y} className="absolute" style={{ left: 84, width: TL_R + 20 - 84, top: y, height: i === 2 ? 100 : 62, borderTop: `1px solid ${C.line}` }} />
      ))}

      {/* V2: the subtitle as a text layer */}
      <div
        className="absolute flex items-center justify-start overflow-hidden whitespace-nowrap rounded-[8px] px-[14px] text-[26px] font-semibold"
        style={{ right: STAGE_W - TL_R + 0, top: 770, height: 46, width: 700, background: `${C.agent}2e`, border: `1.5px solid ${C.agent}88`, color: "#cdd3ff", marginRight: 0 }}
      >
        عقل يبدع، ووكيل ينفّذ
      </div>

      {/* V1: the words */}
      {WORDS.map((w, i) => (
        <div
          key={i}
          ref={(el) => {
            clipRefs.current[i] = el;
          }}
          className="absolute overflow-hidden rounded-[10px]"
          style={{ left: tight[i].left, top: 836, width: w.w, height: 76 }}
        >
          <div
            ref={(el) => {
              roughRefs.current[i] = el;
            }}
            className="absolute inset-0 rounded-[10px]"
            style={{ background: `${C.mind}30`, border: `2px solid ${C.mind}` }}
          />
          <div
            ref={(el) => {
              fixedRefs.current[i] = el;
            }}
            className="absolute inset-0 rounded-[10px]"
            style={{ background: C.agent, opacity: 0 }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[34px] font-bold text-white">{w.t}</span>
        </div>
      ))}

      {/* A1: waveform */}
      <svg className="absolute overflow-hidden rounded-[10px]" style={{ left: TL_R - 1540, top: 926, width: 1540, height: 92 }} viewBox="0 0 1540 100" preserveAspectRatio="none" aria-hidden>
        <rect width="1540" height="100" fill={`${C.agent}22`} />
        <path d={wave} stroke={C.agent} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      </svg>

      {/* snap guide + playhead */}
      <div ref={snapRef} className="absolute top-[752px] h-[272px] w-[2px]" style={{ background: C.agent, opacity: 0, boxShadow: `0 0 14px ${C.agent}` }} />
      <div ref={headRef} className="absolute left-0 top-[716px] h-[312px] w-[2px]" style={{ background: C.mind, opacity: 0, boxShadow: `0 0 16px ${C.mind}88` }}>
        <div className="absolute -left-[10px] -top-[4px] h-[18px] w-[22px] rounded-[4px]" style={{ background: C.mind }} />
      </div>

      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </div>
  );
}

export default function Timeline({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <Scene />
    </Stage>
  );
}
