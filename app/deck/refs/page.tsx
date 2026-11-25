import type { Metadata } from "next";
import Link from "next/link";
import { RESOURCES, TRACKS } from "@/deck/content/resources";
import { KindBadge, ResourceMark } from "@/deck/kit/ResourceReference";

export const metadata: Metadata = {
  title: "المراجع · الذكاء الاصطناعي في المجالات الإبداعية",
};

/**
 * The tools and references of the five practical tracks (slides 19–33), grouped by track. Names only: the deck shows
 * no external links or addresses (the presenter hands out a references file). Data: deck/content/resources.ts.
 */
export default function RefsPage() {
  return (
    <main dir="rtl" className="min-h-screen px-6 pb-24 pt-14 md:px-12" style={{ background: "#05080d", color: "#e8eef6" }}>
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12">
        <header className="flex flex-col gap-3">
          <Link href="/deck" className="w-fit text-[16px] text-[#8093a6] underline decoration-white/20 underline-offset-4 hover:text-white">
            العرض
          </Link>
          <h1 className="m-0 text-[clamp(30px,4vw,52px)] font-black leading-tight">مراجع الورشة</h1>
          <p className="m-0 max-w-[760px] text-[clamp(16px,1.5vw,20px)] leading-relaxed text-[#8093a6]">
            أدوات ومراجع كل مسار. «رسمي» من الجهة نفسها، «مجتمعي» أداة أو شرح من خارجها، و«شرح فيديو» شرح من صانع محتوى.
          </p>
        </header>

        {TRACKS.map((t) => {
          const list = RESOURCES.filter((r) => r.track === t.id);
          if (!list.length) return null;
          return (
            <section key={t.id} className="flex flex-col gap-4">
              <h2 className="m-0 flex items-baseline gap-4 text-[clamp(22px,2.4vw,32px)] font-black">
                {t.name}
                <span className="text-[16px] font-medium text-[#8093a6]">
                  {t.slides.length > 1 ? "السلايدات" : "السلايد"} {t.slides.join("، ")}
                </span>
              </h2>
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                {list.map((r) => (
                  <li key={r.id}>
                    <div className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0a1018] p-4">
                      <ResourceMark r={r} size={52} />
                      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="flex flex-wrap items-center gap-3">
                          <span dir="ltr" className="text-[18px] font-bold text-[#f6f8ff]">
                            {r.name}
                          </span>
                          <KindBadge r={r} size={13} />
                        </span>
                        {r.what && <span className="text-[15px] text-[#c9d4df]">{r.what}</span>}
                        {r.note && <span className="text-[14px] text-[#ffc94d]">{r.note}</span>}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
