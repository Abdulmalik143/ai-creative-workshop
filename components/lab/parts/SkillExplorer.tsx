"use client";

import { useEffect, useState } from "react";
import { T, MONO, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";

type Node = { name: string; children?: Node[] };
const TREE: Node = {
  name: "rakaya-brand",
  children: [
    { name: "SKILL.md" },
    { name: "assets", children: [{ name: "logo.svg" }, { name: "fonts", children: [{ name: "thmanyahsans-Bold.woff2" }, { name: "thmanyahsans-Black.woff2" }] }, { name: "pattern.svg" }, { name: "watermark.svg" }] },
    { name: "references", children: [{ name: "brand-guidelines.md" }, { name: "tone-of-voice.md" }] },
    { name: "scripts", children: [{ name: "export_reel.py" }] },
  ],
};

const TEXT: Record<string, string> = {
  "SKILL.md": `---
name: rakaya-brand
description: Apply Rakaya's identity to any visual
  output: the lockup, ثمانية Sans, the sage palette,
  the pattern and the watermark.
---

# Rakaya Brand

1. Start every visual with assets/logo.svg.
   Never recolour it; it is white and sage.
2. Set Arabic in ثمانية Sans (assets/fonts).
3. Read references/brand-guidelines.md before
   choosing colours or layouts.
4. For video, run scripts/export_reel.py.`,
  "brand-guidelines.md": `# Brand guidelines

- The lockup lives on dark or saturated grounds.
- Sage (#b3c4c6) and white (#f2f5f5) lead.
- One accent per surface.
- Arabic is the primary language; Latin follows.`,
  "tone-of-voice.md": `# Tone of voice

Direct, warm, practical. Say what the agent did,
not what it "might" do.`,
  "export_reel.py": `import sys
from reels import render

# usage: export_reel.py <project> <out.mp4>
render(project=sys.argv[1], out=sys.argv[2],
       fps=30, size=(1080, 1920), audio=True)`,
};

const flat = (n: Node, path = ""): { path: string; name: string; dir: boolean }[] =>
  [{ path: path + n.name, name: n.name, dir: !!n.children }, ...(n.children ?? []).flatMap((c) => flat(c, path + n.name + "/"))];

const STEPS: { open: string[]; file: string }[] = [
  { open: ["rakaya-brand"], file: "rakaya-brand/SKILL.md" },
  { open: ["rakaya-brand", "rakaya-brand/references"], file: "rakaya-brand/references/brand-guidelines.md" },
  { open: ["rakaya-brand", "rakaya-brand/references", "rakaya-brand/assets", "rakaya-brand/assets/fonts"], file: "rakaya-brand/assets/logo.svg" },
  { open: ["rakaya-brand", "rakaya-brand/references", "rakaya-brand/assets", "rakaya-brand/assets/fonts", "rakaya-brand/scripts"], file: "rakaya-brand/scripts/export_reel.py" },
];

function Preview({ name }: { name: string }) {
  if (name === "logo.svg")
    return (
      <div className="flex h-full items-center justify-center rounded-[14px]" style={{ background: T.ink }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/rakaya.svg" alt="الشعار" style={{ height: 150 }} />
      </div>
    );
  if (name === "pattern.svg")
    return <div className="h-full rounded-[14px]" style={{ background: `${T.ink} url(/brand/rakaya-icon.svg) center/110px 110px`, opacity: 0.9 }} />;
  if (name === "watermark.svg")
    return (
      <div className="relative h-full overflow-hidden rounded-[14px]" style={{ background: T.ink }}>
        <div className="absolute -inset-[40%] -rotate-[24deg] opacity-[0.16]" style={{ background: "url(/brand/rakaya.svg) center/280px auto" }} />
      </div>
    );
  if (name.startsWith("thmanyah"))
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[18px] rounded-[14px] p-[30px]" style={{ background: T.ink, color: T.mist }}>
        <span className="text-[108px] font-black leading-none" style={{ fontWeight: name.includes("Black") ? 900 : 700 }}>ثمانية</span>
        <span className="text-[36px]" style={{ color: T.sage }}>عقل يبدع، ووكيل ينفّذ</span>
        <span dir="ltr" style={{ fontFamily: MONO, fontSize: 22, color: T.dim }}>{name}</span>
      </div>
    );
  return (
    <pre dir="ltr" className="m-0 h-full overflow-hidden whitespace-pre-wrap rounded-[14px] p-[30px]" style={{ background: T.ink, color: T.sage, fontFamily: MONO, fontSize: 25, lineHeight: 1.7 }}>
      {TEXT[name] ?? ""}
    </pre>
  );
}

/** The real anatomy of a Skill. Open folders, click files; stage 3 shows the logo, the font, the pattern and the watermark are just files in assets/. */
export function SkillExplorer({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3800);
  const [open, setOpen] = useState<string[]>(STEPS[0].open);
  const [file, setFile] = useState(STEPS[0].file);
  const [sub, setSub] = useState(0);
  useEffect(() => {
    setOpen(STEPS[s].open);
    setFile(STEPS[s].file);
    setSub(0);
  }, [s, replay]);
  // on the assets stage, walk through the visual files one by one
  useEffect(() => {
    if (s !== 2) return;
    const files = ["rakaya-brand/assets/logo.svg", "rakaya-brand/assets/fonts/thmanyahsans-Black.woff2", "rakaya-brand/assets/pattern.svg", "rakaya-brand/assets/watermark.svg"];
    const id = setInterval(() => setSub((n) => {
      const k = (n + 1) % files.length;
      setFile(files[k]);
      return k;
    }), 1700);
    return () => clearInterval(id);
  }, [s]);

  const rows = flat(TREE).filter((r) => {
    const parts = r.path.split("/");
    return parts.slice(0, -1).every((_, i) => open.includes(parts.slice(0, i + 1).join("/")));
  });
  const base = file.split("/").pop()!;
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-[90px] top-[90px] h-[900px] w-[1740px] overflow-hidden rounded-[22px] flex" dir="ltr" style={{ background: T.panel, border: `1.5px solid ${T.line}` }}>
        <ul className="m-0 w-[560px] flex-none list-none p-[24px]" style={{ borderRight: `1px solid ${T.line}`, fontFamily: MONO, fontSize: 26 }} role="tree">
          {rows.map((r) => {
            const depth = r.path.split("/").length - 1;
            const isOpen = open.includes(r.path);
            return (
              <li key={r.path} role="treeitem" aria-expanded={r.dir ? isOpen : undefined}>
                <button
                  onClick={() => (r.dir ? setOpen((o) => (o.includes(r.path) ? o.filter((x) => x !== r.path) : [...o, r.path])) : setFile(r.path))}
                  className="flex w-full items-center gap-[12px] rounded-[8px] py-[9px] text-left transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7a00]"
                  style={{ paddingLeft: 10 + depth * 30, color: file === r.path ? T.orange : r.dir ? T.mist : T.sage, background: file === r.path ? "rgba(255,122,0,.12)" : undefined }}
                >
                  <span style={{ width: 22, color: T.dim }}>{r.dir ? (isOpen ? "▾" : "▸") : "·"}</span>
                  {r.name}{r.dir ? "/" : ""}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex-1 p-[34px]">
          <div className="mb-[18px] text-[24px]" style={{ fontFamily: MONO, color: T.dim }}>{file}</div>
          <div className="h-[780px]" key={file} style={{ animation: "lab-fade .45s both" }}>
            <Preview name={base} />
          </div>
        </div>
      </div>
      <span className="sr-only" data-sub={sub} />
    </div>
  );
}
