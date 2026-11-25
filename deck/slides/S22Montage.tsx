"use client";

import type { CSSProperties } from "react";
import { CheckmarkCircle02Icon, Cursor01Icon, ScissorIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { S22, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show, Typed } from "../kit/Show";
import { Icon, SlideTitle } from "../kit/ui";
import { Pointer, type Waypoint } from "../kit/Pointer";
import { ICON_RADIUS, ICON_VISIBLE, LogoSlabs3D, type Slab } from "../kit/LogoSlabs3D";
import { MEDIA } from "../media/media";
import { WamdaActor, lookFor } from "../character/Wamda";
import { AgentLine, AppWindow, AskBubble, TrackBody } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "mcps", label: "الوكيل يفكّر وتحته MCPs: DaVinci Resolve يمين، وAdobe Premiere يسار وعليه Soon" },
  { key: "edit", label: "المحاكاة: الطلب، والوكيل يرتّب ويقص ويضيف انتقال، والمعاينة تتحدث" },
];

// ---------- the opening composition: one axis, three elements ----------
/** the 3D band: its middle is the composition's axis */
const BAND = { y: 250, h: 740 };
const AXIS = BAND.y + BAND.h / 2;
const WAMDA = { scale: 4.2, w: 72 * 4.2, h: 76 * 4.2 };
const LABEL_H = 70;

/** the deck's «Pr» stand-in (as on slide 15), drawn to the DaVinci icon's outline so both slabs match */
function drawPremiere(g: CanvasRenderingContext2D, n: number) {
  const m = (n * (1 - ICON_VISIBLE)) / 2;
  const side = n - 2 * m;
  const r = ICON_RADIUS * side;
  g.beginPath();
  g.roundRect(m, m, side, side, r);
  g.fillStyle = "#00005b";
  g.fill();
  g.lineWidth = side * 0.035;
  g.strokeStyle = "#9999ff";
  g.beginPath();
  g.roundRect(m + side * 0.06, m + side * 0.06, side * 0.88, side * 0.88, r * 0.78);
  g.stroke();
  g.fillStyle = "#9999ff";
  g.font = `700 ${side * 0.42}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("Pr", n / 2, n / 2 + side * 0.02);
}

/** module constants, so the 3D scene is built once per mount */
/** DaVinci Resolve first, in its colours; then Premiere: blurred for a moment, then sharp, in black and white, with «Soon…» above */
const DAVINCI: Slab = { src: MEDIA.s22.davinci, body: "#2a3446", enterAt: 200 };
const PREMIERE: Slab = { src: MEDIA.s22.premiere, draw: drawPremiere, body: "#2c2e33", enterAt: 1250, gray: true, blurIn: 16, caption: S22.soon };

// ---------- the editor (stage px) ----------
const ED = { x: 110, y: 190, w: 1300, h: 840 };
const TOP = ED.y + 50; // under the title bar
const BIN = { x: ED.x, w: 300 };
const VIEW = { x: ED.x + 300, w: 700 };
const INSP = { x: ED.x + 1000, w: 300 };
const ROW_H = 400;
const TOOLS_Y = TOP + ROW_H;
const TL = { y: TOOLS_Y + 54, head: 100 };
const LANE_X = ED.x + TL.head + 10;
const V1 = { y: TL.y + 130, h: 92 };
const A1 = { y: TL.y + 236, h: 74 };
const PX = 50; // px per second on the timeline

type Clip = { id: number; dur: number; extra?: number; hue: [string, string] };
const CLIPS: Clip[] = [
  { id: 0, dur: 4, hue: ["#1e3fd8", "#38bdf8"] },
  { id: 1, dur: 4, extra: 2, hue: ["#a8430f", "#ffb25e"] },
  { id: 2, dur: 3.5, hue: ["#0f5132", "#58d68d"] },
  { id: 3, dur: 4, hue: ["#4a1d75", "#c39bff"] },
];
/** shooting order on the timeline, then after each drag */
const ORDER_0 = [2, 0, 3, 1];
const ORDER_1 = [0, 2, 3, 1];
const ORDER_2 = [0, 1, 2, 3];

function layout(order: number[], trimmed: boolean) {
  let x = 0;
  const pos: Record<number, { x: number; w: number; extraW: number }> = {};
  for (const id of order) {
    const c = CLIPS[id];
    const extraW = !trimmed && c.extra ? c.extra * PX : 0;
    const w = c.dur * PX + extraW;
    pos[id] = { x, w, extraW };
    x += w;
  }
  return { pos, end: x };
}

// pointer route (stage px), with the beats it drives
const L0 = layout(ORDER_0, false).pos;
const L1 = layout(ORDER_1, false).pos;
const L2 = layout(ORDER_2, false).pos;
const L3 = layout(ORDER_2, true).pos;
const cx = (p: { x: number; w: number }) => LANE_X + p.x + p.w / 2;
const VY = V1.y + V1.h / 2;
const IN = 1500; // the agent starts after the request is typed
const ROUTE: Waypoint[] = [
  { x: 1560, y: 600, at: 0 },
  { x: cx(L0[0]), y: VY, at: 700, click: true }, // grab clip 1
  { x: LANE_X + L1[0].w / 2, y: VY, at: 1400 }, // drop it first
  { x: cx(L1[1]), y: VY, at: 2000, click: true }, // grab clip 2
  { x: LANE_X + L2[1].x + L2[1].w / 2, y: VY, at: 2700 }, // drop it second
  { x: LANE_X + L2[1].x + L2[1].w - 4, y: VY - 20, at: 3300, click: true }, // trim handle
  { x: LANE_X + L3[1].x + L3[1].w, y: VY - 20, at: 3900 }, // dragged back
  { x: LANE_X + L3[1].x, y: VY - 30, at: 4500, click: true }, // the cut: add a transition
  { x: VIEW.x + VIEW.w / 2 + 160, y: TOP + 300, at: 5300 },
];
const T = (i: number) => IN + ROUTE[i].at + 60;
const BEAT = {
  ask: 100,
  agent: IN,
  order1: T(2),
  order2: T(4),
  trim: T(6),
  xfade: T(7),
  preview: T(7) + 700,
  done: T(7) + 1500,
};

/** a clip block on V1 */
function ClipBlock({ c, x, w, extraW, label, active }: { c: Clip; x: number; w: number; extraW: number; label: string; active: boolean }) {
  return (
    <div
      className="absolute overflow-hidden"
      data-clip={c.id}
      style={{
        left: LANE_X + x,
        top: V1.y,
        width: w - 4,
        height: V1.h,
        borderRadius: 10,
        background: `linear-gradient(135deg, ${c.hue[0]}, ${c.hue[1]})`,
        border: `2px solid ${active ? D.agent : "rgba(0,0,0,.35)"}`,
        boxShadow: active ? `0 0 24px ${D.agent}88` : "none",
        transition: `left .6s ${EASE}, width .6s ${EASE}, border-color .3s, box-shadow .3s`,
        zIndex: active ? 2 : 1,
      }}
    >
      <span className="absolute right-[10px] top-[8px] text-[19px] font-bold" style={{ color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
        {label}
      </span>
      {extraW > 0 && (
        <span
          className="absolute bottom-0 right-0 top-0"
          style={{ width: extraW, background: "repeating-linear-gradient(135deg, rgba(0,0,0,.55) 0 8px, rgba(0,0,0,.25) 8px 16px)", borderLeft: "2px dashed rgba(255,255,255,.7)", transition: `width .6s ${EASE}` }}
        />
      )}
    </div>
  );
}

const panelTitle: CSSProperties = { fontFamily: MONO, color: "#8f99a3", fontSize: 17, fontWeight: 700 };

/**
 * Montage with an agent. First the setup links (the DaVinci Resolve MCP explainer, Blackmagic's announcement and
 * its own video, plus Adobe's note). One click then plays the whole request in a simulated editor laid out like
 * a pro NLE (media bin, preview, inspector, toolbar, video and audio tracks), not a copy of DaVinci Resolve:
 * the agent puts the clips in order, trims the extra tail, adds a dissolve at each cut, the preview updates, done.
 */
export default function S22Montage({ step }: SlideProps) {
  const s = stepper(steps, step);
  const editing = s.at("edit");
  const b = useBeats(step, s.idx("edit"), [BEAT.ask, BEAT.agent, BEAT.order1, BEAT.order2, BEAT.trim, BEAT.xfade, BEAT.preview, BEAT.done]);
  // b: 1 ask, 2 agent moves, 3 first drag, 4 second drag, 5 trimmed, 6 transitions, 7 preview, 8 done
  const order = b >= 4 ? ORDER_2 : b >= 3 ? ORDER_1 : ORDER_0;
  const trimmed = b >= 5;
  const { pos, end } = layout(order, trimmed);
  const firstClip = CLIPS[order[0]];
  const busy = b >= 2 && b < 8;
  // the tool in hand and the line in the chat follow what the agent is about to do
  const tool = b >= 5 ? 2 : b >= 4 ? 1 : 0;
  const status = b >= 5 ? 2 : b >= 4 ? 1 : b >= 2 ? 0 : -1;

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S22.sub}>{TRACK.montage}</SlideTitle>

      {/* the agent thinking, between DaVinci Resolve (now) and Adobe Premiere (soon), all on one axis */}
      <div className="absolute inset-0" style={{ opacity: editing ? 0 : 1, transform: editing ? "translateY(-30px)" : "none", transition: `opacity .45s ease, transform .6s ${EASE}`, pointerEvents: "none" }}>
        <div className="absolute inset-x-0" style={{ top: BAND.y, height: BAND.h }}>
          <LogoSlabs3D right={DAVINCI} left={PREMIERE} on={!editing} width={1920} height={BAND.h} size={380} offset={560} />
        </div>
        <Show on={!editing} from="up" className="absolute flex flex-col items-center gap-[12px]" style={{ left: 960 - WAMDA.w / 2, top: AXIS - (WAMDA.h + LABEL_H) / 2, width: WAMDA.w }}>
          <WamdaActor look={lookFor(22)} act="thinking" scale={WAMDA.scale} glow />
          <span dir="ltr" className="text-[54px] font-black leading-none" style={{ color: D.mist, height: LABEL_H - 12 }}>
            {S22.mcps}
          </span>
        </Show>
      </div>

      <TrackBody>

      {/* the simulated editor */}
      <div className="absolute inset-0" style={{ opacity: editing ? 1 : 0, transform: editing ? "none" : "translateY(60px)", transition: `opacity .5s ease, transform .8s ${EASE}`, pointerEvents: "none" }}>
        <AppWindow x={ED.x} y={ED.y} w={ED.w} h={ED.h} title="Edit · Timeline 1" bar="#1c1e21" body="#121417" border="#2f3338">
          {/* media bin */}
          <div className="absolute" style={{ left: 0, top: 0, width: BIN.w, height: ROW_H, borderRight: "1px solid #2f3338", padding: 18 }}>
            <span style={panelTitle}>{S22.panels.bin}</span>
            <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
              {CLIPS.map((c) => (
                <div key={c.id} className="flex flex-col gap-[6px]">
                  <span className="h-[70px] rounded-[8px]" style={{ background: `linear-gradient(135deg, ${c.hue[0]}, ${c.hue[1]})` }} />
                  <span className="text-[16px] font-bold" style={{ color: "#c7ced6" }}>
                    {S22.clips[c.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* preview */}
          <div className="absolute" style={{ left: BIN.w, top: 0, width: VIEW.w, height: ROW_H, padding: 18, borderRight: "1px solid #2f3338" }}>
            <span style={panelTitle}>{S22.panels.viewer}</span>
            <div className="relative mx-auto mt-[12px] overflow-hidden rounded-[8px]" style={{ width: 560, height: 315, background: "#000" }}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${firstClip.hue[0]}, ${firstClip.hue[1]})`, transition: "background .5s" }} />
              {b >= 7 && <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${CLIPS[1].hue[0]}, ${CLIPS[1].hue[1]})`, opacity: 0.5, animation: "lab-fade .6s both" }} />}
              <span className="absolute right-[16px] top-[14px] text-[24px] font-black" style={{ color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
                {S22.clips[firstClip.id]}
              </span>
              <span dir="ltr" className="absolute bottom-[12px] left-[14px] text-[18px] font-bold" style={{ color: "#fff", fontFamily: MONO }}>
                {b >= 7 ? "00:00:03:12" : "00:00:00:00"}
              </span>
              <Show on={b >= 8} from="pop" className="absolute inset-x-0 bottom-[50px] mx-auto flex w-fit items-center gap-[10px] rounded-full px-[22px] py-[10px] text-[24px] font-black" style={{ background: "#33d17a", color: "#0b2a17" }}>
                <Icon icon={CheckmarkCircle02Icon} size={26} color="#0b2a17" stroke={2.2} />
                {S22.done}
              </Show>
            </div>
          </div>
          {/* inspector */}
          <div className="absolute" style={{ left: BIN.w + VIEW.w, top: 0, width: INSP.w, height: ROW_H, padding: 18 }}>
            <span style={panelTitle}>{S22.panels.inspector}</span>
            <div dir="ltr" className="mt-[18px] flex flex-col gap-[14px] text-[17px]" style={{ fontFamily: MONO, color: "#c7ced6" }}>
              <span className="font-bold" style={{ color: "#fff" }}>
                {b >= 6 ? S22.transition : "Clip 2"}
              </span>
              <span>{b >= 6 ? "Duration 1.0 s" : `Duration ${trimmed ? "4.0" : "6.0"} s`}</span>
              <span>{b >= 6 ? "Alignment · Center" : "Speed 100%"}</span>
            </div>
          </div>
          {/* toolbar */}
          <div className="absolute flex items-center gap-[10px] px-[16px]" style={{ left: 0, right: 0, top: ROW_H, height: 54, borderTop: "1px solid #2f3338", borderBottom: "1px solid #2f3338", background: "#17191c" }}>
            {[Cursor01Icon, ScissorIcon, SparklesIcon].map((ic, i) => (
              <span key={i} className="flex h-[38px] w-[44px] items-center justify-center rounded-[8px]" style={{ background: busy && tool === i ? "rgba(255,122,0,.25)" : "transparent", border: `1px solid ${busy && tool === i ? D.agent : "#2f3338"}`, transition: "all .3s" }}>
                <Icon icon={ic} size={22} color={busy && tool === i ? D.agentSoft : "#aab3bd"} stroke={1.8} />
              </span>
            ))}
          </div>
          {/* track headers + ruler */}
          {[
            { t: "V2", y: TL.y + 40 - TOP, h: 80 },
            { t: "V1", y: V1.y - TOP, h: V1.h },
            { t: "A1", y: A1.y - TOP, h: A1.h },
          ].map((tr) => (
            <div key={tr.t} className="absolute flex items-center justify-center text-[18px] font-bold" style={{ left: 0, top: tr.y, width: TL.head, height: tr.h, color: "#8f99a3", fontFamily: MONO, borderRight: "1px solid #2f3338", background: "#17191c" }}>
              {tr.t}
            </div>
          ))}
          <div dir="ltr" className="absolute flex" style={{ left: TL.head + 10, top: TL.y - TOP + 6, right: 0, height: 26, fontFamily: MONO, fontSize: 14, color: "#6f7984" }}>
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ width: PX, flex: "none", borderLeft: "1px solid #2f3338", paddingLeft: 4 }}>
                {i % 2 === 0 ? `00:${String(i).padStart(2, "0")}` : ""}
              </span>
            ))}
          </div>
        </AppWindow>

        {/* clips on V1 */}
        {CLIPS.map((c) => (
          <ClipBlock key={c.id} c={c} x={pos[c.id].x} w={pos[c.id].w} extraW={pos[c.id].extraW} label={S22.clips[c.id]} active={(b === 2 && c.id === 0) || ((b === 3 || b === 4) && c.id === 1)} />
        ))}
        {/* transitions at each cut */}
        {ORDER_2.slice(1).map((id, i) => (
          <span
            key={id}
            className="absolute rounded-[6px]"
            style={{
              left: LANE_X + layout(ORDER_2, true).pos[id].x - 22,
              top: V1.y + 18,
              width: 40,
              height: V1.h - 36,
              background: "linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.65), rgba(255,255,255,.15))",
              border: `2px solid ${D.agent}`,
              opacity: b >= 6 ? 1 : 0,
              transform: b >= 6 ? "none" : "scaleY(.3)",
              transition: `opacity .3s ease ${i * 180}ms, transform .4s ${EASE} ${i * 180}ms`,
              zIndex: 3,
            }}
          />
        ))}
        {/* audio on A1 */}
        <div className="absolute overflow-hidden rounded-[8px]" style={{ left: LANE_X, top: A1.y, width: end - 4, height: A1.h, background: "#14382a", border: "1px solid #1f5a42", transition: `width .6s ${EASE}` }}>
          <svg width="1200" height={A1.h} className="absolute left-0 top-0" aria-hidden>
            {Array.from({ length: 150 }, (_, i) => {
              const h = 10 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * (A1.h - 22);
              return <rect key={i} x={i * 8 + 2} y={(A1.h - h) / 2} width={4} height={h} rx={2} fill="#3ddc97" opacity={0.75} />;
            })}
          </svg>
        </div>
        {/* playhead */}
        <span className="absolute w-[3px]" style={{ left: LANE_X + (b >= 7 ? L3[1].x - 6 : 0), top: TL.y, height: A1.y + A1.h - TL.y + 6, background: "#ff4d4d", transition: `left .7s ${EASE}`, zIndex: 4 }} />

        {/* the request, and the agent's progress */}
        <div className="absolute flex flex-col gap-[18px] rounded-[22px] p-[24px]" style={{ left: ED.x + ED.w + 30, top: ED.y, width: 1810 - (ED.x + ED.w + 30), height: ED.h, background: D.panel, border: `1.5px solid ${D.lineStrong}` }}>
          <span className="flex items-center gap-[10px] text-[24px] font-black" style={{ color: D.agent }}>
            <span className="h-[12px] w-[12px] rounded-full" style={{ background: D.agent }} />
            {S22.agentName}
          </span>
          <AskBubble on={b >= 1} size={26} text={<Typed text={S22.ask} play={b >= 1} cps={34} caret={false} />} />
          <div className="mt-[10px] flex flex-col gap-[16px]">
            {S22.status.map((t, i) => (
              <AgentLine key={t} text={t} on={status >= i || b >= 8} done={status > i || b >= 8} size={23} />
            ))}
            <AgentLine text={S22.done} on={b >= 8} done size={24} />
          </div>
        </div>
      </div>

      <Pointer path={ROUTE} play={s.is("edit") && b >= 2 && b < 8} done={false} />
      </TrackBody>
    </div>
  );
}
