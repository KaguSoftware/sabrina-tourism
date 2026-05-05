import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPremadePackageById, PREMADE_PACKAGES } from "@/lib/premade-packages/data";
import { PremadePackageDetailPage } from "@/components/premade-packages/PremadePackageDetailPage/PremadePackageDetailPage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PREMADE_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pkg = getPremadePackageById(id);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Sabrina Turizm`,
    description: pkg.shortDescription,
    alternates: { canonical: `/tours/premade/${pkg.id}` },
    openGraph: {
      title: `${pkg.name} — Sabrina Turizm`,
      description: pkg.shortDescription,
      images: [{ url: pkg.heroImage, width: 1200, height: 630, alt: pkg.name }],
    },
  };
}

export default async function PremadePackageDetailRoute({ params }: Props) {
  const { id } = await params;
  const pkg = getPremadePackageById(id);
  if (!pkg) notFound();
  return (
    <Suspense>
      <PremadePackageDetailPage pkg={pkg} />
    </Suspense>
  );
}
