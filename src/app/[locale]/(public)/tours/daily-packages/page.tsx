import { DailyListPage } from "@/components/daily/DailyListPage/DailyListPage";
import { getAllDailyPackages } from "@/lib/db/daily-packages";

export const revalidate = 604800;

export const metadata = {
  title: "Daily Packages — Sabrina Turizm",
  description:
    "Fixed single-day tours from sunrise to starlight. Pre-selected destinations, private chauffeur, and every detail handled.",
  alternates: { canonical: "/tours/daily-packages" },
  openGraph: {
    title: "Daily Packages — Sabrina Turizm",
    description:
      "Fixed single-day tours from sunrise to starlight. Pre-selected destinations, private chauffeur, and every detail handled.",
    images: [
      {
        url: "/homepage.png",
        width: 1200,
        height: 630,
        alt: "Sabrina Turizm daily packages",
      },
    ],
  },
};

export default async function DailyPackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const packages = await getAllDailyPackages({ locale });
  return <DailyListPage packages={packages} />;
}
