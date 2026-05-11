import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelBackButton } from "@/components/regions/HotelBackButton/HotelBackButton";
import { HotelDetailClient } from "@/components/regions/HotelDetailClient/HotelDetailClient";
import { REGIONS, REGION_SLUGS, slugToRegion } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";
import { PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache/config";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export function generateStaticParams() {
  return REGIONS.flatMap((region) =>
    HOTELS[region].map((hotel) => ({ slug: REGION_SLUGS[region], hotelSlug: hotel.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; hotelSlug: string }> }): Promise<Metadata> {
  const { slug, hotelSlug } = await params;
  const region = slugToRegion(slug);
  if (!region) return {};
  const hotel = HOTELS[region].find((h) => h.slug === hotelSlug);
  if (!hotel) return {};
  return {
    title: `${hotel.name} — Sabrina Turizm`,
    description: hotel.description,
    alternates: { canonical: `/regions/${slug}/${hotelSlug}` },
    openGraph: {
      title: `${hotel.name} — Sabrina Turizm`,
      description: hotel.description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: hotel.name }],
    },
  };
}

export default async function HotelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; hotelSlug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug, hotelSlug } = await params;
  const { from } = await searchParams;
  const region = slugToRegion(slug);
  if (!region) notFound();

  const hotel = HOTELS[region].find((h) => h.slug === hotelSlug);
  if (!hotel) notFound();

  return (
    <>
      {/* Hero — matches main page height */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] bg-ink">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/10" />

        <div className="relative z-10 max-w-330 mx-auto w-full">
          <Reveal>
            <nav className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/50 mb-6">
              <Link href="/regions" className="hover:text-cream transition-colors">Hotels</Link>
              <span>·</span>
              <Link href={`/regions/${slug}`} className="hover:text-cream transition-colors">{region}</Link>
              <span>·</span>
              <span className="text-cream/80">{hotel.name}</span>
            </nav>
          </Reveal>
          <Reveal delay={80}>
            <Kicker light>{hotel.tags[0]} · {hotel.tags[1]}</Kicker>
          </Reveal>
          <Reveal delay={140}>
            <GoldUnderlineHeading as="h1" className="text-[clamp(34px,5vw,68px)] mt-5 mb-5 tracking-tight max-w-[20ch] text-cream">
              {hotel.name}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-cream/50">
              {hotel.location}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pt-16 pb-28 relative" style={{ zIndex: 10 }}>
        {from === "custom-tour" && <HotelBackButton />}

        <HotelDetailClient hotel={hotel} region={region} slug={slug} waPhone={process.env.NEXT_PUBLIC_WA_PHONE} />
      </section>
    </>
  );
}
