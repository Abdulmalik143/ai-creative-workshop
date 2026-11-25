"use client";

import { useEffect, useRef } from "react";
import { ClapperboardIcon } from "@hugeicons/core-free-icons";
import type { VideoClip } from "../media/media";
import { D, MONO } from "../theme";
import { Icon, PlaceholderTag } from "./ui";
import { CURSOR_CSS } from "./CursorArrow";

/**
 * A clip driven by the presenter's clicks: it plays when `playing` turns true (from `start`, stopping at `end`)
 * and pauses when it turns false. Leaving the slide unmounts it, so nothing keeps playing off screen.
 * Without a file it shows the clip's still (`poster`) if there is one, else a neutral frame; the development view adds
 * what is missing. `link` (owner's exception to the no-links rule) makes the still open a page in a new tab, with
 * nothing that shows it: the deck's own cursor stays, no underline, no hover, no focus ring.
 */
export function VideoSlot({ clip, playing, dev, width, height }: { clip: VideoClip; playing: boolean; dev: boolean; width: number; height: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      if (clip.start !== undefined) v.currentTime = clip.start;
      v.play().catch(() => {
        // the browser refused sound before any interaction: play muted rather than not at all
        v.muted = true;
        v.play().catch(() => {});
      });
    } else v.pause();
  }, [playing, clip.start]);

  const onTime = () => {
    const v = ref.current;
    if (v && clip.end !== undefined && v.currentTime >= clip.end) v.pause();
  };

  return (
    <div className="relative overflow-hidden rounded-[24px]" style={{ width, height, background: "#000", border: `1.5px solid ${D.lineStrong}`, boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}>
      {clip.src ? (
        <video ref={ref} src={clip.src} poster={clip.poster} preload="auto" playsInline onTimeUpdate={onTime} className="absolute inset-0 h-full w-full object-cover" />
      ) : clip.poster ? (
        clip.link ? (
          <a href={clip.link} target="_blank" rel="noopener noreferrer" aria-label={clip.title} className="absolute inset-0 block outline-none" style={{ cursor: CURSOR_CSS }}>
            <Still src={clip.poster} />
          </a>
        ) : (
          <Still src={clip.poster} />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[22px]" style={{ background: `radial-gradient(ellipse at 50% 40%, ${D.panel3}, #000 75%)` }}>
          <Icon icon={ClapperboardIcon} size={110} color={D.faint} stroke={1.4} />
          {dev && (
            <div dir="ltr" className="flex flex-col items-center gap-[8px] text-center" style={{ fontFamily: MONO }}>
              <span className="text-[22px] font-bold" style={{ color: "#ffd60a" }}>
                media/media.ts → {clip.id}.src
              </span>
              {clip.reference.map((r) => (
                <span key={r} className="text-[17px]" style={{ color: D.dim }}>
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <span className="pointer-events-none absolute right-[22px] top-[20px] rounded-full px-[20px] py-[9px] text-[26px] font-bold leading-none" style={{ background: "rgba(5,8,13,.78)", color: D.mist, border: `1px solid ${D.line}` }}>
        {clip.title}
      </span>
      <PlaceholderTag dev={dev && !clip.src} label={clip.id} style={{ top: "auto", bottom: 16 }} />
    </div>
  );
}

/** the still fills the frame; anchored at the top, so a screenshot keeps its top bar and loses only its bottom edge */
function Still({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 0%" }} />;
}
