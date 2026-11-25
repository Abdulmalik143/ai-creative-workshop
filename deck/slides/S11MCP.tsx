"use client";

/* eslint-disable @next/next/no-img-element */
import { SpeechBubble } from "@/components/lab/wamda/SpeechBubble";
import { S11 } from "../content/copy";
import { MCP_TOOLS, type McpTool } from "../media/mcpTools";
import { D, EASE, MONO } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { SketchLayer, Stroke, sketchCurve } from "../kit/Sketch";
import { WamdaActor, bubbleTone, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "empty", label: "المسرح" },
  { key: "ask", label: "الوكيل: «أقدر أستخدم برامج التصميم زيكم؟»" },
  { key: "mcp", label: "MCP، اسمه الكامل ومعناه" },
  { key: "tools", label: `${MCP_TOOLS.length} أدوات إبداعية لها تكامل MCP` },
  { key: "connect", label: "مسار واحد من الأدوات إلى MCP" },
];

const LOOK = lookFor(11);
const HUB = { x: 960, y: 520 };
const AGENT = { x: 1640, y: 610 };

/** The tools: two columns × five rows on the left, read from the top right (RTL). */
const GRID = { left: 72, top: 176, colW: 236, rowH: 166 };
const TILE = 96;
const PANEL = { x: GRID.left - 28, y: GRID.top - 34, w: GRID.colW * 2 + 56, h: GRID.rowH * 5 + 22 };
/** where the one connector leaves the panel and where it meets MCP (left edge of the MCP box) */
const PORT: [number, number] = [PANEL.x + PANEL.w, 450];
const MCP_IN: [number, number] = [HUB.x - 236, 450];

const CELLS = MCP_TOOLS.map((t, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2; // 0 = right column
  return { t, i, cx: GRID.left + GRID.colW * (col === 0 ? 1.5 : 0.5), top: GRID.top + row * GRID.rowH };
});

/** A tool's official logo inside the deck's tile. Marks sit smaller; app icons that carry their own tile sit larger. */
function ToolTile({ t, lit, delay }: { t: McpTool; lit: boolean; delay: number }) {
  const inner = t.kind === "icon" ? 0.78 : 0.6;
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: TILE,
        height: TILE,
        borderRadius: 26,
        background: D.panel2,
        border: `2px solid ${lit ? D.agent : D.line}`,
        boxShadow: lit ? `0 0 26px ${D.agent}55` : "none",
        transition: `border-color .4s ease ${lit ? delay : 0}ms, box-shadow .4s ease ${lit ? delay : 0}ms`,
      }}
    >
      <img src={t.logo} alt="" width={TILE * inner} height={TILE * inner} style={{ width: TILE * inner, height: TILE * inner, objectFit: "contain" }} draggable={false} />
    </div>
  );
}

/** Agent on the right, MCP in the middle, the tools on the left: the sentence reads in the room's direction. */
export default function S11MCP({ step }: SlideProps) {
  const s = stepper(steps, step);
  const m = useBeats(step, s.idx("mcp"), [60, 900, 1700, 2500]);
  const linked = s.at("connect");
  return (
    <div className="absolute inset-0">
      {/* the agent asks */}
      <div className="absolute" style={{ left: AGENT.x - 180, top: AGENT.y - 190 }}>
        <Show on={s.at("ask")} from="start">
          <WamdaActor look={LOOK} act={s.is("ask") ? "questioning" : "idle"} scale={5} glow={linked} />
        </Show>
      </div>
      <div className="absolute right-[250px] top-[150px]">
        <Show on={s.is("ask") || s.is("mcp")} from="pop">
          {s.at("ask") && <SpeechBubble key="ask" text={S11.ask} effect="type" tone={bubbleTone(LOOK)} tail="start" fontSize={46} maxWidth={900} />}
        </Show>
      </div>

      {/* MCP: the acronym, then its name, then what it means */}
      <div className="absolute flex flex-col items-center text-center" style={{ left: HUB.x - 420, top: HUB.y - 170, width: 840 }}>
        <Show on={m >= 1} from="pop" dur={700}>
          <div
            dir="ltr"
            className="rounded-[36px] px-[54px] py-[18px] text-[150px] font-black leading-none"
            style={{ color: D.paper, background: D.panel, border: `3px solid ${linked ? D.agent : D.lineStrong}`, boxShadow: linked ? `0 0 80px ${D.agent}44` : "none", transition: "all .6s" }}
          >
            {S11.acronym}
          </div>
        </Show>
        <Show on={m >= 2} from="up" className="mt-[30px]">
          <span dir="ltr" className="text-[46px] font-bold" style={{ color: D.sky, fontFamily: MONO }}>
            {S11.full}
          </span>
        </Show>
        <Show on={m >= 3} from="up" className="mt-[10px]">
          <span className="text-[48px] font-black" style={{ color: D.mist }}>
            {S11.meaning}
          </span>
        </Show>
        <Show on={m >= 4} from="up" className="mt-[26px]">
          <span className="text-[36px] font-bold" style={{ color: D.agentSoft }}>
            {S11.line}
          </span>
        </Show>
      </div>

      {/* the tools: one panel, so every connection leaves it along a single path */}
      <Show on={s.at("tools")} from="end" dur={500} className="absolute" style={{ left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h }}>
        <div
          className="h-full w-full rounded-[40px]"
          style={{
            background: `${D.panel}cc`,
            border: `2px solid ${linked ? D.agent : D.line}`,
            boxShadow: linked ? `0 0 60px ${D.agent}2e` : "none",
            transition: `border-color .6s ${EASE}, box-shadow .6s ${EASE}`,
          }}
        />
      </Show>
      {CELLS.map(({ t, i, cx, top }) => (
        <Show key={t.id} on={s.at("tools")} from="end" delay={120 + i * 70} className="absolute flex flex-col items-center" style={{ left: cx - GRID.colW / 2, top, width: GRID.colW }}>
          <ToolTile t={t} lit={linked} delay={500 + i * 45} />
          <span dir="ltr" className="mt-[12px] whitespace-nowrap text-[27px] font-bold leading-none" style={{ color: D.mist }}>
            {t.name}
          </span>
        </Show>
      ))}

      {/* connections: agent → MCP, and the tools → MCP along one path */}
      <SketchLayer>
        <Stroke d={sketchCurve([[AGENT.x - 190, AGENT.y], [1430, 560], [HUB.x + 300, HUB.y - 70]], 3)} color={D.agent} width={5} draw={linked} dur={700} />
        <Stroke d={sketchCurve([[AGENT.x - 190, AGENT.y], [1430, 560], [HUB.x + 300, HUB.y - 70]], 4)} color={D.agentSoft} width={3} dash="4 22" draw={linked} delay={700} style={{ animation: linked ? "deck-flow 1.2s linear infinite" : undefined }} />
        <Stroke d={sketchCurve([MCP_IN, [(MCP_IN[0] + PORT[0]) / 2, PORT[1] + 4], PORT], 11)} color={D.agent} width={6} draw={linked} delay={300} dur={500} />
        <Stroke d={sketchCurve([MCP_IN, [(MCP_IN[0] + PORT[0]) / 2, PORT[1] + 4], PORT], 12)} color={D.agentSoft} width={3} dash="4 22" draw={linked} delay={800} style={{ animation: linked ? "deck-flow 1.2s linear infinite" : undefined }} />
      </SketchLayer>
    </div>
  );
}
