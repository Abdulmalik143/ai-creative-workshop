/**
 * Everything the audience reads, slide by slide. Approved wording: change it here, not inside components.
 * Speaker notes live in ./notes.ts and never render on a slide.
 */

export const WORKSHOP = {
  title: "الذكاء الاصطناعي في المجالات الإبداعية",
  titleLines: ["الذكاء الاصطناعي", "في المجالات الإبداعية"],
  subtitle: { mind: "عقل يبدع", sep: "، ", agent: "ووكيل ينفّذ" },
  presenter: "تقديم: عبدالملك الهندي",
} as const;

export const S02 = {
  /** the opening question to the room, exactly as the owner wrote it (2026-11-24) */
  question: "«لو بنهديك اشتراك ذكاء اصطناعي واحد،إيش راح تختار؟»",
} as const;

export const S03 = {
  /** LTR. The word order does not move the columns: Chatbot stays on the right, AI Agent on the left. */
  title: "AI Agents vs Chatbots",
  chatbot: {
    name: "Chatbot",
    like: "مثل الفريلانسر",
    line: "«تعطيه طلبًا، ويرجع لك المخرجات.»",
    /** shown from the moment the slide opens, under the column title */
    examples: ["ChatGPT", "Claude", "Gemini"],
  },
  agent: {
    name: "AI Agent",
    like: "مثل الموظف",
    line: "«تعطيه مهمة، ويشتغل على ملفات مشروعك مباشرة.»",
    examples: ["Codex", "Claude Code", "Cursor"],
  },
  closing: { a: "استلام المخرجات", vs: "vs", b: "العمل داخل المشروع" },
  /** words inside the two little illustrations */
  art: { request: "طلب", output: "المخرجات", project: "مشروعك", task: "مهمة" },
} as const;

export const S04 = {
  question: "طيب يا عبدالملك، حتى الشات صار يقدر يرتبط بالأدوات وينفّذ مهام، أجل وش الفرق؟",
  points: [
    "وصول مباشر لملفات المشروع.",
    "مهما كبر المشروع، يقدر يستكشف ملفاته ومصادره المتاحة.",
    "يعدّل ملفات متعددة ومترابطة.",
    "بدون الحاجة لإعادة إرسال الملفات كل مرة.",
  ],
} as const;

export const S05 = {
  title: "Image Generation vs Code-based Design",
  image: {
    name: "Image Generation",
    /** small line under the column title, and the tools: shown from the moment the slide opens */
    label: "مخرجات مولّدات الصور",
    tools: ["Nano Banana", "ChatGPT Images", "FLUX", "Stable Diffusion"],
    sub: "Raster / Pixels",
    caption: "صورة مولّدة بالذكاء الاصطناعي",
  },
  code: {
    name: "Code-based Design",
    label: "مخرجات أدوات التصميم بالكود",
    /** Claude Code in full, so it never reads as the chat app (Claude) on slide 03 */
    tools: ["Claude Code", "Codex", "Cursor"],
    sub: "HTML · CSS · JavaScript",
    caption: "عناصر مستقلة قابلة للتعديل والتحريك",
  },
  message: "«من صورة مولّدة إلى تصميم نقدر نعدّل عناصره بالكود.»",
  refine: { queued: "في الانتظار", generating: "يولّد الصورة", refining: "يصقل التفاصيل", complete: "اكتمل", error: "تعذّر" },
} as const;

export const S06 = {
  question: "«لو طلبنا من الاثنين يسوّون إنفوجرافيك متحرك، وش بيصير؟»",
  /** the right card's heading: «Image» is struck and rolls out, «Video» rolls in; «Generation» never moves */
  heading: { from: "Image", to: "Video", rest: "Generation" },
  image: { flow: ["صور أو مشاهد متتابعة", "حركة", "مجموعة من الصور المولّدة تكوّن فيديو"] },
  code: { flow: ["عناصر بالكود", "CSS / JavaScript Animation", "فيديو مسجّل"] },
  edit: "«طيب، لو بغينا نعدّل شيء في منتصف الفيديو؟»",
  /** 60 ثانية × 30fps = 1800 إطار, kept in parts so the numbers never reorder in RTL */
  frames: { duration: "60 ثانية", fps: "30fps", total: "1800 إطار" },
  regen: "إعادة توليد المقطع",
} as const;

export const S07 = {
  headline: "«عندك موظف جديد!»",
  question: "«تخيّل إنك وظّفت AI Agent اليوم… كيف بتعلّمه طريقة شغلك؟»",
  /** his speech bubble after the greeting (the owner's wording, 2026-11-24) */
  greeting: "أهلًا، أنا مالك. توّي متخرّج، فتحمّلوني على كثرة أسئلتي. علّموني طريقتكم، والباقي عليّ.",
} as const;

export const S08 = {
  title: "Skills — علّم وكيلك كيف يشتغل",
  ask: "أنتم كيف تشتغلون؟",
  items: ["التعليمات", "المراجع", "ملفات الهوية", "الشعارات", "الأدوات", "الملفات والمجلدات الفرعية"],
  folder: "Skill",
  phrase: "«تعليمات ومراجع يرجع لها الوكيل وقت الشغل.»",
} as const;

export const S09 = {
  title: "«وش داخل الـSkill؟»",
  root: "brand-creative-skill/",
  entries: [
    { name: "SKILL.md", kind: "file", desc: "ملف التعليمات الأساسي" },
    { name: "assets/", kind: "dir", desc: "الشعارات، الباترن، العلامات المائية، الخطوط" },
    { name: "references/", kind: "dir", desc: "دليل الهوية، قواعد التصميم، المراجع والأمثلة" },
    { name: "scripts/", kind: "dir", desc: "سكربتات وأكواد مساعدة" },
  ],
  instructions: "تعليمات",
  resources: "موارد يستعين بها الوكيل",
} as const;

export const S10 = {
  title: "«كل اللي يحتاجه في مكان واحد!»",
  start: "نقطة البداية",
  /** the company's own skill, the entry point (kept generic on purpose) */
  company: "Company Skill",
  /** the brand mark drawn on the example reel */
  companyMark: "Company",
  skillMd: "SKILL.md",
  skillMdNote: "تعليمات الوكيل",
  /** the identity cards inside the company skill */
  brand: ["الهوية البصرية", "الألوان", "الشعارات", "الخطوط وقواعد استخدامها"],
  /** specialised skills, kept elsewhere; SKILL.md tells the agent when to go to each */
  routes: [
    { id: "video", when: "لو الطلب فيديو", skill: "Video Skill", path: "…/video-skill/", rule: "فيديو ← Video Skill" },
    { id: "image", when: "لو الطلب صورة", skill: "Image Skill", path: "…/image-skill/", rule: "صورة ← Image Skill" },
  ],
  elsewhere: "في مكان ثاني",
  request: "«سوِّ لي ريل بهوية الشركة»",
  result: "ريل بهوية الشركة",
  fromCompany: "الشكل والهوية",
  fromVideo: "طريقة الإنتاج",
} as const;

export const S11 = {
  title: "MCP — Model Context Protocol",
  ask: "أقدر أستخدم برامج التصميم زيكم؟",
  acronym: "MCP",
  full: "Model Context Protocol",
  meaning: "بروتوكول سياق النموذج",
  line: "«حلقة الوصل بين الوكيل والأدوات.»",
  // the ten tools and their logos: deck/media/mcpTools.ts
} as const;

export const S12 = {
  title: "Figma + MCP + Skills",
  agent: "AI Agent",
  skill: "Skill",
  mcp: "Figma MCP",
  window: "Figma",
  sim: "محاكاة توضيحية",
  ui: { button: "ابدأ", input: "اكتب هنا" },
} as const;

export const S13 = {
  question: "«طيب، هل مجرد ربط الوكيل بـFigma يكفي عشان يبني Design System ممتاز؟»",
} as const;

export const S14 = {
  title: "«الوكيل ينفّذ… وأنت تحدد كيف.»",
  brief: "تعليمات المصمم",
  tokens: "Design Tokens",
  layers: ["Primitives", "Semantic Tokens", "Component Tokens"],
  components: ["Button", "Input", "Card"],
  next: ["Patterns", "Templates", "Pages"],
  review: "كبّر الحواف شوي",
  ui: { button: "ابدأ", input: "اكتب هنا" },
  closing: "«الذكاء الاصطناعي يسرّع التنفيذ، وخبرتك تصنع الفرق.»",
} as const;

export const S15 = {
  title: "Adobe × MCP",
  /** the photo's label, on the photo */
  photoLabel: "لقطة من Adobe MAX 2026",
  context: "أُعلن عنه في Adobe MAX، 10 نوفمبر 2026 · بيتا خاصة مطلع 2027",
  /**
   * Exactly the apps Adobe's announcement names for the local MCP integrations
   * (news.adobe.com/news/2026/11/adobe-powers-new-era-of-creativity). InDesign, Firefly and Frame.io
   * appear in the same news only for Adobe Creative Agent / AI Assistant, so they are not listed.
   */
  apps: ["photoshop", "illustrator", "premiere", "aftereffects"] as const,
} as const;

export const S16 = {
  title: "«في عصر الذكاء الاصطناعي، من وين نستلهم أفكارنا؟»",
  /** stage 1: the one idea; the rest is said aloud */
  idea: "نستلهم من المبدعين الرائدين في المجال",
  /** stage 2 */
  where: "وين نلقى أعمالهم؟",
  /** stage 3: a question for the room; the answer («لا طبعًا») is said aloud, never shown */
  ask: "«هل كذا اكتفينا بالتغذية البصرية؟»",
  /** stages 5–7 */
  librariesTitle: "مكتبات مكوّنات نبني بها مع الذكاء الاصطناعي",
  /**
   * Five libraries (presenter's brief, 2026-11-23), in reveal order: React Bits in the middle and largest →
   * Magic UI on its right, daisyUI on its left → shadcn/ui (right) and Aceternity UI (left), a level lower.
   * Only the name shows, above the official logo; the sites are in the notes window (content/refs.ts).
   */
  libraries: [
    { id: "reactbits", name: "React Bits" },
    { id: "magicui", name: "Magic UI" },
    { id: "daisyui", name: "daisyUI" },
    { id: "shadcn", name: "shadcn/ui" },
    { id: "aceternity", name: "Aceternity UI" },
  ] as const,
  sources: [
    { id: "pinterest", line: "أفكار ومراجع بصرية" },
    { id: "dribbble", line: "تصاميم وتجارب إبداعية" },
    { id: "behance", line: "مشاريع ودراسات حالة" },
    { id: "mobbin", line: "مراجع واجهات UI/UX" },
  ] as const,
} as const;

export const S17 = {
  title: "AI Slop",
  question: "«هل المشكلة في الذكاء الاصطناعي، أو في طريقة استخدامه؟»",
  closing: "«إذا كانت الأدوات متاحة للجميع، وش اللي يصنع الفرق؟»",
} as const;

export const S18 = {
  title: "«الذكاء الاصطناعي في مختلف المجالات»",
  sub: "«وين نقدر نوظّف الذكاء الاصطناعي؟»",
  domains: [
    "البرمجة",
    "تصميم UI/UX",
    "المونتاج",
    "الإنفوجرافيك والأنيميشن",
    "إدخال البيانات (Data Entry)",
    "3D",
    "الهوية البصرية",
    "صناعة المحتوى",
    "التعليق الصوتي",
    "التصميم الداخلي",
    "التصميم المعماري",
    "تطوير الألعاب",
    "البحث والتغذية البصرية",
    "تصميم الجرافيك",
  ],
  /**
   * indexes into `domains`: the five practical tracks (slides 19–28), highlighted by themselves once the grid has
   * appeared. They sit side by side in the grid's first row (columns 2–6 of 7), so they read as one centred row,
   * right to left, in track order. «البرمجة» (index 0) stays a normal card: covered earlier, said aloud.
   */
  focus: [1, 2, 3, 4, 5],
} as const;

// ---------------------------------------------------------------------------------------------------------------
/**
 * The five tracks, named exactly as on slide 18. Each track slide uses its track's name as the main heading; the
 * slide's own line, when it helps, sits under it as the sub-heading.
 */
export const TRACK = {
  uiux: "تصميم UI/UX",
  montage: "المونتاج",
  motion: "الإنفوجرافيك والأنيميشن",
  data: "إدخال البيانات",
  d3: "3D",
} as const;

// Slides 19–28: the five practical tracks. Short Saudi-dialect headings only; links and caveats live in
// content/resources.ts, the long explanations in content/notes.ts.

export const S19 = {
  sub: "خلّ الوكيل يشتغل داخل Figma",
  /** the three cards, right to left, one per click: a resource id (deck/content/resources.ts) and the line under its name */
  cards: [
    { id: "figma-mcp", line: "الربط الرسمي" },
    { id: "figwright", line: "بديل مجتمعي مجاني ومفتوح المصدر" },
    { id: "mobbin-mcp", line: "مرجع بصري" },
  ],
} as const;

export const S20 = {
  sub: "من الفكرة إلى التصميم",
  /** this slide covers the first three stages; Design System and UI Design continue on slide 21 */
  stages: [
    { label: "Visual Research", latin: true },
    { label: "Creative Direction", latin: true },
    { label: "UX Planning", latin: true },
  ],
  board: "لوحة المراجع",
  direction: "التوجه",
  directionChips: ["بسيط", "داكن", "بطاقات واضحة"],
  decision: "قرار المصمم",
  /**
   * UX Planning, worked example: a made-up coffee-ordering app, focused on re-ordering. Research findings and survey
   * replies become four UX outputs on a Figma canvas. Concept titles stay in English (the field's own names); every
   * other word is Arabic. Quotes, numbers and the persona are illustrative, not real data.
   */
  inputs: [
    { title: "نتائج البحث", meta: "٦ مقابلات" },
    { title: "الاستبيان", meta: "٤٨ رد" },
  ],
  file: "ux-planning.fig",
  affinity: {
    title: "Affinity Map",
    from: "من ٤٨ رد",
    clusters: [
      { name: "إعادة الطلب", count: "١٨", notes: ["أطلب نفس القهوة كل يوم", "أبي أعيد طلبي بضغطة", "أعيد التخصيص كل مرة"] },
      { name: "وضوح السعر", count: "١٢", notes: ["السعر النهائي يطلع آخر شي", "الإضافات ما يبان سعرها"] },
      { name: "الاستلام", count: "٩", notes: ["ما أدري متى يجهز", "أبي تنبيه لما يجهز"] },
    ],
    top: "الأكثر تكرارًا",
  },
  persona: {
    title: "Persona",
    name: "سارة، ٢٩",
    role: "موظفة، تطلب قبل الدوام",
    quote: "«أطلب نفس القهوة كل يوم، ليش أعيد كل الخطوات؟»",
    goals: { label: "الأهداف", items: ["طلب سريع قبل الدوام", "تعرف السعر من البداية"] },
    pains: { label: "الإحباطات", items: ["خطوات كثيرة لنفس الطلب", "ما تدري متى يجهز"] },
  },
  journey: {
    title: "User Journey Map",
    lanes: { stage: "المرحلة", feel: "الشعور" },
    stages: ["تفتح التطبيق", "تدوّر طلبها", "تعيد التخصيص", "تدفع", "تنتظر طلبها"],
    /** 0 = frustrated, 1 = happy */
    feel: [0.8, 0.45, 0.1, 0.5, 0.35],
    pain: "تعيد نفس الخطوات كل مرة",
    chance: "فرصة: زر إعادة الطلب",
  },
  flow: {
    title: "User Flow",
    start: "فتح التطبيق",
    ask: ["عنده طلب", "سابق؟"],
    yes: "نعم",
    no: "لا",
    reorder: "إعادة الطلب بضغطة",
    browse: "تصفّح القائمة",
    price: "السعر النهائي",
    end: "الدفع",
  },
  comment: "نبدأ بإعادة الطلب",
  reviewed: "راجعها المصمم",
  message: "«أنت تحدد التجربة، والوكيل يساعدك في التنفيذ.»",
} as const;

export const S21 = {
  sub: "من نظام التصميم إلى واجهات جديدة",
  /** the stages that continue from slide 20 */
  stages: [
    { label: "Design System", latin: true },
    { label: "UI Design", latin: true },
  ],
  options: [
    { q: "عندك نظام تصميم متكامل؟", a: "زوّد الوكيل فيه", items: ["Variables", "Styles", "Components"] },
    { q: "ما عندك نظام؟", a: "ابنه مع الوكيل وحدّد قواعده", items: ["Primitives", "Semantic", "Components"] },
  ],
  rule: "radius = 18",
  parts: ["المكوّنات", "التوكنات", "قواعد الاستخدام"],
  skill: "Skill",
  skillFiles: ["SKILL.md", "references/", "assets/"],
  active: "مفعّلة في المشروع",
  current: "واجهة حالية",
  added: "واجهة جديدة",
  tokens: ["color/primary", "radius/lg", "button/bg"],
  screens: { orders: "طلباتي", profile: "حسابي", cta: "اطلب الآن", save: "حفظ" },
  closing: "«خلي قواعد التصميم واضحة، والوكيل يشتغل عليها.»",
} as const;

export const S22 = {
  sub: "خلّ الوكيل يساعدك في المونتاج",
  /** the opening composition: the thinking agent between DaVinci Resolve (now) and Adobe Premiere (soon). The
   * three dots after «Soon» are drawn and animated by the slab, not typed here. */
  mcps: "MCPs",
  soon: "Soon",
  ask: "رتّب المقاطع، قصّ الجزء الزايد، وحط انتقال بسيط بينها.",
  agentName: "الوكيل",
  status: ["يرتّب المقاطع", "يقص الجزء الزايد", "يضيف انتقال بين المقاطع"],
  done: "تم تعديل المونتاج",
  clips: ["المقطع ١", "المقطع ٢", "المقطع ٣", "المقطع ٤"],
  panels: { bin: "Media Bin", viewer: "Preview", inspector: "Inspector" },
  transition: "Cross Dissolve",
} as const;

export const S23 = {
  sub: "من الفكرة إلى أنيميشن متكامل",
  flow: ["الفكرة + المراجع", "الوكيل", "بناء المشاهد", "الحركة والصوت", "فيديو نهائي"],
  idea: "فكرة الفيديو",
  /** inside the idea card, under its title (owner's wording, 2026-11-24) */
  // «شات بوت» kept on one line with a no-break space (\u00A0); the wording is unchanged
  ideaNote: "نناقش فكرة الفيديو مع شات\u00A0بوت، وفي نهاية المحادثة نطلب منه يكتب برومبت للوكيل.",
  refs: "المراجع",
  /** read by screen readers only: the reference tiles carry icons, no visible labels */
  refKinds: ["نص", "صورة", "رابط"],
  agent: "الوكيل",
  /** over the storyboard group, then one label per frame, right to left */
  storyboard: "Storyboard",
  scenes: ["مشهد 1", "مشهد 2", "مشهد 3"],
  closing: "«من مراجع وفكرة إلى مشاهد متحركة قابلة للتطوير.»",
} as const;

export const S24 = {
  sub: "6 أدوات تساعد الوكيل يصنع الفيديو",
  /** right to left, top row first; one line each, read from the back of the room (no examples on the slide) */
  tools: [
    { id: "remotion", role: "فيديو وموشن جرافيك بكود React" },
    { id: "hyperframes", role: "صفحات ويب تتحوّل إلى فيديو" },
    { id: "ffmpeg", role: "فحص الفيديو وقصّه ودمجه وتصديره" },
    { id: "whisper", role: "تفريغ الكلام والترجمة" },
    { id: "ytdlp", role: "جلب الوسائط المسموح بتنزيلها" },
    { id: "openmontage", role: "ينظّم مراحل إنتاج الفيديو كاملة" },
  ],
} as const;

export const S25 = {
  title: "مكتبات برومبت جاهزة",
  sub: "برومبتات الأنيميشن",
  /**
   * Right to left, one card per library (ids from content/resources.ts, where the description and URL live).
   * Owner's wording, 2026-11-25. `excerpt` = a short prompt from the library, always English (left to right).
   */
  libraries: [
    { id: "prompt-motion", excerpt: "The orange dot connects every scene" },
    { id: "kineprompt", excerpt: "One shape, never cut" },
    { id: "promptreel", excerpt: "Make a dynamic 15-second motion graphics video" },
  ],
} as const;

export const S26 = {
  sub: "كيف سوّيت فيديو تعريفي بالوكيل؟",
  video: "الفيديو التعريفي · v4",
  /** the prompt is a shot list in seconds (artifacts/PROMPT-v4.md of abdulmalik-intro) */
  prompt: "البرومبت: جدول لقطات بالثواني",
  promptFile: "PROMPT-v4.md",
  shots: [
    { from: 0, to: 1, label: "لمحة" },
    { from: 1, to: 5, label: "الهيرو" },
    { from: 5, to: 8.6, label: "الماسك والنزول" },
    { from: 8.6, to: 15.4, label: "الأعمال المختارة" },
    { from: 15.4, to: 21.3, label: "البطاقة" },
  ],
  /** second click: what each tool did (ids from content/resources.ts) */
  tools: [
    { id: "remotion", role: "البناء" },
    { id: "react-bits", role: "التأثيرات" },
    { id: "playwright", role: "التصوير" },
    { id: "ffmpeg", role: "الفحص" },
    { id: "hyperframes", role: "المعاينة" },
  ],
} as const;

/**
 * Slides 27–31: the story behind slide 26's intro video, from the owner's summary of the Claude session (2026-11-25).
 * Wording kept from the summary, shortened for the back of the room. Quotes in «» are the owner's own words in that session.
 */
export const JOURNEY = {
  sub: "رحلة الجلسة: من الفكرة إلى الفيديو",
  stages: [
    { label: "تشغيل المشروع", line: "Claude يشغّل الموقع محليًا ويراجع ملفاته قبل أي سؤال." },
    { label: "تطوير البرومبت", chain: ["أسئلة", "قرارات", "برومبت إنتاجي"] },
    { label: "التنفيذ", chain: ["تصوير الموقع", "البناء في Remotion", "المسودات"] },
    { label: "جولات التعديل", line: "ست جولات تعديل حتى النسخة النهائية." },
    { label: "الرندر النهائي", line: "فيديو 21.3 ثانية بدقة 1920×1080، ويشتغل في HyperFrames." },
    { label: "الملخص والتيزر", line: "ملخص الأدوات، ثم برومبت لتيزر موقع ركايا (30 ثانية)." },
  ],
} as const;

export const DECISIONS = {
  sub: "القرارات قبل التنفيذ",
  items: [
    { k: "النصوص", v: "«بورتفوليو جديد.» ثم «قريبًا…» و«1 يناير 2027»" },
    { k: "المقاس", v: "16:9 أولًا، والنسخة الطولية بعد الاعتماد" },
    { k: "المحرك", v: "Remotion" },
    { k: "التأثيرات", v: "من مكتبة React Bits", chips: ["Aurora", "Tech Text", "Click Spark", "Noise"] },
    { k: "المشاريع", v: "تُعرض من الخارج فقط، والمختبر ما يظهر" },
    { k: "الصوت", v: "موسيقى بدون مؤثرات صوتية" },
  ],
} as const;

export const DIALOGUE = {
  sub: "الحوار: كيف يسأل Claude وكيف تجاوب",
  claude: "كيف يسأل Claude",
  you: "كيف تجاوب",
  /** one row per pair: what Claude does ↔ how you answer */
  rows: [
    { claude: "يراجع الملفات والموقع أولًا، ثم يبني أسئلته على ما وجد", you: "ردود قصيرة على كل نقطة باقتباسها" },
    { claude: "يجمع الأسئلة في جولة وحدة، ومع كل سؤال اقتراحه", you: "تختار من الأزرار بضغطة" },
    { claude: "يعرض خيارات بأزرار، ويحدد الموصى به", you: "ملاحظات مربوطة بالثانية: 00:01 و00:07" },
    { claude: "يطلب الموافقة قبل أي تثبيت أو تنزيل", you: "«مو أسفلها، إلى الأعمال المختارة»" },
    { claude: "يعيد صياغة «وش فهمت» قبل التعديلات الكبيرة", you: "«شوف الوقت المناسب معاك وطبّقه»" },
    { claude: "يعرض صورًا ثابتة ومسودات عند كل مرحلة", you: "«جرّب، وإذا قلت رجّعه رجّعه»" },
  ],
} as const;

export const CONFIRM = {
  sub: "ليش لازم نرجع ونأكد على Claude؟",
  chat: "Claude",
  later: "لاحقًا",
  /** each reason, with the exchange the chat shows for it (from the session; nothing invented beyond the summary) */
  reasons: [
    { title: "يكتفي أحيانًا بالسؤال", chat: [{ who: "claude", text: "رد بأسئلة بدل التنفيذ", ghost: true }, { who: "you", text: "«ما سويت هذي التعديلات»" }] },
    { title: "القرارات تتغيّر مع الوقت", chat: [{ who: "you", text: "«لا تُظهر أنيميشن الهيرو»", old: true }, { who: "divider" }, { who: "you", text: "«أبرز أنيميشن الهيرو»" }] },
    { title: "الغموض يحتاج تثبيت", chat: [{ who: "you", text: "«\u206613–15\u2069 ثانية»" }, { who: "claude", text: "لأي جزء؟" }, { who: "you", text: "«مو أسفلها، إلى الأعمال المختارة»" }] },
    { title: "الافتراض المعقول ممكن ما يطابق رؤيتك", chat: [{ who: "claude", text: "في نسخة صار الهيرو صورة ثابتة بدل الفيلم", ghost: true }] },
    { title: "آخر قرار هو المرجع", chat: [{ who: "you", text: "«\u206610–15\u2069 ثانية»", old: true }, { who: "you", text: "«\u206620–30\u2069 ثانية»", old: true }, { who: "you", text: "«20 ثانية تقريبًا»" }] },
  ],
} as const;

export const CHECKS = {
  sub: "نقاط التأكيد والخلاصة",
  points: [
    { when: "بعد البريف", ask: "القرارات واضحة؟" },
    { when: "قبل التنفيذ", ask: "«قل لي وش فهمت»" },
    { when: "بعد الصور الثابتة", ask: "الإطار صحيح؟" },
    { when: "بعد المسودة", ask: "الإيقاع والحركة مناسبين؟" },
    { when: "قبل الرندر النهائي", ask: "اعتماد صريح" },
    { when: "بعد أي تغيير في الاتجاه", ask: "تأكيد القرار الجديد" },
  ],
  summary: [
    "هدف واضح، ثم مراجعة على مراحل.",
    "تأكيد عند كل منعطف، بدل تصحيح النتيجة بعد ما تطلع.",
    "قل «طبّق» صراحة لما تبغى التنفيذ مو الاقتراح.",
  ],
  result: "من فكرة إلى فيديو نهائي في جلسة وحدة، عبر ست نسخ.",
} as const;

export const S27 = {
  sub: "خلّ الوكيل يعبّي البيانات عنك",
  /** first click: the tool, under the Chrome logo (owner's wording, 2026-11-24). The setup steps are said aloud, never shown */
  tool: { name: "Chrome DevTools MCP", note: "تقدر تضيفه بسرعة في Codex وغيره من قسم Client configurations." },
  flow: [{ label: "Codex", latin: true }, { label: "فتح المتصفح" }, { label: "زيارة الرابط" }, { label: "تعبئة الحقول" }, { label: "مراجعة البيانات" }],
  ask: "افتح النموذج هذا، وعبّ البيانات الموجودة عندك.",
  url: "example.com/form",
  formTitle: "نموذج التسجيل",
  /** made-up data only; `latin` = typed left to right */
  fields: [
    { label: "الاسم", value: "أحمد محمد", latin: false },
    { label: "البريد", value: "ahmed@example.com", latin: true },
    { label: "المدينة", value: "جدة", latin: false },
    { label: "نوع الطلب", value: "ورشة تصميم", latin: false },
  ],
  submit: "إرسال",
  status: ["يفتح المتصفح", "يزور الرابط", "يعبّي الحقول", "جاهز لمراجعتك، وما ضغط إرسال"],
  review: "بانتظار مراجعتك",
  data: "البيانات",
} as const;

export const S28 = {
  sub: "من Product Sheet إلى 3D",
  /** first click: the 3D tool this slide uses, laid out like slide 27's tool block (owner's wording, 2026-11-24) */
  tool: { name: "Blender MCP", note: "راح نشارككم فيديو يوضّح طريقة الربط خطوة بخطوة." },
  flow: [{ label: "فكرة المنتج" }, { label: "Product Sheet", latin: true }, { label: "Claude + Blender MCP", latin: true }, { label: "3D Modeling", latin: true }, { label: "Review", latin: true }],
  sheet: "Product Sheet · Loon Watch V4",
  ask: "ابنِ مجسم الساعة من هذا المرجع",
  analyzing: "يحلل الأشكال والتفاصيل",
  phases: ["الشكل الأساسي", "التفاصيل", "الخامات", "المجسم النهائي"],
  model: "المجسم من ملف المشروع",
  render: "رندر Cycles من المشروع",
} as const;

export const S29 = {
  thanks: "شكرًا لحسن استماعكم",
  /** Malik's bubble on the last slide (the owner's wording, 2026-11-25) */
  bubble: "اللي عنده سؤال لا يستحي يسأل عبدالملك",
} as const;
