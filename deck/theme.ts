import { T, MONO } from "@/components/lab/tokens";

export { MONO };

/**
 * React Bits "Gradient ASCII" palette as shipped ("Atmosphere"). The deck no longer shows that field, but the
 * human side of every diagram keeps these blues (sky, azure, cobalt, paper below).
 */
export const ATMOSPHERE = ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"];

/** The same field in the deck's oranges, slot for slot (deep, light, mid, accent). Slide 07 only. */
export const ASCII_ORANGE = ["#9a3f08", "#fff1dc", "#ffb25e", "#ff7a00"];

/**
 * Deck tokens. Two families, one rule:
 *   cool (Atmosphere) = the human: the presenter, the designer, the mind, the idea
 *   warm (Wamda)      = the agent: its cursor, its work, its highlights
 * Neutrals are the lab's ink and mist, nudged toward blue so panels sit on the field without turning green.
 */
export const D = {
  ink: "#05080d",
  panel: "#0a1018",
  panel2: "#101924",
  panel3: "#16212e",
  line: "rgba(165,216,255,0.14)",
  lineStrong: "rgba(165,216,255,0.32)",
  mist: T.mist,
  text: "#e8eef6",
  dim: "#8093a6",
  faint: "#4a5b6c",
  sage: T.sage,
  // human
  sky: "#a5d8ff",
  azure: "#38bdf8",
  cobalt: "#1e3fd8",
  paper: "#f6f8ff",
  // agent
  agent: T.orange,
  agentSoft: T.orangeSoft,
  agentDeep: T.orangeDeep,
  agentInk: "#1a0c00",
} as const;

/** The deck's type scale, authored on the 1920x1080 stage. */
export const TYPE = {
  display: 132,
  title: 80,
  h2: 54,
  h3: 40,
  body: 34,
  small: 26,
  tiny: 20,
} as const;

/** One easing for everything that moves into place. */
export const EASE = "cubic-bezier(.2,.8,.2,1)";
