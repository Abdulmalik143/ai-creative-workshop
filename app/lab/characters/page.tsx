import { CharacterLab } from "@/components/lab/characters/CharacterLab";

export const metadata = { title: "مختبر الشخصيات" };

/** A standalone lab page: ten candidate companions to compare. Nothing here is wired into the deck. */
export default function CharacterLabPage() {
  return <CharacterLab />;
}
