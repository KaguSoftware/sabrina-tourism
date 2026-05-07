import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCard } from "@/components/regions/HotelCard/HotelCard";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Partnered Hotels — Sabrina Turizm",
  description:
    "All partnered hotels across Türkiye, organised by region — Istanbul, Cappadocia, the Aegean, the Mediterranean, the Black Sea, and Eastern Anatolia.",
  alternates: { canonical: "/regions" },
  openGraph: {
    title: "Partnered Hotels — Sabrina Turizm",
    description:
      "All partnered hotels across Türkiye, organised by region.",
    images: [
      {
        url: "/homepage.png",
        width: 1200,
        height: 630,
        alt: "Sabrina Turizm partnered hotels",
      },
    ],
  },
};

export default function RegionsIndexPage() {
  const totalHotels = REGIONS.reduce((sum, r) => sum + HOTELS[r].length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/homepage.png"
            alt="Hotels hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Where you stay</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
            >
              Partnered Hotels
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              {totalHotels} curated properties across Türkiye, organised by
              region — from Bosphorus terraces to cave suites in Cappadocia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Region sections */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-20 pb-28 space-y-24">
        {REGIONS.map((region) => {
          const hotels = HOTELS[region];
          const regionSlug = REGION_SLUGS[region];

          return (
            <section key={region} id={regionSlug}>
              <Reveal>
                <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                  <div>
                    <Kicker>{region}</Kicker>
                    <GoldUnderlineHeading
                      as="h2"
                      className="text-[clamp(28px,4vw,48px)] mt-4 tracking-[-0.025em]"
                    >
                      Hotels in {region}
                    </GoldUnderlineHeading>
                  </div>
                  <Link
                    href={`/regions/${regionSlug}`}
                    className="font-mono text-[12px] tracking-[0.16em] uppercase text-ochre hover:text-ink transition-colors duration-150"
                  >
                    View region &rarr;
                  </Link>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
                {hotels.map((hotel, i) => (
                  <Reveal key={hotel.id} delay={i * 70}>
                    <HotelCard hotel={hotel} regionSlug={regionSlug} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
