"use client";

import { T, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";

const CANVAS = { x: 370, y: 150, w: 1440, h: 790 };
// where the agent works for each stage (stage coordinates), and the thing it makes there
const MOVES = [
  { x: 1650, y: 860 },
  { x: 1470, y: 345 },
  { x: 1190, y: 520 },
  { x: 1290, y: 760 },
];

function Layer({ name, on, active }: { name: string; on: boolean; active: boolean }) {
  return (
    <li dir="ltr" className="flex items-center gap-[12px] rounded-[8px] px-[14px] py-[9px] text-[22px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(-10px)", transition: "all .4s", background: active ? "rgba(255,122,0,.16)" : "transparent", color: active ? T.mist : T.sage }}>
      <span className="h-[14px] w-[14px] rounded-[3px]" style={{ border: `2px solid ${T.dim}` }} />
      {name}
    </li>
  );
}

/** A design-tool window with a second pointer in it: the agent's. Each stage it moves, drags, and a real component appears and takes its place in the layers. */
export function FigmaAgent({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3000);
  const p = MOVES[s];
  const sel = (n: number) => s === n; // the thing just made is selected
  const handle = (style: React.CSSProperties) => <span className="absolute h-[12px] w-[12px] bg-white" style={{ border: `2px solid ${T.orange}`, ...style }} />;
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-[90px] top-[70px] h-[940px] w-[1740px] overflow-hidden rounded-[22px]" style={{ background: "#0a1014", border: `1.5px solid ${T.line}` }}>
        <div className="flex h-[64px] items-center justify-between px-[28px]" style={{ background: T.panel, borderBottom: `1px solid ${T.line}` }}>
          <div className="flex gap-[10px]">{[0, 1, 2].map((i) => <span key={i} className="h-[14px] w-[14px] rounded-full" style={{ background: "#26353a" }} />)}</div>
          <span className="text-[24px] font-bold" style={{ color: T.sage }}>ركايا · غلاف</span>
          <span className="rounded-full px-[18px] py-[5px] text-[20px] font-bold" style={{ background: T.orange, color: "#1a0c00" }}>وكيل</span>
        </div>
      </div>

      {/* layers */}
      <aside className="absolute left-[100px] top-[150px] w-[240px]" aria-label="الطبقات">
        <p className="mb-[12px] text-[22px] font-bold" style={{ color: T.dim }}>الطبقات</p>
        <ul className="m-0 list-none p-0">
          <Layer name="Button" on={s >= 1} active={sel(1)} />
          <Layer name="Card" on={s >= 2} active={sel(2)} />
          <Layer name="Input" on={s >= 3} active={sel(3)} />
        </ul>
      </aside>

      {/* canvas */}
      <div className="absolute overflow-hidden rounded-[12px]" style={{ left: CANVAS.x, top: CANVAS.y, width: CANVAS.w, height: CANVAS.h, background: "#0f171c", backgroundImage: "radial-gradient(rgba(179,196,198,.14) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }}>
        {/* Card */}
        <div className="absolute" style={{ left: 520, top: 250, width: 420, height: 250, opacity: s >= 2 ? 1 : 0, transform: s >= 2 ? "none" : "scale(.6)", transformOrigin: "top left", transition: "all .6s cubic-bezier(.2,.8,.2,1)" }}>
          <div className="relative h-full rounded-[20px] p-[26px]" style={{ background: T.mist, color: T.ink, outline: sel(2) ? `2px solid ${T.orange}` : "none", outlineOffset: 4 }}>
            <p className="m-0 text-[32px] font-black leading-[1.2]">الذكاء الاصطناعي</p>
            <p className="mt-[8px] text-[22px] opacity-70">في المجالات الإبداعية</p>
            <span className="absolute bottom-[26px] left-[26px] h-[10px] w-[120px] rounded-full" style={{ background: T.orange }} />
            {sel(2) && <>{handle({ left: -7, top: -7 })}{handle({ right: -7, top: -7 })}{handle({ left: -7, bottom: -7 })}{handle({ right: -7, bottom: -7 })}</>}
          </div>
        </div>
        {/* Button */}
        <div className="absolute" style={{ left: 1000, top: 150, opacity: s >= 1 ? 1 : 0, transform: s >= 1 ? "none" : "scale(.5)", transformOrigin: "top left", transition: "all .55s cubic-bezier(.2,.8,.2,1)" }}>
          <div className="relative flex h-[84px] w-[230px] items-center justify-center rounded-[42px] text-[34px] font-black" style={{ background: T.orange, color: "#1a0c00", outline: sel(1) ? `2px solid ${T.mist}` : "none", outlineOffset: 5 }}>
            ابدأ
            {sel(1) && <>{handle({ left: -7, top: -7 })}{handle({ right: -7, bottom: -7 })}</>}
          </div>
        </div>
        {/* Input */}
        <div className="absolute" style={{ left: 520, top: 560, opacity: s >= 3 ? 1 : 0, transform: s >= 3 ? "none" : "scale(.6)", transformOrigin: "top left", transition: "all .55s cubic-bezier(.2,.8,.2,1)" }}>
          <div className="relative flex h-[84px] w-[460px] items-center rounded-[14px] px-[22px] text-[28px]" style={{ background: "transparent", border: `2px solid ${T.sage}`, color: T.dim, outline: sel(3) ? `2px solid ${T.orange}` : "none", outlineOffset: 5 }}>
            اكتب هنا
            {sel(3) && <>{handle({ left: -7, top: -7 })}{handle({ right: -7, bottom: -7 })}</>}
          </div>
        </div>
      </div>

      {/* the agent's pointer */}
      <div className="pointer-events-none absolute left-0 top-0" style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: "transform 1s cubic-bezier(.5,0,.15,1)" }}>
        <svg width="34" height="40" viewBox="0 0 34 40" className="absolute left-0 top-0 drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
          <path d="M3 2 L3 30 L10 23.5 L15.5 36 L21 33.6 L15.6 21.4 L25 20.6 Z" fill={T.orange} stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-[26px] top-[34px] whitespace-nowrap rounded-full px-[18px] py-[8px] text-[26px] font-bold leading-none" style={{ background: T.orange, color: "#1a0c00" }}>وكيل</span>
      </div>
    </div>
  );
}
