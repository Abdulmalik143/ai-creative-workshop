"use client";

import { useEffect, useRef } from "react";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { Cursor, place } from "../../kit/Cursor";
import { DARK as C } from "../../kit/theme";
import { ease, easeOut, lerp, noise, seg, type V } from "../../kit/math";
import { newFollow, stepFollow } from "../../kit/follow";

/**
 * DARK. A piano roll. "عقل" plays notes loosely, off the grid; "وكيل" quantises them.
 * Every note you draw with the pointer lands rough and pink, then is pulled onto the grid in blue a beat later.
 */

const GX = 56; // grid left
const GR = 1776; // grid right (keys sit to the right of it)
const GY = 40;
const ROWS = 32;
const RH = 30;
const CW = 107.5;
const SNAP = CW / 2;
const BLACK = [1, 3, 6, 8, 10];

type Note = { rx: number; ry: number; rw: number; born: number; sx: number; sy: number; sw: number; row: number };

function snapNote(x: number, y: number, w: number, born: number): Note {
  const row = Math.max(0, Math.min(ROWS - 1, Math.round((y - GY - RH / 2) / RH)));
  const sx = Math.round((x - GX) / SNAP) * SNAP + GX;
  return { rx: x, ry: y, rw: w, born, sx, sy: GY + row * RH, sw: Math.max(SNAP, Math.round(w / SNAP) * SNAP), row };
}

// a cascading phrase: time runs right to left, pitch climbs
const PHRASE: Note[] = Array.from({ length: 26 }, (_, i) => {
  const row = Math.round(27 - i * 0.78 - 3.2 * Math.sin(i * 0.7));
  const rx = GR - 70 - i * 64 + (noise(i + 1) - 0.5) * 40;
  const ry = GY + row * RH + (noise(i + 9) - 0.5) * 20;
  const rw = (i % 3 === 0 ? CW : SNAP) + (noise(i + 4) - 0.5) * 22;
  const n = snapNote(rx - rw, ry, rw, 0.45 + i * 0.045);
  return n;
});

function RollScene() {
  const { scale, pointer, active } = useStage();
  const hostRef = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement | null>(null);
  const mindRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const live = useRef<Note[]>([]);
  const last = useRef<V | null>(null);
  const follow = useRef(newFollow());

  useEffect(() => {
    const c = document.createElement("canvas");
    c.style.cssText = `position:absolute;left:0;top:0;width:${STAGE_W}px;height:${STAGE_H}px`;
    hostRef.current!.appendChild(c);
    cv.current = c;
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
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);

      // rows: black-key rows sit darker
      for (let r = 0; r < ROWS; r++) {
        const pitch = (ROWS - 1 - r) % 12;
        ctx.fillStyle = BLACK.includes(pitch) ? "#0a0b0f" : "#11131a";
        ctx.fillRect(GX, GY + r * RH, GR - GX, RH);
        ctx.fillStyle = "#1a1d27";
        ctx.fillRect(GX, GY + r * RH, GR - GX, 1);
      }
      // columns: beat, half-beat
      for (let x = GR, i = 0; x >= GX - 1; x -= SNAP, i++) {
        ctx.fillStyle = i % 2 === 0 ? "#303547" : "#1b1e29";
        ctx.fillRect(x, GY, i % 8 === 0 ? 2 : 1, ROWS * RH);
      }

      // the quantise sweep
      const sweepX = lerp(GR, GX - 40, ease(seg(t, 1.3, 4.6)));
      const sweeping = t > 1.3 && t < 4.7;

      const drawNote = (n: Note, mode: "rough" | "snap" | "morph", m = 0, a = 1) => {
        ctx.globalAlpha = a;
        if (mode === "rough") {
          ctx.fillStyle = C.mind + "40";
          ctx.strokeStyle = C.mind;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(n.rx, n.ry - RH * 0.1, n.rw, RH - 4, 6);
          ctx.fill();
          ctx.stroke();
        } else {
          const x = mode === "snap" ? n.sx : lerp(n.rx, n.sx, m);
          const y = mode === "snap" ? n.sy : lerp(n.ry - RH * 0.1, n.sy, m);
          const w = mode === "snap" ? n.sw : lerp(n.rw, n.sw, m);
          ctx.fillStyle = C.agent;
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 2, w - 3, RH - 4, 6);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.28)";
          ctx.fillRect(x + 6, y + 4, Math.max(0, w - 15), 3);
        }
        ctx.globalAlpha = 1;
      };

      // the scripted phrase
      for (const n of PHRASE) {
        const age = t - n.born;
        if (age < 0) continue;
        const pop = easeOut(seg(age, 0, 0.25));
        const doneAt = n.sx; // snapped once the sweep has passed its x
        if (sweeping ? sweepX < doneAt : t >= 4.7) {
          const m = seg(sweepX, doneAt, doneAt - 90);
          drawNote(n, "morph", ease(sweeping ? m : 1));
          if (sweeping && m > 0 && m < 0.45) {
            ctx.strokeStyle = `rgba(255,255,255,${1 - m / 0.45})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(n.sx - 3, n.sy - 1, n.sw + 3, RH + 2, 8);
            ctx.stroke();
          }
        } else drawNote(n, "rough", 0, pop);
      }

      // notes you play
      const p = pointer.current;
      if (active && p.inside && t > 5) {
        const l = last.current;
        if (!l || Math.hypot(p.x - l.x, p.y - l.y) > 52) {
          if (p.x > GX && p.x < GR && p.y > GY && p.y < GY + ROWS * RH) {
            live.current.push(snapNote(p.x, p.y, 78 + noise(t * 9) * 36, t));
            if (live.current.length > 44) live.current.shift();
            last.current = { x: p.x, y: p.y };
          }
        }
      }
      for (const n of live.current) {
        const age = t - n.born;
        if (age > 8) continue;
        const fade = 1 - seg(age, 6.5, 8);
        if (age < 0.3) drawNote(n, "rough", 0, 1);
        else {
          const m = ease(seg(age, 0.3, 0.55));
          drawNote(n, "morph", m, fade);
          if (m < 1 || age < 0.7) {
            ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 1 - (age - 0.3) / 0.4) * fade})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(n.sx - 3, n.sy - 1, n.sw + 3, RH + 2, 8);
            ctx.stroke();
          }
        }
      }
      live.current = live.current.filter((n) => t - n.born < 8);

      if (sweeping) {
        const g = ctx.createLinearGradient(sweepX, 0, sweepX + 160, 0);
        g.addColorStop(0, C.agent + "00");
        g.addColorStop(1, C.agent + "55");
        ctx.fillStyle = g;
        ctx.fillRect(sweepX, GY, 160, ROWS * RH);
        ctx.fillStyle = C.agent;
        ctx.fillRect(sweepX - 1, GY, 3, ROWS * RH);
      }

      // keys
      for (let r = 0; r < ROWS; r++) {
        const pitch = (ROWS - 1 - r) % 12;
        const blk = BLACK.includes(pitch);
        ctx.fillStyle = blk ? "#0b0c10" : "#d9dce6";
        ctx.fillRect(GR + 4, GY + r * RH + 1, blk ? 50 : 84, RH - 2);
      }

      // title scrim so the type stays quiet against the grid
      const sc = ctx.createLinearGradient(0, 0, 0, 560);
      sc.addColorStop(0, "rgba(13,14,19,0.97)");
      sc.addColorStop(0.72, "rgba(13,14,19,0.94)");
      sc.addColorStop(1, "rgba(13,14,19,0)");
      ctx.fillStyle = sc;
      ctx.fillRect(0, 0, STAGE_W, 560);

      // cursors
      const lastLive = live.current[live.current.length - 1];
      const phraseIdx = Math.min(PHRASE.length - 1, Math.max(0, Math.floor((t - 0.45) / 0.045)));
      const pn = PHRASE[phraseIdx];
      const scripted: { mind: V; agent: V } = {
        mind: t < 1.6 ? { x: pn.rx - 20, y: pn.ry + 28 } : { x: lerp(pn.rx, 1300, ease(seg(t, 1.6, 3))) , y: lerp(pn.ry + 28, 760, ease(seg(t, 1.6, 3))) },
        agent: { x: Math.max(sweepX, GX + 40) + 20, y: t < 1.3 ? 640 : lerp(640, 520, ease(seg(t, 1.3, 4.6))) },
      };
      if (t > 4.7) scripted.agent = { x: lerp(GX + 60, 520, ease(seg(t, 4.7, 5.6))), y: 690 };
      const cur = stepFollow(follow.current, {
        t,
        liveFrom: 5,
        active,
        pointer: p,
        scripted,
        agentTarget: lastLive ? { x: lastLive.sx + lastLive.sw - 14, y: lastLive.sy + 10 } : null,
        agentK: 0.14,
      });
      place(mindRef.current, cur.mind, seg(t, 0.3, 0.6));
      place(agentRef.current, cur.agent, seg(t, 1.0, 1.4));
    },
    { poster: 5.2 },
  );

  return (
    <>
      <div ref={hostRef} className="absolute inset-0" />
      <Cursor color={C.agent} label="وكيل" refEl={agentRef} />
      <Cursor color={C.mind} label="عقل" refEl={mindRef} />
    </>
  );
}

export default function Roll({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background={C.bg}>
      <RollScene />
      <h1 className="absolute right-[150px] top-[74px] text-[152px] font-black leading-[1.02]" style={{ color: C.text }}>
        <span className="block">الذكاء الاصطناعي</span>
        <span className="block">في المجالات الإبداعية</span>
      </h1>
      <p className="absolute right-[150px] top-[420px] text-[56px] font-medium leading-none">
        <span style={{ color: C.mind }}>عقل يبدع</span>
        <span style={{ color: C.dim }}>، </span>
        <span style={{ color: C.agent }}>ووكيل ينفّذ</span>
      </p>
      <div
        className="absolute inset-x-0 bottom-0 flex h-[68px] items-center justify-between px-[56px]"
        style={{ background: C.bar, borderTop: `1px solid ${C.line}` }}
      >
        <RakayaLogo height={40} />
        <span className="text-[26px] leading-none" style={{ color: C.barText }}>
          تقديم: عبدالملك الهندي
        </span>
      </div>
    </Stage>
  );
}
