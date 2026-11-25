"use client";

import RefineFrame, { type RefineFrameStatus } from "@/components/reactbits/RefineFrame";
import { T, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";

const STATUS: RefineFrameStatus[] = ["queued", "generating", "refining", "complete"];
const NAMES = ["في الانتظار", "يولّد", "يصقل", "اكتمل"];

/** React Bits "Refine Frame", unchanged, fed by the lab's stage. The labels are Arabic; the frame does the rest. */
export function RefineFrameDemo({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay);
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-1/2 top-[90px] w-[760px] -translate-x-1/2">
        <RefineFrame
          key={replay}
          status={STATUS[s]}
          width={760}
          aspectRatio="1 / 1"
          radius={22}
          stageDuration={900}
          hideAfter={0}
          labels={{ queued: "في الانتظار", generating: "يولّد الصورة", refining: "يصقل التفاصيل", complete: "اكتمل", error: "تعذّر" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lab/generated.png" alt="صورة مولّدة" className="h-full w-full object-cover" />
        </RefineFrame>
      </div>
      <ol className="absolute bottom-[56px] left-1/2 flex -translate-x-1/2 gap-[18px]" aria-label="المراحل">
        {NAMES.map((n, i) => (
          <li key={n} className="rounded-full px-[26px] py-[10px] text-[26px] font-bold transition-colors duration-500" style={{ background: i === s ? T.orange : "transparent", color: i === s ? "#1a0c00" : T.dim, border: `1.5px solid ${i === s ? T.orange : T.line}` }}>
            {n}
          </li>
        ))}
      </ol>
    </div>
  );
}
