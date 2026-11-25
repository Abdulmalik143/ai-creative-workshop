"use client";

import { CheckmarkCircle02Icon, Comment01Icon, NoteEditIcon } from "@hugeicons/core-free-icons";
import { S12, S14 } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer, Stroke, sketchLine } from "../kit/Sketch";
import { Icon, SlideTitle } from "../kit/ui";
import { DESIGNER_LABEL, Pointer, type Waypoint } from "../kit/Pointer";
import { FigmaMock, Selected } from "../kit/FigmaMock";
import { WamdaActor, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان" },
  { key: "expertise", label: "خبرة المصمم: التعليمات وطبقات Design Tokens" },
  { key: "handoff", label: "التعليمات تنتقل للوكيل، وتظهر نافذة Figma" },
  { key: "components", label: "الوكيل يبني Button · Input · Card مربوطة بالـTokens" },
  { key: "review", label: "Patterns → Templates → Pages، والمصمم يراجع ويطلب تصحيح" },
  { key: "closing", label: "«الذكاء الاصطناعي يسرّع التنفيذ، وخبرتك تصنع الفرق.»" },
];

// ---------- the designer's side (right) ----------
const RX = 1010;
const RW = 820;
const LAYER_Y = [372, 552, 732];
type Tok = { name: string; ref?: string; swatch?: string };
const PRIMITIVES: Tok[] = [
  { name: "blue-600", swatch: D.cobalt },
  { name: "sky-400", swatch: D.azure },
  { name: "orange-500", swatch: D.agent },
  { name: "white", swatch: D.paper },
  { name: "radius-16" },
  { name: "radius-32" },
];
const SEMANTIC: Tok[] = [
  { name: "color.primary", ref: "blue-600" },
  { name: "color.accent", ref: "orange-500" },
  { name: "color.surface", ref: "white" },
  { name: "radius.control", ref: "radius-16" },
];
const COMPONENT: Tok[] = [
  { name: "button.bg", ref: "color.accent" },
  { name: "input.border", ref: "color.primary" },
  { name: "card.surface", ref: "color.surface" },
];

// ---------- the agent's side (left): a Figma window ----------
const WIN = { x: 90, y: 372, w: 860, h: 600 };
const LAYERS_W = 190;
const BTN = { x: 230, y: 150, w: 210, h: 68 };
const INPUT = { x: 230, y: 266, w: 300, h: 68 };
const CARD = { x: 580, y: 110, w: 240, h: 290 };
const at = (r: { x: number; y: number; w: number; h: number }, fx = 0.55, fy = 0.6) => ({ x: WIN.x + r.x + r.w * fx, y: WIN.y + r.y + r.h * fy });

const ENTER: Waypoint[] = [
  { x: 1000, y: 330, at: 0 },
  { x: WIN.x + 560, y: WIN.y + 470, at: 900 },
];
const BUILD: Waypoint[] = [
  { x: WIN.x + 560, y: WIN.y + 470, at: 0 },
  { ...at(BTN), at: 700, click: true },
  { ...at(INPUT), at: 1600, click: true },
  { ...at(CARD), at: 2500, click: true },
  { x: WIN.x + 560, y: WIN.y + 400, at: 3200 },
];
const REVIEW: Waypoint[] = [
  { x: 1500, y: 1040, at: 0 },
  { ...at(BTN, 0.8, 0.5), at: 1100, click: true },
  { x: WIN.x + BTN.x + BTN.w + 60, y: WIN.y + BTN.y - 40, at: 1600 },
];
const FIX: Waypoint[] = [
  { x: WIN.x + 560, y: WIN.y + 400, at: 0 },
  { ...at(BTN, 0.3, 0.5), at: 900, click: true },
  { x: WIN.x + 600, y: WIN.y + 380, at: 1500 },
];
const BUILD_MADE = BUILD.filter((w) => w.click).map((w) => w.at + 60);

function Chip({ t, on, hot, delay = 0 }: { t: Tok; on: boolean; hot?: boolean; delay?: number }) {
  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-[10px] whitespace-nowrap rounded-[12px] px-[14px] py-[9px] text-[19px] font-bold leading-none"
      style={{
        fontFamily: MONO,
        color: D.mist,
        background: hot ? "rgba(255,122,0,.18)" : D.panel2,
        border: `1.5px solid ${hot ? D.agent : D.lineStrong}`,
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(10px)",
        transition: `opacity .4s ease ${on ? delay : 0}ms, transform .5s ${EASE} ${on ? delay : 0}ms, border-color .4s, background .4s`,
      }}
    >
      {t.swatch && <span className="h-[20px] w-[20px] rounded-[5px]" style={{ background: t.swatch, border: "1px solid rgba(255,255,255,.25)" }} />}
      {t.name}
      {t.ref && <span style={{ color: D.dim }}>→ {t.ref}</span>}
    </span>
  );
}

function Layer({ y, name, on, children, tag }: { y: number; name: string; on: boolean; children: React.ReactNode; tag?: string }) {
  return (
    <div className="absolute" style={{ left: RX, top: y, width: RW }}>
      <Show on={on} from="start" className="mb-[14px] flex items-center justify-start gap-[14px]">
        <span dir="ltr" className="text-[30px] font-black" style={{ color: D.sky }}>
          {name}
        </span>
        {tag && (
          <span className="rounded-full px-[12px] py-[4px] text-[18px] font-bold" style={{ color: D.sky, border: `1px dashed ${D.sky}` }}>
            {tag}
          </span>
        )}
      </Show>
      <div className="flex flex-wrap justify-start gap-[10px]">
        {children}
      </div>
    </div>
  );
}

export default function S14Expertise({ step }: SlideProps) {
  const s = stepper(steps, step);
  const ex = useBeats(step, s.idx("expertise"), [60, 700, 1500, 2300, 3000]);
  const ho = useBeats(step, s.idx("handoff"), [60, 900]);
  const cp = useBeats(step, s.idx("components"), [...BUILD_MADE, 3300]);
  const rv = useBeats(step, s.idx("review"), [60, 1000, 2200, 3000, 3000 + 960, 4600]);
  const made = Math.min(3, cp);
  const linked = cp >= 4;
  const fixed = rv >= 5;
  const closing = s.at("closing");
  const handed = s.at("handoff");

  return (
    <div className="absolute inset-0">
      <SlideTitle>{S14.title}</SlideTitle>

      <div className="absolute inset-0" style={{ opacity: closing ? 0.16 : 1, filter: closing ? "blur(2px)" : "none", transition: "opacity .8s, filter .8s" }}>
        {/* the designer's brief: travels to the agent at the handoff */}
        <div
          className="absolute"
          style={{
            left: handed ? 300 : RX,
            top: handed ? 196 : 200,
            transform: handed ? "scale(.62) rotate(-4deg)" : "rotate(-1.5deg)",
            transformOrigin: "top left",
            opacity: ex >= 1 ? 1 : 0,
            transition: `left 1s ${EASE}, top 1s ${EASE}, transform 1s ${EASE}, opacity .5s ease`,
          }}
        >
          <div className="w-[380px] rounded-[18px] p-[22px]" style={{ background: "#dbeeff", color: D.ink, boxShadow: "0 18px 40px rgba(0,0,0,.4)" }}>
            <div className="mb-[14px] flex items-center gap-[12px] text-[28px] font-black">
              <Icon icon={NoteEditIcon} size={32} color={D.cobalt} />
              {S14.brief}
            </div>
            <svg width="336" height="70" aria-hidden>
              <Stroke d={sketchLine([0, 10], [300, 12], 1)} color={D.cobalt} width={3} draw={ex >= 1} delay={300} />
              <Stroke d={sketchLine([0, 36], [240, 34], 2)} color={D.cobalt} width={3} draw={ex >= 1} delay={500} />
              <Stroke d={sketchLine([0, 62], [280, 60], 3)} color={D.cobalt} width={3} draw={ex >= 1} delay={700} />
            </svg>
          </div>
        </div>

        {/* Design Tokens, layer by layer */}
        <Show on={ex >= 2} from="fade" className="absolute flex items-center gap-[14px]" style={{ right: 1920 - RX - RW, top: 296 }}>
          <span dir="ltr" className="text-[26px] font-black" style={{ color: D.mist }}>
            {S14.tokens}
          </span>
          <span className="h-[2px] w-[120px]" style={{ background: D.line }} />
        </Show>
        <Layer y={LAYER_Y[0]} name={S14.layers[0]} on={ex >= 2}>
          {PRIMITIVES.map((t, i) => (
            <Chip key={t.name} t={t} on={ex >= 2} delay={i * 60} />
          ))}
        </Layer>
        <Layer y={LAYER_Y[1]} name={S14.layers[1]} on={ex >= 3}>
          {SEMANTIC.map((t, i) => (
            <Chip key={t.name} t={t} on={ex >= 3} delay={i * 70} hot={fixed && t.name === "radius.control"} />
          ))}
        </Layer>
        <Layer y={LAYER_Y[2]} name={S14.layers[2]} on={ex >= 4}>
          {COMPONENT.map((t, i) => (
            <Chip key={t.name} t={t} on={ex >= 4} delay={i * 70} hot={linked} />
          ))}
        </Layer>
        <SketchLayer>
          {/* layer relationships */}
          <Arrow from={[1560, 470]} to={[1500, 545]} bend={10} color={D.sky} width={3} draw={ex >= 5} seed={3} />
          <Arrow from={[1250, 470]} to={[1310, 545]} bend={-10} color={D.sky} width={3} draw={ex >= 5} delay={150} seed={4} />
          <Arrow from={[1600, 650]} to={[1560, 725]} bend={10} color={D.sky} width={3} draw={ex >= 5} delay={300} seed={5} />
          <Arrow from={[1300, 650]} to={[1340, 725]} bend={-10} color={D.sky} width={3} draw={ex >= 5} delay={450} seed={6} />
          {/* components bound to their tokens */}
          <Arrow from={[RX + 560, LAYER_Y[2] + 92]} to={[WIN.x + WIN.w + 12, WIN.y + BTN.y + 40]} bend={-50} color={D.agent} width={3} dash="10 10" draw={linked} seed={7} />
          <Arrow from={[RX + 330, LAYER_Y[2] + 92]} to={[WIN.x + WIN.w + 12, WIN.y + INPUT.y + 40]} bend={-30} color={D.agent} width={3} dash="10 10" draw={linked} delay={200} seed={8} />
          <Arrow from={[RX + 120, LAYER_Y[2] + 92]} to={[WIN.x + WIN.w + 12, WIN.y + CARD.y + 200]} bend={-20} color={D.agent} width={3} dash="10 10" draw={linked} delay={400} seed={9} />
        </SketchLayer>

        {/* the agent */}
        <div className="absolute left-[110px] top-[176px]">
          <Show on={handed} from="end">
            <WamdaActor look={lookFor(14)} act={s.is("components") && made < 3 ? "thinking" : "idle"} scale={2.5} shadow={false} />
          </Show>
        </div>

        {/* Figma */}
        <div className="absolute inset-0" style={{ opacity: handed ? 1 : 0, transform: handed ? "none" : "translateY(40px)", transition: `all .7s ${EASE} .3s` }}>
          <FigmaMock
            x={WIN.x}
            y={WIN.y}
            w={WIN.w}
            h={WIN.h}
            file="design-system.fig"
            sim={S12.sim}
            layersW={LAYERS_W}
            propsW={0}
            layers={[
              { name: "Button", on: made >= 1, active: made === 1 },
              { name: "Input", on: made >= 2, active: made === 2 },
              { name: "Card", on: made >= 3, active: made === 3 && !linked },
            ]}
            style={{ borderRadius: 22 }}
          >
            {/* Button */}
            <div className="absolute" style={{ left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, opacity: made >= 1 ? 1 : 0, transform: made >= 1 ? "none" : "scale(.7)", transition: `opacity .3s, transform .5s cubic-bezier(.3,1.5,.5,1)` }}>
              <div className="flex h-full items-center justify-center text-[30px] font-black" style={{ background: D.agent, color: D.agentInk, borderRadius: fixed ? 34 : 10, transition: `border-radius .6s ${EASE}` }}>
                {S14.ui.button}
              </div>
              <Selected on={made === 1 || (s.is("review") && rv >= 2 && !fixed)} color={s.is("review") ? D.azure : D.agent} />
            </div>
            {/* Input */}
            <div className="absolute" style={{ left: INPUT.x, top: INPUT.y, width: INPUT.w, height: INPUT.h, opacity: made >= 2 ? 1 : 0, transform: made >= 2 ? "none" : "scale(.7)", transition: `opacity .3s, transform .5s cubic-bezier(.3,1.5,.5,1)` }}>
              <div className="flex h-full items-center rounded-[12px] px-[20px] text-[24px]" style={{ border: `2px solid ${D.cobalt}`, color: "#8a8a8a", background: "#fff" }}>
                {S14.ui.input}
              </div>
              <Selected on={made === 2} />
            </div>
            {/* Card */}
            <div className="absolute" style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: made >= 3 ? 1 : 0, transform: made >= 3 ? "none" : "scale(.7)", transformOrigin: "top left", transition: `opacity .3s, transform .5s cubic-bezier(.3,1.5,.5,1)` }}>
              <div className="h-full overflow-hidden rounded-[16px]" style={{ background: D.paper }}>
                <div className="h-[110px]" style={{ background: `linear-gradient(135deg, ${D.cobalt}, ${D.azure})` }} />
                <div className="flex flex-col gap-[12px] p-[18px]">
                  <span className="h-[16px] w-[70%] rounded-full" style={{ background: D.ink }} />
                  <span className="h-[9px] w-[90%] rounded-full" style={{ background: "#c6d3e6" }} />
                  <span className="h-[9px] w-[60%] rounded-full" style={{ background: "#c6d3e6" }} />
                  <span className="mt-[6px] h-[34px] w-[50%] rounded-[10px]" style={{ background: D.agent }} />
                </div>
              </div>
              <Selected on={made === 3 && !linked} />
            </div>
            {/* what comes next: names only, not built */}
            <div dir="ltr" className="absolute flex items-center gap-[12px]" style={{ left: 230, top: 470 }}>
              {S14.next.map((n, i) => (
                <span key={n} className="flex items-center gap-[12px]" style={{ opacity: rv >= 1 ? 1 : 0, transition: `opacity .4s ease ${i * 0.2}s` }}>
                  <span className="rounded-[10px] px-[14px] py-[8px] text-[21px] font-bold" style={{ border: "1.5px dashed #6a6a6a", color: "#bdbdbd", fontFamily: MONO }}>
                    {n}
                  </span>
                  {i < S14.next.length - 1 && <span style={{ color: "#6a6a6a", fontSize: 22 }}>→</span>}
                </span>
              ))}
            </div>
          </FigmaMock>
        </div>

        {/* the review comment */}
        <Show on={s.is("review") && rv >= 3} from="pop" className="absolute flex items-center gap-[12px] rounded-[16px] rounded-bl-[4px] px-[20px] py-[14px]" style={{ left: WIN.x + BTN.x - 10, top: WIN.y + BTN.y - 76, background: fixed ? D.panel2 : D.azure, color: fixed ? D.dim : D.ink, transition: "background .4s, color .4s" }}>
          <Icon icon={fixed ? CheckmarkCircle02Icon : Comment01Icon} size={28} color={fixed ? D.agent : D.ink} stroke={2} />
          <span className="whitespace-nowrap text-[26px] font-bold" style={{ textDecoration: fixed ? "line-through" : "none" }}>
            {S14.review}
          </span>
        </Show>

        <Pointer path={ENTER} play={s.is("handoff") && ho >= 2} />
        <Pointer path={BUILD} play={s.is("components")} />
        <Pointer path={REVIEW} play={s.is("review") && rv >= 2} label={DESIGNER_LABEL} color={D.azure} ink={D.ink} />
        <Pointer path={FIX} play={s.is("review") && rv >= 4} />
      </div>

      {/* closing */}
      <Show on={closing} from="up" className="absolute inset-0 flex items-center justify-center px-[180px]">
        <p className="m-0 text-center text-[84px] font-black leading-[1.35]" style={{ color: D.mist }}>
          {S14.closing}
        </p>
      </Show>
    </div>
  );
}
