import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCard } from "@/components/hotels/HotelCard/HotelCard";
import { getAllHotels } from "@/lib/db/hotels";
import { getSiteContent } from "@/lib/db/site-content";

export const revalidate = 604800;

export const metadata = {
  title: "Hotels — Sabrina Turizm",
  description: "Curated partner hotels across Türkiye — handpicked for comfort, character, and location.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Hotels — Sabrina Turizm",
    description: "Curated partner hotels across Türkiye — handpicked for comfort, character, and location.",
    images: [{ url: "/homepage.png", width: 1200, height: 630, alt: "Sabrina Turizm hotels" }],
  },
};

export default async function HotelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [hotels, pageContent] = await Promise.all([
    getAllHotels(),
    getSiteContent("hotels_page", locale),
  ]);

  const kicker = pageContent?.kicker ?? "Our hotels";
  const heading = pageContent?.page_heading ?? "Curated stays across Türkiye";
  const lede = pageContent?.page_lede ?? "Every property is hand-selected for its character, location, and the experience it delivers — from boutique cave hotels to waterfront retreats.";
  const singular = pageContent?.property_singular ?? "property";
  const plural = pageContent?.property_plural ?? "properties";
  const hotelCardCtaLabel = pageContent?.hotel_card_cta_label ?? "View hotel";

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 overflow-hidden min-h-[clamp(340px,45vw,560px)] flex items-end">
        <Image
          src="/hotel-hero.webp"
          alt="Bosphorus hotel view"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pt-[clamp(80px,10vw,140px)] pb-[clamp(40px,6vw,80px)]">
          <Reveal>
            <Kicker className="text-white/80">{kicker}</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(36px,5vw,72px)] mt-4 tracking-[-0.02em] max-w-[18ch] text-white"
            >
              {heading}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-[clamp(15px,1.3vw,18px)] text-white/80 leading-[1.6] max-w-[52ch]">
              {lede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="px-[clamp(20px,4vw,56px)] pb-[clamp(60px,8vw,120px)]">
        <div className="max-w-[1320px] mx-auto">
          <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
            <span className="text-ochre font-display italic text-[18px] mr-1">
              {hotels.length}
            </span>
            {hotels.length === 1 ? singular : plural}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
            {hotels.map((hotel, i) => (
              <Reveal key={hotel.id} delay={i * 70}>
                <HotelCard hotel={hotel} ctaLabel={hotelCardCtaLabel} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
