import { ChatGptIcon, ClaudeIcon, GoogleGeminiIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "../kit/ui";
import { asset } from "@/lib/asset";

/**
 * Logos for the tool names on slides 03 and 05, keyed by the name shown on the slide.
 * Files live in public/deck/logos/tools/, each taken from the company's own site (2026-11-23):
 *   chatgpt-white.svg  chatgpt.com/cdn/assets/favicon…svg — OpenAI Blossom; white is OpenAI's own dark-mode variant
 *   claude.svg         claude.com/icon.svg — Claude spark, brand colour, unaltered (Anthropic: no colour changes)
 *   gemini.png         gstatic.com/lamda/images/gemini_sparkle…png — the icon gemini.google.com serves
 *   codex.png          openai.com/codex page image (app icon, full colour, its own tile)
 *   cursor.svg         cursor.com/marketing-static/favicon.svg — dark app icon (cursor.com/brand)
 *   flux-white.svg     bfl.ai/brand/symbol-white.svg — Black Forest Labs symbol for dark grounds (FLUX has no separate mark)
 * No logo of their own: Claude Code (uses the Claude spark, as Anthropic's own pages do), Nano Banana (Google gives
 * it no logo; the Gemini sparkle stands for the model family it belongs to), Stable Diffusion (Stability AI's rules
 * allow its "s." mark only next to the name "Stability AI", so a neutral initial is shown).
 *
 * kind "mark" = a symbol drawn inside the round slot; kind "icon" = an app icon that already has its own tile.
 */
export type ToolLogo = { logo?: string; kind?: "mark" | "icon"; fallback?: IconSvgElement };

const L = asset("/deck/logos/tools");

export const TOOL_LOGOS: Record<string, ToolLogo> = {
  ChatGPT: { logo: `${L}/chatgpt-white.svg`, kind: "mark", fallback: ChatGptIcon },
  "ChatGPT Images": { logo: `${L}/chatgpt-white.svg`, kind: "mark", fallback: ChatGptIcon },
  Claude: { logo: `${L}/claude.svg`, kind: "mark", fallback: ClaudeIcon },
  "Claude Code": { logo: `${L}/claude.svg`, kind: "mark", fallback: ClaudeIcon },
  Gemini: { logo: `${L}/gemini.png`, kind: "mark", fallback: GoogleGeminiIcon },
  "Nano Banana": { logo: `${L}/gemini.png`, kind: "mark", fallback: GoogleGeminiIcon },
  Codex: { logo: `${L}/codex.png`, kind: "icon" },
  Cursor: { logo: `${L}/cursor.svg`, kind: "icon" },
  FLUX: { logo: `${L}/flux-white.svg`, kind: "mark" },
  "Stable Diffusion": {},
};
