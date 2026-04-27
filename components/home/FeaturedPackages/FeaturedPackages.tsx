import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { PackageCard } from "@/components/packages/PackageCard/PackageCard";
import { PACKAGES } from "@/lib/packages/packages";
import { SECTION_HEADING, FEATURED_SLUGS } from "./constants";

export function FeaturedPackages() {
  const featured = FEATURED_SLUGS.map((slug) =>
    PACKAGES.find((p) => p.slug === slug)!
  ).filter(Boolean);

  return (
    <section className="relative z-10 py-[clamp(80px,10vw,130px)] px-[clamp(20px,4vw,56px)]">
      <div className="max-w-[1320px] mx-auto">
        {/* Head */}
        <div className="flex justify-between items-end gap-6 mb-14 flex-wrap">
          <div>
            <Reveal>
              <Kicker>Featured itineraries</Kicker>
            </Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading
                as="h2"
                className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em] max-w-[18ch]"
              >
                {SECTION_HEADING}
              </GoldUnderlineHeading>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <Link
              href="/packages"
              className="font-mono text-[13px] tracking-[0.16em] uppercase border-b border-ochre pb-1 transition-colors duration-200 hover:text-ochre group"
            >
              See all itineraries{" "}
              <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </em>
            </Link>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
          {featured.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i * 80}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
