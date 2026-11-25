import Link from "next/link";
import { labMeta } from "@/components/lab/meta";

export const metadata = { title: "معمل المكوّنات" };

export default function LabIndex() {
  return (
    <main className="mx-auto max-w-[1300px] px-6 pb-24 pt-14 md:px-12">
      <header className="mb-12 flex flex-col gap-3">
        <Link href="/" className="w-fit text-[16px] text-[#7f9296] underline decoration-white/20 underline-offset-4 hover:text-white">
          الأغلفة
        </Link>
        <h1 className="text-[clamp(28px,4vw,52px)] font-black leading-tight text-[#eef3f3]">معمل المكوّنات</h1>
        <p className="max-w-[760px] text-[clamp(16px,1.5vw,21px)] text-[#8fa3a6]">
          سبعة عشر مكوّنًا للشرح، كل واحد يُجرَّب وحده على مسرح 16:9 ويُعاد استخدامه لاحقًا داخل العرض.
        </p>
      </header>
      <ol className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
        {labMeta.map((m) => (
          <li key={m.slug} className="border-t border-white/10">
            <Link href={`/lab/${m.slug}`} className="group flex gap-6 py-6 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b3c4c6]">
              <span className="w-12 flex-none text-[34px] font-black leading-none text-[#ff7a00] tabular-nums">{String(m.no).padStart(2, "0")}</span>
              <span className="flex flex-col gap-2">
                <span className="text-[24px] font-bold text-[#eef3f3] transition-colors group-hover:text-[#ffb25e]">{m.title}</span>
                <span className="text-[17px] leading-relaxed text-[#8fa3a6]">{m.does}</span>
                <span className="text-[14px] text-[#5d6f73]">
                  {m.steps ? `${m.steps} مراحل` : "مستقل"}
                  {m.ref ? " · من React Bits" : ""}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
