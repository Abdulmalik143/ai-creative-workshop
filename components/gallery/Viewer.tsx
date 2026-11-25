"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { covers } from "@/covers/registry";

export function Viewer({ id }: { id: string }) {
  const router = useRouter();
  const index = covers.findIndex((c) => c.id === id);
  const cover = covers[index];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [full, setFull] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (d: number) => router.push(`/cover/${covers[(index + d + covers.length) % covers.length].id}`),
    [index, router],
  );

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  }, []);

  const wake = useCallback(() => {
    setChrome(true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setChrome(false), 2600);
  }, []);

  useEffect(() => {
    wake();
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [wake]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      wake();
      if (e.key === "ArrowLeft") go(1); // RTL: left is forward
      else if (e.key === "ArrowRight") go(-1);
      else if (e.key === "r" || e.key === "R" || e.key === "ق") setReplay((n) => n + 1);
      else if (e.key === "f" || e.key === "F" || e.key === "ب") toggleFull();
      else if (e.key === "Escape" && !document.fullscreenElement) router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, router, toggleFull, wake]);

  const { Component } = cover;
  const btn =
    "rounded-full bg-white/10 px-5 py-2.5 text-[16px] font-medium text-[#eef3f3] backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6]";

  return (
    <div
      ref={wrapRef}
      className="relative flex h-dvh w-screen items-center justify-center bg-black"
      onPointerMove={wake}
    >
      <div className="w-[min(100vw,calc(100dvh*16/9))]">
        <Component active replay={replay} />
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-black/70 to-transparent p-5 transition-opacity duration-500 ${chrome ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!chrome}
      >
        <div className="pointer-events-auto flex items-center gap-3">
          <Link href="/" className={btn}>
            المعرض
          </Link>
          <span className="text-[18px] font-bold text-white/90">{cover.name}</span>
          <span className="hidden text-[15px] text-white/60 md:inline">{cover.hint}</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button className={btn} onClick={() => go(-1)} aria-label="الغلاف السابق">
            السابق
          </button>
          <button className={btn} onClick={() => go(1)} aria-label="الغلاف التالي">
            التالي
          </button>
          <button className={btn} onClick={() => setReplay((n) => n + 1)}>
            إعادة الحركة
          </button>
          <button className={btn} onClick={toggleFull}>
            {full ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          </button>
        </div>
      </div>
    </div>
  );
}
