"use client";

/* eslint-disable @next/next/no-img-element */
import Folder from "@/components/reactbits/Folder";
import { useMounted } from "@/components/lab/kit/useMounted";
import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { S09 } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { Show } from "../kit/Show";
import { Icon, SlideTitle } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";
import { asset } from "@/lib/asset";

export const steps: StepDef[] = [
  { key: "closed", label: "المجلد مغلق" },
  { key: "open", label: "يُفتح: الملفات والمجلدات" },
  { key: "preview", label: "معاينة من كل قسم" },
  { key: "split", label: "التعليمات مقابل الموارد" },
];

/** the real structure, as a file tree. File names inside the folders are examples. */
type Row = { name: string; depth: number; top?: number; dir?: boolean };
const TREE: Row[] = [
  { name: "SKILL.md", depth: 1, top: 0 },
  { name: "assets/", depth: 1, top: 1, dir: true },
  { name: "logo.svg", depth: 2 },
  { name: "pattern.svg", depth: 2 },
  { name: "watermark.png", depth: 2 },
  { name: "fonts/", depth: 2, dir: true },
  { name: "references/", depth: 1, top: 2, dir: true },
  { name: "brand-guide.md", depth: 2 },
  { name: "design-rules.md", depth: 2 },
  { name: "examples/", depth: 2, dir: true },
  { name: "scripts/", depth: 1, top: 3, dir: true },
  { name: "export.py", depth: 2 },
  { name: "resize.js", depth: 2 },
];

// RTL: the tree (the structure itself) is the first column, on the right; the previews sit on the left
const TREE_BOX = { x: 1010, y: 210, w: 800, h: 760 };
const RIGHT = { x: 110, y: 210, w: 830, h: 760 };

const SKILL_MD = `---
name: brand-creative-skill
description: Apply our brand to
  every visual we make.
---
# How we work
1. Start from assets/logo.svg
2. Read references/ first
3. Export with scripts/`;
const SCRIPT = `def export(design, size):
    resize(design, size)
    return save(design, "out/")`;

function Preview({ k }: { k: number }) {
  if (k === 0)
    return (
      <pre dir="ltr" className="m-0 h-full overflow-hidden whitespace-pre text-left text-[15px] leading-[1.6]" style={{ fontFamily: MONO, color: D.sky }}>
        {SKILL_MD}
      </pre>
    );
  if (k === 1)
    return (
      <div className="grid h-full grid-cols-2 gap-[10px]">
        <div className="flex items-center justify-center rounded-[10px]" style={{ background: D.ink }}>
          <img src={asset("/brand/rakaya.svg")} alt="" style={{ height: 40 }} />
        </div>
        <div className="rounded-[10px]" style={{ background: `${D.ink} url(${asset("/brand/rakaya-icon.svg")}) center/38px 38px` }} />
        <div className="relative overflow-hidden rounded-[10px]" style={{ background: D.panel3 }}>
          <div className="absolute -inset-[30%] -rotate-[24deg] opacity-25" style={{ background: `url(${asset("/brand/rakaya.svg")}) center/120px auto` }} />
        </div>
        <div className="flex items-center justify-center rounded-[10px] text-[40px] font-black" style={{ background: D.ink, color: D.mist }}>
          أب
        </div>
      </div>
    );
  if (k === 2)
    return (
      <div className="flex h-full flex-col gap-[12px] rounded-[10px] p-[16px]" style={{ background: D.paper }}>
        <span className="h-[14px] w-[55%] rounded-full" style={{ background: D.cobalt }} />
        {[92, 80, 86, 60].map((w, i) => (
          <span key={i} className="h-[8px] rounded-full" style={{ width: `${w}%`, background: "#c6d3e6" }} />
        ))}
        <div className="mt-auto flex gap-[8px]">
          {[D.cobalt, D.azure, D.agent, D.ink].map((c) => (
            <span key={c} className="h-[26px] flex-1 rounded-[6px]" style={{ background: c }} />
          ))}
        </div>
      </div>
    );
  return (
    <pre dir="ltr" className="m-0 h-full overflow-hidden whitespace-pre text-left text-[15px] leading-[1.7]" style={{ fontFamily: MONO, color: D.agentSoft }}>
      {SCRIPT}
    </pre>
  );
}

export default function S09InsideSkill({ step }: SlideProps) {
  const s = stepper(steps, step);
  const mounted = useMounted();
  const opened = s.at("open");
  const previews = s.at("preview");
  const split = s.at("split");
  const tone = (top: number | undefined) => (!split || top === undefined ? D.mist : top === 0 ? D.agent : D.sky);
  const folderAt = opened ? { x: RIGHT.x + RIGHT.w / 2, y: 620, k: 0.92 } : { x: 960, y: 600, k: 1.25 };

  return (
    <div className="absolute inset-0">
      <SlideTitle>{S09.title}</SlideTitle>

      {/* the folder: closed first, then opened beside its own tree */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: folderAt.x,
          top: folderAt.y,
          transform: `translate(-50%, -50%) scale(${folderAt.k})`,
          opacity: previews ? 0 : 1,
          transition: `left .9s ${EASE}, top .9s ${EASE}, transform .9s ${EASE}, opacity .5s ease`,
        }}
      >
        {mounted && (
          <Folder
            items={S09.entries.map((e) => ({
              title: e.name,
              content: (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px] rounded-[10px] p-[10px]" style={{ background: e.kind === "dir" ? "#ffe2c2" : D.paper }}>
                  <Icon icon={e.kind === "dir" ? Folder01Icon : File02Icon} size={64} color={e.kind === "dir" ? D.agentDeep : D.cobalt} />
                  <span dir="ltr" className="text-[22px] font-bold" style={{ color: D.ink, fontFamily: MONO }}>
                    {e.name}
                  </span>
                </div>
              ),
            }))}
            label={S09.root}
            mode="flap"
            variant="solid"
            color={D.agent}
            paperColor={D.paper}
            layout="spread"
            size={2}
            open={opened && !previews}
            draggable={false}
            zoomOnClick={false}
            closeOnOutsideClick={false}
            peek={false}
            intro
            theme="dark"
          />
        )}
      </div>

      {/* the tree */}
      <Show on={opened} from="start" className="absolute overflow-hidden rounded-[26px]" style={{ left: TREE_BOX.x, top: TREE_BOX.y, width: TREE_BOX.w, height: TREE_BOX.h, background: D.panel, border: `1.5px solid ${D.line}` }}>
        <div dir="ltr" className="flex h-[66px] items-center gap-[14px] px-[28px]" style={{ background: D.panel2, borderBottom: `1px solid ${D.line}` }}>
          <Icon icon={Folder01Icon} size={30} color={D.agent} />
          <span className="text-[26px] font-bold" style={{ fontFamily: MONO, color: D.mist }}>
            {S09.root}
          </span>
        </div>
        <ul dir="ltr" className="m-0 list-none px-[28px] py-[14px]">
          {TREE.map((r, i) => {
            const top = r.top !== undefined;
            const entry = top ? S09.entries[r.top!] : null;
            return (
              <li
                key={r.name}
                className="flex h-[51px] items-center justify-between"
                style={{ opacity: opened ? 1 : 0, transform: opened ? "none" : "translateX(-14px)", transition: `all .45s ${EASE} ${opened ? 0.25 + i * 0.05 : 0}s` }}
              >
                <span className="flex items-center gap-[12px]" style={{ paddingLeft: (r.depth - 1) * 38 }}>
                  <span style={{ color: D.faint, fontFamily: MONO, fontSize: 22 }}>{r.depth > 1 ? "└─" : "├─"}</span>
                  <Icon icon={r.dir ? Folder01Icon : File02Icon} size={top ? 28 : 22} color={r.dir ? D.agentSoft : D.sky} />
                  <span style={{ fontFamily: MONO, fontSize: top ? 26 : 21, fontWeight: top ? 800 : 500, color: top ? tone(r.top) : D.dim, transition: "color .5s" }}>{r.name}</span>
                </span>
                {entry && (
                  <span dir="rtl" className="text-[21px] font-medium" style={{ color: D.dim, maxWidth: 380, textAlign: "right" }}>
                    {entry.desc}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Show>

      {/* a look inside each part */}
      <div className="absolute grid grid-cols-2 gap-[24px]" style={{ left: RIGHT.x, top: RIGHT.y + (split ? 70 : 0), width: RIGHT.w, transition: `top .6s ${EASE}` }}>
        {S09.entries.map((e, k) => {
          const instr = k === 0;
          return (
            <Show
              key={e.name}
              on={previews}
              from="up"
              delay={k * 140}
              className="flex h-[310px] flex-col gap-[14px] rounded-[22px] p-[20px]"
              style={{ background: D.panel, border: `2px solid ${split ? (instr ? D.agent : `${D.sky}88`) : D.line}`, transition: "border-color .5s" }}
            >
              <div className="flex items-center justify-between">
                <span dir="ltr" className="text-[24px] font-black" style={{ fontFamily: MONO, color: split ? (instr ? D.agent : D.sky) : D.mist }}>
                  {e.name}
                </span>
                {split && instr && (
                  <span className="rounded-full px-[16px] py-[6px] text-[20px] font-black" style={{ background: D.agent, color: D.agentInk, animation: "lab-pop .4s both" }}>
                    {S09.instructions}
                  </span>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-hidden rounded-[12px] p-[12px]" style={{ background: "#070c13" }}>
                <Preview k={k} />
              </div>
            </Show>
          );
        })}
      </div>
      {/* the resources, grouped */}
      <Show on={split} from="down" className="absolute flex items-center gap-[16px]" style={{ right: 1920 - RIGHT.x - RIGHT.w, top: RIGHT.y + 8 }}>
        <span className="h-[3px] w-[60px] rounded-full" style={{ background: D.sky }} />
        <span className="text-[30px] font-black" style={{ color: D.sky }}>
          {S09.resources}
        </span>
        <span className="text-[24px] font-bold" style={{ color: D.dim, fontFamily: MONO }} dir="ltr">
          assets/ · references/ · scripts/
        </span>
      </Show>
    </div>
  );
}
