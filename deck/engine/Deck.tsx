"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, FullScreenIcon, GridViewIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Stage } from "@/components/stage/Stage";
import { DeckBackground } from "./DeckBackground";
import { deckReducer, initDeck } from "./state";
import { D, MONO } from "../theme";
import { Icon } from "../kit/ui";
import { CURSOR_CSS } from "../kit/CursorArrow";
import type { SlideDef } from "../types";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The presenter's real mouse inside the slides: the deck's Figma-style arrow (public/deck/cursor.svg), hotspot on
 * its tip, the normal arrow as fallback. Links, buttons and text fields keep their usual cursors. When the mouse
 * rests, it hides with the controls. Kept here (not in globals.css) so it only ever applies to the deck.
 */
const STAGE_CURSOR = `
.deck-stage { cursor: ${CURSOR_CSS}; }
.deck-stage :is(a[href], button:not(:disabled), [role="button"], summary, select, label[for]) { cursor: pointer; }
.deck-stage :is(textarea, [contenteditable="true"], input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"])) { cursor: text; }
[data-idle="true"] .deck-stage, [data-idle="true"] .deck-stage * { cursor: none !important; }
`;

/** A horizontal finger swipe this long (px) turns a step on touch screens. */
const SWIPE = 50;

function readHash(slides: readonly SlideDef[]) {
  const n = parseInt(window.location.hash.replace("#", ""), 10);
  const i = slides.findIndex((s) => s.no === n);
  return i >= 0 ? i : 0;
}

/**
 * The presenter. One 16:9 stage, one shared background, the current slide on top.
 * Keys (RTL): ← / ↓ / Space / Enter / PageDown = next · → / ↑ / PageUp = back ·
 * Shift + arrows = whole slide · Home / End · digits then Enter = go to slide ·
 * R replay slide · F fullscreen · O overview · Esc close.
 * Mouse: click = next · right-click or Shift+click = back. Touch: tap = next · swipe left = next, right = back.
 * Public build (main): no presenter window, notes or development view; those live on the dev branch.
 */
export function Deck({ slides }: { slides: readonly SlideDef[] }) {
  const [state, dispatch] = useReducer(deckReducer(slides), slides, (s) => initDeck(s));
  const [ready, setReady] = useState(false);
  const [overview, setOverview] = useState(false);
  const [chrome, setChrome] = useState(true);
  const hideTimer = useRef(0);
  const overChrome = useRef(false);
  const digits = useRef("");
  const touch = useRef<{ x: number; y: number } | null>(null);

  const slide = slides[state.index];
  const step = state.steps[state.index] ?? 0;
  const total = Math.max(1, slide.steps.length);

  // first paint: the slide in the URL (#05)
  useEffect(() => {
    dispatch({ type: "goto", index: readHash(slides) });
    setReady(true);
    const onHash = () => dispatch({ type: "goto", index: readHash(slides) });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [slides]);

  useEffect(() => {
    if (!ready) return;
    const h = `#${pad(slide.no)}`;
    if (window.location.hash !== h) window.history.replaceState(null, "", h);
  }, [ready, slide.no]);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) {
        digits.current = (digits.current + k).slice(-2);
        return;
      }
      const nextKeys = ["ArrowLeft", "ArrowDown", " ", "Enter", "PageDown"];
      const prevKeys = ["ArrowRight", "ArrowUp", "PageUp", "Backspace"];
      if (k === "Enter" && digits.current) {
        e.preventDefault();
        const n = parseInt(digits.current, 10);
        digits.current = "";
        const i = slides.findIndex((s) => s.no === n);
        if (i >= 0) dispatch({ type: "goto", index: i });
        return;
      }
      digits.current = "";
      if (nextKeys.includes(k)) {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "nextSlide" : "next" });
      } else if (prevKeys.includes(k)) {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "prevSlide" : "prev" });
      } else if (k === "Home") dispatch({ type: "goto", index: 0 });
      else if (k === "End") dispatch({ type: "goto", index: slides.length - 1 });
      else if (k === "r" || k === "R") dispatch({ type: "replay" });
      else if (k === "f" || k === "F") toggleFull();
      else if (k === "o" || k === "O" || k === "g" || k === "G") setOverview((v) => !v);
      else if (k === "Escape") setOverview(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides, toggleFull]);

  // controls appear when the mouse moves and fade after a short rest; so does the cursor
  const wake = useCallback(() => {
    setChrome(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!overChrome.current) setChrome(false);
    }, 2600);
  }, []);
  useEffect(() => {
    wake();
    return () => window.clearTimeout(hideTimer.current);
  }, [wake]);

  const onStageClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select, [data-interactive]")) return;
    dispatch({ type: e.shiftKey ? "prev" : "next" });
  };
  const onStageMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "prev" });
  };
  // touch: a mostly horizontal swipe steps (RTL, like the arrow keys: finger to the left = next); a tap stays a click
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    e.preventDefault(); // no synthetic click after a swipe
    wake();
    dispatch({ type: dx < 0 ? "next" : "prev" });
  };

  if (!ready) return <div className="fixed inset-0" style={{ background: D.ink }} />;

  const Comp = slide.Component;
  return (
    <div className="fixed inset-0 flex select-none items-center justify-center overflow-hidden" style={{ background: "#000", cursor: chrome ? "default" : "none" }} data-idle={!chrome} onMouseMove={wake}>
      <style>{STAGE_CURSOR}</style>
      <div className="relative" style={{ width: "min(100vw, calc(100vh * 16 / 9))" }}>
        <div className="deck-stage relative aspect-video w-full overflow-hidden" onClick={onStageClick} onContextMenu={onStageMenu} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <DeckBackground level={typeof slide.bg === "function" ? slide.bg(step) : slide.bg} />
          <Stage background="transparent">
            <AnimatePresence initial={false}>
              <motion.div
                key={`${slide.id}-${state.epochs[state.index]}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Comp step={step} dev={false} />
              </motion.div>
            </AnimatePresence>
          </Stage>
        </div>
      </div>

      <Toolbar
        visible={chrome || overview}
        onEnter={() => (overChrome.current = true)}
        onLeave={() => (overChrome.current = false)}
        slide={slide}
        step={step}
        total={total}
        dispatch={dispatch}
        onOverview={() => setOverview((v) => !v)}
        onFull={toggleFull}
      />

      {overview && (
        <Overview
          slides={slides}
          current={state.index}
          steps={state.steps}
          onPick={(i) => {
            dispatch({ type: "goto", index: i });
            setOverview(false);
          }}
          onClose={() => setOverview(false)}
        />
      )}
    </div>
  );
}

// ---------- chrome ----------

const btn =
  "flex h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full px-3 text-[15px] font-medium text-[#e8eef6] transition-colors hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a5d8ff] disabled:opacity-30";

/** Where the navigation group sits on the screen, in both states (owner's spec, 2026-11-24: right 32px, bottom 64px).
 *  Phones get a tighter corner so the bar fits a narrow screen. */
const BAR_POS = "right-3 bottom-4 sm:right-8 sm:bottom-16";

/**
 * The presenter's controls. At rest only the navigation group shows: previous, the slide's number and title with a
 * small down caret (there is more), next. It is pinned to the bottom-right of the screen and never moves. While the
 * pointer is anywhere on the bar (or focus is inside it), the bar grows to the left and the rest unfolds there in the
 * original order: the step dots, then the tools from replay to full screen. Leaving the whole bar folds it back.
 */
function Toolbar(p: {
  visible: boolean;
  onEnter: () => void;
  onLeave: () => void;
  slide: SlideDef;
  step: number;
  total: number;
  dispatch: (a: { type: "next" | "prev" | "nextSlide" | "prevSlide" | "replay" }) => void;
  onOverview: () => void;
  onFull: () => void;
}) {
  const hold = (e: React.MouseEvent) => e.preventDefault(); // buttons never take focus, so Space keeps driving the deck
  const [open, setOpen] = useState(false);
  const pointerIn = useRef(false);
  return (
    <div
      className={`fixed z-50 flex items-center rounded-full border border-white/10 bg-[#0a1018]/90 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.5)] ${BAR_POS}`}
      style={{ opacity: p.visible ? 1 : 0, transform: `translateY(${p.visible ? 0 : 16}px)`, transition: "opacity .35s, transform .35s", pointerEvents: p.visible ? "auto" : "none" }}
      onMouseEnter={() => {
        pointerIn.current = true;
        setOpen(true);
        p.onEnter();
      }}
      onMouseLeave={(e) => {
        pointerIn.current = false;
        if (!e.currentTarget.matches(":focus-within")) setOpen(false);
        p.onLeave();
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!pointerIn.current && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      dir="rtl"
    >
      {/* navigation: the anchor (right end of the bar) */}
      <div className="flex items-center gap-1">
        <button className={btn} onMouseDown={hold} onClick={() => p.dispatch({ type: "prevSlide" })} aria-label="السلايد السابق" title="السلايد السابق (Shift + →)">
          <Icon icon={ArrowRight01Icon} size={22} />
        </button>
        <div className="flex items-center gap-3 px-2">
          <span className="text-[15px] font-bold tabular-nums text-[#a5d8ff]" style={{ fontFamily: MONO }}>
            {pad(p.slide.no)}
          </span>
          <span className="max-w-[110px] truncate sm:max-w-[260px] text-[15px] text-[#e8eef6]">{p.slide.title}</span>
          <Icon icon={ArrowDown01Icon} size={14} color="rgba(232,238,246,.55)" stroke={2} />
        </div>
        <button className={btn} onMouseDown={hold} onClick={() => p.dispatch({ type: "nextSlide" })} aria-label="السلايد التالي" title="السلايد التالي (Shift + ←)">
          <Icon icon={ArrowLeft01Icon} size={22} />
        </button>
      </div>

      {/* everything else, to the left of the navigation, folded to zero width at rest */}
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ width: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex w-max items-center gap-1 ps-1">
          {p.total > 1 && (
            <span className="flex items-center gap-[5px] px-2" aria-label={`المرحلة ${p.step + 1} من ${p.total}`}>
              {Array.from({ length: p.total }, (_, i) => (
                <span key={i} className="h-[7px] rounded-full transition-all duration-300" style={{ width: i === p.step ? 20 : 7, background: i <= p.step ? D.agent : "rgba(165,216,255,.25)" }} />
              ))}
            </span>
          )}
          <span className="mx-1 h-6 w-px bg-white/10" />
          <button className={btn} onMouseDown={hold} onClick={() => p.dispatch({ type: "replay" })} aria-label="إعادة تشغيل السلايد" title="إعادة تشغيل السلايد (R)">
            <Icon icon={RefreshIcon} size={20} />
          </button>
          <button className={btn} onMouseDown={hold} onClick={p.onOverview} aria-label="كل السلايدات" title="كل السلايدات (O)">
            <Icon icon={GridViewIcon} size={20} />
          </button>
          <button className={btn} onMouseDown={hold} onClick={p.onFull} aria-label="ملء الشاشة" title="ملء الشاشة (F)">
            <Icon icon={FullScreenIcon} size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Overview({ slides, current, steps, onPick, onClose }: { slides: readonly SlideDef[]; current: number; steps: number[]; onPick: (i: number) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 sm:items-center sm:p-10" onClick={onClose} dir="rtl">
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" onClick={(e) => e.stopPropagation()}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onPick(i)}
            className="flex items-center gap-4 rounded-2xl border px-5 py-4 text-right transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a5d8ff]"
            style={{ borderColor: i === current ? D.agent : "rgba(255,255,255,.1)", background: i === current ? "rgba(255,122,0,.1)" : "#0a1018" }}
          >
            <span className="text-[26px] font-black tabular-nums" style={{ fontFamily: MONO, color: i === current ? D.agent : D.sky }}>
              {pad(s.no)}
            </span>
            <span className="flex flex-1 flex-col gap-1">
              <span className="text-[16px] font-bold text-[#e8eef6]">{s.title}</span>
              <span className="text-[13px] text-[#8093a6]">
                {s.steps.length > 1 ? <bdi dir="ltr">{`${steps[i] + 1} / ${s.steps.length}`}</bdi> : "ثابت"}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
