"use client";

import { DECISIONS, TRACK } from "../content/copy";
import { D, MONO } from "../theme";
import { Show } from "../kit/Show";
import { useBeats } from "../kit/beats";
import { SlideTitle } from "../kit/ui";
import { TrackBody } from "../kit/Sim";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = [{ key: "cards", label: "القرارات الست تطلع وحدة وحدة" }];

const GRID = { x: 150, y: 250, w: 1620, h: 300, gap: 36, cols: 3 };
const CW = (GRID.w - GRID.gap * (GRID.cols - 1)) / GRID.cols;

/** What was settled before any build (owner's summary, 2026-11-25): six cards, staggered in reading order (RTL). */
export default function S28Decisions({ step }: SlideProps) {
  const n = useBeats(step, 0, DECISIONS.items.map((_, i) => 250 + i * 320));
  return (
    <div className="absolute inset-0">
      <SlideTitle sub={DECISIONS.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        <div dir="rtl" className="absolute grid" style={{ left: GRID.x, top: GRID.y, width: GRID.w, gridTemplateColumns: `repeat(${GRID.cols}, ${CW}px)`, gap: GRID.gap }}>
          {DECISIONS.items.map((it, i) => (
            <Show key={it.k} on={n >= i + 1} from="up" className="flex flex-col gap-[16px] rounded-[28px] px-[34px] py-[28px]" style={{ height: GRID.h, background: D.panel, border: `2px solid ${D.lineStrong}` }}>
              <span className="flex items-center gap-[14px]">
                <span className="font-black" style={{ fontSize: 26, color: D.sky, fontFamily: MONO }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-black" style={{ fontSize: 34, color: D.agent }}>
                  {it.k}
                </span>
              </span>
              <span className="font-bold leading-[1.4]" style={{ fontSize: "chips" in it ? 32 : 38, color: D.paper }}>
                {it.v}
              </span>
              {"chips" in it && (
                <span className="flex flex-wrap gap-[10px]">
                  {it.chips.map((c) => (
                    <span key={c} dir="ltr" className="rounded-full px-[16px] py-[4px] text-[24px] font-bold" style={{ background: D.panel2, border: `1.5px solid ${D.lineStrong}`, color: D.mist }}>
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </Show>
          ))}
        </div>
      </TrackBody>
    </div>
  );
}
