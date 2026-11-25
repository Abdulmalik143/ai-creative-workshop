"use client";

import { useEffect, useState } from "react";
import { T } from "../tokens";
import { bubbleFont } from "./bubbleFont";

export type BubbleEffect = "type" | "words" | "blur";

/** stepped corners, so the bubble belongs with the pixel-art character */
const NOTCH = 14;
const clip = `polygon(${NOTCH}px 0, calc(100% - ${NOTCH}px) 0, calc(100% - ${NOTCH}px) ${NOTCH / 2}px, 100% ${NOTCH / 2}px, 100% calc(100% - ${NOTCH / 2}px), calc(100% - ${NOTCH}px) calc(100% - ${NOTCH / 2}px), calc(100% - ${NOTCH}px) 100%, ${NOTCH}px 100%, ${NOTCH}px calc(100% - ${NOTCH / 2}px), 0 calc(100% - ${NOTCH / 2}px), 0 ${NOTCH / 2}px, ${NOTCH}px ${NOTCH / 2}px)`;

function Typed({ text, cps = 26 }: { text: string; cps?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setN(text.length);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.floor((Math.max(0, now - t0) / 1000) * cps));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps]);
  return (
    <>
      {text.slice(0, n)}
      <span className="mr-[2px] inline-block h-[0.9em] w-[0.28em] translate-y-[0.12em] bg-current" style={{ animation: n >= text.length ? "lab-caret 0.9s steps(1) infinite" : "none" }} />
    </>
  );
}

export type SpeechBubbleProps = {
  text: string;
  effect?: BubbleEffect;
  /** an interruption: orange, shakes, carries a "!" */
  interrupt?: boolean;
  /** which side the tail points to */
  tail?: "start" | "end";
  /** colour of the bubble. Defaults to orange for an interruption and light otherwise.
   *  Use "light" for an interruption by the silhouette, before Wamda's colours are revealed. */
  tone?: "light" | "orange";
  fontSize?: number;
  maxWidth?: number;
};

/** The character's speech. Change `text` (or `key` it) and the effect plays again. */
export function SpeechBubble({ text, effect = "type", interrupt = false, tail = "end", tone, fontSize = 44, maxWidth = 900 }: SpeechBubbleProps) {
  const orange = (tone ?? (interrupt ? "orange" : "light")) === "orange";
  const bg = orange ? T.orange : T.mist;
  const ink = orange ? "#1a0c00" : T.ink;
  const words = text.split(/\s+/);
  return (
    <div
      key={text + interrupt}
      className="relative inline-block"
      style={{ maxWidth, animation: interrupt ? "lab-pop .35s cubic-bezier(.2,.8,.2,1) both, lab-shake .5s .3s both" : "lab-pop .4s cubic-bezier(.2,.8,.2,1) both" }}
    >
      {/* the speech itself is set in the pixel face; the "!" badge and the rest of the slide are not */}
      <div className={`${bubbleFont.className} relative px-[44px] py-[30px] leading-[1.45]`} style={{ background: bg, color: ink, fontSize, clipPath: clip, fontSynthesis: "none" }}>
        {effect === "type" && <Typed text={text} />}
        {effect === "words" &&
          words.map((w, i) => (
            <span key={i} className="inline-block" style={{ animation: `lab-word .5s ${i * 0.11}s both cubic-bezier(.2,.8,.2,1)`, marginInlineEnd: "0.3em" }}>
              {w}
            </span>
          ))}
        {effect === "blur" && <span className="inline-block" style={{ animation: "lab-blur .9s both ease-out" }}>{text}</span>}
      </div>
      {/* the tail: three squares stepping toward the speaker */}
      <div className="absolute -bottom-[26px] flex flex-col gap-0" style={{ [tail === "end" ? "left" : "right"]: 70, alignItems: tail === "end" ? "flex-start" : "flex-end" }} aria-hidden>
        <span className="block h-[10px] w-[30px]" style={{ background: bg }} />
        <span className="block h-[8px] w-[18px]" style={{ background: bg, marginInline: tail === "end" ? 0 : 0 }} />
        <span className="block h-[8px] w-[8px]" style={{ background: bg }} />
      </div>
      {interrupt && (
        <span className="absolute -top-[22px] flex h-[52px] w-[52px] items-center justify-center text-[40px] font-black" style={{ background: orange ? T.mist : T.ink, color: orange ? T.orange : T.mist, [tail === "end" ? "right" : "left"]: 24, clipPath: clip }} aria-hidden>
          !
        </span>
      )}
    </div>
  );
}
