import { notFound } from "next/navigation";
import { labMeta } from "@/components/lab/meta";
import { Playground } from "@/components/lab/Playground";

export function generateStaticParams() {
  return labMeta.map((m) => ({ slug: m.slug }));
}

export default async function LabPage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  if (!labMeta.some((m) => m.slug === slug)) notFound();
  return <Playground slug={slug} />;
}
