"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stage } from "@/components/stage/Stage";
import { labMeta, type Control } from "./meta";
import { labComponents } from "./registry";

const btn =
  "rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[16px] font-medium text-[#eef3f3] transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6] disabled:opacity-35 disabled:hover:bg-white/5";

export function Playground({ slug }: { slug: string }) {
  const meta = labMeta.find((m) => m.slug === slug)!;
  const idx = labMeta.findIndex((m) => m.slug === slug);
  const Comp = labComponents[slug];
  const total = meta.steps ?? 0;
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [auto, setAuto] = useState(false);
  const [vals, setVals] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries((meta.controls ?? []).map((c) => [c.key, c.default])),
  );
  const wrap = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  const next = useCallback(() => setStep((s) => Math.min(total - 1, s + 1)), [total]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const restart = useCallback(() => {
    setStep(0);
    setReplay((n) => n + 1);
  }, []);
  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrap.current?.requestFullscreen?.();
  }, []);

  useEffect(() => {
    if (!auto || !total) return;
    const id = setInterval(() => setStep((s) => (s + 1) % total), 3200);
    return () => clearInterval(id);
  }, [auto, total]);

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (!total) {
        if (e.key === "r" || e.key === "R") restart();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowRight") prev();
      else if (e.key === "r" || e.key === "R") restart();
      else if (e.key === "f" || e.key === "F") toggleFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, next, prev, restart, toggleFull]);

  const set = (c: Control, v: string | boolean) => setVals((o) => ({ ...o, [c.key]: v }));

  return (
    <main className="mx-auto flex max-w-[1500px] flex-col gap-6 px-6 pb-16 pt-8 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/lab" className={btn}>المعمل</Link>
          <h1 className="text-[28px] font-black text-[#eef3f3]">
            <span className="ml-3 text-[#7f9296]">{String(meta.no).padStart(2, "0")}</span>
            {meta.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {labMeta[idx + 1] && <Link href={`/lab/${labMeta[idx + 1].slug}`} className={btn}>التالي</Link>}
          {labMeta[idx - 1] && <Link href={`/lab/${labMeta[idx - 1].slug}`} className={btn}>السابق</Link>}
          <button className={btn} onClick={restart}>إعادة التشغيل</button>
          <button className={btn} onClick={toggleFull}>{full ? "إنهاء ملء الشاشة" : "ملء الشاشة"}</button>
        </div>
      </header>

      <p className="max-w-[900px] text-[19px] leading-relaxed text-[#9fb3b5]">
        {meta.does}
      </p>

      <div
        ref={wrap}
        className="relative overflow-hidden rounded-[14px] bg-black ring-1 ring-white/10"
        onClick={meta.clickAdvances ? next : undefined}
      >
        <div className={full ? "mx-auto flex h-dvh items-center justify-center" : ""}>
          <div className={full ? "w-[min(100vw,calc(100dvh*16/9))]" : "w-full"}>
            <Stage background="#070b0e" replay={replay}>
              {Comp ? <Comp step={total ? step : undefined} replay={replay} {...vals} /> : null}
            </Stage>
          </div>
        </div>
      </div>

      <section className="flex flex-wrap items-start gap-x-10 gap-y-6 rounded-[14px] border border-white/10 p-5">
        {total > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-[15px] text-[#7f9296]">
              المرحلة {step + 1} من {total}
              {meta.stepNames?.[step] ? ` · ${meta.stepNames[step]}` : ""}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button className={btn} onClick={prev} disabled={step === 0}>رجوع</button>
              <button className={btn} onClick={next} disabled={step === total - 1}>التالي</button>
              <button className={btn} onClick={() => setAuto((a) => !a)} aria-pressed={auto}>
                {auto ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
              </button>
              {meta.stepNames && (
                <div className="flex gap-1.5 pr-2">
                  {meta.stepNames.map((n, i) => (
                    <button
                      key={n}
                      onClick={() => setStep(i)}
                      aria-label={n}
                      className="h-3 w-3 rounded-full transition-colors"
                      style={{ background: i === step ? "#ff7a00" : "rgba(255,255,255,0.22)" }}
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="text-[14px] text-[#5d6f73]">مسافة أو ← للتالي · → للرجوع · R لإعادة التشغيل</span>
          </div>
        )}
        {(meta.controls ?? []).map((c) => (
          <label key={c.key} className="flex min-w-[220px] flex-col gap-2 text-[15px] text-[#7f9296]">
            {c.label}
            {c.type === "select" && (
              <select
                value={String(vals[c.key])}
                onChange={(e) => set(c, e.target.value)}
                className="rounded-[10px] border border-white/15 bg-[#0d1418] px-3 py-2.5 text-[16px] text-[#eef3f3]"
              >
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {c.type === "toggle" && (
              <input type="checkbox" checked={Boolean(vals[c.key])} onChange={(e) => set(c, e.target.checked)} className="h-6 w-6 accent-[#ff7a00]" />
            )}
            {c.type === "text" && (
              <textarea
                value={String(vals[c.key])}
                onChange={(e) => set(c, e.target.value)}
                rows={2}
                className="min-w-[320px] rounded-[10px] border border-white/15 bg-[#0d1418] px-3 py-2.5 text-[16px] text-[#eef3f3]"
              />
            )}
          </label>
        ))}
      </section>
    </main>
  );
}
