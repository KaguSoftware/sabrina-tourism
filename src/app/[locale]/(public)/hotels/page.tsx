import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCard } from "@/components/hotels/HotelCard/HotelCard";
import { getAllHotels } from "@/lib/db/hotels";

export const revalidate = 60;

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

export default async function HotelsPage() {
  const hotels = await getAllHotels();

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 pt-[clamp(80px,10vw,140px)] pb-[clamp(40px,6vw,80px)] px-[clamp(20px,4vw,56px)]">
        <div className="max-w-[1320px] mx-auto">
          <Reveal>
            <Kicker>Our hotels</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(36px,5vw,72px)] mt-4 tracking-[-0.02em] max-w-[18ch]"
            >
              Curated stays across Türkiye
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-[clamp(15px,1.3vw,18px)] text-ink-soft leading-[1.6] max-w-[52ch]">
              Every property is hand-selected for its character, location, and the experience it delivers — from boutique cave hotels to waterfront retreats.
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
            {hotels.length === 1 ? "property" : "properties"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
            {hotels.map((hotel, i) => (
              <Reveal key={hotel.id} delay={i * 70}>
                <HotelCard hotel={hotel} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
