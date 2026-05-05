import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCard } from "@/components/regions/HotelCard/HotelCard";
import { REGIONS, REGION_SLUGS, slugToRegion } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";

export const revalidate = 60;

const REGION_COPY: Record<
  (typeof REGIONS)[number],
  { heading: string; lede: string }
> = {
  Istanbul: {
    heading: "The partnered hotels for Istanbul",
    lede: "Step into the city where East meets West — Byzantine mosaics, Ottoman domes, and a skyline unlike any other.",
  },
  Cappadocia: {
    heading: "The partnered hotels for Cappadocia",
    lede: "Drift above fairy chimneys at sunrise, explore ancient cave churches, and sleep under a canopy of stars in Göreme.",
  },
  Aegean: {
    heading: "The partnered hotels for the Aegean",
    lede: "Ancient ruins rising from olive groves, turquoise bays, and whitewashed villages strung along the western coast.",
  },
  Mediterranean: {
    heading: "The partnered hotels for the Mediterranean",
    lede: "Sun-drenched coves, cedar forests, and Lycian ruins hidden along one of the most beautiful coastlines in the world.",
  },
  "Black Sea": {
    heading: "The partnered hotels for the Black Sea",
    lede: "Misty plateaus, emerald highland lakes, and a wild, rain-washed coast that feels like a world apart.",
  },
  "Eastern Anatolia": {
    heading: "The partnered hotels for Eastern Anatolia",
    lede: "Where ancient civilisations built empires — vast plains, volcanic peaks, and centuries of history etched in stone.",
  },
};

export function generateStaticParams() {
  return REGIONS.map((region) => ({ slug: REGION_SLUGS[region] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = slugToRegion(slug);
  if (!region) return {};
  const { heading, lede } = REGION_COPY[region];
  return {
    title: `${heading} — Sabrina Turizm`,
    description: lede,
    alternates: { canonical: `/regions/${slug}` },
    openGraph: {
      title: `${heading} — Sabrina Turizm`,
      description: lede,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: heading }],
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = slugToRegion(slug);
  if (!region) notFound();

  const { heading, lede } = REGION_COPY[region];
  const hotels = HOTELS[region];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/homepage.png"
            alt={`${region} hotels`}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Hotels · {region}</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(36px,5.5vw,72px)] mt-6 mb-6 tracking-[-0.025em] max-w-[18ch] text-cream"
            >
              {heading}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              {lede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Hotel grid */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-14 pb-28">
        <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
          <span className="text-ochre font-display italic text-[18px] mr-1">
            {hotels.length}
          </span>
          {hotels.length === 1 ? "property" : "properties"} in{" "}
          <em className="not-italic text-ink">{region}</em>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
          {hotels.map((hotel, i) => (
            <Reveal key={hotel.id} delay={i * 70}>
              <HotelCard hotel={hotel} regionSlug={slug} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
