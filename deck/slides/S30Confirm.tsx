"use client";

import { CONFIRM, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { SlideTitle } from "../kit/ui";
import { AppWindow, TrackBody } from "../kit/Sim";
import type { SlideProps, StepDef } from "../types";
import { asset } from "@/lib/asset";

export const steps: StepDef[] = CONFIRM.reasons.map((r, i) => ({ key: `reason-${i + 1}`, label: r.title }));

const WIN = { x: 110, y: 250, w: 860, h: 700 };
const LIST = { x: 1030, y: 262, w: 780, h: 108, gap: 22 };

type Msg = { who: string; text?: string; ghost?: boolean; old?: boolean };

/**
 * Why we come back and confirm (owner's summary, 2026-11-25). One click per reason: it lights in the list on the right,
 * and the chat on the left shows that moment from the session (the owner's words in «»).
 */
export default function S30Confirm({ step }: SlideProps) {
  const cur = Math.min(step, steps.length - 1);

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={CONFIRM.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        <AppWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title={CONFIRM.chat} logo={asset("/deck/logos/tools/claude.svg")} bar="#1c1a18" body="#121110" border="#34302c">
          {CONFIRM.reasons.map((r, i) => {
            const on = i === cur;
            return (
              <div
                key={r.title}
                dir="rtl"
                aria-hidden={on ? undefined : true}
                className="absolute inset-0 flex flex-col justify-center gap-[22px] px-[40px]"
                style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity .45s ease, transform .55s ${EASE}` }}
              >
                {(r.chat as readonly Msg[]).map((m, k) => (
                  <Bubble key={k} m={m} on={on} delay={200 + k * 450} />
                ))}
              </div>
            );
          })}
        </AppWindow>

        <ol dir="rtl" className="absolute m-0 flex list-none flex-col p-0" style={{ left: LIST.x, top: LIST.y, width: LIST.w, gap: LIST.gap }}>
          {CONFIRM.reasons.map((r, i) => {
            const now = i === cur;
            const seen = i <= cur;
            return (
              <li
                key={r.title}
                className="flex items-center gap-[20px] rounded-[22px] px-[28px]"
                style={{
                  height: LIST.h,
                  background: now ? "rgba(255,122,0,.12)" : D.panel,
                  border: `2px solid ${now ? D.agent : seen ? D.lineStrong : D.line}`,
                  opacity: seen ? 1 : 0,
                  transform: seen ? "none" : "translateY(16px)",
                  transition: `opacity .45s ease, transform .55s ${EASE}, border-color .4s, background .4s`,
                }}
              >
                <span className="font-black" style={{ fontSize: 28, color: now ? D.agent : D.sky, fontFamily: MONO }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-black leading-[1.25]" style={{ fontSize: 34, color: now ? D.paper : D.mist }}>
                  {r.title}
                </span>
              </li>
            );
          })}
        </ol>
      </TrackBody>
    </div>
  );
}

function Bubble({ m, on, delay }: { m: Msg; on: boolean; delay: number }) {
  const anim = { opacity: on ? (m.old ? 0.45 : 1) : 0, transform: on ? "none" : "translateY(12px)", transition: `opacity .4s ease ${on ? delay : 0}ms, transform .5s ${EASE} ${on ? delay : 0}ms` };
  if (m.who === "divider")
    return (
      <div className="flex items-center gap-[16px]" style={anim}>
        <span className="h-[2px] flex-1" style={{ background: D.line }} />
        <span className="text-[24px] font-bold" style={{ color: D.dim }}>
          {CONFIRM.later}
        </span>
        <span className="h-[2px] flex-1" style={{ background: D.line }} />
      </div>
    );
  const you = m.who === "you";
  return (
    <div
      className={`max-w-[86%] px-[26px] py-[16px] text-[32px] font-bold leading-[1.4] ${you ? "self-start rounded-[24px_24px_8px_24px]" : "self-end rounded-[24px_24px_24px_8px]"}`}
      style={{
        background: you ? D.sky : m.ghost ? "transparent" : D.panel2,
        color: you ? D.ink : m.ghost ? D.agentSoft : D.paper,
        border: you ? "none" : `2px ${m.ghost ? "dashed" : "solid"} ${D.agent}88`,
        textDecoration: m.old ? "line-through" : undefined,
        ...anim,
      }}
    >
      {m.text}
    </div>
  );
}
