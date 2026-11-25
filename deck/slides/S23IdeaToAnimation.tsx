"use client";

import { BulbIcon, Image01Icon, Link01Icon, PlayIcon, TextIcon } from "@hugeicons/core-free-icons";
import { S23, TRACK } from "../content/copy";
import { D, EASE } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer } from "../kit/Sketch";
import { Icon, SlideTitle } from "../kit/ui";
import { FlowRail, TrackBody, type FlowState } from "../kit/Sim";
import { WamdaActor, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان ومسار الـWorkflow" },
  { key: "flow", label: "نقرة واحدة: الفكرة والمراجع ← الوكيل ← المشاهد ← الحركة والصوت ← الفيديو" },
];

const RAIL = { x: 160, y: 196, w: 1600 };
/** columns, right to left */
/** the idea card (a little wider and lower than before, 2026-11-24); it grows to the left, its right edge stays */
const IDEA = { x: 1520, y: 430, w: 340, mid: 100 };
/** the three reference tiles under it, as wide together as the card: text, image, link (right to left) */
const REF = { w: 100, h: 84, gap: 20, icon: 40 };
const REF_ICONS = [TextIcon, Image01Icon, Link01Icon];
const AGENT = { x: 1330, y: 420 };
/** the finished video (16:9); its middle is the flow's line: the storyboard frames and both arrows sit on it */
const VIDEO = { x: 110, y: 410, w: 410, h: 232 };
const MID = VIDEO.y + VIDEO.h / 2;
/** storyboard: three frames of one size on one row, centred between the video and the agent */
const SCN = { w: 160, h: 100, gap: 22 };
const SCN_W = 3 * SCN.w + 2 * SCN.gap;
const SCN_X = Math.round((VIDEO.x + VIDEO.w + AGENT.x - 108) / 2 - SCN_W / 2);
const SCN_Y = MID - SCN.h / 2;
/** «مشهد n» over each frame, «Storyboard» over the group */
const LABEL = { size: 24, gap: 12 };
const LABEL_Y = SCN_Y - LABEL.gap - Math.round(LABEL.size * 1.25);
const BOARD = { size: 32, gap: 14 };
const BOARD_Y = LABEL_Y - BOARD.gap - Math.round(BOARD.size * 1.25);
/** frame 0 («مشهد 1») is the rightmost: the row reads right to left */
const sceneX = (i: number) => SCN_X + (2 - i) * (SCN.w + SCN.gap);

// one click, these beats (ms)
const B = { idea: 100, toAgent: 1000, scenes: 1800, motion: 2900, video: 3900, closing: 4900 };

/**
 * What each storyboard frame shows. Everything is placed relative to the frame, with an inset, so nothing touches
 * or crosses its edge. Before motion each frame already shows its layout (a faint path or placeholder lines);
 * with motion the parts move into place.
 */
function SceneArt({ i, moving }: { i: number; moving: boolean }) {
  const pad = 16;
  if (i === 0) {
    const ball = 28;
    return (
      <>
        <span className="absolute h-[2px] rounded-full" style={{ left: pad, right: pad, top: "50%", background: D.lineStrong }} />
        <span
          className="absolute rounded-full"
          style={{ width: ball, height: ball, top: `calc(50% - ${ball / 2}px)`, left: moving ? `calc(100% - ${pad + ball}px)` : pad, background: D.agent, transition: `left 1.6s ${EASE}` }}
        />
      </>
    );
  }
  if (i === 1)
    return (
      <span className="absolute flex items-end justify-center gap-[10px]" style={{ left: pad, right: pad, top: pad, bottom: 14 }}>
        {[0.55, 0.85, 0.4, 1].map((f, k) => (
          <span key={k} className="w-[18px] rounded-t-[4px]" style={{ height: moving ? `${f * 100}%` : 6, background: D.sky, transition: `height .9s ${EASE} ${k * 120}ms` }} />
        ))}
      </span>
    );
  return (
    <span dir="rtl" className="absolute flex flex-col items-start gap-[12px]" style={{ left: pad, right: pad, top: "50%", transform: "translateY(-50%)" }}>
      {[
        { h: 14, w: "82%", c: D.paper },
        { h: 10, w: "56%", c: D.mist },
      ].map((l, k) => (
        <span key={k} className="relative block w-full" style={{ height: l.h }}>
          <span className="absolute inset-y-0 right-0 rounded-full" style={{ width: l.w, background: D.lineStrong }} />
          <span className="absolute inset-y-0 right-0 rounded-full" style={{ width: moving ? l.w : "0%", background: l.c, transition: `width 1s ${EASE} ${k * 0.2}s` }} />
        </span>
      ))}
    </span>
  );
}

/**
 * The finished video's frame: the three scenes' parts put together around the edges (the title at the top, the
 * chart bottom right, the ball bottom left), so the middle stays clear for the play button.
 */
function FinalFrame() {
  return (
    <>
      <span dir="rtl" className="absolute right-[26px] top-[24px] flex w-[46%] flex-col items-start gap-[10px]">
        <span className="h-[12px] w-full rounded-full" style={{ background: D.paper }} />
        <span className="h-[9px] w-[62%] rounded-full" style={{ background: D.mist }} />
      </span>
      <span className="absolute bottom-[44px] right-[26px] flex h-[58px] items-end gap-[8px]">
        {[0.55, 0.85, 0.4, 1].map((f, k) => (
          <span key={k} className="w-[14px] rounded-t-[3px]" style={{ height: `${f * 100}%`, background: D.sky }} />
        ))}
      </span>
      <span className="absolute bottom-[50px] left-[28px] h-[2px] w-[96px] rounded-full" style={{ background: D.lineStrong }} />
      <span className="absolute bottom-[40px] left-[90px] h-[22px] w-[22px] rounded-full" style={{ background: D.agent }} />
    </>
  );
}

/**
 * From an idea and references to a finished animation, in one click: the idea and its references travel to the
 * agent; it lays out a storyboard of three scenes; motion and sound come in; the scenes come together in one
 * video. No specific infographic example here (the full example is slide 26).
 */
export default function S23IdeaToAnimation({ step }: SlideProps) {
  const s = stepper(steps, step);
  const b = useBeats(step, s.idx("flow"), [B.idea, B.toAgent, B.scenes, B.motion, B.video, B.closing]);
  const now = !s.at("flow") ? -1 : b >= 6 ? 5 : b - 1 < 0 ? 0 : Math.min(4, b - 1);
  const state = (i: number): FlowState => (i < now ? "done" : i === now ? "now" : "todo");
  const sent = b >= 2;
  const scenes = b >= 3;
  const moving = b >= 4;
  const inVideo = b >= 5;

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S23.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
      <FlowRail items={S23.flow.map((label) => ({ label }))} state={state} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={74} gap={40} size={24} />

      {/* the idea and its references */}
      <div className="absolute" style={{ left: IDEA.x, top: IDEA.y }}>
        <Show on={b >= 1} from="start" className="flex flex-col gap-[22px]">
          <div className="flex flex-col gap-[14px] rounded-[24px] px-[26px] py-[22px]" style={{ width: IDEA.w, background: D.panel, border: `2px solid ${D.sky}` }}>
            <div className="flex items-center gap-[18px]">
              <Icon icon={BulbIcon} size={46} color={D.sky} stroke={1.7} />
              <span className="text-[32px] font-black" style={{ color: D.paper }}>
                {S23.idea}
              </span>
            </div>
            <p className="m-0 text-[22px] font-medium leading-[1.5]" style={{ color: D.mist }}>
              {S23.ideaNote}
            </p>
          </div>
          <div className="flex" style={{ gap: REF.gap }}>
            {REF_ICONS.map((icon, i) => (
              <span
                key={i}
                role="img"
                aria-label={S23.refKinds[i]}
                className="flex items-center justify-center rounded-[14px]"
                style={{ width: REF.w, height: REF.h, background: D.panel2, border: `1.5px solid ${D.lineStrong}` }}
              >
                <Icon icon={icon} size={REF.icon} color={D.sky} stroke={1.8} />
              </span>
            ))}
          </div>
          <span className="text-[26px] font-bold" style={{ color: D.sky }}>
            {S23.refs}
          </span>
        </Show>
      </div>

      {/* the agent */}
      <Show on={b >= 1} from="up" delay={200} className="absolute flex flex-col items-center gap-[10px]" style={{ left: AGENT.x - 108, top: AGENT.y - 20 }}>
        <WamdaActor look={lookFor(23)} act={sent && !inVideo ? "thinking" : "idle"} scale={3} glow={sent} />
        <span className="text-[32px] font-black" style={{ color: D.agent }}>
          {S23.agent}
        </span>
      </Show>

      {/* the storyboard: its name over the group, a label over each frame, then motion and sound */}
      <Show on={scenes} from="fade" dur={500} className="absolute text-center" style={{ left: SCN_X, top: BOARD_Y, width: SCN_W }}>
        <span dir="ltr" className="font-black leading-[1.25]" style={{ fontSize: BOARD.size, color: D.paper }}>
          {S23.storyboard}
        </span>
      </Show>
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <span
            className="absolute text-center font-bold leading-[1.25]"
            style={{
              left: sceneX(i),
              top: LABEL_Y,
              width: SCN.w,
              fontSize: LABEL.size,
              color: D.mist,
              opacity: scenes ? 1 : 0,
              transition: `opacity .4s ease ${scenes ? i * 250 : 0}ms`,
            }}
          >
            {S23.scenes[i]}
          </span>
          <div
            className="absolute overflow-hidden rounded-[14px]"
            style={{
              left: sceneX(i),
              top: SCN_Y,
              width: SCN.w,
              height: SCN.h,
              background: D.panel3,
              border: `2px solid ${moving ? D.agent : D.lineStrong}`,
              opacity: scenes ? 1 : 0,
              transform: scenes ? "none" : "translateX(60px) scale(.8)",
              transition: `opacity .4s ease ${i * 250}ms, transform .6s ${EASE} ${i * 250}ms, border-color .4s`,
            }}
          >
            <SceneArt i={i} moving={moving} />
          </div>
        </div>
      ))}
      <div className="absolute flex items-center gap-[5px]" style={{ left: SCN_X, top: SCN_Y + SCN.h + 28, width: SCN_W, height: 60, opacity: moving ? 1 : 0, transition: "opacity .5s" }}>
        {Array.from({ length: 70 }, (_, k) => (
          <span key={k} className="flex-1 rounded-full" style={{ height: 8 + Math.abs(Math.sin(k * 0.55) * Math.cos(k * 0.21)) * 50, background: D.sky, opacity: 0.7 }} />
        ))}
      </div>

      {/* the finished video: its frame, the play button in the exact middle, the progress bar */}
      <Show on={inVideo} from="scale" className="absolute overflow-hidden rounded-[20px]" style={{ left: VIDEO.x, top: VIDEO.y, width: VIDEO.w, height: VIDEO.h, background: `linear-gradient(135deg, ${D.panel3}, #000)`, border: `2px solid ${D.agent}`, boxShadow: `0 0 50px ${D.agent}33` }}>
        <FinalFrame />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,.94)", boxShadow: "0 8px 26px rgba(0,0,0,.5)" }}>
            {/* the triangle's box is centred; a play mark reads centred when it sits slightly toward its point */}
            <span className="flex" style={{ transform: "translateX(2px)" }}>
              <Icon icon={PlayIcon} size={38} color={D.ink} stroke={2.2} />
            </span>
          </span>
        </span>
        <span className="absolute bottom-[18px] left-[20px] right-[20px] h-[6px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.2)" }}>
          <span className="block h-full" style={{ width: inVideo ? "100%" : "0%", background: D.agent, transition: "width 3.2s linear .6s" }} />
        </span>
      </Show>

      <SketchLayer>
        <Arrow from={[IDEA.x - 14, IDEA.y + IDEA.mid]} to={[AGENT.x + 118, AGENT.y + 100]} color={D.sky} width={4} draw={b >= 2} seed={2} />
        <Arrow from={[AGENT.x - 118, MID]} to={[SCN_X + SCN_W + 14, MID]} color={D.agent} width={4} draw={b >= 3} seed={5} />
        <Arrow from={[SCN_X - 14, MID]} to={[VIDEO.x + VIDEO.w + 16, MID]} color={D.agent} width={4} draw={b >= 5} seed={8} />
      </SketchLayer>

      <Show on={b >= 6} from="up" className="absolute inset-x-0 text-center text-[44px] font-black" style={{ top: 860, color: D.mist }}>
        {S23.closing}
      </Show>
      </TrackBody>
    </div>
  );
}
