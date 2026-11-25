"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import { S21, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer } from "../kit/Sketch";
import { SlideTitle } from "../kit/ui";
import { Pointer, DESIGNER_LABEL, type Waypoint } from "../kit/Pointer";
import { MiniFolder } from "../kit/FigmaMock";
import { FlowRail, type FlowState } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "تصميم UI/UX: من نظام التصميم إلى واجهات جديدة (04 Design System · 05 UI Design)" },
  { key: "options", label: "خياران: عندك نظام متكامل وتزوّد الوكيل فيه، أو تبنيه معه وتحدد قواعده" },
  { key: "skill", label: "المكوّنات والتوكنات وقواعد الاستخدام تصير Skill مفعّلة في المشروع" },
  { key: "result", label: "واجهة حالية وواجهة جديدة من الوكيل بنفس القواعد، والعبارة الختامية" },
];

const RAIL = { x: 660, y: 248, w: 600 };
/** the two option cards: same inset on every side, so nothing in them touches an edge */
const CARD = { y: 366, w: 760, h: 284, pad: 44 };
const CARD_X = [1000, 160]; // right (read first): you have a system · left: build it with the agent
const FOLDER = { x: 810, y: 690, w: 300 };
/** in the result the Skill sits between the two screens, a little smaller */
const FOLDER_RESULT = { x: 848, y: 470, scale: 0.75 };
const PHONE = { w: 270, h: 470, y: 400 };
const CURRENT_X = 1290;
const NEW_X = 360;

/** one system, used by both screens: these values are the point of the slide */
const C = { brand: D.cobalt, brandSoft: D.sky, surface: "#0f1621", card: D.paper, radius: 18, cta: D.agent };

const Mono = ({ children, color = D.mist, size = 20, style }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) => (
  <span dir="ltr" className="whitespace-nowrap font-bold leading-none" style={{ fontSize: size, color, fontFamily: MONO, ...style }}>
    {children}
  </span>
);

const pop = (on: boolean): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "scale(.8)",
  transition: "opacity .3s ease, transform .5s cubic-bezier(.3,1.4,.5,1)",
});

/** a phone screen drawn from the system's values; `parts` reveals it piece by piece (header, card, button) */
function Screen({ kind, parts }: { kind: "orders" | "profile"; parts: number }) {
  return (
    <div className="flex h-full flex-col gap-[16px] p-[18px]" dir="rtl">
      <div className="flex items-center justify-between rounded-[14px] px-[16px] py-[12px]" style={{ background: C.brand, ...pop(parts >= 1) }}>
        <span className="text-[24px] font-black" style={{ color: D.paper }}>
          {kind === "orders" ? S21.screens.orders : S21.screens.profile}
        </span>
        <span className="h-[26px] w-[26px] rounded-full" style={{ background: C.brandSoft }} />
      </div>
      <div className="overflow-hidden" style={{ borderRadius: C.radius, background: C.card, ...pop(parts >= 2) }}>
        <div style={{ height: kind === "orders" ? 92 : 70, background: `linear-gradient(135deg, ${C.brand}, ${D.azure})` }} />
        <div className="flex flex-col gap-[10px] p-[14px]">
          <span className="h-[14px] w-[70%] rounded-full" style={{ background: D.ink }} />
          <span className="h-[10px] w-[50%] rounded-full" style={{ background: "#c6d3e6" }} />
        </div>
      </div>
      {kind === "profile" && (
        <div className="flex h-[54px] items-center rounded-[12px] px-[14px]" style={{ border: `2px solid ${C.brandSoft}`, ...pop(parts >= 2) }}>
          <span className="h-[10px] w-[55%] rounded-full" style={{ background: "#3a4656" }} />
        </div>
      )}
      <div className="mt-auto flex h-[58px] items-center justify-center rounded-full text-[22px] font-black" style={{ background: C.cta, color: D.agentInk, ...pop(parts >= 3) }}>
        {kind === "orders" ? S21.screens.cta : S21.screens.save}
      </div>
    </div>
  );
}

/** where each token shows on a screen (y from the screen's top): header, card, button */
const TOKEN_Y = [46, 160, PHONE.h - 47];

// the designer sets one rule on the "build it" card
const D_ROUTE: Waypoint[] = [
  { x: 960, y: 1010, at: 0 },
  { x: CARD_X[1] + CARD.pad + 90, y: CARD.y + CARD.pad + 22, at: 700, click: true },
  { x: CARD_X[1] + 260, y: CARD.y + 330, at: 1200 },
];
// the agent builds the new screen
const IN = 900;
const N_ROUTE: Waypoint[] = [
  { x: FOLDER_RESULT.x + 40, y: FOLDER_RESULT.y + 140, at: 0 },
  { x: NEW_X + 150, y: PHONE.y + TOKEN_Y[0], at: 600, click: true },
  { x: NEW_X + 150, y: PHONE.y + TOKEN_Y[1], at: 1100, click: true },
  { x: NEW_X + 150, y: PHONE.y + TOKEN_Y[2], at: 1600, click: true },
  { x: NEW_X + 330, y: PHONE.y + 330, at: 2100 },
];
const at = (i: number) => IN + N_ROUTE[i].at + 60;
/** three parts travel from the two options into the Skill */
const CHIP_FROM: [number, number][] = [
  [1240, 664],
  [880, 664],
  [520, 664],
];

/** each option's colour: blue = you bring the system · orange = you build it with the agent */
const TONE = [D.sky, D.agent] as const;

/**
 * One option card's content (owner's pick 2026-11-23: a flat panel with a 2 px border in the option's colour, no
 * motion of its own): question and its corner mark, the answer, then the three terms, all on one start edge.
 */
function OptionBody({ i, op, ruleSet }: { i: number; op: (typeof S21.options)[number]; ruleSet: boolean }) {
  const tone = TONE[i];
  return (
    <div className="relative z-[2] flex h-full flex-col" style={{ padding: CARD.pad }}>
      <div className="flex items-start justify-between gap-[24px]">
        <span className="text-[40px] font-black leading-[1.2]" style={{ color: D.paper }}>
          {op.q}
        </span>
        {i === 0 ? (
          <img src="/deck/logos/mcp/figma.svg" alt="" width={40} height={48} className="mt-[2px] shrink-0" draggable={false} />
        ) : (
          <span
            className="mt-[4px] shrink-0 rounded-[10px] px-[16px] py-[8px]"
            style={{ background: D.sky, opacity: ruleSet ? 1 : 0, transform: ruleSet ? "rotate(-3deg)" : "scale(.6)", transition: "all .35s cubic-bezier(.3,1.4,.5,1)" }}
          >
            <Mono color={D.ink} size={24}>
              {S21.rule}
            </Mono>
          </span>
        )}
      </div>
      <span className="mt-[14px] text-[32px] font-bold leading-[1.3]" style={{ color: i === 0 ? D.sky : D.agentSoft }}>
        {op.a}
      </span>
      <div className="mt-auto flex items-center gap-[14px] self-start" dir="ltr">
        {op.items.map((it, j) => (
          <span key={it} className="flex items-center gap-[14px]">
            <span className="rounded-full px-[20px] py-[10px]" style={{ border: `1.5px solid ${tone}77`, background: `${tone}14` }}>
              <Mono size={24}>{it}</Mono>
            </span>
            {i === 1 && j < op.items.length - 1 && (
              <Mono color={D.dim} size={24}>
                →
              </Mono>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * From a design system to new screens (stages 04 Design System and 05 UI Design, continued from slide 20):
 *   options : two ways in. You already have a full design system and give it to the agent, or you build it with
 *             the agent and set its rules yourself
 *   skill   : either way, the components, tokens and usage rules become one Skill, switched on in the project
 *   result  : with the Skill on, the agent builds a new screen next to a current one; the same tokens tag the same
 *             parts on both. The closing line follows.
 */
export default function S21DesignSystem({ step }: SlideProps) {
  const s = stepper(steps, step);
  const o = useBeats(step, s.idx("options"), [100, 500, 1200, D_ROUTE[1].at + 1260]);
  const k = useBeats(step, s.idx("skill"), [100, 500, 1500, 2100]);
  const n = useBeats(step, s.idx("result"), [100, 500, IN, at(1), at(2), at(3), at(3) + 1000]);

  const cur = s.at("result") ? 1 : s.at("options") ? 0 : -1;
  const state = (i: number): FlowState => (i < cur ? "done" : i === cur ? "now" : "todo");
  const result = s.at("result");
  const skillOn = s.is("skill") || result;
  const flying = s.is("skill") && k >= 2 && k < 3;
  const active = (s.is("skill") && k >= 4) || result;
  const parts = n >= 6 ? 3 : n >= 5 ? 2 : n >= 4 ? 1 : 0;
  const ruleSet = (s.is("options") && o >= 4) || s.past("options");

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S21.sub}>{TRACK.uiux}</SlideTitle>
      <FlowRail items={S21.stages} state={state} startAt={4} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={70} gap={44} size={24} />

      {/* two ways in */}
      {S21.options.map((op, i) => {
        const on = (s.is("options") && o >= 1 + i) || s.is("skill");
        const dim = s.is("skill");
        return (
          <div
            key={op.q}
            className="absolute"
            style={{
              left: CARD_X[i],
              top: CARD.y,
              width: CARD.w,
              height: CARD.h,
              opacity: on ? (dim ? 0.45 : 1) : 0,
              transform: on ? (dim ? "translateY(-20px) scale(.96)" : "none") : "translateY(26px)",
              transition: `opacity .5s ease, transform .6s ${EASE}`,
            }}
          >
            <div className="h-full w-full rounded-[30px]" style={{ background: D.panel, border: `2px solid ${TONE[i]}88` }}>
              <OptionBody i={i} op={op} ruleSet={ruleSet} />
            </div>
          </div>
        );
      })}

      {/* the parts become one Skill */}
      {S21.parts.map((label, i) => (
        <span
          key={label}
          className="absolute whitespace-nowrap rounded-full px-[18px] py-[8px] text-[24px] font-bold"
          style={{
            left: flying ? FOLDER.x + 70 : CHIP_FROM[i][0],
            top: flying ? FOLDER.y + 90 : CHIP_FROM[i][1],
            color: D.agentInk,
            background: D.agentSoft,
            opacity: s.is("skill") && k >= 1 && k < 3 ? 1 : 0,
            transform: flying ? "scale(.7)" : "none",
            transition: `left .8s ${EASE} ${i * 140}ms, top .8s ${EASE} ${i * 140}ms, transform .8s ${EASE} ${i * 140}ms, opacity .3s ease ${k >= 3 ? 0 : i * 120}ms`,
          }}
        >
          {label}
        </span>
      ))}
      <div
        className="absolute flex flex-col items-center gap-[16px]"
        style={{
          left: FOLDER.x,
          top: FOLDER.y,
          width: FOLDER.w,
          transformOrigin: "top left",
          transform: result ? `translate(${FOLDER_RESULT.x - FOLDER.x}px, ${FOLDER_RESULT.y - FOLDER.y}px) scale(${FOLDER_RESULT.scale})` : "none",
          opacity: skillOn && (k >= 2 || result) ? 1 : 0,
          transition: `transform .8s ${EASE}, opacity .4s ease`,
        }}
      >
        <MiniFolder label={S21.skill} w={FOLDER.w} />
        <span className="flex gap-[14px]" style={{ direction: "ltr", opacity: k >= 3 || result ? 1 : 0, transition: "opacity .4s" }}>
          {S21.skillFiles.map((f) => (
            <Mono key={f} size={20}>
              {f}
            </Mono>
          ))}
        </span>
        <div className="flex items-center gap-[16px] whitespace-nowrap rounded-full px-[22px] py-[10px]" style={{ background: active ? "rgba(255,122,0,.12)" : D.panel, border: `2px solid ${active ? D.agent : D.line}`, transition: "all .4s" }}>
          <span className="relative h-[34px] w-[62px] rounded-full" style={{ background: active ? D.agent : D.panel3, transition: "background .35s" }}>
            <span className="absolute top-[4px] h-[26px] w-[26px] rounded-full bg-white" style={{ right: active ? 4 : 32, transition: `right .35s ${EASE}` }} />
          </span>
          <span className="text-[26px] font-black" style={{ color: active ? D.agentSoft : D.dim }}>
            {S21.active}
          </span>
        </div>
      </div>

      {/* the result: a current screen and the agent's new one, the same tokens on both */}
      {(["orders", "profile"] as const).map((kind) => {
        const isNew = kind === "profile";
        const x = isNew ? NEW_X : CURRENT_X;
        const on = isNew ? n >= 3 : n >= 1;
        return (
          <div key={kind}>
            <div className="absolute flex flex-col items-center gap-[14px]" style={{ left: x, top: PHONE.y, width: PHONE.w, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity .45s ease, transform .6s ${EASE}` }}>
              <div className="w-full overflow-hidden" style={{ height: PHONE.h, borderRadius: 34, background: C.surface, border: `8px solid ${isNew ? D.agent : "#2c3642"}`, boxShadow: isNew && n >= 7 ? `0 0 50px ${D.agent}44` : "none", transition: "box-shadow .5s" }}>
                <Screen kind={kind} parts={isNew ? parts : 3} />
              </div>
              <span className="text-[26px] font-bold" style={{ color: isNew ? D.agentSoft : D.dim }}>
                {isNew ? S21.added : S21.current}
              </span>
            </div>
            {S21.tokens.map((t, j) => {
              const lit = isNew ? parts >= j + 1 : n >= 2;
              return (
                <span
                  key={t}
                  className="absolute rounded-full px-[14px] py-[6px]"
                  style={{
                    top: PHONE.y + TOKEN_Y[j] - 17,
                    left: isNew ? x - 22 - 190 : x + PHONE.w + 22,
                    width: 190,
                    textAlign: "center",
                    border: `1.5px solid ${D.agent}`,
                    background: "rgba(255,122,0,.12)",
                    opacity: lit ? 1 : 0,
                    transform: lit ? "none" : `translateX(${isNew ? 12 : -12}px)`,
                    transition: `opacity .35s ease ${isNew ? 0 : j * 120}ms, transform .45s ${EASE} ${isNew ? 0 : j * 120}ms`,
                  }}
                >
                  <Mono size={19} color={D.agentSoft}>
                    {t}
                  </Mono>
                </span>
              );
            })}
          </div>
        );
      })}

      <SketchLayer>
        <Arrow from={[CARD_X[0] + CARD.w / 2, CARD.y + CARD.h + 4]} to={[FOLDER.x + FOLDER.w - 30, FOLDER.y + 40]} bend={-30} color={D.agent} width={4} draw={s.is("skill")} seed={2} />
        <Arrow from={[CARD_X[1] + CARD.w / 2, CARD.y + CARD.h + 4]} to={[FOLDER.x + 30, FOLDER.y + 40]} bend={30} color={D.agent} width={4} draw={s.is("skill")} delay={150} seed={6} />
        <Arrow from={[FOLDER_RESULT.x - 16, FOLDER_RESULT.y + 90]} to={[NEW_X + PHONE.w + 22, PHONE.y + 160]} color={D.agent} width={4} draw={result && n >= 3} seed={9} />
      </SketchLayer>

      <Show on={s.is("result") && n >= 7} from="up" className="absolute inset-x-0 text-center text-[42px] font-black" style={{ top: 958, color: D.mist }}>
        {S21.closing}
      </Show>

      <Pointer path={D_ROUTE} play={s.is("options") && o >= 3} done={false} label={DESIGNER_LABEL} color={D.sky} ink={D.ink} />
      <Pointer path={N_ROUTE} play={s.is("result") && n >= 3 && n < 7} done={false} />
    </div>
  );
}
