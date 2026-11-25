import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { Backdrop } from "../background/Backdrop";
import { Wamda } from "../character/Wamda";
import { Brand, CoverByline, CoverTitle } from "./CoverContent";
import { labLayouts } from "./lab/LabLayouts";
import { studioLayouts } from "./studio/StudioLayouts";
import { Sketch } from "./Sketch";
import type { OriginalThemeId, ThemeId } from "./themes";

const originalLayouts: Record<OriginalThemeId, ReactNode> = {
  minimal: (
    <>
      <div className="minimal-axis"><Sketch mark="spark" /></div>
      <div className="cover-copy"><CoverTitle /><Sketch mark="underline" /><CoverByline /></div>
      <Wamda />
    </>
  ),
  sketch: (
    <>
      <div className="sketch-sheet">
        <div className="sheet-tape" />
        <CoverTitle />
        <Sketch mark="underline" />
        <CoverByline />
      </div>
      <div className="sketch-field"><Sketch mark="orbit" /><Sketch mark="arrow" className="sketch-arrow" /><Wamda pose="look" /></div>
    </>
  ),
  editorial: (
    <>
      <div className="editorial-rules"><span /><span /></div>
      <CoverTitle />
      <figure className="editorial-portrait"><Wamda /><Sketch mark="bracket" /></figure>
      <CoverByline />
    </>
  ),
  cinema: (
    <>
      <div className="cinema-matte" />
      <div className="cinema-frame"><i /><i /><i /><i /></div>
      <div className="cinema-light"><Sketch mark="sweep" /><Wamda /></div>
      <div className="cover-copy"><CoverTitle /><CoverByline /></div>
    </>
  ),
  grid: (
    <>
      <div className="grid-title"><CoverTitle /></div>
      <div className="grid-figure"><Wamda pose="dash" /><Sketch mark="orbit" /></div>
      <div className="grid-byline"><CoverByline /></div>
      <div className="grid-symbol"><Sketch mark="spark" /></div>
    </>
  ),
  kinetic: (
    <>
      <div className="kinetic-ribbons"><i /><i /><i /></div>
      <div className="kinetic-type"><CoverTitle /><Sketch mark="sweep" /></div>
      <div className="kinetic-foot"><CoverByline /><Wamda pose="dash" /></div>
    </>
  ),
  lab: (
    <>
      <div className="lab-copy"><CoverTitle /><CoverByline /></div>
      <figure className="lab-display">
        <div className="lab-reticle"><i /><i /><i /></div>
        <Wamda />
        <Sketch mark="bracket" />
        <div className="lab-scan" />
        <div className="lab-bars"><i /><i /><i /><i /><i /><i /><i /></div>
      </figure>
      <div className="lab-baseline" />
    </>
  ),
  hybrid: (
    <>
      <div className="code-window">
        <div className="code-chrome" dir="ltr"><i /><i /><i /><code>cover.tsx</code></div>
        <div className="code-content">
          <code className="code-tag" dir="ltr" aria-hidden="true">{"<Cover>"}</code>
          <CoverTitle />
          <CoverByline />
          <code className="code-tag" dir="ltr" aria-hidden="true">{"</Cover>"}</code>
        </div>
      </div>
      <div className="hybrid-field"><Sketch mark="arrow" /><Wamda pose="look" /><Sketch mark="orbit" /></div>
    </>
  ),
  story: (
    <>
      <div className="story-spread">
        <div className="story-panel"><Wamda pose="look" /><Sketch mark="spark" /></div>
        <div className="story-page"><CoverTitle /><Sketch mark="underline" /><CoverByline /></div>
      </div>
      <div className="story-trail" aria-hidden="true"><i /><i /><i /></div>
    </>
  ),
  bold: (
    <>
      <div className="bold-stripe" />
      <div className="bold-stamp"><Sketch mark="spark" /><Wamda /></div>
      <CoverTitle />
      <CoverByline />
      <Sketch mark="underline" className="bold-ink" />
    </>
  ),
};

const layouts = { ...originalLayouts, ...labLayouts, ...studioLayouts };

function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  const lens = event.currentTarget.classList.contains("cover--studio-lens");
  event.currentTarget.style.setProperty("--pointer-x", `${x * (lens ? 13 : 3)}cqw`);
  event.currentTarget.style.setProperty("--pointer-y", `${y * (lens ? 8 : 3)}cqw`);
}

type CoverProps = {
  theme: ThemeId;
  step?: number;
  live?: boolean;
  animate?: boolean;
  replay?: number;
};

export function Cover({ theme, step = 0, live = false, animate = false, replay = 0 }: CoverProps) {
  const isStudio = theme.startsWith("studio-");
  const usesAscii = !isStudio || theme === "studio-horizon" || theme === "studio-lens";
  const track = (theme === "kinetic" || theme === "studio-lens") && live;
  return (
    <div
      className={`cover cover--${theme}${isStudio ? " cover--studio" : ""}`}
      data-step={step}
      data-animate={animate}
      style={{ "--pointer-x": "0cqw", "--pointer-y": "0cqw" } as CSSProperties}
      onPointerMove={track ? trackPointer : undefined}
      onPointerLeave={track ? (event) => {
        event.currentTarget.style.setProperty("--pointer-x", "0cqw");
        event.currentTarget.style.setProperty("--pointer-y", "0cqw");
      } : undefined}
    >
      {usesAscii && <Backdrop live={live} />}
      <div className="cover-veil" />
      <div className="cover-art" key={replay}>
        <Brand className="cover-brand" />
        {layouts[theme]}
      </div>
    </div>
  );
}
