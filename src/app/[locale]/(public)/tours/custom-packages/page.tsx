import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";

export const revalidate = 604800;
import { CustomTourWizard } from "@/components/custom-tour/CustomTourWizard";
import { PrivateDayTours, PRIVATE_DAY_TOURS_ID } from "@/components/custom-tour/PrivateDayTours";
import { getAllDailyPackages } from "@/lib/db/daily-packages";
import { getSiteContent } from "@/lib/db/site-content";
import { getAirports, getVehicles } from "@/lib/db/transport";
import { getAllHotels } from "@/lib/db/hotels";
import type { HotelPublic } from "@/lib/db/hotels";

export const metadata = {
  title: "Custom Tour Package — Sabrina Turizm",
  description:
    "Build your own private itinerary across Türkiye. Choose your destinations, dates, accommodation and chauffeur.",
  alternates: { canonical: "/tours/custom-packages" },
};

export default async function CustomPackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [hero, airportRows, vehicleRows, allHotels, privateDayTours, t] = await Promise.all([
    getSiteContent("tours_hero", locale),
    getAirports(),
    getVehicles(),
    getAllHotels(),
    getAllDailyPackages({ locale, kind: "private" }),
    getTranslations({ locale, namespace: "customTour.privateDayTours" }),
  ]);

  const hotelsByRegion = allHotels.reduce<Record<string, HotelPublic[]>>((acc, hotel) => {
    if (!acc[hotel.region]) acc[hotel.region] = [];
    acc[hotel.region].push(hotel);
    return acc;
  }, {});

  const airports = airportRows.map((a) => ({
    code: a.code,
    label: a.label,
  }));

  const vehicles = vehicleRows.map((v) => ({
    id: v.vehicle_id,
    label: v.label,
    capacity: v.capacity,
    luggageCapacity: 6,
    note: v.note,
    from: v.from_price,
  }));

  return (
    <>
      <section className="relative z-10 overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/sabrina_trabzon_private_tours.webp"
            alt="Tours hero"
            fill
            className="object-cover object-[center_60%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Custom Package</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
            >
              {hero.page_heading}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              Build your own itinerary — your destinations, your pace, your style.
            </p>
          </Reveal>
          {privateDayTours.length > 0 && (
            <Reveal delay={280}>
              <a
                href={`#${PRIVATE_DAY_TOURS_ID}`}
                className="mt-7 inline-flex items-center gap-2 border border-ochre/70 bg-navy/40 backdrop-blur-sm text-cream px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase hover:bg-ochre hover:text-navy transition-colors duration-200"
              >
                {t("heroLink")} <span aria-hidden>↓</span>
              </a>
            </Reveal>
          )}
        </div>
      </section>

      <PrivateDayTours packages={privateDayTours} />

      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-screen" />}>
          <CustomTourWizard airports={airports} vehicles={vehicles} hotelsByRegion={hotelsByRegion} />
        </Suspense>
      </div>
    </>
  );
}
