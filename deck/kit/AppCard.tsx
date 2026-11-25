"use client";

import type { ReactNode } from "react";
import type { Resource } from "../content/resources";
import { D } from "../theme";
import { CURSOR_CSS } from "./CursorArrow";
import { KIND_COLOR, ResourceMark } from "./ResourceReference";

/** lg: three across (slide 19) · md: three across, two rows (slide 24) · col: three columns, the line may wrap, with a prompt under it (slide 25) */
const SIZE = {
  lg: { radius: 34, logo: 196, name: 60, line: 30, gap: 46, nameGap: 18, wrap: false, top: 0 },
  md: { radius: 28, logo: 136, name: 46, line: 28, gap: 26, nameGap: 14, wrap: false, top: 0 },
  /** top-aligned (`top` = padding), so logos and names line up across cards whose prompts differ in length */
  col: { radius: 28, logo: 136, name: 46, line: 26, gap: 26, nameGap: 14, wrap: true, top: 46 },
} as const;

/**
 * Owner's exception to the no-links rule (slide 25): a link that shows nothing. The deck's own cursor stays, no
 * underline, no hover, no focus ring; it opens in a new tab. Clicks on it do not advance the deck (Deck.tsx skips `a`).
 */
function HiddenLink({ href, label, className = "", children }: { href: string; label: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`text-inherit no-underline outline-none ${className}`} style={{ cursor: CURSOR_CSS }}>
      {children}
    </a>
  );
}

/**
 * A tool on the deck's plain card (dark panel, thin border; amber border for a community tool, as on the other
 * resource cards): its logo large on the shared tile size, the name, one line under it. No URL on screen: this is
 * a presentation. `fit` = how much of the tile a mark logo takes (for logo files with wide padding).
 * `href` (slide 25 only) makes the logo and name a hidden link; `children` sit under the line (slide 25's prompt).
 */
export function AppCard({
  r,
  line,
  size = "lg",
  fit,
  href,
  children,
}: {
  r: Resource;
  line: string;
  size?: keyof typeof SIZE;
  fit?: number;
  href?: string;
  children?: ReactNode;
}) {
  const z = SIZE[size];
  const head = (
    <>
      <span className="flex-none" style={{ borderRadius: z.logo * 0.24, boxShadow: `0 0 0 1.5px ${D.line}, 0 26px 50px -22px rgba(0,0,0,.7)` }}>
        <ResourceMark r={r} size={z.logo} fit={fit} />
      </span>
      <span className="flex flex-col items-center" style={{ gap: z.nameGap }}>
        <span dir="ltr" className="whitespace-nowrap font-black leading-none" style={{ fontSize: z.name, color: D.paper }}>
          {r.name}
        </span>
        <span className={`${z.wrap ? "" : "whitespace-nowrap "}font-bold leading-[1.35]`} style={{ fontSize: z.line, color: KIND_COLOR[r.kind], textWrap: z.wrap ? "balance" : undefined }}>
          {line}
        </span>
      </span>
    </>
  );
  return (
    <div
      data-resource={r.id}
      className={`flex h-full w-full flex-col items-center ${z.top ? "justify-start" : "justify-center"} px-[28px] text-center`}
      style={{
        gap: z.gap,
        paddingTop: z.top || undefined,
        borderRadius: z.radius,
        background: D.panel,
        border: `2px solid ${r.kind === "community" ? `${KIND_COLOR.community}66` : D.lineStrong}`,
        boxShadow: "0 30px 60px -30px rgba(0,0,0,.7)",
      }}
    >
      {href ? (
        <HiddenLink href={href} label={r.name} className="block">
          <span className="flex flex-col items-center" style={{ gap: z.gap }}>
            {head}
          </span>
        </HiddenLink>
      ) : (
        head
      )}
      {children}
    </div>
  );
}
