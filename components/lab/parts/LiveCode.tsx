"use client";

import { useEffect, useState } from "react";
import { T, MONO, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";

const DURATIONS = ["1.2s", "0.4s", "2.4s"];
const EASES = ["ease-out", "steps(6)", "cubic-bezier(.7,0,.2,1)"];
const WORDS = ["ينفّذ", "يبدع", "يقرأ"];
// per stage, which option of each token is selected
const PRESET = [
  { d: 0, e: 0, w: 0 },
  { d: 1, e: 0, w: 0 },
  { d: 1, e: 1, w: 0 },
  { d: 1, e: 1, w: 1 },
];

/** A token you can change: click it and the design changes with it. */
function Tok({ children, hot, onClick, label }: { children: string; hot: boolean; onClick: () => void; label: string }) {
  return (
    <button
      key={children}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className="rounded-[6px] px-[6px] text-inherit underline decoration-dotted decoration-[2px] underline-offset-[6px] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7a00]"
      style={{ color: T.orangeSoft, animation: hot ? "lab-flash 1.2s both" : undefined, fontFamily: "inherit" }}
    >
      {children}
    </button>
  );
}

export function LiveCode({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3800);
  const [v, setV] = useState(PRESET[0]);
  const [hot, setHot] = useState<"d" | "e" | "w" | null>(null);
  useEffect(() => {
    setV((old) => {
      const p = PRESET[s];
      setHot(p.d !== old.d ? "d" : p.e !== old.e ? "e" : p.w !== old.w ? "w" : null);
      return p;
    });
  }, [s, replay]);
  const cycle = (k: "d" | "e" | "w", n: number) => {
    setHot(k);
    setV((o) => ({ ...o, [k]: (o[k] + 1) % n }));
  };
  const dur = DURATIONS[v.d];
  const ease = EASES[v.e];
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-[90px] top-[130px] h-[780px] w-[840px] rounded-[20px] p-[38px]" style={{ background: T.panel, border: `1.5px solid ${T.line}` }}>
        <div className="mb-[22px] flex items-center justify-between text-[22px]" style={{ color: T.dim }}>
          <span dir="ltr" style={{ fontFamily: MONO }}>bars.css</span>
          <span>اضغط على القيمة المُسطَّرة</span>
        </div>
        <pre dir="ltr" className="m-0 whitespace-pre-wrap" style={{ fontFamily: MONO, fontSize: 30, lineHeight: 2, color: T.sage }}>
          {".bar {\n  animation: grow "}
          <Tok hot={hot === "d"} onClick={() => cycle("d", 3)} label="المدة">{dur}</Tok>
          {" "}
          <Tok hot={hot === "e"} onClick={() => cycle("e", 3)} label="المنحنى">{ease}</Tok>
          {" infinite alternate;\n  background: #ff7a00;\n}\n\n.label::after {\n  content: \""}
          <Tok hot={hot === "w"} onClick={() => cycle("w", 3)} label="الكلمة">{WORDS[v.w]}</Tok>
          {"\";\n}"}
        </pre>
      </div>

      {/* what the code does, live */}
      <div className="absolute right-[90px] top-[130px] flex h-[780px] w-[840px] flex-col items-center justify-center gap-[56px] rounded-[20px]" style={{ background: T.panel2, border: `1.5px solid ${T.line}` }}>
        <div className="flex h-[360px] items-end gap-[30px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={`${dur}${ease}${i}`} className="h-full w-[90px] origin-bottom rounded-[10px]" style={{ background: T.orange, animation: `lab-grow ${dur} ${ease} ${i * 0.12}s infinite alternate`, opacity: 0.55 + i * 0.11 }} />
          ))}
        </div>
        <p className="text-[72px] font-black" style={{ color: T.mist }}>
          عقل يبدع، ووكيل <span key={WORDS[v.w]} className="inline-block" style={{ color: T.orange, animation: "lab-word .5s both" }}>{WORDS[v.w]}</span>
        </p>
      </div>
    </div>
  );
}
