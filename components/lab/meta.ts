export type Control =
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; default: string }
  | { key: string; label: string; type: "toggle"; default: boolean }
  | { key: string; label: string; type: "text"; default: string };

export type LabMeta = {
  slug: string;
  no: number;
  title: string;
  /** what the component does, in one sentence */
  does: string;
  /** upstream library reference, when one was named */
  ref?: string;
  /** stages, if the component is staged */
  steps?: number;
  stepNames?: string[];
  /** a click on the stage moves to the next stage */
  clickAdvances?: boolean;
  controls?: Control[];
};

const opts = (...v: [string, string][]) => v.map(([value, label]) => ({ value, label }));

export const labMeta: LabMeta[] = [
  {
    slug: "ascii-background",
    no: 1,
    title: "خلفية Gradient ASCII",
    does: "خلفية متحركة من React Bits تُستخدم كخلفية رئيسية للعرض.",
    ref: "https://reactbits.dev/backgrounds/gradient-ascii",
    controls: [
      { key: "shape", label: "الشكل", type: "select", default: "horizon", options: opts(["horizon", "أفق"], ["pinch", "قرص"], ["rise", "صعود"], ["eclipse", "كسوف"]) },
      { key: "palette", label: "الألوان", type: "select", default: "sage", options: opts(["sage", "ركايا (رمادي مخضر)"], ["wamda", "ومضة (برتقالي)"]) },
      { key: "interactive", label: "يتفاعل مع المؤشر", type: "toggle", default: true },
    ],
  },
  {
    slug: "wamda",
    no: 2,
    title: "شخصية ومضة (بكسل آرت)",
    does: "الشخصية المرجعية بالبكسل آرت: ظل أسود ثم تحوّل إلى مظهرها البرتقالي، بحالات متعددة.",
    controls: [
      { key: "clip", label: "الحالة", type: "select", default: "idle", options: opts(["idle", "وقوف"], ["run", "ركض"], ["wave", "تلويح"], ["shrug", "رفع الكتفين"], ["think", "تفكير"], ["lookR", "التفات يمينًا"], ["lookL", "التفات يسارًا"], ["hop", "قفزة"]) },
      { key: "mode", label: "المظهر", type: "select", default: "reveal", options: opts(["silhouette", "ظل أسود"], ["reveal", "ظل ثم تحوّل"], ["color", "ألوان كاملة"]) },
      { key: "flip", label: "عكس الاتجاه", type: "toggle", default: false },
    ],
  },
  {
    slug: "speech-bubble",
    no: 3,
    title: "فقاعة حوار الشخصية",
    does: "تسمح لومضة بطرح الأسئلة والمقاطعات أثناء العرض، ويتغير النص بأفيكت.",
    steps: 4,
    stepNames: ["سؤال", "سؤال آخر", "مقاطعة", "تعليق"],
    controls: [
      { key: "effect", label: "أفيكت الرسالة", type: "select", default: "type", options: opts(["type", "كتابة"], ["words", "كلمة كلمة"], ["blur", "ظهور ضبابي"]) },
      { key: "first", label: "نص الرسالة الأولى", type: "text", default: "هل تعرف الفرق بين شات بوت ووكيل؟" },
    ],
  },
  {
    slug: "chatbot-vs-agent",
    no: 4,
    title: "Chatbot مقابل AI Agent",
    does: "المحادثة كفريلانسر يسلّم المخرجات، والوكيل كموظف يعمل داخل ملفات المشروع.",
    steps: 4,
    stepNames: ["الطلب", "التنفيذ", "الناتج", "الخلاصة"],
  },
  {
    slug: "refine-frame",
    no: 5,
    title: "Refine Frame",
    does: "إطار يعرض مراحل توليد الصورة بالذكاء الاصطناعي بالتتابع.",
    ref: "https://reactbits.dev/micro/refine-frame?status=complete",
    steps: 4,
    stepNames: ["في الانتظار", "يولّد", "يصقل", "اكتمل"],
  },
  {
    slug: "pixel-zoom",
    no: 6,
    title: "Pixel Zoom",
    does: "تكبير جزء من صورة مولّدة حتى تظهر البكسلات التي تكوّنها.",
    steps: 3,
    stepNames: ["الصورة", "تكبير", "البكسلات"],
  },
  {
    slug: "code-design",
    no: 7,
    title: "توليد تصميم بالكود",
    does: "تظهر النصوص تدريجيًا ثم العناصر، وتتغير خصائص CSS حتى يكتمل التصميم.",
    steps: 5,
    stepNames: ["نصوص", "عناصر", "ألوان", "أبعاد", "اكتمل"],
  },
  {
    slug: "infographic-compare",
    no: 8,
    title: "نفس الحركة بطريقتين",
    does: "مكعب يدور دورة كاملة: عنصر يتحرك بالكود، مقابل نافذة ثابتة فيها إطار واحد ووراءها بقية الإطارات، كل واحد صورة ثابتة.",
  },
  {
    slug: "video-regeneration",
    no: 9,
    title: "إعادة توليد الفيديو",
    does: "طلب تعديل على مشهد، ثم إعادة توليد 1800 إطار تحلّ محل النسخة السابقة.",
    ref: "https://reactbits.dev/c/components/card-swap",
    steps: 4,
    stepNames: ["المشهد", "طلب التعديل", "إعادة التوليد", "النسخة الجديدة"],
  },
  {
    slug: "live-code",
    no: 10,
    title: "تعديل الكود مباشرة",
    does: "نافذة كود تتغير فيها قيمة أو كلمة، وينعكس التغيير فورًا على التصميم والحركة.",
    steps: 4,
    stepNames: ["الأصل", "المدة", "المنحنى", "النص"],
  },
  {
    slug: "skill-folder",
    no: 11,
    title: "مجلد Skill التفاعلي",
    does: "مجلد يشرح مفهوم Skills: ملفات ومجلدات فرعية وتعليمات ومراجع، ثم يُربط بالوكيل.",
    ref: "https://reactbits.dev/c/components/folder",
    steps: 4,
    stepNames: ["مجلد", "يُفتح", "يجمع", "يُربط بالوكيل"],
  },
  {
    slug: "skill-explorer",
    no: 12,
    title: "مستعرض ملفات Skill",
    does: "البنية الداخلية الحقيقية للـSkill، وفتح المجلدات ومعاينة محتوياتها.",
    steps: 4,
    stepNames: ["SKILL.md", "references", "assets", "scripts"],
  },
  {
    slug: "skill-merger",
    no: 13,
    title: "دمج Skills",
    does: "جمع تعليمات ومراجع من مجالين، Brand وVideo، في Skill واحدة اسمها Reels Creator.",
    steps: 4,
    stepNames: ["مجالان", "يلتقيان", "تُدمج", "الوكيل جاهز"],
  },
  {
    slug: "mcp-connection",
    no: 14,
    title: "اتصال MCP",
    does: "ربط الوكيل بمصدر تعليمات Skill وبأدوات خارجية عبر MCP، تظهر الاتصالات تدريجيًا.",
    steps: 6,
    stepNames: ["الوكيل", "مصدر Skill", "Figma", "Canva", "Blender", "DaVinci Resolve"],
  },
  {
    slug: "figma-agent",
    no: 15,
    title: "الوكيل داخل Figma",
    does: "نافذة تحاكي Figma بمؤشر للوكيل ينشئ Button وCard وInput داخل مساحة العمل.",
    steps: 4,
    stepNames: ["مساحة فارغة", "Button", "Card", "Input"],
  },
  {
    slug: "click-steps",
    no: 16,
    title: "مراحل بالنقر",
    does: "إدارة الأنيميشن على مراحل: كل نقرة تنقل إلى التالية، مع الرجوع وإعادة التشغيل.",
    steps: 5,
    clickAdvances: true,
  },
  {
    slug: "interactive-question",
    no: 17,
    title: "سؤال تفاعلي",
    does: "سؤال واحد على الشاشة أثناء الورشة دون إظهار الإجابة، ليناقشه المقدّم شفهيًا.",
    controls: [
      { key: "question", label: "السؤال", type: "text", default: "متى آخر مرة طلبت من الذكاء الاصطناعي شيئًا فأعطاك ملفًا لا تستطيع استخدامه؟" },
      { key: "pose", label: "وضع ومضة", type: "select", default: "think", options: opts(["think", "تفكير"], ["idle", "وقوف"], ["shrug", "رفع الكتفين"], ["none", "بدون"]) },
    ],
  },
];
