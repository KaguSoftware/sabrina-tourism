import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroPanorama } from "@/components/home/HeroPanorama/HeroPanorama";
import { AboutStrip } from "@/components/home/AboutStrip/AboutStrip";
import { SignatureDestinations } from "@/components/home/SignatureDestinations/SignatureDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages/FeaturedPackages";
import { FeaturedHotels } from "@/components/home/FeaturedHotels/FeaturedHotels";
import { HowItWorks } from "@/components/home/HowItWorks/HowItWorks";
import { QuoteStrip } from "@/components/home/QuoteStrip/QuoteStrip";
import { getSiteContentBatch } from "@/lib/db/site-content";
import { getAllPremadePackages, type PremadePackagePublic } from "@/lib/db/premade-packages";
import { getAllDailyPackages } from "@/lib/db/daily-packages";
import { getFeaturedHotels, type HotelPublic } from "@/lib/db/hotels";
import type { Step } from "@/components/home/HowItWorks/types";

export const revalidate = 604800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localePath = locale === "en" ? "/" : `/${locale}`;
  const title = "Sabrina Turizm — Boutique Travel in Türkiye";
  const description = "Boutique tours, daily escapes, curated hotels, and private chauffeur service across Türkiye.";
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: title }],
    },
  };
}

const HOME_KEYS = [
  "home_hero",
  "home_about",
  "home_featured_heading",
  "home_featured_hotels_heading",
  "home_group_packages",
  "home_how_it_works",
  "home_quote",
] as const;

async function SignatureSection({
  heading,
  kicker,
  ctaLabel,
  packagesPromise,
}: {
  heading: string;
  kicker: string;
  ctaLabel: string;
  packagesPromise: Promise<PremadePackagePublic[]>;
}) {
  const groupPackages = await packagesPromise;
  return <SignatureDestinations packages={groupPackages.slice(0, 3)} heading={heading} kicker={kicker} ctaLabel={ctaLabel} />;
}

async function FeaturedHotelsSection({
  heading,
  kicker,
  ctaLabel,
  hotelsPromise,
}: {
  heading: string;
  kicker: string;
  ctaLabel: string;
  hotelsPromise: Promise<HotelPublic[]>;
}) {
  const featuredHotels = await hotelsPromise;
  return <FeaturedHotels sectionHeading={heading} hotels={featuredHotels} kicker={kicker} ctaLabel={ctaLabel} />;
}

const SectionFallback = () => <div className="min-h-[40vh]" />;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Kick off all queries in parallel. The two large ones flow through Suspense
  // so they don't block initial paint, but they still start fetching now.
  const premadePromise = getAllPremadePackages({ locale });
  const featuredHotelsPromise = getFeaturedHotels(locale);

  const [content, dailyPackages] = await Promise.all([
    getSiteContentBatch(HOME_KEYS, locale),
    getAllDailyPackages({ locale }),
  ]);

  const hero = content.home_hero;
  const about = content.home_about;
  const featuredHeading = content.home_featured_heading;
  const featuredHotelsHeading = content.home_featured_hotels_heading;
  const groupPackages = content.home_group_packages;
  const howItWorks = content.home_how_it_works;
  const quote = content.home_quote;

  return (
    <>
      <HeroPanorama
        headlineTop={hero.headline_top}
        headlineEm={hero.headline_em}
        sub={hero.sub}
        kicker={hero.kicker}
        ctaBrowse={hero.cta_browse ?? "Browse tours"}
        ctaChauffeur={hero.cta_chauffeur ?? "Book your Driver"}
      />
      <AboutStrip heading={about.heading} body={about.body} kicker={about.kicker ?? "About — Est. 2014"} />
      <Suspense fallback={<SectionFallback />}>
        <SignatureSection
          heading={groupPackages.section_heading ?? "Four corners of the country."}
          kicker={groupPackages.kicker ?? "Our Group Packages"}
          ctaLabel={groupPackages.cta_label ?? "See all group packages"}
          packagesPromise={premadePromise}
        />
      </Suspense>
      <FeaturedPackages
        sectionHeading={featuredHeading.section_heading}
        packages={dailyPackages.slice(0, 3)}
        kicker={featuredHeading.kicker ?? "Our Daily Packages"}
        ctaLabel={featuredHeading.cta_label ?? "See all daily packages"}
      />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedHotelsSection
          heading={featuredHotelsHeading.section_heading ?? "Where comfort meets culture"}
          kicker={featuredHotelsHeading.kicker ?? "Featured hotels"}
          ctaLabel={featuredHotelsHeading.cta_label ?? "See all hotels"}
          hotelsPromise={featuredHotelsPromise}
        />
      </Suspense>
      <HowItWorks
        sectionHeading={howItWorks.section_heading}
        ctaLabel={howItWorks.cta_label ?? "Start a conversation"}
        steps={howItWorks.steps.map((s) => ({
          ...s,
          icon: (["compass", "suitcase", "whatsapp"].includes(s.icon) ? s.icon : "compass") as Step["icon"],
        }))}
      />
      <QuoteStrip quote={quote.quote} attribution={quote.attribution} />
    </>
  );
}
