"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { S05, S06 } from "../content/copy";
import { MEDIA } from "../media/media";
import { D, EASE, MONO } from "../theme";
import { useBeats, useClock } from "../kit/beats";
import { Show } from "../kit/Show";
import { PlaceholderTag, TITLE } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";
import { useRasterFrames } from "./compare/sample";
import { CODE_PANEL_X, CodeWindow, Flow, IMG_PANEL_X, MAIN, PANEL, PanelBox, PanelHead, SIDE, SampleDesign, motionCss, type CodeLine } from "./compare/parts";
import { varsAfter } from "./S05ImageVsCode";

export const steps: StepDef[] = [
  { key: "same", label: "العنصران كما في السلايد السابق" },
  { key: "question", label: "السؤال: إنفوجرافيك متحرك؟" },
  { key: "retitle", label: "عنوان البطاقة اليمنى: Image يُشطب ويطلع، وVideo يدخل (Video Generation)" },
  { key: "frames", label: "توليد الصور: إطارات ← مشهد متحرك" },
  { key: "code", label: "الكود: CSS يحرّك العناصر" },
  { key: "result", label: "النتيجة في الطرفين: تبرز آخر خطوة في المسارين" },
  { key: "edit", label: "تعديل في نص الفيديو" },
];

const FRAMES = 6;
const THUMB = 88;
const VARS = varsAfter(3); // the design exactly as slide 05 left it
const DUR = { before: 1.6, after: 0.5 };
const SEGMENT = { from: 600, to: 900 }; // the edited part of the 1800 frames
/** each path's steps sit under the main element; the panel ends a header's distance below them (no player bar) */
const FLOW_Y = PANEL.y + MAIN.dy + MAIN.s + 24;
const FLOW_H = 39; // one row of step badges
const PANEL_H = FLOW_Y + FLOW_H + 56 - PANEL.y;

/**
 * Step «retitle», played once each time the step is entered (ms):
 *   0–250     a bold, high-contrast strike draws across the middle of «Image» (the word stays still, facing the room)
 *   250–750   the struck word holds, so the room sees the strike
 *   750–1200  «Image» and its strike rise straight up (translateY only: no rotation, no perspective), still
 *             readable, and fade only at the end of the rise
 *   1200–1680 «Video» comes in from below, as before
 */
const SWAP = { strike: 250, outAt: 750, out: 450, inAt: 1200, in: 480 }; // ms
const SWAP_CSS = `
@keyframes s06-strike { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes s06-out { 0% { transform: translateY(0); opacity: 1; } 65% { opacity: 1; } 100% { transform: translateY(-115%); opacity: 0; } }
@keyframes s06-in { from { transform: translateY(90%) rotateX(-80deg); opacity: 0; } to { transform: translateY(0) rotateX(0deg); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .s06-anim { animation-duration: 1ms !important; animation-delay: 0ms !important; } }
`;

/**
 * The right card's heading. Only its first word changes. That word sits in a slot whose right edge touches
 * «Generation»; the heading is anchored on the right of its row (RTL), so «Generation» never moves.
 * "swap" mounts fresh on every entry to the step, so the motion plays once each time; "image"/"video" are still.
 */
function ImageHeading({ phase }: { phase: "image" | "swap" | "video" }) {
  const H = S06.heading;
  return (
    <>
      <span className="relative inline-block whitespace-nowrap" style={{ perspective: 500 }}>
        <span className="invisible">{phase === "image" ? H.from : H.to}</span>
        {phase === "image" && <span className="absolute right-0 top-0">{H.from}</span>}
        {phase === "video" && <span className="absolute right-0 top-0">{H.to}</span>}
        {phase === "swap" && (
          <>
            <span className="s06-anim absolute right-0 top-0" style={{ animation: `s06-out ${SWAP.out}ms ease-in-out ${SWAP.outAt}ms both` }}>
              {H.from}
              {/* across the word only, through the middle of its lowercase letters; orange so it stands out on the blue */}
              <span
                aria-hidden
                className="s06-anim absolute inset-x-0 h-[6px] rounded-full"
                style={{ top: "calc(56% - 3px)", background: D.agent, boxShadow: "0 0 0 1.5px rgba(5,8,13,.6)", transformOrigin: "left center", animation: `s06-strike ${SWAP.strike}ms linear both` }}
              />
            </span>
            <span className="s06-anim absolute right-0 top-0" style={{ transformOrigin: "50% 0%", backfaceVisibility: "hidden", animation: `s06-in ${SWAP.in}ms ${EASE} ${SWAP.inAt}ms both` }}>
              {H.to}
            </span>
          </>
        )}
      </span>{" "}
      {H.rest}
    </>
  );
}

function codeLines(dur: number, shown: number): CodeLine[] {
  const all: CodeLine[] = [
    { pre: ".sun   { animation: rise; }" },
    { pre: ".line  { animation: grow; }" },
    { pre: ".title { animation: fade; }" },
    { pre: ".card * {" },
    { pre: "  animation-duration: ", value: `${dur}s`, post: ";" },
    { pre: "}" },
  ];
  return all.slice(0, shown);
}

/** 60 seconds at 30fps: 1800 cells. The edited segment is re-made; the rest stays. */
function FrameGrid({ on, regen }: { on: boolean; regen: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const cols = 60;
    const cell = cv.width / cols;
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const p = regen ? Math.min(1, (now - t0) / 2600) : 0;
      const head = SEGMENT.from + Math.floor(p * (SEGMENT.to - SEGMENT.from));
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < 1800; i++) {
        const inSeg = i >= SEGMENT.from && i < SEGMENT.to;
        ctx.fillStyle = !inSeg ? "rgba(165,216,255,.3)" : !regen ? "rgba(255,178,94,.5)" : i < head ? D.agent : Math.random() < 0.25 ? "rgba(255,178,94,.85)" : "rgba(255,178,94,.25)";
        ctx.fillRect((i % cols) * cell + 0.6, Math.floor(i / cols) * cell + 0.6, cell - 1.2, cell - 1.2);
      }
      if (regen && p < 1) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [on, regen]);
  return <canvas ref={ref} width={288} height={144} style={{ width: 288, height: 144 }} />;
}

export default function S06Motion({ step, dev }: SlideProps) {
  const s = stepper(steps, step);
  const frames = useRasterFrames(FRAMES);
  const fr = useBeats(step, s.idx("frames"), [100, 500, 900, 1300, 1700, 2100, 2800]);
  const cd = useBeats(step, s.idx("code"), [100, 500, 900, 1300, 1700, 2100, 2700]);
  const ed = useBeats(step, s.idx("edit"), [100, 1400, 2800]);
  const playing = fr >= 7;
  const clock = useClock(playing, 12);
  // ping-pong through the stills, like a short clip
  const k = Math.floor(clock / 140) % (FRAMES * 2 - 2);
  const scene = playing ? (k < FRAMES ? k : FRAMES * 2 - 2 - k) : FRAMES - 1;
  const dur = ed >= 2 ? DUR.after : DUR.before;
  const moving = cd >= 7;
  const regen = s.is("edit") && ed >= 1 && ed < 3;

  const ix = IMG_PANEL_X + MAIN.dx;
  const iy = PANEL.y + MAIN.dy;
  const side = { x: IMG_PANEL_X + SIDE.dx, y: PANEL.y + SIDE.dy };

  return (
    <div className="absolute inset-0">
      <style>{motionCss() + SWAP_CSS}</style>

      {/* the questions: in the heading's place, centred like every slide title */}
      <div className="absolute inset-x-[110px] h-[110px]" style={{ top: TITLE.top }}>
        <Show on={s.at("question") && !s.at("edit")} from="up" className="absolute inset-x-0 top-0 text-center">
          <h1 className="m-0 text-[60px] font-black leading-[1.2]" style={{ color: D.mist }}>
            {S06.question}
          </h1>
        </Show>
        <Show on={s.at("edit")} from="up" className="absolute inset-x-0 top-0 text-center">
          <h1 className="m-0 text-[60px] font-black leading-[1.2]" style={{ color: D.agentSoft }}>
            {S06.edit}
          </h1>
        </Show>
      </div>

      {/* ---------- Image Generation ---------- */}
      <PanelBox x={IMG_PANEL_X} h={PANEL_H} glow={s.is("frames") || regen ? `${D.sky}88` : undefined} />
      <PanelHead
        x={IMG_PANEL_X}
        name={s.at("retitle") ? `${S06.heading.to} ${S06.heading.rest}` : S05.image.name}
        sub={S05.image.sub}
        color={D.sky}
        title={<ImageHeading phase={s.is("retitle") ? "swap" : s.at("retitle") ? "video" : "image"} />}
      />
      <div className="absolute overflow-hidden rounded-[16px]" style={{ left: ix, top: iy, width: MAIN.s, height: MAIN.s, background: D.panel2 }}>
        {frames[scene] && <img src={frames[scene]} alt={S05.image.caption} className="absolute inset-0 h-full w-full" draggable={false} />}
        {regen && <div className="absolute inset-x-0 h-1/3" style={{ background: "linear-gradient(transparent, rgba(255,178,94,.35), transparent)", animation: "deck-scan 1.3s linear infinite" }} />}
        {playing && (
          <span dir="ltr" className="absolute bottom-[12px] left-[12px] rounded-[8px] px-[10px] py-[5px] text-[16px] font-bold leading-none" style={{ background: "rgba(5,8,13,.75)", color: D.sky, fontFamily: MONO }}>
            frame {String(scene + 1).padStart(2, "0")}
          </span>
        )}
        <PlaceholderTag dev={dev && !MEDIA.s05Image.src} label="s06-video" />
      </div>
      {/* the stills, one by one */}
      <div className="absolute grid grid-cols-3 gap-[12px]" style={{ left: side.x, top: side.y }}>
        {Array.from({ length: FRAMES }, (_, i) => (
          <div key={i} className="relative overflow-hidden rounded-[10px]" style={{ width: THUMB, height: THUMB, opacity: fr > i ? 1 : 0, transform: fr > i ? "none" : "translateY(16px) scale(.9)", transition: `all .45s ${EASE}`, outline: playing && scene === i ? `3px solid ${D.agent}` : `1.5px solid ${D.line}`, filter: regen && i >= 2 && i <= 3 ? "saturate(.3) brightness(1.3)" : "none" }}>
            {frames[i] && <img src={frames[i]} alt="" className="h-full w-full" draggable={false} />}
            <span dir="ltr" className="absolute bottom-[4px] left-[6px] text-[13px] font-bold" style={{ color: D.paper, fontFamily: MONO, textShadow: "0 1px 3px #000" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
      {/* 1800 frames, and the part being made again */}
      <Show on={s.at("edit")} from="up" className="absolute" style={{ left: side.x, top: side.y + 2 * THUMB + 40, width: 288 }}>
        <p dir="rtl" className="m-0 mb-[10px] text-[20px] font-bold" style={{ color: D.sky }}>
          <bdi>{S06.frames.duration}</bdi> × <bdi dir="ltr">{S06.frames.fps}</bdi> = <bdi>{S06.frames.total}</bdi>
        </p>
        <FrameGrid on={s.at("edit")} regen={regen || ed >= 3} />
        <span className="mt-[10px] inline-block rounded-full px-[14px] py-[6px] text-[18px] font-bold" style={{ background: "rgba(255,122,0,.16)", color: D.agentSoft }}>
          {S06.regen}
        </span>
      </Show>
      <Flow items={S06.image.flow} color={D.sky} on={fr >= 1} lit={s.at("result") ? 2 : -1} style={{ right: 1920 - IMG_PANEL_X - PANEL.w + 40, top: FLOW_Y }} />

      {/* ---------- Code-based Design ---------- */}
      <PanelBox x={CODE_PANEL_X} h={PANEL_H} glow={s.is("code") || (s.is("edit") && ed >= 1) ? `${D.agent}88` : undefined} />
      <PanelHead x={CODE_PANEL_X} name={S05.code.name} sub={S05.code.sub} color={D.agent} />
      <SampleDesign build={5} vars={VARS} motion={moving ? { dur, ease: "ease-in-out", key: dur } : null} style={{ left: CODE_PANEL_X + MAIN.dx, top: iy }} />
      <PlaceholderTag dev={dev} label="s06-design" style={{ left: CODE_PANEL_X + MAIN.dx + 14, top: iy + 14 }} />
      <Show on={cd >= 1} from="end" className="absolute" style={{ left: CODE_PANEL_X + 24, top: PANEL.y + SIDE.dy }}>
        <CodeWindow file="motion.css" width={322} fontSize={16} lines={codeLines(dur, Math.min(6, cd))} glow={(s.is("code") && cd < 7) || (s.is("edit") && ed >= 1 && ed < 3)} style={{ left: 0, top: 0 }} />
      </Show>
      <Flow items={S06.code.flow} color={D.agent} on={cd >= 1} lit={s.at("result") ? 2 : -1} style={{ right: 1920 - CODE_PANEL_X - PANEL.w + 40, top: FLOW_Y }} />
    </div>
  );
}
