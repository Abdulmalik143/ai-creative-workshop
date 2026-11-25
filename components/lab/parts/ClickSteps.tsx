"use client";

import { T, type LabProps } from "../tokens";
import { useClickSteps } from "../kit/useClickSteps";

const ITEMS = ["المرحلة الأولى", "المرحلة الثانية", "المرحلة الثالثة", "المرحلة الرابعة", "المرحلة الخامسة"];

/**
 * The stage controller for the deck. `useClickSteps` (components/lab/kit) is the reusable part:
 * give it the number of stages and spread `bind` on any element. This is a demonstration of it.
 * When the lab drives `step`, that wins; on its own, a click advances, shift-click or right-click goes back, R restarts.
 */
export function ClickSteps({ step, replay = 0 }: LabProps) {
  const own = useClickSteps(ITEMS.length, { global: step === undefined });
  const s = step !== undefined ? step : own.step;
  void replay;
  return (
    <div className="absolute inset-0" style={{ background: T.ink }} {...(step === undefined ? own.bind : {})}>
      <ol className="absolute right-[140px] top-[150px] flex w-[1100px] flex-col gap-[26px]">
        {ITEMS.map((t, i) => (
          <li key={t} className="flex items-center gap-[30px] rounded-[18px] px-[34px] py-[22px]" style={{ background: i === s ? T.panel2 : "transparent", border: `1.5px solid ${i === s ? T.orange : T.line}`, opacity: i > s ? 0 : i === s ? 1 : 0.45, transform: i > s ? "translateY(22px)" : "none", transition: "all .55s cubic-bezier(.2,.8,.2,1)" }}>
            <span className="flex h-[64px] w-[64px] flex-none items-center justify-center rounded-full text-[34px] font-black" style={{ background: i === s ? T.orange : T.panel2, color: i === s ? "#1a0c00" : T.dim }}>{i + 1}</span>
            <span className="text-[44px] font-black" style={{ color: T.mist }}>{t}</span>
          </li>
        ))}
      </ol>
      <div className="absolute bottom-[120px] left-[150px] flex flex-col gap-[22px]">
        <div className="flex gap-[12px]" aria-label="التقدّم">
          {ITEMS.map((_, i) => (
            <span key={i} className="h-[14px] rounded-full transition-all duration-500" style={{ width: i === s ? 56 : 14, background: i <= s ? T.orange : T.line }} />
          ))}
        </div>
        <p className="text-[28px]" style={{ color: T.dim }}>
          نقرة: التالي · Shift+نقرة أو ← : رجوع · R : إعادة
        </p>
      </div>
    </div>
  );
}
