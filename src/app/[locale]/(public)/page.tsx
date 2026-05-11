import { Suspense } from "react";
import { HeroPanorama } from "@/components/home/HeroPanorama/HeroPanorama";
import { AboutStrip } from "@/components/home/AboutStrip/AboutStrip";
import { SignatureDestinations } from "@/components/home/SignatureDestinations/SignatureDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages/FeaturedPackages";
import { FeaturedHotels } from "@/components/home/FeaturedHotels/FeaturedHotels";
import { HowItWorks } from "@/components/home/HowItWorks/HowItWorks";
import { QuoteStrip } from "@/components/home/QuoteStrip/QuoteStrip";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPremadePackages } from "@/lib/db/premade-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { getFeaturedHotels } from "@/lib/db/hotels";
import type { Step } from "@/components/home/HowItWorks/types";
import { PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache/config";

export const dynamic = "force-static";
export const revalidate = PUBLIC_REVALIDATE_SECONDS;

async function HeroSection() {
  const hero = await getSiteContent("home_hero");
  return (
    <HeroPanorama
      headlineTop={hero.headline_top}
      headlineEm={hero.headline_em}
      sub={hero.sub}
      kicker={hero.kicker}
    />
  );
}

async function AboutSection() {
  const about = await getSiteContent("home_about");
  return <AboutStrip heading={about.heading} body={about.body} />;
}

async function SignatureSection() {
  const groupPackages = await getAllPremadePackages();
  return <SignatureDestinations packages={groupPackages.slice(0, 3)} />;
}

async function FeaturedPackagesSection() {
  const featuredHeading = await getSiteContent("home_featured_heading");
  return (
    <FeaturedPackages
      sectionHeading={featuredHeading.section_heading}
      packages={DAILY_PACKAGES.slice(0, 3)}
    />
  );
}

async function FeaturedHotelsSection() {
  const [featuredHotelsHeading, featuredHotels] = await Promise.all([
    getSiteContent("home_featured_hotels_heading"),
    getFeaturedHotels(),
  ]);
  return (
    <FeaturedHotels
      sectionHeading={featuredHotelsHeading.section_heading ?? "Where comfort meets culture"}
      hotels={featuredHotels}
    />
  );
}

async function HowItWorksSection() {
  const howItWorks = await getSiteContent("home_how_it_works");
  return (
    <HowItWorks
      sectionHeading={howItWorks.section_heading}
      steps={howItWorks.steps.map((s) => ({
        ...s,
        icon: (["compass", "suitcase", "whatsapp"].includes(s.icon) ? s.icon : "compass") as Step["icon"],
      }))}
    />
  );
}

async function QuoteSection() {
  const quote = await getSiteContent("home_quote");
  return <QuoteStrip quote={quote.quote} attribution={quote.attribution} />;
}

const SectionFallback = () => <div className="min-h-[40vh]" />;

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SignatureSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedPackagesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedHotelsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <QuoteSection />
      </Suspense>
    </>
  );
}
