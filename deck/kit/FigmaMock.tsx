"use client";

import type { CSSProperties, ReactNode } from "react";
import { BrandMark } from "../media/brands";
import { D, MONO } from "../theme";

/**
 * An illustrative design-tool window, drawn inside the deck. It is a simulation, not the real application,
 * and says so in its title bar. Slides place components on its canvas in stage coordinates.
 */
export const FIGMA_UI = { bar: 56, layers: 250, props: 250 };

export function FigmaMock({
  x,
  y,
  w,
  h,
  file,
  sim,
  layers,
  props,
  children,
  style,
  layersW = FIGMA_UI.layers,
  propsW = FIGMA_UI.props,
}: {
  layersW?: number;
  propsW?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  file: string;
  /** the "simulation" note in the title bar */
  sim: string;
  layers: { name: string; on: boolean; active?: boolean }[];
  props?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="absolute overflow-hidden rounded-t-[22px]" style={{ left: x, top: y, width: w, height: h, background: "#1e1e1e", border: "1.5px solid #3a3a3a", boxShadow: "0 -20px 80px rgba(0,0,0,.55)", ...style }}>
      <div dir="ltr" className="flex items-center justify-between px-[20px]" style={{ height: FIGMA_UI.bar, background: "#2c2c2c", borderBottom: "1px solid #3a3a3a" }}>
        <div className="flex items-center gap-[14px]">
          <BrandMark id="figma" size={34} radius={8} />
          <span className="text-[20px] font-bold" style={{ color: "#e6e6e6", fontFamily: MONO }}>
            {file}
          </span>
        </div>
        <span dir="rtl" className="rounded-full px-[14px] py-[5px] text-[17px] font-bold" style={{ color: "#bdbdbd", border: "1px dashed #5a5a5a" }}>
          {sim}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 overflow-hidden" style={{ top: FIGMA_UI.bar, width: layersW, background: "#2c2c2c", borderRight: "1px solid #3a3a3a" }}>
        <p dir="ltr" className="m-0 px-[18px] pb-[8px] pt-[16px] text-[16px] font-bold" style={{ color: "#9a9a9a", fontFamily: MONO }}>
          Layers
        </p>
        <ul dir="ltr" className="m-0 list-none px-[10px] py-0">
          {layers.map((l) => (
            <li
              key={l.name}
              className="flex items-center gap-[10px] rounded-[6px] px-[10px] py-[8px] text-[18px]"
              style={{ opacity: l.on ? 1 : 0, transform: l.on ? "none" : "translateX(-8px)", transition: "all .35s", background: l.active ? "rgba(255,122,0,.2)" : "transparent", color: "#e6e6e6", fontFamily: MONO }}
            >
              <span className="h-[12px] w-[12px] rounded-[3px]" style={{ border: "2px solid #9a9a9a" }} />
              {l.name}
            </li>
          ))}
        </ul>
      </div>
      {propsW > 0 && (
        <div className="absolute bottom-0 right-0" style={{ top: FIGMA_UI.bar, width: propsW, background: "#2c2c2c", borderLeft: "1px solid #3a3a3a" }}>
          {props}
        </div>
      )}
      <div
        className="absolute bottom-0"
        style={{ top: FIGMA_UI.bar, left: layersW, right: propsW, background: "#1e1e1e", backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1.4px, transparent 1.4px)", backgroundSize: "28px 28px" }}
      />
      {children}
    </div>
  );
}

/** Selection handles around whatever was just made. */
export function Selected({ on, color = D.agent }: { on: boolean; color?: string }) {
  if (!on) return null;
  const h = (st: CSSProperties) => <span className="absolute h-[12px] w-[12px] bg-white" style={{ border: `2px solid ${color}`, ...st }} />;
  return (
    <span className="pointer-events-none absolute -inset-[6px]" style={{ outline: `2px solid ${color}`, animation: "lab-fade .25s both" }}>
      {h({ left: -6, top: -6 })}
      {h({ right: -6, top: -6 })}
      {h({ left: -6, bottom: -6 })}
      {h({ right: -6, bottom: -6 })}
    </span>
  );
}

/** A plain folder shape for small, static Skill marks (the animated one is React Bits Folder). */
export function MiniFolder({ label, color = D.agent, w = 220, ink = D.agentInk }: { label: string; color?: string; w?: number; ink?: string }) {
  const h = w * 0.74;
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <div className="absolute left-[8%] top-0 rounded-t-[12px]" style={{ width: "40%", height: h * 0.2, background: color, filter: "brightness(.82)" }} />
      <div className="absolute inset-x-0 bottom-0 rounded-[16px]" style={{ top: h * 0.12, background: color, filter: "brightness(.82)" }} />
      <div className="absolute left-[7%] right-[7%] rounded-[8px]" style={{ top: h * 0.2, height: h * 0.3, background: D.paper, transform: "rotate(-3deg)" }} />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-[16px]" style={{ top: h * 0.36, background: color, boxShadow: "inset 0 2px 0 rgba(255,255,255,.35)" }}>
        <span dir="ltr" className="font-black" style={{ color: ink, fontSize: w * 0.17 }}>
          {label}
        </span>
      </div>
    </div>
  );
}
