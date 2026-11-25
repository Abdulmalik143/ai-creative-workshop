"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { prefersReducedMotion } from "./beats";

/**
 * The presenter's watch (Loon Watch V4), loaded from the glTF exported from their own .blend (MEDIA.s27.model).
 * `phase` shows how a model comes together, as an illustration (not a claim about how every real build runs):
 *   0 hidden · 1 base shape (case only, wireframe) · 2 details (every exterior part, clay) ·
 *   3 materials (the project's own materials) · 4 final (studio light, slow turntable)
 * The render loop only runs while phase > 0, and everything is disposed when the slide unmounts.
 */

/** the case: what "base shape" shows */
const BASE = new Set(["Assembly_05_Main_Chassis", "Assembly_04_Front_Bezel"]);

export function WatchModel({ src, phase, width, height }: { src: string; phase: number; width: number; height: number }) {
  const host = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  const api = useRef<{ apply: (p: number) => void } | null>(null);
  phaseRef.current = phase;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.01, 100);
    camera.position.set(0, 0.35, 6.2);
    camera.lookAt(0, 0, 0);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 4, 5);
    const rim = new THREE.DirectionalLight(0xa5d8ff, 1.4);
    rim.position.set(4, 2, -4);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

    const pivot = new THREE.Group();
    scene.add(pivot);
    const clay = new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.72, metalness: 0.05 });
    const wire = new THREE.MeshBasicMaterial({ color: 0xa5d8ff, wireframe: true, transparent: true, opacity: 0.75 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0, transparent: true, opacity: 0.12, clearcoat: 1 });
    const meshes: { mesh: THREE.Mesh; orig: THREE.Material | THREE.Material[]; base: boolean }[] = [];
    let disposed = false;

    const apply = (p: number) => {
      for (const m of meshes) {
        m.mesh.visible = p >= 2 || (p === 1 && m.base);
        m.mesh.material = p === 1 ? wire : p === 2 ? clay : m.orig;
      }
      // a dim studio, like the project's dark cyclorama: the materials are near-black graphite and silicone
      scene.environment = p >= 3 ? env : null;
      scene.environmentIntensity = p >= 4 ? 0.55 : 0.45;
      renderer.toneMappingExposure = p >= 4 ? 1.05 : 1;
    };
    api.current = { apply };

    new GLTFLoader().load(src, (gltf) => {
      if (disposed) return;
      const root = gltf.scene;
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        // a stray helper cube in the file, never rendered in the project
        if (mesh.name === "Cube") {
          mesh.visible = false;
          return;
        }
        // the assembly tag rides on the object or one of its parents (glTF extras → userData)
        let a: unknown;
        for (let n: THREE.Object3D | null = mesh; n && !a; n = n.parent) a = n.userData?.assembly;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isGlass = /glass/i.test(mat?.name ?? "");
        meshes.push({ mesh, orig: isGlass ? glass : mesh.material, base: typeof a === "string" && BASE.has(a) });
      });
      // the .blend has the watch lying face up (+Z in Blender, +Y here): stand it up, face to the camera
      const orient = new THREE.Group();
      orient.rotation.x = Math.PI / 2;
      orient.add(root);
      const fit = new THREE.Group();
      fit.add(orient);
      fit.updateMatrixWorld(true);
      // centre and fit
      const box = new THREE.Box3().setFromObject(fit);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const k = 2.4 / Math.max(size.x, size.y, size.z);
      fit.scale.setScalar(k);
      fit.position.copy(centre).multiplyScalar(-k);
      pivot.add(fit);
      apply(phaseRef.current);
    });

    const still = prefersReducedMotion();
    let raf = 0;
    let last = performance.now();
    let spin = -0.5;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = phaseRef.current;
      if (p <= 0) return;
      if (!still) {
        if (p >= 4) spin += dt * 0.55;
        else spin = -0.5 + Math.sin(now / 1800) * 0.25;
      }
      pivot.rotation.y = spin;
      pivot.rotation.x = 0.12;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      for (const m of meshes) (Array.isArray(m.orig) ? m.orig : [m.orig]).forEach((mt) => mt.dispose());
      [clay, wire, glass].forEach((mt) => mt.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, [src, width, height]);

  useEffect(() => {
    api.current?.apply(phase);
  }, [phase]);

  return <div ref={host} className="absolute inset-0" aria-label="مجسم ساعة Loon Watch V4 من ملف المشروع" role="img" />;
}
