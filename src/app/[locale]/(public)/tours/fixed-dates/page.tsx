import { Suspense } from "react";
import { PremadePackagesPage } from "@/components/premade-packages/PremadePackagesPage/PremadePackagesPage";

export const metadata = {
  title: "Group Tours — Sabrina Turizm",
  description:
    "Group tours through Türkiye with fixed departure dates, pre-selected hotels, and dedicated chauffeur service.",
  alternates: { canonical: "/tours/fixed-dates" },
  openGraph: {
    title: "Group Tours — Sabrina Turizm",
    description:
      "Group tours through Türkiye with fixed departure dates, pre-selected hotels, and dedicated chauffeur service.",
    images: [
      {
        url: "/homepage.png",
        width: 1200,
        height: 630,
        alt: "Sabrina Turizm group tours",
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
