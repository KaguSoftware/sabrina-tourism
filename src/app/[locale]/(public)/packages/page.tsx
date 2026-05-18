import { Suspense } from "react";
import { AllPackagesPage } from "@/components/packages/AllPackagesPage/AllPackagesPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPremadePackages } from "@/lib/db/premade-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";

export const revalidate = 604800;

export const metadata = {
  title: "Itineraries — Sabrina Turizm",
  description:
    "Group tours, daily escapes, and bespoke itineraries through Türkiye.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Itineraries — Sabrina Turizm",
    description:
      "Group tours, daily escapes, and bespoke itineraries through Türkiye.",
    images: [{ url: "/homepage.png", width: 1200, height: 630, alt: "Sabrina Turizm itineraries" }],
  },
};

export default async function PackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [hero, fixedDatePackages] = await Promise.all([
    getSiteContent("tours_hero", locale),
    getAllPremadePackages(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AllPackagesPage
        pageHeading={hero.page_heading}
        pageLede={hero.page_lede}
        fixedDatePackages={fixedDatePackages}
        dailyPackages={DAILY_PACKAGES}
      />
    </Suspense>
  );
}
