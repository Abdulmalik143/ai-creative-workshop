import type { CSSProperties, ReactNode } from "react";
import { CoverByline, CoverTitle } from "../CoverContent";
import { Sketch } from "../Sketch";
import type { StudioThemeId } from "../themes";

function StudioCopy({ className = "" }: { className?: string }) {
  return <div className={`studio-copy ${className}`}><CoverTitle /><CoverByline /></div>;
}

function Horizon() {
  return (
    <div className="studio-horizon-art" aria-hidden="true">
      <i className="horizon-sky" /><i className="horizon-dots" /><i className="horizon-edge" /><i className="horizon-pulse" />
    </div>
  );
}

export function StudioHeroGraphic() {
  return (
    <div className="studio-hero-graphic" aria-hidden="true">
      <div className="studio-hero-aperture"><i /><i /><i /></div>
      <Horizon />
      <Sketch mark="sweep" />
    </div>
  );
}

const waveform = [12, 20, 26, 14, 36, 56, 40, 71, 48, 93, 64, 43, 76, 98, 60, 30, 51, 67, 44, 28, 39, 25, 16, 11];
const collagePieces = ["violet", "paper", "blue", "amber", "mint", "ink"] as const;

export const studioLayouts: Record<StudioThemeId, ReactNode> = {
  "studio-horizon": (
    <>
      <Horizon />
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-handoff": (
    <>
      <div className="handoff-art" aria-hidden="true">
        <div className="handoff-panel handoff-panel--idea">
          <svg viewBox="0 0 150 120"><path d="M23 76C35 29 92 15 119 46c32 41-50 61-75 39-27-24 9-60 41-60 39 0 46 40 22 64" /></svg>
        </div>
        <div className="handoff-panel handoff-panel--made"><i /><i /><i /></div>
        <div className="handoff-link"><i /></div>
      </div>
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-orbit": (
    <>
      <div className="orbit-art" aria-hidden="true">
        <div className="orbit-loop"><i /></div><div className="orbit-loop"><i /></div><div className="orbit-loop"><i /></div>
        <div className="orbit-core"><i /><i /><i /></div>
      </div>
      <StudioCopy />
    </>
  ),
  "studio-draft": (
    <>
      <div className="draft-board" aria-hidden="true">
        <svg viewBox="0 0 320 320">
          <path className="draft-free" d="M32 227C18 181 101 66 151 59c45-11 140 88 140 126 1 42-75 13-109 47-57 54-148 49-136-22 11-65 63-153 146-143" pathLength="1" />
          <g className="draft-clean">
            <path d="M55 204Q55 160 90 118L167 65 262 151Q290 195 244 217L156 254 80 241Q56 237 55 204Z" />
            <path d="M28 204H286M167 35V278" className="draft-guides" />
            <circle cx="55" cy="204" r="5" /><circle cx="167" cy="65" r="5" /><circle cx="262" cy="151" r="5" /><circle cx="156" cy="254" r="5" />
          </g>
        </svg>
        <Sketch mark="spark" />
      </div>
      <StudioCopy />
    </>
  ),
  "studio-decision": (
    <>
      <div className="decision-art" aria-hidden="true">
        <svg viewBox="0 0 900 230" preserveAspectRatio="none">
          <path d="M875 111H632Q556 111 505 26H193M632 111H505Q451 111 407 61H91M632 111H47M632 111H510Q458 111 402 165H154M632 111Q562 111 499 210H230" />
          <path className="decision-picked" pathLength="1" d="M875 111H632Q562 111 499 210H230" />
          <circle cx="875" cy="111" r="6" /><circle cx="632" cy="111" r="5" />
          <circle className="decision-end" cx="230" cy="210" r="7" />
        </svg>
      </div>
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-prism": (
    <>
      <div className="prism-art" aria-hidden="true">
        <div className="prism-beam" />
        <div className="prism-glass"><i /></div>
        <svg viewBox="0 0 500 360" preserveAspectRatio="none">
          <path className="prism-line prism-line--sound" pathLength="1" d="M255 181 211 114H132l-9 10-12-21-14 29-13-29-12 25-8-12H16" />
          <path className="prism-line prism-line--image" pathLength="1" d="M255 181H116v-22H31v46h85v-24M58 159v46M86 159v46M31 182h85" />
          <path className="prism-line prism-line--motion" pathLength="1" d="M255 181 205 248H136l-20 16H63l-20-11H16m116 12-20 15H59l-20-11H12" />
        </svg>
      </div>
      <StudioCopy />
    </>
  ),
  "studio-print": (
    <>
      <div className="print-sheet" aria-hidden="true">
        <div className="print-ink print-ink--one" /><div className="print-ink print-ink--two" /><div className="print-ink print-ink--three" />
        <div className="print-bar" />
      </div>
      <StudioCopy />
    </>
  ),
  "studio-assembly": (
    <>
      <div className="assembly-art" aria-hidden="true">
        <div className="assembly-rail"><i /></div>
        <div className="assembly-station assembly-station--raw"><i /><i /><i /></div>
        <div className="assembly-station assembly-station--draft"><i /><i /><i /></div>
        <div className="assembly-station assembly-station--finish"><i /><i /><i /></div>
      </div>
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-edit": (
    <>
      <div className="edit-art" aria-hidden="true">
        <div className="edit-ruler" />
        <div className="edit-tracks">
          <div className="edit-track"><i /><i /><i /></div>
          <div className="edit-track"><i /><i /></div>
          <div className="edit-track"><i /><i /><i /></div>
        </div>
        <div className="edit-playhead" />
        <div className="edit-preview"><i /><i /><i /></div>
      </div>
      <StudioCopy />
    </>
  ),
  "studio-collage": (
    <>
      <div className="collage-art" aria-hidden="true">
        <div className="collage-sheet" />
        {collagePieces.map((piece) => <i key={piece} className={`collage-piece collage-piece--${piece}`} />)}
        <Sketch mark="underline" />
      </div>
      <StudioCopy />
    </>
  ),
  "studio-lens": (
    <>
      <div className="lens-field" aria-hidden="true"><i /><i /><i /></div>
      <div className="lens-rim" aria-hidden="true"><i /></div>
      <StudioCopy />
    </>
  ),
  "studio-wave": (
    <>
      <div className="wave-art" aria-hidden="true">
        <svg className="wave-terrain" viewBox="0 0 900 260" preserveAspectRatio="none">
          <path d="M0 194 54 171 102 192 180 121 231 153 310 91 363 121 420 56 462 90 509 40 563 93 619 70 674 115 741 99 828 166 900 147" />
          <path d="M0 211 54 194 102 205 180 151 231 175 310 134 363 149 420 104 462 125 509 88 563 132 619 105 674 154 741 130 828 182 900 167" />
          <path d="M0 230 54 213 102 219 180 181 231 204 310 169 363 177 420 144 462 165 509 131 563 172 619 150 674 182 741 165 828 212 900 195" />
        </svg>
        <div className="wave-amplitude">{waveform.map((height, index) => <i key={index} style={{ "--height": height + "%", "--i": index } as CSSProperties} />)}</div>
      </div>
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-frame": (
    <>
      <div className="frame-film" aria-hidden="true"><i /><i /><i /></div>
      <div className="frame-guides" aria-hidden="true"><i /><i /><i /><i /></div>
      <StudioCopy className="studio-copy--center" />
    </>
  ),
  "studio-layers": (
    <>
      <div className="layers-art" aria-hidden="true">
        <div className="layers-plate layers-plate--texture"><i /></div>
        <div className="layers-plate layers-plate--color"><i /></div>
        <div className="layers-plate layers-plate--form"><i /></div>
      </div>
      <StudioCopy />
    </>
  ),
  "studio-point": (
    <>
      <div className="point-art" aria-hidden="true">
        <svg viewBox="0 0 300 280">
          <path className="point-trace" pathLength="1" d="M42 225 91 87 220 42 266 186 145 234 91 87M145 234 220 42" />
          <circle cx="42" cy="225" r="5" /><circle cx="220" cy="42" r="3" /><circle cx="266" cy="186" r="3" />
        </svg>
      </div>
      <StudioCopy />
    </>
  ),
};
