import { HeroPanorama } from "@/components/home/HeroPanorama/HeroPanorama";
import { AboutStrip } from "@/components/home/AboutStrip/AboutStrip";
import { SignatureDestinations } from "@/components/home/SignatureDestinations/SignatureDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages/FeaturedPackages";
import { HowItWorks } from "@/components/home/HowItWorks/HowItWorks";
import { QuoteStrip } from "@/components/home/QuoteStrip/QuoteStrip";
import { getSiteContent } from "@/lib/db/site-content";
import { getAllPremadePackages } from "@/lib/db/premade-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import type { Step } from "@/components/home/HowItWorks/types";

export const revalidate = 60;

export default async function HomePage() {
  const [hero, about, howItWorks, quote, featuredHeading, groupPackages] =
    await Promise.all([
      getSiteContent("home_hero"),
      getSiteContent("home_about"),
      getSiteContent("home_how_it_works"),
      getSiteContent("home_quote"),
      getSiteContent("home_featured_heading"),
      getAllPremadePackages(),
    ]);

  return (
    <>
      <HeroPanorama
        headlineTop={hero.headline_top}
        headlineEm={hero.headline_em}
        sub={hero.sub}
        kicker={hero.kicker}
      />
      <AboutStrip heading={about.heading} body={about.body} />
      <SignatureDestinations packages={groupPackages.slice(0, 3)} />
      <FeaturedPackages
        sectionHeading={featuredHeading.section_heading}
        packages={DAILY_PACKAGES.slice(0, 3)}
      />
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
