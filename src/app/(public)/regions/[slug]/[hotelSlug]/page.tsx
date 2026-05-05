import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelSVG } from "@/components/illustrations/HotelSVG/HotelSVG";
import { HotelBackButton } from "@/components/regions/HotelBackButton/HotelBackButton";
import { REGIONS, REGION_SLUGS, slugToRegion } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";

export const revalidate = 60;

export function generateStaticParams() {
  return REGIONS.flatMap((region) =>
    HOTELS[region].map((hotel) => ({
      slug: REGION_SLUGS[region],
      hotelSlug: hotel.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; hotelSlug: string }>;
}): Promise<Metadata> {
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
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] bg-ink">
        {/* SVG illustration fills background */}
        <div className="absolute inset-0 opacity-30">
          <HotelSVG variant={hotel.svgVariant} className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          {/* Breadcrumb */}
          <Reveal>
            <nav className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/50 mb-6">
              <Link href="/regions" className="hover:text-cream transition-colors">Regions</Link>
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
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(34px,5vw,68px)] mt-5 mb-5 tracking-[-0.025em] max-w-[20ch] text-cream"
            >
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
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-16 pb-28">
        {from === "custom-tour" && <HotelBackButton />}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[clamp(40px,6vw,80px)]">

          {/* Left — description + illustration */}
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-6">
                About this property
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[clamp(16px,1.4vw,19px)] text-ink leading-[1.7] mb-10 max-w-[56ch]">
                {hotel.longDescription}
              </p>
            </Reveal>

            {/* SVG card */}
            <Reveal delay={140}>
              <div className="border border-rule overflow-hidden max-w-[480px]">
                <HotelSVG variant={hotel.svgVariant} className="w-full" />
              </div>
            </Reveal>
          </div>

          {/* Right — amenities + enquiry */}
          <div className="lg:pt-8">
            <Reveal>
              <div className="border border-rule p-6 mb-6">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
                  Amenities & highlights
                </p>
                <ul className="space-y-3">
                  {hotel.amenities.map((a) => (
                    <li key={a} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-ochre flex-shrink-0" />
                      <span className="text-[15px] text-ink leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="border border-rule p-6">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-3">
                  Partnered property
                </p>
                <p className="text-[14px] text-ink-soft leading-[1.6] mb-5">
                  This hotel is part of our curated portfolio. Reach out via WhatsApp for availability, rates, and to arrange your stay.
                </p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE ?? ""}?text=${encodeURIComponent(`Hi, I'd like to enquire about staying at ${hotel.name} in ${region}.`)}`}
                  className="group flex items-center justify-between w-full px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase transition-all duration-300 rounded-xl border-2 border-[#25D366] bg-[#25D366] text-white hover:bg-white hover:border-[#39ff14] hover:text-[#25D366]"
                >
                  <span className="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enquire via WhatsApp
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <Link
                href={`/regions/${slug}`}
                className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors duration-200"
              >
                <span>←</span>
                <span>Back to {region} hotels</span>
              </Link>
            </Reveal>
          </div>

        </div>
      </section>
    </>
  );
}
