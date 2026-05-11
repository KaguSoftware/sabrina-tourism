import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { isRTL } from "@/i18n/locales";
import { fraunces, inter, jetbrainsMono } from "./fonts";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sabrina-tourism.vercel.app"),
  title: "Sabrina Turizm — Turkey, considered.",
  description:
    "Boutique tours and private chauffeur service across Türkiye. Slow itineraries built one guest, one driver, one road at a time.",
  keywords: ["Turkey tours", "Türkiye travel", "boutique tourism", "private chauffeur", "Istanbul", "Cappadocia"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sabrina Turizm — Turkey, considered.",
    description: "Boutique tours and private chauffeur across Türkiye.",
    siteName: "Sabrina Turizm",
    type: "website",
    images: [{ url: "/tours.png", width: 1200, height: 630, alt: "Sabrina Turizm — Turkey, considered." }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // getLocale() reads from next-intl request config; falls back to "en" for admin routes
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    // admin routes are outside next-intl scope — default to en
  }

  const supabaseOrigin = (() => {
    try {
      const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
      return raw ? new URL(raw).origin : null;
    } catch {
      return null;
    }
  })();

  return (
    <html
      lang={locale}
      dir={isRTL(locale) ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="relative">{children}</body>
    </html>
  );
}
