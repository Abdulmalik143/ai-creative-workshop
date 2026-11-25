import type { ComponentType } from "react";
import Eclipse from "./eclipse/Eclipse";
import Anatomy from "./anatomy/Anatomy";
import Globe from "./globe/Globe";
import Canvas, { CanvasDark } from "./canvas/Canvas";
import Timeline from "./lab/timeline/Timeline";
import Roll from "./lab/roll/Roll";
import Viewfinder from "./lab/viewfinder/Viewfinder";
import Viewport from "./lab/viewport/Viewport";
import Editor from "./lab/editor/Editor";
import Nodes from "./lab/nodes/Nodes";
import Select from "./lab/select/Select";
import Deck from "./lab/deck/Deck";
import Board from "./lab/board/Board";
import Curve from "./lab/curve/Curve";
import Overprint from "./overprint/Overprint";
import Chrome from "./chrome/Chrome";

export type CoverProps = { active?: boolean; replay?: number };
export type CoverMeta = {
  id: string;
  name: string;
  /** one line: why this cover exists */
  idea: string;
  hint: string;
  group?: "first" | "canvas";
  theme?: "dark" | "light";
  approved?: boolean;
  Component: ComponentType<CoverProps>;
};

export const covers: CoverMeta[] = [
  {
    id: "eclipse",
    name: "كسوف",
    idea: "الفكرة ضوء، والتنفيذ جسمٌ يمنحها شكلًا.",
    hint: "حرّك المؤشر: الضوء يتبعك خلف العنوان",
    Component: Eclipse,
  },
  {
    id: "anatomy",
    name: "تشريح",
    idea: "خلف كل حرف وكيلٌ يضع النقاط، وعقلٌ يملؤه بالمعنى.",
    hint: "مرّر المؤشر: عدسة تكشف النقاط تحت الحروف",
    Component: Anatomy,
  },
  {
    id: "globe",
    name: "كوكب",
    idea: "العقل جرمٌ مظلم، والوكيل شبكةٌ تكشفه نقطةً نقطة.",
    hint: "حرّك المؤشر: يميل الضوء حول حافة الكوكب",
    Component: Globe,
  },
  {
    id: "canvas",
    group: "canvas",
    theme: "light",
    name: "لوحة · فاتحة",
    idea: "العقل يرسم بيده، والوكيل يحوّل الخطّ إلى تنفيذ دقيق.",
    hint: "حرّك المؤشر: أنت العقل، وسيتبعك الوكيل ويصقل خطّك",
    Component: Canvas,
  },
  {
    id: "overprint",
    name: "طبعة",
    idea: "لونان من الحبر، وحيث يلتقيان يولد لونٌ ثالث: العمل.",
    hint: "حرّك المؤشر: تنزاح اللوحتان ثم يعيدهما الوكيل إلى التطابق",
    Component: Overprint,
  },
  {
    id: "chrome",
    name: "معدن",
    idea: "الكلمات نوافذ في العتمة، وخلفها فكرةٌ سائلة لا تهدأ.",
    hint: "مرّر المؤشر فوق الحروف: يتموّج المعدن",
    Component: Chrome,
  },
  { id: "canvas-dark", group: "canvas", theme: "dark", name: "لوحة · داكنة", idea: "اللوحة نفسها في العتمة: المؤشران يضيئان.", hint: "حرّك المؤشر: أنت العقل، والوكيل يصقل خطّك", Component: CanvasDark },
  { id: "timeline", group: "canvas", theme: "dark", name: "خط الزمن", idea: "الكلمات مقاطع، والوكيل يرصّها ويقصّ عند كل حافة.", hint: "مرّر المؤشر على الشريط: رأس التشغيل يلتصق بالقصّات", Component: Timeline },
  { id: "roll", group: "canvas", theme: "dark", name: "إيقاع", idea: "العقل يعزف بحرّية، والوكيل يضبطه على الشبكة.", hint: "حرّك المؤشر: كل نغمة ترسمها تُسحب إلى مكانها", Component: Roll },
  { id: "viewfinder", group: "canvas", theme: "dark", name: "عدسة", idea: "العقل يصوّب، والوكيل يضبط البؤرة على الكلمة.", hint: "حرّك المؤشر: تنتقل البؤرة وتضبب بقية الكلمات", Component: Viewfinder },
  { id: "viewport", group: "canvas", theme: "dark", approved: true, name: "مجسّم", idea: "العنوان جسم له عمق، والعقل يدور حوله والوكيل يقيسه.", hint: "حرّك المؤشر: تدور الكاميرا حول العنوان", Component: Viewport },
  { id: "editor", group: "canvas", theme: "dark", name: "محرّر", idea: "العقل يكتب السطر الأول، والوكيل يقترح الباقي ويعتمده.", hint: "مرّر على سطر: يضيء ما يقابله في المعاينة", Component: Editor },
  { id: "nodes", group: "canvas", theme: "light", name: "عُقد", idea: "العقل يسحب سلكًا سائبًا، والوكيل مقبسٌ يلتقطه ويوصّله.", hint: "اسحب السلك بالمؤشر نحو مقبس: ينعقد بوصلة نظيفة", Component: Nodes },
  { id: "select", group: "canvas", theme: "light", name: "تحديد", idea: "العقل يلفّ حول الكلمة بخطّ حرّ، والوكيل يعيد التحديد بالدقة.", hint: "حرّك المؤشر: يتبعك خطّ حرّ ويلتقط الوكيل أقرب كلمة", Component: Select },
  { id: "deck", group: "canvas", theme: "light", name: "شريحة", idea: "العقل يسحب الحجم كما يشاء، والوكيل يثبّته على قيمة.", hint: "حرّك المؤشر أفقيًا: يتغير الحجم ويُقرَّب إلى قيمة", Component: Deck },
  { id: "board", group: "canvas", theme: "light", name: "ملاحظات", idea: "العقل يبعثر الأفكار، والوكيل يرصّها في صفّ.", hint: "اقترب بالمؤشر من الملاحظات: تتبعثر ثم تعود", Component: Board },
  { id: "curve", group: "canvas", theme: "light", name: "منحنى", idea: "العقل يسحب المقبض بلا حساب، والوكيل يقرّبه إلى قيمة قابلة للكتابة.", hint: "حرّك المؤشر داخل الرسم: يتغير دخول العنوان", Component: Curve },
];

export const getCover = (id: string) => covers.find((c) => c.id === id);
