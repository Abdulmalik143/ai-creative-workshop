"use client";

import { T, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";
import { Wamda } from "../wamda/Wamda";

const BRAND = ["logo.svg", "fonts/", "brand-guidelines.md"];
const VIDEO = ["pacing.md", "aspect-ratios.md", "export_reel.py"];

function FolderShape({ w, h, color, label, big }: { w: number; h: number; color: string; label: string; big?: boolean }) {
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <div className="absolute left-0 top-0 h-[46px] w-[44%] rounded-t-[16px]" style={{ background: color }} />
      <div className="absolute inset-x-0 bottom-0 top-[30px] rounded-[20px] rounded-tl-none" style={{ background: color }} />
      <span className="absolute inset-x-0 bottom-[22px] text-center font-black" style={{ fontSize: big ? 50 : 38, color: "#07110f" }} dir="ltr">{label}</span>
    </div>
  );
}

const Chip = ({ t, c, style }: { t: string; c: string; style?: React.CSSProperties }) => (
  <span dir="ltr" className="absolute whitespace-nowrap rounded-[10px] px-[16px] py-[8px] text-[24px] font-medium" style={{ background: T.panel2, border: `1px solid ${c}`, color: T.mist, fontFamily: "ui-monospace, monospace", transition: "all .9s cubic-bezier(.2,.8,.2,1)", ...style }}>
    {t}
  </span>
);

/** Two skills from two domains become one: their files move into Reels Creator, and the agent stands ready. */
export function SkillMerger({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3600);
  const merged = s >= 2;
  const A = { x: 1260, y: 250 }; // brand (right)
  const B = { x: 260, y: 250 }; // video (left)
  const M = { x: 560, y: 430 }; // merged
  const together = s >= 1;
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      {/* source skills */}
      {[
        { id: "Brand", pos: A, c: T.sage, items: BRAND },
        { id: "Video", pos: B, c: T.orangeSoft, items: VIDEO },
      ].map(({ id, pos, c, items }, k) => {
        const tx = merged ? M.x - pos.x + 70 : together ? (M.x - pos.x) * 0.22 : 0;
        const ty = merged ? M.y - pos.y + 50 : together ? 120 : 0;
        return (
          <div key={id} className="absolute" style={{ left: pos.x, top: pos.y, transform: `translate(${tx}px, ${ty}px) scale(${merged ? 0.5 : 1})`, opacity: merged ? 0 : 1, transition: "all 1s cubic-bezier(.2,.8,.2,1)" }}>
            <FolderShape w={400} h={280} color={c} label={id} />
            {items.map((t, i) => (
              <Chip key={t} t={t} c={c} style={{ left: 410, top: 20 + i * 62, [k === 0 ? "left" : "right"]: k === 0 ? 410 : 410 }} />
            ))}
          </div>
        );
      })}

      {/* the merged skill */}
      <div className="absolute" style={{ left: M.x, top: M.y, opacity: merged ? 1 : 0, transform: merged ? "scale(1)" : "scale(.7)", transition: "all .9s .2s cubic-bezier(.2,.8,.2,1)" }}>
        <FolderShape w={520} h={360} color={T.orange} label="Reels Creator" big />
        {[...BRAND, ...VIDEO].map((t, i) => (
          <Chip key={t} t={t} c={T.orangeSoft} style={{ left: 18 + (i % 2) * 262, top: 70 + Math.floor(i / 2) * 64, fontSize: 19, opacity: merged ? 1 : 0 }} />
        ))}
      </div>

      {/* the agent is ready */}
      <div className="absolute right-[150px] top-[440px] flex flex-col items-center gap-[24px]" style={{ opacity: s >= 3 ? 1 : 0, transition: "opacity .6s" }}>
        <Wamda key={s >= 3 ? "on" : "off"} clip="wave" mode="reveal" scale={6.2} revealDelay={200} />
        <span className="rounded-full px-[30px] py-[12px] text-[32px] font-bold" style={{ background: T.orange, color: "#1a0c00" }}>الوكيل جاهز</span>
      </div>

      <p className="absolute bottom-[64px] left-[110px] text-[40px] font-black" style={{ color: T.mist }}>{["Skill للهوية وSkill للفيديو", "تلتقيان", "تُدمجان في Skill واحدة", "Reels Creator جاهز للعمل"][s]}</p>
    </div>
  );
}
