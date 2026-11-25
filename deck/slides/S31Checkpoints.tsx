"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { CHECKS, TRACK } from "../content/copy";
import { D, EASE } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Icon, SlideTitle } from "../kit/ui";
import { TrackBody } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "points", label: "نقاط التأكيد الست على خط واحد" },
  { key: "summary", label: "الخلاصة والنتيجة" },
];

const LINE = { x: 150, w: 1620, y: 420, node: 76 };
const CELL = LINE.w / CHECKS.points.length;

/**
 * Where to stop and confirm (owner's summary, 2026-11-25): six checkpoints on one line, first on the right (RTL), each with
 * when and what to ask. The next click brings the takeaway under them.
 */
export default function S31Checkpoints({ step }: SlideProps) {
  const s = stepper(steps, step);
  const n = useBeats(step, s.idx("points"), CHECKS.points.map((_, i) => 200 + i * 380));
  const m = useBeats(step, s.idx("summary"), [100, 500, 900, 1500]);

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={CHECKS.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        {/* the line fills from the right as the points arrive */}
        <div className="absolute h-[4px] rounded-full" style={{ left: LINE.x + CELL / 2, width: LINE.w - CELL, top: LINE.y - 2, background: D.line }} />
        <div
          className="absolute h-[4px] rounded-full"
          style={{ right: 1920 - LINE.x - LINE.w + CELL / 2, top: LINE.y - 2, width: n <= 1 ? 0 : (CELL * (n - 1)), background: D.sky, transition: `width .4s ${EASE}` }}
        />
        <ol dir="rtl" className="absolute m-0 flex list-none p-0" style={{ left: LINE.x, width: LINE.w, top: LINE.y - 150 }}>
          {CHECKS.points.map((p, i) => {
            const on = n >= i + 1;
            return (
              <li key={p.when} className="flex flex-col items-center text-center" style={{ width: CELL, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(16px)", transition: `opacity .4s ease, transform .5s ${EASE}` }}>
                <span className="flex h-[104px] items-end pb-[22px] text-[28px] font-black leading-[1.2]" style={{ color: D.sky }}>
                  {p.when}
                </span>
                <span className="flex items-center justify-center rounded-full" style={{ width: LINE.node, height: LINE.node, background: D.agent, boxShadow: `0 0 30px ${D.agent}55` }}>
                  <Icon icon={Tick02Icon} size={42} color={D.agentInk} stroke={2.6} />
                </span>
                <span className="mt-[22px] px-[10px] text-[30px] font-bold leading-[1.3]" style={{ color: D.paper }}>
                  {p.ask}
                </span>
              </li>
            );
          })}
        </ol>

        <div dir="rtl" className="absolute flex flex-col items-center gap-[18px] text-center" style={{ left: 260, right: 260, top: 650 }}>
          {CHECKS.summary.map((t, i) => (
            <Show key={t} on={m >= i + 1} from="up">
              <span className="text-[38px] font-bold leading-[1.35]" style={{ color: D.mist }}>
                {t}
              </span>
            </Show>
          ))}
          <Show on={m >= 4} from="pop" className="mt-[14px] rounded-[22px] px-[36px] py-[18px]" style={{ background: "rgba(255,122,0,.12)", border: `2px solid ${D.agent}` }}>
            <span className="text-[42px] font-black" style={{ color: D.paper }}>
              {CHECKS.result}
            </span>
          </Show>
        </div>
      </TrackBody>
    </div>
  );
}
