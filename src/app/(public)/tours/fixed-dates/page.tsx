import { Suspense } from "react";
import { PremadePackagesPage } from "@/components/premade-packages/PremadePackagesPage/PremadePackagesPage";

export const metadata = {
  title: "Fixed-Date Packages — Sabrina Turizm",
  description:
    "Fixed-date curated itineraries through Türkiye with pre-selected hotels and dedicated chauffeur service.",
  alternates: { canonical: "/tours/fixed-dates" },
  openGraph: {
    title: "Fixed-Date Packages — Sabrina Turizm",
    description:
      "Fixed-date curated itineraries through Türkiye with pre-selected hotels and dedicated chauffeur service.",
    images: [
      {
        url: "/homepage.png",
        width: 1200,
        height: 630,
        alt: "Sabrina Turizm fixed-date packages",
      },
    ],
  },
};

export default function FixedDatesPage() {
  return (
    <Suspense>
      <PremadePackagesPage />
    </Suspense>
  );
}
