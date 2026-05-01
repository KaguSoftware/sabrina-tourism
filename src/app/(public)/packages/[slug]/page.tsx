import { notFound, redirect } from "next/navigation";
import { PackageDetailPage } from "@/components/packages/PackageDetailPage/PackageDetailPage";
import { getAllSlugs, getPackageBySlug } from "@/lib/db/packages";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; people?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} — Sabrina Turizm`,
  };
}

export default async function PackageDetailRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date, people } = await searchParams;

  const result = await getPackageBySlug(slug);

  if (!result) notFound();
  if ("redirectTo" in result) redirect(`/packages/${result.redirectTo}`);

  return (
    <PackageDetailPage pkg={result} seedDate={date} seedPeople={people} />
  );
}
