"use client";

/* eslint-disable @next/next/no-img-element */
import { S28, TRACK } from "../content/copy";
import { MEDIA } from "../media/media";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { SketchLayer, Stroke, sketchArrowHead, sketchLine } from "../kit/Sketch";
import { SlideTitle } from "../kit/ui";
import { AgentLine, AppWindow, AskBubble, FlowRail, TrackBody, type FlowState } from "../kit/Sim";
import { WatchModel } from "../kit/lazy3d";
import { stepper, type SlideProps, type StepDef } from "../types";
import { asset } from "@/lib/asset";

export const steps: StepDef[] = [
  { key: "ref", label: "شعار Blender وBlender MCP، وملاحظة فيديو الربط" },
  { key: "sheet", label: "Product Sheet الساعة من عدة زوايا" },
  { key: "claude", label: "المرجع ينتقل إلى Claude، ويظهر الاتصال بـBlender MCP" },
  { key: "blender", label: "نافذة Blender: الشكل الأساسي ← التفاصيل ← الخامات ← المجسم النهائي" },
  { key: "final", label: "المجسم النهائي يدور، ومعه رندر Cycles من المشروع" },
];

const RAIL = { x: 160, y: 196, w: 1600 };
/**
 * First click: the tool, in the same block as slide 27's (logo → bold name → smaller note, centred, same sizes and
 * gaps). The path already sits under the title here, so the block is centred in the space under it.
 */
const TOOL = { top: 430, logo: 210, name: 58, note: 28 };
const INTRO = [100, 380, 640]; // logo, name, note
const SHEET = { x: 480, y: 300, w: 960, h: 720 };
const CLAUDE = { x: 1300, y: 300, w: 510, h: 720 };
const SHEET_IN = { x: CLAUDE.x + 30, y: CLAUDE.y + 74, w: 450 };
const NODE = { x: 1185, y: 560 };
const BL = { x: 110, y: 300, w: 990, h: 720 };
const VIEW = { x: BL.x + 60, y: BL.y + 104, w: BL.w - 60 - 250, h: BL.h - 104 - 4 }; // the viewport inside Blender
/** the model canvas renders at the final size and is scaled down inside Blender */
const CANVAS = { w: 1000, h: 750 };
const FINAL = { x: 240, y: 290 };
const RENDER = { x: 1290, y: 290, w: 400 };
const OUTLINER = ["Main_Chassis", "Front_Bezel", "Side_Buttons", "Rear_Cover", "Rear_Sensor", "Upper_Strap", "Lower_Strap"];

/**
 * From a product sheet to a 3D model, with the presenter's real project (Loon Watch V4): the setup video first;
 * then the sheet the model was built from; it goes to Claude, which talks to Blender through Blender MCP; a
 * simulated Blender window shows the model taking shape in four illustrative phases (the model itself is the
 * project's own geometry, exported from its .blend); last, the finished model turns, next to the project's own
 * Cycles render.
 */
export default function S28Watch3D({ step }: SlideProps) {
  const s = stepper(steps, step);
  const intro = useBeats(step, s.idx("ref"), INTRO);
  const c = useBeats(step, s.idx("claude"), [100, 900, 1600]);
  const p = useBeats(step, s.idx("blender"), [100, 900, 2300, 3700, 5100]);
  const phase = s.at("final") ? 4 : s.is("blender") ? Math.max(0, p - 1) : 0;
  const inBlender = s.is("blender");
  const final = s.at("final");
  const now = s.idx("ref") === step ? -1 : Math.min(4, step);
  const state = (i: number): FlowState => (now < 0 ? "todo" : i < now ? "done" : i === now ? "now" : "todo");
  const sheetSmall = s.at("claude");
  const k = SHEET_IN.w / SHEET.w;
  const vScale = Math.min(VIEW.w / CANVAS.w, VIEW.h / CANVAS.h);

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S28.sub}>{TRACK.d3}</SlideTitle>
      <TrackBody>
      <FlowRail items={S28.flow} state={state} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={74} gap={40} size={23} />

      {/* the tool first: the Blender logo, Blender MCP, and a note about the setup video (no link); it leaves on the next click */}
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: TOOL.top, opacity: s.is("ref") ? 1 : 0, transform: s.is("ref") ? "none" : "translateY(-30px)", transition: `opacity .4s ease, transform .6s ${EASE}`, pointerEvents: "none" }}>
        <Show on={intro >= 1} from="scale" dur={700}>
          <img src={asset("/deck/logos/mcp/blender.png")} alt="Blender" width={TOOL.logo} height={TOOL.logo} draggable={false} style={{ width: TOOL.logo, height: TOOL.logo, objectFit: "contain" }} />
        </Show>
        <Show on={intro >= 2} from="up" className="mt-[26px]">
          <span dir="ltr" className="block font-black leading-[1.1]" style={{ fontSize: TOOL.name, color: D.paper }}>
            {S28.tool.name}
          </span>
        </Show>
        <Show on={intro >= 3} from="up" className="mt-[14px]">
          <p dir="rtl" className="m-0 text-center font-medium leading-[1.4]" style={{ fontSize: TOOL.note, color: D.mist }}>
            {S28.tool.note}
          </p>
        </Show>
      </div>

      {/* Claude, with the request and the sheet as its input */}
      <Show on={sheetSmall && !final} from="start" className="absolute flex flex-col gap-[16px] rounded-[26px] p-[26px]" style={{ left: CLAUDE.x, top: CLAUDE.y, width: CLAUDE.w, height: CLAUDE.h, background: D.panel, border: `1.5px solid ${D.lineStrong}` }}>
        <span dir="ltr" className="flex items-center justify-end gap-[12px] text-[26px] font-black" style={{ color: D.paper }}>
          Claude
          <img src={asset("/deck/logos/tools/claude.svg")} alt="" width={34} height={34} draggable={false} />
        </span>
        <div style={{ height: (SHEET_IN.w * SHEET.h) / SHEET.w + 6 }} />
        <AskBubble on={c >= 1} size={26} text={S28.ask} />
        <AgentLine on={c >= 2} done={inBlender && p >= 5} text={inBlender ? S28.phases[Math.max(0, Math.min(3, p - 2))] : S28.analyzing} size={23} style={{ marginTop: 10 }} />
      </Show>

      {/* the Product Sheet: big, then into Claude's panel */}
      <div
        className="absolute overflow-hidden rounded-[18px]"
        style={{
          left: SHEET.x,
          top: SHEET.y,
          width: SHEET.w,
          height: SHEET.h,
          transformOrigin: "top left",
          transform: sheetSmall ? `translate(${SHEET_IN.x - SHEET.x}px, ${SHEET_IN.y - SHEET.y}px) scale(${k})` : "none",
          opacity: s.at("sheet") && !final ? 1 : 0,
          border: `2px solid ${D.lineStrong}`,
          boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          transition: `transform .9s ${EASE}, opacity .5s ease`,
        }}
      >
        <img src={MEDIA.s27.sheet} alt="Loon Watch V4 Product Reference Sheet" className="h-full w-full object-cover" draggable={false} />
      </div>
      <Show on={s.is("sheet")} from="up" delay={400} className="absolute inset-x-0 text-center text-[24px] font-bold" style={{ top: SHEET.y + SHEET.h + 6, color: D.dim }}>
        <span dir="ltr">{S28.sheet}</span>
      </Show>

      {/* Blender MCP: the bridge. Just the Blender logo (owner, 2026-11-24: no tile, frame, background or badge); it keeps
          the old tile's 120 px box, so the label, the arrows and the pop-in stay where they were */}
      <Show on={sheetSmall && !final} from="pop" delay={500} className="absolute flex flex-col items-center gap-[10px]" style={{ left: NODE.x - 60, top: NODE.y - 70 }}>
        <span className="flex h-[120px] w-[120px] items-center justify-center">
          <img src={asset("/deck/logos/mcp/blender.png")} alt="Blender" width={112} height={112} style={{ objectFit: "contain" }} draggable={false} />
        </span>
        <span dir="ltr" className="whitespace-nowrap text-[22px] font-black" style={{ color: D.mist }}>
          Blender MCP
        </span>
      </Show>
      <SketchLayer>
        <Stroke d={sketchLine([CLAUDE.x - 8, NODE.y], [NODE.x + 72, NODE.y], 4)} color={D.agent} width={4} draw={sheetSmall && !final && c >= 2} dur={400} />
        <Stroke d={sketchArrowHead([NODE.x + 72, NODE.y], Math.PI, 18, 4)} color={D.agent} width={4} draw={sheetSmall && !final && c >= 2} delay={380} dur={200} />
        <Stroke d={sketchLine([NODE.x - 72, NODE.y], [BL.x + BL.w + 6, NODE.y], 7)} color={D.agent} width={4} draw={sheetSmall && !final && c >= 3} dur={300} dash="3 14" />
      </SketchLayer>

      {/* simulated Blender */}
      <div className="absolute inset-0" style={{ opacity: inBlender ? 1 : 0, transform: inBlender ? "none" : "translateY(50px)", transition: `opacity .5s ease, transform .7s ${EASE}`, pointerEvents: "none" }}>
        <AppWindow x={BL.x} y={BL.y} w={BL.w} h={BL.h} title="Loon_Watch_V4.blend" logo={asset("/deck/logos/mcp/blender.png")} bar="#2b2b2b" body="#1d1d1d" border="#3c3c3c">
          <div dir="ltr" className="absolute inset-x-0 top-0 flex items-center gap-[22px] px-[18px] text-[17px] font-bold" style={{ height: 50, background: "#262626", borderBottom: "1px solid #3c3c3c", color: "#a8a8a8", fontFamily: MONO }}>
            {["Layout", "Modeling", "Shading", "Rendering"].map((t, i) => (
              <span key={t} className="rounded-[6px] px-[10px] py-[4px]" style={{ background: (i === 1 && p < 4) || (i === 2 && p >= 4) ? "#3d5a80" : "transparent", color: "#e0e0e0" }}>
                {t}
              </span>
            ))}
          </div>
          <div className="absolute left-0" style={{ top: 50, bottom: 0, width: 60, background: "#262626", borderRight: "1px solid #3c3c3c" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="mx-auto mt-[14px] block h-[30px] w-[30px] rounded-[6px]" style={{ background: i === 1 ? "#3d5a80" : "#333" }} />
            ))}
          </div>
          <div className="absolute" style={{ top: 50, left: 60, right: 250, bottom: 0, background: "radial-gradient(ellipse at 50% 45%, #474747, #2f2f2f 75%)" }}>
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          </div>
          <div dir="ltr" className="absolute right-0" style={{ top: 50, bottom: 0, width: 250, background: "#262626", borderLeft: "1px solid #3c3c3c", padding: "14px 12px", fontFamily: MONO, fontSize: 16, color: "#cfcfcf" }}>
            <p className="m-0 mb-[10px] font-bold" style={{ color: "#8f8f8f" }}>
              Outliner
            </p>
            {OUTLINER.map((n, i) => {
              const on = (p >= 2 && i < 2) || p >= 3;
              return (
                <p key={n} className="m-0 truncate rounded-[5px] px-[8px] py-[6px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(-8px)", transition: `all .35s ease ${on ? i * 60 : 0}ms`, background: on && p === 3 && i >= 2 ? "rgba(255,122,0,.18)" : "transparent" }}>
                  ▸ {n}
                </p>
              );
            })}
          </div>
        </AppWindow>
        {/* the four phases, read right to left above the viewport */}
        <div className="absolute flex gap-[12px]" style={{ right: 1920 - (VIEW.x + VIEW.w) + 16, top: BL.y + 118 }}>
          {S28.phases.map((t, i) => {
            const st = phase - 1 === i ? "now" : phase - 1 > i ? "done" : "todo";
            return (
              <span key={t} className="rounded-full px-[16px] py-[7px] text-[20px] font-bold" style={{ color: st === "now" ? D.agentInk : st === "done" ? D.sky : "#9a9a9a", background: st === "now" ? D.agent : "rgba(0,0,0,.45)", border: `1.5px solid ${st === "todo" ? "#555" : st === "now" ? D.agent : D.sky}`, transition: "all .3s" }}>
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* the model: inside Blender's viewport, then on its own */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: CANVAS.w,
          height: CANVAS.h,
          transformOrigin: "top left",
          transform: final ? `translate(${FINAL.x}px, ${FINAL.y}px)` : `translate(${VIEW.x + (VIEW.w - CANVAS.w * vScale) / 2}px, ${VIEW.y + 40 + (VIEW.h - CANVAS.h * vScale) / 2}px) scale(${vScale})`,
          opacity: (inBlender && p >= 2) || final ? 1 : 0,
          transition: `transform .9s ${EASE}, opacity .5s ease`,
          pointerEvents: "none",
        }}
      >
        <WatchModel src={MEDIA.s27.model} phase={phase} width={CANVAS.w} height={CANVAS.h} />
      </div>
      <Show on={final} from="up" delay={500} className="absolute text-center text-[26px] font-bold" style={{ left: FINAL.x, width: CANVAS.w, top: FINAL.y + CANVAS.h - 10, color: D.mist }}>
        {S28.model} · <span dir="ltr">Loon Watch V4</span>
      </Show>

      {/* the project's own Cycles render */}
      <Show on={final} from="start" delay={300} className="absolute flex flex-col items-center gap-[12px]" style={{ left: RENDER.x, top: RENDER.y, width: RENDER.w }}>
        <img src={MEDIA.s27.render} alt="Loon Watch V4, Cycles render from the project" className="w-full rounded-[18px]" style={{ border: `1.5px solid ${D.lineStrong}`, boxShadow: "0 30px 80px rgba(0,0,0,.5)", maxHeight: 650, objectFit: "cover" }} draggable={false} />
        <span className="text-[22px] font-bold" style={{ color: D.dim }}>
          {S28.render}
        </span>
      </Show>
      </TrackBody>
    </div>
  );
}
