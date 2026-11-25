"use client";

import Folder from "@/components/reactbits/Folder";
import { T, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";
import { useMounted } from "../kit/useMounted";
import { Wamda } from "../wamda/Wamda";

const ITEMS = [
  { title: "SKILL.md", description: "التعليمات" },
  { title: "references/", description: "المراجع" },
  { title: "scripts/", description: "الأدوات" },
  { title: "assets/", description: "الشعار والخطوط" },
];

/** React Bits "Folder" as the Skill: closed it is a name; open it is instructions and references; linked, it is what the agent knows. */
export function SkillFolder({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3400);
  const mounted = useMounted();
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-[180px] top-[150px] h-[760px] w-[900px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {mounted && <Folder
            key={replay}
            items={ITEMS}
            label="brand-skill"
            mode="flap"
            variant="solid"
            color={T.sage}
            paperColor={T.mist}
            layout={s >= 2 ? "spread" : "stack"}
            size={1.9}
            open={s >= 1}
            intro
            theme="dark"
          />}
        </div>
      </div>

      {/* the link to the agent */}
      <svg className="pointer-events-none absolute inset-0" width="1920" height="1080" fill="none" aria-hidden>
        <path d="M1010 560 C1200 560 1250 640 1380 640" stroke={T.orange} strokeWidth="5" strokeLinecap="round" strokeDasharray="14 12" pathLength={1} style={{ opacity: s >= 3 ? 1 : 0, transition: "opacity .6s .2s" }} />
      </svg>
      <div className="absolute right-[190px] top-[330px] flex flex-col items-center gap-[26px]" style={{ opacity: s >= 3 ? 1 : 0.25, transform: s >= 3 ? "none" : "translateY(14px)", transition: "all .7s cubic-bezier(.2,.8,.2,1)" }}>
        <Wamda key={s >= 3 ? "on" : "off"} clip="idle" mode={s >= 3 ? "reveal" : "silhouette"} scale={6.4} revealDelay={300} />
        <span className="rounded-full px-[30px] py-[12px] text-[32px] font-bold" style={{ background: s >= 3 ? T.orange : T.panel2, color: s >= 3 ? "#1a0c00" : T.dim, transition: "all .5s" }}>
          {s >= 3 ? "الوكيل جاهز بالـ Skill" : "وكيل بلا Skill"}
        </span>
      </div>

      <p className="absolute bottom-[70px] left-[120px] text-[40px] font-black" style={{ color: T.mist }}>
        {["Skill مجلد", "تعليمات ومراجع داخله", "تُجمَع في مكان واحد", "ويُربط بالوكيل"][s]}
      </p>
    </div>
  );
}
