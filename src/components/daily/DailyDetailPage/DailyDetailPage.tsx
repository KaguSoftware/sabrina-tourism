"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { HotelCarousel } from "@/components/primitives/HotelCarousel/HotelCarousel";
import type { DailyPackage } from "@/lib/daily/types";

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function bookMessage(pkg: DailyPackage, date: string, guests: number): string {
  const phone = process.env.NEXT_PUBLIC_WA_PHONE ?? "";
  const num = phone.replace(/[^\d+]/g, "");
  const dateStr = date ? formatDate(date) : "a date TBD";
  const text = encodeURIComponent(
    `Hey Sabrina — I'd like to book the "${pkg.name}" daily tour on ${dateStr} (${pkg.startTime}–${pkg.endTime}) for ${guests} guest${guests !== 1 ? "s" : ""}. Could you confirm availability?`
  );
  return `https://wa.me/${num}?text=${text}`;
}

const GLOW_WINDOW = 3;

function useStopGlow(count: number) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [anchor, setAnchor] = useState<number | null>(null);

  useEffect(() => {
    function onScroll() {
      const mid = window.innerHeight / 2;
      let closest = -1;
      let closestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      if (closest !== -1) setAnchor(closest);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [count]);

  const active = new Set(
    anchor === null
      ? []
      : Array.from({ length: GLOW_WINDOW }, (_, k) => anchor - (GLOW_WINDOW - 1) + k).filter((i) => i >= 0 && i < count)
  );
  return { refs, active };
}

export function DailyDetailPage({ pkg }: { pkg: DailyPackage }) {
  const today = toYMD(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);
  const { refs: stopRefs, active: activeStops } = useStopGlow(pkg.stops.length);
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[86vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
        <div className="absolute inset-0 z-[-1]">
          <Image
            src={pkg.heroImage}
            alt={pkg.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/85" />

        <div className="relative z-5 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <span className="block font-mono text-[12px] tracking-[0.18em] uppercase text-cream/70 mb-7">
              <Link href="/tours/daily-packages" className="text-ochre hover:underline">
                Daily Packages
              </Link>
              <span className="mx-2 opacity-50">/</span>
              {pkg.region}
            </span>
          </Reveal>

          <Reveal delay={140}>
            <Kicker className="kicker--light mb-5">
              {pkg.region.toUpperCase()} · DAY EXPERIENCE
            </Kicker>
          </Reveal>

          <div className="inline-block backdrop-blur-[1px] bg-black/30 rounded-3xl px-[5%] py-5">
            <Reveal delay={260}>
              <h1 className="font-display font-light text-[clamp(48px,8vw,120px)] leading-[0.96] tracking-[-0.03em] mb-4 max-w-[16ch]">
                {pkg.name}
              </h1>
            </Reveal>
            <Reveal delay={360}>
              <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-cream/80 mb-3">
                {pkg.startTime} – {pkg.endTime}
              </p>
            </Reveal>
            <Reveal delay={440}>
              <p className="font-display italic font-light text-[clamp(18px,2vw,26px)] text-cream/88 max-w-[36ch] leading-[1.4]">
                {pkg.shortDescription}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PDF download */}
      <div className="max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pt-8 flex justify-end">
        <a
          href={`/api/pdf/daily/${pkg.id}`}
          download
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase border border-ochre text-ochre px-4 py-2.5 hover:bg-ochre hover:text-navy transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </a>
      </div>

      {/* Content */}
      <div className="relative max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-20 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16" style={{ zIndex: 10 }}>
        {/* Left column */}
        <div>
          {/* Carousel — top */}
          <Reveal>
            <div className="mb-14" style={{ zIndex: 10 }}>
              <HotelCarousel images={pkg.groupImages} hotelName={pkg.name} />
            </div>
          </Reveal>

          {/* Schedule timeline */}
          <Reveal>
            <Kicker className="mb-6">Day Itinerary</Kicker>
          </Reveal>
          <ol className="relative border-l border-rule pl-8 space-y-10 mb-20">
            {pkg.stops.map((stop, i) => {
              const lit = activeStops.has(i);
              return (
                <li
                  key={i}
                  ref={(el) => { stopRefs.current[i] = el; }}
                  className="relative"
                >
                  {/* dot */}
                  <span className={`absolute -left-10.25 top-1.5 w-3 h-3 rounded-full bg-ochre border-2 border-cream shadow transition-all duration-700 ${lit ? "scale-125 shadow-[0_0_14px_5px_rgba(212,175,55,0.7)]" : ""}`} />
                  {(i === 0 || i === pkg.stops.length - 1) && (
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ochre mb-1">
                      {stop.time}
                    </p>
                  )}
                  <h3 className={`font-display text-[20px] leading-tight mb-1 text-ink transition-all duration-700 w-fit ${lit ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.9)]" : ""}`}>
                    {stop.place}
                  </h3>
                  <p className={`text-[15px] text-ink-soft leading-[1.6] transition-all duration-700 w-fit ${lit ? "drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" : ""}`}>
                    {stop.description}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Inclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <Reveal>
                <Kicker className="mb-6">What's Included</Kicker>
              </Reveal>
              <ul className="space-y-3">
                {pkg.included.map((item, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <li className="flex items-start gap-3 text-[15px] text-ink-soft leading-[1.6]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ochre shrink-0" />
                      {item}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div>
              <Reveal>
                <Kicker className="mb-6">What's Not Included</Kicker>
              </Reveal>
              <ul className="space-y-3">
                <Reveal>
                  <li className="flex items-start gap-3 text-[15px] text-ink-soft leading-[1.6]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    Hotel accommodation
                  </li>
                </Reveal>
                <Reveal>
                  <li className="flex items-start gap-3 text-[15px] text-ink-soft leading-[1.6]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    Breakfast
                  </li>
                </Reveal>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column — sticky booking card */}
        <aside>
          <div className="sticky top-24">
            <Reveal>
              <div className="bg-[#fcf5ec] border border-rule shadow-[4px_6px_0_-1px_#1b4d5c] p-6">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-1">
                  Ticket Price
                </p>
                <p className="font-display text-[42px] leading-none tracking-[-0.02em] text-ochre mb-1">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </p>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-6">
                  per person
                </p>

                <div className="border-t border-rule pt-5 mb-5 space-y-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">
                      Select your date
                    </p>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      min={today}
                      placeholder="Pick a date"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">
                      Number of guests
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none"
                      >−</button>
                      <span className="font-mono text-[16px] text-ink min-w-[2ch] text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => g + 1)}
                        className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none"
                      >+</button>
                      <span className="font-mono text-[11px] text-muted">guest{guests !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">
                      Timeframe
                    </p>
                    <p className="text-[14px] text-ink font-medium">
                      {pkg.startTime} – {pkg.endTime}
                    </p>
                  </div>
                </div>

                {selectedDate && (
                  <div className="border-l-2 border-ochre bg-cream-deep p-3 mb-4">
                    <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted mb-1.5">Message preview</p>
                    <p className="font-sans text-[12px] text-ink-soft leading-snug">
                      {`Hey Sabrina — I'd like to book the "${pkg.name}" daily tour on ${formatDate(selectedDate)} (${pkg.startTime}–${pkg.endTime}) for ${guests} guest${guests !== 1 ? "s" : ""}. Could you confirm availability?`}
                    </p>
                  </div>
                )}

                <GoldButton
                  href={selectedDate ? bookMessage(pkg, selectedDate, guests) : undefined}
                  variant="solid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full justify-center ${!selectedDate ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Book This Day
                </GoldButton>

                {!selectedDate && (
                  <p className="text-[12px] text-muted text-center mt-3">Pick a date above to continue.</p>
                )}
              </div>
            </Reveal>
          </div>
        </aside>
      </div>
    </>
  );
}
