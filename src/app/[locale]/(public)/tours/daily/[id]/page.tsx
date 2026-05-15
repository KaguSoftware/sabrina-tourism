import { notFound } from "next/navigation";
import { getDailyPackageBySlug } from "@/lib/db/daily-packages";
import { DailyDetailPage } from "@/components/daily/DailyDetailPage/DailyDetailPage";

export const revalidate = 604800;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const pkg = await getDailyPackageBySlug(id, locale);
  if (!pkg) return {};
  return {
    title: `${pkg.name} — Sabrina Turizm`,
    description: pkg.shortDescription,
    alternates: { canonical: `/tours/daily/${pkg.slug}` },
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
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const pkg = await getDailyPackageBySlug(id, locale);
  if (!pkg) notFound();
  return <DailyDetailPage pkg={pkg} />;
}
