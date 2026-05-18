import { Suspense } from "react";
import { HeroPanorama } from "@/components/home/HeroPanorama/HeroPanorama";
import { AboutStrip } from "@/components/home/AboutStrip/AboutStrip";
import { SignatureDestinations } from "@/components/home/SignatureDestinations/SignatureDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages/FeaturedPackages";
import { FeaturedHotels } from "@/components/home/FeaturedHotels/FeaturedHotels";
import { HowItWorks } from "@/components/home/HowItWorks/HowItWorks";
import { QuoteStrip } from "@/components/home/QuoteStrip/QuoteStrip";
import { getSiteContentBatch } from "@/lib/db/site-content";
import { getAllPremadePackages } from "@/lib/db/premade-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { getFeaturedHotels } from "@/lib/db/hotels";
import type { Step } from "@/components/home/HowItWorks/types";

export const revalidate = 604800;

const HOME_KEYS = [
  "home_hero",
  "home_about",
  "home_featured_heading",
  "home_featured_hotels_heading",
  "home_how_it_works",
  "home_quote",
] as const;

async function SignatureSection() {
  const groupPackages = await getAllPremadePackages();
  return <SignatureDestinations packages={groupPackages.slice(0, 3)} />;
}

async function FeaturedHotelsSection({ heading }: { heading: string }) {
  const featuredHotels = await getFeaturedHotels();
  return <FeaturedHotels sectionHeading={heading} hotels={featuredHotels} />;
}

const SectionFallback = () => <div className="min-h-[40vh]" />;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = await getSiteContentBatch(HOME_KEYS, locale);

  const hero = content.home_hero;
  const about = content.home_about;
  const featuredHeading = content.home_featured_heading;
  const featuredHotelsHeading = content.home_featured_hotels_heading;
  const howItWorks = content.home_how_it_works;
  const quote = content.home_quote;

  return (
    <>
      <HeroPanorama
        headlineTop={hero.headline_top}
        headlineEm={hero.headline_em}
        sub={hero.sub}
        kicker={hero.kicker}
      />
      <AboutStrip heading={about.heading} body={about.body} />
      <Suspense fallback={<SectionFallback />}>
        <SignatureSection />
      </Suspense>
      <FeaturedPackages
        sectionHeading={featuredHeading.section_heading}
        packages={DAILY_PACKAGES.slice(0, 3)}
      />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedHotelsSection
          heading={featuredHotelsHeading.section_heading ?? "Where comfort meets culture"}
        />
      </Suspense>
      <HowItWorks
        sectionHeading={howItWorks.section_heading}
        steps={howItWorks.steps.map((s) => ({
          ...s,
          icon: (["compass", "suitcase", "whatsapp"].includes(s.icon) ? s.icon : "compass") as Step["icon"],
        }))}
      />
      <QuoteStrip quote={quote.quote} attribution={quote.attribution} />
    </>
  );
}
