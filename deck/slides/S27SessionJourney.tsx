"use client";

import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { JOURNEY, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { Icon, SlideTitle } from "../kit/ui";
import { FlowRail, TrackBody, type FlowState } from "../kit/Sim";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = JOURNEY.stages.map((st, i) => ({ key: `stage-${i + 1}`, label: `المرحلة ${i + 1}: ${st.label}` }));

const RAIL = { x: 110, y: 236, w: 1700 };
const CARD = { x: 330, y: 420, w: 1260, h: 420 };

/**
 * The session behind slide 26's video, as one rail of six stages (owner's summary, 2026-11-25). One click per stage:
 * the stage lights on the rail and its one idea fills the card under it (a sentence, or a short chain of steps).
 */
export default function S27SessionJourney({ step }: SlideProps) {
  const cur = Math.min(step, steps.length - 1);
  const state = (i: number): FlowState => (i < cur ? "done" : i === cur ? "now" : "todo");

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={JOURNEY.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        <FlowRail items={JOURNEY.stages} state={state} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={80} gap={36} size={25} />

        <div className="absolute rounded-[32px]" style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: D.panel, border: `2px solid ${D.lineStrong}`, boxShadow: "0 30px 90px rgba(0,0,0,.45)" }}>
          {JOURNEY.stages.map((st, i) => {
            const on = i === cur;
            return (
              <div
                key={st.label}
                data-stage={i}
                aria-hidden={on ? undefined : true}
                className="absolute inset-0 flex flex-col items-center justify-center gap-[26px] px-[80px] text-center"
                style={{ opacity: on ? 1 : 0, transform: on ? "none" : i < cur ? "translateX(60px)" : "translateX(-60px)", transition: `opacity .45s ease, transform .6s ${EASE}` }}
              >
                <span className="font-black leading-none" style={{ fontSize: 84, color: D.agent, fontFamily: MONO }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-black leading-[1.1]" style={{ fontSize: 66, color: D.paper }}>
                  {st.label}
                </span>
                {"chain" in st ? (
                  <span className="flex items-center gap-[22px]">
                    {st.chain.map((c, k) => (
                      <span key={c} className="flex items-center gap-[22px]">
                        <span className="whitespace-nowrap rounded-[18px] px-[28px] py-[14px] text-[36px] font-bold" style={{ background: D.panel2, border: `2px solid ${k === st.chain.length - 1 ? D.agent : D.sky}`, color: D.mist }}>
                          {c}
                        </span>
                        {k < st.chain.length - 1 && <Icon icon={ArrowLeft02Icon} size={40} color={D.sky} stroke={2} />}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="font-medium leading-[1.45]" style={{ fontSize: 40, color: D.mist }}>
                    {st.line}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </TrackBody>
    </div>
  );
}
