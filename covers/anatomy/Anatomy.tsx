"use client";

import { useEffect, useMemo, useRef } from "react";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import glyphs from "./glyphs.json";

type Line = (typeof glyphs)[number];

const FONT_PX = 205; // both lines share one size, as a real type setting would
const RIGHT = 1800;
const TOPS = [150, 450];
const POSTER = 4.9;

function AnatomyArt() {
  const { active, pointer, reducedMotion } = useStage();
  const holeRef = useRef<SVGCircleElement>(null);
  const lensRef = useRef<SVGCircleElement>(null);
  const pos = useRef({ x: -999, y: -999, r: 0 });

  const lines = useMemo(
    () =>
      (glyphs as Line[]).map((l, i) => {
        const w = (l.rawW / l.upem) * FONT_PX;
        const sc = w / 1000;
        return { ...l, sc, w, x0: RIGHT - w, y0: TOPS[i] };
      }),
    [],
  );

  useStageLoop(
    (t) => {
      const p = pointer.current;
      const live = active && !reducedMotion;
      // with no pointer, the lens drifts across the title on its own once the type is set
      const idle = live && !p.inside && t > 9.2;
      const target = live && p.inside
        ? { x: p.x, y: p.y, r: 230 }
        : idle
          ? { x: 960 + 720 * Math.sin(t * 0.33), y: 470 + 250 * Math.sin(t * 0.47 + 1.3), r: 200 }
          : { x: pos.current.x, y: pos.current.y, r: 0 };
      pos.current.x += (target.x - pos.current.x) * (p.inside ? 0.22 : 0.1);
      pos.current.y += (target.y - pos.current.y) * (p.inside ? 0.22 : 0.1);
      if (pos.current.x < -900) { pos.current.x = target.x; pos.current.y = target.y; }
      pos.current.r += (target.r - pos.current.r) * 0.14;
      for (const el of [holeRef.current, lensRef.current]) {
        if (!el) continue;
        el.setAttribute("cx", String(pos.current.x));
        el.setAttribute("cy", String(pos.current.y));
        el.setAttribute("r", String(Math.max(0.01, pos.current.r)));
      }
    },
    { poster: POSTER },
  );

  return (
    <svg
      className="absolute inset-0"
      width={STAGE_W}
      height={STAGE_H}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      aria-hidden
    >
      <defs>
        <radialGradient id="an-hole">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.86" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
        <radialGradient id="an-lens">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        {/* fill layer: everything visible except the lens */}
        <mask id="an-fill-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={STAGE_W} height={STAGE_H}>
          <rect width={STAGE_W} height={STAGE_H} fill="#fff" />
          <circle ref={holeRef} cx={-999} cy={-999} r={0.01} fill="url(#an-hole)" />
        </mask>
        {/* wire layer: visible while the agent is still drawing, then only inside the lens */}
        <mask id="an-wire-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={STAGE_W} height={STAGE_H}>
          <rect className="an-wire-rest seek" width={STAGE_W} height={STAGE_H} fill="#fff" />
          <circle ref={lensRef} cx={-999} cy={-999} r={0.01} fill="url(#an-lens)" />
        </mask>
        {lines.map((l, i) => (
          <clipPath key={i} id={`an-clip-fill-${i}`} clipPathUnits="userSpaceOnUse">
            <rect
              className={`an-sweep an-sweep-fill-${i} seek`}
              x={l.x0 - 20}
              y={l.y0 - 40}
              width={l.w + 40}
              height={l.w * (l.h / 1000) + 80}
            />
          </clipPath>
        ))}
      </defs>

      <g mask="url(#an-fill-mask)">
        {lines.map((l, i) => (
          <g key={i} clipPath={`url(#an-clip-fill-${i})`}>
            <path d={l.d} transform={`translate(${l.x0} ${l.y0}) scale(${l.sc})`} fill="#fff" />
          </g>
        ))}
      </g>

      <g mask="url(#an-wire-mask)">
        {lines.map((l, i) => (
          <g key={i} transform={`translate(${l.x0} ${l.y0})`}>
            <path
              d={l.d}
              transform={`scale(${l.sc})`}
              fill="none"
              stroke="#fff"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
              className={`an-wire-draw an-wire-draw-${i} seek`}
              style={{ ["--d" as string]: `${0.25 + i * 0.7}s` }}
            />
            {l.handles.map((h, k) => (
              <line
                key={`h${k}`}
                x1={h[0] * l.sc}
                y1={h[1] * l.sc}
                x2={h[2] * l.sc}
                y2={h[3] * l.sc}
                stroke="#a9b8ff"
                strokeWidth={1}
                className="an-node seek"
                style={{ ["--d" as string]: `${0.35 + i * 0.7 + (1 - h[0] / 1000) * 1.5}s` }}
              />
            ))}
            {l.offs.map((o, k) => (
              <circle
                key={`o${k}`}
                cx={o[0] * l.sc}
                cy={o[1] * l.sc}
                r={4.5}
                fill="#2338f2"
                stroke="#a9b8ff"
                strokeWidth={1.5}
                className="an-node seek"
                style={{ ["--d" as string]: `${0.35 + i * 0.7 + (1 - o[0] / 1000) * 1.5}s` }}
              />
            ))}
            {l.nodes.map((n, k) => (
              <rect
                key={`n${k}`}
                x={n[0] * l.sc - 5.5}
                y={n[1] * l.sc - 5.5}
                width={11}
                height={11}
                fill="#fff"
                stroke="#2338f2"
                strokeWidth={2}
                className="an-node seek"
                style={{ ["--d" as string]: `${0.4 + i * 0.7 + (1 - n[0] / 1000) * 1.5}s` }}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Anatomy({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#2338f2">
      <AnatomyShell />
    </Stage>
  );
}

function AnatomyShell() {
  const { active, reducedMotion } = useStage();
  const frozen = !active || reducedMotion;
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--seek", frozen ? `${POSTER}s` : "0s");
  }, [frozen]);
  return (
    <div ref={rootRef} className={`absolute inset-0 ${frozen ? "poster-stage" : ""}`} style={{ ["--seek" as string]: frozen ? `${POSTER}s` : "0s" }}>
      <AnatomyArt />
      <h1 className="sr-only">الذكاء الاصطناعي في المجالات الإبداعية</h1>
      <p
        className="an-fade seek absolute text-[58px] font-medium leading-none text-white"
        style={{ right: STAGE_W - RIGHT, top: 790, ["--d" as string]: "1.6s" }}
      >
        <span>عقل يبدع</span>
        <span className="text-[#a9b8ff]">، ووكيل ينفّذ</span>
      </p>
      <span
        className="absolute bottom-[84px] left-[120px] text-[32px] font-normal leading-none text-[#c6d0ff]"
      >
        تقديم: عبدالملك الهندي
      </span>
      <RakayaLogo height={52} className="absolute left-[120px] top-[84px]" />
    </div>
  );
}
