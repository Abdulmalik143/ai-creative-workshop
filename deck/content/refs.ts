import { RESOURCES } from "./resources";

/** Sources kept with the project, per slide. The notes window lists the labels only (no links, no URLs on screen). */
export const REFS: Record<string, { label: string; url: string }[]> = {
  s01: [{ label: "React Bits · Gradient ASCII", url: "https://reactbits.dev/backgrounds/gradient-ascii" }],
  s05: [{ label: "React Bits · Refine Frame", url: "https://reactbits.dev/micro/refine-frame?status=complete" }],
  s08: [{ label: "React Bits · Folder", url: "https://reactbits.dev/c/components/folder" }],
  s11: [
    { label: "Magnific: Freepik is now Magnific (28 Apr 2026)", url: "https://www.magnific.com/blog/freepik-is-now-magnific/" },
    { label: "Magnific MCP in ChatGPT (2 Sep 2026)", url: "https://www.magnific.com/blog/magnific-mcp-chatgpt/" },
  ],
  s15: [
    { label: "Adobe: أسماء البرامج (10 Nov 2026)", url: "https://news.adobe.com/news/2026/11/adobe-powers-new-era-of-creativity" },
    { label: "Adobe: تفاصيل التوفّر (10 Nov 2026)", url: "https://news.adobe.com/news/2026/11/adobe-transforms-creative-cloud-tools" },
    { label: "الصورة: AP Content Services for Adobe", url: "https://www.daytondailynews.com/nation-world/adobe-max-miami-2026/image_bee16a41-fa94-5fa1-af2c-33127d05e2c6.html" },
    { label: "Adobe Blog (10 Nov 2026)", url: "https://blog.adobe.com/en/publish/2026/11/10/explore-new-ways-create-across-creative-cloud-adobe-firefly-while-advancing-craft-precision-choice-control" },
  ],
  s16: [
    { label: "Pinterest", url: "https://www.pinterest.com/" },
    { label: "Dribbble", url: "https://dribbble.com/" },
    { label: "Behance", url: "https://www.behance.net/" },
    { label: "Mobbin", url: "https://mobbin.com/" },
    { label: "React Bits", url: "https://reactbits.dev" },
    { label: "Magic UI", url: "https://magicui.design" },
    { label: "daisyUI", url: "https://daisyui.com" },
    { label: "shadcn/ui", url: "https://ui.shadcn.com" },
    { label: "Aceternity UI", url: "https://ui.aceternity.com" },
  ],
  s17: [
    { label: "أثر الفراشة: عزام — الموقع الرسمي", url: "https://azzamfilm.com/ar/" },
    { label: "ثمانية — تغطية النقاش حول الفيلم", url: "https://blog.thmanyah.com/post/1nacpxbm4h_1jhggnmybp" },
    { label: "Higgsfield — الفيديو المرجعي", url: "https://www.youtube.com/watch?v=bY8RDKoBwU0&t=396s" },
    { label: "Higgsfield — الأمثلة الرسمية", url: "https://higgsfield.ai/" },
  ],
  // slides 19–33: the track resources (deck/content/resources.ts), also listed on /deck/refs
  ...Object.fromEntries(
    [...new Set(RESOURCES.map((r) => r.slide))].map((no) => [
      `s${no}`,
      RESOURCES.filter((r) => r.slide === no).map((r) => ({ label: r.name, url: r.url })),
    ]),
  ),
};
