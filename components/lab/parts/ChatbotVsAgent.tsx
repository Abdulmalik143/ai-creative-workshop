"use client";

import { T, MONO, type LabProps } from "../tokens";
import { Wamda } from "../wamda/Wamda";
import { useStep } from "../kit/steps";

const FILES = ["index.html", "style.css", "brand/logo.svg", "slides/01.html"];

function show(on: boolean, extra = "") {
  return { opacity: on ? 1 : 0, transform: on ? "none" : "translateY(18px)", transition: "opacity .5s ease, transform .6s cubic-bezier(.2,.8,.2,1)" + extra } as const;
}

function Project({ edited, active, inside }: { edited: boolean; active: boolean; inside: boolean }) {
  return (
    <div className="absolute left-0 top-0 h-[430px] w-[800px] overflow-hidden rounded-[18px]" style={{ background: T.panel, border: `1.5px solid ${inside ? T.orange : T.line}`, transition: "border-color .5s" }}>
      <div className="flex h-[54px] items-center justify-between px-[22px] text-[22px]" style={{ background: T.panel2, color: T.sage, borderBottom: `1px solid ${T.line}` }}>
        <span className="font-bold">المشروع</span>
        <span dir="ltr" style={{ fontFamily: MONO, fontSize: 18, color: T.dim }}>~/rakaya-workshop</span>
      </div>
      <div className="flex h-[376px]">
        <ul dir="ltr" className="w-[250px] flex-none py-[14px]" style={{ borderRight: `1px solid ${T.line}`, fontFamily: MONO, fontSize: 19 }}>
          {FILES.map((f, i) => (
            <li key={f} className="px-[22px] py-[9px] transition-colors duration-500" style={{ color: active && i === 1 ? T.mist : T.dim, background: active && i === 1 ? "rgba(255,122,0,.14)" : "transparent" }}>
              {f}
            </li>
          ))}
        </ul>
        <div dir="ltr" className="flex-1 px-[26px] py-[20px] leading-[1.9]" style={{ fontFamily: MONO, fontSize: 20, color: T.sage }}>
          <div>.hero {"{"}</div>
          <div className="relative">
            <span style={{ opacity: edited ? 0.3 : 1, textDecoration: edited ? "line-through" : "none", transition: "all .5s" }}>&nbsp;&nbsp;background: #1e3fd8;</span>
          </div>
          <div style={{ ...show(edited), color: T.orangeSoft }}>+&nbsp;background: #f2f5f5;</div>
          <div>&nbsp;&nbsp;padding: 64px;</div>
          <div>{"}"}</div>
          <div className="mt-[16px] text-[18px]" style={{ color: edited ? T.orange : T.dim, transition: "color .5s" }}>{edited ? "✓ style.css · عُدِّل" : "style.css · كما هو"}</div>
        </div>
      </div>
    </div>
  );
}

const Request = ({ on }: { on: boolean }) => (
  <div className="absolute left-[40px] top-0 rounded-[16px] px-[26px] py-[16px] text-[28px] font-bold" style={{ ...show(on), background: T.panel2, border: `1px solid ${T.line}`, color: T.mist }}>
    لوّن الصفحة بألوان ركايا
  </div>
);

export function ChatbotVsAgent({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay);
  const col = "absolute top-[210px] w-[800px]";
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <p className="absolute right-[100px] top-[70px] text-[64px] font-black leading-none" style={{ color: T.mist }}>
        الفرق بين الاثنين
      </p>

      {/* CHATBOT: a freelancer. Delivers a file. You carry it in. */}
      <section className={`${col} right-[100px]`} aria-label="Chatbot">
        <div className="mb-[26px] flex items-baseline gap-[18px]">
          <h2 className="text-[54px] font-black leading-none" dir="ltr" style={{ color: T.sage }}>Chatbot</h2>
          <span className="text-[30px]" style={{ color: T.dim }}>فريلانسر</span>
        </div>
        <div className="relative h-[620px]">
          <Request on={s >= 0} />
          {/* the freelancer's side of the wall */}
          <div className="absolute left-0 top-[96px] h-[430px] w-[800px]">
            <div className="absolute inset-0 rounded-[18px]" style={{ border: `1.5px dashed ${T.line}` }} />
            <div className="absolute left-[26px] top-[22px] text-[22px]" style={{ color: T.dim }}>خارج المشروع</div>
            <div className="absolute left-[26px] top-[70px] w-[420px] rounded-[14px] p-[22px] text-[19px] leading-[1.8]" dir="ltr" style={{ ...show(s >= 1), background: T.panel, border: `1.5px solid ${T.lineStrong}`, fontFamily: MONO, color: T.sage }}>
              <div style={{ color: T.dim }}>// output.css</div>
              <div>.hero {"{"} background: #f2f5f5; {"}"}</div>
              <div className="mt-[12px] text-[17px]" style={{ color: T.dim }}>⬇ output.zip</div>
            </div>
            <div className="absolute right-[30px] top-[78px] text-[24px] font-bold" style={{ ...show(s >= 2), color: T.orangeSoft }}>
              ينتظر أن تنقله بنفسك
              <svg width="240" height="60" viewBox="0 0 240 60" className="mt-[8px]" fill="none" stroke={T.orangeSoft} strokeWidth="3" strokeDasharray="8 8" aria-hidden>
                <path d="M230 30 H10 M30 10 L10 30 L30 50" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-[10px] left-0 text-[38px] font-black" style={{ ...show(s >= 3), color: T.mist }}>يسلّم المخرجات</div>
        </div>
      </section>

      {/* AGENT: an employee. Works inside the project. */}
      <section className={`${col} left-[100px]`} aria-label="AI Agent">
        <div className="mb-[26px] flex items-baseline gap-[18px]">
          <h2 className="text-[54px] font-black leading-none" dir="ltr" style={{ color: T.orange }}>AI Agent</h2>
          <span className="text-[30px]" style={{ color: T.dim }}>موظف</span>
        </div>
        <div className="relative h-[620px]">
          <Request on={s >= 0} />
          <div className="absolute left-0 top-[96px]">
            <Project edited={s >= 2} active={s >= 1} inside={s >= 1} />
          </div>
          <div className="absolute right-[18px] top-[338px]" style={show(s >= 1)}>
            <Wamda clip={s >= 2 ? "idle" : "run"} mode="color" scale={2.6} flip />
          </div>
          <div className="absolute -bottom-[10px] left-0 text-[38px] font-black" style={{ ...show(s >= 3), color: T.orange }}>يعمل داخل الملفات</div>
        </div>
      </section>

      <div className="absolute inset-y-[210px] left-1/2 w-px" style={{ background: T.line }} />
    </div>
  );
}
