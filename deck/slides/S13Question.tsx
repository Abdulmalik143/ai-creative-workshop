"use client";

import { S13 } from "../content/copy";
import { D } from "../theme";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = [{ key: "question", label: "السؤال فقط" }];

/** The question, and nothing that hints at the answer: the room answers it. */
export default function S13Question(_: SlideProps) {
  // consecutive Latin words stay in one box, or RTL layout would swap them ("Design System")
  const words = S13.question.split(/\s+/).reduce<string[]>((acc, w) => {
    const latin = /^[A-Za-z]+[?؟»]*$/.test(w);
    if (latin && acc.length && /^[A-Za-z ]+$/.test(acc[acc.length - 1])) acc[acc.length - 1] += ` ${w}`;
    else acc.push(w);
    return acc;
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center px-[200px]">
      <h1 className="m-0 text-center text-[92px] font-black leading-[1.4]" style={{ color: D.mist }}>
        {words.map((w, i) => (
          <span key={i} dir="auto" className="inline-block" style={{ animation: `lab-word .6s ${0.2 + i * 0.09}s both cubic-bezier(.2,.8,.2,1)`, marginInlineEnd: "0.26em", color: /Figma|Design|System/.test(w) ? D.sky : undefined }}>
            {w}
          </span>
        ))}
      </h1>
    </div>
  );
}
