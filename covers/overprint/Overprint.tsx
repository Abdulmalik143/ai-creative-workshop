"use client";

import { useEffect, useRef } from "react";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";

/**
 * Two spot-colour plates on flame-orange stock.
 * Right plate (pink, dot screen): the mind. Left plate (blue, line screen): the agent.
 * Where they overprint, ink multiplies into a third colour: the work.
 * The plates start out of register and the agent slides them true; the pointer knocks them out again.
 */

const FIELD_H = 790;
const R = 480;
const CY = 395;
const PINK = "#ff4f9a";
const BLUE = "#2433e0";
const STOCK = "#e9e6f7";
const BAND = "#12112b";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function makeGrain() {
  const g = document.createElement("canvas");
  g.width = g.height = 256;
  const c = g.getContext("2d")!;
  const id = c.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 150;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
    id.data[i + 3] = 255;
  }
  c.putImageData(id, 0, 0);
  return g;
}

function PressCanvas() {
  const { scale, pointer, active } = useStage();
  const hostRef = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement | null>(null);
  const grain = useRef<HTMLCanvasElement | null>(null);
  const knock = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const c = document.createElement("canvas");
    c.style.cssText = `position:absolute;left:0;top:0;width:${STAGE_W}px;height:${STAGE_H}px`;
    hostRef.current!.appendChild(c);
    cv.current = c;
    grain.current = makeGrain();
    return () => {
      c.remove();
      cv.current = null;
    };
  }, []);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const dpr = Math.min(2, Math.max(0.5, scale * (window.devicePixelRatio || 1)));
    c.width = Math.round(STAGE_W * dpr);
    c.height = Math.round(STAGE_H * dpr);
  }, [scale]);

  useStageLoop(
    (t) => {
      const c = cv.current;
      if (!c) return;
      const ctx = c.getContext("2d")!;
      const k = c.width / STAGE_W;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = BAND;
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
      ctx.fillStyle = STOCK;
      ctx.fillRect(0, 0, STAGE_W, FIELD_H);

      // registration: plates arrive out of register, the agent slides them true
      const arrive = clamp01((t - 0.3) / 2.0);
      const settle = arrive >= 1 ? 1 : easeOutBack(arrive);
      const rest = 232; // half distance between plate centres when registered
      const p = pointer.current;
      const kn = knock.current;
      const wantX = active && p.inside ? Math.max(-1, Math.min(1, (p.x - STAGE_W / 2) / 700)) * 120 : 0;
      const wantY = active && p.inside ? Math.max(-1, Math.min(1, (p.y - CY) / 420)) * 60 : 0;
      kn.x += (wantX - kn.x) * 0.08;
      kn.y += (wantY - kn.y) * 0.08;
      const far = 560 * (1 - settle);
      const ax = STAGE_W / 2 + (rest + far) + kn.x * 0.6;
      const bx = STAGE_W / 2 - (rest + far) - kn.x * 0.6;
      const ay = CY + kn.y;
      const by = CY - kn.y;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, STAGE_W, FIELD_H);
      ctx.clip();
      ctx.globalCompositeOperation = "multiply";

      // ---- the mind: pink dot screen, 45 degrees, swelling toward the lower edge
      ctx.fillStyle = PINK;
      {
        const sp = 13;
        const ang = Math.PI / 4;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        ctx.beginPath();
        for (let j = -80; j <= 80; j++) {
          for (let i = -80; i <= 80; i++) {
            const lx = i * sp;
            const ly = j * sp;
            const x = ax + lx * ca - ly * sa;
            const y = ay + lx * sa + ly * ca;
            const dx = x - ax;
            const dy = y - ay;
            const d = Math.hypot(dx, dy);
            if (d > R - 4) continue;
            // field: soft billows, heavier toward the bottom-left
            const v = 0.55 + 0.35 * (dy / R) + 0.18 * Math.sin(dx * 0.012 + t * 0.4) * Math.cos(dy * 0.01 - t * 0.3);
            const r = sp * 0.5 * clamp01(v) * 1.08;
            if (r < 0.5) continue;
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }

      // ---- the agent: blue line screen, perfectly horizontal, thickening toward the centre
      ctx.fillStyle = BLUE;
      {
        const sp = 12;
        ctx.beginPath();
        for (let y = by - R; y <= by + R; y += sp) {
          const dy = y - by;
          const half = Math.sqrt(Math.max(0, R * R - dy * dy)) - 3;
          if (half <= 2) continue;
          const th = sp * (0.2 + 0.62 * (1 - Math.abs(dy) / R));
          ctx.rect(bx - half, y - th / 2, half * 2, th);
        }
        ctx.fill();
      }
      ctx.restore();

      // ---- registration marks and a colour bar, as on a press sheet
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = BAND;
      ctx.lineWidth = 2;
      for (const [mx, my] of [
        [64, 64],
        [STAGE_W - 64, 64],
        [64, FIELD_H - 64],
        [STAGE_W - 64, FIELD_H - 64],
      ]) {
        ctx.beginPath();
        ctx.arc(mx, my, 14, 0, Math.PI * 2);
        ctx.moveTo(mx - 26, my);
        ctx.lineTo(mx + 26, my);
        ctx.moveTo(mx, my - 26);
        ctx.lineTo(mx, my + 26);
        ctx.stroke();
      }

      // ---- paper grain over everything printed
      if (grain.current) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, STAGE_W, FIELD_H);
        ctx.clip();
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.22;
        const pat = ctx.createPattern(grain.current, "repeat")!;
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, STAGE_W, FIELD_H);
        ctx.restore();
      }
    },
    { poster: 3.2 },
  );

  return <div ref={hostRef} className="absolute inset-0" />;
}

export default function Overprint({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={BAND}>
      <PressCanvas />
      <h1
        className="absolute right-[96px] whitespace-nowrap text-[94px] font-black leading-none text-white"
        style={{ top: FIELD_H + 70 }}
      >
        الذكاء الاصطناعي في المجالات الإبداعية
      </h1>
      <p className="absolute right-[96px] text-[48px] font-medium leading-none" style={{ top: FIELD_H + 196 }}>
        <span className="text-[#ff7fb1]">عقل يبدع</span>
        <span className="text-[#8a89b0]">، </span>
        <span className="text-[#8c9bff]">ووكيل ينفّذ</span>
      </p>
      <RakayaLogo height={60} className="absolute left-[96px]" style={{ top: FIELD_H + 64 }} />
      <span className="absolute left-[96px] text-[28px] font-normal leading-none text-[#a9a8c8]" style={{ top: FIELD_H + 202 }}>
        تقديم: عبدالملك الهندي
      </span>
    </Stage>
  );
}
