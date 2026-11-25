"use client";

import { useEffect, useRef } from "react";
import { CHAR_H, CHAR_W, composeCharacter, type Character, type CharacterMode } from "./sprites";

/** One character on a canvas at its native 40x56 grid, scaled up with hard pixel edges. */
export function PixelCharacter({
  character,
  scale = 4,
  mode = "color",
  rim = true,
  className = "",
}: {
  character: Character;
  /** screen px per sprite pixel */
  scale?: number;
  mode?: CharacterMode;
  rim?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(new ImageData(composeCharacter(character, { mode, rim }), CHAR_W, CHAR_H), 0, 0);
  }, [character, mode, rim]);

  return (
    <canvas
      ref={ref}
      width={CHAR_W}
      height={CHAR_H}
      role="img"
      aria-label={`${character.name}، ${character.tagline}`}
      className={className}
      style={{ width: CHAR_W * scale, height: CHAR_H * scale, imageRendering: "pixelated" }}
    />
  );
}
