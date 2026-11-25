"use client";

import { useEffect, useRef } from "react";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";

/**
 * A dark planet that is only ever seen through a lattice: the mind is the body, the agent is the screen it is printed with.
 * Two rim lights hit it from behind: blue on the mind's side (right, where Arabic starts), amber on the agent's side.
 * Dots grow where light lands, and compress toward the limb like a real surface would.
 */

const CX = 1010;
const CY = 640;
const R = 760;
const SP = 15; // dot spacing in authored px
const TILT = 0.34;

type P = { lat: number; lon: number };

function buildSphere(): P[] {
  const pts: P[] = [];
  const dlat = SP / R;
  for (let lat = -Math.PI / 2 + dlat / 2; lat < Math.PI / 2; lat += dlat) {
    const n = Math.max(1, Math.round((2 * Math.PI * Math.cos(lat) * R) / SP));
    const off = Math.random() * 0; // lattices stay perfectly regular: that is the point
    for (let i = 0; i < n; i++) pts.push({ lat, lon: (i / n) * Math.PI * 2 + off });
  }
  return pts;
}

const sm = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
/** soft-edged rectangle: 0 inside, 1 well outside */
const away = (x: number, y: number, l: number, r: number, t: number, b: number, f: number) =>
  sm(0, f, Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b)));
/** keeps the dots quiet behind the type */
const quiet = (x: number, y: number) =>
  Math.min(
    0.1 + 0.9 * away(x, y, 400, 1830, 70, 470, 110),
    0.1 + 0.9 * away(x, y, 640, 1380, 770, 900, 90),
    0.1 + 0.9 * away(x, y, 80, 520, 925, 1010, 70),
  );

const norm = (x: number, y: number, z: number) => {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l] as const;
};

const BLUE = ["#2a3dd6", "#3f5bff", "#6e8cff", "#a9c0ff", "#e8efff"];
const AMBER = ["#8a3b12", "#d4651b", "#ff8d2e", "#ffb865", "#fff0d6"];

function GlobeCanvas() {
  const { scale, pointer, active } = useStage();
  const hostRef = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement | null>(null);
  const pts = useRef<P[]>(buildSphere());
  const aim = useRef({ x: 0, y: 0 });

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
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#04050d";
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);

      // light directions: the blue light sits right/behind, amber left/behind; the pointer tips both
      const p = pointer.current;
      const a = { x: 0, y: 0 };
      if (active && p.inside) {
        a.x = Math.max(-1.2, Math.min(1.2, (p.x - CX) / R));
        a.y = Math.max(-1.2, Math.min(1.2, (p.y - CY) / R));
      } else {
        const ang = Math.min(t, 4) * 0.0 + Math.sin(t * 0.18) * 0.25;
        a.x = 0.78 + Math.sin(t * 0.21) * 0.12 + ang * 0.2;
        a.y = -0.42 + Math.sin(t * 0.17 + 1) * 0.16;
      }
      aim.current.x += (a.x - aim.current.x) * (active ? 0.07 : 1);
      aim.current.y += (a.y - aim.current.y) * (active ? 0.07 : 1);
      const L1 = norm(aim.current.x, aim.current.y, -0.5);
      const L2 = norm(-aim.current.x * 0.95 - 0.15, -aim.current.y * 0.6 + 0.35, -0.5);

      // the planet turns slowly; the lattice's rotation is what you watch
      const spin = t * 0.07 + 0.6;
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);

      const base: number[] = [];
      const b1: number[][] = [[], [], [], [], []];
      const b2: number[][] = [[], [], [], [], []];

      for (const q of pts.current) {
        const cl = Math.cos(q.lat);
        // sphere point, spun about its axis then tilted toward the viewer
        const x0 = cl * Math.sin(q.lon);
        const y0 = Math.sin(q.lat);
        const z0 = cl * Math.cos(q.lon);
        const x1 = x0 * cs + z0 * sn;
        const z1 = -x0 * sn + z0 * cs;
        const y2 = y0 * ct - z1 * st;
        const z2 = y0 * st + z1 * ct;
        if (z2 <= 0.02) continue;
        const sx = CX + x1 * R;
        const sy = CY - y2 * R;
        if (sx < -20 || sx > STAGE_W + 20 || sy < -20 || sy > STAGE_H + 20) continue;
        const sq = 0.5 + 0.5 * z2; // foreshortening toward the limb
        const d1 = x1 * L1[0] + y2 * -L1[1] * -1 + z2 * L1[2];
        const d2 = x1 * L2[0] + y2 * -L2[1] * -1 + z2 * L2[2];
        const e1 = Math.max(0, d1);
        const e2 = Math.max(0, d2);
        const qt = quiet(sx, sy);
        const lit1 = Math.pow(e1, 1.9) * 2.1 * qt;
        const lit2 = Math.pow(e2, 1.9) * 1.8 * qt;
        const rBase = SP * 0.5 * (0.13 + 0.05 * z2) * sq * (0.5 + 0.5 * qt);
        base.push(sx, sy, rBase);
        if (lit1 > 0.04) {
          const v = Math.min(1, lit1);
          b1[Math.min(4, Math.floor(v * 5))].push(sx, sy, SP * 0.5 * (0.14 + 0.88 * v) * sq);
        }
        if (lit2 > 0.04) {
          const v = Math.min(1, lit2);
          b2[Math.min(4, Math.floor(v * 5))].push(sx, sy, SP * 0.5 * (0.14 + 0.88 * v) * sq);
        }
      }

      const fill = (arr: number[], color: string) => {
        if (!arr.length) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < arr.length; i += 3) {
          ctx.moveTo(arr[i] + arr[i + 2], arr[i + 1]);
          ctx.arc(arr[i], arr[i + 1], arr[i + 2], 0, Math.PI * 2);
        }
        ctx.fill();
      };

      fill(base, "#232a5a");
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) fill(b1[i], BLUE[i]);
      for (let i = 0; i < 5; i++) fill(b2[i], AMBER[i]);

      // soft bloom along each crescent so the rim reads as light, not just dots
      const bloom = (L: readonly number[], rgb: string, a0: number) => {
        const bx = CX + L[0] * R * 0.96;
        const by = CY + L[1] * R * 0.96;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, 520);
        g.addColorStop(0, `rgba(${rgb},${a0})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, STAGE_W, STAGE_H);
      };
      bloom(L1, "70,100,255", 0.2);
      bloom(L2, "255,140,50", 0.15);
    },
    { poster: 3, extraDeps: [] },
  );

  return <div ref={hostRef} className="absolute inset-0" />;
}

export default function Globe({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#04050d">
      <GlobeCanvas />
      <h1 className="absolute right-[120px] top-[96px] text-[156px] font-black leading-[1.0] text-white">
        <span className="block">الذكاء الاصطناعي</span>
        <span className="block">في المجالات الإبداعية</span>
      </h1>
      <p className="absolute left-1/2 top-[800px] -translate-x-1/2 whitespace-nowrap text-[64px] font-bold leading-none">
        <span className="text-[#b4c4ff]">عقل يبدع</span>
        <span className="text-[#6f7699]">، </span>
        <span className="text-[#ffc58a]">ووكيل ينفّذ</span>
      </p>
      <span className="absolute bottom-[84px] left-[120px] text-[28px] font-normal leading-none text-[#aab3d6]">
        تقديم: عبدالملك الهندي
      </span>
      <RakayaLogo height={52} className="absolute left-[120px] top-[84px]" />
    </Stage>
  );
}
