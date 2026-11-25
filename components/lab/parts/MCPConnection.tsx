"use client";

import { T, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";
import { Wamda } from "../wamda/Wamda";

const C = { x: 960, y: 520 };
type Spot = { id: string; name: string; mark: string; x: number; y: number; at: number };
const SPOTS: Spot[] = [
  { id: "skill", name: "مصدر تعليمات Skill", mark: "SKILL.md", x: 470, y: 250, at: 1 },
  { id: "figma", name: "Figma", mark: "Fg", x: 1450, y: 250, at: 2 },
  { id: "canva", name: "Canva", mark: "Cv", x: 1520, y: 560, at: 3 },
  { id: "blender", name: "Blender", mark: "Bl", x: 400, y: 640, at: 4 },
  { id: "davinci", name: "DaVinci Resolve", mark: "DR", x: 960, y: 880, at: 5 },
];

/** The agent in the middle; each source or tool joins through MCP, one stage at a time. The tool tiles are neutral monograms, not logos. */
export function MCPConnection({ step, replay = 0 }: LabProps) {
  const s = useStep(6, step, replay, 2600);
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <svg className="absolute inset-0" width="1920" height="1080" fill="none" aria-hidden>
        {SPOTS.map((p) => {
          const on = s >= p.at;
          const mx = (p.x + C.x) / 2;
          const my = (p.y + C.y) / 2;
          return (
            <g key={p.id}>
              <line x1={C.x} y1={C.y} x2={p.x} y2={p.y} stroke={on ? (p.id === "skill" ? T.sage : T.orange) : "transparent"} strokeWidth="4" strokeDasharray={p.id === "skill" ? "2 14" : "none"} strokeLinecap="round" style={{ transition: "stroke .5s" }} />
              <g style={{ opacity: on ? 1 : 0, transition: "opacity .6s .3s" }}>
                <rect x={mx - 42} y={my - 22} width="84" height="44" rx="22" fill={T.ink} stroke={T.lineStrong} />
                <text x={mx} y={my + 9} textAnchor="middle" fontSize="24" fontWeight="800" fill={T.sage} fontFamily="ui-monospace, monospace">MCP</text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2" style={{ left: C.x, top: C.y }}>
        <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: T.panel, border: `2px solid ${T.orange}`, boxShadow: `0 0 80px rgba(255,122,0,.2)` }}>
          <Wamda clip="idle" mode="color" scale={3.2} />
        </div>
        <span className="absolute left-1/2 top-[318px] -translate-x-1/2 whitespace-nowrap text-[34px] font-black" style={{ color: T.mist }}>AI Agent</span>
      </div>

      {SPOTS.map((p) => {
        const on = s >= p.at;
        const skill = p.id === "skill";
        return (
          <div key={p.id} className="absolute h-[130px] w-[130px]" style={{ left: p.x, top: p.y, opacity: on ? 1 : 0.18, transform: `translate(-50%, -50%) scale(${on ? 1 : 0.9})`, transition: "opacity .6s, transform .6s cubic-bezier(.2,.8,.2,1)" }}>
            <div className="flex h-full w-full items-center justify-center text-[44px] font-black" dir="ltr" style={{ background: T.panel2, border: `2px solid ${on ? (skill ? T.sage : T.orange) : T.line}`, color: skill ? T.sage : T.mist, borderRadius: skill ? 14 : 34, fontSize: skill ? 24 : 44, fontFamily: skill ? "ui-monospace, monospace" : undefined }}>
              {p.mark}
            </div>
            <span className="absolute left-1/2 top-[146px] -translate-x-1/2 whitespace-nowrap text-[30px] font-bold" style={{ color: on ? T.mist : T.dim }}>{p.name}</span>
          </div>
        );
      })}
      <p className="absolute bottom-[56px] right-[110px] text-[38px] font-black" style={{ color: T.mist }}>
        {["الوكيل وحده", "يقرأ تعليماته من Skill", "ويتصل بـ Figma", "وبـ Canva", "وبـ Blender", "وبـ DaVinci Resolve"][s]}
      </p>
    </div>
  );
}
