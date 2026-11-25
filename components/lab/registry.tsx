"use client";

import type { ComponentType } from "react";
import { WamdaDemo } from "./parts/WamdaDemo";
import { SpeechBubbleDemo } from "./parts/SpeechBubbleDemo";
import { AsciiBackgroundDemo } from "./parts/AsciiBackground";
import { ChatbotVsAgent } from "./parts/ChatbotVsAgent";
import { RefineFrameDemo } from "./parts/RefineFrameDemo";
import { PixelZoom } from "./parts/PixelZoom";
import { CodeDesign } from "./parts/CodeDesign";
import { InfographicCompare } from "./parts/InfographicCompare";
import { VideoRegeneration } from "./parts/VideoRegeneration";
import { LiveCode } from "./parts/LiveCode";
import { SkillFolder } from "./parts/SkillFolder";
import { SkillExplorer } from "./parts/SkillExplorer";
import { SkillMerger } from "./parts/SkillMerger";
import { MCPConnection } from "./parts/MCPConnection";
import { FigmaAgent } from "./parts/FigmaAgent";
import { ClickSteps } from "./parts/ClickSteps";
import { InteractiveQuestion } from "./parts/InteractiveQuestion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const labComponents: Record<string, ComponentType<any>> = {
  wamda: WamdaDemo,
  "speech-bubble": SpeechBubbleDemo,
  "ascii-background": AsciiBackgroundDemo,
  "chatbot-vs-agent": ChatbotVsAgent,
  "refine-frame": RefineFrameDemo,
  "pixel-zoom": PixelZoom,
  "code-design": CodeDesign,
  "infographic-compare": InfographicCompare,
  "video-regeneration": VideoRegeneration,
  "live-code": LiveCode,
  "skill-folder": SkillFolder,
  "skill-explorer": SkillExplorer,
  "skill-merger": SkillMerger,
  "mcp-connection": MCPConnection,
  "figma-agent": FigmaAgent,
  "click-steps": ClickSteps,
  "interactive-question": InteractiveQuestion,
};
