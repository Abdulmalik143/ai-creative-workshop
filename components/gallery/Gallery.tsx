"use client";

import Link from "next/link";
import { useState } from "react";
import { covers, type CoverMeta } from "@/covers/registry";

function Card({ c, hot, setHot }: { c: CoverMeta; hot: string | null; setHot: (id: string | null) => void }) {
  const { id, name, idea, theme, Component } = c;
  return (
    <li>
      <Link
        href={`/cover/${id}`}
        className="group block rounded-[14px] outline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6]"
        onPointerEnter={() => setHot(id)}
        onPointerLeave={() => setHot(null)}
        onFocus={() => setHot(id)}
        onBlur={() => setHot(null)}
      >
        <div className="overflow-hidden rounded-[14px] ring-1 ring-white/10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1">
          <Component active={hot === id} />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-6">
          <span className="flex items-center gap-3 text-[26px] font-bold text-[#eef3f3]">
            {name}
            {theme && (
              <span className="rounded-full border border-white/15 px-3 py-1 text-[14px] font-medium text-[#8fa3a6]">
                {theme === "dark" ? "داكن" : "فاتح"}
              </span>
            )}
          </span>
          <span className="text-[17px] font-normal text-[#8fa3a6]">{idea}</span>
        </div>
      </Link>
    </li>
  );
}

export function Gallery() {
  const [hot, setHot] = useState<string | null>(null);
  const approved = covers.filter((c) => c.approved);
  const first = covers.filter((c) => c.group !== "canvas" && !c.approved);
  const canvas = covers.filter((c) => c.group === "canvas" && !c.approved);
  const grid = "grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-2";
  return (
    <div className="flex flex-col gap-24">
      <section aria-labelledby="g0">
        <h2 id="g0" className="mb-8 text-[30px] font-black text-[#eef3f3]">الغلاف المعتمد</h2>
        <ul className="grid grid-cols-1 gap-8 lg:max-w-[1000px]">{approved.map((c) => <Card key={c.id} c={c} hot={hot} setHot={setHot} />)}</ul>
      </section>
      <section aria-labelledby="g1">
        <h2 id="g1" className="mb-2 text-[30px] font-black text-[#eef3f3]">مراجع: الدفعة الأولى</h2>
        <p className="mb-8 text-[18px] text-[#8fa3a6]">مرجع للتصميم لاحقًا، ليست للاعتماد.</p>
        <ul className={grid}>{first.map((c) => <Card key={c.id} c={c} hot={hot} setHot={setHot} />)}</ul>
      </section>
      <section aria-labelledby="g2">
        <h2 id="g2" className="text-[30px] font-black text-[#eef3f3]">مراجع: تطوير فكرة «لوحة»</h2>
        <p className="mb-8 mt-2 text-[18px] text-[#8fa3a6]">
          الفكرة نفسها: عقل يتبع مؤشرك، ووكيل يحوّل حركته إلى تنفيذ دقيق. في أدوات إبداع مختلفة، نصفها داكن ونصفها فاتح.
        </p>
        <ul className={grid}>{canvas.map((c) => <Card key={c.id} c={c} hot={hot} setHot={setHot} />)}</ul>
      </section>
    </div>
  );
}
