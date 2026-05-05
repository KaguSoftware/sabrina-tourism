import { Suspense } from "react";
import { PremadePackagesPage } from "@/components/premade-packages/PremadePackagesPage/PremadePackagesPage";

export const metadata = {
  title: "Premade Tour Packages — Sabrina Turizm",
  description:
    "Fixed-date curated itineraries through Türkiye with pre-selected hotels and dedicated chauffeur service.",
  alternates: { canonical: "/tours/premade" },
  openGraph: {
    title: "Premade Tour Packages — Sabrina Turizm",
    description:
      "Fixed-date curated itineraries through Türkiye with pre-selected hotels and dedicated chauffeur service.",
    images: [
      {
        url: "/homepage.png",
        width: 1200,
        height: 630,
        alt: "Sabrina Turizm premade packages",
      },
    ],
  },
};

export default function PremadePage() {
  return (
    <Suspense>
      <PremadePackagesPage />
    </Suspense>
  );
}
