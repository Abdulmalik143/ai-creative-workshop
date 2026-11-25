import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thmanyah = localFont({
  src: [
    { path: "../public/fonts/thmanyahsans-Light.woff2", weight: "300" },
    { path: "../public/fonts/thmanyahsans-Regular.woff2", weight: "400" },
    { path: "../public/fonts/thmanyahsans-Medium.woff2", weight: "500" },
    { path: "../public/fonts/thmanyahsans-Bold.woff2", weight: "700" },
    { path: "../public/fonts/thmanyahsans-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أغلفة: الذكاء الاصطناعي في المجالات الإبداعية",
  description: "معرض أغلفة تفاعلية بنسبة 16:9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${thmanyah.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
