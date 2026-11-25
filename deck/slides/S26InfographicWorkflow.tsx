"use client";

import { useEffect, useRef, useState } from "react";
import { S26, TRACK } from "../content/copy";
import { RESOURCE } from "../content/resources";
import { MEDIA } from "../media/media";
import { D, MONO } from "../theme";
import { Show } from "../kit/Show";
import { SlideTitle } from "../kit/ui";
import { ResourceMark } from "../kit/ResourceReference";
import { TrackBody } from "../kit/Sim";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "video", label: "الفيديو التعريفي يشتغل، وتحته البرومبت: جدول اللقطات بالثواني والمؤشر يمشي معه" },
  { key: "tools", label: "الأدوات الخمس تحت الجدول، كل أداة ودورها" },
];

/**
 * How the presenter's intro video was made (owner's pick, option 2, 2026-11-25): the real video (MEDIA.s26Intro), and under it
 * the prompt itself, a shot list in seconds. The bar runs left to right like the montage timeline on slide 22; its fill and
 * the current shot follow the video. The tools come on the second click. Stages and versions stay in the notes.
 */
const VIDEO = { w: 1040, h: 585, y: 196 };
const X = (1920 - VIDEO.w) / 2;
const BAR = { y: 846, h: 50, gap: 6 };
const TOTAL = MEDIA.s26Intro.duration;

export default function S26InfographicWorkflow({ step }: SlideProps) {
  const s = stepper(steps, step);
  const ref = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);

  // plays from the first click of the slide; leaving the slide unmounts it
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {
      // the browser refused sound before any interaction: play muted rather than not at all
      v.muted = true;
      v.play().catch(() => {});
    });
    let raf = 0;
    const tick = () => {
      setT(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = S26.shots.findIndex((sh) => t >= sh.from && t < sh.to);
  const usable = VIDEO.w - BAR.gap * (S26.shots.length - 1);

  return (
    <div className="absolute inset-0">
      <SlideTitle sub={S26.sub}>{TRACK.motion}</SlideTitle>
      <TrackBody>
        <div className="absolute overflow-hidden rounded-[24px]" style={{ left: X, top: VIDEO.y, width: VIDEO.w, height: VIDEO.h, background: "#000", border: `1.5px solid ${D.lineStrong}`, boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}>
          <video ref={ref} src={MEDIA.s26Intro.src} poster={MEDIA.s26Intro.poster} preload="auto" playsInline loop className="absolute inset-0 h-full w-full object-cover" />
          <span className="pointer-events-none absolute right-[22px] top-[20px] rounded-full px-[20px] py-[9px] text-[26px] font-bold leading-none" style={{ background: "rgba(5,8,13,.78)", color: D.mist, border: `1px solid ${D.line}` }}>
            {S26.video}
          </span>
        </div>

        {/* the prompt: a shot list in seconds */}
        <div className="absolute flex items-center justify-between" style={{ left: X, top: 798, width: VIDEO.w }}>
          <span className="text-[28px] font-black" style={{ color: D.paper }}>
            {S26.prompt}
          </span>
          <span dir="ltr" className="text-[22px] font-bold" style={{ color: D.dim, fontFamily: MONO }}>
            {S26.promptFile} · {TOTAL.toFixed(1)}s
          </span>
        </div>

        <div dir="ltr" className="absolute flex" style={{ left: X, top: BAR.y, width: VIDEO.w, gap: BAR.gap }}>
          {S26.shots.map((sh, i) => {
            const w = (usable * (sh.to - sh.from)) / TOTAL;
            const fill = Math.min(1, Math.max(0, (t - sh.from) / (sh.to - sh.from)));
            const now = i === current;
            return (
              <div key={sh.label} className="relative flex-none" style={{ width: w }}>
                <div className="relative overflow-hidden rounded-[12px]" style={{ height: BAR.h, background: D.panel2, border: `2px solid ${now ? D.agent : D.lineStrong}`, transition: "border-color .3s" }}>
                  <div className="absolute inset-y-0 left-0" style={{ width: `${fill * 100}%`, background: now ? "rgba(255,122,0,.42)" : "rgba(165,216,255,.22)" }} />
                </div>
                <div dir="rtl" className="mt-[10px] flex flex-col items-center text-center leading-[1.15]">
                  <span className="whitespace-nowrap text-[24px] font-black" style={{ color: now ? D.agent : D.mist, transition: "color .3s" }}>
                    {sh.label}
                  </span>
                  <span dir="ltr" className="whitespace-nowrap text-[17px] font-bold" style={{ color: D.dim, fontFamily: MONO }}>
                    {sh.from}–{sh.to}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* second click: the tools, each with what it did */}
        <div className="absolute flex justify-center gap-[18px]" style={{ left: 0, right: 0, top: 985 }}>
          {S26.tools.map((tool, k) => {
            const r = RESOURCE[tool.id];
            return (
              <Show key={tool.id} on={s.at("tools")} delay={k * 120} from="up" className="flex items-center gap-[12px] rounded-full py-[8px] pl-[22px] pr-[10px]" style={{ background: D.panel2, border: `1.5px solid ${D.lineStrong}` }}>
                <ResourceMark r={r} size={44} />
                <span dir="ltr" className="whitespace-nowrap text-[26px] font-bold" style={{ color: D.paper }}>
                  {r.name.replace(" / FFprobe", "")}
                </span>
                <span className="whitespace-nowrap text-[22px] font-bold" style={{ color: D.agentSoft }}>
                  {tool.role}
                </span>
              </Show>
            );
          })}
        </div>
      </TrackBody>
    </div>
  );
}
