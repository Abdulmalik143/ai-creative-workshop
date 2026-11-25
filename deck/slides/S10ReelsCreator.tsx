"use client";

import { ColorsIcon, File02Icon, Folder01Icon, Image01Icon, PaintBoardIcon, TextFontIcon, Video01Icon } from "@hugeicons/core-free-icons";
import { S10 } from "../content/copy";
import { D, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Arrow, SketchLayer, Stroke, sketchCurve } from "../kit/Sketch";
import { Icon, SlideTitle, type IconSvgElement } from "../kit/ui";
import { Pointer, type Waypoint } from "../kit/Pointer";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "company", label: "نقطة البداية: سكيل الشركة وملف SKILL.md" },
  { key: "routes", label: "SKILL.md يوجّه الوكيل: Video Skill وImage Skill" },
  { key: "example", label: "مثال: «سوِّ لي ريل بهوية الشركة» ← Video Skill" },
];

/**
 * One company skill is where the agent starts. Its SKILL.md says when to go to a specialised skill, and those
 * skills live elsewhere: nothing merges, nothing calls anything automatically. The agent reads, then goes.
 * Layout (RTL hub): the company skill in the middle, the specialised skills on the left, the request on the right,
 * the result under the company skill.
 */
const FOLDER = { x: 640, y: 262, w: 760, h: 430 };
const MD = { x: FOLDER.x + 30, y: FOLDER.y + 30, w: FOLDER.w - 60, h: 150 };
const CARDS_Y = MD.y + MD.h + 20;
const SKILL = { x: 110, w: 340, h: 190 };
const SKILL_Y = { video: 280, image: 510 };
const REQUEST = { x: 1416, y: 300, w: 394 };
const RESULT = { x: 640, y: 760, w: 760, h: 250 };

const BRAND_ICONS: IconSvgElement[] = [PaintBoardIcon, ColorsIcon, Image01Icon, TextFontIcon];

// where each routing rule leaves SKILL.md, and where its arrow lands on the skill
const RULE_Y = { video: MD.y + 98, image: MD.y + 130 };
const ROUTE_TO = { video: { x: SKILL.x + SKILL.w + 8, y: SKILL_Y.video + 95 }, image: { x: SKILL.x + SKILL.w + 8, y: SKILL_Y.image + 95 } };

// the agent's path in the example: from the request, into SKILL.md, out to Video Skill, then to the result
const POINTER_IN = 500;
const PATH: Waypoint[] = [
  { x: REQUEST.x - 10, y: REQUEST.y + 110, at: 0 },
  { x: MD.x + MD.w - 90, y: MD.y + 40, at: 800, click: true },
  { x: ROUTE_TO.video.x - 60, y: ROUTE_TO.video.y - 20, at: 2000, click: true },
  { x: RESULT.x + 190, y: RESULT.y + 120, at: 3200, click: true },
  { x: RESULT.x + 250, y: RESULT.y + 170, at: 3600 },
];
const HIT = PATH.filter((p) => p.click).map((p) => POINTER_IN + p.at + 60);

/** an identity card, as it was on this slide before (paper, icon, label) */
function Doc({ icon, label }: { icon: IconSvgElement; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[10px] rounded-[14px] p-[10px] text-center" style={{ background: D.paper }}>
      <Icon icon={icon} size={52} color={D.cobalt} stroke={1.8} />
      <span className="text-[23px] font-black leading-[1.2]" style={{ color: D.ink }}>
        {label}
      </span>
    </div>
  );
}

export default function S10ReelsCreator({ step }: SlideProps) {
  const s = stepper(steps, step);
  const ex = useBeats(step, s.idx("example"), [60, POINTER_IN, HIT[0], HIT[0] + 300, HIT[1], HIT[2]]);
  const routesOn = s.at("routes");
  const example = s.at("example");
  const read = ex >= 3; // the agent has read SKILL.md
  const lit = ex >= 4; // the video route is chosen
  const atVideo = ex >= 5;
  const done = ex >= 6;

  const route = (id: "video" | "image") => {
    const on = example ? id === "video" && lit : routesOn;
    const quiet = example && id === "image";
    return { on, quiet };
  };

  return (
    <div className="absolute inset-0">
      <SlideTitle>{S10.title}</SlideTitle>

      {/* ---------- the company skill: the entry point ---------- */}
      <div className="absolute flex justify-end" style={{ left: FOLDER.x, width: FOLDER.w, top: FOLDER.y - 50 }}>
        <span className="rounded-full px-[20px] py-[8px] text-[24px] font-bold leading-none" style={{ color: D.agentSoft, border: `1.5px solid ${D.agent}66` }}>
          {S10.start}
        </span>
      </div>
      <div className="absolute" style={{ left: FOLDER.x, top: FOLDER.y, width: FOLDER.w, height: FOLDER.h }}>
        {/* folder tab, on the right (RTL start) */}
        <div className="absolute -top-[2px] right-[28px] flex h-[54px] items-center gap-[12px] rounded-t-[16px] px-[22px]" style={{ background: D.agent, transform: "translateY(-50px)" }}>
          <Icon icon={Folder01Icon} size={28} color={D.agentInk} stroke={2} />
          <span dir="ltr" className="text-[30px] font-black leading-none" style={{ color: D.agentInk }}>
            {S10.company}
          </span>
        </div>
        <div className="absolute inset-0 rounded-[24px] rounded-tr-[6px]" style={{ background: D.panel, border: `2.5px solid ${D.agent}`, boxShadow: `0 0 60px ${D.agent}22` }} />
      </div>

      {/* SKILL.md: the clear card at the top of the company skill */}
      <div
        className="absolute flex flex-col justify-center rounded-[18px] px-[24px]"
        style={{ left: MD.x, top: MD.y, width: MD.w, height: MD.h, background: D.panel2, border: `2px solid ${read ? D.agent : D.lineStrong}`, boxShadow: read ? `0 0 40px ${D.agent}44` : "none", transition: "border-color .4s, box-shadow .4s" }}
      >
        <div className="flex items-center gap-[14px]">
          <Icon icon={File02Icon} size={38} color={D.agent} stroke={1.8} />
          <span dir="ltr" className="text-[36px] font-black leading-none" style={{ color: D.mist, fontFamily: MONO }}>
            {S10.skillMd}
          </span>
          <span className="text-[24px] font-medium" style={{ color: D.dim }}>
            {S10.skillMdNote}
          </span>
        </div>
        {/* the routing rules: written in SKILL.md, for the agent to read */}
        <Show on={routesOn} from="fade" className="mt-[12px] flex flex-col gap-[2px]">
          {S10.routes.map((r) => {
            const { on, quiet } = route(r.id);
            return (
              <span key={r.id} className="text-[25px] font-bold leading-[1.3]" style={{ color: quiet ? D.faint : on && example ? D.agentSoft : D.text, transition: "color .4s" }}>
                <bdi>{r.rule.split(" ← ")[0]}</bdi> ← <bdi dir="ltr">{r.rule.split(" ← ")[1]}</bdi>
              </span>
            );
          })}
        </Show>
      </div>

      {/* the identity cards, as before */}
      <div className="absolute grid grid-cols-4 gap-[15px]" style={{ left: MD.x, top: CARDS_Y, width: MD.w, height: FOLDER.y + FOLDER.h - CARDS_Y - 26 }}>
        {S10.brand.map((t, i) => (
          <div key={t} style={{ opacity: example && !done ? 0.75 : 1, transition: "opacity .4s" }}>
            <Doc icon={BRAND_ICONS[i]} label={t} />
          </div>
        ))}
      </div>

      {/* ---------- the specialised skills: separate, elsewhere ---------- */}
      {S10.routes.map((r) => {
        const { on, quiet } = route(r.id);
        const y = SKILL_Y[r.id];
        const hot = example && r.id === "video" && atVideo;
        return (
          <Show key={r.id} on={routesOn} from="end" delay={r.id === "image" ? 150 : 0} className="absolute" style={{ left: SKILL.x, top: y, width: SKILL.w, height: SKILL.h }}>
            <div className="h-full rounded-[22px] p-[10px]" style={{ border: `1.5px dashed ${quiet ? D.line : D.lineStrong}`, opacity: quiet ? 0.4 : 1, transition: "opacity .5s" }}>
              <div className="flex h-full flex-col justify-center gap-[10px] rounded-[16px] px-[22px]" style={{ background: D.panel, border: `2px solid ${hot ? D.agent : on && !example ? `${D.agent}99` : D.lineStrong}`, boxShadow: hot ? `0 0 44px ${D.agent}55` : "none", transition: "all .4s" }}>
                <div className="flex items-center gap-[14px]">
                  <span className="flex h-[58px] w-[58px] items-center justify-center rounded-[14px]" style={{ background: "rgba(255,122,0,.14)" }}>
                    <Icon icon={r.id === "video" ? Video01Icon : Image01Icon} size={36} color={D.agent} />
                  </span>
                  <span dir="ltr" className="text-[36px] font-black leading-none" style={{ color: D.mist }}>
                    {r.skill}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[4px] text-[21px]" style={{ color: D.dim }}>
                  <span>{S10.elsewhere}</span>
                  <span dir="ltr" style={{ fontFamily: MONO }}>
                    {r.path}
                  </span>
                </div>
              </div>
            </div>
          </Show>
        );
      })}

      {/* routes from SKILL.md: dashed pointers, not merges or calls */}
      <SketchLayer>
        {S10.routes.map((r, i) => {
          const { on, quiet } = route(r.id);
          const from: [number, number] = [MD.x - 6, RULE_Y[r.id]];
          const to: [number, number] = [ROUTE_TO[r.id].x, ROUTE_TO[r.id].y];
          return (
            <g key={r.id} style={{ opacity: quiet ? 0.3 : 1, transition: "opacity .5s" }}>
              <Arrow from={from} to={to} bend={r.id === "video" ? -18 : 18} color={example && on ? D.agent : D.sky} width={example && on ? 5 : 3.5} dash={example && on ? undefined : "12 10"} draw={routesOn} delay={i * 200} seed={30 + i} />
            </g>
          );
        })}
        {/* the result takes the look from the company skill and the making from Video Skill */}
        <Stroke d={sketchCurve([[FOLDER.x + FOLDER.w / 2, FOLDER.y + FOLDER.h + 4], [FOLDER.x + FOLDER.w / 2 + 6, RESULT.y - 30], [FOLDER.x + FOLDER.w / 2, RESULT.y - 6]], 41)} color={D.agentSoft} width={3.5} draw={done} dur={500} />
        <Stroke d={sketchCurve([[SKILL.x + SKILL.w - 40, SKILL_Y.video + SKILL.h + 4], [SKILL.x + SKILL.w + 80, RESULT.y + 40], [RESULT.x - 8, RESULT.y + RESULT.h / 2]], 42)} color={D.agent} width={4} draw={done} delay={150} dur={600} />
      </SketchLayer>
      {S10.routes.map((r, i) => {
        const { quiet } = route(r.id);
        const mid = { x: (MD.x + ROUTE_TO[r.id].x) / 2, y: (RULE_Y[r.id] + ROUTE_TO[r.id].y) / 2 };
        return (
          <Show key={r.id} on={routesOn} from="fade" delay={300 + i * 200} className="absolute -translate-x-1/2 whitespace-nowrap rounded-full px-[14px] py-[7px] text-[24px] font-bold leading-none" style={{ left: mid.x, top: mid.y + (r.id === "video" ? -58 : 20), background: D.ink, color: quiet ? D.faint : example && r.id === "video" && lit ? D.agentSoft : D.sky, border: `1px solid ${D.line}` }}>
            {r.when}
          </Show>
        );
      })}

      {/* ---------- the example ---------- */}
      <Show on={example && ex >= 1} from="start" className="absolute whitespace-nowrap rounded-[20px] rounded-br-[6px] px-[24px] py-[18px] text-[30px] font-black leading-[1.3]" style={{ left: REQUEST.x, top: REQUEST.y, width: REQUEST.w, background: D.sky, color: D.ink }}>
        {S10.request}
      </Show>
      <Pointer path={PATH} play={s.is("example") && ex >= 2} />

      <Show on={done} from="up" className="absolute flex items-center gap-[28px] rounded-[24px] px-[28px]" style={{ left: RESULT.x, top: RESULT.y, width: RESULT.w, height: RESULT.h, background: D.panel, border: `2px solid ${D.agent}`, boxShadow: `0 0 60px ${D.agent}33` }}>
        <div className="flex flex-1 flex-col gap-[16px]">
          <span className="text-[42px] font-black leading-tight" style={{ color: D.mist }}>
            {S10.result}
          </span>
          <span className="flex items-center gap-[10px] text-[25px] font-bold" style={{ color: D.dim }}>
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: D.agentSoft }} />
            {S10.fromCompany} <span style={{ color: D.text }}>←</span> <bdi dir="ltr" style={{ color: D.agentSoft }}>{S10.company}</bdi>
          </span>
          <span className="flex items-center gap-[10px] text-[25px] font-bold" style={{ color: D.dim }}>
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: D.agent }} />
            {S10.fromVideo} <span style={{ color: D.text }}>←</span> <bdi dir="ltr" style={{ color: D.agent }}>{S10.routes[0].skill}</bdi>
          </span>
        </div>
        {/* a vertical reel in the company's look: an illustration, not a video */}
        <div className="relative flex h-[214px] w-[120px] flex-none flex-col items-center justify-between overflow-hidden rounded-[14px] py-[14px]" style={{ background: `linear-gradient(160deg, ${D.ink}, #0c2327 70%, ${D.agentDeep})`, border: `1.5px solid ${D.lineStrong}` }}>
          <span dir="ltr" className="text-[20px] font-black leading-none tracking-wide" style={{ color: D.mist }}>
            {S10.companyMark}
          </span>
          <span className="h-[46px] w-[46px] rounded-full" style={{ border: `3px solid ${D.mist}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `14px solid ${D.mist}`, marginLeft: 4 }} />
          </span>
          <span className="flex w-[80%] flex-col gap-[5px]">
            <span className="h-[6px] w-full rounded-full" style={{ background: D.sage }} />
            <span className="h-[6px] w-[60%] rounded-full" style={{ background: D.agent }} />
          </span>
        </div>
      </Show>
    </div>
  );
}
