"use client";

import { T, type LabProps } from "../tokens";
import { Wamda, type WamdaClip } from "../wamda/Wamda";

/** One question, nothing else: the answer is for the room to give. The words arrive one by one so the presenter can read along. */
export function InteractiveQuestion({ replay = 0, question = "", pose = "think" }: LabProps & { question?: string; pose?: string }) {
  const words = (question || "…").split(/\s+/);
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <h1 key={question + replay} className="absolute right-[150px] top-[250px] m-0 w-[1180px] text-[96px] font-black leading-[1.35]" style={{ color: T.mist }}>
        {words.map((w, i) => (
          <span key={i} className="inline-block" style={{ animation: `lab-word .6s ${0.25 + i * 0.13}s both cubic-bezier(.2,.8,.2,1)`, marginInlineEnd: "0.28em" }}>
            {w}
          </span>
        ))}
      </h1>
      {pose !== "none" && (
        <div className="absolute bottom-[120px] left-[170px]">
          <Wamda key={pose} clip={pose as WamdaClip} mode="color" scale={5.6} />
        </div>
      )}
    </div>
  );
}
