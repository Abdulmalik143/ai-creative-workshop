import type { ComponentType } from "react";

/** One click-stage of a slide. `key` is for code, `label` is what the presenter sees in the notes and the dev HUD. */
export type StepDef = { key: string; label: string };

/**
 * The ground behind a slide.
 *   plain = dark and clean (every slide by default)
 *   cover = dark, with a very faint glow on the edges only (slide 01)
 *   ascii = Gradient ASCII in the deck's oranges (slide 07 only)
 */
export type BgLevel = "plain" | "cover" | "ascii";

export type SlideStatus =
  /** content approved and built */
  | "ready"
  /** content not decided yet: the slide exists, empty, with its number */
  | "pending"
  /** built, but some media are stand-ins waiting for the real files */
  | "placeholders";

export type SlideProps = {
  /** current click-stage, 0-based. 0 is what shows when the slide arrives. */
  step: number;
  /** development view: placeholder tags and admin labels are visible */
  dev: boolean;
};

export type SlideDef = {
  id: string;
  no: number;
  /** admin title, for the HUD, the overview and the notes window */
  title: string;
  steps: readonly StepDef[];
  /** the ground behind the slide; a function when it changes with the click-stage (slide 07) */
  bg: BgLevel | ((step: number) => BgLevel);
  status: SlideStatus;
  Component: ComponentType<SlideProps>;
};

/** Helpers to read a step list by key instead of by number. */
export function stepper(steps: readonly StepDef[], step: number) {
  const idx = (key: string) => {
    const i = steps.findIndex((s) => s.key === key);
    if (i < 0) throw new Error(`unknown step "${key}"`);
    return i;
  };
  return {
    idx,
    /** this stage has been reached (it is now, or behind us) */
    at: (key: string) => step >= idx(key),
    /** this stage is the current one */
    is: (key: string) => step === idx(key),
    /** this stage is behind us */
    past: (key: string) => step > idx(key),
  };
}
