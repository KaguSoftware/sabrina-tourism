import type { Metadata } from "next";
import "../styles/globals.css";
import { fraunces, inter, jetbrainsMono } from "./fonts";

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
<<<<<<< HEAD
      <body className="relative">{children}</body>
=======
      <body className="relative">
        <SiteHeader />
        <PaperPlanePath />
        <main className="relative">{children}</main>
        <SiteFooter />
      </body>
>>>>>>> 03e9c715e0116255a896699ab6fe30368e305b63
    </html>
  );
}
