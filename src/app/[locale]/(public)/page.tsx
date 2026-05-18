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
import { getAllDailyPackages } from "@/lib/db/daily-packages";
import { getFeaturedHotels } from "@/lib/db/hotels";
import type { Step } from "@/components/home/HowItWorks/types";

export const revalidate = 604800;

const HOME_KEYS = [
  "home_hero",
  "home_about",
  "home_featured_heading",
  "home_featured_hotels_heading",
  "home_group_packages",
  "home_how_it_works",
  "home_quote",
] as const;

async function SignatureSection({ heading, kicker, ctaLabel, locale }: { heading: string; kicker: string; ctaLabel: string; locale: string }) {
  const groupPackages = await getAllPremadePackages({ locale });
  return <SignatureDestinations packages={groupPackages.slice(0, 3)} heading={heading} kicker={kicker} ctaLabel={ctaLabel} />;
}

async function FeaturedHotelsSection({ heading, kicker, ctaLabel, locale }: { heading: string; kicker: string; ctaLabel: string; locale: string }) {
  const featuredHotels = await getFeaturedHotels(locale);
  return <FeaturedHotels sectionHeading={heading} hotels={featuredHotels} kicker={kicker} ctaLabel={ctaLabel} />;
}

const SectionFallback = () => <div className="min-h-[40vh]" />;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
        ctaChauffeur={hero.cta_chauffeur ?? "Book a chauffeur →"}
      />
      <AboutStrip heading={about.heading} body={about.body} kicker={about.kicker ?? "About — Est. 2014"} />
      <Suspense fallback={<SectionFallback />}>
        <SignatureSection
          heading={groupPackages.section_heading ?? "Four corners of the country."}
          kicker={groupPackages.kicker ?? "Our Group Packages"}
          ctaLabel={groupPackages.cta_label ?? "See all group packages"}
          locale={locale}
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
          locale={locale}
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
