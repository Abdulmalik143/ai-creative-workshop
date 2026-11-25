import { notFound } from "next/navigation";
import { covers, getCover } from "@/covers/registry";
import { Viewer } from "@/components/gallery/Viewer";

export function generateStaticParams() {
  return covers.map((c) => ({ id: c.id }));
}

export default async function CoverPage({ params }: PageProps<"/cover/[id]">) {
  const { id } = await params;
  if (!getCover(id)) notFound();
  return <Viewer id={id} />;
}
