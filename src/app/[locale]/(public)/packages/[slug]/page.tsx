import { notFound, redirect } from "next/navigation";
import { PackageDetailPage } from "@/components/packages/PackageDetailPage/PackageDetailPage";
import { getAllSlugs, getPackageBySlug } from "@/lib/db/packages";
import type { Package } from "@/lib/packages/types";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; people?: string; tier?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getPackageBySlug(slug);
  const pkg = result && !("redirectTo" in result) ? (result as Package) : null;
  const title = pkg ? `${pkg.name} — Sabrina Turizm` : `${slug.replace(/-/g, " ")} — Sabrina Turizm`;
  const description = pkg
    ? `${pkg.shortDescription} ${pkg.duration} · ${pkg.region}.`
    : "Boutique tour itinerary across Türkiye by Sabrina Turizm.";
  return {
    title,
    description,
    alternates: { canonical: `/packages/${slug}` },
    openGraph: {
      title,
      description,
      images: pkg ? [{ url: pkg.heroImage, width: 1200, height: 630, alt: pkg.name }] : [],
    },
  };
}

export default async function PackageDetailRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date, people, tier } = await searchParams;

  const result = await getPackageBySlug(slug);

  if (!result) notFound();
  if ("redirectTo" in result) redirect(`/packages/${result.redirectTo}`);

  return (
    <PackageDetailPage pkg={result} seedDate={date} seedPeople={people} seedTier={tier} />
  );
}
