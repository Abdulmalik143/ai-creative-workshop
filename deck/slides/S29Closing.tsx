"use client";

import { SpeechBubble } from "@/components/lab/wamda/SpeechBubble";
import { S29 } from "../content/copy";
import { D, EASE } from "../theme";
import { useBeats } from "../kit/beats";
import { stepper, type SlideProps, type StepDef } from "../types";
import { WamdaActor } from "../character/Wamda";

export const steps: StepDef[] = [
  { key: "thanks", label: "شكرًا لحسن استماعكم (عند الدخول)" },
  { key: "malik", label: "مالك يطلع من تحت، وفوق راسه فقاعة الأسئلة" },
];

/** on the second click: Malik rises, then his bubble once he has settled */
const T = { malik: 100, bubble: 1400 };
/** Malik centred at the bottom of the slide (sprite 72 x 76 px) */
const CHAR = { scale: 5, w: 72 * 5, h: 76 * 5, cx: 960, bottom: 50 };
/** where his hood starts inside the sprite (blank sprite rows above it) */
const HOOD = 4 * CHAR.scale;
/** the bubble keeps its slide-07 size; the bubble's tail sits 70px in from its left edge and is 26px tall */
const TAIL = { inset: 70, w: 18, h: 26 };
/** the bubble sits above his head, its tail's tip just over the top of the hood */
const BUBBLE = {
  left: CHAR.cx - TAIL.inset - TAIL.w / 2,
  bottom: CHAR.bottom + CHAR.h - HOOD + 10 + TAIL.h,
  font: 40,
  maxWidth: 640,
};

/**
 * The workshop's last slide, left on screen for the questions. Two click-stages:
 *   thanks : «شكرًا لحسن استماعكم» is there when the slide opens
 *   malik  : Malik rises gently from the bottom, then his bubble appears above his head, pointing down at him
 * After that everything stays: nothing exits or moves on by itself.
 */
export default function S29Closing({ step }: SlideProps) {
  const s = stepper(steps, step);
  const b = useBeats(step, s.idx("malik"), [T.malik, T.bubble]);
  return (
    <div className="absolute inset-0">
      {/* the thanks, centred, in the deck's Arabic face; on screen from the start */}
      <div className="absolute inset-x-[110px] flex justify-center" style={{ top: 210 }}>
        <h1 className="m-0 text-center text-[120px] font-black leading-[1.25]" style={{ color: D.mist }}>
          {S29.thanks}
        </h1>
      </div>

      {/* Malik rises from the bottom of the slide, gently, and stays */}
      <div className="absolute overflow-hidden" style={{ left: CHAR.cx - CHAR.w, width: CHAR.w * 2, top: 0, bottom: 0 }}>
        <div
          className="absolute"
          style={{
            left: CHAR.w / 2,
            bottom: CHAR.bottom,
            opacity: b >= 1 ? 1 : 0,
            transform: b >= 1 ? "none" : `translateY(${CHAR.h + CHAR.bottom + 40}px)`,
            transition: `transform 1.1s ${EASE}, opacity .5s ease`,
          }}
        >
          <WamdaActor look="orange" act="idle" scale={CHAR.scale} glow />
        </div>
      </div>

      {/* his bubble above his head; the tail comes down onto the hood */}
      <div className="absolute" style={{ left: BUBBLE.left, bottom: BUBBLE.bottom }}>
        {b >= 2 && <SpeechBubble key="questions" text={S29.bubble} effect="type" tone="orange" tail="end" fontSize={BUBBLE.font} maxWidth={BUBBLE.maxWidth} />}
      </div>
    </div>
  );
}
