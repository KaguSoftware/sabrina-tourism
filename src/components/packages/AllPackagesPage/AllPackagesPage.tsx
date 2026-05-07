"use client";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { PremadePackageCard } from "@/components/premade-packages/PremadePackageCard/PremadePackageCard";
import { DailyPackageCard } from "@/components/daily/DailyPackageCard/DailyPackageCard";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
import type { DailyPackage } from "@/lib/daily/types";

interface AllPackagesPageProps {
  pageHeading: string;
  pageLede: string;
  fixedDatePackages: PremadePackagePublic[];
  dailyPackages: DailyPackage[];
}

export function AllPackagesPage({
  pageHeading,
  pageLede,
  fixedDatePackages,
  dailyPackages,
}: AllPackagesPageProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/homepage.png"
            alt="Tours hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-5 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Itineraries</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
            >
              {pageHeading}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              {pageLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Fixed-Date Packages */}
      <section
        id="fixed-dates"
        className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-20 pb-16"
      >
        <Reveal>
          <Kicker>Fixed Departures</Kicker>
          <GoldUnderlineHeading
            as="h2"
            className="text-[clamp(32px,4.5vw,56px)] mt-4 mb-4 tracking-[-0.025em]"
          >
            Fixed-Date Packages
          </GoldUnderlineHeading>
          <p className="text-ink-soft max-w-[60ch] mb-10 leading-[1.6]">
            Curated multi-day itineraries with pre-selected hotels and
            dedicated chauffeur service — everything arranged, nothing left to
            chance.
          </p>
          <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
            <span className="text-ochre font-display italic text-[18px] mr-1">
              {fixedDatePackages.length}
            </span>
            {fixedDatePackages.length === 1 ? "package" : "packages"} available
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
          {fixedDatePackages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 70}>
              <PremadePackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Daily Packages */}
      <section
        id="daily"
        className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-16 pb-20"
      >
        <Reveal>
          <Kicker>One-Day Escapes</Kicker>
          <GoldUnderlineHeading
            as="h2"
            className="text-[clamp(32px,4.5vw,56px)] mt-4 mb-4 tracking-[-0.025em]"
          >
            Daily Packages
          </GoldUnderlineHeading>
          <p className="text-ink-soft max-w-[60ch] mb-10 leading-[1.6]">
            Fixed single-day tours from sunrise to starlight — pre-selected
            destinations, private chauffeur, and every detail handled.
          </p>
          <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
            <span className="text-ochre font-display italic text-[18px] mr-1">
              {dailyPackages.length}
            </span>
            {dailyPackages.length === 1 ? "day available" : "days available"}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
          {dailyPackages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 70}>
              <DailyPackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Make Your Own Package CTA */}
      <section className="relative z-10 px-[clamp(20px,4vw,56px)] pb-28">
        <div className="max-w-[1320px] mx-auto bg-navy text-cream px-[clamp(28px,5vw,72px)] py-[clamp(48px,7vw,96px)] text-center">
          <Reveal>
            <Kicker light>Bespoke</Kicker>
            <GoldUnderlineHeading
              as="h2"
              className="text-[clamp(32px,4.5vw,56px)] mt-4 mb-6 tracking-[-0.025em] text-cream max-w-[18ch] mx-auto"
            >
              Make Your Own Package
            </GoldUnderlineHeading>
            <p className="text-cream/80 max-w-[56ch] mx-auto mb-10 leading-[1.6]">
              Nothing on this page quite fits? Tell us where you want to go,
              when, and with whom — we&#39;ll draw an itinerary built entirely
              around you.
            </p>
            <div className="flex justify-center">
              <GoldButton href="/tours/custom-packages" variant="solid">
                Build your custom journey
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
