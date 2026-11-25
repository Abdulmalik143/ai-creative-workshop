"use client";

import { memo, useEffect, useState } from "react";
import GradientASCII from "@/components/reactbits/GradientASCII";
import { ASCII_ORANGE, D } from "../theme";
import type { BgLevel } from "../types";

/**
 * The ground behind every slide.
 * - plain: dark and clean.
 * - cover: dark, with a very faint glow on the edges only; the middle stays quiet.
 * - ascii: React Bits Gradient ASCII in the deck's oranges, used on slide 07 only. It mounts when that slide
 *   arrives (its intro plays), fades out when it leaves, and unmounts after the fade, so no other slide pays for it.
 */
export const DeckBackground = memo(function DeckBackground({ level }: { level: BgLevel }) {
  const ascii = level === "ascii";
  const [mounted, setMounted] = useState(ascii);
  useEffect(() => {
    if (ascii) {
      setMounted(true);
      return;
    }
    const t = window.setTimeout(() => setMounted(false), 800);
    return () => clearTimeout(t);
  }, [ascii]);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: D.ink }} aria-hidden>
      {/* cover: edge glow only */}
      <div
        className="absolute inset-0"
        style={{
          opacity: level === "cover" ? 1 : 0,
          transition: "opacity .9s ease",
          background: [
            "radial-gradient(ellipse 75% 34% at 50% 112%, rgba(30,63,216,.55), transparent 72%)",
            "radial-gradient(ellipse 30% 38% at -2% -4%, rgba(56,189,248,.2), transparent 72%)",
            "radial-gradient(ellipse 30% 38% at 102% -4%, rgba(56,189,248,.18), transparent 72%)",
            "radial-gradient(ellipse 26% 32% at -3% 104%, rgba(255,122,0,.2), transparent 72%)",
          ].join(", "),
          boxShadow: "inset 0 0 180px rgba(30,63,216,.22)",
        }}
      />

      {/* slide 07: the ASCII field, in orange */}
      <div className="absolute inset-0" style={{ opacity: ascii ? 1 : 0, transition: "opacity .7s ease" }}>
        {mounted && <GradientASCII colors={ASCII_ORANGE} shape="horizon" intro mouseInteraction clickEffect="wave" dpr={1} className="absolute inset-0" />}
        {/* keeps the title (top) and the character (middle) clear of the glyphs */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 22% 38% at 50% 50%, rgba(5,8,13,.78), rgba(5,8,13,.35) 70%, transparent 100%)",
              "linear-gradient(180deg, rgba(5,8,13,.92) 0%, rgba(5,8,13,.82) 15%, rgba(5,8,13,.35) 24%, transparent 36%, transparent 76%, rgba(5,8,13,.3) 100%)",
            ].join(", "),
          }}
        />
      </div>
    </div>
  );
});
