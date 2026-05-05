import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Packages — Sabrina Turizm",
  description:
    "Handpicked day tours across Türkiye's most iconic destinations.",
  alternates: { canonical: "/tours/daily-packages" },
};

const DAILY_TOURS = [
  {
    day: "1 Day",
    title: "Cappadocia Highlights",
    description:
      "Hot-air balloon at sunrise, underground cities, and fairy chimneys in a single unforgettable day.",
    region: "Cappadocia",
  },
  {
    day: "1 Day",
    title: "Ephesus & Pamukkale",
    description:
      "Walk ancient Roman streets then soak in the white travertine terraces of Pamukkale.",
    region: "Aegean",
  },
  {
    day: "1 Day",
    title: "Bosphorus & Old Istanbul",
    description:
      "Cruise the strait, visit Hagia Sophia, the Grand Bazaar, and end with a rooftop dinner.",
    region: "Istanbul",
  },
];

export default function DailyPackagesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-[clamp(20px,4vw,56px)] max-w-[1320px] mx-auto">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-4">
          Tours · Daily
        </p>
        <h1 className="font-display text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.02em] text-navy mb-8">
          Daily Packages
        </h1>
        <p className="text-[17px] leading-relaxed text-ink/70 max-w-xl mb-12">
          Short on time? Our curated day tours pack the best of each destination
          into a single, expertly guided experience — no overnight stay
          required.
        </p>

        <div className="flex flex-col gap-px border border-rule bg-rule">
          {DAILY_TOURS.map((tour) => (
            <div
              key={tour.title}
              className="bg-cream p-6 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="shrink-0 flex flex-col items-start sm:w-24">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre">
                  {tour.day}
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted mt-0.5">
                  {tour.region}
                </span>
              </div>
              <div>
                <p className="font-display text-[18px] leading-snug text-navy mb-1">
                  {tour.title}
                </p>
                <p className="text-[14px] leading-relaxed text-ink/60">
                  {tour.description}
                </p>
              </div>
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
            Book a Day Tour
          </a>
        </div>
      </div>
    </main>
  );
}
