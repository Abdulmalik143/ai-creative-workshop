/**
 * Setup and reference tools for the five practical tracks (slides 19–28). One list, used three ways:
 *   - on the slides, through <ResourceReference id="…" /> (deck/kit/ResourceReference.tsx): name, logo, one line
 *   - in the notes window (REFS in ./refs.ts is built from it): labels only
 *   - on the page /deck/refs: names, grouped by track
 * The URLs are kept here as the source record only. This is a presentation: nothing on screen links out or shows
 * an address (the presenter hands the audience a separate references file).
 *
 * Every URL and claim below was checked on 2026-11-23:
 *   - figma.com/mcp-catalog: official (Figma's MCP catalog).
 *   - github.com/awdr74100/figwright: a free, two-way Figma MCP server that pairs with a Figma plugin (MIT). Not by Figma.
 *   - mobbin.com/mcp: Mobbin's own page; "Available on Pro & Team plans".
 *   - Blackmagic release 20260908-03 (8 Sep 2026): Resolve 21.1 "supports integration with AI assistants such as
 *     Claude, Claude Code and ChatGPT Codex". Studio-only per the Studio 21 feature table (checked for slide 11).
 *   - YouTube dA6DuxffnRo = MrAlexTech (independent explainer); Wi44XLKQ3YA = Blackmagic Design's own channel;
 *     t4Z4UOQLKnY = Tutorialy (independent explainer, Claude + Blender MCP).
 *   - Adobe: local MCP integrations announced at Adobe MAX (10 Nov 2026), private beta expected early 2027.
 *   - remotion.dev, github.com/heygen-com/hyperframes ("turning HTML, CSS, JavaScript … into deterministic MP4"),
 *     ffmpeg.org, github.com/openai/whisper, github.com/yt-dlp/yt-dlp, github.com/OpenMontageInc/OpenMontage,
 *     elevenlabs.io, voice.humain.com (Arabic speech-to-text and text-to-speech), github.com/ChromeDevTools/chrome-devtools-mcp
 *     and its docs/client-configurations.md.
 *
 * Logos: official files in public/deck/logos/tracks/ (taken from each project's own repo or site on 2026-11-23:
 * figwright .github/assets/logo-dark.svg, hyperframes docs/logo/symbol-dark.svg, OpenMontage assets/logo.png (slide 24's
 * card shows OpenMontage's README mark instead, assets/monty-dark.svg → openmontage-monty-dark.svg; see S24VideoTools),
 * remotion.dev/img/favicon.png, ffmpeg.org/favicon.ico → PNG, elevenlabs.io/icon.svg, voice.humain.com/favicon.svg,
 * mobbin.com favicon.svg) or the ones already in public/deck/logos/. Whisper, yt-dlp and Chrome DevTools MCP have no
 * mark of their own we may use: they show a neutral icon.
 */

export type ResourceKind = "official" | "community" | "video";

export const KIND_LABEL: Record<ResourceKind, string> = {
  official: "رسمي",
  community: "مجتمعي",
  video: "شرح فيديو",
};

export type TrackId = "uiux" | "montage" | "motion" | "data" | "3d";

export const TRACKS: { id: TrackId; name: string; slides: number[] }[] = [
  { id: "uiux", name: "تصميم UI/UX", slides: [19, 20, 21] },
  { id: "montage", name: "المونتاج", slides: [22] },
  { id: "motion", name: "الإنفوجرافيك والأنيميشن", slides: [23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { id: "data", name: "إدخال البيانات", slides: [32] },
  { id: "3d", name: "3D", slides: [33] },
];

export type Resource = {
  id: string;
  /** shown on the card, left to right */
  name: string;
  /** one short line under the name (Arabic) */
  what?: string;
  url: string;
  kind: ResourceKind;
  /** a video link, whoever made it (shows a play mark) */
  video?: boolean;
  /** a short caveat: requirements, limits, safety */
  note?: string;
  /** official mark (public path); "icon" = an app icon with its own tile */
  logo?: string;
  logoKind?: "mark" | "icon";
  /** the logo tile's background when a mark needs a light one (default: the deck's dark tile) */
  tile?: string;
  /** a neutral glyph name when there is no logo we may use */
  glyph?: "mic" | "download" | "browser" | "play" | "news";
  track: TrackId;
  slide: number;
};

const T = "/deck/logos/tracks";
const M = "/deck/logos/mcp";

export const RESOURCES: Resource[] = [
  // ---- UI/UX (19) ----
  {
    id: "figma-mcp",
    name: "Figma MCP",
    what: "ربط Figma الرسمي بالوكلاء",
    url: "https://www.figma.com/mcp-catalog/",
    kind: "official",
    logo: `${M}/figma.svg`,
    track: "uiux",
    slide: 19,
  },
  {
    id: "figwright",
    name: "Figwright",
    what: "بديل مفتوح المصدر ومجاني",
    url: "https://github.com/awdr74100/figwright",
    kind: "community",
    note: "أداة غير رسمية — راجع الأمان والصلاحيات قبل الاستخدام.",
    logo: `${T}/figwright.svg`,
    track: "uiux",
    slide: 19,
  },
  {
    id: "mobbin-mcp",
    name: "Mobbin MCP",
    what: "مراجع واجهات من منتجات حقيقية",
    url: "https://mobbin.com/mcp",
    kind: "official",
    note: "متاح لمشتركي Pro أو Team",
    logo: `${T}/mobbin.svg`,
    tile: "#FFFFFF", // owner, 2026-11-24: the black official mark on a white tile (slide 19)
    track: "uiux",
    slide: 19,
  },

  // ---- montage (22) ----
  {
    id: "resolve-mcp-video",
    name: "DaVinci Resolve MCP",
    what: "شرح الربط خطوة بخطوة · MrAlexTech",
    url: "https://www.youtube.com/watch?v=dA6DuxffnRo",
    kind: "video",
    video: true,
    logo: `${M}/davinci-resolve.png`,
    logoKind: "icon",
    track: "montage",
    slide: 22,
  },
  {
    id: "resolve-release",
    name: "DaVinci Resolve 21.1",
    what: "إعلان Blackmagic: تكامل المساعدين",
    url: "https://www.blackmagicdesign.com/media/partial/release/20260908-03",
    kind: "official",
    note: "التكامل الرسمي ضمن Studio 21.1 وما بعدها",
    logo: `${M}/davinci-resolve.png`,
    logoKind: "icon",
    track: "montage",
    slide: 22,
  },
  {
    id: "resolve-video",
    name: "What's New in 21.1",
    what: "فيديو Blackmagic الرسمي",
    url: "https://www.youtube.com/watch?v=Wi44XLKQ3YA",
    kind: "official",
    video: true,
    logo: `${M}/davinci-resolve.png`,
    logoKind: "icon",
    track: "montage",
    slide: 22,
  },
  {
    id: "adobe-mcp",
    name: "Adobe MCP",
    what: "تكاملات محلية لبرامج Creative Cloud",
    url: "https://news.adobe.com/news/2026/11/adobe-transforms-creative-cloud-tools",
    kind: "official",
    note: "معاينة تجريبية خاصة متوقعة في 2027",
    glyph: "news",
    track: "montage",
    slide: 22,
  },

  // ---- infographic & animation (24–26) ----
  {
    id: "remotion",
    name: "Remotion",
    what: "بناء الفيديو والموشن جرافيك بـReact",
    url: "https://www.remotion.dev/",
    kind: "official",
    logo: `${T}/remotion.png`,
    logoKind: "icon",
    track: "motion",
    slide: 24,
  },
  {
    id: "hyperframes",
    name: "HyperFrames",
    what: "مشاهد ويب تتحوّل لفيديو: HTML، CSS، JavaScript",
    url: "https://github.com/heygen-com/hyperframes",
    kind: "official",
    logo: `${T}/hyperframes.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 24,
  },
  {
    id: "ffmpeg",
    name: "FFmpeg / FFprobe",
    what: "فحص وقص ودمج وتصدير",
    url: "https://ffmpeg.org/",
    kind: "official",
    logo: `${T}/ffmpeg.png`,
    track: "motion",
    slide: 24,
  },
  {
    id: "whisper",
    name: "Whisper",
    what: "تفريغ الكلام والنصوص المتزامنة",
    url: "https://github.com/openai/whisper",
    kind: "official",
    glyph: "mic",
    track: "motion",
    slide: 24,
  },
  {
    id: "ytdlp",
    name: "yt-dlp",
    what: "جلب وسائط مصرّح باستخدامها",
    url: "https://github.com/yt-dlp/yt-dlp",
    kind: "official",
    note: "فقط لمحتوى مسموح بتنزيله",
    glyph: "download",
    track: "motion",
    slide: 24,
  },
  {
    id: "openmontage",
    name: "OpenMontage",
    what: "ينظّم مراحل إنتاج الفيديو بالوكيل",
    url: "https://github.com/OpenMontageInc/OpenMontage",
    kind: "official",
    logo: `${T}/openmontage.png`,
    logoKind: "icon",
    track: "motion",
    slide: 24,
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    what: "التعليق الصوتي",
    url: "https://elevenlabs.io/",
    kind: "official",
    logo: `${T}/elevenlabs.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 26,
  },
  // slide 25: ready-made animation prompt libraries (owner's list and wording, 2026-11-25). The name opens the library
  // in a new tab through a hidden link (the owner asked for links on this slide); nothing on screen shows an address.
  // Logos: each site's own square icon, saved unchanged on 2026-11-25 (prompt-motion.com/icon.svg, the site icon its
  // text-only header sits beside; kineprompt.com/favicon.svg, the header's logo mark on its tile;
  // promptreels.vercel.app/brand/mark.svg, the header logo).
  {
    id: "prompt-motion",
    name: "Prompt Motion",
    what: "مكتبة فيديوهات موشن مصنوعة بـClaude مع البرومبتات التي أنتجتها",
    url: "https://prompt-motion.com/",
    kind: "official",
    logo: `${T}/prompt-motion.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 25,
  },
  {
    id: "kineprompt",
    name: "Kineprompt",
    what: "مكتبة تعرض معاينات للحركة وبرومبتات قابلة للنسخ والتخصيص",
    url: "https://kineprompt.com/library/",
    kind: "official",
    logo: `${T}/kineprompt.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 25,
  },
  {
    id: "promptreel",
    name: "PromptReel",
    what: "معرض فيديوهات موشن بالذكاء الاصطناعي مع البرومبت أو المهارة المستخدمة",
    url: "https://promptreels.vercel.app/",
    kind: "official",
    logo: `${T}/promptreel.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 25,
  },
  {
    id: "humain-voice",
    name: "HUMAIN Voice",
    what: "صوت عربي: نص لكلام وكلام لنص",
    url: "https://voice.humain.com/",
    kind: "official",
    logo: `${T}/humain.svg`,
    logoKind: "icon",
    track: "motion",
    slide: 26,
  },

  // slide 26: the tools behind the presenter's intro video (abdulmalik-intro, v4), owner's summary 2026-11-25.
  // Remotion, HyperFrames and FFmpeg are already listed for slide 24; these two are the ones only slide 26 names.
  {
    id: "react-bits",
    name: "React Bits",
    what: "تأثيرات جاهزة: Aurora وTech Text وClick Spark وNoise",
    url: "https://reactbits.dev",
    kind: "official",
    logo: "/deck/logos/libraries/react-bits.svg",
    track: "motion",
    slide: 26,
  },
  {
    id: "playwright",
    name: "Playwright",
    what: "تصوير صفحات الموقع ولوحاته من المتصفح",
    url: "https://playwright.dev/",
    kind: "official",
    glyph: "browser",
    track: "motion",
    slide: 26,
  },

  // ---- data entry (32; was 27 before 2026-11-25) ----
  {
    id: "chrome-devtools-mcp",
    name: "Chrome DevTools MCP",
    what: "يخلّي الوكيل يتحكم بالمتصفح",
    url: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    kind: "official",
    glyph: "browser",
    track: "data",
    slide: 32,
  },
  {
    id: "chrome-devtools-mcp-clients",
    name: "Client configurations",
    what: "طريقة الإضافة في Codex وغيره",
    url: "https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/client-configurations.md",
    kind: "official",
    glyph: "browser",
    track: "data",
    slide: 32,
  },

  // ---- 3D (33; was 28 before 2026-11-25) ----
  {
    id: "blender-mcp-video",
    name: "Claude + Blender MCP",
    what: "شرح الربط · Tutorialy",
    url: "https://www.youtube.com/watch?v=t4Z4UOQLKnY",
    kind: "video",
    video: true,
    logo: `${M}/blender.png`,
    logoKind: "icon",
    track: "3d",
    slide: 33,
  },
];

export const RESOURCE = Object.fromEntries(RESOURCES.map((r) => [r.id, r])) as Record<string, Resource>;
