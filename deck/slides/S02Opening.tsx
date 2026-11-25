"use client";

import { Fragment } from "react";
import { S02 } from "../content/copy";
import { D } from "../theme";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = [{ key: "question", label: "السؤال الافتتاحي للقاعة" }];

/** the words drawn in the human colour, like the subject of slide 13's question */
const ACCENT = /^(ذكاء|اصطناعي)$/;
/** the term that never breaks across the two lines */
const TERM = ["ذكاء", "اصطناعي"];

/**
 * Size on the 1920×1080 stage. The whole question needs ~23 em on one line (≈2900px at this size), wider than any
 * slide, so it always sets as two lines; the stage scales as one piece, so the break is the same on every screen.
 * 124px is the largest size whose longer line («لو بنهديك اشتراك ذكاء اصطناعي», ≈13.9 em ≈ 1720px) still fits
 * the text box with ~100px of air on each side (inside a projector's 90% title-safe width).
 */
const TYPE = { size: 124, side: 90 };

/**
 * Opening: one question to the room, alone in the middle and nothing else (no answers on the slide).
 * The deck's own treatment for questions to the audience (as on slide 13): very large, centred, words arriving one
 * after another, the subject in sky. Real spaces (not margins) between the words, so `text-wrap: balance` can even
 * the two lines and each line centres on its ink; «ذكاء اصطناعي» is held together so the accent never splits.
 */
export default function S02Opening(_: SlideProps) {
  const words = S02.question.split(/\s+/);
  const units: { words: string[]; from: number }[] = [];
  words.forEach((w, i) => {
    const last = units[units.length - 1];
    if (last && w === TERM[1] && last.words[last.words.length - 1] === TERM[0]) last.words.push(w);
    else units.push({ words: [w], from: i });
  });
  const word = (w: string, i: number) => (
    <span key={i} className="inline-block" style={{ animation: `lab-word .6s ${0.2 + i * 0.09}s both cubic-bezier(.2,.8,.2,1)`, color: ACCENT.test(w) ? D.sky : undefined }}>
      {w}
    </span>
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ paddingInline: TYPE.side }}>
      <h1 className="m-0 w-full text-center font-black leading-[1.35] text-balance" style={{ fontSize: TYPE.size, color: D.mist }}>
        {units.map((u, k) => (
          <Fragment key={u.from}>
            {k > 0 && " "}
            {u.words.length === 1 ? (
              word(u.words[0], u.from)
            ) : (
              <span className="whitespace-nowrap">
                {u.words.map((w, j) => (
                  <Fragment key={j}>
                    {j > 0 && " "}
                    {word(w, u.from + j)}
                  </Fragment>
                ))}
              </span>
            )}
          </Fragment>
        ))}
      </h1>
    </div>
  );
}
