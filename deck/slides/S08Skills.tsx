"use client";

import Folder from "@/components/reactbits/Folder";
import { Book02Icon, FolderTreeIcon, Image01Icon, Note01Icon, SwatchIcon, Wrench01Icon } from "@hugeicons/core-free-icons";
import { SpeechBubble } from "@/components/lab/wamda/SpeechBubble";
import { useMounted } from "@/components/lab/kit/useMounted";
import { S08 } from "../content/copy";
import { D, EASE } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { Icon, SlideTitle, type IconSvgElement } from "../kit/ui";
import { WamdaActor, bubbleTone, lookFor } from "../character/Wamda";
import { stepper, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "title", label: "العنوان" },
  { key: "agent", label: "الوكيل يظهر" },
  { key: "ask", label: "«أنتم كيف تشتغلون؟»" },
  { key: "items", label: "تعليمات، مراجع، هوية، شعارات، أدوات، ملفات" },
  { key: "gather", label: "تتجمع في مجلد Skill وتنتقل للوكيل" },
];

const LOOK = lookFor(8);
const AGENT = { x: 640, y: 640 }; // Wamda's centre
const FOLDER_AT = { x: 1290, y: 600 };
const FOLDER_HANDED = { x: 1000, y: 690 };

const ICONS: IconSvgElement[] = [Note01Icon, Book02Icon, SwatchIcon, Image01Icon, Wrench01Icon, FolderTreeIcon];
// where each piece floats around the agent (stage coordinates, card centre)
const SPOTS = [
  { x: 1080, y: 330 },
  { x: 1180, y: 500 },
  { x: 1110, y: 670 },
  { x: 200, y: 360 },
  { x: 150, y: 545 },
  { x: 230, y: 730 },
];

/** what the folder holds: files and sub-folders, not blank paper */
function Piece({ i, label }: { i: number; label: string }) {
  const dir = i === 5;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px] rounded-[10px] p-[14px] text-center" style={{ background: dir ? "#ffe2c2" : D.paper, color: D.ink }}>
      <Icon icon={ICONS[i]} size={70} color={dir ? D.agentDeep : D.cobalt} stroke={1.7} />
      <span className="text-[20px] font-black leading-[1.2]">{label}</span>
    </div>
  );
}

export default function S08Skills({ step }: SlideProps) {
  const s = stepper(steps, step);
  const mounted = useMounted();
  const g = useBeats(step, s.idx("gather"), [80, 1000, 2700, 3400]);
  const flown = g >= 1;
  const open = g >= 2 && g < 3;
  const handed = g >= 4;
  const folderPos = handed ? FOLDER_HANDED : FOLDER_AT;

  return (
    <div className="absolute inset-0">
      <SlideTitle>{S08.title}</SlideTitle>

      {/* the agent */}
      <div className="absolute" style={{ left: AGENT.x - 216, top: AGENT.y - 228 }}>
        <Show on={s.at("agent")} from="up">
          <WamdaActor look={LOOK} act={s.is("ask") ? "speaking" : handed ? "waving" : "idle"} scale={6} glow />
        </Show>
      </div>
      <div className="absolute" style={{ left: AGENT.x + 120, top: 250 }}>
        <Show on={s.is("ask")} from="pop">
          {s.at("ask") && <SpeechBubble key="ask" text={S08.ask} effect="type" tone={bubbleTone(LOOK)} tail="end" fontSize={46} maxWidth={640} />}
        </Show>
      </div>

      {/* what the agent needs to learn, floating around it, then gathered into the folder */}
      {S08.items.map((t, i) => {
        const p = SPOTS[i];
        const dx = FOLDER_AT.x - p.x;
        const dy = FOLDER_AT.y - p.y;
        return (
          <div
            key={t}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) ${flown ? `translate(${dx}px, ${dy}px) scale(.3)` : ""}`,
              opacity: s.at("items") && !flown ? 1 : 0,
              transition: flown ? `transform .9s cubic-bezier(.6,0,.3,1) ${i * 0.06}s, opacity .3s ease ${0.6 + i * 0.06}s` : `opacity .5s ease ${i * 0.12}s, transform .6s ${EASE} ${i * 0.12}s`,
            }}
          >
            <div className="flex items-center gap-[16px] whitespace-nowrap rounded-[20px] px-[24px] py-[18px]" style={{ background: D.panel, border: `1.5px solid ${D.lineStrong}`, boxShadow: "0 18px 40px rgba(0,0,0,.4)", animation: s.is("items") ? `deck-bob 3.2s ${i * 0.3}s ease-in-out infinite` : undefined }}>
              <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[14px]" style={{ background: "rgba(165,216,255,.12)" }}>
                <Icon icon={ICONS[i]} size={34} color={D.sky} />
              </span>
              <span className="text-[32px] font-bold" style={{ color: D.mist }}>
                {t}
              </span>
            </div>
          </div>
        );
      })}

      {/* the Skill folder (React Bits Folder) */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: folderPos.x,
          top: folderPos.y,
          transform: `translate(-50%, -50%) scale(${handed ? 0.62 : 1})`,
          opacity: s.at("gather") ? 1 : 0,
          transition: `left 1s ${EASE}, top 1s ${EASE}, transform 1s ${EASE}, opacity .5s ease`,
        }}
      >
        {mounted && s.at("gather") && (
          <Folder
            items={S08.items.map((t, i) => ({ title: t, content: <Piece i={i} label={t} /> }))}
            label={S08.folder}
            mode="flap"
            variant="solid"
            color={D.agent}
            paperColor={D.paper}
            layout="spread"
            size={1.8}
            open={open}
            openOn="click"
            draggable={false}
            zoomOnClick={false}
            closeOnOutsideClick={false}
            peek={false}
            intro
            theme="dark"
          />
        )}
      </div>

      <Show on={handed} from="up" delay={700} className="absolute inset-x-[110px] top-[960px] flex justify-start">
        <p className="m-0 text-[46px] font-black leading-none" style={{ color: D.mist }}>
          {S08.phrase}
        </p>
      </Show>
    </div>
  );
}
