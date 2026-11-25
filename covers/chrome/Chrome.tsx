"use client";

import { Stage } from "@/components/stage/Stage";
import { RakayaLogo } from "@/components/stage/Brand";
import LiquidChrome from "@/components/reactbits/LiquidChrome";

/**
 * The title is a set of windows cut into black; behind them, liquid chrome that never stops flowing.
 * The words step down the frame the way the sentence resolves: from the field, to its domain, to the one word that matters.
 */

const word = "absolute font-black leading-none whitespace-nowrap";

export default function Chrome({ active = true, replay = 0 }: { active?: boolean; replay?: number }) {
  const lines = (
    <>
      <span className={`${word} right-[110px] top-[70px] text-[190px]`}>الذكاء الاصطناعي</span>
      <span className={`${word} right-[470px] top-[262px] text-[190px]`}>في المجالات</span>
      <span className={`${word} left-[84px] top-[455px] text-[440px]`}>الإبداعية</span>
    </>
  );
  return (
    <Stage active={active} replay={replay} background="#050607">
      <h1 className="sr-only">الذكاء الاصطناعي في المجالات الإبداعية</h1>
      <div className="absolute inset-0">
        <LiquidChrome
          color="#b9c9cc"
          speed={0.5}
          exposure={1.45}
          interactive={active}
          intro={false}
          maxDevicePixelRatio={1.5}
        />
      </div>
      {/* black plate with the words knocked out: chrome only shows through the letters */}
      <div className="absolute inset-0 bg-[#050607] text-white" style={{ mixBlendMode: "multiply" }} aria-hidden>
        {lines}
      </div>
      {/* a faint veil keeps every letter readable where the chrome goes dark */}
      <div className="pointer-events-none absolute inset-0 text-[#b9c9cc] opacity-[0.15]" aria-hidden>
        {lines}
      </div>

      <p className="absolute left-[110px] top-[96px] text-[54px] font-medium leading-snug text-[#dfe8e8]">
        <span className="block text-white">عقل يبدع،</span>
        <span className="block text-[#9fb3b5]">ووكيل ينفّذ</span>
      </p>
      <RakayaLogo height={52} className="absolute right-[110px] bottom-[70px]" />
      <span className="absolute left-[110px] top-[262px] text-[30px] font-normal leading-none text-[#9fb3b5]">
        تقديم: عبدالملك الهندي
      </span>
    </Stage>
  );
}
