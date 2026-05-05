import { DailyListPage } from "@/components/daily/DailyListPage/DailyListPage";
import { DAILY_PACKAGES } from "@/lib/daily/data";

export const metadata = {
  title: "Daily Packages — Sabrina Turizm",
  description:
    "Fixed single-day tours from sunrise to starlight. Pre-selected destinations, private chauffeur, and every detail handled.",
  alternates: { canonical: "/tours/daily" },
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

export default function DailyPackagesPage() {
  return <DailyListPage packages={DAILY_PACKAGES} />;
}
