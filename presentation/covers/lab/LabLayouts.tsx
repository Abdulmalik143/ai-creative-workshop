import type { CSSProperties, ReactNode } from "react";
import { Wamda } from "../../character/Wamda";
import { CoverByline, CoverTitle } from "../CoverContent";
import { Sketch } from "../Sketch";
import type { LabThemeId } from "../themes";

function LabCopy() {
  return <div className="instrument-copy"><CoverTitle /><CoverByline /></div>;
}

function SignalTrace() {
  return (
    <svg className="signal-trace" viewBox="0 0 420 300" fill="none" preserveAspectRatio="none">
      <path className="signal-axis" d="M0 150h420M210 0v300" />
      <path className="signal-echo" d="M-40 160C15 180 31 209 79 176S127 113 165 131s39 74 89 65 69-82 110-70 48 45 96 34" />
      <path className="signal-main" pathLength="1" d="M-40 144h72l22-28 24 66 31-105 30 143 28-85 27 9h25l32-49 37 103 35-139 40 100 27-15h70" />
      <circle cx="323" cy="59" r="7" />
    </svg>
  );
}

function Reticle() {
  return <div className="instrument-reticle"><i /><i /><i /><i /></div>;
}

function OpticalAssembly() {
  return (
    <div className="optical-assembly">
      <div className="optical-axis" />
      <div className="optical-rings"><i /><i /><i /></div>
      <div className="optical-index" />
    </div>
  );
}

export function LabHeroGraphic() {
  return (
    <div className="lab-hero-graphic" aria-hidden="true">
      <div className="lab-hero-console">
        <Reticle />
        <OpticalAssembly />
        <SignalTrace />
        <Sketch mark="sweep" />
      </div>
    </div>
  );
}

const bars = [13, 21, 15, 34, 55, 32, 77, 91, 61, 84, 52, 44, 69, 100, 76, 34, 60, 92, 57, 75, 41, 31, 52, 21, 14];
const circuitNodes = [
  { x: 18, y: 15 },
  { x: 66, y: 31 },
  { x: 34, y: 62 },
  { x: 78, y: 84 },
];

export const labLayouts: Record<LabThemeId, ReactNode> = {
  "lab-signal": (
    <div className="instrument instrument--signal">
      <LabCopy />
      <div className="signal-screen instrument-surface instrument-grid" aria-hidden="true">
        <SignalTrace />
        <div className="signal-sweep" />
        <Sketch mark="bracket" />
        <div className="instrument-lamps"><i /><i /><i /></div>
      </div>
    </div>
  ),
  "lab-optics": (
    <div className="instrument instrument--optics">
      <div className="optics-frame" aria-hidden="true">
        <OpticalAssembly />
        <Reticle />
        <Sketch mark="orbit" />
      </div>
      <LabCopy />
    </div>
  ),
  "lab-network": (
    <div className="instrument instrument--network">
      <div className="network-board instrument-grid" aria-hidden="true">
        <svg className="network-routes" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          <path pathLength="1" d="M0 15H18L42 31H66L46 62H34L56 84H78L100 68M18 15V38L34 62V100M66 31V52L78 68V84" />
        </svg>
        {circuitNodes.map(({ x, y }) => (
          <span className="network-node" key={x} style={{ left: `${x}%`, top: `${y}%` }}><i /></span>
        ))}
        <Sketch mark="arrow" />
      </div>
      <div className="network-edge" aria-hidden="true" />
      <LabCopy />
    </div>
  ),
  "lab-spectrum": (
    <div className="instrument instrument--spectrum">
      <div className="spectrum-field" aria-hidden="true">
        <div className="spectrum-bars">
          {bars.map((height, index) => (
            <i key={index} style={{ "--bar-height": `${height}%`, "--bar-order": index } as CSSProperties} />
          ))}
        </div>
        <Sketch mark="sweep" />
      </div>
      <LabCopy />
    </div>
  ),
  "lab-terminal": (
    <div className="instrument instrument--terminal">
      <div className="terminal-canvas">
        <div className="terminal-chrome" aria-hidden="true"><i /><i /><i /><b /></div>
        <LabCopy />
        <Sketch mark="underline" />
      </div>
      <div className="terminal-stack" aria-hidden="true">
        <div className="terminal-module instrument-grid"><SignalTrace /></div>
        <div className="terminal-module terminal-module--meter"><i /><i /><i /><i /><i /></div>
        <div className="terminal-module terminal-module--cells"><i /><i /><i /><i /></div>
      </div>
    </div>
  ),
  "lab-calibration": (
    <div className="instrument instrument--calibration">
      <div className="calibration-blueprint" aria-hidden="true">
        <div className="calibration-guide calibration-guide--horizontal" />
        <div className="calibration-guide calibration-guide--vertical" />
        <div className="calibration-ruler calibration-ruler--top" />
        <div className="calibration-ruler calibration-ruler--left" />
        <div className="calibration-origin"><Reticle /></div>
        <Sketch mark="bracket" />
      </div>
      <LabCopy />
    </div>
  ),
  "lab-reactor": (
    <div className="instrument instrument--reactor">
      <div className="reactor-frame" aria-hidden="true">
        <svg className="reactor-vector" viewBox="0 0 320 320" fill="none">
          <polygon points="160,13 303,254 17,254" />
          <polygon points="160,49 271,240 49,240" />
          <polygon points="160,89 238,229 82,229" />
          <circle cx="160" cy="174" r="31" />
          <circle cx="160" cy="174" r="13" />
        </svg>
        <Sketch mark="orbit" />
      </div>
      <LabCopy />
    </div>
  ),
  "lab-scan": (
    <div className="instrument instrument--scan">
      <LabCopy />
      <div className="scan-screen instrument-grid" aria-hidden="true">
        <Reticle />
        <Wamda pose="idle" />
        <div className="scan-spine" />
        <div className="scan-beam" />
        <Sketch mark="bracket" />
      </div>
      <div className="scan-meter" aria-hidden="true"><i /><i /><i /></div>
    </div>
  ),
  "lab-capsule": (
    <div className="instrument instrument--capsule">
      <div className="capsule-structure" aria-hidden="true">
        <div className="capsule-ring" />
        <div className="capsule-glass"><Wamda pose="look" /></div>
        <div className="capsule-gates"><i /><i /></div>
        <Sketch mark="orbit" />
      </div>
      <LabCopy />
    </div>
  ),
  "lab-tracking": (
    <div className="instrument instrument--tracking">
      <div className="tracking-map instrument-grid" aria-hidden="true">
        <svg className="tracking-route" viewBox="0 0 900 240" preserveAspectRatio="none" fill="none">
          <path pathLength="1" d="M-20 221C84 188 119 97 235 128S421 193 549 126 723 17 920 45" />
          <path d="M-20 237C84 204 119 113 235 144S421 209 549 142 723 33 920 61" />
        </svg>
        <div className="tracking-target"><Reticle /><Wamda pose="dash" /></div>
        <Sketch mark="arrow" />
      </div>
      <LabCopy />
    </div>
  ),
};
