"use client";

import { T, type LabProps } from "../tokens";
import { Wamda, type WamdaClip } from "../wamda/Wamda";
import { SpeechBubble, type BubbleEffect } from "../wamda/SpeechBubble";
import { useStep } from "../kit/steps";

const POSE: WamdaClip[] = ["think", "shrug", "wave", "idle"];

export function SpeechBubbleDemo({ step, replay = 0, effect = "type", first = "" }: LabProps & { effect?: string; first?: string }) {
  const s = useStep(4, step, replay);
  // demonstration lines: replace them with the workshop's own
  const lines = [first || "…", "وش اللي يصير لو ما عدّلت الملف بنفسك؟", "لحظة! قبل ما نكمل، وين حطيت الملف؟", "أنا أنسخ وألصق عنك؟ لا، أنا أشتغل داخله."];
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 38% 70%, #16262b 0%, ${T.ink} 70%)` }}>
      <div className="absolute bottom-[110px] left-[380px]">
        <Wamda key={POSE[s]} clip={POSE[s]} mode="color" scale={7} />
      </div>
      <div className="absolute left-[360px] top-[120px]">
        <SpeechBubble text={lines[s]} effect={effect as BubbleEffect} interrupt={s === 2} tail="end" fontSize={50} maxWidth={1100} />
      </div>
    </div>
  );
}
