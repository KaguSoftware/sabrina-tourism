import { notFound } from "next/navigation";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { DailyDetailPage } from "@/components/daily/DailyDetailPage/DailyDetailPage";
import { PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache/config";

export const dynamic = "force-static";
export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return DAILY_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = DAILY_PACKAGES.find((p) => p.id === id);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Sabrina Turizm`,
    description: pkg.shortDescription,
    alternates: { canonical: `/tours/daily/${pkg.id}` },
    openGraph: {
      title: `${pkg.name} — Sabrina Turizm`,
      description: pkg.shortDescription,
      images: [{ url: pkg.heroImage, width: 1200, height: 630, alt: pkg.name }],
    },
  };
}

export default async function DailyPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = DAILY_PACKAGES.find((p) => p.id === id);
  if (!pkg) notFound();
  return <DailyDetailPage pkg={pkg} />;
}
