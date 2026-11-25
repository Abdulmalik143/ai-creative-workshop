"use client";

import type { ReactNode } from "react";
import GradientASCII from "@/components/reactbits/GradientASCII";
import { RakayaLogo } from "@/components/stage/Brand";
import { T, type LabProps } from "../tokens";

export const ASCII_PALETTES = {
  /** the Rakaya lockup's own colours */
  sage: ["#0c2327", "#f2f5f5", "#b3c4c6", "#5b8b92"],
  /** Wamda's orange */
  wamda: ["#2a0f00", "#ff7a00", "#ffb25e", "#fff1dc"],
} as const;

/**
 * The deck's main background: React Bits "Gradient ASCII" with the project's palettes.
 * Put slide content in `children`; it sits above the field.
 */
export function AsciiBackground({
  shape = "horizon",
  palette = "sage",
  interactive = true,
  children,
}: {
  shape?: "horizon" | "pinch" | "rise" | "eclipse";
  palette?: keyof typeof ASCII_PALETTES;
  interactive?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <GradientASCII
        key={`${shape}-${palette}`}
        colors={[...ASCII_PALETTES[palette]]}
        shape={shape}
        intro
        mouseInteraction={interactive}
        clickEffect={interactive ? "wave" : "none"}
        dpr={1.25}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0">{children}</div>
    </div>
  );
}

export function AsciiBackgroundDemo({ shape = "horizon", palette = "sage", interactive = true }: LabProps & { shape?: string; palette?: string; interactive?: boolean }) {
  return (
    <AsciiBackground shape={shape as "horizon"} palette={palette as "sage"} interactive={interactive}>
      <RakayaLogo height={52} className="absolute left-[96px] top-[84px]" />
    </AsciiBackground>
  );
}
