"use client";

import { FileSyncIcon, FolderOpenIcon, FolderSearchIcon, RepeatOffIcon } from "@hugeicons/core-free-icons";
import { SpeechBubble } from "@/components/lab/wamda/SpeechBubble";
import { S03, S04 } from "../content/copy";
import { D, EASE, MONO } from "../theme";
import { Show } from "../kit/Show";
import { Icon } from "../kit/ui";
import { WamdaActor, bubbleTone, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "echo", label: "امتداد المقارنة" },
  { key: "interrupt", label: "الشخصية تقاطع بالسؤال" },
  { key: "p1", label: "وصول مباشر لملفات المشروع" },
  { key: "p2", label: "يستكشف ملفاته ومصادره" },
  { key: "p3", label: "يعدّل ملفات مترابطة" },
  { key: "p4", label: "بدون إعادة إرسال الملفات" },
];

const ICONS = [FolderOpenIcon, FolderSearchIcon, FileSyncIcon, RepeatOffIcon];
const LOOK = lookFor(4);

/** The silhouette cuts in on the comparison. Its identity stays hidden: black, sky rim, light bubble. */
export default function S04Interruption({ step }: SlideProps) {
  const s = stepper(steps, step);
  const cut = s.at("interrupt");
  const shown = Math.max(0, step - s.idx("interrupt"));
  return (
    <div className="absolute inset-0">
      {/* the line we were on when the interruption came: exactly where slide 03 left it */}
      <div
        className="absolute inset-x-[110px] top-[918px] flex justify-start"
        style={{ opacity: cut ? 0 : 1, transform: cut ? "translateY(-30px) scale(.96)" : "none", filter: cut ? "blur(6px)" : "none", transition: `all .45s ${EASE}` }}
      >
        <p className="m-0 flex items-baseline gap-[26px] rounded-full px-[48px] py-[20px] text-[46px] font-black leading-none" style={{ background: "rgba(5,8,13,.82)", border: `1.5px solid ${D.line}` }}>
          <span style={{ color: D.sky }}>{S03.closing.a}</span>
          <span dir="ltr" className="text-[32px]" style={{ color: D.dim, fontFamily: MONO }}>
            {S03.closing.vs}
          </span>
          <span style={{ color: D.agent }}>{S03.closing.b}</span>
        </p>
      </div>

      {/* the interruption */}
      {cut && (
        <>
          <div className="absolute left-[100px] top-[500px]" style={{ animation: "deck-slam .55s cubic-bezier(.2,.9,.2,1) both" }}>
            <WamdaActor look={LOOK} act={s.is("interrupt") ? "questioning" : "idle"} scale={6.6} glow />
          </div>
          <div className="absolute left-[360px] top-[96px]" style={{ animation: "deck-glitch .4s .1s steps(2) both" }}>
            <SpeechBubble text={S04.question} effect="words" interrupt tone={bubbleTone(LOOK)} tail="end" fontSize={50} maxWidth={1420} />
          </div>
          <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(165,216,255,.12)", animation: "lab-fade .5s reverse both" }} />
        </>
      )}

      {/* the answer: what the agent has inside a project */}
      <ol className="absolute m-0 grid list-none grid-cols-2 gap-[28px] p-0" style={{ left: 660, top: 492, width: 1150 }}>
        {S04.points.map((t, i) => (
          <Show as="li" key={t} on={shown > i} from="up" className="flex h-[218px] flex-col justify-between rounded-[24px] p-[30px]" style={{ background: D.panel, border: `1.5px solid ${shown === i + 1 ? D.agent : D.line}` }}>
            <div className="flex items-center justify-between">
              <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[18px]" style={{ background: "rgba(255,122,0,.14)" }}>
                <Icon icon={ICONS[i]} size={38} color={D.agent} />
              </span>
              <span className="text-[30px] font-black tabular-nums" style={{ color: D.faint, fontFamily: MONO }}>
                0{i + 1}
              </span>
            </div>
            <p className="m-0 text-[34px] font-bold leading-[1.35]" style={{ color: D.mist }}>
              {t}
            </p>
          </Show>
        ))}
      </ol>
    </div>
  );
}
