"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { S27, TRACK } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show, Typed } from "../kit/Show";
import { Icon, SlideTitle } from "../kit/ui";
import { Pointer, type Waypoint } from "../kit/Pointer";
import { AgentLine, AppWindow, AskBubble, FlowRail, TrackBody, type FlowState } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "refs", label: "شعار Chrome وChrome DevTools MCP مع ملاحظة الإضافة، ثم مسار الـWorkflow" },
  { key: "run", label: "المحاكاة: الطلب، يفتح المتصفح، يزور الرابط، يعبّي الحقول، ويتوقف عند المراجعة" },
];

const RAIL = { x: 210, y: 600, w: 1500, lift: 410 };
/** first click: the official Chrome logo centred right under the title, the tool's name, a small note; then the path */
const TOOL = { top: 168, logo: 210, name: 58, note: 28 };
const INTRO = [100, 380, 640, 1250]; // logo, name, note, then the path fades in where it always sits
const BR = { x: 110, y: 300, w: 1110, h: 720 };
const CX = { x: 1250, y: 300, w: 560, h: 720 };
const BODY = BR.y + 50;
const ADDR = { y: BODY + 14, h: 52 };
const FORM = { x: 345, w: 640, y: BODY + 190, row: 78, gap: 18, label: 170 };
const rowY = (i: number) => FORM.y + i * (FORM.row + FORM.gap);
const INPUT_CX = FORM.x + (FORM.w - FORM.label) / 2;
const SUBMIT = { y: rowY(4) + 14, w: 220, h: 64 };

const START = 1600; // the agent starts once the request is in
const ROUTE: Waypoint[] = [
  { x: CX.x + 220, y: CX.y + 470, at: 0 },
  { x: 640, y: 660, at: 700, click: true }, // open the browser
  { x: 560, y: ADDR.y + ADDR.h / 2, at: 1500, click: true }, // the address bar
  ...[0, 1, 2, 3].map((i) => ({ x: INPUT_CX, y: rowY(i) + FORM.row / 2, at: 2900 + i * 900, click: true })),
  { x: FORM.x + FORM.w + 40, y: SUBMIT.y + 34, at: 6500 }, // stops next to «إرسال», never clicks it
];
const at = (i: number) => START + ROUTE[i].at + 60;
const B = { ask: 100, start: START, open: at(1), addr: at(2), page: at(2) + 900, f0: at(3), f1: at(4), f2: at(5), f3: at(6), review: START + 6500 };

/**
 * Data entry with Codex and Chrome DevTools MCP. The setup links and the five-step path come first; one click
 * then plays the whole job in a simulated Codex panel next to a simulated browser: the request, the browser
 * opening, the visit to a demo address, the fields filled one by one with made-up data, and a stop at review.
 * Nothing is submitted, and nothing here is a live MCP connection.
 */
export default function S27DataEntry({ step }: SlideProps) {
  const s = stepper(steps, step);
  const run = s.at("run");
  const intro = useBeats(step, s.idx("refs"), INTRO);
  const b = useBeats(step, s.idx("run"), [B.ask, B.start, B.open, B.addr, B.page, B.f0, B.f1, B.f2, B.f3, B.review]);
  // b: 1 ask, 2 agent moves, 3 browser open, 4 address, 5 page, 6–9 fields, 10 review
  const now = !run ? -1 : b >= 10 ? 4 : b >= 6 ? 3 : b >= 4 ? 2 : b >= 2 ? 1 : 0;
  const state = (i: number): FlowState => (i < now ? "done" : i === now ? "now" : "todo");
  const status = b >= 10 ? 3 : b >= 6 ? 2 : b >= 4 ? 1 : b >= 2 ? 0 : -1;
  const review = b >= 10;

  return (
    <div className="absolute inset-0">
      {/* the line under the track name waits for the end of the flow */}
      <SlideTitle sub={<span style={{ opacity: review ? 1 : 0, transition: "opacity .7s ease" }}>{S27.sub}</span>}>{TRACK.data}</SlideTitle>
      <TrackBody>

      {/* the tool first: the Chrome logo, its name, and where to add it (no steps, no link); it leaves when the run starts */}
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: TOOL.top, opacity: run ? 0 : 1, transform: run ? "translateY(-40px)" : "none", transition: `opacity .4s ease, transform .6s ${EASE}`, pointerEvents: "none" }}>
        <Show on={intro >= 1} from="scale" dur={700}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/deck/logos/tools/chrome.svg" alt="Google Chrome" width={TOOL.logo} height={TOOL.logo} draggable={false} style={{ width: TOOL.logo, height: TOOL.logo }} />
        </Show>
        <Show on={intro >= 2} from="up" className="mt-[26px]">
          <span dir="ltr" className="block font-black leading-[1.1]" style={{ fontSize: TOOL.name, color: D.paper }}>
            {S27.tool.name}
          </span>
        </Show>
        <Show on={intro >= 3} from="up" className="mt-[14px]">
          <p dir="rtl" className="m-0 text-center font-medium leading-[1.4]" style={{ fontSize: TOOL.note, color: D.mist }}>
            {S27.tool.note}
          </p>
        </Show>
      </div>

      {/* the path: under the tool first (after it), then up top while the simulation runs */}
      <div className="absolute inset-0" style={{ opacity: intro >= 4 ? 1 : 0, transform: run ? `translateY(${-RAIL.lift}px)` : "none", transition: `opacity .6s ease, transform .7s ${EASE}` }}>
        <FlowRail items={S27.flow} state={state} x={RAIL.x} y={RAIL.y} w={RAIL.w} h={74} gap={40} size={25} />
      </div>

      <div className="absolute inset-0" style={{ opacity: run ? 1 : 0, transition: "opacity .5s ease", pointerEvents: "none" }}>
        {/* Codex */}
        <AppWindow x={CX.x} y={CX.y} w={CX.w} h={CX.h} title="Codex" logo="/deck/logos/tools/codex.png" bar="#18181b" body="#0f0f11" border="#2e2e33">
          <div dir="rtl" className="flex h-full flex-col gap-[16px] p-[22px]">
            <AskBubble on={b >= 1} size={25} text={<Typed text={S27.ask} play={b >= 1} cps={34} caret={false} />} />
            <Show on={b >= 1} from="up" delay={900} className="flex flex-col gap-[8px] rounded-[16px] p-[16px]" style={{ background: "#18181b", border: "1px solid #2e2e33" }}>
              <span dir="ltr" className="text-right text-[19px] font-bold" style={{ color: D.sky, fontFamily: MONO }}>
                {S27.url}
              </span>
              <span className="text-[18px] font-bold" style={{ color: D.dim }}>
                {S27.data}
              </span>
              {S27.fields.map((f) => (
                <span key={f.label} className="flex justify-between text-[19px]" style={{ color: D.text }}>
                  <span>{f.label}</span>
                  <span dir={f.latin ? "ltr" : undefined} style={{ fontFamily: f.latin ? MONO : undefined }}>
                    {f.value}
                  </span>
                </span>
              ))}
            </Show>
            <div className="mt-[6px] flex flex-col gap-[14px]">
              {S27.status.map((t, i) => (
                <AgentLine key={t} text={t} on={status >= i} done={status > i || (i === 3 && review)} size={22} />
              ))}
            </div>
          </div>
        </AppWindow>

        {/* the browser opens where the agent clicked */}
        <div className="absolute inset-0" style={{ opacity: b >= 3 ? 1 : 0, transform: b >= 3 ? "none" : "scale(.6)", transformOrigin: "640px 660px", transition: `opacity .35s ease, transform .55s ${EASE}` }}>
          <AppWindow x={BR.x} y={BR.y} w={BR.w} h={BR.h} title="Browser" bar="#1f2228" body="#f3f5f8" border="#2f343c">
            <div className="absolute inset-x-0 top-0 flex items-center gap-[12px] px-[18px]" style={{ height: ADDR.h + 28, background: "#e6e9ee", borderBottom: "1px solid #cfd5dd" }}>
              <div dir="ltr" className="flex flex-1 items-center rounded-full px-[22px] text-[22px]" style={{ height: ADDR.h, background: "#fff", border: `2px solid ${b === 4 ? D.agent : "#cfd5dd"}`, color: "#1b2330", fontFamily: MONO }}>
                <Typed text={S27.url} play={b >= 4} cps={22} caret={b === 4} />
              </div>
            </div>
          </AppWindow>
          {/* the demo page */}
          <div className="absolute" style={{ left: FORM.x, top: FORM.y - 80, width: FORM.w, opacity: b >= 5 ? 1 : 0, transition: "opacity .4s ease" }}>
            <span className="text-[36px] font-black" style={{ color: "#141a24" }}>
              {S27.formTitle}
            </span>
          </div>
          {S27.fields.map((f, i) => {
            const filled = b >= 6 + i;
            const focus = b === 6 + i;
            return (
              <div key={f.label} dir="rtl" className="absolute flex items-center" style={{ left: FORM.x, top: rowY(i), width: FORM.w, height: FORM.row, opacity: b >= 5 ? 1 : 0, transition: `opacity .4s ease ${i * 80}ms` }}>
                <span className="text-right text-[24px] font-bold" style={{ width: FORM.label, color: "#3a4554" }}>
                  {f.label}
                </span>
                <div
                  className="flex h-[62px] flex-1 items-center rounded-[12px] px-[18px] text-[24px]"
                  style={{ background: "#fff", border: `2px solid ${focus ? D.agent : review ? "#2fb36b" : "#c6ced8"}`, color: "#141a24", boxShadow: focus ? `0 0 0 4px ${D.agent}33` : "none", transition: "border-color .3s, box-shadow .3s" }}
                >
                  <span dir={f.latin ? "ltr" : "rtl"} className="flex-1" style={{ fontFamily: f.latin ? MONO : undefined, textAlign: f.latin ? "left" : "right" }}>
                    <Typed text={f.value} play={filled} cps={26} caret={focus} />
                  </span>
                  {review && <Icon icon={CheckmarkCircle02Icon} size={28} color="#2fb36b" stroke={2} />}
                </div>
              </div>
            );
          })}
          <div dir="rtl" className="absolute flex items-center gap-[18px]" style={{ left: FORM.x, width: FORM.w, top: SUBMIT.y, opacity: b >= 5 ? 1 : 0, transition: "opacity .4s ease" }}>
            <span className="flex items-center justify-center rounded-[14px] text-[26px] font-black" style={{ width: SUBMIT.w, height: SUBMIT.h, color: "#fff", background: review ? "#1e3fd8" : "#9aa6b5", outline: review ? `3px dashed ${D.agent}` : "none", outlineOffset: 6 }}>
              {S27.submit}
            </span>
            <Show on={review} from="pop" className="rounded-full px-[18px] py-[8px] text-[22px] font-black" style={{ background: D.agent, color: D.agentInk }}>
              {S27.review}
            </Show>
          </div>
        </div>
      </div>

      <Pointer path={ROUTE} play={s.is("run") && b >= 2} done={false} />
      </TrackBody>
    </div>
  );
}
