import type { Metadata } from "next";
import { NotesWindow } from "./NotesWindow";

export const metadata: Metadata = {
  title: "ملاحظات المقدّم · الذكاء الاصطناعي في المجالات الإبداعية",
};

export default function Page() {
  return <NotesWindow />;
}
