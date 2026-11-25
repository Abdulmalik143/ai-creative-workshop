"use client";

import {
  ArrowDown, ArrowLeft, Check, Columns2, FlaskConical, Maximize, Play, Presentation, Sparkles, SquarePlus, X,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import { Backdrop } from "../background/Backdrop";
import { Wamda } from "../character/Wamda";
import { coverContent } from "../content";
import { Cover } from "../covers/Cover";
import { Brand, CoverByline } from "../covers/CoverContent";
import { LabHeroGraphic } from "../covers/lab/LabLayouts";
import { StudioHeroGraphic } from "../covers/studio/StudioLayouts";
import { Sketch } from "../covers/Sketch";
import { allThemes, collections, labThemes, type CollectionId, type Theme, type ThemeId } from "../covers/themes";
import { Comparison, Preview } from "./Overlay";

const adoptionKey = "rakaya-workshop-adopted-theme";
const adoptionChanged = "workshop-adoption-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(adoptionChanged, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(adoptionChanged, callback);
  };
}

function readAdoption() {
  try {
    const id = localStorage.getItem(adoptionKey);
    return allThemes.find((theme) => theme.id === id)?.id ?? null;
  } catch {
    return null;
  }
}

const serverAdoption = () => null;

export function Gallery({ collection = "original" }: { collection?: CollectionId }) {
  const isLab = collection === "lab";
  const isStudio = collection === "studio";
  const themes: readonly Theme[] = collections[collection];
  const groups = isLab
    ? [
        { id: "without-wamda", name: "أغلفة بدون ومضة", items: labThemes.filter((theme) => !theme.wamda) },
        { id: "with-wamda", name: "أغلفة مع ومضة", items: labThemes.filter((theme) => theme.wamda) },
      ]
    : [{ id: collection, name: null, items: themes }];
  const CardTitle = isLab ? "h4" : "h3";
  const savedTheme = useSyncExternalStore(subscribe, readAdoption, serverAdoption);
  const [temporaryTheme, setTemporaryTheme] = useState<ThemeId | null>(null);
  const adopted = temporaryTheme ?? savedTheme;
  const [preview, setPreview] = useState<number | null>(null);
  const [pair, setPair] = useState<Theme[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [notice, setNotice] = useState("");
  const overlayOpen = preview !== null || compareOpen;

  function adopt(id: ThemeId) {
    try {
      localStorage.setItem(adoptionKey, id);
      setTemporaryTheme(null);
      window.dispatchEvent(new Event(adoptionChanged));
    } catch {
      setTemporaryTheme(id);
    }
    setNotice(`تم اعتماد ثيم «${allThemes.find((theme) => theme.id === id)?.name}».`);
    setPreview(null);
    setCompareOpen(false);
    setPair([]);
    setHandoff(false);
  }

  function toggleComparison(theme: Theme) {
    if (pair.some((item) => item.id === theme.id)) {
      setPair(pair.filter((item) => item.id !== theme.id));
      setNotice("");
    } else if (pair.length < 2) {
      setPair([...pair, theme]);
      setNotice("");
    } else {
      setNotice("يمكن مقارنة ثيمين معًا. أزل أحد الخيارين لإضافة ثيم آخر.");
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="shell flex items-center justify-between gap-4">
          <div className="site-brand flex items-center gap-4">
            <Brand />
            <span className="site-divider" aria-hidden="true" />
            <span>ورشة إبداعية</span>
          </div>
          <nav className="collection-nav" aria-label="مجموعات الثيمات">
            <Link className="nav-link" href="/" aria-current={collection === "original" ? "page" : undefined}><Presentation size={16} /> الثيمات الأولى</Link>
            <Link className="nav-link" href="/lab" aria-current={isLab ? "page" : undefined}><FlaskConical size={16} /> المختبر الرقمي</Link>
            <Link className="nav-link" href="/studio" aria-current={isStudio ? "page" : undefined}><Sparkles size={16} /> أغلفة إبداعية</Link>
          </nav>
        </div>
      </header>

      <main className="shell">
        <section className={`gallery-hero ${isLab ? "gallery-hero--lab" : isStudio ? "gallery-hero--studio" : ""}`} aria-labelledby="workshop-title">
          {!isStudio && <Backdrop live={!overlayOpen} />}
          <div className="hero-scrim" />
          <div className="hero-copy">
            <div className="hero-label"><span aria-hidden="true" /> {isLab ? "تطوير الثيم السابع" : "معرض الأغلفة التفاعلية"}</div>
            {isLab ? (
              <>
                <h1 id="workshop-title">المختبر الرقمي</h1>
                <p className="lab-intro">عشرة أغلفة. سبعة بدون ومضة، وثلاثة يظهر فيها ظلّها.</p>
              </>
            ) : isStudio ? (
              <>
                <h1 id="workshop-title">أغلفة إبداعية</h1>
                <p className="studio-intro">خمسة عشر غلافًا بدون شخصية تستكشف كيف تتحول الفكرة إلى عمل.</p>
              </>
            ) : (
              <>
                <h1 id="workshop-title"><span>{coverContent.title[0]}</span>{" "}<span>{coverContent.title[1]}</span></h1>
                <CoverByline />
              </>
            )}
            <div className="hero-actions">
              <a className="button button--primary" href="#themes">استكشف الثيمات <ArrowDown size={17} /></a>
              <button type="button" className="button button--glass" onClick={() => setPreview(0)}><Play size={15} /> جرّب العرض</button>
            </div>
          </div>
          {isLab ? <LabHeroGraphic /> : isStudio ? <StudioHeroGraphic /> : (
            <div className="hero-figure" aria-hidden="true">
              <div className="hero-halo" />
              <div className="hero-orbit"><i /><i /></div>
              <Sketch mark="sweep" className="hero-sweep" />
              <Sketch mark="spark" className="hero-spark" />
              <Wamda />
            </div>
          )}
          <div className="hero-format" dir="ltr">16:9</div>
        </section>

        <section id="themes" className="themes-section" aria-labelledby="themes-title">
          <div className="section-heading">
            <div>
              <h2 id="themes-title">معرض الثيمات</h2>
              <p>عاين الحركة أو قارن بين غلافين قبل اعتماد ثيم العرض.</p>
            </div>
            {isLab ? (
              <nav className="lab-jumps" aria-label="أقسام المختبر الرقمي">
                <a href="#without-wamda">بدون ومضة <b>٧</b></a>
                <a href="#with-wamda">مع ومضة <b>٣</b></a>
              </nav>
            ) : <span className="theme-total"><span aria-hidden="true" /> {isStudio ? "١٥ غلافًا" : "١٠ ثيمات"}</span>}
          </div>

          {adopted && (
            <div className="adoption" aria-live="polite">
              <div><Check size={19} /><p>الثيم المعتمد <strong>{allThemes.find((theme) => theme.id === adopted)?.name}</strong></p></div>
              <button type="button" className="button button--primary" onClick={() => setHandoff(true)} disabled={handoff}>
                ابدأ بناء السلايدات <ArrowLeft size={17} />
              </button>
              {handoff && <p className="handoff-note">الثيم جاهز. أرسل محتوى السلايد الأول في المحادثة للبدء.</p>}
            </div>
          )}

          {groups.map((group) => (
            <section className="theme-group" key={group.id} id={group.id} aria-labelledby={group.name ? `${group.id}-title` : undefined}>
              {group.name && <h3 id={`${group.id}-title`}>{group.name}</h3>}
              <div className={`theme-grid ${group.id === "without-wamda" ? "theme-grid--seven" : ""}`}>
                {group.items.map((theme) => {
                  const index = themes.indexOf(theme);
                  const comparing = pair.some((item) => item.id === theme.id);
                  return (
                    <article className="theme-card" key={theme.id} data-adopted={adopted === theme.id}>
                      <div className="theme-thumbnail">
                        <div aria-hidden="true"><Cover theme={theme.id} /></div>
                        <button type="button" className="thumbnail-open" aria-label={`معاينة ${theme.name}`} onClick={() => setPreview(index)}>
                          <span className="thumbnail-expand" aria-hidden="true"><Maximize size={15} /></span>
                        </button>
                      </div>
                      <div className="theme-body">
                        <div className="theme-heading">
                          <div><p className="theme-en" lang="en" dir="ltr">{theme.english}</p><CardTitle>{theme.name}</CardTitle></div>
                          {adopted === theme.id && <span className="adopted-mark" title="الثيم المعتمد" aria-label="الثيم المعتمد"><Check size={15} /></span>}
                        </div>
                        <p className="theme-description">{theme.description}</p>
                        <div className="theme-actions">
                          <button type="button" className="theme-action" onClick={() => setPreview(index)} aria-label={`تشغيل معاينة ${theme.name}`}><Play size={15} /> معاينة</button>
                          <button type="button" className="theme-action" aria-pressed={comparing} aria-label={`مقارنة ${theme.name}`} onClick={() => toggleComparison(theme)}>
                            {comparing ? <Check size={16} /> : <SquarePlus size={16} />} مقارنة
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </section>

        <footer className="site-footer">
          <Brand /> <span>معرض أغلفة الورشة</span>
        </footer>
      </main>

      <div className="sr-only" role="status">{notice}</div>
      {pair.length > 0 && (
        <aside className="compare-tray" aria-label="الثيمات المختارة للمقارنة">
          <div className="tray-copy">
            <Columns2 size={19} />
            <div>
              <strong>المقارنة <b dir="ltr">{pair.length}/2</b></strong>
              <p>{pair.length === 1 ? "اختر ثيمًا آخر" : pair.map((theme) => theme.name).join(" · ")}</p>
            </div>
          </div>
          <button type="button" className="button button--primary" disabled={pair.length !== 2} onClick={() => { setNotice(""); setCompareOpen(true); }}>قارن الآن</button>
          <button type="button" className="icon-button" aria-label="إلغاء الاختيار" title="إلغاء الاختيار" onClick={() => { setPair([]); setNotice(""); }}><X /></button>
          {notice.startsWith("يمكن") && <p className="tray-notice">{notice}</p>}
        </aside>
      )}

      {preview !== null && <Preview index={preview} themes={themes} adopted={adopted} onAdopt={adopt} onClose={() => setPreview(null)} />}
      {compareOpen && pair.length === 2 && (
        <Comparison pair={[pair[0], pair[1]]} adopted={adopted} onAdopt={adopt} onClose={() => setCompareOpen(false)} />
      )}
    </>
  );
}
