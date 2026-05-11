import { Suspense } from "react";
import { PremadePackagesPage } from "@/components/premade-packages/PremadePackagesPage/PremadePackagesPage";
import { PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache/config";

export const dynamic = "force-static";
export const revalidate = PUBLIC_REVALIDATE_SECONDS;

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

export default async function FixedDatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PremadePackagesPage locale={locale} />
    </Suspense>
  );
}
