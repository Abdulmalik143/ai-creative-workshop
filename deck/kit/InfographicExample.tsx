"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { ClapperboardIcon } from "@hugeicons/core-free-icons";
import type { InfographicExample } from "../media/media";
import { D, MONO } from "../theme";
import { Icon, PlaceholderTag } from "./ui";

/**
 * The replaceable space for slide 26's finished example (MEDIA.s25Example): the video, its visual references,
 * and a short list of how it was built. Every part stays an empty, neutral frame until its file or text exists,
 * so a deferred asset is never shown as finished. The development view (D) names what is missing and where.
 * The video plays when `playing` is true and pauses otherwise; it unmounts with the slide.
 */
export function InfographicExamplePlaceholder({
  example,
  playing,
  dev,
  x,
  y,
  w,
  labels,
}: {
  example: InfographicExample;
  playing: boolean;
  dev: boolean;
  x: number;
  y: number;
  w: number;
  labels: { example: string; refs: string; howBuilt: string; pending: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const vh = Math.round((w * 9) / 16);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    else v.pause();
  }, [playing]);

  const box = { background: D.panel, border: `1.5px solid ${D.lineStrong}`, borderRadius: 22 } as const;
  return (
    <div className="absolute flex flex-col gap-[20px]" style={{ left: x, top: y, width: w }}>
      <div className="relative overflow-hidden" style={{ ...box, height: vh, background: "#000" }}>
        {example.video ? (
          <video ref={ref} src={example.video} poster={example.poster} preload="auto" playsInline controls={false} className="absolute inset-0 h-full w-full object-contain" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px]" style={{ background: `radial-gradient(ellipse at 50% 40%, ${D.panel3}, #000 75%)` }}>
            <Icon icon={ClapperboardIcon} size={96} color={D.faint} stroke={1.4} />
            <span className="text-[28px] font-bold" style={{ color: D.dim }}>
              {labels.pending}
            </span>
          </div>
        )}
        <span className="absolute right-[20px] top-[18px] rounded-full px-[18px] py-[8px] text-[24px] font-bold leading-none" style={{ background: "rgba(5,8,13,.78)", color: D.mist, border: `1px solid ${D.line}` }}>
          {labels.example}
        </span>
        <PlaceholderTag dev={dev && !example.video} label="media.ts → s25Example.video" style={{ top: "auto", bottom: 14 }} />
      </div>

      <div className="flex gap-[20px]">
        <div className="relative flex flex-1 flex-col gap-[14px] p-[22px]" style={{ ...box, minHeight: 170 }}>
          <span className="text-[24px] font-bold" style={{ color: D.sky }}>
            {labels.refs}
          </span>
          <div className="flex gap-[12px]">
            {example.references.length
              ? example.references.slice(0, 4).map((src) => <img key={src} src={src} alt="" className="h-[84px] w-[110px] rounded-[10px] object-cover" draggable={false} />)
              : [0, 1, 2].map((k) => <span key={k} className="h-[84px] w-[110px] rounded-[10px]" style={{ border: `1.5px dashed ${D.line}` }} />)}
          </div>
          <PlaceholderTag dev={dev && !example.references.length} label="s25Example.references" style={{ top: "auto", bottom: 10 }} />
        </div>
        <div className="relative flex flex-1 flex-col gap-[12px] p-[22px]" style={{ ...box, minHeight: 170 }}>
          <span className="text-[24px] font-bold" style={{ color: D.sky }}>
            {labels.howBuilt}
          </span>
          {example.steps.length ? (
            <ol className="m-0 flex list-none flex-col gap-[8px] p-0 text-[21px]" style={{ color: D.text }}>
              {example.steps.slice(0, 4).map((t, k) => (
                <li key={t} className="flex gap-[10px]">
                  <span className="font-black" style={{ color: D.agent, fontFamily: MONO }}>
                    {k + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          ) : (
            [80, 62, 70].map((wd) => <span key={wd} className="h-[12px] rounded-full" style={{ width: `${wd}%`, background: D.panel3 }} />)
          )}
          <PlaceholderTag dev={dev && !example.steps.length} label="s25Example.steps" style={{ top: "auto", bottom: 10 }} />
        </div>
      </div>
    </div>
  );
}
