import { Suspense } from "react";
import type { Metadata } from "next";
import { PremadePackagesPage } from "@/components/premade-packages/PremadePackagesPage/PremadePackagesPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/tours/fixed-dates";
  const localePath = locale === "en" ? path : `/${locale}${path}`;
  const title = "Group Tours — Sabrina Turizm";
  const description =
    "Group tours through Türkiye with fixed departure dates, pre-selected hotels, and dedicated chauffeur service.";
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/tours.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function FixedDatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PremadePackagesPage locale={locale} />
    </Suspense>
  );
}
