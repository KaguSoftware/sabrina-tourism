import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixed-Date Tours — Sabrina Turizm",
  description:
    "Scheduled group departures with set itineraries — book your seat and we handle the rest.",
  alternates: { canonical: "/tours/fixed-dates" },
};

const DEPARTURES = [
  {
    date: "15 Jun 2026",
    duration: "8 Days",
    title: "Türkiye Grand Circuit",
    seats: 4,
    description:
      "Istanbul → Cappadocia → Konya → Pamukkale → Ephesus. A full sweep of the country's highlights.",
  },
  {
    date: "3 Jul 2026",
    duration: "5 Days",
    title: "Aegean Coast Explorer",
    seats: 6,
    description:
      "Izmir, Bodrum, Ephesus, and Pamukkale — the best of the western coast in five days.",
  },
  {
    date: "22 Aug 2026",
    duration: "6 Days",
    title: "Cappadocia & Black Sea",
    seats: 2,
    description:
      "Fairy chimneys by day, lush Black Sea highlands by evening. A rare pairing of landscapes.",
  },
];

export default function FixedDatesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-[clamp(20px,4vw,56px)] max-w-[1320px] mx-auto">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-4">
          Tours · Scheduled
        </p>
        <h1 className="font-display text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.02em] text-navy mb-8">
          Fixed-Date Tours
        </h1>
        <p className="text-[17px] leading-relaxed text-ink/70 max-w-xl mb-12">
          Join one of our upcoming group departures. Every seat includes a
          private guide, luxury transport, and hand-picked hotels — just choose
          a date and pack.
        </p>

        <div className="flex flex-col gap-px border border-rule bg-rule">
          {DEPARTURES.map((dep) => (
            <div
              key={dep.title}
              className="bg-cream p-6 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="shrink-0 flex flex-col items-start sm:w-32">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre">
                  {dep.date}
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted mt-0.5">
                  {dep.duration}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] uppercase mt-1 ${
                    dep.seats <= 2 ? "text-red-500" : "text-muted"
                  }`}
                >
                  {dep.seats} seats left
                </span>
              </div>
              <div>
                <p className="font-display text-[18px] leading-snug text-navy mb-1">
                  {dep.title}
                </p>
                <p className="text-[14px] leading-relaxed text-ink/60">
                  {dep.description}
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
            Reserve My Seat
          </a>
        </div>
      </div>
    </main>
  );
}
