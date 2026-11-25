"use client";

import { Plug01Icon } from "@hugeicons/core-free-icons";
import { S12 } from "../content/copy";
import { BrandMark } from "../media/brands";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer } from "../kit/Sketch";
import { Icon, SlideTitle } from "../kit/ui";
import { Pointer, type Waypoint } from "../kit/Pointer";
import { FigmaMock, MiniFolder, Selected } from "../kit/FigmaMock";
import { WamdaActor, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان" },
  { key: "nodes", label: "الوكيل في المنتصف، Skill يمين، Figma MCP يسار" },
  { key: "links", label: "خطان من Skill ومن Figma MCP إلى الوكيل" },
  { key: "build", label: "نافذة Figma ومؤشر الوكيل يبني Button · Card · Input" },
];

const WIN = { x: 260, y: 600, w: 1400, h: 520 };
const ROW_Y = 330;
// components, in window coordinates
const BTN = { x: 700, y: 120, w: 230, h: 76 };
const CARD = { x: 300, y: 110, w: 340, h: 290 };
const INPUT = { x: 700, y: 236, w: 380, h: 76 };
const centre = (r: { x: number; y: number; w: number; h: number }) => ({ x: WIN.x + r.x + r.w * 0.55, y: WIN.y + r.y + r.h * 0.6 });

const POINTER_IN = 800;
const ROUTE: Waypoint[] = [
  { x: 1760, y: 640, at: 0 },
  { ...centre(BTN), at: 900, click: true },
  { ...centre(CARD), at: 1900, click: true },
  { ...centre(INPUT), at: 2900, click: true },
  { x: WIN.x + INPUT.x + INPUT.w + 90, y: WIN.y + INPUT.y + 150, at: 3500 },
];
const MADE = ROUTE.filter((r) => r.click).map((r) => POINTER_IN + r.at + 60);

export default function S12FigmaSkills({ step }: SlideProps) {
  const s = stepper(steps, step);
  const b = useBeats(step, s.idx("build"), [60, POINTER_IN, ...MADE, POINTER_IN + 3600]);
  const up = s.at("build");
  const made = Math.max(0, b - 2); // 0..3 components on the canvas
  const sel = b >= 6 ? -1 : made - 1; // the one just made stays selected
  const pop = (on: boolean) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "scale(.7)", transition: `opacity .3s ease, transform .5s cubic-bezier(.3,1.5,.5,1)` });

  return (
    <div className="absolute inset-0">
      <SlideTitle latin>
        {S12.title}
      </SlideTitle>

      {/* the row: Figma MCP · agent · Skill (RTL: Skill on the right) */}
      <div className="absolute" style={{ left: 960 - 130, top: ROW_Y - 150, transform: up ? "scale(.9)" : "none", transformOrigin: "top center", transition: `transform .6s ${EASE}` }}>
        <Show on={s.at("nodes")} from="up" className="flex flex-col items-center gap-[10px]">
          <WamdaActor look={lookFor(12)} act={up && made < 3 ? "thinking" : "idle"} scale={3.6} glow={s.at("links")} />
          <span dir="ltr" className="text-[34px] font-black" style={{ color: D.agent }}>
            {S12.agent}
          </span>
        </Show>
      </div>
      <Show on={s.at("nodes")} from="start" delay={150} className="absolute flex flex-col items-center gap-[16px]" style={{ left: 1460 - 120, top: ROW_Y - 110 }}>
        <MiniFolder label={S12.skill} w={240} />
      </Show>
      <Show on={s.at("nodes")} from="end" delay={300} className="absolute flex flex-col items-center gap-[16px]" style={{ left: 460 - 120, top: ROW_Y - 110 }}>
        <div className="relative flex h-[178px] w-[240px] items-center justify-center rounded-[26px]" style={{ background: D.panel, border: `1.5px solid ${D.lineStrong}` }}>
          <BrandMark id="figma" size={110} />
          <span className="absolute -bottom-[18px] -right-[18px] flex h-[60px] w-[60px] items-center justify-center rounded-full" style={{ background: D.agent }}>
            <Icon icon={Plug01Icon} size={32} color={D.agentInk} stroke={2} />
          </span>
        </div>
        <span dir="ltr" className="mt-[10px] text-[34px] font-black" style={{ color: D.mist, fontFamily: MONO }}>
          {S12.mcp}
        </span>
      </Show>

      <SketchLayer>
        <Arrow from={[1330, ROW_Y - 10]} to={[1120, ROW_Y - 20]} bend={-24} color={D.agent} width={5} draw={s.at("links")} seed={2} />
        <Arrow from={[590, ROW_Y - 10]} to={[800, ROW_Y - 20]} bend={24} color={D.agent} width={5} draw={s.at("links")} delay={350} seed={5} />
      </SketchLayer>

      {/* half a Figma window, and the agent working in it */}
      <div className="absolute inset-0" style={{ transform: up ? "none" : "translateY(560px)", opacity: up ? 1 : 0, transition: `transform .8s ${EASE}, opacity .4s ease` }}>
        <FigmaMock
          x={WIN.x}
          y={WIN.y}
          w={WIN.w}
          h={WIN.h}
          file="workshop.fig"
          sim={S12.sim}
          layers={[
            { name: "Button", on: made >= 1, active: sel === 0 },
            { name: "Card", on: made >= 2, active: sel === 1 },
            { name: "Input", on: made >= 3, active: sel === 2 },
          ]}
          props={
            made > 0 && (
              <div dir="ltr" className="flex flex-col gap-[14px] p-[18px] text-[16px]" style={{ color: "#bdbdbd", fontFamily: MONO }}>
                <span className="font-bold text-[#e6e6e6]">{["Button", "Card", "Input"][Math.min(2, made - 1)]}</span>
                <span className="flex items-center gap-[10px]">
                  <span className="h-[22px] w-[22px] rounded-[5px]" style={{ background: [D.agent, D.paper, "transparent"][Math.min(2, made - 1)], border: "1px solid #5a5a5a" }} />
                  Fill
                </span>
                <span>Radius {[38, 18, 14][Math.min(2, made - 1)]}</span>
                <span>Auto layout</span>
              </div>
            )
          }
        >
          {/* Card */}
          <div className="absolute" style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, ...pop(made >= 2), transformOrigin: "top left" }}>
            <div className="h-full overflow-hidden rounded-[18px]" style={{ background: D.paper }}>
              <div className="h-[130px]" style={{ background: `linear-gradient(135deg, ${D.cobalt}, ${D.azure})` }} />
              <div className="flex flex-col gap-[12px] p-[20px]">
                <span className="h-[18px] w-[70%] rounded-full" style={{ background: D.ink }} />
                <span className="h-[10px] w-[90%] rounded-full" style={{ background: "#c6d3e6" }} />
                <span className="h-[10px] w-[60%] rounded-full" style={{ background: "#c6d3e6" }} />
              </div>
            </div>
            <Selected on={sel === 1} />
          </div>
          {/* Button */}
          <div className="absolute" style={{ left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, ...pop(made >= 1) }}>
            <div className="flex h-full items-center justify-center rounded-full text-[32px] font-black" style={{ background: D.agent, color: D.agentInk }}>
              {S12.ui.button}
            </div>
            <Selected on={sel === 0} />
          </div>
          {/* Input */}
          <div className="absolute" style={{ left: INPUT.x, top: INPUT.y, width: INPUT.w, height: INPUT.h, ...pop(made >= 3) }}>
            <div className="flex h-full items-center rounded-[14px] px-[22px] text-[26px]" style={{ border: `2px solid ${D.sky}`, color: "#8a8a8a" }}>
              {S12.ui.input}
            </div>
            <Selected on={sel === 2} />
          </div>
        </FigmaMock>
      </div>
      <Pointer path={ROUTE} play={s.is("build") && b >= 2} done={false} />
    </div>
  );
}
