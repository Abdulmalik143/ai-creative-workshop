"use client";

import { useEffect, useRef, useState } from "react";
import { SLIDES } from "@/deck/registry";
import { CHANNEL, type DeckMessage } from "@/deck/engine/state";
import { StepList } from "@/deck/engine/Deck";
import { DeckBackground } from "@/deck/engine/DeckBackground";
import { Stage } from "@/components/stage/Stage";
import { D, MONO } from "@/deck/theme";
import type { SlideDef } from "@/deck/types";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A slide drawn small, view only: the same slide component, background and 1920×1080 stage the audience sees,
 * scaled to the box (16:9, nothing cropped). It never takes clicks or focus.
 */
function SlidePreview({ slide, step, epoch = 0 }: { slide: SlideDef; step: number; epoch?: number }) {
  const Comp = slide.Component;
  // the audience screen carries the sound: a slide's video plays here silently (play/loadstart do not bubble, so capture)
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mute = (e: Event) => {
      if (e.target instanceof HTMLMediaElement) e.target.muted = true;
    };
    el.addEventListener("loadstart", mute, true);
    el.addEventListener("play", mute, true);
    el.querySelectorAll("video, audio").forEach((m) => ((m as HTMLMediaElement).muted = true));
    return () => {
      el.removeEventListener("loadstart", mute, true);
      el.removeEventListener("play", mute, true);
    };
  }, []);
  return (
    <div ref={root} className="pointer-events-none relative aspect-video w-full select-none overflow-hidden rounded-xl" style={{ background: D.ink, border: "1px solid rgba(255,255,255,.12)" }} aria-hidden inert>
      <DeckBackground level={typeof slide.bg === "function" ? slide.bg(step) : slide.bg} />
      <Stage background="transparent">
        <div key={`${slide.id}-${epoch}`} className="absolute inset-0">
          <Comp step={step} dev={false} />
        </div>
      </Stage>
    </div>
  );
}

/**
 * The presenter's window: open it on the laptop screen while the deck runs on the projector (same browser).
 * It follows the deck: the current slide at the step the audience sees (right) and the next slide from its first
 * step (left), and it can drive the deck. The speaker notes and references stay in the project (content/notes.ts,
 * content/refs.ts) but are not shown here (owner, 2026-11-25).
 */
export function NotesWindow() {
  const [state, setState] = useState<{ index: number; step: number; epoch: number } | null>(null);
  const ch = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel(CHANNEL);
    ch.current = c;
    c.onmessage = (e: MessageEvent<DeckMessage>) => {
      if (e.data.type === "state") setState({ index: e.data.index, step: e.data.step, epoch: e.data.epoch ?? 0 });
    };
    c.postMessage({ type: "hello" } satisfies DeckMessage);
    return () => c.close();
  }, []);

  const send = (m: DeckMessage) => ch.current?.postMessage(m);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowDown", " ", "PageDown"].includes(e.key)) (e.preventDefault(), send({ type: "cmd", cmd: e.shiftKey ? "nextSlide" : "next" }));
      else if (["ArrowRight", "ArrowUp", "PageUp"].includes(e.key)) (e.preventDefault(), send({ type: "cmd", cmd: e.shiftKey ? "prevSlide" : "prev" }));
      else if (e.key === "r" || e.key === "R") send({ type: "cmd", cmd: "replay" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!state)
    return (
      <main className="flex min-h-screen items-center justify-center p-10 text-center text-[18px]" style={{ background: D.ink, color: D.dim }}>
        افتح العرض على /deck في نفس المتصفح، وستظهر المعاينة هنا.
      </main>
    );

  const slide = SLIDES[state.index];
  const next = SLIDES[state.index + 1];
  const btn = "rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[16px] font-bold text-[#e8eef6] hover:bg-white/15";
  const label = "mb-3 flex items-baseline gap-3 text-[16px] font-bold";
  return (
    <main className="min-h-screen p-8" style={{ background: D.ink, color: D.text }}>
      <header className="mb-6 flex items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="text-[44px] font-black tabular-nums" style={{ color: D.agent, fontFamily: MONO }}>
            {pad(slide.no)}
          </span>
          <h1 className="m-0 text-[30px] font-black">{slide.title}</h1>
        </div>
        <div className="flex gap-2">
          <button className={btn} onClick={() => send({ type: "cmd", cmd: "prev" })}>
            رجوع
          </button>
          <button className={btn} onClick={() => send({ type: "cmd", cmd: "replay" })}>
            إعادة السلايد
          </button>
          <button className={btn} style={{ background: D.agent, color: D.agentInk, borderColor: D.agent }} onClick={() => send({ type: "cmd", cmd: "next" })}>
            التالي
          </button>
        </div>
      </header>

      {/* right: the current slide, large; left: the next one, a little smaller (the page is RTL, so the first column is the right one) */}
      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-8">
        <section data-preview="current" className="min-w-0">
          <h2 className={label} style={{ color: D.dim }}>
            <span style={{ color: D.agent }}>السلايد الحالي</span>
            <span className="tabular-nums" style={{ fontFamily: MONO }}>{pad(slide.no)}</span>
            <span>{slide.title}</span>
            <span className="ms-auto tabular-nums" style={{ fontFamily: MONO }}>
              <bdi dir="ltr">{`${state.step + 1} / ${Math.max(1, slide.steps.length)}`}</bdi>
            </span>
          </h2>
          <SlidePreview slide={slide} step={state.step} epoch={state.epoch} />
          <div className="mt-5">
            <StepList slide={slide} step={state.step} />
          </div>
        </section>
        {next && (
          <section data-preview="next" className="min-w-0">
            <h2 className={label} style={{ color: D.dim }}>
              <span style={{ color: D.sky }}>السلايد التالي</span>
              <span className="tabular-nums" style={{ fontFamily: MONO }}>{pad(next.no)}</span>
              <span>{next.title}</span>
            </h2>
            <SlidePreview key={next.id} slide={next} step={0} />
          </section>
        )}
      </div>
    </main>
  );
}
