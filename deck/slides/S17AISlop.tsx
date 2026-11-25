"use client";

import { S17 } from "../content/copy";
import { MEDIA } from "../media/media";
import { D } from "../theme";
import { Show } from "../kit/Show";
import { VideoSlot } from "../kit/VideoSlot";
import { SlideTitle } from "../kit/ui";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "intro", label: "AI Slop والسؤال" },
  { key: "azzam", label: "المقطع الأول: أثر الفراشة: عزام" },
  { key: "higgsfield", label: "المقطع الثاني: Higgsfield AI" },
  { key: "closing", label: "«إذا كانت الأدوات متاحة للجميع، وش اللي يصنع الفرق؟»" },
];

const FRAME = { w: 1120, h: 630, top: 330 };
/**
 * «أثر الفراشة: عزام» while there is no video file: its poster, upright and centred under the question, as tall as
 * the slide allows (owner, 2026-11-24). No frame, and the poster's own proportions (height fills the space,
 * width auto, object-fit contain), so nothing is cropped or stretched; its bottom stays 48 px above the edge.
 */
const POSTER = { top: 252, bottom: 48 };
const azzamPoster = !MEDIA.s17Azzam.src && MEDIA.s17Azzam.poster ? MEDIA.s17Azzam.poster : null;

/** Two clips in one place, one after the other, each playing on its click. Files and cuts come later (media/media.ts). */
export default function S17AISlop({ step, dev }: SlideProps) {
  const s = stepper(steps, step);
  const clip = s.is("azzam") ? MEDIA.s17Azzam : s.is("higgsfield") ? MEDIA.s17Higgsfield : null;
  return (
    <div className="absolute inset-0">
      <SlideTitle latin sub={<span dir="rtl">{S17.question}</span>} subStyle={{ opacity: s.at("closing") ? 0 : 1, transition: "opacity .5s" }}>
        {S17.title}
      </SlideTitle>

      {/* the Azzam poster, on the Azzam click */}
      {azzamPoster && (
        <Show on={s.is("azzam")} from="scale" dur={600} className="absolute inset-x-0 flex justify-center" style={{ top: POSTER.top, bottom: POSTER.bottom }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={azzamPoster} alt={MEDIA.s17Azzam.title} draggable={false} style={{ height: "100%", width: "auto", objectFit: "contain", boxShadow: "0 30px 80px rgba(0,0,0,.55)" }} />
        </Show>
      )}

      {/* the clips: same frame, one at a time */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: FRAME.top, width: FRAME.w, height: FRAME.h }}>
        {(azzamPoster ? [MEDIA.s17Higgsfield] : [MEDIA.s17Azzam, MEDIA.s17Higgsfield]).map((c) => (
          <Show key={c.id} on={clip?.id === c.id} from="scale" dur={600} className="absolute inset-0">
            <VideoSlot clip={c} playing={clip?.id === c.id} dev={dev} width={FRAME.w} height={FRAME.h} />
          </Show>
        ))}
      </div>

      <Show on={s.at("closing")} from="up" className="absolute inset-0 flex items-center justify-center px-[200px]">
        <p className="m-0 text-center text-[88px] font-black leading-[1.35]" style={{ color: D.mist }}>
          {S17.closing}
        </p>
      </Show>
    </div>
  );
}
