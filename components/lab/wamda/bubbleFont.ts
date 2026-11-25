import localFont from "next/font/local";

/**
 * The pixel face for Wamda's speech: Unixel (OFL 1.1, public/fonts/unixel), used only on
 * the text inside SpeechBubble. Titles and slide copy keep ثمانية Sans.
 *
 * Unixel's letters sit smaller on the em than ثمانية Sans (alef 0.64 em vs 0.75 em), so
 * size-adjust 117% keeps the bubbles' fontSize values at the same reading size as before.
 * It has one weight: the class sets 400, and the bubble turns off synthetic bold so the
 * pixels stay square. If the file fails to load, the bubble falls back to ثمانية Sans.
 */
export const bubbleFont = localFont({
  src: "../../../public/fonts/unixel/unixel-Regular.woff2",
  weight: "400",
  display: "swap",
  declarations: [{ prop: "size-adjust", value: "117%" }],
  adjustFontFallback: false,
  fallback: ["var(--font-thmanyah)", "system-ui", "sans-serif"],
});
