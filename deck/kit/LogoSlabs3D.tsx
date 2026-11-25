"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { prefersReducedMotion } from "./beats";

/**
 * Two app logos as real 3D slabs in one scene, so they share one camera and one perspective (slide 22).
 * The owner's pick from the visual-component-scout shortlist (option 4: three.js slabs, MIT, already installed).
 *
 * Each slab is an extruded rounded square (ExtrudeGeometry, bevelled) whose corner radius matches the app icon;
 * the icon sits on its face as a texture, unlit so its colours stay exact. The slabs open a little away from the
 * centre, where the agent stands (outside the canvas, in the DOM), so their inner edges show their thickness.
 *
 * Per slab: `enterAt` orders the reveal; `gray` shows the face in black and white; `blurIn` makes the face arrive
 * blurred and clear once, for good; `caption` sets a word above the slab (outside the icon, in the same group, so
 * the same perspective) whose three dots come in one by one, fade, and loop gently.
 * `on` plays the reveal from the start; when it is false the loop stops. Reduced motion: everything at rest, sharp,
 * dots shown. Disposed on unmount.
 */

export type Slab = {
  /** official icon file (public path). When absent, `draw` paints a stand-in onto the texture canvas. */
  src?: string;
  draw?: (ctx: CanvasRenderingContext2D, size: number) => void;
  body: string;
  /** ms after `on` when the slab starts to enter */
  enterAt: number;
  /** black and white face */
  gray?: boolean;
  /** a one-off blur (texture px; the texture is 852 px) the face arrives with, then loses for good */
  blurIn?: number;
  /** a word above the slab, followed by three looping dots */
  caption?: string;
};

const TEX = 852;
/**
 * The official DaVinci Resolve icon (852 px) fills its square up to 11 px from each edge (97.4 %) with
 * continuous corners of about a quarter of its side. The slab sits just inside that outline so it never shows
 * past the icon's own rim; stand-ins are drawn to the same outline.
 */
export const ICON_VISIBLE = 0.974;
export const ICON_RADIUS = 0.24;
/** how far each slab opens away from the centre (radians) */
const TURN = 0.34;

// reveal timings (ms), relative to a slab's `enterAt`
const T = { enter: 900, blurHold: 450, blurClear: 750, caption: 1500, captionFade: 500, dots: 400, dotGap: 350, dotIn: 220, dotsHold: 1500, dotsOut: 350, loop: 2500 };

function roundedSquare(size: number, r: number) {
  const s = size / 2;
  const sh = new THREE.Shape();
  sh.moveTo(-s + r, -s);
  sh.lineTo(s - r, -s);
  sh.quadraticCurveTo(s, -s, s, -s + r);
  sh.lineTo(s, s - r);
  sh.quadraticCurveTo(s, s, s - r, s);
  sh.lineTo(-s + r, s);
  sh.quadraticCurveTo(-s, s, -s, s - r);
  sh.lineTo(-s, -s + r);
  sh.quadraticCurveTo(-s, -s, -s + r, -s);
  return sh;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** the icon (or its stand-in) painted once, then turned into textures with whatever filter each needs */
async function iconCanvas(slab: Slab) {
  const art = document.createElement("canvas");
  art.width = art.height = TEX;
  const a = art.getContext("2d")!;
  if (slab.src) a.drawImage(await loadImage(slab.src), 0, 0, TEX, TEX);
  else slab.draw?.(a, TEX);
  return art;
}
function filtered(art: HTMLCanvasElement, filter: string) {
  const out = document.createElement("canvas");
  out.width = out.height = TEX;
  const o = out.getContext("2d")!;
  o.filter = filter || "none";
  o.drawImage(art, 0, 0);
  const t = new THREE.CanvasTexture(out);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** the caption word, left to right, in the deck's own font; returns where the dots go (canvas px) */
const CAP = { w: 1024, h: 256, font: 170, base: 176, dotR: 13, dotGap: 26, dotStep: 38 };
function captionTexture(word: string) {
  const c = document.createElement("canvas");
  c.width = CAP.w;
  c.height = CAP.h;
  const g = c.getContext("2d")!;
  g.font = `900 ${CAP.font}px ${getComputedStyle(document.body).fontFamily}`;
  const ww = g.measureText(word).width;
  const total = ww + CAP.dotGap + 2 * CAP.dotStep + 2 * CAP.dotR;
  const x0 = (CAP.w - total) / 2;
  g.textBaseline = "alphabetic";
  g.fillStyle = "#f4f6f9";
  g.fillText(word, x0, CAP.base);
  const dots = [0, 1, 2].map((i) => x0 + ww + CAP.dotGap + CAP.dotR + i * CAP.dotStep);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return { t, dots };
}

export function LogoSlabs3D({
  right,
  left,
  on,
  width,
  height,
  /** slab side and centre distance from the middle, in stage px */
  size = 380,
  offset = 560,
}: {
  right: Slab;
  left: Slab;
  on: boolean;
  width: number;
  height: number;
  size?: number;
  offset?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onRef = useRef(on);
  // the reveal plays from the moment the slabs are switched on (on mount too)
  const startRef = useRef(on ? performance.now() : 0);
  if (on !== onRef.current) {
    onRef.current = on;
    startRef.current = on ? performance.now() : 0;
  }

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    // one camera for both slabs: px → world at z = 0
    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);
    const unit = height / (2 * 10 * Math.tan(THREE.MathUtils.degToRad(13)));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-4, 5, 6);
    const rim = new THREE.DirectionalLight(0xa5d8ff, 1.2);
    rim.position.set(3, 2, -5);
    const centre = new THREE.PointLight(0xffb25e, 6, 0, 1.6);
    centre.position.set(0, 0.4, 3.5);
    scene.add(key, rim, centre, new THREE.AmbientLight(0xffffff, 0.25));

    const S = size / unit;
    const X = offset / unit;
    const bevel = 0.05;
    const depth = 0.6;
    const side = S * ICON_VISIBLE * 0.985;
    const geo = new THREE.ExtrudeGeometry(roundedSquare(side - 2 * bevel, ICON_RADIUS * side - bevel), {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: 28,
    });
    geo.center();
    const front = depth / 2 + bevel + 0.004;
    const faceGeo = new THREE.PlaneGeometry(S, S);

    const disposables: { dispose: () => void }[] = [geo, faceGeo, env, pmrem];
    type Built = {
      slab: Slab;
      group: THREE.Group;
      side: 1 | -1;
      sharp: THREE.MeshBasicMaterial;
      blurred?: THREE.MeshBasicMaterial;
      word?: THREE.MeshBasicMaterial;
      dots: THREE.MeshBasicMaterial[];
    };
    const built: Built[] = [];
    let disposed = false;

    const make = async (slab: Slab, s: 1 | -1) => {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: slab.body, metalness: 0.65, roughness: 0.26, envMapIntensity: 1.6 });
      group.add(new THREE.Mesh(geo, bodyMat));
      disposables.push(bodyMat);
      const art = await iconCanvas(slab);
      if (disposed) return;
      const tone = slab.gray ? "grayscale(1) contrast(1.2)" : "";
      const sharpMap = filtered(art, tone);
      const sharp = new THREE.MeshBasicMaterial({ map: sharpMap, transparent: true, toneMapped: false });
      const sharpFace = new THREE.Mesh(faceGeo, sharp);
      sharpFace.position.z = front;
      group.add(sharpFace);
      disposables.push(sharp, sharpMap);
      let blurred: THREE.MeshBasicMaterial | undefined;
      if (slab.blurIn) {
        const blurMap = filtered(art, `${tone} blur(${slab.blurIn}px)`.trim());
        blurred = new THREE.MeshBasicMaterial({ map: blurMap, transparent: true, toneMapped: false, depthWrite: false });
        const blurFace = new THREE.Mesh(faceGeo, blurred);
        blurFace.position.z = front + 0.002;
        group.add(blurFace);
        disposables.push(blurred, blurMap);
      }
      let word: THREE.MeshBasicMaterial | undefined;
      const dots: THREE.MeshBasicMaterial[] = [];
      if (slab.caption) {
        await document.fonts.ready;
        if (disposed) return;
        const cap = captionTexture(slab.caption);
        const W = S * 1.3;
        const f = W / CAP.w;
        // above the slab, outside the icon, with a clear gap; in the face's plane, so it shares its perspective
        const cy = S / 2 + S * 0.22;
        word = new THREE.MeshBasicMaterial({ map: cap.t, transparent: true, toneMapped: false, depthWrite: false, opacity: 0 });
        const wordMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, CAP.h * f), word);
        // nudged inward: the slab's turn and the camera's angle push a raised line outward on a side slab
        const nudge = -s * S * 0.11;
        wordMesh.position.set(nudge, cy, front);
        group.add(wordMesh);
        const dotGeo = new THREE.CircleGeometry(CAP.dotR * f, 24);
        for (const dx of cap.dots) {
          const m = new THREE.MeshBasicMaterial({ color: 0xf4f6f9, transparent: true, toneMapped: false, depthWrite: false, opacity: 0 });
          const dot = new THREE.Mesh(dotGeo, m);
          dot.position.set(nudge + (dx - CAP.w / 2) * f, cy + (CAP.h / 2 - (CAP.base - CAP.dotR)) * f, front);
          group.add(dot);
          dots.push(m);
          disposables.push(m);
        }
        disposables.push(cap.t, word, wordMesh.geometry, dotGeo);
      }
      group.position.x = s * X;
      group.visible = false;
      scene.add(group);
      built.push({ slab, group, side: s, sharp, blurred, word, dots });
    };
    make(right, 1);
    make(left, -1);

    const still = prefersReducedMotion();
    const clamp = (t: number) => Math.min(1, Math.max(0, t));
    const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!onRef.current) return;
      const since = now - startRef.current;
      for (const b of built) {
        const t = since - b.slab.enterAt;
        const k = still ? 1 : ease(t / T.enter);
        const sway = still ? 0 : Math.sin(now / 1400) * 0.05;
        b.group.visible = k > 0.001;
        b.group.scale.setScalar(0.8 + 0.2 * k);
        b.group.position.z = -2.5 * (1 - k);
        b.group.position.y = still ? 0 : Math.sin(now / 1100 + (b.side === 1 ? 0 : 1.3)) * 0.05;
        // each opens a little away from the centre, so its inner edge (the slab's thickness) faces the agent;
        // the sway is mirrored so they move as a pair
        b.group.rotation.y = b.side * (TURN + sway) + b.side * 0.8 * (1 - k);
        b.group.rotation.x = 0.08;
        // a one-off blur: it arrives soft, then clears for good
        if (b.blurred) {
          const c = still ? 1 : ease((t - T.blurHold) / T.blurClear);
          b.blurred.opacity = 1 - c;
          b.sharp.opacity = c;
        }
        // the caption, then its dots: in one by one, a pause, out together, again
        if (b.word) {
          const tc = t - T.caption;
          b.word.opacity = still ? 1 : ease(tc / T.captionFade);
          const td = tc - T.dots;
          b.dots.forEach((m, i) => {
            if (still) return void (m.opacity = 1);
            if (td < 0) return void (m.opacity = 0);
            const p = td % T.loop;
            const fadeIn = clamp((p - i * T.dotGap) / T.dotIn);
            const fadeOut = 1 - clamp((p - T.dotsHold) / T.dotsOut);
            m.opacity = Math.min(fadeIn, fadeOut);
          });
        }
      }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [right, left, width, height, size, offset]);

  return <div ref={host} className="absolute inset-0" aria-hidden />;
}
