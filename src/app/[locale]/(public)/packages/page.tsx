import { Suspense } from "react";
import type { Metadata } from "next";
import { AllPackagesPage } from "@/components/packages/AllPackagesPage/AllPackagesPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPremadePackages } from "@/lib/db/premade-packages";
import { getAllDailyPackages } from "@/lib/db/daily-packages";

export const revalidate = 604800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/packages";
  const localePath = locale === "en" ? path : `/${locale}${path}`;
  const title = "Itineraries — Sabrina Turizm";
  const description = "Group tours, daily escapes, and bespoke itineraries through Türkiye.";
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function PackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [hero, fixedDatePackages, dailyPackages] = await Promise.all([
    getSiteContent("tours_hero", locale),
    getAllPremadePackages({ locale }),
    getAllDailyPackages({ locale }),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AllPackagesPage
        pageHeading={hero.page_heading}
        pageLede={hero.page_lede}
        fixedDatePackages={fixedDatePackages}
        dailyPackages={dailyPackages}
      />
    </Suspense>
  );
}
