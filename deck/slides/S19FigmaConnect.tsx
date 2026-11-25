"use client";

import { S19, TRACK } from "../content/copy";
import { RESOURCE } from "../content/resources";
import { Show } from "../kit/Show";
import { SlideTitle } from "../kit/ui";
import { AppCard } from "../kit/AppCard";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "تصميم UI/UX: خلّ الوكيل يشتغل داخل Figma" },
  { key: "figma", label: "Figma MCP: الربط الرسمي" },
  { key: "figwright", label: "Figwright: بديل مجتمعي مجاني ومفتوح المصدر" },
  { key: "mobbin", label: "Mobbin MCP: مرجع بصري" },
];

/** the click that shows each card, in the order of S19.cards (right to left) */
const AT = ["figma", "figwright", "mobbin"] as const;

/** three equal cards in one centred row; every slot is reserved, so nothing shifts when the next card appears */
const CARD = { w: 540, h: 580, gap: 52, top: 320 };
/**
 * How much of the tile each mark takes, so the three logos read at the same weight. figwright.svg carries wide
 * padding of its own (its drawing fills 68% of the file, Figma's 94%), so it gets a larger fit. Mobbin is an app
 * icon with its own tile and is drawn whole.
 */
const MARK_FIT: Record<string, number> = { "figma-mcp": 0.62, figwright: 0.8 };

/**
 * Connecting Figma to the agent (the connection itself was explained on the MCP slides). Three cards
 * (deck/kit/AppCard.tsx), one per click: the official Figma MCP, the community alternative Figwright, and Mobbin
 * MCP as a visual reference. A presentation: the cards are not links and show no URL.
 */
export default function S19FigmaConnect({ step }: SlideProps) {
  const s = stepper(steps, step);

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S19.sub}>{TRACK.uiux}</SlideTitle>

      <ul className="absolute inset-x-0 m-0 flex list-none justify-center p-0" style={{ top: CARD.top, gap: CARD.gap }}>
        {S19.cards.map((c, i) => (
          <Show as="li" key={c.id} on={s.at(AT[i])} from="up" className="flex-none" style={{ width: CARD.w, height: CARD.h }}>
            <AppCard r={RESOURCE[c.id]} line={c.line} size="lg" fit={MARK_FIT[c.id]} />
          </Show>
        ))}
      </ul>
    </div>
  );
}
