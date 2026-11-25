"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft02Icon, ArrowDown02Icon } from "@hugeicons/core-free-icons";
import { D, EASE, MONO } from "../theme";
import { Icon } from "./ui";

/**
 * Shared pieces for the practical tracks (slides 19–28): a simulated app window, and the workflow rail.
 * Everything here is drawn in code and editable; nothing is a screenshot of the real product.
 */

/**
 * Track slides carry a two-line heading (the track's name, then the slide's line). Everything under it is drawn
 * on the same 1920x1080 grid as before and moved down and in a little, uniformly, so nothing collides with the
 * sub-heading and every pointer route still lands on its target.
 */
export const TRACK_BODY = { y: 56, scale: 0.94 } as const;
export function TrackBody({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0" style={{ transform: `translateY(${TRACK_BODY.y}px) scale(${TRACK_BODY.scale})`, transformOrigin: "50% 0" }}>
      {children}
    </div>
  );
}

/** The label every simulated window carries, so nobody mistakes it for a live connection. */
export const SIM_LABEL = "محاكاة توضيحية";

/**
 * A desktop app window, inspired by the general layout of pro tools (not a copy of any one of them).
 * Positioned in stage coordinates. `logo` sits next to the title; the simulation badge sits on the far side.
 */
export function AppWindow({
  x,
  y,
  w,
  h,
  title,
  logo,
  bar = "#202326",
  body = "#141618",
  border = "#34383c",
  sim = SIM_LABEL,
  children,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  logo?: string;
  bar?: string;
  body?: string;
  border?: string;
  sim?: string | null;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{ left: x, top: y, width: w, height: h, borderRadius: 18, background: body, border: `1.5px solid ${border}`, boxShadow: "0 30px 90px rgba(0,0,0,.55)", ...style }}
    >
      <div dir="ltr" className="relative flex items-center" style={{ height: 50, background: bar, borderBottom: `1px solid ${border}`, padding: "0 18px", gap: 14 }}>
        <span className="flex" style={{ gap: 8 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c, opacity: 0.85 }} />
          ))}
        </span>
        {logo && <img src={logo} alt="" width={26} height={26} style={{ width: 26, height: 26, borderRadius: 6, objectFit: "contain" }} draggable={false} />}
        <span className="font-bold" style={{ fontSize: 18, color: "#d9dde2", fontFamily: MONO }}>
          {title}
        </span>
        {sim && (
          <span dir="rtl" className="absolute font-bold" style={{ right: 18, fontSize: 16, color: "#aab3bd", border: "1px dashed #5a636c", borderRadius: 99, padding: "4px 12px" }}>
            {sim}
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0" style={{ top: 50 }}>
        {children}
      </div>
    </div>
  );
}

export type FlowState = "todo" | "now" | "done";

/**
 * The workflow rail: equal cells in reading order (RTL: the first stage on the right), a small arrow between
 * each pair. `state(i)` colours each stage; `shown` reveals the first n cells (for a staggered entrance).
 * col = a vertical rail, top to bottom.
 */
export function FlowRail({
  items,
  state,
  shown,
  x,
  y,
  w,
  h = 84,
  gap = 46,
  col = false,
  size = 26,
  numbered = true,
  startAt = 1,
}: {
  items: readonly { label: string; latin?: boolean }[];
  state: (i: number) => FlowState;
  shown?: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  gap?: number;
  col?: boolean;
  size?: number;
  numbered?: boolean;
  /** the first stage's number, when a rail continues another slide's (slide 21 starts at 4) */
  startAt?: number;
}) {
  const n = items.length;
  const cell = col ? w : (w - gap * (n - 1)) / n;
  return (
    <div className="absolute" style={{ left: x, top: y, width: w }}>
      <ol className="m-0 flex list-none p-0" dir="rtl" style={{ flexDirection: col ? "column" : "row", gap }}>
        {items.map((it, i) => {
          const st = state(i);
          const on = shown === undefined || i < shown;
          const c = st === "now" ? D.agent : st === "done" ? D.sky : D.faint;
          return (
            <li
              key={it.label}
              data-flow={i}
              data-state={st}
              className="relative flex items-center"
              style={{
                width: cell,
                height: h,
                gap: 14,
                padding: "0 18px",
                borderRadius: 20,
                background: st === "now" ? "rgba(255,122,0,.12)" : D.panel,
                border: `2px solid ${st === "todo" ? D.line : c}`,
                boxShadow: st === "now" ? `0 0 36px ${D.agent}40` : "none",
                opacity: on ? (st === "todo" ? 0.78 : 1) : 0,
                transform: on ? "none" : "translateY(16px)",
                transition: `opacity .45s ease, transform .55s ${EASE}, border-color .4s, background .4s, box-shadow .4s`,
              }}
            >
              {numbered && (
                <span className="flex-none font-black tabular-nums" style={{ fontSize: size * 0.8, color: c, fontFamily: MONO }}>
                  {String(i + startAt).padStart(2, "0")}
                </span>
              )}
              <span dir={it.latin ? "ltr" : "rtl"} className="font-bold leading-[1.15]" style={{ fontSize: size, color: st === "todo" ? D.dim : D.mist }}>
                {it.label}
              </span>
              {i < n - 1 && (
                <span
                  className="absolute flex items-center justify-center"
                  style={col ? { left: "50%", bottom: -gap, height: gap, width: 40, marginLeft: -20 } : { left: -gap, top: 0, bottom: 0, width: gap }}
                  aria-hidden
                >
                  <Icon icon={col ? ArrowDown02Icon : ArrowLeft02Icon} size={28} color={state(i + 1) === "todo" ? D.faint : D.sky} stroke={2} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A request bubble in a chat panel: the person's words, sky, aligned to the start. */
export function AskBubble({ text, on, size = 26, style }: { text: ReactNode; on: boolean; size?: number; style?: CSSProperties }) {
  return (
    <div
      className="font-bold leading-[1.45]"
      style={{
        fontSize: size,
        color: D.ink,
        background: D.sky,
        borderRadius: "22px 22px 6px 22px",
        padding: "14px 20px",
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(14px) scale(.96)",
        transformOrigin: "bottom right",
        transition: `opacity .4s ease, transform .5s ${EASE}`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** A short status line from the agent: an orange dot, then the words. */
export function AgentLine({ text, on, done = false, size = 22, style }: { text: ReactNode; on: boolean; done?: boolean; size?: number; style?: CSSProperties }) {
  return (
    <div className="flex items-center font-bold" style={{ gap: 12, fontSize: size, color: done ? D.mist : D.agentSoft, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(10px)", transition: `opacity .35s ease, transform .45s ${EASE}`, ...style }}>
      <span className="flex-none rounded-full" style={{ width: 12, height: 12, background: done ? "#33d17a" : D.agent, animation: on && !done ? "deck-blink 1s steps(1) infinite" : undefined }} />
      {text}
    </div>
  );
}
