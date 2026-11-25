"use client";

/* eslint-disable @next/next/no-img-element */
import { S16 } from "../content/copy";
import { BRANDS, BrandMark } from "../media/brands";
import { D } from "../theme";
import { Show } from "../kit/Show";
import { SlideTitle } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "question", label: "السؤال وحده في المنتصف (للجمهور)" },
  { key: "idea", label: "السؤال يصعد للعنوان، ثم: نستلهم من المبدعين الرائدين" },
  { key: "platforms", label: "وين نلقى أعمالهم؟ المنصات الأربع" },
  { key: "ask", label: "سؤال للجمهور: هل كذا اكتفينا؟" },
  { key: "libraries", label: "مكتبات المكوّنات: React Bits في الوسط" },
  { key: "libSides", label: "Magic UI يمينه وdaisyUI يساره" },
  { key: "libBottom", label: "تحتهم: shadcn/ui يمين وAceternity UI يسار" },
];

const SUB_TOP = 196; // the stage's own line under the title (stages 3 and 5–7)
const GRID_TOP = 300;

/**
 * Stages 5–7: five libraries on two levels, React Bits the largest in the middle. One compact group, centred on
 * the stage's axis under the sub-line, with a clear margin at the bottom. Positions are physical (x from the
 * stage's left edge, y = the logo's centre), so "right of React Bits" stays on the right whatever the text
 * direction. `scale` evens out the marks' optical weight (a filled disc reads bigger than a line mark).
 */
const LIB_W = 420;
const TIER = {
  hero: { box: 256, name: 58, gap: 24 },
  side: { box: 176, name: 42, gap: 20 },
} as const;
const GROUP_TOP = 344; // React Bits' name: ~100 px under the sub-line; the group ends ~150 px above the bottom
const LEVEL_1 = GROUP_TOP + TIER.hero.name + TIER.hero.gap + TIER.hero.box / 2; // React Bits, Magic UI, daisyUI
const LEVEL_2 = LEVEL_1 + 290; // shadcn/ui, Aceternity UI: their names start just under React Bits' mark
const SIDE_DX = 400; // level 1, from the centre
const LOW_DX = 245; // level 2, from the centre: between React Bits and the sides
type LibId = (typeof S16.libraries)[number]["id"];
const LIBS: Record<LibId, { src: string; tier: keyof typeof TIER; x: number; y: number; stage: string; from: "scale" | "start" | "end" | "up"; delay: number; scale: number }> = {
  reactbits: { src: "/deck/logos/libraries/react-bits.svg", tier: "hero", x: 960, y: LEVEL_1, stage: "libraries", from: "scale", delay: 250, scale: 1 },
  magicui: { src: "/deck/logos/libraries/magic-ui.svg", tier: "side", x: 960 + SIDE_DX, y: LEVEL_1, stage: "libSides", from: "start", delay: 0, scale: 0.92 },
  daisyui: { src: "/deck/logos/libraries/daisyui.svg", tier: "side", x: 960 - SIDE_DX, y: LEVEL_1, stage: "libSides", from: "end", delay: 140, scale: 0.96 },
  shadcn: { src: "/deck/logos/libraries/shadcn-ui.svg", tier: "side", x: 960 + LOW_DX, y: LEVEL_2, stage: "libBottom", from: "up", delay: 0, scale: 1.05 },
  aceternity: { src: "/deck/logos/libraries/aceternity-ui.svg", tier: "side", x: 960 - LOW_DX, y: LEVEL_2, stage: "libBottom", from: "up", delay: 140, scale: 0.78 },
};

/**
 * Seven stages, each on the presenter's click: the title question alone in the middle (asked to the room) →
 * it rises to the title's place and the answer appears → where to find the work (the platforms) →
 * a question for the room (answered aloud) → five component libraries to build with, in three clicks.
 */
/** the title's trip: from the middle of the slide (stage 1) up to its usual place */
const TITLE_MOVE = { y: 420, scale: 1.18, ms: 900 };
export default function S16Inspiration({ step }: SlideProps) {
  const s = stepper(steps, step);
  const platforms = s.is("platforms");
  const libraries = s.at("libraries");
  return (
    <div className="absolute inset-0">
      {/* the title is the opening question: alone in the middle first, then it rises to the title's place */}
      <SlideTitle
        style={{
          transform: s.is("question") ? `translateY(${TITLE_MOVE.y}px) scale(${TITLE_MOVE.scale})` : "none",
          transformOrigin: "50% 0",
          transition: `transform ${TITLE_MOVE.ms}ms cubic-bezier(.65,0,.25,1)`,
        }}
      >
        {S16.title}
      </SlideTitle>

      {/* 2 · the answer, once the question has settled at the top */}
      <Show on={s.is("idea")} from="fade" delay={s.is("idea") ? TITLE_MOVE.ms + 100 : 0} className="absolute inset-x-[160px] flex items-center justify-center" style={{ top: 420, height: 240 }}>
        <p className="m-0 text-center text-[76px] font-black leading-[1.3]" style={{ color: D.mist }}>
          {S16.idea}
        </p>
      </Show>

      {/* 3 · where to find their work */}
      <Show on={platforms} from="up" className="absolute inset-x-[110px] text-center" style={{ top: SUB_TOP }}>
        <p className="m-0 text-[48px] font-black leading-none" style={{ color: D.sky }}>
          {S16.where}
        </p>
      </Show>
      <div className="absolute inset-x-[110px] grid grid-cols-4 gap-[34px]" style={{ top: GRID_TOP }}>
        {S16.sources.map((src, i) => {
          const b = BRANDS[src.id];
          return (
            <Show
              key={src.id}
              on={platforms}
              from="up"
              delay={platforms ? 350 + i * 120 : 0}
              className="flex h-[500px] flex-col items-center justify-center gap-[34px] rounded-[30px] p-[30px] text-center"
              style={{ background: D.panel, border: `1.5px solid ${D.line}` }}
            >
              <BrandMark id={src.id} size={170} radius={42} />
              <div className="flex flex-col items-center gap-[14px]">
                <span dir="ltr" className="text-[52px] font-black leading-none" style={{ color: D.paper }}>
                  {b.name}
                </span>
                <span className="text-[32px] font-bold leading-[1.3]" style={{ color: D.mist }}>
                  {src.line}
                </span>
              </div>
            </Show>
          );
        })}
      </div>

      {/* 4 · a question for the room; the answer is said aloud */}
      <Show on={s.is("ask")} from="pop" className="absolute inset-x-[160px] flex items-center justify-center" style={{ top: 400, height: 280 }}>
        <p className="m-0 text-center text-[88px] font-black leading-[1.3]" style={{ color: D.mist }}>
          {S16.ask}
        </p>
      </Show>

      {/* 5–7 · five component libraries: the name over the official logo, nothing else; the sites are in the notes */}
      <Show on={libraries} from="up" className="absolute inset-x-[110px] text-center" style={{ top: SUB_TOP }}>
        <p className="m-0 text-[48px] font-black leading-none" style={{ color: D.sky }}>
          {S16.librariesTitle}
        </p>
      </Show>
      {S16.libraries.map((lib) => {
        const l = LIBS[lib.id];
        const t = TIER[l.tier];
        const on = s.at(l.stage);
        return (
          <Show
            key={lib.id}
            on={on}
            from={l.from}
            delay={on ? l.delay : 0}
            dur={700}
            className="absolute flex flex-col items-center"
            style={{ left: l.x - LIB_W / 2, width: LIB_W, top: l.y - t.box / 2 - t.gap - t.name, gap: t.gap }}
          >
            <span dir="ltr" className="whitespace-nowrap font-black leading-none" style={{ fontSize: t.name, color: D.paper }}>
              {lib.name}
            </span>
            <span className="flex items-center justify-center" style={{ width: t.box, height: t.box }}>
              <img
                src={l.src}
                alt=""
                aria-hidden
                draggable={false}
                style={{ width: t.box * l.scale, height: t.box * l.scale, objectFit: "contain" }}
              />
            </span>
          </Show>
        );
      })}
    </div>
  );
}
