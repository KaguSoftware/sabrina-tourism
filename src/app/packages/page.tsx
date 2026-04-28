import { Suspense } from "react";
import { PackageListPage } from "@/components/packages/PackageListPage/PackageListPage";

export const metadata = {
  title: "Itineraries — Meridian & Co.",
  description:
    "Six curated routes through Türkiye. Filter by region, dates, and group size.",
};

export default function PackagesPage() {
  return (
    <Suspense>



      <PackageListPage />
    </Suspense>
  );
}
