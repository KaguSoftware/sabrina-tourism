import { Suspense } from "react";
import { PackageListPage } from "@/components/packages/PackageListPage/PackageListPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPackages } from "@/lib/db/packages";

export const revalidate = 60;

export const metadata = {
  title: "Itineraries — Meridian & Co.",
  description:
    "Six curated routes through Türkiye. Filter by region, dates, and group size.",
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
