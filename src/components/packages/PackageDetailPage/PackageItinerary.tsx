"use client";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import type { ItineraryDay } from "@/lib/packages/types";

export function PackageItinerary({
  itinerary,
  openDay,
  onToggle,
  pdfUrl,
  pdfLabel,
}: {
  itinerary: ItineraryDay[];
  openDay: number;
  onToggle: (day: number) => void;
  pdfUrl?: string;
  pdfLabel?: string;
}) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="mb-14">
        <Reveal><Kicker>Day by day</Kicker></Reveal>
        <Reveal delay={120}>
          <div className="mt-4 flex items-end justify-between gap-6 flex-wrap">
            <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] tracking-[-0.02em]">
              The itinerary.
            </GoldUnderlineHeading>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase border border-ochre text-ochre px-4 py-2.5 hover:bg-ochre hover:text-navy transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {pdfLabel ?? "Download PDF"}
              </a>
            )}
          </div>
        </Reveal>
      </div>
      <ol className="list-none p-0 relative">
        <span className="absolute left-[6px] top-3 bottom-3 w-px bg-rule" aria-hidden="true" />
        {itinerary.map((day, i) => {
          const isOpen = openDay === day.day;
          return (
            <Reveal key={day.day} as="li" delay={i * 70} className="relative">
              <button
                className="w-full text-left grid grid-cols-[auto_80px_1fr_auto] sm:grid-cols-[auto_100px_1fr_auto] gap-4 sm:gap-6 items-center py-5 border-b border-rule"
                onClick={() => onToggle(day.day)}
                aria-expanded={isOpen}
              >
                <span className={`relative z-10 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors duration-200 ${isOpen ? "bg-ochre border-ochre" : "bg-cream border-ochre"}`} />
                <span className="font-display italic text-ochre text-[18px]">
                  Day {String(day.day).padStart(2, "0")}
                </span>
                <span className="font-display font-normal text-[clamp(17px,1.8vw,22px)]">{day.title}</span>
                <span className="text-ochre text-[20px] w-6 text-center" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <div className={`timeline-body ${isOpen ? "open" : ""} pl-[148px] sm:pl-[168px]`}>
                <div className="timeline-body-inner">
                  <p className="pt-2 pb-6 text-ink-soft leading-[1.65] max-w-[64ch]">{day.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
