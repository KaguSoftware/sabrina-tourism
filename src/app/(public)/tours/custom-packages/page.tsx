import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Packages — Sabrina Turizm",
  description:
    "Tailor-made itineraries built around your schedule, interests, and group size.",
  alternates: { canonical: "/tours/custom-packages" },
};

export default function CustomPackagesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-[clamp(20px,4vw,56px)] max-w-[1320px] mx-auto">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-4">
          Tours · Custom
        </p>
        <h1 className="font-display text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.02em] text-navy mb-8">
          Custom Packages
        </h1>
        <p className="text-[17px] leading-relaxed text-ink/70 max-w-xl mb-12">
          Every traveller is different. Tell us your dream itinerary — the
          regions, experiences, and pace that suit you — and we'll build a
          private programme around it. From boutique hotels to off-road
          adventures, nothing is off the menu.
        </p>

        <div className="grid sm:grid-cols-3 gap-px border border-rule bg-rule">
          {[
            {
              title: "Private Groups",
              body: "Exclusive vehicle, guide, and schedule for your party only.",
            },
            {
              title: "Flexible Dates",
              body: "Depart any day of the year — we work around your calendar.",
            },
            {
              title: "Bespoke Route",
              body: "Mix regions, add side-trips, or slow down wherever you like.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-cream p-6 flex flex-col gap-2">
              <p className="font-display text-[18px] leading-snug text-navy">
                {card.title}
              </p>
              <p className="text-[14px] leading-relaxed text-ink/60">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="https://wa.me/905000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-[12px] tracking-[0.16em] uppercase font-semibold text-ochre border border-ochre hover:bg-ochre hover:text-cream transition-colors duration-200"
          >
            Plan My Custom Trip
          </a>
        </div>
      </div>
    </main>
  );
}
