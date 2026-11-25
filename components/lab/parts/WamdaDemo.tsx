"use client";

import { T, type LabProps } from "../tokens";
import { Wamda, type WamdaClip, type WamdaMode } from "../wamda/Wamda";

export function WamdaDemo({ replay = 0, clip = "idle", mode = "reveal", flip = false }: LabProps & { clip?: string; mode?: string; flip?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 55% at 50% 62%, #16262b 0%, ${T.ink} 70%)` }}>
      <div className="absolute left-1/2 top-[880px] h-[26px] w-[520px] -translate-x-1/2 rounded-[50%]" style={{ background: "radial-gradient(closest-side, rgba(0,0,0,.55), transparent)" }} />
      <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2">
        <Wamda key={`${clip}-${mode}-${replay}`} clip={clip as WamdaClip} mode={mode as WamdaMode} scale={11} flip={flip} replay={replay} />
      </div>
    </div>
  );
}
