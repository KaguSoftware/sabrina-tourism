import { notFound } from "next/navigation";
import { getAllDailyPackages, getDailyPackageBySlug } from "@/lib/db/daily-packages";
import { DailyDetailPage } from "@/components/daily/DailyDetailPage/DailyDetailPage";

export async function generateStaticParams() {
  const packages = await getAllDailyPackages({ locale: "en" });
  return packages.map((pkg) => ({ id: pkg.slug }));
}

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
