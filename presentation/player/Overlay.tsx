"use client";

import {
  ArrowLeft, ArrowRight, Check, Maximize, Minimize, Play, RotateCcw, X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cover } from "../covers/Cover";
import { type Theme, type ThemeId } from "../covers/themes";
import { navigate, type PlayerCommand } from "./navigation";

function Dialog({ children, onClose, label, className = "", dialogRef }: {
  children: ReactNode;
  label: string;
  className?: string;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-start-focus]")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [dialogRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      className={`viewer ${className}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <div className="viewer-inner">{children}</div>
    </dialog>
  );
}

export function Preview({ index, themes, adopted, onAdopt, onClose }: {
  index: number;
  themes: readonly Theme[];
  adopted: ThemeId | null;
  onAdopt: (id: ThemeId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [position, setPosition] = useState({ index, step: 0, replay: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stageOnly, setStageOnly] = useState(false);
  const theme = themes[position.index];

  function move(command: PlayerCommand) {
    setPosition((current) => navigate(current, command, themes));
  }

  useEffect(() => {
    function onKeys(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      const commands: Record<string, PlayerCommand> = {
        ArrowLeft: "next", ArrowRight: "previous", ArrowDown: "forward",
        ArrowUp: "back", PageDown: "forward", PageUp: "back", " ": "forward", Enter: "forward",
      };
      const command = commands[event.key];
      if (!command || (event.target instanceof HTMLButtonElement && (event.key === "Enter" || event.key === " "))) return;
      event.preventDefault();
      setPosition((current) => navigate(current, command, themes));
    }
    function onFullscreen() {
      const active = document.fullscreenElement === dialog.current?.firstElementChild;
      setIsFullscreen(active);
      if (!active) setStageOnly(false);
    }
    window.addEventListener("keydown", onKeys);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("keydown", onKeys);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [themes]);

  async function fullscreen() {
    if (isFullscreen) {
      await document.exitFullscreen();
      return;
    }
    if (stageOnly) {
      setStageOnly(false);
      return;
    }
    setStageOnly(true);
    try {
      await dialog.current?.firstElementChild?.requestFullscreen?.();
    } catch {
      // The stage still fills the browser viewport if native fullscreen is unavailable.
    }
  }

  return (
    <Dialog dialogRef={dialog} label="معاينة الغلاف" onClose={onClose} className={stageOnly ? "viewer--stage-only" : ""}>
      <header className="viewer-header">
        <div><strong>{theme.name}</strong><span lang="en" dir="ltr">{theme.english}</span></div>
        <div className="viewer-tools">
          <button type="button" className="icon-button" aria-label="إعادة الحركة" title="إعادة الحركة" onClick={() => move("replay")}><RotateCcw /></button>
          <button type="button" className="icon-button" aria-label={stageOnly ? "خروج من ملء الشاشة" : "ملء الشاشة"} title={stageOnly ? "خروج من ملء الشاشة" : "ملء الشاشة"} onClick={fullscreen}>
            {stageOnly ? <Minimize /> : <Maximize />}
          </button>
          <button type="button" className="icon-button" aria-label="إغلاق المعاينة" title="إغلاق المعاينة" onClick={onClose}><X /></button>
        </div>
      </header>

      <div className="viewer-body">
        <div className="viewer-slide" tabIndex={0} onClick={() => move("forward")} data-start-focus>
          <Cover key={theme.id} theme={theme.id} live animate step={position.step} replay={position.replay} />
        </div>
      </div>

      <footer className="viewer-footer">
        <div className="viewer-navigation">
          <button type="button" className="icon-button" aria-label="الثيم السابق" title="الثيم السابق" onClick={() => move("previous")}><ArrowRight /></button>
          <span className="viewer-count" dir="ltr">{String(position.index + 1).padStart(2, "0")} / {themes.length}</span>
          <button type="button" className="icon-button" aria-label="الثيم التالي" title="الثيم التالي" onClick={() => move("next")}><ArrowLeft /></button>
        </div>
        <button type="button" className="step-button" aria-label="الخطوة التالية" title="زر المسافة أو النقر على الغلاف" onClick={() => move("forward")}>
          <Play size={14} /> <span>الخطوة التالية</span>
          <b dir="ltr" aria-live="polite">{position.step + 1}/{theme.steps}</b>
        </button>
        <button type="button" className={adopted === theme.id ? "button button--selected" : "button button--primary"} onClick={() => onAdopt(theme.id)} disabled={adopted === theme.id}>
          <Check size={17} /> {adopted === theme.id ? "الثيم المعتمد" : "اعتماد الثيم"}
        </button>
      </footer>
    </Dialog>
  );
}

export function Comparison({ pair, adopted, onAdopt, onClose }: {
  pair: [Theme, Theme];
  adopted: ThemeId | null;
  onAdopt: (id: ThemeId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [replay, setReplay] = useState(0);

  return (
    <Dialog dialogRef={dialog} label="مقارنة الثيمات" onClose={onClose} className="viewer--compare">
      <header className="viewer-header">
        <div><strong>مقارنة الثيمات</strong></div>
        <div className="viewer-tools">
          <button type="button" className="button button--muted" onClick={() => setReplay((current) => current + 1)}><RotateCcw size={16} /> إعادة الحركتين</button>
          <button type="button" className="icon-button" aria-label="إغلاق المقارنة" title="إغلاق المقارنة" onClick={onClose}><X /></button>
        </div>
      </header>
      <div className="comparison-grid">
        {pair.map((theme) => (
          <section className="comparison-item" key={theme.id}>
            <Cover theme={theme.id} animate replay={replay} />
            <div>
              <h2>{theme.name}</h2>
              <button
                type="button"
                className={adopted === theme.id ? "button button--selected" : "button button--primary"}
                disabled={adopted === theme.id}
                onClick={() => onAdopt(theme.id)}
              >
                <Check size={17} /> {adopted === theme.id ? "الثيم المعتمد" : "اعتماد الثيم"}
              </button>
            </div>
          </section>
        ))}
      </div>
    </Dialog>
  );
}
