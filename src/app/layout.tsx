import type { Metadata } from "next";
import "../styles/globals.css";
import { fraunces, inter, jetbrainsMono } from "./fonts";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { PaperPlanePath } from "@/components/primitives/PaperPlanePath/PaperPlanePath";

export const metadata: Metadata = {
  title: "Meridian & Co. — Turkey, considered.",
  description:
    "Boutique tours and private chauffeur service across Türkiye. Slow itineraries built one guest, one driver, one road at a time.",
  keywords: ["Turkey tours", "Türkiye travel", "boutique tourism", "private chauffeur", "Istanbul", "Cappadocia"],
  openGraph: {
    title: "Meridian & Co. — Turkey, considered.",
    description: "Boutique tours and private chauffeur across Türkiye.",
    siteName: "Meridian & Co.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative">
        <SiteHeader />
        <PaperPlanePath />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
