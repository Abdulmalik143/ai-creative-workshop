"use client";

import GradientASCII from "./vendor/GradientASCII";

const atmosphere = ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"];

export function Backdrop({ live = false }: { live?: boolean }) {
  return (
    <div className="ascii-backdrop" aria-hidden="true">
      {live && (
        <GradientASCII
          colors={atmosphere}
          shape="horizon"
          intro
          mouseInteraction
          clickEffect="wave"
          dpr={1}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
