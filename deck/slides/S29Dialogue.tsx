"use client";

import { DIALOGUE, TRACK } from "../content/copy";
import { D, EASE } from "../theme";
import { useBeats } from "../kit/beats";
import { SlideTitle } from "../kit/ui";
import { TrackBody } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "r1", label: "يراجع ويسأل ↔ ردود قصيرة، ويجمع الأسئلة ↔ أزرار" },
  { key: "r2", label: "خيارات بأزرار ↔ ملاحظات بالثانية، يطلب الموافقة ↔ تصحيح مباشر" },
  { key: "r3", label: "«وش فهمت» ↔ تفويض، صور ومسودات ↔ تجربة قابلة للتراجع" },
];

const COL = { w: 800, gap: 60, y: 262, rowGap: 18 };
const X0 = (1920 - COL.w * 2 - COL.gap) / 2;

/**
 * The session as a conversation (owner's summary, 2026-11-25): what Claude does on the right, how you answer on the left,
 * as chat bubbles. Each click adds two pairs; inside a pair Claude speaks first, your answer follows.
 */
export default function S29Dialogue({ step }: SlideProps) {
  const s = stepper(steps, step);
  const MARKS = [100, 600, 1100, 1600];
  const beats = [useBeats(step, s.idx("r1"), MARKS), useBeats(step, s.idx("r2"), MARKS), useBeats(step, s.idx("r3"), MARKS)];
  // bubble k of the slide (0..23 in pairs): visible when its click's beat has fired
  const shown = (row: number, you: boolean) => {
    const click = Math.floor(row / 2);
    const k = (row % 2) * 2 + (you ? 1 : 0);
    return beats[click] >= k + 1;
  };

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={DIALOGUE.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        <div dir="rtl" className="absolute" style={{ left: X0, top: COL.y, width: COL.w * 2 + COL.gap }}>
          <div className="mb-[22px] grid" style={{ gridTemplateColumns: `${COL.w}px ${COL.w}px`, columnGap: COL.gap }}>
            <span className="flex items-center gap-[14px] text-[36px] font-black" style={{ color: D.agent }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/deck/logos/tools/claude.svg" alt="" width={40} height={40} draggable={false} />
              {DIALOGUE.claude}
            </span>
            <span className="text-[36px] font-black" style={{ color: D.sky }}>
              {DIALOGUE.you}
            </span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: `${COL.w}px ${COL.w}px`, columnGap: COL.gap, rowGap: COL.rowGap }}>
            {DIALOGUE.rows.map((r, i) => (
              <Row key={r.claude} claude={r.claude} you={r.you} onClaude={shown(i, false)} onYou={shown(i, true)} />
            ))}
          </div>
        </div>
      </TrackBody>
    </div>
  );
}

function Row({ claude, you, onClaude, onYou }: { claude: string; you: string; onClaude: boolean; onYou: boolean }) {
  const pop = (on: boolean) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(14px) scale(.97)", transition: `opacity .4s ease, transform .5s ${EASE}` });
  return (
    <>
      <div className="flex items-center rounded-[24px_24px_8px_24px] px-[26px] py-[16px] text-[28px] font-bold leading-[1.4]" style={{ background: D.panel2, border: `2px solid ${D.agent}66`, color: D.paper, ...pop(onClaude) }}>
        {claude}
      </div>
      <div className="flex items-center self-center justify-self-start rounded-[24px_24px_24px_8px] px-[26px] py-[16px] text-[28px] font-bold leading-[1.4]" style={{ background: D.sky, color: D.ink, ...pop(onYou) }}>
        {you}
      </div>
    </>
  );
}
