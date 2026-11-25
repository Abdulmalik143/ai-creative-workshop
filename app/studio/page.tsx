import type { Metadata } from "next";
import { Gallery } from "@/presentation/player/Gallery";

export const metadata: Metadata = {
  title: "الأغلفة الإبداعية | معرض أغلفة الورشة",
  description: "خمسة عشر غلافًا تفاعليًا لورشة الذكاء الاصطناعي في المجالات الإبداعية.",
};

export default function Studio() {
  return <Gallery collection="studio" />;
}
