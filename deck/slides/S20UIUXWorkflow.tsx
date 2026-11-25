"use client";

import type { CSSProperties, ReactNode } from "react";
import { Comment01Icon, File01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { S20, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Icon, SlideTitle } from "../kit/ui";
import { Pointer, DESIGNER_LABEL, type Waypoint } from "../kit/Pointer";
import { AppWindow, FlowRail, type FlowState } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان والمراحل الثلاث" },
  { key: "research", label: "01 Visual Research: تظهر المراجع والوكيل يجمعها في لوحة" },
  { key: "direction", label: "02 Creative Direction: المصمم يختار ويحدد التوجه" },
  { key: "notes", label: "03 UX Planning: ملاحظات خام تحت نتائج البحث (مقابلات) والاستبيان (ردود)" },
  { key: "analyze", label: "03 UX Planning: نفس الملاحظات تدخل Figma مبعثرة، تتجمّع في Affinity Map، ثم Persona" },
  { key: "board", label: "03 UX Planning: User Journey Map وUser Flow لإعادة الطلب، والمصمم يراجع" },
];

const RAIL = { x: 410, y: 248, w: 1100 };

/** a scene fills the stage under the rail and crossfades with the next one */
function Scene({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className="absolute inset-0" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(26px)", transition: `opacity .45s ease, transform .6s ${EASE}`, pointerEvents: "none" }}>
      {children}
    </div>
  );
}

// ---------- 01–02: references and direction ----------
const THUMB = { w: 250, h: 170 };
const SCATTER: [number, number, number][] = [
  [1480, 400, -6],
  [1150, 510, 4],
  [820, 390, 3],
  [1420, 680, 5],
  [1010, 760, -4],
  [690, 650, -3],
];
const BOARD = { x: 820, y: 470, gap: 26 };
const slot = (i: number): [number, number] => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return [BOARD.x + (2 - col) * (THUMB.w + BOARD.gap), BOARD.y + row * (THUMB.h + BOARD.gap)];
};
const PICKED = [0, 4];
const PALETTES = [
  ["#1e3fd8", "#a5d8ff"],
  ["#2b2f36", "#ff9f43"],
  ["#0f5132", "#9be3b4"],
  ["#3a1d5d", "#d9b8ff"],
  ["#14181f", "#f6f8ff"],
  ["#5b2415", "#ffc4a3"],
];

/** a reference shot: an abstract screen, drawn, never a copy of a real product */
function Thumb({ i }: { i: number }) {
  const [bg, fg] = PALETTES[i];
  return (
    <div className="relative overflow-hidden" style={{ width: THUMB.w, height: THUMB.h, borderRadius: 16, background: bg, border: `1.5px solid ${D.line}`, boxShadow: "0 16px 40px rgba(0,0,0,.45)" }}>
      <div style={{ height: 22, background: "rgba(0,0,0,.25)" }} />
      <div className="absolute" style={{ left: 16, top: 38, width: 120, height: 14, borderRadius: 7, background: fg }} />
      <div className="absolute" style={{ left: 16, top: 62, width: 80, height: 10, borderRadius: 5, background: fg, opacity: 0.5 }} />
      <div className="absolute" style={{ right: 16, top: 38, width: 84, height: 84, borderRadius: i % 2 ? 42 : 14, background: fg, opacity: 0.35 }} />
      <div className="absolute" style={{ left: 16, bottom: 16, width: 92, height: 30, borderRadius: 15, background: fg }} />
    </div>
  );
}

const R_POINTER = 900;
const R_ROUTE: Waypoint[] = [...SCATTER.map(([x, y], i) => ({ x: x + 120, y: y + 90, at: i * 380, click: true })), { x: BOARD.x + 380, y: BOARD.y + 200, at: 2600 }];
const D_PICK: Waypoint[] = [
  { x: 1660, y: 1010, at: 0 },
  { x: slot(0)[0] + 130, y: slot(0)[1] + 90, at: 800, click: true },
  { x: slot(4)[0] + 130, y: slot(4)[1] + 90, at: 1600, click: true },
  { x: 560, y: 760, at: 2300 },
];

// ---------- 03: UX Planning on a Figma canvas ----------
/**
 * The research and the survey (right) become four UX outputs on one Figma canvas (left). The canvas has two rows:
 * Persona + Affinity Map, then User Journey Map + User Flow; the second click pans the camera down to row two.
 * Canvas coordinates are px from the window body's top-left.
 */
const INPUT = { x: 1530, w: 280, y: [400, 540], h: 116 };
const WIN = { x: 110, y: 340, w: 1380, h: 660 };
const BODY = { x: WIN.x, y: WIN.y + 50 };
/** the canvas's exact top-left on the stage (inside the window's 1.5px border and 50px title bar) */
const CANVAS = { x: WIN.x + 1.5, y: WIN.y + 51.5, w: WIN.w - 3, h: WIN.h - 53 };
const ROW2 = 630;
const F = {
  persona: { x: 40, y: 30, w: 620, h: 540 },
  affinity: { x: 690, y: 30, w: 650, h: 540 },
  journey: { x: 40, y: 660, w: 1300, h: 280 },
  flow: { x: 40, y: 960, w: 1300, h: 270 },
};
const PAD = 28;
const HUES = [
  { head: "#ffd35c", note: "#fff1b8" },
  { head: "#8fcaff", note: "#dcefff" },
  { head: "#94e08c", note: "#dcf7d8" },
];
// affinity columns, right to left
const A_COL = { w: 186, gap: 18, head: 92, note: 158, noteH: 92, noteGap: 12 };
const aColX = (c: number) => F.affinity.w - PAD - A_COL.w - c * (A_COL.w + A_COL.gap);

/**
 * The raw notes. The Affinity Map's notes start as scraps under their source card (interview excerpts under the
 * research, replies and comments under the survey), topics mixed, nothing sorted yet. They are the same elements
 * all the way, so the room can follow each text: on the next click they fly into the canvas, land scattered, then
 * gather under their cluster and take its colour.
 *   c, k    = S20.affinity.clusters[c].notes[k]; the list order is the order they appear
 *   raw     = centre under the card, on the stage, and tilt; drawn at RAW_SCALE so it reads from the back
 *   scatter = centre inside the Affinity Map frame, and tilt. A note only lands where no earlier cluster gathers
 *             (cluster 0 anywhere, 1 in the middle or left column, 2 in the left column), so a gathering
 *             cluster never lands on a note that is still waiting.
 */
const RAW_SCALE = 1.5;
const PAPER = "#f1eee8";
/** the source cards while they head the raw notes; they move to INPUT when the canvas opens */
const CARD_RAW: [number, number][] = [
  [1142, 400],
  [478, 400],
];
const RAW: { c: number; k: number; raw: [number, number, number]; scatter: [number, number, number] }[] = [
  // under «نتائج البحث»: interview excerpts. They land on the canvas's right, the survey's on its left, so no
  // flight crosses another and every text stays readable on the way.
  { c: 0, k: 0, raw: [1445, 631, -3], scatter: [470, 290, -3] },
  { c: 1, k: 0, raw: [1117, 641, 2.5], scatter: [250, 245, 3] },
  { c: 0, k: 2, raw: [1432, 822, 2], scatter: [545, 455, 6] },
  { c: 1, k: 1, raw: [1131, 814, -2.5], scatter: [330, 420, -5] },
  // under «الاستبيان»: survey replies and comments
  { c: 0, k: 1, raw: [790, 652, 2.5], scatter: [120, 330, 4] },
  { c: 2, k: 0, raw: [455, 632, -2], scatter: [130, 140, -6] },
  { c: 2, k: 1, raw: [640, 818, -3], scatter: [175, 470, -4] },
];
type NotePhase = "hidden" | "raw" | "scattered" | "sorted";
/** where a note sits in each phase: stage centre x, y, tilt, scale */
function notePlace(n: (typeof RAW)[number], ph: NotePhase, pan: number): [number, number, number, number] {
  const fx = CANVAS.x + F.affinity.x;
  const fy = CANVAS.y + F.affinity.y - pan;
  if (ph === "hidden") return [n.raw[0], n.raw[1] + 24, n.raw[2], RAW_SCALE * 0.85];
  if (ph === "raw") return [n.raw[0], n.raw[1], n.raw[2], RAW_SCALE];
  if (ph === "scattered") return [fx + n.scatter[0], fy + n.scatter[1], n.scatter[2], 1];
  return [fx + aColX(n.c) + A_COL.w / 2, fy + A_COL.note + n.k * (A_COL.noteH + A_COL.noteGap) + A_COL.noteH / 2, (n.k % 2 ? 1.2 : -1.2) * (n.c + 1) * 0.6, 1];
}
// notes click: 1 the two source cards, 2–8 the scraps one by one (a short pause between the two sources)
const N_MARKS = [100, 800, 1300, 1800, 2300, 3000, 3500, 4000];
// analyze click, ms from the click. The notes lift off before the cards move aside, so a card never slides
// under a note on its way to the right.
const T = { open: 100, fly: 350, dock: 500, agent: 750, arrow: 1500, gather: [3000, 3800, 4600], top: 5500, persona: 6200 };
const A_MARKS = [T.open, T.fly, T.agent, T.arrow, ...T.gather, T.top, T.persona, T.persona + 500, T.persona + 1000];
/** the beat numbers those marks give (useBeats counts them from 1) */
const AB = { open: 1, fly: 2, agent: 3, arrow: 4, gather: 5, top: 8, persona: 9, quote: 10, goals: 11 } as const;
const FLY_STAGGER = 90;
// journey columns, right to left after the lane labels
const J = { label: 120, head: 70, headH: 48, laneTop: 150, base: 250, amp: 95 };
const J_RIGHT = F.journey.w - PAD - J.label - 16;
const J_COL = (J_RIGHT - PAD) / S20.journey.stages.length;
const jCx = (i: number) => J_RIGHT - J_COL * (i + 0.5);
const jDy = (v: number) => J.base - v * J.amp;
const FEEL: readonly number[] = S20.journey.feel;
const LOW = FEEL.indexOf(Math.min(...FEEL));
// flow nodes (frame-relative), right to left
const FL = { cy: 120, h: 62 };
const N = {
  start: { x: 1100, w: 170 },
  ask: { cx: 940, d: 128 },
  reorder: { x: 560, w: 230 },
  price: { x: 330, w: 170 },
  end: { x: 60, w: 190 },
  browse: { x: 560, w: 230, y: 198, h: 44 },
};

/** a Figma frame on the canvas: its English concept name on top, the content under it */
function Frame({ f, title, on, children }: { f: { x: number; y: number; w: number; h: number }; title: string; on: boolean; children: ReactNode }) {
  return (
    <div
      className="absolute"
      style={{ left: f.x, top: f.y, width: f.w, height: f.h, borderRadius: 18, background: "#252a31", border: "1.5px solid #3d4450", opacity: on ? 1 : 0, transform: on ? "none" : "scale(.96)", transition: `opacity .4s ease, transform .6s ${EASE}` }}
    >
      <span dir="ltr" className="absolute font-black leading-none" style={{ right: PAD, top: 22, fontSize: 30, color: "#f4f6f9" }}>
        {title}
      </span>
      {children}
    </div>
  );
}

const pop = (on: boolean, delay = 0): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "scale(.7)",
  transition: `opacity .3s ease ${on ? delay : 0}ms, transform .5s cubic-bezier(.3,1.4,.5,1) ${on ? delay : 0}ms`,
});

/** a smooth line through the journey's feeling points */
function curve(points: [number, number][]) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  return d;
}
const feelColor = (v: number) => (v >= 0.6 ? "#33d17a" : v >= 0.3 ? "#ffc94d" : "#ff6b6b");

// pointers (stage coordinates)
const toStage = (fx: number, fy: number, row2 = false) => ({ x: BODY.x + fx, y: BODY.y + fy - (row2 ? ROW2 : 0) });
// the agent arrives with the canvas, once the cards have moved out of its way; it waits while the notes land, then clicks each cluster as it gathers
const A_WAIT = toStage(F.affinity.x + F.affinity.w / 2, F.affinity.y + 60);
const A_ROUTE: Waypoint[] = [
  { ...A_WAIT, at: 0 },
  { ...A_WAIT, at: T.gather[0] - 700 - T.agent },
  ...T.gather.map((t, c) => ({ ...toStage(F.affinity.x + aColX(c) + A_COL.w / 2, F.affinity.y + A_COL.head + 26), at: t - T.agent, click: true })),
  { ...toStage(F.persona.x + F.persona.w - PAD - 58, F.persona.y + 146), at: T.persona - T.agent, click: true },
  { ...toStage(F.persona.x + 120, F.persona.y + F.persona.h + 20), at: T.persona + 700 - T.agent },
];
const B_IN = 1100;
const B_AGENT: Waypoint[] = [
  { ...toStage(F.persona.x + 120, F.persona.y + F.persona.h + 20), at: 0 },
  { ...toStage(F.journey.x + jCx(LOW), F.journey.y + jDy(S20.journey.feel[LOW]), true), at: 900, click: true },
  { ...toStage(F.flow.x + N.reorder.x + N.reorder.w / 2, F.flow.y + FL.cy, true), at: 2500, click: true },
  { ...toStage(F.flow.x + N.reorder.x + N.reorder.w + 60, F.flow.y + 230, true), at: 3100 },
];
const B_REVIEW = 5200;
const B_DESIGNER: Waypoint[] = [
  { x: 300, y: 1010, at: 0 },
  { ...toStage(F.flow.x + N.reorder.x + 60, F.flow.y + FL.cy + 10, true), at: 800, click: true },
  { ...toStage(F.flow.x + N.reorder.x - 60, F.flow.y + 240, true), at: 1300 },
];

/**
 * The UI/UX workflow's first half: research, visual direction and UX planning (Design System and UI Design follow
 * on slide 21). Five clicks:
 *   research  : reference shots land scattered; the agent gathers them into one board
 *   direction : the designer picks two and states the direction (the decision is the designer's)
 *   notes     : the two sources, each with its raw notes under it, one by one (no canvas, no agent yet)
 *   analyze   : the Figma canvas opens with the agent; the same notes fly in, land scattered, then gather under
 *               the Affinity Map's clusters (re-ordering the most frequent); a Persona is built from it
 *   board     : the camera pans to the next row: a User Journey Map whose low point is re-ordering, with the
 *               opportunity it opens, and a User Flow with a one-tap re-order path; the designer reviews.
 * The example (a coffee app, the quotes, numbers and persona) is made up for the workshop.
 */
export default function S20UIUXWorkflow({ step }: SlideProps) {
  const s = stepper(steps, step);
  const r = useBeats(step, s.idx("research"), [60, R_POINTER, R_POINTER + 2000]);
  // direction: 1 designer moves, 2 first pick, 3 second pick, 4 the direction card, 5 the stamp
  const d = useBeats(step, s.idx("direction"), [200, 1060, 1860, 2500, 3200]);
  const nb = useBeats(step, s.idx("notes"), N_MARKS);
  // analyze: the canvas (the cards then move aside), the notes fly in, the agent, the arrow, the three clusters gather,
  // the most frequent, persona, quote, goals & pains (AB)
  const a = useBeats(step, s.idx("analyze"), A_MARKS);
  // board: 1 pan, 2 agent, 3 stages, 4 feeling curve, 5 pain & chance, 6 flow, 7 re-order path, 8 designer, 9 comment, 10 stamp, 11 message
  const b = useBeats(step, s.idx("board"), [100, B_IN, 1000, 1700, 2300, 3000, 4300, B_REVIEW, B_REVIEW + 860, B_REVIEW + 1400, B_REVIEW + 2000]);

  const now = s.is("title") ? -1 : s.is("research") ? 0 : s.is("direction") ? 1 : s.is("board") && b >= 10 ? 3 : 2;
  const state = (i: number): FlowState => (i < now ? "done" : i === now ? "now" : "todo");
  const collected = r >= 3 || s.past("research");
  const picked = d >= 3 || s.past("direction") ? PICKED.length : d >= 2 ? 1 : 0;
  const planning = s.at("notes");
  const row2 = s.at("board");
  const P = row2 ? 99 : a; // row one stays finished once we pan away
  const cardsOn = nb >= 1 || s.past("notes");
  const docked = P >= AB.open; // the canvas is open: the source cards sit on its right
  const notePhase = (i: number, c: number): NotePhase => (P >= AB.gather + c ? "sorted" : P >= AB.fly ? "scattered" : nb >= 2 + i || s.past("notes") ? "raw" : "hidden");
  const flowOn = b >= 6;
  const hot = b >= 7;

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S20.sub}>{TRACK.uiux}</SlideTitle>
      <FlowRail items={S20.stages} state={state} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={70} gap={44} size={24} />

      {/* 01–02: the reference board and the designer's direction */}
      <Scene on={s.is("research") || s.is("direction")}>
        <Show on={collected} from="fade" className="absolute rounded-[28px]" style={{ left: BOARD.x - 30, top: BOARD.y - 74, width: 3 * THUMB.w + 2 * BOARD.gap + 60, height: 2 * THUMB.h + BOARD.gap + 104, border: `2px dashed ${D.lineStrong}` }}>
          <span className="absolute right-[26px] top-[16px] text-[26px] font-bold" style={{ color: D.sky }}>
            {S20.board}
          </span>
          <span dir="ltr" className="absolute left-[26px] top-[20px] text-[18px] font-bold" style={{ color: D.dim, fontFamily: MONO }}>
            Mobbin · Dribbble · Behance
          </span>
        </Show>
        {SCATTER.map(([x, y, rot], i) => {
          const [bx, by] = slot(i);
          const on = r >= 1 || s.past("research");
          const chosen = PICKED.indexOf(i);
          const isPicked = chosen >= 0 && chosen < picked;
          const dim = ((s.is("direction") && d >= 4) || s.past("direction")) && chosen < 0;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: collected ? bx : x,
                top: collected ? by : y,
                transform: `rotate(${collected ? 0 : rot}deg) scale(${on ? 1 : 0.7})`,
                opacity: on ? (dim ? 0.3 : 1) : 0,
                transition: `left .8s ${EASE} ${i * 60}ms, top .8s ${EASE} ${i * 60}ms, transform .8s ${EASE} ${collected ? i * 60 : i * 110}ms, opacity .5s ease ${collected ? 0 : i * 110}ms`,
              }}
            >
              <Thumb i={i} />
              {isPicked && <span className="pointer-events-none absolute -inset-[8px] rounded-[22px]" style={{ border: `4px solid ${D.sky}`, boxShadow: `0 0 30px ${D.sky}66`, animation: "lab-fade .3s both" }} />}
            </div>
          );
        })}
        <Show on={(s.is("direction") && d >= 4) || s.past("direction")} from="end" className="absolute flex flex-col gap-[22px] rounded-[28px] p-[34px]" style={{ left: 150, top: 490, width: 520, background: D.panel, border: `2px solid ${D.sky}` }}>
          <span className="text-[34px] font-black" style={{ color: D.paper }}>
            {S20.direction}
          </span>
          <div className="flex flex-wrap gap-[12px]">
            {S20.directionChips.map((c) => (
              <span key={c} className="rounded-full px-[20px] py-[9px] text-[26px] font-bold" style={{ color: D.sky, border: `1.5px solid ${D.sky}88` }}>
                {c}
              </span>
            ))}
          </div>
          <Show on={d >= 5 || s.past("direction")} from="pop" className="self-start rounded-[12px] px-[18px] py-[8px] text-[24px] font-black" style={{ color: D.ink, background: D.sky, transform: "rotate(-3deg)" }}>
            {S20.decision}
          </Show>
        </Show>
      </Scene>

      {/* 03: raw notes under their sources → on a Figma canvas, the same notes become UX outputs */}
      <Scene on={planning}>
        <svg className="absolute" style={{ left: 0, top: 0, overflow: "visible" }} width={1} height={1} aria-hidden>
          <path d={`M${INPUT.x - 14} ${INPUT.y[0] + 120} L${WIN.x + WIN.w + 14} ${INPUT.y[0] + 120}`} stroke={D.sky} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" style={{ opacity: P >= AB.arrow ? 1 : 0, transition: "opacity .4s" }} />
          <path d={`M${WIN.x + WIN.w + 28} ${INPUT.y[0] + 108} L${WIN.x + WIN.w + 12} ${INPUT.y[0] + 120} L${WIN.x + WIN.w + 28} ${INPUT.y[0] + 132}`} fill="none" stroke={D.sky} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: P >= AB.arrow ? 1 : 0, transition: "opacity .4s" }} />
        </svg>

        <div style={{ opacity: P >= AB.open ? 1 : 0, transform: P >= AB.open ? "none" : "translateY(40px)", transition: `opacity .5s ease, transform .7s ${EASE}` }}>
          <AppWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title={S20.file} logo="/deck/logos/mcp/figma.svg" bar="#2c2c2c" body="#1e1e1e" border="#3a3a3a">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1.4px, transparent 1.4px)", backgroundSize: "28px 28px" }} />
            {/* the canvas: the camera pans to row two on the next click */}
            <div className="absolute left-0 top-0" style={{ width: WIN.w, height: 1300, transform: `translateY(${row2 ? -ROW2 : 0}px)`, transition: `transform 1s ${EASE}` }}>
              {/* Persona */}
              <Frame f={F.persona} title={S20.persona.title} on={P >= AB.persona}>
                <span className="absolute flex items-center justify-center rounded-full" style={{ right: PAD, top: 86, width: 116, height: 116, background: `linear-gradient(135deg, ${D.cobalt}, ${D.azure})`, ...pop(P >= AB.persona) }}>
                  <Icon icon={UserIcon} size={64} color={D.paper} stroke={1.6} />
                </span>
                <span className="absolute flex flex-col gap-[8px]" style={{ right: PAD + 140, top: 104, ...pop(P >= AB.persona, 120) }}>
                  <span className="text-[38px] font-black leading-none" style={{ color: "#f4f6f9" }}>
                    {S20.persona.name}
                  </span>
                  <span className="text-[23px] font-bold" style={{ color: "#aeb7c2" }}>
                    {S20.persona.role}
                  </span>
                </span>
                <span className="absolute text-[25px] font-bold leading-[1.45]" style={{ right: PAD, left: PAD, top: 230, padding: "14px 20px", borderRadius: 14, background: "rgba(165,216,255,.08)", borderRight: `5px solid ${D.sky}`, color: D.sky, ...pop(P >= AB.quote) }}>
                  {S20.persona.quote}
                </span>
                {[S20.persona.goals, S20.persona.pains].map((g, k) => (
                  <div key={g.label} className="absolute flex flex-col gap-[12px]" style={{ top: 360, right: k ? undefined : PAD, left: k ? PAD : undefined, width: (F.persona.w - 2 * PAD - 24) / 2, ...pop(P >= AB.goals, k * 150) }}>
                    <span className="flex items-center gap-[10px] text-[24px] font-black" style={{ color: k ? "#ff8a8a" : "#5fe39a" }}>
                      <span className="h-[12px] w-[12px] rounded-full" style={{ background: k ? "#ff6b6b" : "#33d17a" }} />
                      {g.label}
                    </span>
                    {g.items.map((it) => (
                      <span key={it} className="text-[22px] font-bold leading-[1.35]" style={{ color: "#e6eaef" }}>
                        {it}
                      </span>
                    ))}
                  </div>
                ))}
              </Frame>

              {/* Affinity Map */}
              <Frame f={F.affinity} title={S20.affinity.title} on={P >= AB.open}>
                <span className="absolute rounded-full px-[14px] py-[6px] text-[20px] font-bold" style={{ left: PAD, top: 20, color: "#aeb7c2", border: "1.5px solid #4a5260" }}>
                  {S20.affinity.from}
                </span>
                {/* the cluster heads; their notes are the raw notes above the canvas, gathered under them */}
                {S20.affinity.clusters.map((c, ci) => (
                  <span key={c.name} className="absolute flex items-center justify-between rounded-[12px] px-[14px] text-[22px] font-black" style={{ left: aColX(ci), top: A_COL.head, width: A_COL.w, height: 52, background: HUES[ci].head, color: "#1b1400", ...pop(P >= AB.gather + ci) }}>
                    {c.name}
                    <span className="text-[19px]">{c.count}</span>
                  </span>
                ))}
                {/* the most frequent cluster: re-ordering */}
                <span className="absolute rounded-[16px]" style={{ left: aColX(0) - 10, top: A_COL.head - 10, width: A_COL.w + 20, height: A_COL.note + 3 * (A_COL.noteH + A_COL.noteGap) - A_COL.head + 8, border: `3px dashed ${D.agent}`, opacity: P >= AB.top ? 1 : 0, transition: "opacity .4s" }} />
                <span className="absolute whitespace-nowrap rounded-full px-[16px] py-[7px] text-[21px] font-black" style={{ left: aColX(0) + 4, top: A_COL.note + 3 * (A_COL.noteH + A_COL.noteGap) + 10, color: D.agentInk, background: D.agent, ...pop(P >= AB.top) }}>
                  {S20.affinity.top}
                </span>
              </Frame>

              {/* User Journey Map */}
              <Frame f={F.journey} title={S20.journey.title} on={b >= 3}>
                {[
                  { t: S20.journey.lanes.stage, y: J.head + J.headH / 2 },
                  { t: S20.journey.lanes.feel, y: (J.laneTop + J.base) / 2 + 10 },
                ].map((l) => (
                  <span key={l.t} className="absolute -translate-y-1/2 text-[21px] font-bold" style={{ right: PAD, top: l.y, width: J.label, color: "#aeb7c2" }}>
                    {l.t}
                  </span>
                ))}
                {S20.journey.stages.map((st, i) => (
                  <span key={st} className="absolute flex items-center justify-center rounded-[10px] text-[21px] font-bold" style={{ left: jCx(i) - J_COL / 2 + 4, top: J.head, width: J_COL - 8, height: J.headH, background: i === LOW ? "rgba(255,107,107,.16)" : "#323945", color: "#f4f6f9", border: `1.5px solid ${i === LOW ? "#ff6b6b88" : "#4a5260"}`, ...pop(b >= 3, i * 110) }}>
                    {st}
                  </span>
                ))}
                <svg className="absolute left-0 top-0" width={F.journey.w} height={F.journey.h} aria-hidden>
                  <line x1={PAD} x2={J_RIGHT} y1={J.base + 14} y2={J.base + 14} stroke="#3d4450" strokeWidth={1.5} strokeDasharray="6 8" />
                  <path
                    d={curve(S20.journey.feel.map((v, i) => [jCx(i), jDy(v)]))}
                    fill="none"
                    stroke="#cfd6df"
                    strokeWidth={4}
                    pathLength={1}
                    strokeDasharray={1}
                    style={{ strokeDashoffset: b >= 4 ? 0 : 1, transition: "stroke-dashoffset 1.1s cubic-bezier(.55,.1,.3,1)" }}
                  />
                  {S20.journey.feel.map((v, i) => (
                    <circle key={i} cx={jCx(i)} cy={jDy(v)} r={i === LOW ? 16 : 13} fill={feelColor(v)} stroke="#252a31" strokeWidth={4} style={{ opacity: b >= 4 ? 1 : 0, transition: `opacity .3s ease ${i * 180}ms` }} />
                  ))}
                </svg>
                {/* the low point: the pain, and the chance it opens */}
                <span className="absolute flex flex-col items-center gap-[6px]" style={{ left: jCx(LOW) - 170, top: J.laneTop - 22, width: 340, ...pop(b >= 5) }}>
                  <span className="text-[21px] font-black" style={{ color: "#ff8a8a" }}>
                    {S20.journey.pain}
                  </span>
                  <span className="rounded-full px-[16px] py-[5px] text-[21px] font-black" style={{ background: D.agent, color: D.agentInk }}>
                    {S20.journey.chance}
                  </span>
                </span>
              </Frame>

              {/* User Flow */}
              <Frame f={F.flow} title={S20.flow.title} on={flowOn}>
                <svg className="absolute left-0 top-0" width={F.flow.w} height={F.flow.h} aria-hidden>
                  <defs>
                    <marker id="s20-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill="#9aa5b1" />
                    </marker>
                    <marker id="s20-arrow-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 0 L10 5 L0 10 z" fill={D.agent} />
                    </marker>
                  </defs>
                  {[
                    { d: `M${N.start.x - 6} ${FL.cy} L${N.ask.cx + N.ask.d / 2 + 6} ${FL.cy}`, hot: true },
                    { d: `M${N.ask.cx - N.ask.d / 2 - 6} ${FL.cy} L${N.reorder.x + N.reorder.w + 6} ${FL.cy}`, hot: true },
                    { d: `M${N.reorder.x - 6} ${FL.cy} L${N.price.x + N.price.w + 6} ${FL.cy}`, hot: true },
                    { d: `M${N.price.x - 6} ${FL.cy} L${N.end.x + N.end.w + 6} ${FL.cy}`, hot: true },
                    { d: `M${N.ask.cx} ${FL.cy + N.ask.d / 2 + 4} L${N.ask.cx} ${N.browse.y + N.browse.h / 2} L${N.browse.x + N.browse.w + 6} ${N.browse.y + N.browse.h / 2}`, hot: false },
                    { d: `M${N.browse.x - 6} ${N.browse.y + N.browse.h / 2} L${N.price.x + N.price.w / 2} ${N.browse.y + N.browse.h / 2} L${N.price.x + N.price.w / 2} ${FL.cy + FL.h / 2 + 6}`, hot: false },
                  ].map((e, i) => (
                    <path key={i} d={e.d} fill="none" stroke={hot && e.hot ? D.agent : "#9aa5b1"} strokeWidth={hot && e.hot ? 4 : 3} markerEnd={`url(#${hot && e.hot ? "s20-arrow-hot" : "s20-arrow"})`} style={{ opacity: flowOn ? 1 : 0, transition: `opacity .3s ease ${flowOn ? 300 + i * 140 : 0}ms, stroke .3s` }} />
                  ))}
                </svg>
                {/* start and end are pills, steps are boxes, the question is a diamond */}
                {[
                  { k: "start", t: S20.flow.start, x: N.start.x, w: N.start.w, pill: true, d: 0 },
                  { k: "reorder", t: S20.flow.reorder, x: N.reorder.x, w: N.reorder.w, pill: false, d: 300 },
                  { k: "price", t: S20.flow.price, x: N.price.x, w: N.price.w, pill: false, d: 450 },
                  { k: "end", t: S20.flow.end, x: N.end.x, w: N.end.w, pill: true, d: 600 },
                ].map((n) => {
                  const lit = n.k === "reorder" && hot;
                  return (
                    <span key={n.k} className="absolute flex items-center justify-center text-[22px] font-bold" style={{ left: n.x, top: FL.cy - FL.h / 2, width: n.w, height: FL.h, borderRadius: n.pill ? 31 : 12, background: lit ? D.agent : n.pill ? "#3a4452" : "#323945", color: lit ? D.agentInk : "#f4f6f9", border: `1.5px solid ${lit ? D.agent : "#5a6472"}`, boxShadow: lit ? `0 0 30px ${D.agent}55` : "none", transition: "background .3s, box-shadow .3s", ...pop(flowOn, n.d) }}>
                      {n.t}
                    </span>
                  );
                })}
                <span className="absolute flex items-center justify-center" style={{ left: N.ask.cx - N.ask.d / 2, top: FL.cy - N.ask.d / 2, width: N.ask.d, height: N.ask.d, ...pop(flowOn, 150) }}>
                  <span className="absolute" style={{ width: N.ask.d / Math.SQRT2, height: N.ask.d / Math.SQRT2, transform: "rotate(45deg)", background: "#323945", border: `1.5px solid ${hot ? D.agent : "#5a6472"}`, borderRadius: 8 }} />
                  <span className="relative text-center text-[19px] font-bold leading-[1.2]" style={{ color: "#f4f6f9" }}>
                    {S20.flow.ask[0]}
                    <br />
                    {S20.flow.ask[1]}
                  </span>
                </span>
                <span className="absolute text-[20px] font-black" style={{ left: N.reorder.x + N.reorder.w + 18, top: FL.cy - 42, color: hot ? D.agentSoft : "#aeb7c2", ...pop(flowOn, 350) }}>
                  {S20.flow.yes}
                </span>
                <span className="absolute text-[20px] font-black" style={{ left: N.ask.cx + 14, top: N.browse.y - 14, color: "#aeb7c2", ...pop(flowOn, 350) }}>
                  {S20.flow.no}
                </span>
                <span className="absolute flex items-center justify-center rounded-[10px] text-[20px] font-bold" style={{ left: N.browse.x, top: N.browse.y, width: N.browse.w, height: N.browse.h, background: "#2b3039", color: "#cfd6df", border: "1.5px dashed #5a6472", ...pop(flowOn, 500) }}>
                  {S20.flow.browse}
                </span>
              </Frame>
            </div>
          </AppWindow>
        </div>

        {/* the two sources: they head their raw notes, then move aside to the canvas's right when it opens */}
        {S20.inputs.map((inp, i) => {
          const [x, y] = docked ? [INPUT.x, INPUT.y[i]] : CARD_RAW[i];
          return (
            <div key={inp.title} className="absolute left-0 top-0" style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform .9s ${EASE} ${docked ? T.dock - T.open + i * 120 : 0}ms` }}>
              <Show on={cardsOn} from="start" delay={i * 150} className="flex items-center gap-[16px] rounded-[20px] px-[22px]" style={{ width: INPUT.w, height: INPUT.h, background: D.panel, border: `2px solid ${D.sky}` }}>
                <Icon icon={i ? Comment01Icon : File01Icon} size={44} color={D.sky} stroke={1.7} />
                <span className="flex flex-col gap-[6px]">
                  <span className="text-[28px] font-black" style={{ color: D.paper }}>
                    {inp.title}
                  </span>
                  <span className="text-[22px] font-bold" style={{ color: D.dim }}>
                    {inp.meta}
                  </span>
                </span>
              </Show>
            </div>
          );
        })}

        {/* the notes: raw scraps under their source, then the Affinity Map's notes. One element per note the whole
            way; the layer is clipped to the canvas only on the next click, when it pans with the canvas. */}
        <div className="absolute" style={{ left: CANVAS.x, top: CANVAS.y, width: CANVAS.w, height: CANVAS.h, overflow: row2 ? "hidden" : "visible", borderRadius: "0 0 17px 17px" }}>
          {RAW.map((n, i) => {
            const ph = notePhase(i, n.c);
            const [x, y, rot, sc] = notePlace(n, ph, row2 ? ROW2 : 0);
            const wait = ph === "scattered" ? i * FLY_STAGGER : ph === "sorted" && !row2 ? n.k * 120 : 0;
            const move = row2 ? `1s ${EASE}` : ph === "scattered" ? `1s ${EASE}` : ph === "sorted" ? `.8s ${EASE}` : s.is("notes") ? ".55s cubic-bezier(.3,1.4,.5,1)" : `.7s ${EASE}`;
            return (
              <span
                key={i}
                className="absolute left-0 top-0 flex items-center px-[14px] text-[20px] font-bold leading-[1.3]"
                style={{
                  width: A_COL.w,
                  height: A_COL.noteH,
                  borderRadius: 8,
                  color: "#1b1400",
                  backgroundColor: ph === "sorted" ? HUES[n.c].note : PAPER,
                  boxShadow: "0 8px 18px rgba(0,0,0,.35)",
                  opacity: ph === "hidden" ? 0 : 1,
                  zIndex: ph === "sorted" ? 2 : 1,
                  transform: `translate(${x - CANVAS.x - A_COL.w / 2}px, ${y - CANVAS.y - A_COL.noteH / 2}px) rotate(${rot}deg) scale(${sc})`,
                  transition: `transform ${move} ${wait}ms, opacity .35s ease, background-color .45s ease ${wait}ms`,
                }}
              >
                «{S20.affinity.clusters[n.c].notes[n.k]}»
              </span>
            );
          })}
        </div>

        {/* the designer's review */}
        <Show on={row2 && b >= 9} from="pop" className="absolute rounded-[18px] px-[20px] py-[12px] text-[25px] font-bold" style={{ left: BODY.x + F.flow.x + N.reorder.x - 20, top: BODY.y + F.flow.y - ROW2 + 14, color: D.ink, background: D.sky, boxShadow: "0 14px 34px rgba(0,0,0,.4)" }}>
          {S20.comment}
        </Show>
        <Show on={row2 && b >= 10} from="pop" className="absolute rounded-[12px] px-[18px] py-[8px] text-[24px] font-black" style={{ left: WIN.x + 520, top: WIN.y + 4, color: D.ink, background: D.sky, transform: "rotate(-2deg)" }}>
          {S20.reviewed} ✓
        </Show>
      </Scene>

      <Show on={s.is("board") && b >= 11} from="up" className="absolute inset-x-0 text-center text-[40px] font-black" style={{ top: 1010, color: D.mist }}>
        {S20.message}
      </Show>

      <Pointer path={R_ROUTE} play={s.is("research") && r >= 2} done={false} />
      <Pointer path={D_PICK} play={s.is("direction") && d >= 1} done={false} label={DESIGNER_LABEL} color={D.sky} ink={D.ink} />
      <Pointer path={A_ROUTE} play={s.is("analyze") && a >= AB.agent} done={false} />
      <Pointer path={B_AGENT} play={s.is("board") && b >= 2 && b < 8} done={false} />
      <Pointer path={B_DESIGNER} play={s.is("board") && b >= 8 && b < 11} done={false} label={DESIGNER_LABEL} color={D.sky} ink={D.ink} />
    </div>
  );
}
