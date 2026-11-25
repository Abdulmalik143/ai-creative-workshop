export const originalThemes = [
  { id: "minimal", name: "بساطة النص", english: "Minimal Typography", description: "حضور هادئ ومساحة واسعة للكلمات.", steps: 2 },
  { id: "sketch", name: "دفتر الأفكار", english: "Creative Sketchbook", description: "ورقة ملاحظات وخطوط تُرسم أمامك.", steps: 2 },
  { id: "editorial", name: "غلاف مجلة", english: "Editorial Layout", description: "تكوين تحريري وهوامش تشبه غلاف مجلة.", steps: 1 },
  { id: "cinema", name: "مشهد سينمائي", english: "Cinematic Presentation", description: "إطار سينمائي وعنوان يظهر ببطء.", steps: 2 },
  { id: "grid", name: "شبكة تجريبية", english: "Experimental Grid", description: "وحدات غير متناظرة تجتمع في شبكة واحدة.", steps: 2 },
  { id: "kinetic", name: "حروف متحركة", english: "Kinetic Typography", description: "سطران يدخلان من جهتين ويتفاعلان مع المؤشر.", steps: 2 },
  { id: "lab", name: "المختبر الرقمي", english: "Digital Creative Lab", description: "شاشة مسح تلتقط حضور الشخصية.", steps: 3 },
  { id: "hybrid", name: "بين الكود والرسم", english: "Technical × Creative", description: "محرر شيفرة يلتقي بخطوط مرسومة باليد.", steps: 2 },
  { id: "story", name: "سرد تفاعلي", english: "Interactive Storytelling", description: "إطار قصصي يُفتح على مراحل بالنقر.", steps: 3 },
  { id: "bold", name: "هوية جريئة", english: "Bold Visual Identity", description: "ملصق بمساحات لونية وعنوان بحجم المشهد.", steps: 2 },
] as const;

export const labThemes = [
  { id: "lab-signal", name: "رصد الإشارة", english: "Signal Trace", description: "موجة حيّة على شاشة قياس، مع شبكة مرجعية دقيقة.", steps: 3, wamda: false },
  { id: "lab-optics", name: "العدسة", english: "Optical Bench", description: "حلقات ضوئية تضبط تركيزها حول عنوان في المنتصف.", steps: 3, wamda: false },
  { id: "lab-network", name: "شبكة العقد", english: "Node Map", description: "عُقد مترابطة تضيء على مسار متدرج.", steps: 3, wamda: false },
  { id: "lab-spectrum", name: "طيف التردد", english: "Spectrum", description: "أعمدة تردد تتبدل إيقاعاتها أسفل العنوان.", steps: 3, wamda: false },
  { id: "lab-terminal", name: "لوحة التحكم", english: "Control Terminal", description: "واجهة فاتحة بجانب وحدات تشخيص تُشغّل بالتتابع.", steps: 3, wamda: false },
  { id: "lab-calibration", name: "المعايرة", english: "Calibration", description: "محاور قياس وعلامات تتحرك حتى تستقر في موضعها.", steps: 3, wamda: false },
  { id: "lab-reactor", name: "المفاعل", english: "Pulse Reactor", description: "أطُر هندسية متداخلة تدور حول نواة ضوئية.", steps: 3, wamda: false },
  { id: "lab-scan", name: "ماسح ومضة", english: "Wamda Scan", description: "شعاع مسح رأسي يمرّ على ظل ومضة.", steps: 3, wamda: true },
  { id: "lab-capsule", name: "كبسولة ومضة", english: "Wamda Capsule", description: "حجرة احتواء شفافة تظهر فيها ومضة كظل أسود.", steps: 3, wamda: true },
  { id: "lab-tracking", name: "تعقّب ومضة", english: "Wamda Tracking", description: "ومضة تتحرك على مسار داخل شاشة تتبّع.", steps: 3, wamda: true },
] as const;

export const studioThemes = [
  { id: "studio-horizon", name: "أفق الفكرة", english: "Idea Horizon", description: "قوس من الضوء يتكوّن تحت عنوان هادئ.", steps: 3 },
  { id: "studio-handoff", name: "لحظة التسليم", english: "Creative Handoff", description: "نبضة تعبر من مساحة الفكرة إلى مساحة التنفيذ.", steps: 3 },
  { id: "studio-orbit", name: "مدار التنفيذ", english: "Execution Orbit", description: "ثلاث حلقات تمرّر الإشارة لبناء شكل مركزي.", steps: 3 },
  { id: "studio-draft", name: "من السكيتش إلى الشكل", english: "Sketch to Form", description: "خط مرتجل يستقر على شبكة تصميم.", steps: 3 },
  { id: "studio-decision", name: "القرار الإبداعي", english: "Creative Decision", description: "مسارات متفرعة يضيء واحد منها عند الاختيار.", steps: 3 },
  { id: "studio-prism", name: "منشور الإبداع", english: "Creative Prism", description: "شعاع واحد يتفرع إلى صوت وصورة وحركة.", steps: 3 },
  { id: "studio-print", name: "مطبعة رقمية", english: "Digital Press", description: "خط طباعة يكشف العمل على طبقات.", steps: 3 },
  { id: "studio-assembly", name: "خط التجميع", english: "Assembly Line", description: "ثلاث محطات تحول الخامة إلى تكوين مكتمل.", steps: 3 },
  { id: "studio-edit", name: "غرفة المونتاج", english: "Editing Room", description: "الصورة والصوت والحركة تلتقي على خط زمني.", steps: 3 },
  { id: "studio-collage", name: "مساحة الاحتمالات", english: "Field of Possibilities", description: "قصاصات متنوعة تتجمع داخل ملصق واحد.", steps: 3 },
  { id: "studio-lens", name: "الأسكي تحت السطح", english: "Beneath the ASCII", description: "عدسة متحركة تكشف حروف الخلفية داخل نطاقها.", steps: 3 },
  { id: "studio-wave", name: "أثر الموجة", english: "Wave Imprint", description: "نبضة صوتية تتحول تدريجيًا إلى تضاريس.", steps: 3 },
  { id: "studio-frame", name: "خلف الكادر", english: "Beyond the Frame", description: "خطوط المحاذاة تتراجع لتكشف الكادر.", steps: 3 },
  { id: "studio-layers", name: "طبقات العمل", english: "Creative Layers", description: "ألواح شفافة تتراصف لتصنع تكوينًا واحدًا.", steps: 3 },
  { id: "studio-point", name: "الفكرة في الفراغ", english: "Idea in Space", description: "نقطة واحدة ترسم شكلًا في مساحة مفتوحة.", steps: 3 },
] as const;

export const collections = { original: originalThemes, lab: labThemes, studio: studioThemes } as const;
export const allThemes = [...originalThemes, ...labThemes, ...studioThemes];

export type CollectionId = keyof typeof collections;
export type OriginalThemeId = (typeof originalThemes)[number]["id"];
export type LabThemeId = (typeof labThemes)[number]["id"];
export type StudioThemeId = (typeof studioThemes)[number]["id"];
export type Theme = (typeof allThemes)[number];
export type ThemeId = Theme["id"];
