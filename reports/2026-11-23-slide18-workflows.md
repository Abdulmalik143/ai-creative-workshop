# تقرير السلايد 18 وديموهات مسارات العمل

> **تحديث 2026-11-23:** حُذفت ديموهات `/lab/workflow-*` وملفاتها من المشروع بطلب المستخدم (نُقلت إلى سلة المهملات). أقسام الديموهات في هذا التقرير صارت سجلًا لما بُني ثم حُذف. السلايد 18 باقٍ كما هو.

التاريخ: 2026-11-23. المشروع: `~/Desktop/RKY/ai-covers`. كل ما هنا مُختبر على نسخة production (`npm run build` ثم `next start -p 3200`)، إلا ما ذُكر غير ذلك.

## السلايد 18 (المرحلة 1)

«بأربع نقرات» نُفّذت أربع حالات: الدخول ثم ثلاث نقرات.

| الحالة | ما يظهر |
|---|---|
| الدخول | العنوان والسؤال والبطاقات الـ14 بوضوح متساوٍ، بلا أرقام ولا برتقالي ولا تعتيم |
| النقرة 1 | ست بطاقات بالبرتقالي مرقّمة 1–6 من اليمين، والباقي يخفت إلى 30% |
| النقرة 2 | نبضة مرتين وإطار ثابت حول «البرمجة» فقط |
| النقرة 3 | خط يشطب «البرمجة»، ويختفي رقمها ولونها. الخمسة يتدحرج رقم كل منها إلى رقمه الجديد بالترتيب من اليمين (1 UI/UX … 5 الـ3D) |

التحقق: قيست مواضع البطاقات الـ14 في كل حالة، تقدّمًا ورجوعًا، وكانت متطابقة. الرجوع يعيد كل حالة كما كانت.

---

## 1) مسار العمل لكل مجال

مشروع وهمي واحد: علامة قهوة «بُن». مخرج كل مرحلة هو نص مدخل المرحلة التالية حرفيًا، وتحقق الاختبار من ذلك في كل انتقال.

### UI/UX (`/lab/workflow-uiux`)
| المرحلة | السكيل | الأداة | المدخل | المخرج |
|---|---|---|---|---|
| البريف والمستخدم | design:user-research | Claude Code | بريف تطبيق «بُن» | شخصية + رحلة من 3 خطوات + مهمة معتمدة |
| Wireframe | impeccable | Figma MCP، Figma | الشخصية والرحلة | Wireframe لثلاث شاشات مع ملاحظات |
| الواجهة والحالات | frontend-design، impeccable | Next.js + React، متصفح Claude | الـWireframe | واجهة تفاعلية بأربع حالات: فارغ، تحميل، خطأ، نجاح |
| قرار تصميمي | design:design-critique | متصفح Claude | الواجهة | تدفّق معدّل: الفرع المفتوح يُختار أولًا، فلا يظهر خطأ «الفرع مغلق» بعد الدفع |
| الاختبار والتسليم | design:accessibility-review، design:design-handoff | متصفح Claude، Figma MCP | التدفّق المعدّل | واجهة مختبرة (التباين محسوب من الألوان) + مواصفات تسليم |

### المونتاج (`/lab/workflow-montage`)
| المرحلة | السكيل | الأداة | المدخل | المخرج |
|---|---|---|---|---|
| البريف واللقطات | open-montage ①، rakaya-motion | Claude Code | بريف 15–30 ث + 5 لقطات خام | بطاقات فهم + brief.json |
| خريطة الإيقاع | rakaya-motion، open-montage ② | Python 3.12 (`beat_timing.py`) | البطاقات | خطة مشاهد scene_plan (المدة 17.57 ث) |
| الترتيب والقص | open-montage ④ | FFmpeg 9.0.2 (DaVinci Resolve بديل مثبّت) | الخطة | edit_decisions: ترتيب ونقاط دخول وخروج |
| النصوص | rakaya-motion | Chrome headless + FFmpeg | قرارات القص | مسار نص متزامن مع اللقطات |
| قبل وبعد والتصدير | open-montage ⑥ | FFmpeg + ffprobe | مسار النص | إعلان MP4 مدته 17.6 ث + render_report |

**الناتج فيديو فعلي مُصدَّر وليس محاكاة:** `before.mp4` (35.5 ث خام) و`after.mp4` (17.6 ث). اللقطات نفسها رسوم وهمية رُسمت في المشروع.

### الموشن والأنيميشن (`/lab/workflow-motion`)
| المرحلة | السكيل | الأداة | المدخل | المخرج |
|---|---|---|---|---|
| الستوري بورد | rakaya-motion، hyperframes | Claude Code | بريف افتتاحية شعار 4–5 ث | 4 لقطات مفتاحية |
| التوقيت | rakaya-motion، **open-montage ②** | Python | اللقطات | جدول توقيت (العنوان 800ms، النص 600ms، القراءة 1.2 ث + 0.3 لكل كلمة = 4.5 ث) |
| منحنيات الحركة | rakaya-motion | CSS cubic-bezier (GSAP مثبّت) | الجدول | منحنى دخول `cubic-bezier(.16,1,.3,1)` مقابل خطي، مع نقاط تُظهر توزيع الإطارات |
| التتابع | rakaya-motion | CSS cubic-bezier | المنحنيات | دفعة وحدة مقابل تتابع 75ms من اليمين |
| المعاينة والإخراج | **open-montage ⑤–⑥**، hyperframes | CSS، HyperFrames | المشهد | معاينة حيّة في المتصفح؛ الرندر بـHyperFrames مقترح |

سكيلز ركايا ماركتينغ المطبّقة: قيم `rakaya-motion/references/motion.md` (المنحنيات والمدد وزمن القراءة واتجاه RTL). تدخل سكيل open-montage في التوقيت (②) وفي المعاينة والإخراج (⑤–⑥).

### الجرافيك (`/lab/workflow-graphic`)
| المرحلة | السكيل | الأداة | المدخل | المخرج |
|---|---|---|---|---|
| الشبكة والتكوين | ui-ux-pro-max:banner-design | Figma MCP | بريف ملصق 4:5 | شبكة 6 أعمدة + مناطق محجوزة |
| الخطوط | ui-ux-pro-max:brand | Figma MCP | الشبكة | تراتبية 96/40/24 بخط ثمانية |
| الألوان | ui-ux-pro-max:brand | Canva MCP | التراتبية | لوحة بُن مع تباين WCAG محسوب (البني المحمّص يسقط بتباين 1.3:1) |
| الملصق النهائي | banner-design | Illustrator 2025، Affinity 3 | الألوان | ملصق «برّد صباحك» 4:5 |
| التكييف للمنصات | banner-design | Canva MCP، Figma MCP | الملصق | 4:5 و9:16 و1:1 |

### الـ3D (`/lab/workflow-3d`)
| المرحلة | السكيل | الأداة | المدخل | المخرج |
|---|---|---|---|---|
| الهيئة الأساسية | visual-component-scout | Three.js 0.187، Blender 5.2.1 | رسم الكوب | مجسّم lathe رمادي |
| الخامات | visual-component-scout | Three.js | المجسّم | سيراميك، قهوة، حبوب، طاولة |
| الإضاءة | visual-component-scout | Three.js، Blender | المجسّم بخاماته | إضاءة ثلاثية بظلال |
| الكاميرا | visual-component-scout | Three.js | المشهد المضاء | لقطة 50mm والكوب على الثلث |
| الرندر | visual-component-scout | Blender 5.2.1، Blender MCP | الزاوية | لقطة Cycles مُصيَّرة فعليًا 1280×720 |

المعاينة تدور بسحب المؤشر في كل المراحل، والسحب لا ينقل المرحلة.

---

## 2) السكيلز والأدوات

### جدول الحالة
| الاسم | النوع | الحالة | ما تحققت منه |
|---|---|---|---|
| open-montage | سكيل (جديدة) | **جرّبته واشتغل** | مسارها المحلي ببيانات وهمية حتى التصدير |
| rakaya-motion | سكيل | **جرّبته واشتغل** | شغّلت `beat_timing.py`، وطبّقت قيم `motion.md` |
| Claude Code | أداة | **جرّبته واشتغل** | هذه الجلسة |
| Figma MCP | MCP | **جرّبته واشتغل** | أمر القراءة `whoami` (حساب Pro). لم يُنشأ ملف |
| Canva MCP | MCP | **جرّبته واشتغل** | أمر القراءة `help`. لم يُنشأ تصميم |
| DaVinci Resolve MCP | MCP | **جرّبته واشتغل** | أمرا قراءة (`knowledge`، `runtime_mode`) دون فتح Resolve |
| متصفح Claude | أداة | **جرّبته واشتغل** | اختبار كل الديموهات والسلايد 18 |
| FFmpeg 9.0.2 / ffprobe | أداة | **جرّبته واشتغل** | قص وxfade وoverlay وتصدير وفحص |
| Google Chrome 157 (headless) | أداة | **جرّبته واشتغل** | تصوير HTML والنص العربي إلى PNG |
| Python 3.12 | أداة | **جرّبته واشتغل** | تشغيل الحاسبة |
| Blender 5.2.1 | أداة | **جرّبته واشتغل** | رندر Cycles في الخلفية |
| Three.js 0.187، Next.js 16 + React 19 | مكتبات | **جرّبته واشتغل** | الديموهات مبنية بها |
| hyperframes، hyperframes-cli، hyperframes-registry، media-use | سكيلز | مثبّت/مهيّأ | قُرئت ولم تُشغَّل |
| remotion-* (10 سكيلز) | سكيلز | مثبّت/مهيّأ | قُرئ وصفها ولم تُشغَّل |
| HyperFrames 0.9.15 | أداة | مثبّت/مهيّأ | موجود في ذاكرة npx، ولم يُشغَّل |
| Remotion 4.0.540 | أداة | مثبّت/مهيّأ | `rakaya-marketing/studio/remotion/node_modules`، ولم يُشغَّل |
| design:user-research، design-critique، accessibility-review، design-handoff، impeccable، frontend-design، ui-ux-pro-max:banner-design، ui-ux-pro-max:brand، visual-component-scout | سكيلز | مثبّت/مهيّأ | متاحة في الجلسة، ولم تُستدعَ |
| Figma 126.11، Affinity 3.0.2، Illustrator 2025، Photoshop 2026، After Effects 2026/2027، Premiere Pro 2026، Cinema 4D 2026.3، Framer، DaVinci Resolve 21.0.4 | برامج | مثبّت/مهيّأ | فُحص الوجود والإصدار فقط |
| Blender MCP (إضافة Blender Lab) | إضافة | مثبّت/مهيّأ | موجودة في `Blender/5.2/extensions/lab_blender_org/mcp`، وغير موصولة بالجلسة |
| GSAP 3.15 | مكتبة | مثبّت/مهيّأ | في `package.json`، ولم تُستخدم |
| Mobbin MCP | MCP | مهيّأ، **لم يشتغل** | ردّ: يحتاج خطة مدفوعة |
| Chrome DevTools MCP | MCP | مهيّأ، **لم يشتغل** | ملف Chrome الخاص به كان مستخدمًا من نسخة ثانية |
| OpenMontage | أداة | **مقترح فقط** | غير مثبّتة. تحتاج `git clone` ثم `make setup` (تنزيلات pip وnpm)، وهذا ينتظر موافقتك |

### مسارات السكيلز
- `~/.claude/skills/open-montage/SKILL.md` (جديدة)
- `~/Desktop/RKY/rakaya-marketing/.claude/skills/rakaya-motion/SKILL.md`
- `~/Desktop/RKY/rakaya-marketing/.claude/skills/{hyperframes,hyperframes-cli,hyperframes-registry,media-use}/SKILL.md`
- `~/Desktop/RKY/rakaya-marketing/.claude/skills/remotion-{best-practices,captions,create,docs,license,markup,multimedia,render,studio,upgrade}/SKILL.md`
- `~/.claude/skills/{impeccable,visual-component-scout}/SKILL.md`. أما سكيلز design:* وui-ux-pro-max:* وfrontend-design فمن إضافات الجلسة.

### سكيلز الموشن في ركايا ماركتينغ: الأدوات والأدوار
| السكيل | الأدوات التي تذكرها ودورها | المدخل → المخرج |
|---|---|---|
| rakaya-motion | HyperFrames محرك أساسي، وRemotion عند الحاجة، وFFmpeg/FFprobe، وWhisper للتفريغ، و`beat_timing.py` لحساب المدة، وReact Bits (سبعة مكوّنات) | بريف وأصول ونصوص حرفية → Style Frames ثم كومبوزيشن ثم MP4 في `Exports/`، مع بوابة موافقة قبل كل مرحلة |
| hyperframes | `npx hyperframes init/check/snapshot/preview/render`، وGSAP للحركة | `index.html` و`compositions/` و`assets/` → فيديو 1920×1080 بـ30fps مع SPEC.md وREVIEW.md |
| hyperframes-cli | `lint` و`check` و`snapshot` و`timeline move/trim/split` و`render` (محلي أو سحابي مدفوع)، وffprobe | مجلد المشروع → `out.mp4` ولقطات PNG |
| hyperframes-registry | `catalog` و`add`: نحو 450 بلوك جاهز | استعلام بالإنجليزي → `compositions/*.html` |
| media-use | موسيقى وصوت وتفريغ وإزالة خلفية وتلوين، عبر HeyGen (بعضه مدفوع) أو أدوات محلية | نوع ونية → ملفات في `assets/` |
| remotion-markup | `useCurrentFrame` و`interpolate` وEasing و`@remotion/media`، وFFmpeg للقص | أصول في `public/` → كومبوزيشن React |
| remotion-create / render / studio | `create-video` و`npx remotion render/still/studio` | مجلد جديد → مشروع، ثم MP4 أو PNG |

---

## 3) روابط التوثيق الرسمية
(كل رابط فُتح اليوم. روابط Adobe ترفض السكربتات وتفتح في المتصفح. صفحة Blender Lab خلف فحص Cloudflare، وواجهة المستودع البرمجية عندها تردّ 200.)

- OpenMontage: https://github.com/OpenMontageInc/OpenMontage · https://www.openmontage.video/
- FFmpeg: https://ffmpeg.org/documentation.html
- HyperFrames: https://hyperframes.heygen.com/ · https://github.com/heygen-com/hyperframes
- Remotion: https://www.remotion.dev/docs · الترخيص https://www.remotion.dev/license
- Blender: https://docs.blender.org/manual/en/latest/ · Blender MCP: https://projects.blender.org/lab/blender_mcp
- Three.js: https://threejs.org/docs/
- GSAP: https://gsap.com/docs/v3/ · Motion: https://motion.dev/docs
- Next.js: https://nextjs.org/docs
- Figma MCP: https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server
- Canva MCP: https://www.canva.dev/docs/mcp/
- DaVinci Resolve: https://www.blackmagicdesign.com/products/davinciresolve
- Chrome headless: https://developer.chrome.com/docs/automation-and-testing/headless · Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Mobbin MCP: https://mobbin.com/mcp
- After Effects: https://helpx.adobe.com/after-effects/desktop.html · Illustrator: https://helpx.adobe.com/illustrator/desktop.html · Affinity: https://www.affinity.studio/
- Claude Code و Skills: https://code.claude.com/docs/en/overview · https://code.claude.com/docs/en/skills
- CSS easing: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function
- Python: https://docs.python.org/3.12/

---

## 4) مسارات الملفات والمعاينات

**السلايد 18:** `ai-covers/deck/slides/S18Domains.tsx`، و`deck/content/copy.ts` (`S18.six/coding/five`)، و`deck/content/notes.ts` (s18). المعاينة: `/deck#18`.

**الديموهات:** `/lab/workflow-uiux`، `/lab/workflow-montage`، `/lab/workflow-motion`، `/lab/workflow-graphic`، `/lab/workflow-3d`، وقسم «ديموهات مسارات العمل» في `/lab`.
- الكود: `ai-covers/components/lab/workflows/` (`WorkflowFrame.tsx`، `data.ts`، `tools.ts`، `brand.ts`، `BunMark.tsx`، و`*Canvas.tsx` لكل مجال، و`demos.tsx`)، مع تسجيلها في `components/lab/meta.ts` و`registry.tsx` و`app/lab/page.tsx`.
- المونتاج: `scripts/make-bun-montage.mjs` ← `public/lab/workflows/montage/` (before.mp4، after.mp4، shot-*.jpg، frame-*.jpg)، والملفات الوسيطة في `.work/bun/` (beat-sheet.json، beat-timing.json/txt، artifacts/*.json).
- الـ3D: `scripts/render-bun-cup.py` ← `public/lab/workflows/3d/blender-render.png`.

**السكيل:** `~/.claude/skills/open-montage/SKILL.md`

**مصادر الأصول:** كلها وهمية ومصنوعة في المشروع. الشعار رُسم في `BunMark.tsx`، والخط ثمانية الموجود في المشروع، واللقطات رسوم HTML صوّرها Chrome، ومجسّم الكوب هندسة بالكود. القائمة في `brand.ts` (`BUN_SOURCES`).

---

## 5) ملاحظات الشرح (وقت العرض)

**UI/UX:** الآيجنت يبني الواجهة بكود حقيقي، فتقدر تجرّبها بنفسك، ومعها حالاتها الأربع. قرارك كمصمم هو اللي يغيّر التجربة: نقلنا اختيار الفرع لأول خطوة، فاختفى الخطأ قبل ما يصير.

**المونتاج:** هنا الفيديو مُصدَّر فعليًا. نفس اللقطات صارت 17.6 ثانية بدل 35. المدة ما خمّناها: انحسبت من النص وحدثه، والقص صار مع الضغطة مو قبلها.

**الموشن:** نفس المدة ونفس الحركة، والفرق كله في المنحنى والتتابع. الخطي يحس آلي، والمدروس يهدأ عند الوصول. والقيم جاية من سكيل ركايا للموشن، مو من ذوق اللحظة.

**الجرافيك:** القرارات تُبنى بالترتيب: شبكة، ثم خط، ثم لون. الآيجنت يحسب التباين ويطبّق اللوحة، وأنت تقرر وين يُستخدم كل لون.

**الـ3D:** نفس الكوب في Three.js (معاينة لحظية تدوّرها بيدك) وفي Blender (رندر حقيقي). الآيجنت يكتب السكربت، وأنت تقرر الزاوية والمزاج.

---

## وش اشتغل فعلًا
- السلايد 18 بحالاته الأربع، تقدّمًا ورجوعًا، بلا تحريك أي بطاقة.
- خمسة ديموهات بمسارات مستقلة: تقدّم يدوي بالنقر والأسهم، إعادة تشغيل بـR والزر، ونص المخرج ينتقل إلى خانة المدخل.
- تدفّق الواجهة التفاعلي بالنقر: فارغ ← تحميل ← خطأ ← اختيار فرع مفتوح ← نجاح.
- حاسبة `beat_timing.py` من rakaya-motion على بيانات وهمية: 17.57 ث.
- تصدير فيديو حقيقي بـFFmpeg: قبل 35.5 ث وبعد 17.6 ث، وكلاهما يشتغل داخل الديمو.
- رندر Blender 5.2.1 (Cycles) في الخلفية بسكربت.
- معاينة Three.js قابلة للدوران بالمؤشر.
- أوامر قراءة MCP: Figma وCanva وDaVinci Resolve.
- سكيل open-montage مكتوبة ومجرّبة في مسارها المحلي.
- `tsc` نظيف و`npm run build` ناجح، وما ظهرت أخطاء في الـconsole.

## وش بقي بديلًا أو غير متحقق منه، والسبب
- **OpenMontage نفسها:** غير مثبّتة. تثبيتها يحتاج تنزيل المستودع وحزم pip وnpm، ولم أفعل ذلك دون موافقتك. البديل: مسار السكيل المحلي (FFmpeg + Chrome + rakaya-motion) بنفس أسماء ملفات OpenMontage.
- **HyperFrames وRemotion:** مثبّتة ولم تُشغَّل. رندر مشهد الموشن مقترح فقط، والمعاينة في المتصفح.
- **Mobbin MCP:** يحتاج خطة مدفوعة.
- **Chrome DevTools MCP:** فشل لأن ملف Chrome الخاص به كان مستخدمًا من نسخة ثانية. الاختبار تم بمتصفح Claude بدلًا منه.
- **DaVinci Resolve:** جُرّبت أوامر القراءة عبر MCP فقط. لم يُفتح البرنامج ولم يُستخدم في القص.
- **Figma وCanva:** جُرّب أمر قراءة فقط. ما أُنشئ ملف ولا تصميم، فالمراحل التي تذكرهما في الديمو محاكاة لدورهما.
- **سكيلز design:* وui-ux-pro-max:* وimpeccable وfrontend-design:** متاحة ولم تُستدعَ. مكانها في الديمو مقترح.
- **Illustrator وAffinity وAfter Effects:** مثبّتة. تصدير الملصق منها مقترح ولم يُنفَّذ.
- **صفحة Blender Lab MCP:** خلف فحص Cloudflare، ولم أتجاوزه. تحققت من المستودع عبر واجهته البرمجية.
- **خادم التطوير على :3100:** يقدّم CSS قديمًا، فالمراجعة البصرية تمت على نسخة production. أعد تشغيله قبل العرض، أو اعرض من build.
