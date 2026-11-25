"use client";

import type { CSSProperties, ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { D, MONO, TYPE } from "../theme";
import { TOOL_LOGOS } from "../media/tools";

export type { IconSvgElement };

/** Hugeicons, the icon set this project already ships. */
export function Icon({ icon, size = 40, color = "currentColor", stroke = 1.6, className, style }: { icon: IconSvgElement; size?: number; color?: string; stroke?: number; className?: string; style?: CSSProperties }) {
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={stroke} className={className} style={style} aria-hidden />;
}

/** Where every slide's main heading sits: top, centred, same size. The cover keeps its own composition. */
export const TITLE = { top: 64, size: 74, sub: 40 } as const;

/**
 * The slide's main heading, centred at the top. `latin` sets an English title left-to-right.
 * `sub` is an optional line under it (a sub-question), part of the heading block.
 */
export function SlideTitle({
  children,
  latin = false,
  size = TITLE.size,
  color = D.mist,
  sub,
  subColor = D.sky,
  subStyle,
  style,
}: {
  children: ReactNode;
  latin?: boolean;
  size?: number;
  color?: string;
  sub?: ReactNode;
  subColor?: string;
  subStyle?: CSSProperties;
  style?: CSSProperties;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-[110px] flex flex-col items-center text-center" style={{ top: TITLE.top, ...style }}>
      <h1 dir={latin ? "ltr" : "rtl"} className="m-0 font-black leading-[1.12]" style={{ fontSize: size, color, letterSpacing: latin ? "-0.01em" : undefined }}>
        {children}
      </h1>
      {sub && (
        <p className="m-0 mt-[14px] font-bold leading-[1.3]" style={{ fontSize: TITLE.sub, color: subColor, ...subStyle }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** A surface for content. Solid on purpose: no backdrop blur. */
export function Panel({ children, className = "", style, glow }: { children?: ReactNode; className?: string; style?: CSSProperties; glow?: string }) {
  return (
    <div
      className={`rounded-[24px] ${className}`}
      style={{
        background: D.panel,
        border: `1.5px solid ${glow ?? D.line}`,
        boxShadow: glow ? `0 0 0 1px ${glow}22, 0 24px 60px rgba(0,0,0,.45), 0 0 60px ${glow}22` : "0 24px 60px rgba(0,0,0,.4)",
        transition: "border-color .5s, box-shadow .5s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A small pill: tech terms, formats, states. */
export function Chip({ children, color = D.sky, solid = false, latin = false, size = TYPE.tiny + 2, style }: { children: ReactNode; color?: string; solid?: boolean; latin?: boolean; size?: number; style?: CSSProperties }) {
  return (
    <span
      dir={latin ? "ltr" : undefined}
      className="inline-flex items-center gap-[10px] whitespace-nowrap rounded-full px-[18px] py-[7px] font-bold leading-none"
      style={{
        fontSize: size,
        color: solid ? D.ink : color,
        background: solid ? color : "transparent",
        border: `1.5px solid ${solid ? color : `${color}88`}`,
        fontFamily: latin ? MONO : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Marks a stand-in that waits for a real file. Visible only in the development view, so the audience never
 * sees it; the owner sees exactly what to replace and where it is configured.
 */
export function PlaceholderTag({ dev, label, style }: { dev: boolean; label: string; style?: CSSProperties }) {
  if (!dev) return null;
  return (
    <span
      dir="ltr"
      className="pointer-events-none absolute z-[70] whitespace-nowrap rounded-[8px] px-[12px] py-[6px] text-[18px] font-bold leading-none"
      style={{ top: 14, left: 14, background: "repeating-linear-gradient(135deg,#ffd60a 0 10px,#ffbf00 10px 20px)", color: "#1a1400", fontFamily: MONO, ...style }}
    >
      PLACEHOLDER · {label}
    </span>
  );
}

/**
 * A tool under a column title (slides 03 and 05): its logo, then its name. The name is English, isolated
 * left-to-right. The logo comes from deck/media/tools.ts (official file, or a stand-in until the file exists).
 */
export function ToolBadge({ name, color, size = "md" }: { name: string; color: string; size?: "md" | "sm" }) {
  const t = TOOL_LOGOS[name] ?? {};
  const sm = size === "sm";
  const mark = sm ? 26 : 34;
  return (
    <span
      dir="ltr"
      className="inline-flex items-center whitespace-nowrap rounded-full font-bold leading-none"
      style={{ color: D.mist, background: `${color}14`, border: `1.5px solid ${color}77`, gap: sm ? 9 : 12, padding: sm ? "5px 15px 5px 6px" : "7px 20px 7px 8px", fontSize: sm ? 20 : 24 }}
    >
      {t.logo && t.kind === "icon" ? (
        // an app icon with its own tile: fills the slot
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.logo} alt="" width={mark + 8} height={mark + 8} className="flex-none" style={{ width: mark + 8, height: mark + 8, borderRadius: (mark + 8) * 0.24, objectFit: "cover" }} draggable={false} />
      ) : (
        <span className="flex flex-none items-center justify-center overflow-hidden rounded-full" style={{ width: mark + 8, height: mark + 8, background: "rgba(255,255,255,.07)" }}>
          {t.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.logo} alt="" width={mark - 6} height={mark - 6} style={{ width: mark - 6, height: mark - 6, objectFit: "contain" }} draggable={false} />
          ) : t.fallback ? (
            <Icon icon={t.fallback} size={mark - 8} color={D.mist} stroke={1.7} />
          ) : (
            <span className="font-black" style={{ color: D.mist, fontSize: mark * 0.5 }}>
              {name[0]}
            </span>
          )}
        </span>
      )}
      {name}
    </span>
  );
}

/** A thin rule with a label, used to group things without boxes. */
export function Kicker({ children, color = D.dim, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <span className="inline-flex items-center gap-[14px] text-[24px] font-bold" style={{ color, ...style }}>
      <span className="h-[2px] w-[34px]" style={{ background: color }} />
      {children}
    </span>
  );
}
