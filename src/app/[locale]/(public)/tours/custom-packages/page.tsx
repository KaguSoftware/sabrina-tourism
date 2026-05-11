import { Suspense } from "react";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { CustomTourWizard } from "@/components/custom-tour/CustomTourWizard";
import { getSiteContent } from "@/lib/db/site-content";
import { getAirports, getVehicles } from "@/lib/db/transport";
import { PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache/config";

export const dynamic = "force-static";
export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export const metadata = {
  title: "Custom Tour Package — Sabrina Turizm",
  description:
    "Build your own private itinerary across Türkiye. Choose your destinations, dates, accommodation and chauffeur.",
  alternates: { canonical: "/tours/custom-packages" },
};

export default async function CustomPackagesPage() {
  const [hero, airportRows, vehicleRows] = await Promise.all([
    getSiteContent("tours_hero"),
    getAirports(),
    getVehicles(),
  ]);

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
            src="/homepage.png"
            alt="Tours hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

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
        </div>
      </section>

      <div className="relative z-10">
        <Suspense fallback={<div className="min-h-screen" />}>
          <CustomTourWizard airports={airports} vehicles={vehicles} />
        </Suspense>
      </div>
    </>
  );
}
