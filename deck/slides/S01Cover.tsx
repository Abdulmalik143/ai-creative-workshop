"use client";

import { useRef } from "react";
import { useStage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { place } from "@/covers/kit/Cursor";
import { clamp, ease, lerp, seg, type V } from "@/covers/kit/math";
import { newFollow, stepFollow } from "@/covers/kit/follow";
import { WORKSHOP } from "../content/copy";
import { D } from "../theme";
import { AGENT_LABEL } from "../kit/Pointer";
import { RefPointer } from "../kit/CursorArrow";
import type { SlideProps, StepDef } from "../types";

export const steps: StepDef[] = [{ key: "cover", label: "الغلاف" }];

/**
 * The approved cover «مجسّم» (covers/lab/viewport), carried into the deck:
 * the title is a solid with depth, the mind orbits the camera with the pointer, the agent keeps the bounding box.
 * The mind is the presenter's real mouse (no drawn copy of it); the agent's pointer follows it as before.
 * Deck changes: a dark, clean ground with a faint edge glow (DeckBackground "cover"), the white Rakaya lockup
 * centred at the top, the subtitle and the presenter under the title, and the deck's colours
 * (mind = Atmosphere blue, agent = Wamda orange).
 * The gallery version at /cover/viewport is untouched.
 */

const LAYERS = 22;
const DEPTH = 6;
const BOX = { w: 1500, h: 420, d: LAYERS * DEPTH };
const FACE = [246, 248, 255];
const EDGE_A = [120, 176, 255];
const EDGE_B = [8, 16, 52];
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
/**
 * Line 1 («الذكاء الاصطناعي») sits this many px higher than the flow, in every depth layer, so it moves as one solid;
 * line 2 stays where it was. Measured on the rendered cover (2026-11-24): without it, the dots under the final «ي» and
 * their depth land on «الإبداعية»; it takes ~34 to clear them, and above ~45 the dot of «ذ» reaches the box's top
 * edge. 42 leaves ~9px under the dots and ~6px under the box at the resting angle, ≥4px on both through the sway.
 */
const LINE1_LIFT = 42;

export default function S01Cover(_: SlideProps) {
  const { pointer, active } = useStage();
  const worldRef = useRef<HTMLDivElement>(null);
  const gx = useRef<SVGLineElement>(null);
  const gy = useRef<SVGLineElement>(null);
  const gz = useRef<SVGLineElement>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const cam = useRef({ ry: -24, rx: 14 });
  const follow = useRef(newFollow());

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const live = active && t > 3.5 && p.inside;
      let ty: number;
      let tx: number;
      if (live) {
        ty = clamp((p.x - 960) / 960, -1, 1) * 20;
        tx = 18 - clamp((p.y - 540) / 540, -1, 1) * 9;
      } else if (t < 3.2) {
        ty = lerp(-30, 5, ease(seg(t, 0.2, 3.2)));
        tx = lerp(30, 18, ease(seg(t, 0.2, 3.2)));
      } else {
        ty = 5 + 8 * Math.sin((t - 3.2) * 0.45);
        tx = 18 + 3 * Math.sin((t - 3.2) * 0.3);
      }
      const c = cam.current;
      c.ry += (ty - c.ry) * (live ? 0.1 : 1);
      c.rx += (tx - c.rx) * (live ? 0.1 : 1);
      if (worldRef.current) worldRef.current.style.transform = `rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;

      const ay = (c.ry * Math.PI) / 180;
      const ax = (c.rx * Math.PI) / 180;
      const proj = ([x, y, z]: number[]) => {
        const x1 = x * Math.cos(ay) + z * Math.sin(ay);
        const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
        return [x1, y * Math.cos(ax) - z1 * Math.sin(ax)];
      };
      const set = (el: SVGLineElement | null, v: number[]) => {
        if (!el) return;
        const [x, y] = proj(v);
        el.setAttribute("x2", String(60 + x * 44));
        el.setAttribute("y2", String(60 + y * 44));
      };
      set(gx.current, [1, 0, 0]);
      set(gy.current, [0, 1, 0]);
      set(gz.current, [0, 0, 1]);

      const scripted: { mind: V; agent: V } = {
        mind: { x: lerp(1600, 1420, ease(seg(t, 0.4, 3))), y: lerp(150, 330, ease(seg(t, 0.4, 3))) },
        agent: { x: 380, y: 640 },
      };
      const cur = stepFollow(follow.current, { t, liveFrom: 3.5, active, pointer: p, scripted, agentOffset: { x: -90, y: 90 }, agentK: 0.06 });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 1.2, 1.6));
    },
    { poster: 4 },
  );

  const edge = (X: number, Y: number, w: number, rot: string) => (
    <div className="absolute" style={{ left: X, top: Y, width: w, height: 2, background: D.agent, transform: `translateZ(0px) ${rot}`, transformOrigin: "0 0", boxShadow: `0 0 10px ${D.agent}` }} />
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ perspective: 1750, perspectiveOrigin: "50% 26%" }}>
        <div ref={worldRef} className="absolute" style={{ left: 960, top: 400, width: 0, height: 0, transformStyle: "preserve-3d" }}>
          <div className="absolute" style={{ left: -800, top: -190, width: 1600, height: 380, transformStyle: "preserve-3d" }}>
            {Array.from({ length: LAYERS }, (_, i) => {
              const col = i === 0 ? FACE : mix(EDGE_A, EDGE_B, (i - 1) / (LAYERS - 1));
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[156px] font-black leading-[1.04]"
                  style={{ transform: `translateZ(${-i * DEPTH}px)`, color: `rgb(${col.join(",")})` }}
                  aria-hidden
                >
                  {WORKSHOP.titleLines.map((l, k) => (
                    <span key={l} className="block whitespace-nowrap" style={k === 0 ? { transform: `translateY(${-LINE1_LIFT}px)` } : undefined}>
                      {l}
                    </span>
                  ))}
                </div>
              );
            })}

            {/* the agent's bounding box */}
            <div className="absolute" style={{ left: 800 - BOX.w / 2, top: 190 - BOX.h / 2, width: BOX.w, height: BOX.h, transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0" style={{ border: `2px solid ${D.agent}` }} />
              <div className="absolute inset-0" style={{ border: `2px solid ${D.agent}88`, transform: `translateZ(${-BOX.d}px)` }} />
              {edge(0, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(BOX.w, 0, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(0, BOX.h, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {edge(BOX.w, BOX.h, BOX.d, "rotateY(90deg) translateX(-100%)")}
              {[[0, 0], [BOX.w, 0], [0, BOX.h], [BOX.w, BOX.h]].map(([x, y], i) => (
                <div key={i} className="absolute h-[16px] w-[16px]" style={{ left: x - 8, top: y - 8, background: D.ink, border: `3px solid ${D.agent}` }} />
              ))}
              <span dir="ltr" className="absolute left-0 rounded-[6px] px-[12px] py-[5px] text-[22px] font-semibold tabular-nums leading-none" style={{ top: BOX.h + 16, background: D.agent, color: D.agentInk }}>
                {BOX.w} × {BOX.h} × {BOX.d}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* gizmo */}
      <svg className="absolute left-[96px] top-[96px]" width="120" height="120" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="56" fill="#ffffff08" stroke="#ffffff22" />
        <line ref={gz} x1="60" y1="60" x2="60" y2="60" stroke={D.agent} strokeWidth="4" strokeLinecap="round" />
        <line ref={gy} x1="60" y1="60" x2="60" y2="60" stroke={D.paper} strokeWidth="4" strokeLinecap="round" />
        <line ref={gx} x1="60" y1="60" x2="60" y2="60" stroke={D.azure} strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* the full Rakaya lockup, all white, once, centred above the title */}
      <div className="absolute inset-x-0 top-[56px] flex justify-center">
        <RakayaLogo white height={72} />
      </div>

      <div className="absolute inset-x-0 top-[748px] flex flex-col items-center gap-[26px]" style={{ animation: "an-fade-in 1s 1.4s both cubic-bezier(.16,1,.3,1)" }}>
        <p className="m-0 text-[64px] font-medium leading-none">
          <span style={{ color: D.sky }}>{WORKSHOP.subtitle.mind}</span>
          <span style={{ color: D.dim }}>{WORKSHOP.subtitle.sep}</span>
          <span style={{ color: D.agent }}>{WORKSHOP.subtitle.agent}</span>
        </p>
        <p className="m-0 text-[36px] font-bold leading-none" style={{ color: D.mist }}>
          {WORKSHOP.presenter}
        </p>
      </div>
      <h1 className="sr-only">{WORKSHOP.title}</h1>
      {/* the presenter's own mouse is the only "mind" pointer now; the agent keeps its drawn, labelled pointer */}
      <RefPointer refEl={agentRef} label={AGENT_LABEL} />
    </div>
  );
}
