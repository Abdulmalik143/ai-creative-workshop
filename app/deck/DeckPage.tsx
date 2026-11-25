"use client";

import { Deck } from "@/deck/engine/Deck";
import { SLIDES } from "@/deck/registry";

export function DeckPage() {
  return <Deck key={SLIDES.length} slides={SLIDES} />;
}
