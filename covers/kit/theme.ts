/** Two palettes for the same two characters. "عقل" is always warm pink; "وكيل" is always electric blue. */
export const LIGHT = {
  bg: "#eceef4",
  panel: "#ffffff",
  panel2: "#f4f5f9",
  line: "#d3d7e3",
  text: "#0f1117",
  dim: "#667087",
  dots: "#c6cad8",
  mind: "#ff2d87",
  agent: "#3b4cff",
  bar: "#13141a",
  barText: "#aab0c3",
} as const;

export const DARK = {
  bg: "#0d0e13",
  panel: "#15171e",
  panel2: "#1c1f29",
  line: "#2a2e3b",
  text: "#f4f5f8",
  dim: "#8f95a9",
  dots: "#252937",
  mind: "#ff4fa0",
  agent: "#7787ff",
  bar: "#07080b",
  barText: "#9aa0b4",
} as const;

export type Theme = { [K in keyof typeof LIGHT]: string };
