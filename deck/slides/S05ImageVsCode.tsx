"use client";

/* eslint-disable @next/next/no-img-element */
import RefineFrame, { type RefineFrameStatus } from "@/components/reactbits/RefineFrame";
import { S05 } from "../content/copy";
import { MEDIA } from "../media/media";
import { D, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { SketchLayer, Stroke, sketchLine } from "../kit/Sketch";
import { PlaceholderTag, SlideTitle, ToolBadge } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";
import { useRasterFrames } from "./compare/sample";
import { BASE_VARS, CODE_PANEL_X, CodeWindow, IMG_PANEL_X, MAIN, PANEL, PanelBox, PixelLens, SIDE, SampleDesign, type DesignVars } from "./compare/parts";

export const steps: StepDef[] = [
  { key: "tools", label: "العنوانان والتسميتان والأدوات بشعاراتها" },
  { key: "image", label: "اليمين: توليد الصورة ثم تكبير البكسلات" },
  { key: "code", label: "اليسار: بناء التصميم بالكود" },
  { key: "edit", label: "التعديل المباشر في CSS" },
];

/**
 * This slide's own vertical layout: a taller header in each column (title, small line, tools, stacked),
 * so the panels start a little higher and the demo a little lower than the shared geometry slide 06 keeps.
 * Every element has a fixed place. Each side is revealed on its own click: its tool row fades out and its format
 * (Raster / Pixels, HTML · CSS · JavaScript) takes that row, its panel and demo appear; the other side stays as it was.
 */
const PY = 180; // panel top
const DY = 180; // demo top, from the panel top
const HEAD = { name: PY + 28, label: PY + 84, tools: PY + 122 };

function ColumnHead({ x, name, label, tools, format, revealed, color }: { x: number; name: string; label: string; tools: readonly string[]; format: string; revealed: boolean; color: string }) {
  const box = { left: x + 40, width: PANEL.w - 80 };
  return (
    <>
      <div className="absolute flex flex-col items-start" style={{ ...box, top: HEAD.name }}>
        <h2 dir="ltr" className="m-0 text-[42px] font-black leading-none" style={{ color }}>
          {name}
        </h2>
      </div>
      <p className="absolute m-0 text-right text-[24px] font-medium leading-none" style={{ ...box, top: HEAD.label, color: D.dim }}>
        {label}
      </p>
      <Show on={!revealed} from="fade" dur={450} className="absolute flex flex-nowrap justify-start gap-[8px]" style={{ ...box, top: HEAD.tools }}>
        {tools.map((t) => (
          <ToolBadge key={t} name={t} color={color} size="sm" />
        ))}
      </Show>
      <Show on={revealed} from="fade" delay={revealed ? 250 : 0} className="absolute flex justify-start" style={{ ...box, top: HEAD.tools + 4 }}>
        <span dir="ltr" className="inline-block rounded-full px-[18px] py-[8px] text-[22px] font-bold leading-none" style={{ color, border: `1.5px solid ${color}88`, fontFamily: MONO }}>
          {format}
        </span>
      </Show>
    </>
  );
}

/** where the lens looks, in source pixels (256 x 256): the sun's edge, where colour meets colour */
export const LENS_REGION = { x: 106, y: 68, s: 16 };
const K = MAIN.s / 256;

/** the three live edits, in order */
export const EDITS: { key: keyof DesignVars; to: DesignVars[keyof DesignVars]; show: (v: DesignVars) => string }[] = [
  { key: "accent", to: "#a5d8ff", show: (v) => v.accent },
  { key: "radius", to: 44, show: (v) => `${v.radius}px` },
  { key: "title", to: 64, show: (v) => `${v.title}px` },
];

export function varsAfter(n: number): DesignVars {
  const v = { ...BASE_VARS };
  EDITS.slice(0, n).forEach((e) => Object.assign(v, { [e.key]: e.to }));
  return v;
}

export function cssLines(v: DesignVars) {
  return [
    { pre: ".card {" },
    { pre: "  --accent: ", value: v.accent, post: ";" },
    { pre: "  --radius: ", value: `${v.radius}px`, post: ";" },
    { pre: "  --title: ", value: `${v.title}px`, post: ";" },
    { pre: "}" },
  ];
}

const STATUS: RefineFrameStatus[] = ["queued", "generating", "refining", "complete"];

/** Under each demo: one line, once the demo is done. Right-aligned to the demo. */
function Caption({ right, top, text, on }: { right: number; top: number; text: string; on: boolean }) {
  return (
    <Show as="p" on={on} from="fade" className="absolute m-0 whitespace-nowrap text-right text-[26px] font-medium" style={{ right: 1920 - right, top, color: D.dim }}>
      {text}
    </Show>
  );
}

export default function S05ImageVsCode({ step, dev }: SlideProps) {
  const s = stepper(steps, step);
  // each demo starts with its own side's reveal, and rests on its last frame afterwards
  const gen = useBeats(step, s.idx("image"), [60, 1300, 2600, 3500]);
  const bld = useBeats(step, s.idx("code"), [60, 1800, 2300, 2800, 3400, 4300]);
  const edt = useBeats(step, s.idx("edit"), [60, 1000, 2200, 3400, 4400]);
  const [raster] = useRasterFrames(1);
  const lensOn = gen >= 4;
  const ix = IMG_PANEL_X + MAIN.dx;
  const iy = PY + DY;
  const imgOn = s.at("image");
  const codeOn = s.at("code");
  const mark = { x: ix + LENS_REGION.x * K, y: iy + LENS_REGION.y * K, s: LENS_REGION.s * K };
  const lens = { x: IMG_PANEL_X + SIDE.dx, y: iy, s: SIDE.w };
  const vars = varsAfter(Math.max(0, edt - 1));

  return (
    <div className="absolute inset-0">
      <SlideTitle latin>
        {S05.title}
      </SlideTitle>

      {/* ---------- Image Generation ---------- */}
      <PanelBox x={IMG_PANEL_X} y={PY} on={imgOn} glow={s.is("image") ? `${D.sky}88` : undefined} />
      <ColumnHead x={IMG_PANEL_X} name={S05.image.name} label={S05.image.label} tools={S05.image.tools} format={S05.image.sub} revealed={imgOn} color={D.sky} />
      <Show on={imgOn} from="fade" className="absolute" style={{ left: ix, top: iy, width: MAIN.s, height: MAIN.s }}>
        {raster && (
          <RefineFrame status={STATUS[Math.min(3, gen)]} width={MAIN.s} aspectRatio="1 / 1" radius={16} stageDuration={900} hideAfter={0} labels={S05.refine} background={D.panel2} color={D.sky}>
            <img src={raster} alt={S05.image.caption} />
          </RefineFrame>
        )}
        <PlaceholderTag dev={dev && !MEDIA.s05Image.src} label="s05-image" />
      </Show>
      <div className="absolute" style={{ left: mark.x, top: mark.y, width: mark.s, height: mark.s, border: `3px solid ${D.agent}`, opacity: lensOn ? 1 : 0, transition: "opacity .4s", boxShadow: "0 0 0 2px rgba(0,0,0,.5)" }} />
      <Show on={lensOn} from="scale" className="absolute" style={{ left: lens.x, top: lens.y, width: lens.s, height: lens.s }}>
        <PixelLens src={raster} on={lensOn} region={LENS_REGION} size={lens.s} style={{ left: 0, top: 0 }} />
        <span dir="ltr" className="absolute bottom-[12px] left-[12px] rounded-[8px] px-[10px] py-[5px] text-[18px] font-bold leading-none" style={{ background: D.agent, color: D.agentInk, fontFamily: MONO }}>
          ×{Math.round(256 / LENS_REGION.s)}
        </span>
      </Show>
      <SketchLayer>
        <Stroke d={sketchLine([mark.x, mark.y], [lens.x + lens.s, lens.y + 4], 11)} color={D.agent} width={2.5} draw={lensOn} dur={500} />
        <Stroke d={sketchLine([mark.x, mark.y + mark.s], [lens.x + lens.s, lens.y + lens.s - 4], 12)} color={D.agent} width={2.5} draw={lensOn} delay={120} dur={500} />
      </SketchLayer>
      <Caption right={ix + MAIN.s} top={iy + MAIN.s + 24} text={S05.image.caption} on={gen >= 3} />

      {/* ---------- Code-based Design ---------- */}
      <PanelBox x={CODE_PANEL_X} y={PY} on={codeOn} glow={s.is("code") || s.is("edit") ? `${D.agent}88` : undefined} />
      <ColumnHead x={CODE_PANEL_X} name={S05.code.name} label={S05.code.label} tools={S05.code.tools} format={S05.code.sub} revealed={codeOn} color={D.agent} />
      <Show on={codeOn} from="fade" className="absolute" style={{ left: CODE_PANEL_X + MAIN.dx, top: iy, width: MAIN.s, height: MAIN.s }}>
        <SampleDesign build={Math.min(5, bld)} outlines={bld >= 1 && bld < 6} vars={vars} style={{ left: 0, top: 0 }} />
        <PlaceholderTag dev={dev} label="s05-design" />
      </Show>
      <Show on={edt >= 1} from="end" className="absolute" style={{ left: CODE_PANEL_X + SIDE.dx, top: iy, width: SIDE.w }}>
        <CodeWindow file="card.css" width={SIDE.w} lines={cssLines(vars)} glow={s.is("edit") && edt < 5} style={{ left: 0, top: 0 }} />
      </Show>
      <Caption right={CODE_PANEL_X + MAIN.dx + MAIN.s} top={iy + MAIN.s + 24} text={S05.code.caption} on={bld >= 5} />

      {/* ---------- the message ---------- */}
      <Show on={edt >= 5} from="up" className="absolute inset-x-[110px] top-[944px] flex justify-start">
        <p className="m-0 text-[42px] font-black leading-none" style={{ color: D.mist }}>
          {S05.message}
        </p>
      </Show>
    </div>
  );
}
