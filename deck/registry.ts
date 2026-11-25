import type { SlideDef } from "./types";
import S01, { steps as s01 } from "./slides/S01Cover";
import S02, { steps as s02 } from "./slides/S02Opening";
import S03, { steps as s03 } from "./slides/S03ChatbotVsAgent";
import S04, { steps as s04 } from "./slides/S04Interruption";
import S05, { steps as s05 } from "./slides/S05ImageVsCode";
import S06, { steps as s06 } from "./slides/S06Motion";
import S07, { steps as s07, background as bg07 } from "./slides/S07NewHire";
import S08, { steps as s08 } from "./slides/S08Skills";
import S09, { steps as s09 } from "./slides/S09InsideSkill";
import S10, { steps as s10 } from "./slides/S10ReelsCreator";
import S11, { steps as s11 } from "./slides/S11MCP";
import S12, { steps as s12 } from "./slides/S12FigmaSkills";
import S13, { steps as s13 } from "./slides/S13Question";
import S14, { steps as s14 } from "./slides/S14Expertise";
import S15, { steps as s15 } from "./slides/S15AdobeNews";
import S16, { steps as s16 } from "./slides/S16Inspiration";
import S17, { steps as s17 } from "./slides/S17AISlop";
import S18, { steps as s18 } from "./slides/S18Domains";
import S19, { steps as s19 } from "./slides/S19FigmaConnect";
import S20, { steps as s20 } from "./slides/S20UIUXWorkflow";
import S21, { steps as s21 } from "./slides/S21DesignSystem";
import S22, { steps as s22 } from "./slides/S22Montage";
import S23, { steps as s23 } from "./slides/S23IdeaToAnimation";
import S24, { steps as s24 } from "./slides/S24VideoTools";
import S25, { steps as s25 } from "./slides/S25PromptLibraries";
import S26, { steps as s26 } from "./slides/S26InfographicWorkflow";
import S27, { steps as s27 } from "./slides/S27SessionJourney";
import S28, { steps as s28 } from "./slides/S28Decisions";
import S29, { steps as s29 } from "./slides/S29Dialogue";
import S30, { steps as s30 } from "./slides/S30Confirm";
import S31, { steps as s31 } from "./slides/S31Checkpoints";
import S32, { steps as s32 } from "./slides/S27DataEntry";
import S33, { steps as s33 } from "./slides/S28Watch3D";
import S34, { steps as s34 } from "./slides/S29Closing";

/**
 * The workshop, in order. Approved order and numbering: do not reorder. Slide 25 (prompt libraries) was inserted by the owner on 2026-11-25; the old 25–27 are now 26–28.
 * Each slide owns its component and its click-stages (`steps`); copy lives in content/copy.ts,
 * speaker notes in content/notes.ts, media slots in media/media.ts.
 * Slides 19–33 are the five practical tracks (UI/UX, montage, infographic & animation, data entry, 3D). Slides 27–31 (the session
 * behind slide 26's intro video) were inserted by the owner on 2026-11-25; the old 27–29 are now 32–34 (files keep their old names).
 */
export const SLIDES: SlideDef[] = [
  { id: "s01", no: 1, title: "الغلاف", steps: s01, bg: "cover", status: "ready", Component: S01 },
  { id: "s02", no: 2, title: "الافتتاحية", steps: s02, bg: "plain", status: "ready", Component: S02 },
  { id: "s03", no: 3, title: "AI Agents vs Chatbots", steps: s03, bg: "plain", status: "ready", Component: S03 },
  { id: "s04", no: 4, title: "مقاطعة الشخصية المجهولة", steps: s04, bg: "plain", status: "ready", Component: S04 },
  { id: "s05", no: 5, title: "Image Generation vs Code-based Design", steps: s05, bg: "plain", status: "placeholders", Component: S05 },
  { id: "s06", no: 6, title: "تحويل التصميم إلى فيديو متحرك", steps: s06, bg: "plain", status: "placeholders", Component: S06 },
  { id: "s07", no: 7, title: "عندك موظف جديد!", steps: s07, bg: bg07, status: "ready", Component: S07 },
  { id: "s08", no: 8, title: "Skills: علّم وكيلك طريقة شغلك", steps: s08, bg: "plain", status: "ready", Component: S08 },
  { id: "s09", no: 9, title: "وش داخل الـSkill؟", steps: s09, bg: "plain", status: "ready", Component: S09 },
  { id: "s10", no: 10, title: "سكيل الشركة وسكيلز متخصصة", steps: s10, bg: "plain", status: "ready", Component: S10 },
  { id: "s11", no: 11, title: "MCP — Model Context Protocol", steps: s11, bg: "plain", status: "ready", Component: S11 },
  { id: "s12", no: 12, title: "Figma + MCP + Skills", steps: s12, bg: "plain", status: "ready", Component: S12 },
  { id: "s13", no: 13, title: "السؤال التفاعلي", steps: s13, bg: "plain", status: "ready", Component: S13 },
  { id: "s14", no: 14, title: "خبرتك تصنع الفرق", steps: s14, bg: "plain", status: "ready", Component: S14 },
  { id: "s15", no: 15, title: "Adobe × MCP", steps: s15, bg: "plain", status: "ready", Component: S15 },
  { id: "s16", no: 16, title: "التغذية البصرية والمراجع", steps: s16, bg: "plain", status: "ready", Component: S16 },
  { id: "s17", no: 17, title: "AI Slop", steps: s17, bg: "plain", status: "placeholders", Component: S17 },
  { id: "s18", no: 18, title: "الذكاء الاصطناعي في مختلف المجالات", steps: s18, bg: "plain", status: "ready", Component: S18 },
  { id: "s19", no: 19, title: "ربط Figma بالوكيل", steps: s19, bg: "plain", status: "ready", Component: S19 },
  { id: "s20", no: 20, title: "UI/UX: البحث والتوجّه وتخطيط التجربة", steps: s20, bg: "plain", status: "ready", Component: S20 },
  { id: "s21", no: 21, title: "UI/UX: من نظام التصميم إلى واجهات جديدة", steps: s21, bg: "plain", status: "ready", Component: S21 },
  { id: "s22", no: 22, title: "المونتاج باستخدام AI Agent", steps: s22, bg: "plain", status: "ready", Component: S22 },
  { id: "s23", no: 23, title: "من الفكرة إلى فيديو متحرك", steps: s23, bg: "plain", status: "ready", Component: S23 },
  { id: "s24", no: 24, title: "أدوات الإنفوجرافيك والأنيميشن الست", steps: s24, bg: "plain", status: "ready", Component: S24 },
  { id: "s25", no: 25, title: "مكتبات برومبت جاهزة", steps: s25, bg: "plain", status: "ready", Component: S25 },
  { id: "s26", no: 26, title: "كيف سوّيت فيديو تعريفي بالوكيل", steps: s26, bg: "plain", status: "ready", Component: S26 },
  { id: "s27", no: 27, title: "رحلة الجلسة: من الفكرة إلى الفيديو", steps: s27, bg: "plain", status: "ready", Component: S27 },
  { id: "s28", no: 28, title: "القرارات قبل التنفيذ", steps: s28, bg: "plain", status: "ready", Component: S28 },
  { id: "s29", no: 29, title: "الحوار: كيف يسأل Claude وكيف تجاوب", steps: s29, bg: "plain", status: "ready", Component: S29 },
  { id: "s30", no: 30, title: "ليش لازم نرجع ونأكد على Claude", steps: s30, bg: "plain", status: "ready", Component: S30 },
  { id: "s31", no: 31, title: "نقاط التأكيد والخلاصة", steps: s31, bg: "plain", status: "ready", Component: S31 },
  { id: "s32", no: 32, title: "إدخال البيانات باستخدام Codex", steps: s32, bg: "plain", status: "ready", Component: S32 },
  { id: "s33", no: 33, title: "3D — مشروع الساعة", steps: s33, bg: "plain", status: "ready", Component: S33 },
  { id: "s34", no: 34, title: "الختام والأسئلة", steps: s34, bg: "plain", status: "ready", Component: S34 },
];
