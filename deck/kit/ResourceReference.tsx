"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { Alert02Icon, BrowserIcon, Download04Icon, Mic01Icon, News01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { KIND_LABEL, RESOURCE, type Resource } from "../content/resources";
import { D } from "../theme";
import { Icon } from "./ui";

const GLYPH = { mic: Mic01Icon, download: Download04Icon, browser: BrowserIcon, play: PlayIcon, news: News01Icon } as const;

/** official = the human's blue, community = amber (a caveat comes with it), video = neutral */
export const KIND_COLOR = { official: D.sky, community: "#ffc94d", video: "#d6dee8" } as const;

/**
 * A resource's mark: its official logo when we have one, a neutral glyph otherwise.
 * `fit` = how much of the tile a mark logo takes (some logo files carry their own padding).
 */
export function ResourceMark({ r, size = 60, fit = 0.62 }: { r: Resource; size?: number; fit?: number }) {
  if (r.logo && r.logoKind === "icon")
    return <img src={r.logo} alt="" width={size} height={size} className="flex-none" style={{ width: size, height: size, borderRadius: size * 0.24, objectFit: "cover" }} draggable={false} />;
  return (
    <span className="flex flex-none items-center justify-center" style={{ width: size, height: size, borderRadius: size * 0.24, background: r.tile ?? D.panel3 }}>
      {r.logo ? (
        <img src={r.logo} alt="" width={size * fit} height={size * fit} style={{ width: size * fit, height: size * fit, objectFit: "contain" }} draggable={false} />
      ) : (
        <Icon icon={GLYPH[r.glyph ?? "news"]} size={size * 0.5} color={D.mist} stroke={1.7} />
      )}
    </span>
  );
}

/** The type of a link: رسمي / مجتمعي / شرح فيديو, with a play mark when it is a video. */
export function KindBadge({ r, size = 18 }: { r: Resource; size?: number }) {
  const c = KIND_COLOR[r.kind];
  return (
    <span className="inline-flex flex-none items-center gap-[6px] whitespace-nowrap rounded-full font-bold leading-none" style={{ fontSize: size, color: c, border: `1.5px solid ${c}88`, padding: `${size * 0.32}px ${size * 0.7}px` }}>
      {r.video && <Icon icon={PlayIcon} size={size * 0.95} color={c} stroke={2} />}
      {KIND_LABEL[r.kind]}
    </span>
  );
}

/**
 * One setup or reference tool, compact enough to sit at the start of a track without taking the slide over.
 * A presentation card, not a link: no URL, nothing to click (the presenter hands out a references file).
 * `compact` drops the description line; `noteless` hides the caveat (it stays on /deck/refs and in the notes).
 */
export function ResourceReference({
  id,
  width = 460,
  compact = false,
  noteless = false,
  scale = 1,
  style,
}: {
  id: string;
  width?: number;
  compact?: boolean;
  noteless?: boolean;
  scale?: number;
  style?: CSSProperties;
}) {
  const r = RESOURCE[id];
  if (!r) throw new Error(`unknown resource "${id}"`);
  const warn = r.kind === "community";
  const k = scale;
  return (
    <div
      data-resource={r.id}
      className="flex flex-col"
      style={{
        width,
        gap: 12 * k,
        padding: `${16 * k}px ${18 * k}px`,
        borderRadius: 22 * k,
        background: D.panel,
        border: `1.5px solid ${warn ? `${KIND_COLOR.community}66` : D.line}`,
        boxShadow: "0 18px 44px rgba(0,0,0,.35)",
        color: D.mist,
        ...style,
      }}
    >
      <span className="flex items-center" style={{ gap: 16 * k }}>
        <ResourceMark r={r} size={60 * k} />
        <span className="flex min-w-0 flex-1 flex-col" style={{ gap: 6 * k }}>
          <span className="flex items-center justify-between" style={{ gap: 10 * k }}>
            <span dir="ltr" className="truncate font-black leading-none" style={{ fontSize: 26 * k, color: D.paper }}>
              {r.name}
            </span>
            <KindBadge r={r} size={17 * k} />
          </span>
          {!compact && r.what && (
            <span className="truncate font-medium leading-[1.3]" style={{ fontSize: 20 * k, color: D.text }}>
              {r.what}
            </span>
          )}
        </span>
      </span>
      {!noteless && r.note && (
        <span className="flex items-center leading-[1.35]" style={{ gap: 8 * k, fontSize: 18 * k, color: warn ? KIND_COLOR.community : D.dim }}>
          <Icon icon={Alert02Icon} size={20 * k} color={warn ? KIND_COLOR.community : D.dim} stroke={1.8} />
          {r.note}
        </span>
      )}
    </div>
  );
}
