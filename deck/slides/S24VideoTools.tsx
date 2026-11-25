"use client";

import { S24, TRACK } from "../content/copy";
import { RESOURCE, type Resource } from "../content/resources";
import { Show } from "../kit/Show";
import { SlideTitle } from "../kit/ui";
import { AppCard } from "../kit/AppCard";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان" },
  { key: "tools", label: "الأدوات الست بتتابع سريع: الشعار والاسم والدور" },
];

/** two rows of three, centred; right to left, top row first */
const GRID = { w: 520, h: 320, gapX: 48, gapY: 36, top: 300 };

/**
 * This slide's cards only: OpenMontage shows its official mark, the one its README displays (Monty the Clapper,
 * assets/monty-dark.svg, the dark-mode variant; github.com/OpenMontageInc/OpenMontage, checked 2026-11-24; the same
 * character is the logo and favicon of openmontage.video). The file is the original, unchanged (it carries its own
 * gentle idle animation). Its drawing is centred in its 200×200 frame, so it sits whole and centred on the tile.
 * resources.ts keeps the older assets/logo.png for slide 26 and /deck/refs.
 */
const CARD_LOGO: Record<string, { logo: string; fit: number }> = {
  openmontage: { logo: "/deck/logos/tracks/openmontage-monty-dark.svg", fit: 0.86 },
};
const cardResource = (id: string): Resource => {
  const r = RESOURCE[id];
  const o = CARD_LOGO[id];
  return o ? { ...r, logo: o.logo, logoKind: "mark" } : r;
};

/**
 * Six tools a video agent can reach for, on the same cards as slide 19 (deck/kit/AppCard.tsx): logo, name,
 * one line. One click shows them in reading order. No examples and no links on the slide; that OpenMontage can call
 * the others is said in the notes.
 */
export default function S24VideoTools({ step }: SlideProps) {
  const s = stepper(steps, step);
  const on = s.at("tools");
  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S24.sub}>{TRACK.motion}</SlideTitle>
      <ul
        className="absolute inset-x-0 m-0 grid list-none justify-center p-0"
        style={{ top: GRID.top, gridTemplateColumns: `repeat(3, ${GRID.w}px)`, gridAutoRows: GRID.h, columnGap: GRID.gapX, rowGap: GRID.gapY }}
      >
        {S24.tools.map((t, i) => (
          <Show as="li" key={t.id} on={on} from="up" delay={on ? i * 120 : 0} className="h-full w-full">
            <AppCard r={cardResource(t.id)} line={t.role} size="md" fit={CARD_LOGO[t.id]?.fit} />
          </Show>
        ))}
      </ul>
    </div>
  );
}
