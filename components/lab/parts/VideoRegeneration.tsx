"use client";

import { useEffect, useMemo, useRef } from "react";
import CardSwap, { type CardSwapHandle } from "@/components/reactbits/CardSwap";
import { T, MONO, type LabProps } from "../tokens";
import { useStep } from "../kit/steps";
import { useMounted } from "../kit/useMounted";
import { Wamda } from "../wamda/Wamda";

const TOTAL = 1800; // the worked example: a scene of 1800 frames
const scene = (bg: string, bar: string, label: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="${bg}"/>` +
      [0, 1, 2].map((i) => `<rect x="${420 - i * 190}" y="${250 - (60 + i * 55)}" width="130" height="${60 + i * 55}" rx="10" fill="${bar}" opacity="${0.55 + i * 0.22}"/>`).join("") +
      `<text x="320" y="326" text-anchor="middle" font-size="30" font-weight="800" fill="#f2f5f5" font-family="sans-serif">${label}</text></svg>`,
  );

export function VideoRegeneration({ step, replay = 0 }: LabProps) {
  const s = useStep(4, step, replay, 3600);
  const swap = useRef<CardSwapHandle>(null);
  const mounted = useMounted();
  const grid = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const items = useMemo(
    () => [
      { title: "النسخة ١", image: scene("#0c2327", "#b3c4c6", "النسخة ١") },
      { title: "النسخة ٢", image: scene("#2a1100", "#ff7a00", "النسخة ٢") },
    ],
    [],
  );
  const prev = useRef(0);

  // the new version comes to the front when generation finishes
  useEffect(() => {
    if (s === 3 && prev.current < 3) swap.current?.next();
    if (s < 3 && prev.current >= 3) swap.current?.prev();
    prev.current = s;
  }, [s]);

  // 1800 cells fill in as frames are regenerated
  useEffect(() => {
    const cv = grid.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const cols = 60;
    const rows = 30;
    const cw = cv.width / cols;
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const p = s >= 3 ? 1 : s === 2 ? Math.min(1, (Math.max(0, now - t0)) / 2600) : 0;
      const n = Math.floor(p * TOTAL);
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < TOTAL; i++) {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * cw;
        ctx.fillStyle = i < n ? T.orange : "rgba(179,196,198,0.12)";
        ctx.fillRect(x + 1, y + 1, cw - 3, cw - 3);
      }
      if (counter.current) counter.current.textContent = `${n} / ${TOTAL}`;
      if (s === 2 && p < 1) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [s]);

  const show = (on: boolean) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(18px)", transition: "all .55s cubic-bezier(.2,.8,.2,1)" }) as const;
  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <div className="absolute left-[130px] top-[110px]" style={{ width: 760, height: 700 }}>
        {mounted && <CardSwap items={items} width={640} height={360} cardDistance={46} verticalDistance={52} depth={110} autoplay={false} draggable={false} pauseOnHover={false} intro theme="dark" ref={swap} />}
      </div>

      <div className="absolute right-[110px] top-[120px] flex w-[780px] flex-col gap-[30px]">
        <div className="self-end rounded-[16px] px-[26px] py-[16px] text-[30px] font-bold" style={{ ...show(s >= 1), background: T.panel2, border: `1px solid ${T.line}`, color: T.mist }}>
          غيّر خلفية المشهد إلى البرتقالي
        </div>
        <div className="rounded-[20px] p-[26px]" style={{ ...show(s >= 2), background: T.panel, border: `1.5px solid ${s === 2 ? T.orange : T.line}` }}>
          <div className="mb-[18px] flex items-center justify-between">
            <span className="text-[30px] font-bold" style={{ color: T.mist }}>{s >= 3 ? "اكتملت إعادة التوليد" : "يعيد توليد الإطارات"}</span>
            <span ref={counter} dir="ltr" style={{ fontFamily: MONO, fontSize: 28, color: T.orangeSoft }}>0 / {TOTAL}</span>
          </div>
          <canvas ref={grid} width={720} height={360} className="w-full" />
        </div>
      </div>
      <div className="absolute bottom-[80px] right-[140px]" style={show(s === 2)}>
        <Wamda clip="run" mode="color" scale={3.2} flip />
      </div>
      <p className="absolute bottom-[96px] left-[130px] text-[36px] font-black" style={{ ...show(s >= 3), color: T.mist }}>النسخة الجديدة في المقدمة، والسابقة خلفها</p>
    </div>
  );
}
