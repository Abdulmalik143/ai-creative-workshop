"use client";

import { File02Icon, Folder01Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { S03 } from "../content/copy";
import { D, EASE, MONO, TYPE } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer, Stroke, sketchRect } from "../kit/Sketch";
import { Icon, SlideTitle, ToolBadge } from "../kit/ui";
import { Pointer, type Waypoint } from "../kit/Pointer";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "tools", label: "Chatbot وAI Agent وأدوات كل جهة بشعاراتها" },
  { key: "chatbot", label: "اليمين: مثل الفريلانسر، الشرح وديمو الشات" },
  { key: "agent", label: "اليسار: مثل الموظف، الشرح وديمو الوكيل" },
  { key: "closing", label: "استلام المخرجات vs العمل داخل المشروع" },
];

// columns (RTL: the chatbot reads first, on the right). Both columns share the same rows. Each side is revealed
// on its own click: its tool row fades out and its explanation fades in at the same place, while the other side
// stays exactly as it was.
const CB = { x: 1010, w: 800 };
const AG = { x: 110, w: 800 };
const NAME_Y = 214; // column titles, on one level
const TOOLS_Y = 300; // tool badges with logos, from the moment the slide opens
const EXPLAIN_Y = TOOLS_Y; // the side's analogy + line take the tools' place when that side is revealed
const ART_Y = 490; // top of the illustrations

const FILES = ["index.html", "styles.css", "components/", "assets/logo.svg", "pages/home.tsx"];
const ROW0 = ART_Y + 84;
const ROW_H = 42;
const WIN = { x: AG.x + 150, w: 500 };
// the agent's route through the project: it opens three related files and edits each one
const ROUTE: Waypoint[] = [
  { x: WIN.x + WIN.w + 120, y: ART_Y + 40, at: 0 },
  { x: WIN.x + 120, y: ROW0 + ROW_H * 1 + 18, at: 900, click: true },
  { x: WIN.x + 170, y: ROW0 + ROW_H * 3 + 18, at: 1700, click: true },
  { x: WIN.x + 160, y: ROW0 + ROW_H * 4 + 18, at: 2400, click: true },
  { x: WIN.x + 360, y: ROW0 + ROW_H * 1 + 10, at: 3100 },
];
const EDITED = [1, 3, 4];
/** ms after the click when the agent's pointer starts its route */
const POINTER_IN = 600;

export default function S03ChatbotVsAgent({ step }: SlideProps) {
  const s = stepper(steps, step);
  // each demo belongs to its own click; once past, it rests on its last frame and never replays
  const cb = useBeats(step, s.idx("chatbot"), [200, 900, 1700, 2500]);
  const ag = useBeats(step, s.idx("agent"), [200, POINTER_IN, ...ROUTE.filter((r) => r.click).map((r) => POINTER_IN + r.at + 120)]);
  const cbOn = s.at("chatbot");
  const agOn = s.at("agent");
  const edits = Math.max(0, ag - 2);

  return (
    <div className="absolute inset-0">
      <SlideTitle latin>
        {S03.title}
      </SlideTitle>

      {/* ---------- the two columns: title, then tools (always), then the explanation (next click) ---------- */}
      {[
        { col: CB, data: S03.chatbot, color: D.sky, from: "start" as const, on: cbOn },
        { col: AG, data: S03.agent, color: D.agent, from: "end" as const, on: agOn },
      ].map(({ col, data, color, from, on }) => (
        <div key={data.name}>
          <div className="absolute flex flex-col items-start" style={{ left: col.x, top: NAME_Y, width: col.w }}>
            <h2 dir="ltr" className="m-0 font-black leading-none" style={{ fontSize: TYPE.h2 + 4, color }}>
              {data.name}
            </h2>
          </div>
          <Show on={!on} from="fade" dur={450} className="absolute flex flex-wrap items-center justify-start gap-[12px]" style={{ left: col.x, top: TOOLS_Y, width: col.w }}>
            {data.examples.map((e) => (
              <ToolBadge key={e} name={e} color={color} />
            ))}
          </Show>
          <Show on={on} from={from} delay={on ? 250 : 0} className="absolute flex flex-col items-start gap-[10px]" style={{ left: col.x, top: EXPLAIN_Y, width: col.w }}>
            <span className="text-[34px] font-medium leading-tight" style={{ color: D.dim }}>
              {data.like}
            </span>
            <p className="m-0 text-[36px] font-bold leading-[1.4]" style={{ color: D.mist }}>
              {data.line}
            </p>
          </Show>
        </div>
      ))}

      {/* the chat window: a request goes in, a file comes back out */}
      <Show on={cbOn} from="up" delay={150} className="absolute" style={{ left: CB.x + 430, top: ART_Y, width: 370, height: 300 }}>
        <div className="h-full overflow-hidden rounded-[22px]" style={{ background: D.panel, border: `1.5px solid ${D.lineStrong}` }}>
          <div className="flex h-[46px] items-center gap-[8px] px-[18px]" style={{ background: D.panel2, borderBottom: `1px solid ${D.line}` }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[10px] w-[10px] rounded-full" style={{ background: "#26384a" }} />
            ))}
            <span dir="ltr" className="mr-auto text-[18px] font-bold" style={{ color: D.dim, fontFamily: MONO }}>
              chat
            </span>
          </div>
          <div className="flex flex-col gap-[16px] p-[20px]">
            <Show on={cb >= 1} from="pop" className="self-start rounded-[16px] rounded-tr-[4px] px-[20px] py-[10px] text-[26px] font-bold" style={{ background: D.sky, color: D.ink }}>
              {S03.art.request}
            </Show>
            <Show on={cb >= 2} from="pop" className="flex items-center gap-[12px] self-end rounded-[16px] rounded-tl-[4px] px-[18px] py-[12px]" style={{ background: D.panel3, border: `1px solid ${D.line}` }}>
              <Icon icon={File02Icon} size={34} color={D.sky} />
              <span className="text-[24px] font-bold" style={{ color: D.mist }}>
                {S03.art.output}
              </span>
            </Show>
          </div>
        </div>
      </Show>

      {/* your project, outside the chat: you carry the file in yourself */}
      <Show on={cbOn} from="fade" delay={300} className="absolute" style={{ left: CB.x, top: ART_Y + 40, width: 300, height: 260 }}>
        <svg className="absolute inset-0 overflow-visible" width={300} height={260} aria-hidden>
          <Stroke d={sketchRect(4, 4, 292, 252, 3)} color={D.dim} width={2.5} dash="10 10" draw={cbOn} />
        </svg>
        <div className="absolute right-[22px] top-[18px] flex items-center gap-[10px] text-[24px] font-bold" style={{ color: D.dim }}>
          <Icon icon={Folder01Icon} size={28} color={D.dim} />
          {S03.art.project}
        </div>
        <Show on={cb >= 4} from="down" className="absolute left-[60px] top-[110px] flex items-center gap-[12px] rounded-[14px] px-[18px] py-[12px]" style={{ background: D.panel3, border: `1.5px solid ${D.sky}` }}>
          <Icon icon={File02Icon} size={34} color={D.sky} />
          <span className="text-[24px] font-bold" style={{ color: D.mist }}>
            {S03.art.output}
          </span>
        </Show>
      </Show>
      <SketchLayer>
        <Arrow from={[CB.x + 470, ART_Y + 200]} to={[CB.x + 300, ART_Y + 170]} bend={-40} color={D.sky} width={4} draw={cb >= 3} seed={4} />
      </SketchLayer>

      {/* divider */}
      <div className="absolute left-[959px] top-[214px] h-[660px] w-[2px]" style={{ background: `linear-gradient(${D.line}, ${D.lineStrong}, ${D.line})` }} />

      {/* the project, with the agent working inside it */}
      <Show on={agOn} from="up" delay={150} className="absolute" style={{ left: WIN.x, top: ART_Y, width: WIN.w, height: 300 }}>
        <div className="h-full overflow-hidden rounded-[22px]" style={{ background: D.panel, border: `2px solid ${ag >= 2 ? D.agent : D.lineStrong}`, transition: "border-color .5s" }}>
          <div className="flex h-[52px] items-center gap-[12px] px-[22px] text-[24px] font-bold" style={{ background: D.panel2, borderBottom: `1px solid ${D.line}`, color: D.mist }}>
            <Icon icon={Folder01Icon} size={28} color={D.agent} />
            {S03.art.project}
          </div>
          <ul dir="ltr" className="m-0 list-none px-[14px] py-[12px]" style={{ fontFamily: MONO, fontSize: 22 }}>
            {FILES.map((f, i) => {
              const done = EDITED.indexOf(i) >= 0 && EDITED.indexOf(i) < edits;
              return (
                <li key={f} className="flex h-[42px] items-center justify-between rounded-[10px] px-[14px]" style={{ color: done ? D.mist : D.dim, background: done ? "rgba(255,122,0,.13)" : "transparent", transition: `all .4s ${EASE}` }}>
                  <span style={{ paddingLeft: f.includes("/") && !f.endsWith("/") ? 22 : 0 }}>{f}</span>
                  <span className="h-[12px] w-[12px] rounded-full" style={{ background: D.agent, opacity: done ? 1 : 0, transform: done ? "scale(1)" : "scale(.3)", transition: `all .35s ${EASE}` }} />
                </li>
              );
            })}
          </ul>
        </div>
      </Show>
      <Show on={ag >= 1} from="start" className="absolute flex items-center gap-[12px] rounded-[16px] px-[20px] py-[12px]" style={{ left: WIN.x + WIN.w + 34, top: ART_Y + 20, background: D.agent, color: D.agentInk }}>
        <Icon icon={Task01Icon} size={30} color={D.agentInk} />
        <span className="text-[26px] font-black">{S03.art.task}</span>
      </Show>
      <Pointer path={ROUTE} play={s.is("agent") && ag >= 2} done={s.past("agent")} />

      {/* ---------- closing ---------- */}
      <Show on={s.at("closing")} from="up" className="absolute inset-x-[110px] top-[918px] flex justify-start">
        <p className="m-0 flex items-baseline gap-[26px] rounded-full px-[48px] py-[20px] text-[46px] font-black leading-none" style={{ background: "rgba(5,8,13,.82)", border: `1.5px solid ${D.line}` }}>
          <span style={{ color: D.sky }}>{S03.closing.a}</span>
          <span dir="ltr" className="text-[32px]" style={{ color: D.dim, fontFamily: MONO }}>
            {S03.closing.vs}
          </span>
          <span style={{ color: D.agent }}>{S03.closing.b}</span>
        </p>
      </Show>
    </div>
  );
}
