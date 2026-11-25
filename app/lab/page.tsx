import type { Metadata } from "next";
import { Gallery } from "@/presentation/player/Gallery";

export const metadata: Metadata = {
  title: "المختبر الرقمي | معرض أغلفة الورشة",
  description: "عشرة أغلفة تفاعلية تستكشف توجه المختبر الرقمي.",
};

export default function Lab() {
  return <Gallery collection="lab" />;
}
