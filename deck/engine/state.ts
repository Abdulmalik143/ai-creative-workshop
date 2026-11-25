import type { SlideDef } from "../types";

/**
 * Deck state. Each slide remembers its own step, so leaving a slide and coming back shows it as you left it.
 * Only "replay" rewinds a slide (and remounts it, so every animation starts over).
 */
export type DeckState = { index: number; steps: number[]; epochs: number[] };

export type DeckAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "nextSlide" }
  | { type: "prevSlide" }
  | { type: "goto"; index: number; step?: number }
  | { type: "replay" };

export function initDeck(slides: readonly SlideDef[], index = 0): DeckState {
  return { index: clamp(index, 0, slides.length - 1), steps: slides.map(() => 0), epochs: slides.map(() => 0) };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function deckReducer(slides: readonly SlideDef[]) {
  const last = slides.length - 1;
  const total = (i: number) => Math.max(1, slides[i].steps.length);
  return (s: DeckState, a: DeckAction): DeckState => {
    // a hot reload can change the slide list under a live state: pad it instead of misreading it
    if (s.steps.length !== slides.length) s = { ...s, steps: slides.map((_, k) => s.steps[k] ?? 0), epochs: slides.map((_, k) => s.epochs[k] ?? 0) };
    const i = s.index;
    const setStep = (step: number) => {
      const steps = s.steps.slice();
      steps[i] = clamp(step, 0, total(i) - 1);
      return { ...s, steps };
    };
    switch (a.type) {
      case "next":
        // within the slide first; at its last step, the presenter's next press moves to the next slide
        if (s.steps[i] < total(i) - 1) return setStep(s.steps[i] + 1);
        return i < last ? { ...s, index: i + 1 } : s;
      case "prev":
        if (s.steps[i] > 0) return setStep(s.steps[i] - 1);
        return i > 0 ? { ...s, index: i - 1 } : s;
      case "nextSlide":
        return i < last ? { ...s, index: i + 1 } : s;
      case "prevSlide":
        return i > 0 ? { ...s, index: i - 1 } : s;
      case "goto": {
        const index = clamp(a.index, 0, last);
        if (a.step === undefined) return { ...s, index };
        const steps = s.steps.slice();
        steps[index] = clamp(a.step, 0, total(index) - 1);
        return { ...s, index, steps };
      }
      case "replay": {
        const steps = s.steps.slice();
        const epochs = s.epochs.slice();
        steps[i] = 0;
        epochs[i] += 1;
        return { ...s, steps, epochs };
      }
    }
  };
}
