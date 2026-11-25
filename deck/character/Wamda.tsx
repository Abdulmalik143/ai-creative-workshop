"use client";

import type { CSSProperties } from "react";
import { Wamda as WamdaSprite, type WamdaClip } from "@/components/lab/wamda/Wamda";
import { D } from "../theme";

/**
 * Wamda in the deck. The sprite is the lab's pixel-art Wamda, generated from the reference video
 * (source-assets/Wamda.mp4 in ai-agent-course): orange hoodie, glasses, headphones, black details.
 *
 * Two axes, kept apart:
 *   look  = what the audience is allowed to see: silhouette before slide 07, the reveal during it, orange after.
 *   act   = what Wamda is doing: idle, speaking, questioning, thinking, waving; standing (still, hand raised) and
 *           greeting (the same pose, only the hand waves) for the introduction on slide 07.
 */
export type WamdaLook = "silhouette" | "reveal" | "orange";
export type WamdaAct = "idle" | "speaking" | "questioning" | "thinking" | "waving" | "standing" | "greeting";

/** The reveal happens on slide 07. Every slide asks this instead of deciding for itself. */
export const REVEAL_SLIDE = 7;
export function lookFor(slideNo: number): WamdaLook {
  if (slideNo < REVEAL_SLIDE) return "silhouette";
  if (slideNo === REVEAL_SLIDE) return "reveal";
  return "orange";
}

const CLIP: Record<WamdaAct, WamdaClip> = {
  idle: "idle",
  speaking: "idle",
  questioning: "shrug",
  thinking: "think",
  waving: "wave",
  standing: "stand",
  greeting: "greet",
};

const MODE = { silhouette: "silhouette", reveal: "reveal", orange: "color" } as const;

export function WamdaActor({
  look,
  act = "idle",
  scale = 6,
  flip = false,
  revealDelay = 300,
  revealMs = 1800,
  glow = false,
  shadow = true,
  className = "",
  style,
}: {
  look: WamdaLook;
  act?: WamdaAct;
  /** screen px per sprite pixel (the sprite is 72 x 76) */
  scale?: number;
  flip?: boolean;
  revealDelay?: number;
  revealMs?: number;
  /** a soft light behind the character: sky for the silhouette, orange once revealed */
  glow?: boolean;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const w = 72 * scale;
  const h = 76 * scale;
  const talking = act === "speaking" || act === "questioning";
  return (
    <div className={`relative ${className}`} style={{ width: w, height: h, ...style }}>
      {glow && (
        <div
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: w * 1.5,
            height: w * 1.5,
            background: `radial-gradient(closest-side, ${look === "silhouette" ? "rgba(165,216,255,.22)" : "rgba(255,122,0,.32)"}, transparent 70%)`,
            transition: "background 1.2s ease",
            animation: "deck-glow 4s ease-in-out infinite",
          }}
        />
      )}
      {shadow && (
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
          style={{ bottom: -scale * 1.5, width: w * 0.7, height: scale * 4, background: "radial-gradient(closest-side, rgba(0,0,0,.6), transparent)" }}
        />
      )}
      <div className="absolute inset-0" style={{ animation: talking ? "deck-talk .9s ease-in-out infinite" : act === "idle" ? "deck-bob 3.6s ease-in-out infinite" : undefined }}>
        <WamdaSprite key={`${look}-${act}`} clip={CLIP[act]} mode={MODE[look]} scale={scale} flip={flip} revealDelay={revealDelay} revealMs={revealMs} />
      </div>
    </div>
  );
}

/** The deck's colours for Wamda's speech, so a question never reveals the orange before slide 07. */
export function bubbleTone(look: WamdaLook): "light" | "orange" {
  return look === "silhouette" ? "light" : "orange";
}

export const WAMDA_COLORS = { agent: D.agent, rim: D.sage };
