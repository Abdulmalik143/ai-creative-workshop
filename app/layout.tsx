import type { Metadata } from "next";
import "./globals.css";
import "@/presentation/covers/covers.css";
import "@/presentation/covers/motion.css";
import "@/presentation/covers/lab/lab.css";
import "@/presentation/covers/lab/lab-motion.css";
import "@/presentation/covers/studio/studio.css";
import "@/presentation/covers/studio/studio-motion.css";

export const metadata: Metadata = {
  icons: { icon: "/brand/rakaya.svg" },
  title: "الذكاء الاصطناعي في المجالات الإبداعية | معرض الثيمات",
  description: "معرض الأغلفة التفاعلية لورشة الذكاء الاصطناعي في المجالات الإبداعية.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
