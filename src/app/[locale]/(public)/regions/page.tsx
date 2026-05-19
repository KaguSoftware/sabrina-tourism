import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCard } from "@/components/regions/HotelCard/HotelCard";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";
import { getSiteContent } from "@/lib/db/site-content";

type Region = (typeof REGIONS)[number];

const REGION_TO_NAV_KEY: Record<Region, string> = {
  Istanbul: "istanbul",
  Cappadocia: "cappadocia",
  Aegean: "aegean",
  Mediterranean: "mediterranean",
  "Black Sea": "blackSea",
  "Eastern Anatolia": "easternAnatolia",
};

function applyTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/regions";
  const localePath = locale === "en" ? path : `/${locale}${path}`;
  const title = "Partnered Hotels — Sabrina Turizm";
  const description =
    "All partnered hotels across Türkiye, organised by region — Istanbul, Cappadocia, the Aegean, the Mediterranean, the Black Sea, and Eastern Anatolia.";
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function RegionsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [pageContent, navT] = await Promise.all([
    getSiteContent("hotels_page", locale),
    getTranslations("nav"),
  ]);
  const totalHotels = REGIONS.reduce((sum, r) => sum + HOTELS[r].length, 0);
  const kicker = pageContent.region_index_kicker ?? "Where you stay";
  const heading = pageContent.region_index_heading ?? "Partnered Hotels";
  const lede = applyTemplate(
    pageContent.region_index_lede ?? "{count} curated properties across Türkiye, organised by region — from Bosphorus terraces to cave suites in Cappadocia.",
    { count: totalHotels },
  );
  const regionHeadingTemplate = pageContent.region_section_heading_template ?? "Hotels in {region}";
  const regionCtaLabel = pageContent.region_section_cta_label ?? "View region";
  const regionCardEyebrowLabel = pageContent.region_card_eyebrow_label ?? "Partnered Hotel";
  const regionCardStayLabel = pageContent.region_card_stay_label ?? "Curated Stay";
  const hotelCardCtaLabel = pageContent.hotel_card_cta_label ?? "View hotel";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/hotel-flat-design.webp"
            alt="Hotels hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full">
          <Reveal>
            <Kicker light>{kicker}</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
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

      {/* Region sections */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-20 pb-28 space-y-24">
        {REGIONS.map((region) => {
          const hotels = HOTELS[region];
          const regionSlug = REGION_SLUGS[region];
          const regionName = navT(`regions.${REGION_TO_NAV_KEY[region]}`);

          return (
            <section key={region} id={regionSlug}>
              <Reveal>
                <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                  <div>
                    <Kicker>{regionName}</Kicker>
                    <GoldUnderlineHeading
                      as="h2"
                      className="text-[clamp(28px,4vw,48px)] mt-4 tracking-[-0.025em]"
                    >
                      {applyTemplate(regionHeadingTemplate, { region: regionName })}
                    </GoldUnderlineHeading>
                  </div>
                  <Link
                    href={`/regions/${regionSlug}` as `/${string}`}
                    className="font-mono text-[12px] tracking-[0.16em] uppercase text-ochre hover:text-ink transition-colors duration-150"
                  >
                    {regionCtaLabel} &rarr;
                  </Link>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
                {hotels.map((hotel, i) => (
                  <Reveal key={hotel.id} delay={i * 70}>
                    <HotelCard
                      hotel={hotel}
                      regionSlug={regionSlug}
                      eyebrowLabel={regionCardEyebrowLabel}
                      stayLabel={regionCardStayLabel}
                      ctaLabel={hotelCardCtaLabel}
                    />
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
