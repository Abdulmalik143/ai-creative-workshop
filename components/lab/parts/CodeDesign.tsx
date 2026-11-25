"use client";

import { T, MONO, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";

type Line = { text: string; hot?: boolean };

/** What the "model" has written by each stage. The preview below is styled from these same values, so code and design never disagree. */
function build(s: number) {
  const v = {
    bg: s >= 2 ? "#070b0e" : "#ffffff",
    fg: s >= 2 ? "#f2f5f5" : "#000000",
    accent: s >= 2 ? "#ff7a00" : "currentColor",
    pad: s >= 3 ? 56 : 16,
    radius: s >= 3 ? 28 : 0,
    h1: s >= 3 ? 52 : 18,
    p: s >= 3 ? 30 : 14,
    width: s >= 3 ? 780 : 640,
    shadow: s >= 4 ? "0 30px 80px rgba(0,0,0,.5)" : "none",
    border: s >= 4 ? "1px solid rgba(179,196,198,.3)" : "none",
  };
  const html: Line[] = [];
  if (s >= 1) html.push({ text: '<section class="card">', hot: s === 1 }, { text: '  <img class="logo" src="rakaya.svg">', hot: s === 1 });
  const ind = s >= 1 ? "  " : "";
  html.push({ text: `${ind}<h1>الذكاء الاصطناعي في المجالات الإبداعية</h1>`, hot: s === 0 });
  if (s >= 1) html.push({ text: `${ind}<hr>`, hot: s === 1 });
  html.push({ text: `${ind}<p>عقل يبدع، ووكيل ينفّذ</p>`, hot: s === 0 });
  html.push({ text: `${ind}<small>تقديم: عبدالملك الهندي</small>`, hot: s === 0 });
  if (s >= 1) html.push({ text: "</section>", hot: s === 1 });

  const css: Line[] = [];
  if (s >= 2) {
    css.push({ text: ".card {" }, { text: `  background: ${v.bg};`, hot: s === 2 }, { text: `  color: ${v.fg};`, hot: s === 2 });
    if (s >= 3) css.push({ text: `  padding: ${v.pad}px;`, hot: s === 3 }, { text: `  border-radius: ${v.radius}px;`, hot: s === 3 }, { text: `  width: ${v.width}px;`, hot: s === 3 });
    if (s >= 4) css.push({ text: `  box-shadow: ${v.shadow};`, hot: true }, { text: `  border: ${v.border};`, hot: true });
    css.push({ text: "}" }, { text: `h1 { font-size: ${v.h1}px; }`, hot: s === 3 }, { text: `p  { color: ${v.accent}; font-size: ${v.p}px; }`, hot: s === 2 || s === 3 }, { text: `hr { border-color: ${v.accent}; }`, hot: s === 2 });
  }
  return { v, html, css };
}

const Code = ({ lines, color }: { lines: Line[]; color: string }) => (
  <div dir="ltr" style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.75, color }}>
    {lines.map((l, i) => (
      <div key={l.text} className="whitespace-pre rounded-[4px]" style={{ animation: l.hot ? `lab-fade .6s ${i * 0.07}s both, lab-flash 1.6s ${i * 0.07}s both` : undefined }}>
        {l.text || " "}
      </div>
    ))}
  </div>
);

export function CodeDesign({ step, replay = 0 }: LabProps) {
  const s = useStep(5, step, replay, 3000);
  const { v, html, css } = build(s);
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      {/* the code, as written so far */}
      <div className="absolute left-[80px] top-[90px] h-[900px] w-[860px] overflow-hidden rounded-[20px] p-[34px]" style={{ background: T.panel, border: `1.5px solid ${T.line}` }}>
        <div className="mb-[18px] flex items-center justify-between text-[22px]" style={{ color: T.dim }}>
          <span dir="ltr" style={{ fontFamily: MONO }}>cover.html</span>
          <span>{["نصوص", "عناصر", "ألوان", "أبعاد", "اكتمل"][s]}</span>
        </div>
        <Code key={`h${s}`} lines={html} color={T.sage} />
        {css.length > 0 && <div className="my-[22px] h-px" style={{ background: T.line }} />}
        <Code key={`c${s}`} lines={css} color={T.orangeSoft} />
      </div>

      {/* the design it produces */}
      <div className="absolute right-[80px] top-[90px] flex h-[900px] w-[860px] items-center justify-center overflow-hidden rounded-[20px]" style={{ background: "#e9eeee" }}>
        <section
          className="relative text-right"
          style={{
            width: v.width,
            padding: v.pad,
            borderRadius: v.radius,
            background: v.bg,
            color: v.fg,
            boxShadow: v.shadow,
            border: v.border,
            transition: "all .7s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {s >= 1 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/brand/rakaya.svg" alt="ركايا" className="mb-[24px]" style={{ height: s >= 4 ? 40 : 56, animation: "lab-fade .6s both", filter: s >= 2 ? "none" : "invert(1)" }} />
          )}
          <h1 className="m-0 font-black leading-[1.2]" style={{ fontSize: v.h1, transition: "font-size .7s cubic-bezier(.2,.8,.2,1)", fontFamily: s >= 2 ? undefined : "serif", fontWeight: s >= 2 ? 900 : 700 }}>
            الذكاء الاصطناعي في المجالات الإبداعية
          </h1>
          {s >= 1 && <hr className="my-[20px]" style={{ width: 120, borderColor: v.accent, borderWidth: 2, animation: "lab-fade .6s both" }} />}
          <p className="m-0 font-medium" style={{ fontSize: v.p, color: v.accent, transition: "all .7s", fontFamily: s >= 2 ? undefined : "serif" }}>
            عقل يبدع، ووكيل ينفّذ
          </p>
          <small className="mt-[14px] block" style={{ fontSize: s >= 3 ? 22 : 12, opacity: 0.8, fontFamily: s >= 2 ? undefined : "serif", transition: "all .7s" }}>
            تقديم: عبدالملك الهندي
          </small>
        </section>
      </div>
    </div>
  );
}
