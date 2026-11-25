"use client";

import {
  Building03Icon,
  Camera01Icon,
  CubeIcon,
  GameController01Icon,
  Mic01Icon,
  Motion02Icon,
  PaintBoardIcon,
  ScissorIcon,
  Search01Icon,
  Sofa01Icon,
  SourceCodeIcon,
  SwatchIcon,
  TableIcon,
  WebDesign01Icon,
} from "@hugeicons/core-free-icons";
import { S18 } from "../content/copy";
import { D } from "../theme";
import { useBeats } from "../kit/beats";
import { Icon, SlideTitle, type IconSvgElement } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان والسؤال" },
  { key: "domains", label: "تظهر المجالات الـ14 بتتابع سريع، وبعدها تبرز الخمسة تلقائيًا" },
];

type Domain = (typeof S18.domains)[number];

/** one icon per domain, by name, so reordering the grid in copy.ts can never pair a card with the wrong icon */
const ICONS: Record<Domain, IconSvgElement> = {
  "البرمجة": SourceCodeIcon,
  "تصميم UI/UX": WebDesign01Icon,
  "المونتاج": ScissorIcon,
  "الإنفوجرافيك والأنيميشن": Motion02Icon,
  "إدخال البيانات (Data Entry)": TableIcon,
  "3D": CubeIcon,
  "الهوية البصرية": SwatchIcon,
  "صناعة المحتوى": Camera01Icon,
  "التعليق الصوتي": Mic01Icon,
  "التصميم الداخلي": Sofa01Icon,
  "التصميم المعماري": Building03Icon,
  "تطوير الألعاب": GameController01Icon,
  "البحث والتغذية البصرية": Search01Icon,
  "تصميم الجرافيك": PaintBoardIcon,
};

const FOCUS: readonly number[] = S18.focus;

/** cards arrive in reading order (right to left, row by row); the five light up once the last card has landed */
const ARRIVE_MS = 45;
const HIGHLIGHT_AT = 14 * ARRIVE_MS + 700;
const STAGGER_MS = 90;

/**
 * Two stages, one click.
 *   title   : the heading and the question only
 *   domains : the 14 cards arrive quickly; then, by themselves, the five practical tracks (the grid's first row,
 *             columns 2–6) light up orange and the other nine step back. No card moves after it lands.
 * Going back hides the grid; coming forward again replays the arrival and the highlight.
 */
export default function S18Domains({ step }: SlideProps) {
  const s = stepper(steps, step);
  const shown = s.at("domains");
  const lit = useBeats(step, s.idx("domains"), [HIGHLIGHT_AT]) >= 1;

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S18.sub}>{S18.title}</SlideTitle>

      <ul className="absolute m-0 grid list-none grid-cols-7 gap-[18px] p-0" style={{ left: 110, right: 110, top: 400 }}>
        {S18.domains.map((name, i) => {
          const k = FOCUS.indexOf(i);
          const on = lit && k >= 0;
          const faded = lit && k < 0;
          const wait = on ? k * STAGGER_MS : 0;

          return (
            <li
              key={name}
              data-domain={name}
              data-state={on ? "on" : faded ? "faded" : shown ? "plain" : "hidden"}
              className="relative flex h-[290px] flex-col items-center justify-center gap-[24px] rounded-[26px] px-[16px] text-center"
              style={{
                background: on ? "rgba(255,122,0,.1)" : D.panel,
                border: `2px solid ${on ? D.agent : D.line}`,
                boxShadow: on ? `0 0 50px ${D.agent}33` : "none",
                opacity: !shown ? 0 : faded ? 0.3 : 1,
                transform: shown ? "none" : "translateY(26px) scale(.96)",
                transition: shown
                  ? `opacity ${lit ? ".7s" : ".45s"} ease ${lit ? 0 : i * ARRIVE_MS}ms, transform .55s cubic-bezier(.2,.8,.2,1) ${i * ARRIVE_MS}ms, background .5s ease ${wait}ms, border-color .5s ease ${wait}ms, box-shadow .6s ease ${wait}ms`
                  : "opacity .25s ease, transform .25s ease",
              }}
            >
              <Icon icon={ICONS[name]} size={72} color={on ? D.agent : D.sky} stroke={1.5} style={{ transition: `color .5s ease ${wait}ms` }} />
              <span className="relative text-[28px] font-bold leading-[1.3]" style={{ color: D.mist }}>
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
