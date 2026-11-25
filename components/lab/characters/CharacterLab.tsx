"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Stage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { AsciiBackground } from "../parts/AsciiBackground";
import { T } from "../tokens";
import { PixelCharacter } from "./PixelCharacter";
import { APPROVED_CHARACTER_ID, CHAR_H, CHAR_W, CHARACTERS, type Character, type CharacterMode } from "./sprites";

const approved = CHARACTERS.find((c) => c.id === APPROVED_CHARACTER_ID);

const btn =
  "rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[16px] font-medium text-[#eef3f3] transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6] disabled:opacity-35 disabled:hover:bg-white/5";
const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-[15px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6] ${
    on ? "border-[#b3c4c6] bg-[#b3c4c6] text-[#070b0e]" : "border-white/15 bg-white/5 text-[#eef3f3] hover:bg-white/15"
  }`;

/**
 * Display sizes on the 1920x1080 slide, matched to the heights Wamda already has in the deck
 * (Wamda is 76 sprite px tall; these characters are 56, so the scale is set by on-slide height).
 */
const SIZES = [
  { key: "s", label: "صغير", scale: 3.5, note: "نحو ٢٠٠ بكسل من ارتفاع السلايد، مثل ومضة في «Chatbot مقابل AI Agent»" },
  { key: "m", label: "متوسط", scale: 4.5, note: "نحو ٢٥٠ بكسل، مثل ومضة في «اتصال MCP»" },
  { key: "l", label: "رفيق", scale: 7.5, note: "نحو ٤٢٠ بكسل، مثل ومضة في «سؤال تفاعلي»" },
  { key: "xl", label: "كبير", scale: 9.5, note: "نحو ٥٣٠ بكسل، مثل ومضة في «فقاعة الحوار»" },
] as const;
type SizeKey = (typeof SIZES)[number]["key"];

/* the tentative pick lives in this browser only; nothing in the deck reads it */
const PICK_KEY = "rakaya-character-lab:pick";
const PICK_EVENT = "character-lab-pick";
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(PICK_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(PICK_EVENT, cb);
  };
}
function readPick() {
  try {
    const id = localStorage.getItem(PICK_KEY);
    return CHARACTERS.some((c) => c.id === id) ? id : null;
  } catch {
    return null;
  }
}

const no = (c: Character) => String(CHARACTERS.indexOf(c) + 1).padStart(2, "0");

export function CharacterLab() {
  const stored = useSyncExternalStore(subscribe, readPick, () => null);
  const [memo, setMemo] = useState<string | null | undefined>(undefined);
  const pick = memo !== undefined ? memo : stored;
  const setPick = (id: string | null) => {
    setMemo(id);
    try {
      if (id) localStorage.setItem(PICK_KEY, id);
      else localStorage.removeItem(PICK_KEY);
      setMemo(undefined);
      window.dispatchEvent(new Event(PICK_EVENT));
    } catch {
      /* storage blocked: keep the pick for this visit only */
    }
  };

  const [current, setCurrent] = useState((approved ?? CHARACTERS[0]).id);
  const [view, setView] = useState<"one" | "all">("one");
  const [size, setSize] = useState<SizeKey>("l");
  const [bg, setBg] = useState<"ascii" | "ink">("ascii");
  const [mode, setMode] = useState<CharacterMode>("color");
  const [rim, setRim] = useState(true);
  const [full, setFull] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const stageWrap = useRef<HTMLDivElement>(null);

  const character = CHARACTERS.find((c) => c.id === current)!;
  const idx = CHARACTERS.indexOf(character);
  const step = useCallback((d: number) => setCurrent(CHARACTERS[(CHARACTERS.indexOf(CHARACTERS.find((c) => c.id === current)!) + d + CHARACTERS.length) % CHARACTERS.length].id), [current]);
  const picked = CHARACTERS.find((c) => c.id === pick);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "ArrowLeft") step(1);
      else if (e.key === "ArrowRight") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const preview = (id: string) => {
    setCurrent(id);
    setView("one");
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sizeInfo = SIZES.find((s) => s.key === size)!;
  // ten across the slide only fits up to the medium size
  const lineupScale = Math.min(sizeInfo.scale, SIZES[1].scale);

  const slide = (
    <>
      {bg === "ascii" ? (
        <AsciiBackground palette="sage" shape="horizon" interactive={false} />
      ) : (
        <div className="absolute inset-0" style={{ background: T.ink }} />
      )}
      <RakayaLogo height={52} className="absolute left-[96px] top-[84px]" />
      {view === "one" ? (
        <>
          <div className="absolute right-[150px] top-[250px] w-[1050px]">
            <p className="m-0 text-[30px] font-bold" style={{ color: T.orange }}>٠٣ · الوكيل</p>
            <h2 className="m-0 mt-5 text-[96px] font-black leading-[1.2]" style={{ color: T.mist }}>
              الذكاء الاصطناعي في المجالات الإبداعية
            </h2>
            <p className="m-0 mt-7 text-[34px] leading-relaxed" style={{ color: T.sage }}>
              من الفكرة إلى ملف جاهز للاستخدام، والوكيل يرافقك في كل خطوة.
            </p>
          </div>
          <div className="absolute bottom-[110px] left-[200px] flex flex-col items-center">
            <PixelCharacter character={character} scale={sizeInfo.scale} mode={mode} rim={rim} />
            <span className="mt-[-6px] block h-[14px] rounded-[50%] bg-black/55" style={{ width: CHAR_W * sizeInfo.scale * 0.7 }} />
          </div>
        </>
      ) : (
        <div className="absolute inset-x-[60px] bottom-[110px] flex items-end justify-between" dir="rtl">
          {CHARACTERS.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-4">
              <PixelCharacter character={c} scale={lineupScale} mode={mode} rim={rim} />
              <span className="text-[26px] font-bold tabular-nums" style={{ color: c.id === pick ? T.orange : T.sage }}>{no(c)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <main className={`mx-auto flex max-w-[1500px] flex-col gap-10 px-6 pt-8 md:px-10 ${picked ? "pb-36" : "pb-20"}`}>
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/lab" className={btn}>المعمل</Link>
          <span className="rounded-full border border-white/10 px-4 py-2 text-[14px] text-[#7f9296]">Character Lab</span>
        </div>
        <h1 className="m-0 text-[clamp(30px,4vw,52px)] font-black leading-tight text-[#eef3f3]">مختبر الشخصيات</h1>
        {approved && (
          <div className="flex w-fit flex-wrap items-center gap-4 rounded-[14px] border border-[#ff7a00]/60 bg-[#0d1418] px-5 py-3">
            <PixelCharacter character={approved} scale={1.25} />
            <div>
              <p className="m-0 text-[18px] font-bold text-[#eef3f3]">
                الشخصية المعتمدة: <span style={{ color: T.orangeSoft }}>{approved.name}</span> · {approved.tagline}
              </p>
              <p className="m-0 text-[14px] text-[#7f9296]">رفيق العرض. لم تُضف إلى أي سلايد بعد.</p>
            </div>
            <button className={btn} onClick={() => preview(approved.id)}>معاينة</button>
          </div>
        )}
        <p className="m-0 max-w-[880px] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-[#8fa3a6]">
          عشر شخصيات أصلية بالبكسل آرت لاختيار رفيق العرض. كلها مرسومة على شبكة واحدة ٤٠×٥٦ وتُعرض بالمقياس نفسه، بألوان الهوية:
          الحبر والرمادي المخضر والأبيض، والبرتقالي لمسة واحدة فقط في كل شخصية.
        </p>
      </header>

      {/* ------------------------------------------------------------ preview */}
      <section ref={previewRef} aria-labelledby="preview-title" className="flex scroll-mt-6 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="preview-title" className="m-0 text-[28px] font-black text-[#eef3f3]">
              {view === "one" ? (
                <>
                  <span className="ml-3 tabular-nums" style={{ color: T.orange }}>{no(character)}</span>
                  {character.name} <span className="text-[20px] font-medium text-[#8fa3a6]">· {character.tagline}</span>
                </>
              ) : (
                "العشرة على سلايد واحد"
              )}
            </h2>
            <p className="m-0 mt-2 text-[15px] text-[#7f9296]">
              {view === "one" ? sizeInfo.note : `كل شخصية بارتفاع نحو ${Math.round(CHAR_H * lineupScale).toLocaleString("ar-SA")} بكسل من ١٠٨٠، لاختبار التمييز بينها بحجم العرض الفعلي.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {view === "one" && (
              <>
                <button className={btn} onClick={() => step(-1)} aria-label="الشخصية السابقة">السابق</button>
                <button className={btn} onClick={() => step(1)} aria-label="الشخصية التالية">التالي</button>
                <button
                  className={pick === character.id ? `${btn} !border-[#ff7a00] !text-[#ffb25e]` : btn}
                  aria-pressed={pick === character.id}
                  onClick={() => setPick(pick === character.id ? null : character.id)}
                >
                  {pick === character.id ? "محدد مبدئيًا ✓" : "تحديد مبدئي"}
                </button>
              </>
            )}
            <button className={btn} onClick={() => (document.fullscreenElement ? document.exitFullscreen() : stageWrap.current?.requestFullscreen?.())}>
              {full ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            </button>
          </div>
        </div>

        <div ref={stageWrap} className="relative overflow-hidden rounded-[14px] bg-black ring-1 ring-white/10">
          <div className={full ? "mx-auto flex h-dvh items-center justify-center" : ""}>
            <div className={full ? "w-[min(100vw,calc(100dvh*16/9))]" : "w-full"}>
              <Stage background={T.ink} active={false}>{slide}</Stage>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-10 gap-y-5 rounded-[14px] border border-white/10 p-5">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[15px] text-[#7f9296]">العرض</legend>
            <div className="flex flex-wrap gap-2">
              <button className={chip(view === "one")} aria-pressed={view === "one"} onClick={() => setView("one")}>شخصية واحدة</button>
              <button className={chip(view === "all")} aria-pressed={view === "all"} onClick={() => setView("all")}>العشرة معًا</button>
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[15px] text-[#7f9296]">الحجم على السلايد</legend>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s.key} className={chip(size === s.key)} aria-pressed={size === s.key} onClick={() => setSize(s.key)}>{s.label}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[15px] text-[#7f9296]">الخلفية</legend>
            <div className="flex flex-wrap gap-2">
              <button className={chip(bg === "ascii")} aria-pressed={bg === "ascii"} onClick={() => setBg("ascii")}>Gradient ASCII</button>
              <button className={chip(bg === "ink")} aria-pressed={bg === "ink"} onClick={() => setBg("ink")}>حبر سادة</button>
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[15px] text-[#7f9296]">اختبار الشكل</legend>
            <div className="flex flex-wrap gap-2">
              <button className={chip(mode === "color")} aria-pressed={mode === "color"} onClick={() => setMode("color")}>بالألوان</button>
              <button className={chip(mode === "silhouette")} aria-pressed={mode === "silhouette"} onClick={() => setMode("silhouette")}>ظل أسود</button>
              <button className={chip(rim)} aria-pressed={rim} onClick={() => setRim((v) => !v)} disabled={mode === "silhouette"}>حافة رمادية</button>
            </div>
          </fieldset>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="اختر شخصية للمعاينة">
          {CHARACTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCurrent(c.id);
                setView("one");
              }}
              aria-pressed={view === "one" && c.id === current}
              aria-label={`معاينة ${c.name}`}
              className={`flex flex-none flex-col items-center gap-1 rounded-[10px] border px-2 pb-1.5 pt-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6] ${
                view === "one" && c.id === current ? "border-[#b3c4c6] bg-white/10" : "border-white/10 hover:bg-white/5"
              }`}
            >
              <PixelCharacter character={c} scale={1.25} />
              <span className="text-[12px] tabular-nums" style={{ color: c.id === pick ? T.orange : T.dim }}>{no(c)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ cards */}
      <CardGroup
        title="البداية: خياران سعوديان"
        note="تقليدي ومعاصر، والفرق بينهما في الملامح والوقفة والملابس."
        items={CHARACTERS.filter((c) => c.group === "saudi")}
        pick={pick}
        onPick={setPick}
        onPreview={preview}
        current={view === "one" ? current : null}
      />
      <CardGroup
        title="ثماني شخصيات بتصميم حر"
        note="لكل واحد شكل يُعرف من بعيد: الرأس والشعر والبنية والوقفة والإكسسوار."
        items={CHARACTERS.filter((c) => c.group === "free")}
        pick={pick}
        onPick={setPick}
        onPreview={preview}
        current={view === "one" ? current : null}
      />

      {picked && (
        <aside
          aria-live="polite"
          className="fixed inset-x-0 bottom-3 z-10 mx-auto flex w-max max-w-[calc(100%-24px)] flex-wrap items-center gap-x-4 gap-y-2 rounded-[14px] border border-[#ff7a00]/50 bg-[#0d1418]/95 px-4 py-3 shadow-[0_10px_30px_#000a] backdrop-blur sm:px-5"
        >
          <PixelCharacter character={picked} scale={1} rim={false} className="hidden sm:block" />
          <div>
            <p className="m-0 text-[15px] font-bold text-[#eef3f3] sm:text-[17px]">
              اختيارك المبدئي: <span style={{ color: T.orangeSoft }}>{picked.name}</span>
              <span className="hidden sm:inline"> · {picked.tagline}</span>
            </p>
            <p className="m-0 hidden text-[14px] text-[#7f9296] sm:block">محفوظ في هذا المتصفح داخل المختبر فقط، ولا يدخل السلايدات قبل أن تعتمده.</p>
          </div>
          <button className={btn} onClick={() => preview(picked.id)}>معاينة</button>
          <button className={btn} onClick={() => setPick(null)}>إلغاء التحديد</button>
        </aside>
      )}
    </main>
  );
}

function CardGroup({
  title,
  note,
  items,
  pick,
  onPick,
  onPreview,
  current,
}: {
  title: string;
  note: string;
  items: Character[];
  pick: string | null;
  onPick: (id: string | null) => void;
  onPreview: (id: string) => void;
  current: string | null;
}) {
  return (
    <section className="flex flex-col gap-5" aria-label={title}>
      <div>
        <h2 className="m-0 text-[26px] font-black text-[#eef3f3]">{title}</h2>
        <p className="m-0 mt-1 text-[16px] text-[#8fa3a6]">{note}</p>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((c) => {
          const chosen = pick === c.id;
          return (
            <li
              key={c.id}
              className={`flex flex-col overflow-hidden rounded-[14px] border bg-[#0d1418] transition-colors ${
                c.id === APPROVED_CHARACTER_ID || chosen ? "border-[#ff7a00]" : current === c.id ? "border-[#b3c4c6]/60" : "border-white/10"
              }`}
            >
              <button
                onClick={() => onPreview(c.id)}
                aria-label={`معاينة ${c.name} على سلايد`}
                className="relative flex h-[268px] items-end justify-center border-b border-white/10 pb-5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b3c4c6]"
                style={{ background: `linear-gradient(${T.ink} 70%, ${T.panel2})` }}
              >
                <PixelCharacter character={c} scale={4} />
                {c.id === APPROVED_CHARACTER_ID ? (
                  <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-[13px] font-bold" style={{ background: T.orange, color: T.ink }}>
                    معتمد ✓
                  </span>
                ) : chosen ? (
                  <span className="absolute right-3 top-3 rounded-full border px-3 py-1 text-[13px] font-bold" style={{ borderColor: T.orange, color: T.orangeSoft }}>
                    اختيار مبدئي
                  </span>
                ) : null}
              </button>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[26px] font-black leading-none tabular-nums" style={{ color: T.orange }}>{no(c)}</span>
                  <h3 className="m-0 text-[23px] font-bold text-[#eef3f3]">{c.name}</h3>
                  <span className="text-[16px] text-[#b3c4c6]">{c.tagline}</span>
                </div>
                <p className="m-0 text-[15px] leading-relaxed text-[#8fa3a6]">{c.look}</p>
                {c.contrast && (
                  <dl className="m-0 mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-[10px] border border-white/10 p-3 text-[14px]">
                    <dt className="text-[#7f9296]">الملامح</dt>
                    <dd className="m-0 text-[#d5dedf]">{c.contrast.face}</dd>
                    <dt className="text-[#7f9296]">الوقفة</dt>
                    <dd className="m-0 text-[#d5dedf]">{c.contrast.stance}</dd>
                    <dt className="text-[#7f9296]">الملابس</dt>
                    <dd className="m-0 text-[#d5dedf]">{c.contrast.clothes}</dd>
                  </dl>
                )}
                <p className="m-0 flex items-center gap-2 text-[14px] text-[#7f9296]">
                  <span aria-hidden className="h-2.5 w-2.5" style={{ background: T.orange }} />
                  اللمسة البرتقالية: {c.accent}
                </p>
                <div className="mt-auto flex gap-2 pt-3">
                  <button className={`${btn} flex-1 !px-3`} onClick={() => onPreview(c.id)}>معاينة</button>
                  <button
                    className={`${btn} flex-1 !px-3 ${chosen ? "!border-[#ff7a00] !text-[#ffb25e]" : ""}`}
                    aria-pressed={chosen}
                    onClick={() => onPick(chosen ? null : c.id)}
                  >
                    {chosen ? "محدد ✓" : "تحديد مبدئي"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
