"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import { Stage, useStage, STAGE_W, STAGE_H } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import { useStageLoop } from "@/lib/useStageLoop";
import { loadCanvasFont } from "@/lib/fonts";

const LINES = ["الذكاء الاصطناعي", "في المجالات الإبداعية"];

const vertex = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tText;
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uTime;
uniform float uIgnite;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float A(vec2 p){ return texture2D(tText, p).a; }

void main(){
  vec2 uv = vUv;
  float asp = uRes.x / uRes.y;
  vec2 toL = uLight - uv;
  vec2 toLa = vec2(toL.x * asp, toL.y);
  float dist = length(toLa);
  vec2 Ldir = normalize(toLa + 1e-5);

  // volumetric transmittance: march from pixel toward the light through the type
  const int N = 72;
  vec2 stepv = toL / float(N);
  float j = hash(uv * uRes + fract(uTime));
  vec2 p = uv + stepv * j;
  float occ = 0.;
  for (int i = 0; i < N; i++) { occ += A(p); p += stepv; }
  occ /= float(N);
  float T = exp(-4.2 * occ);

  float a = A(uv);

  // light falloff (scattering + source)
  float scatter = 1.0 / (1.0 + dist * dist * 12.0);
  float core = exp(-dist * dist * 150.0);
  float halo = exp(-dist * 4.2);

  vec3 ground = vec3(0.010, 0.026, 0.030);
  vec3 sage = vec3(0.70, 0.77, 0.78);
  vec3 warm = vec3(1.0, 0.86, 0.62);

  vec3 rays = mix(sage, warm, clamp(core * 1.4 + halo * 0.5, 0., 1.)) * (scatter * 1.05 + core * 1.8 + halo * 0.3);
  float band = smoothstep(0.0, 0.55, 1.0 - abs(uv.y - 0.52) * 1.7);
  vec3 amb = vec3(0.030, 0.055, 0.060) * band * uIgnite;
  vec3 col = ground + amb * (1.0 - a) + rays * T * uIgnite * (1.0 - a);

  // letter faces: pseudo-normal from the alpha gradient at two radii
  float r1 = 0.0022; float r2 = 0.0065;
  vec2 d1 = vec2(r1 / asp, r1);
  vec2 d2 = vec2(r2 / asp, r2);
  vec2 g = vec2(A(uv + vec2(d1.x, 0.)) - A(uv - vec2(d1.x, 0.)), A(uv + vec2(0., d1.y)) - A(uv - vec2(0., d1.y)));
  vec2 g2 = vec2(A(uv + vec2(d2.x, 0.)) - A(uv - vec2(d2.x, 0.)), A(uv + vec2(0., d2.y)) - A(uv - vec2(0., d2.y)));
  vec2 n = -normalize(g + g2 * 0.6 + 1e-5);              // outward normal
  float edge = clamp(length(g) * 1.4 + length(g2) * 0.6, 0., 1.);
  float facing = max(dot(n, Ldir), 0.);
  float rimFall = 1.0 / (1.0 + dist * dist * 3.0);
  float rim = edge * pow(facing, 1.6) * rimFall * a * uIgnite;
  float bevel = edge * pow(max(dot(n, -Ldir), 0.), 2.0) * a * 0.05;

  vec3 face = vec3(0.004, 0.010, 0.012) + vec3(0.03, 0.045, 0.05) * rimFall * uIgnite * (0.35 + 0.65 * facing);
  col = mix(col, face, a);
  col += (mix(sage, warm, 0.55) * rim * 1.35 + vec3(0.25, 0.4, 0.42) * bevel) * a;

  // vignette + grain
  vec2 q = uv - 0.5;
  col *= 1.0 - dot(q, q) * 0.9;
  col += (hash(uv * uRes + uTime) - 0.5) * 0.028;

  gl_FragColor = vec4(col, 1.0);
}`;

function drawTitle(canvas: HTMLCanvasElement, family: string) {
  const W = canvas.width;
  const H = canvas.height;
  const k = W / STAGE_W;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";
  const target = 1640 * k;
  const sizes = LINES.map((line) => {
    ctx.font = `900 100px ${family}`;
    const w = ctx.measureText(line).width;
    return (100 * target) / w;
  });
  const lineGap = 20 * k;
  const heights = sizes.map((s) => s * 0.74);
  const total = heights.reduce((a, b) => a + b, 0) + lineGap * (LINES.length - 1);
  let y = (H - total) / 2 - 24 * k;
  LINES.forEach((line, i) => {
    y += heights[i];
    ctx.font = `900 ${sizes[i]}px ${family}`;
    ctx.fillText(line, W / 2, y);
    y += lineGap;
  });
}

function EclipseGL() {
  const { scale, pointer, active } = useStage();
  const hostRef = useRef<HTMLDivElement>(null);
  const gl = useRef<{
    renderer: Renderer;
    program: Program;
    mesh: Mesh;
    ready: boolean;
  } | null>(null);
  const light = useRef({ x: 0.82, y: 0.56 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // the canvas is created here (not in JSX) so a strict-mode remount never reuses a lost context
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    hostRef.current!.appendChild(canvas);
    const renderer = new Renderer({ canvas, alpha: false, antialias: false, dpr: 1 });
    const g = renderer.gl;
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 2400;
    texCanvas.height = 1350;
    const texture = new Texture(g, { generateMipmaps: false, minFilter: g.LINEAR, magFilter: g.LINEAR, flipY: true });
    const program = new Program(g, {
      vertex,
      fragment,
      uniforms: {
        tText: { value: texture },
        uRes: { value: [STAGE_W, STAGE_H] },
        uLight: { value: [0.8, 0.55] },
        uTime: { value: 0 },
        uIgnite: { value: 0 },
      },
    });
    const mesh = new Mesh(g, { geometry: new Triangle(g), program });
    gl.current = { renderer, program, mesh, ready: false };
    let dead = false;
    loadCanvasFont(900, "الذكاء الاصطناعي").then((family) => {
      if (dead) return;
      drawTitle(texCanvas, family);
      texture.image = texCanvas;
      texture.needsUpdate = true;
      gl.current!.ready = true;
      setReady(true);
    });
    return () => {
      dead = true;
      g.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
      gl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOnce = () => {
    const s = gl.current;
    if (s && s.ready) s.renderer.render({ scene: s.mesh });
  };

  useEffect(() => {
    const s = gl.current;
    if (!s) return;
    s.renderer.dpr = Math.min(2, Math.max(0.5, scale * (window.devicePixelRatio || 1)));
    s.renderer.setSize(STAGE_W, STAGE_H);
    renderOnce();
  }, [scale]);

  useStageLoop(
    (t) => {
      const s = gl.current;
      if (!s || !s.ready) return;
      // the light: a slow arc behind the type, pulled toward the pointer when present
      const ignite = Math.min(1, Math.max(0, (t - 0.15) / 2.4));
      const eased = ignite * ignite * (3 - 2 * ignite);
      let tx = 0.5 + 0.36 * Math.cos(t * 0.21 + 0.55);
      let ty = 0.52 + 0.2 * Math.sin(t * 0.33 + 1.1);
      const p = pointer.current;
      if (active && p.inside) {
        tx = p.x / STAGE_W;
        ty = 1 - p.y / STAGE_H;
      }
      const k = active ? 0.06 : 1;
      light.current.x += (tx - light.current.x) * k;
      light.current.y += (ty - light.current.y) * k;
      s.program.uniforms.uLight.value = [light.current.x, light.current.y];
      s.program.uniforms.uTime.value = active ? t : 0.37;
      s.program.uniforms.uIgnite.value = eased;
      s.renderer.render({ scene: s.mesh });
    },
    { poster: 4.2, extraDeps: [ready] },
  );

  return (
    <div ref={hostRef} className="absolute inset-0" />
  );
}

export default function Eclipse({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  return (
    <Stage active={active} replay={replay} background="#030a0b">
      <EclipseGL />
      <h1 className="sr-only">الذكاء الاصطناعي في المجالات الإبداعية</h1>

      <div className="absolute inset-x-[140px] bottom-[84px] flex items-end justify-between">
        <p className="text-[60px] font-medium leading-none text-[#dfe8e8]">
          <span className="text-[#ffe2a8]">عقل يبدع</span>، ووكيل ينفّذ
        </p>
        <div className="flex flex-col items-start gap-7">
          <span className="text-[34px] font-normal leading-none text-[#9fb3b5]">تقديم: عبدالملك الهندي</span>
        </div>
      </div>
      <RakayaLogo height={54} className="absolute left-[140px] top-[84px] opacity-95" />
    </Stage>
  );
}
