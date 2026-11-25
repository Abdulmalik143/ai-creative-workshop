"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, MONO, type LabProps } from "../tokens";
import { useMounted } from "../kit/useMounted";

/**
 * Slide 8: one motion shown two ways.
 * Left: a live element animated by CSS. The code block is the exact CSS this cube runs on: the same string is
 * injected into the page and printed on screen.
 * Right: video, frame by frame. One front window that never moves and holds one still: one frame.
 * Behind it, a stack of identical windows, each holding its own still of the same cube at a later moment.
 * Only those back cards move: they step toward the front at a calm rhythm and slip behind it, like the rest of
 * the frames passing behind the preview. Nothing inside any card ever moves.
 * The stills are rendered locally from the same geometry: a simulation of video frames.
 */

const DUR = 3; // seconds for one full turn
const FPS = 24;
const N = DUR * FPS; // 72 frames, 5 degrees apart
const TILT = -24; // camera: rotateX
const PERSPECTIVE = 900;
const V = 340; // viewport (px) of the cube on both sides
const S = 200; // cube edge

/** The motion code. This exact text is both applied and displayed. */
const MOTION_CSS = `.cube-scene {
  perspective: ${PERSPECTIVE}px;
}
.cube {
  transform-style: preserve-3d;
  animation: cube-spin ${DUR}s linear infinite;
}
@keyframes cube-spin {
  from {
    transform: rotateX(${TILT}deg) rotateY(0deg);
  }
  to {
    transform: rotateX(${TILT}deg) rotateY(360deg);
  }
}`;

type Face = { axis: "X" | "Y"; deg: number; fill: string; pip: string; n: number };
// six distinct faces: colour and pip count both change, so every quarter turn reads at a glance
const FACES: Face[] = [
  { axis: "Y", deg: 0, fill: T.orange, pip: "#1a0c00", n: 1 },
  { axis: "Y", deg: 90, fill: T.sage, pip: T.ink, n: 2 },
  { axis: "Y", deg: 180, fill: T.mist, pip: T.ink, n: 3 },
  { axis: "Y", deg: -90, fill: T.orangeSoft, pip: "#1a0c00", n: 4 },
  { axis: "X", deg: 90, fill: "#4d6f74", pip: T.mist, n: 5 },
  { axis: "X", deg: -90, fill: T.orangeDeep, pip: T.mist, n: 6 },
];
const O = 52;
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-O, -O], [O, O]],
  3: [[-O, -O], [0, 0], [O, O]],
  4: [[-O, -O], [O, -O], [-O, O], [O, O]],
  5: [[-O, -O], [O, -O], [0, 0], [-O, O], [O, O]],
  6: [[-O, -O], [O, -O], [-O, 0], [O, 0], [-O, O], [O, O]],
};
const PIP_R = 17;
const EDGE = "rgba(7,11,14,0.55)";

// ---------- the same geometry, for the still pictures ----------
type P3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const rotY = ([x, y, z]: P3, a: number): P3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotX = ([x, y, z]: P3, a: number): P3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
/** CSS order: face `rotate(face) translateZ(S/2)`, then cube `rotateX(TILT) rotateY(angle)` */
function world(f: Face, u: number, v: number, angle: number, dz = S / 2): P3 {
  let p: P3 = [u, v, dz];
  p = f.axis === "Y" ? rotY(p, rad(f.deg)) : rotX(p, rad(f.deg));
  p = rotY(p, rad(angle));
  return rotX(p, rad(TILT));
}
/** CSS perspective, origin at the centre of the viewport */
const project = ([x, y, z]: P3, c: number, k: number) => [c + ((x * PERSPECTIVE) / (PERSPECTIVE - z)) * k, c + ((y * PERSPECTIVE) / (PERSPECTIVE - z)) * k] as const;

function drawCube(ctx: CanvasRenderingContext2D, angle: number, k: number) {
  const W = V * k;
  ctx.fillStyle = T.panel2;
  ctx.fillRect(0, 0, W, W);
  const c = W / 2;
  const h = S / 2;
  for (const f of FACES) {
    const centre = world(f, 0, 0, angle);
    const inner = world(f, 0, 0, angle, 0);
    const normal: P3 = [centre[0] - inner[0], centre[1] - inner[1], centre[2] - inner[2]];
    const toEye: P3 = [-centre[0], -centre[1], PERSPECTIVE - centre[2]];
    if (normal[0] * toEye[0] + normal[1] * toEye[1] + normal[2] * toEye[2] <= 0) continue;
    const corners = ([[-h, -h], [h, -h], [h, h], [-h, h]] as const).map(([u, v]) => project(world(f, u, v, angle), c, k));
    ctx.save();
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = f.fill;
    ctx.fill();
    ctx.clip();
    ctx.lineWidth = 8 * k;
    ctx.strokeStyle = EDGE;
    ctx.stroke();
    ctx.fillStyle = f.pip;
    for (const [px, py] of PIPS[f.n]) {
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const [x, y] = project(world(f, px + Math.cos(a) * PIP_R, py + Math.sin(a) * PIP_R, angle), c, k);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.fill();
    }
    ctx.restore();
  }
}

// ---------- the live cube ----------
function LiveCube({ delay, playing }: { delay: number; playing: boolean }) {
  return (
    <div className="cube-scene relative overflow-hidden rounded-[14px]" style={{ width: V, height: V, background: T.panel2 }}>
      <div
        className="cube absolute"
        style={{ left: (V - S) / 2, top: (V - S) / 2, width: S, height: S, animationDelay: `${-delay}s`, animationPlayState: playing ? "running" : "paused" }}
      >
        {FACES.map((f) => (
          <div
            key={f.n}
            className="absolute inset-0"
            style={{ background: f.fill, boxShadow: `inset 0 0 0 4px ${EDGE}`, transform: `rotate${f.axis}(${f.deg}deg) translateZ(${S / 2}px)` }}
          >
            {PIPS[f.n].map(([x, y], i) => (
              <span key={i} className="absolute rounded-full" style={{ left: S / 2 + x - PIP_R, top: S / 2 + y - PIP_R, width: PIP_R * 2, height: PIP_R * 2, background: f.pip }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const fmt = (n: number) => String((((n % N) + N) % N) + 1).padStart(2, "0");

// ---------- the frame stack ----------
const IMG = 300; // still size in a window
const BAR = 38; // window title bar
const DX = -96; // each card further back sits this far toward the left (the reading direction)
const DY = -18;
const SHRINK = 0.04;
const BACK = 4; // back cards on show (plus one entering and one slipping behind the front)
const BEAT = 1500; // ms between steps of the stack: calm, not video speed
const GAP = 3; // frames between neighbouring cards in the stack, so the stills differ enough to read (15 degrees)

function slotStyle(k: number): React.CSSProperties {
  const kk = Math.max(0, k);
  return {
    transform: `translate(${DX * kk}px, ${DY * kk}px) scale(${1 - SHRINK * kk})`,
    opacity: k <= 0 || k > BACK ? 0 : 1,
    filter: `brightness(${1 - 0.13 * kk})`,
    zIndex: 20 - kk,
  };
}

function Window({ src, n, front }: { src?: string; n: number; front?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[14px]" style={{ width: IMG, background: T.panel2, border: `2px solid ${front ? T.orange : T.lineStrong}`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
      <div className="flex items-center justify-between px-[14px]" style={{ height: BAR, background: "#0b1215", borderBottom: `1px solid ${T.line}` }}>
        <span className="flex gap-[6px]">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-[9px] w-[9px] rounded-full" style={{ background: front ? T.orange : "#2a3a3f" }} />
          ))}
        </span>
        <span dir="ltr" className="text-[18px] font-bold tabular-nums" style={{ color: front ? T.orange : T.sage, fontFamily: MONO }}>
          frame {fmt(n)}
        </span>
      </div>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={IMG} height={IMG} draggable={false} className="block" style={{ width: IMG, height: IMG }} />
      ) : (
        <div style={{ width: IMG, height: IMG }} />
      )}
    </div>
  );
}

export function InfographicCompare({ replay = 0 }: LabProps) {
  const mounted = useMounted();
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0); // the still in the front window; also where the live cube rests when paused
  const [tick, setTick] = useState(0); // how far the stream behind the front has moved
  const [cubeKey, setCubeKey] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const playFrom = useRef({ t0: 0, f0: 0 });

  // the stills: rendered once from the same geometry and camera as the live cube
  useEffect(() => {
    if (!mounted) return;
    const k = 1.5;
    const cv = document.createElement("canvas");
    cv.width = cv.height = V * k;
    const ctx = cv.getContext("2d")!;
    setFrames(
      Array.from({ length: N }, (_, i) => {
        drawCube(ctx, (i * 360) / N, k);
        return cv.toDataURL("image/png");
      }),
    );
  }, [mounted]);

  // replay: back to frame 0, playing
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFrame(0);
    setTick(0);
    setPlaying(!reduce);
    setCubeKey((n) => n + 1);
  }, [replay]);

  // where the live cube is, so pausing can stop both sides on the same moment
  useEffect(() => {
    if (playing) playFrom.current = { t0: performance.now(), f0: frame };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, cubeKey]);

  // the stream behind the front window: one calm step at a time while playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((n) => n + 1), BEAT);
    return () => clearInterval(id);
  }, [playing]);

  const toggle = useCallback(() => {
    if (playing) {
      const { t0, f0 } = playFrom.current;
      const f = (f0 + Math.floor(((performance.now() - t0) / 1000) * FPS)) % N;
      setFrame(f); // the front window now shows the still of the moment the code paused on
      setTick(0);
      setPlaying(false);
    } else setPlaying(true);
    setCubeKey((n) => n + 1);
  }, [playing]);

  const step = useCallback(
    (d: 1 | -1) => {
      if (playing) return;
      setFrame((f) => (f + d + N) % N);
      setCubeKey((n) => n + 1);
    },
    [playing],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      } else if (e.key === "ArrowLeft") {
        e.stopPropagation();
        step(1); // RTL: left is forward
      } else if (e.key === "ArrowRight") {
        e.stopPropagation();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [toggle, step]);

  const angle = Math.round((frame * 360) / N);
  // back cards are keyed by their place in the stream, so each one keeps its still as it moves forward
  const back = Array.from({ length: BACK + 2 }, (_, k) => tick + k);
  const btn =
    "flex h-[76px] items-center rounded-full px-[38px] text-[30px] font-bold transition-colors disabled:opacity-30 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#ffb25e]";

  return (
    <div className="absolute inset-0" style={{ background: T.ink }}>
      <style>{MOTION_CSS}</style>

      <h2 className="absolute right-[80px] top-[52px] m-0 text-[60px] font-black leading-none" style={{ color: T.mist }}>
        نفس الحركة بطريقتين
      </h2>
      <p className="absolute right-[80px] top-[128px] m-0 text-[28px]" style={{ color: T.dim }}>
        مكعب واحد يدور دورة كاملة في {DUR} ثوانٍ، بنفس الشكل والألوان وزاوية الكاميرا.
      </p>

      {/* RIGHT: video, frame by frame */}
      <section className="absolute top-[190px] h-[690px] w-[720px] overflow-hidden rounded-[22px]" style={{ right: 80, background: T.panel, border: `1.5px solid ${T.line}` }} aria-label="تشغيل الفيديو إطارًا بإطار">
        <div className="absolute inset-x-[30px] top-[26px] z-30 flex items-center justify-between">
          <h3 className="m-0 text-[36px] font-black" style={{ color: T.mist }}>تشغيل الفيديو إطارًا بإطار</h3>
          <span className="rounded-full px-[16px] py-[6px] text-[20px] font-bold" style={{ color: T.orangeSoft, border: `1.5px solid ${T.orangeSoft}` }}>محاكاة إطارات الفيديو</span>
        </div>

        {/* the stack: right edge of every card is anchored to the front window's right edge */}
        <div className="absolute" style={{ right: 30, top: 170, width: IMG, height: IMG + BAR }}>
          {back.map((fi, k) => (
            <div
              key={fi}
              className="absolute right-0 top-0"
              style={{ ...slotStyle(k), transformOrigin: "right center", transition: "transform .75s cubic-bezier(.45,0,.2,1), opacity .6s ease, filter .75s ease" }}
              aria-hidden
            >
              <Window src={frames[(frame + fi * GAP) % N]} n={frame + fi * GAP} />
            </div>
          ))}
          {/* the front window: fixed, one still, on top of everything */}
          <div className="absolute right-0 top-0" style={{ zIndex: 40 }}>
            <Window src={frames[frame]} n={frame} front />
          </div>
        </div>

        {/* what is what */}
        <div className="absolute z-30 text-center text-[26px] font-bold" style={{ right: 30, top: 170 + IMG + BAR + 20, width: IMG, color: T.orange }}>
          هذا إطار واحد
        </div>
        <div className="absolute z-30 text-center text-[26px] font-bold" style={{ left: 30, top: 170 + IMG + BAR + 20, width: 330, color: T.sage }}>
          وهذه بقية الإطارات
        </div>

        <div className="absolute inset-x-[30px] bottom-[28px] z-30 flex items-baseline justify-between gap-[20px] whitespace-nowrap">
          <span className="text-[24px] font-bold" style={{ color: T.mist }}>
            {playing ? "24 صورة ثابتة في الثانية، واحدة تلو الأخرى" : `صورة ثابتة واحدة: الإطار ${fmt(frame)}`}
          </span>
          <span dir="ltr" className="text-[32px] font-bold tabular-nums" style={{ color: T.orange, fontFamily: MONO }}>
            {fmt(frame)} / {N}
          </span>
        </div>
      </section>

      {/* LEFT: one element moved by code */}
      <section className="absolute top-[190px] h-[690px] w-[960px] rounded-[22px]" style={{ left: 80, background: T.panel, border: `1.5px solid ${T.line}` }} aria-label="تحريك عنصر بالكود">
        <div className="absolute inset-x-[30px] top-[26px] flex items-center justify-between">
          <h3 className="m-0 text-[36px] font-black" style={{ color: T.mist }}>تحريك عنصر بالكود</h3>
          <span dir="ltr" className="rounded-full px-[16px] py-[6px] text-[20px] font-bold" style={{ color: T.sage, border: `1.5px solid ${T.lineStrong}`, fontFamily: MONO }}>CSS</span>
        </div>
        <div className="absolute right-[30px] top-[108px]">
          <LiveCube key={cubeKey} delay={frame / FPS} playing={playing} />
        </div>
        <div className="absolute left-[30px] top-[108px] w-[530px]">
          <pre dir="ltr" className="m-0 whitespace-pre rounded-[14px] p-[22px]" style={{ background: "#0b1215", border: `1px solid ${T.line}`, fontFamily: MONO, fontSize: 17, lineHeight: 1.6, color: T.sage }}>
            {MOTION_CSS.split("\n").map((line, i) => (
              <div key={i} style={{ color: /animation|@keyframes|transform:/.test(line) ? T.orangeSoft : undefined }}>
                {line || " "}
              </div>
            ))}
          </pre>
          <div dir="ltr" className="mt-[12px] rounded-[10px] px-[22px] py-[10px]" style={{ fontFamily: MONO, fontSize: 18, color: T.dim, border: `1px dashed ${T.line}` }}>
            animation-play-state: <span style={{ color: playing ? T.orange : T.mist }}>{playing ? "running" : "paused"}</span>;
          </div>
        </div>
        <p className="absolute inset-x-[30px] bottom-[30px] m-0 text-[28px] font-bold" style={{ color: T.mist }}>
          {playing ? (
            "العنصر نفسه يتحرك بلا توقف"
          ) : (
            <>
              نفس العنصر بزاوية جديدة: <span dir="ltr" style={{ fontFamily: MONO, color: T.orange }}>rotateY({angle}deg)</span>
            </>
          )}
        </p>
      </section>

      {/* one set of controls for both sides */}
      <div className="absolute bottom-[56px] left-1/2 flex -translate-x-1/2 items-center gap-[20px]">
        <button className={btn} style={{ background: T.orange, color: "#1a0c00" }} onClick={toggle}>
          {playing ? "إيقاف" : "تشغيل"}
        </button>
        <button className={btn} style={{ background: T.panel2, color: T.mist, border: `1.5px solid ${T.lineStrong}` }} onClick={() => step(-1)} disabled={playing}>
          الإطار السابق
        </button>
        <button className={btn} style={{ background: T.panel2, color: T.mist, border: `1.5px solid ${T.lineStrong}` }} onClick={() => step(1)} disabled={playing}>
          الإطار التالي
        </button>
      </div>
    </div>
  );
}
