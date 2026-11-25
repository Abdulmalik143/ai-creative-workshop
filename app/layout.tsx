import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thmanyah = localFont({
  src: [
    { path: "../assets/fonts/thmanyahsans-Light.woff2", weight: "300" },
    { path: "../assets/fonts/thmanyahsans-Regular.woff2", weight: "400" },
    { path: "../assets/fonts/thmanyahsans-Medium.woff2", weight: "500" },
    { path: "../assets/fonts/thmanyahsans-Bold.woff2", weight: "700" },
    { path: "../assets/fonts/thmanyahsans-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
});

export const metadata: Metadata = {
  title: "الذكاء الاصطناعي في المجالات الإبداعية",
  description: "عرض ورشة الذكاء الاصطناعي في المجالات الإبداعية",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${thmanyah.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
