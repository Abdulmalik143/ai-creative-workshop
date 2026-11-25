import type { Metadata } from "next";
import { DeckPage } from "./DeckPage";

export const metadata: Metadata = {
  title: "العرض · الذكاء الاصطناعي في المجالات الإبداعية",
};

export default function Page() {
  return <DeckPage />;
}
