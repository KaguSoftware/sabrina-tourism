import type { Metadata } from "next";
import "../styles/globals.css";
import { fraunces, inter, jetbrainsMono } from "./fonts";

export const metadata: Metadata = {
  title: "Sabrina Turizm — Turkey, considered.",
  description:
    "Boutique tours and private chauffeur service across Türkiye. Slow itineraries built one guest, one driver, one road at a time.",
  keywords: ["Turkey tours", "Türkiye travel", "boutique tourism", "private chauffeur", "Istanbul", "Cappadocia"],
  openGraph: {
    title: "Sabrina Turizm — Turkey, considered.",
    description: "Boutique tours and private chauffeur across Türkiye.",
    siteName: "Sabrina Turizm",
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
      <body className="relative">{children}</body>
    </html>
  );
}
