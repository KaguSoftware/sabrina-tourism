import { Suspense } from "react";
import { PackageListPage } from "@/components/packages/PackageListPage/PackageListPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPackages } from "@/lib/db/packages";

export const revalidate = 60;

export const metadata = {
  title: "Itineraries — Sabrina Turizm",
  description:
    "Six curated routes through Türkiye. Filter by region, dates, and group size.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Itineraries — Sabrina Turizm",
    description: "Six curated routes through Türkiye. Filter by region, dates, and group size.",
    images: [{ url: "/homepage.png", width: 1200, height: 630, alt: "Sabrina Turizm itineraries" }],
  },
};

export default async function PackagesPage() {
  const [hero, packages] = await Promise.all([
    getSiteContent("tours_hero"),
    getAllPackages(),
  ]);

  return (
    <Suspense>
      <PackageListPage
        pageHeading={hero.page_heading}
        pageLede={hero.page_lede}
        packages={packages}
      />
    </Suspense>
  );
}
