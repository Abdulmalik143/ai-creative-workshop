"use client";

import { SpeechBubble } from "@/components/lab/wamda/SpeechBubble";
import { S07 } from "../content/copy";
import { D } from "../theme";
import { useBeats } from "../kit/beats";
import { Show } from "../kit/Show";
import { WamdaActor, type WamdaAct, type WamdaLook } from "../character/Wamda";
import { stepper, type BgLevel, type SlideProps, type StepDef } from "../types";

export const steps: StepDef[] = [
  { key: "silhouette", label: "ظل الوكيل (عند الدخول)" },
  { key: "reveal", label: "الكشف: ومضة بالبرتقالي، ثم يسلّم بيده وفقاعة التعريف" },
  { key: "question", label: "كيف بتعلّمه طريقة شغلك؟" },
];

/**
 * The ground follows the stages: dark and still for the silhouette; the orange ASCII field
 * starts with the reveal (its own intro plays from that moment, in orange from its first frame).
 */
export function background(step: number): BgLevel {
  return step >= steps.findIndex((x) => x.key === "reveal") ? "ascii" : "plain";
}

/**
 * The character, centred on the slide. The slide shows no headline (its name stays in the deck's navigation),
 * so no space is kept for one; the question appears under the character at the last stage.
 */
const CHAR = { scale: 7, h: 76 * 7, top: (1080 - 76 * 7) / 2 };
/** the reveal runs from REVEAL.delay for REVEAL.ms; then he waves (hand only) for two waves, then speaks */
const REVEAL = { delay: 250, ms: 2000 };
const BEAT = { greet: REVEAL.delay + REVEAL.ms + 100, speak: REVEAL.delay + REVEAL.ms + 100 + 2000 };
/** his bubble: above him on the right, the tail at its bottom-left pointing to him; anchored by its bottom */
const BUBBLE = { left: 1090, bottom: 1080 - 330, font: 40, maxWidth: 700 };

// pixels thrown out by the reveal
const BURST = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + (i % 2) * 0.2;
  const r = 300 + (i % 3) * 70;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8, s: 10 + (i % 4) * 5, d: (i % 5) * 0.04 };
});

/** The reveal. From here on, Wamda is orange for the rest of the workshop. */
export default function S07NewHire({ step }: SlideProps) {
  const s = stepper(steps, step);
  const r = useBeats(step, s.idx("reveal"), [BEAT.greet, BEAT.speak]);
  // once revealed he stays orange; switching the look then also keeps the reveal from replaying
  const look: WamdaLook = s.past("reveal") || (s.is("reveal") && r >= 1) ? "orange" : s.at("reveal") ? "reveal" : "silhouette";
  // from the reveal on he stands still (no bob, no walking frames); only his hand moves, and only while greeting
  const act: WamdaAct = !s.at("reveal") ? "idle" : s.is("reveal") && r === 1 ? "greeting" : "standing";
  const speaking = s.past("reveal") || (s.is("reveal") && r >= 2);
  const lit = s.at("reveal");
  return (
    <div className="absolute inset-0">
      {/* the spotlight on the centre axis: a neutral beam for the stranger, an orange one from the reveal.
          Two layers cross-fade, so no colour in between ever shows. */}
      {[
        { on: s.at("silhouette") && !lit, a: "rgba(242,245,245,.045)", b: "rgba(242,245,245,.08)", floor: "rgba(0,0,0,.55)" },
        { on: lit, a: "rgba(255,122,0,.14)", b: "rgba(255,178,94,.2)", floor: "rgba(255,122,0,.35)" },
      ].map((l, i) => (
        <div key={i} className="absolute inset-0" style={{ opacity: l.on ? 1 : 0, transition: "opacity .9s ease" }} aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-[1080px] w-[900px] -translate-x-1/2"
            style={{ background: `conic-gradient(from 180deg at 50% -10%, transparent 163deg, ${l.a} 173deg, ${l.b} 180deg, ${l.a} 187deg, transparent 197deg)` }}
          />
          <div className="absolute left-1/2 h-[56px] w-[560px] -translate-x-1/2 rounded-[50%]" style={{ top: CHAR.top + CHAR.h - 14, background: `radial-gradient(closest-side, ${l.floor}, transparent)` }} />
        </div>
      ))}

      {/* no visible headline on this slide; kept for screen readers only, it takes no space */}
      <h1 className="sr-only">{S07.headline}</h1>

      {/* the new hire, centred: the silhouette is there from the moment the slide opens */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: CHAR.top }}>
        {/* stays in place from silhouette to reveal: no slide, no movement, details hidden until the reveal */}
        <Show on={s.at("silhouette")} from="fade" dur={1000}>
          <WamdaActor look={look} act={act} scale={CHAR.scale} revealDelay={REVEAL.delay} revealMs={REVEAL.ms} glow={lit} />
        </Show>
        {s.is("reveal") && (
          <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
            <div className="absolute -left-[250px] -top-[250px] h-[500px] w-[500px] rounded-full" style={{ border: `6px solid ${D.agent}`, animation: "deck-tap 1.4s .9s ease-out both" }} />
            {BURST.map((b, i) => (
              <span
                key={i}
                className="absolute"
                style={{
                  width: b.s,
                  height: b.s,
                  background: i % 3 ? D.agent : D.agentSoft,
                  ["--bx" as string]: `${b.x}px`,
                  ["--by" as string]: `${b.y}px`,
                  animation: `s07-burst 1.3s ${1 + b.d}s cubic-bezier(.2,.8,.2,1) both`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* his introduction, once the greeting is done; it stays for the question */}
      <div className="absolute" style={{ left: BUBBLE.left, bottom: BUBBLE.bottom }}>
        {speaking && <SpeechBubble key="greeting" text={S07.greeting} effect="type" tone="orange" tail="end" fontSize={BUBBLE.font} maxWidth={BUBBLE.maxWidth} />}
      </div>

      {/* the question, under the character on the same axis */}
      <div className="absolute inset-x-[110px] flex justify-center" style={{ top: CHAR.top + CHAR.h + 64 }}>
        <Show on={s.at("question")} from="up" delay={150}>
          <p className="m-0 text-[50px] font-bold leading-[1.4]" style={{ color: D.agentSoft }}>
            {S07.question}
          </p>
        </Show>
      </div>
      <style>{`@keyframes s07-burst { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 15% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--bx), var(--by)) scale(1); } }`}</style>
    </div>
  );
}
