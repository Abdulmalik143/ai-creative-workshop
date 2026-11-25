import Link from "next/link";
import { Gallery } from "@/components/gallery/Gallery";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1500px] px-6 pb-24 pt-14 md:px-12">
      <header className="mb-12 flex flex-col gap-3">
        <h1 className="text-[clamp(28px,4vw,52px)] font-black leading-tight text-[#eef3f3]">
          الذكاء الاصطناعي في المجالات الإبداعية
        </h1>
        <p className="text-[clamp(16px,1.6vw,22px)] font-normal text-[#8fa3a6]">
          أغلفة تفاعلية بنسبة 16:9. مرّر المؤشر على الغلاف ليتحرك، وانقر لفتحه بملء الشاشة.
        </p>
      </header>
      <Link href="/lab" className="mb-14 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-[20px] font-bold text-[#eef3f3] transition-colors hover:bg-white/10">
        معمل المكوّنات
      </Link>
      <Gallery />
    </main>
  );
}
