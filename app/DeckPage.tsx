"use client";

import { useEffect } from "react";
import { Deck } from "@/deck/engine/Deck";
import { SLIDES } from "@/deck/registry";
import { preload3D } from "@/deck/kit/lazy3d";

export function DeckPage() {
  // fetch the three.js chunk in the background once the first slide is up
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => preload3D());
  }, []);
  return <Deck key={SLIDES.length} slides={SLIDES} />;
}
