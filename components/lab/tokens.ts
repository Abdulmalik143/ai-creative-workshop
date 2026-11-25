/**
 * Identity tokens for the component lab. Everything here comes from what the project already owns:
 * the Rakaya lockup (white + sage), the Wamda character (orange), and ثمانية Sans.
 * Change a value here and every lab component follows.
 */
export const T = {
  ink: "#070b0e",
  panel: "#0d1418",
  panel2: "#131d22",
  line: "rgba(179,196,198,0.16)",
  lineStrong: "rgba(179,196,198,0.34)",
  sage: "#b3c4c6",
  mist: "#f2f5f5",
  dim: "#7f9296",
  orange: "#ff7a00",
  orangeSoft: "#ffb25e",
  orangeDeep: "#9a3f08",
} as const;

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** Every lab component is authored on a 1920x1080 stage and receives these. */
export type LabProps = {
  /** the current stage of a staged component (0-based). undefined = the component runs by itself */
  step?: number;
  /** bump to restart the component's own timeline */
  replay?: number;
};
