"use client";

import { S25 } from "../content/copy";
import { RESOURCE } from "../content/resources";
import { D, MONO } from "../theme";
import { Show } from "../kit/Show";
import { SlideTitle } from "../kit/ui";
import { AppCard } from "../kit/AppCard";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان" },
  { key: "libraries", label: "المكتبات الثلاث بتتابع سريع: الشعار والاسم والوصف والبرومبت" },
];

/** one row of three cards, centred; right to left. Same top as slide 24's grid */
const GRID = { w: 540, h: 500, gap: 48, top: 300 };

/**
 * Three ready-made animation prompt libraries, on slide 24's card (deck/kit/AppCard.tsx, size "col"): the site's own
 * logo on the shared tile, the name, the library's line in the deck's blue, and a short prompt from it right under.
 * One click shows them in reading order, as on slide 24. No address on screen: the logo and name open the library
 * through a hidden link (owner's request, 2026-11-25; URLs in content/resources.ts).
 */
export default function S25PromptLibraries({ step }: SlideProps) {
  const s = stepper(steps, step);
  const on = s.at("libraries");
  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S25.sub}>{S25.title}</SlideTitle>
      <ul
        className="absolute inset-x-0 m-0 grid list-none justify-center p-0"
        style={{ top: GRID.top, gridTemplateColumns: `repeat(3, ${GRID.w}px)`, gridAutoRows: GRID.h, columnGap: GRID.gap }}
      >
        {S25.libraries.map((l, i) => {
          const r = RESOURCE[l.id];
          return (
            <Show as="li" key={l.id} on={on} from="up" delay={on ? i * 120 : 0} className="h-full w-full">
              <AppCard r={r} line={r.what ?? ""} size="col" href={r.url}>
                <span
                  dir="ltr"
                  className="w-full font-medium leading-[1.45]"
                  style={{ textWrap: "balance", borderRadius: 14, fontSize: 21, fontFamily: MONO, color: D.sky, background: D.ink, border: `1px solid ${D.line}`, padding: "12px 16px" }}
                >
                  “{l.excerpt}”
                </span>
              </AppCard>
            </Show>
          );
        })}
      </ul>
    </div>
  );
}
