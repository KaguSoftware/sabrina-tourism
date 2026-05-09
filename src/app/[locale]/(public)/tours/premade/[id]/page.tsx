import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPremadePackageBySlug, getAllPremadeSlugs } from "@/lib/db/premade-packages";
import { PremadePackageDetailPage } from "@/components/premade-packages/PremadePackageDetailPage/PremadePackageDetailPage";
import type { Metadata } from "next";

export const dynamicParams = true;

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPremadeSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const pkg = await getPremadePackageBySlug(id, locale);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Sabrina Turizm`,
    description: pkg.shortDescription,
    alternates: { canonical: `/tours/premade/${pkg.slug}` },
    openGraph: {
      title: `${pkg.name} — Sabrina Turizm`,
      description: pkg.shortDescription,
      images: [{ url: pkg.heroImage, width: 1200, height: 630, alt: pkg.name }],
    },
  };
}

export default async function PremadePackageDetailRoute({ params }: Props) {
  const { id, locale } = await params;
  const pkg = await getPremadePackageBySlug(id, locale);
  if (!pkg) notFound();
  return (
    <Suspense>
      <PremadePackageDetailPage pkg={pkg} />
    </Suspense>
  );
}
