import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import Image from "next/image";
import { HotelCarousel } from "@/components/primitives/HotelCarousel/HotelCarousel";
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
}: {
  params: Promise<{ slug: string; hotelSlug: string }>;
}) {
  const { slug, hotelSlug } = await params;
  const region = slugToRegion(slug);
  if (!region) notFound();

  const hotel = HOTELS[region].find((h) => h.slug === hotelSlug);
  if (!hotel) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] bg-ink">
        {/* Hero photo */}
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />

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

            {/* Photo carousel */}
            <Reveal delay={140}>
              <div className="mb-6">
                <HotelCarousel images={hotel.images} hotelName={hotel.name} />
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

            <Reveal delay={60}>
              <div className="border border-rule p-6 mb-6">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
                  Property details
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Always-shown: bedrooms, bathrooms, distance */}
                  <div className="flex items-center gap-2.5 text-[13px] text-ink">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M3 14h18"/><path d="M3 18h18"/><path d="M9 22v-4"/><path d="M15 22v-4"/></svg>
                    <span>{hotel.properties.bedrooms} bedroom{hotel.properties.bedrooms > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-ink">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/></svg>
                    <span>{hotel.properties.bathrooms} bathroom{hotel.properties.bathrooms > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-ink">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    <span>{hotel.properties.distanceKm} km from centre</span>
                  </div>
                  {/* Conditional features */}
                  {hotel.properties.freeWifi && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
                      <span>Free Wi-Fi</span>
                    </div>
                  )}
                  {hotel.properties.freeCancellation && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Free cancellation</span>
                    </div>
                  )}
                  {hotel.properties.freeParking && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                      <span>Free parking</span>
                    </div>
                  )}
                  {hotel.properties.bedBreakfast && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                      <span>Bed &amp; breakfast</span>
                    </div>
                  )}
                  {hotel.properties.balcony && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <span>Balcony</span>
                    </div>
                  )}
                  {hotel.properties.washer && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M12 6h.01"/></svg>
                      <span>Washing machine</span>
                    </div>
                  )}
                  {hotel.properties.ac && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/></svg>
                      <span>Air conditioning</span>
                    </div>
                  )}
                  {hotel.properties.tv && (
                    <div className="flex items-center gap-2.5 text-[13px] text-ink">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ochre shrink-0"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>
                      <span>Television</span>
                    </div>
                  )}
                </div>
                {/* Booking.com link */}
                <a
                  href={hotel.properties.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[#003580] hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  View on Booking.com
                </a>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
                  className="inline-flex items-center gap-2 w-full px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_-6px_rgba(11,26,46,0.4)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-whatsapp.svg"
                    alt=""
                    aria-hidden="true"
                    width="14"
                    height="14"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(68%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(95%)",
                    }}
                  />
                  <span>Enquire via WhatsApp</span>
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
