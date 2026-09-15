"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { HotelCarousel } from "@/components/primitives/HotelCarousel/HotelCarousel";
import { InclusionIcon } from "@/lib/icons/InclusionIcon";
import { useScrollAnchorGlow } from "@/lib/hooks/useScrollAnchorGlow/useScrollAnchorGlow";
import { DailyPrices } from "@/components/daily/DailyPrices/DailyPrices";
import type { DailyPackage, DailyInclusionItem } from "@/lib/daily/types";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/lib/currency/context";
import { formatPrice } from "@/lib/currency/format";
import { formatDate } from "@/lib/format/date";
import { WA_PHONE } from "@/lib/whatsapp/constants";

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// "Today" is rendered into the markup (the date input's `min`), so it has to be
// computed identically on the server and in the browser. toYMD reads local date
// parts, which differ whenever the server's timezone and the visitor's fall on
// opposite sides of midnight — a hydration mismatch for hours every day. UTC is
// the same everywhere.
function todayUTC() {
  return new Date().toISOString().split("T")[0];
}

const CHILD_DISCOUNT = 0.25;

function partyText(adults: number, children: number): string {
  const a = `${adults} adult${adults !== 1 ? "s" : ""}`;
  if (children <= 0) return a;
  const c = `${children} child${children !== 1 ? "ren" : ""}`;
  return `${a} and ${c}`;
}

function bookMessage(
  pkg: DailyPackage,
  date: string,
  adults: number,
  children: number,
  locale: string,
): string {
  const num = WA_PHONE.replace(/[^\d+]/g, "");
  const dateStr = date ? formatDate(date, locale, "full") : "a date TBD";
  const text = encodeURIComponent(
    `Hey Sabrina — I'd like to book the "${pkg.name}" daily tour on ${dateStr} (${pkg.startTime}–${pkg.endTime}) for ${partyText(adults, children)}. Could you confirm availability?`,
  );
  return `https://wa.me/${num}?text=${text}`;
}

export function DailyDetailPage({ pkg }: { pkg: DailyPackage }) {
  const locale = useLocale();
  const t = useTranslations("daily");
  const tA = useTranslations("aria");
  const tNav = useTranslations("nav");
  const { currency, rates } = useCurrency();
  const today = todayUTC();
  const MAX_ADULTS = 20;
  const MAX_CHILDREN = 10;
  const [selectedDate, setSelectedDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const { refs: stopRefs, active: activeStops } = useScrollAnchorGlow<HTMLLIElement>(pkg.stops.length);
  const childPrice = pkg.pricing?.pricePerChild ?? pkg.price * (1 - CHILD_DISCOUNT);
  const totalPrice = adults * pkg.price + children * childPrice;
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
                {tNav("dailyPackages")}
              </Link>
              <span className="mx-2 opacity-50">/</span>
              {pkg.region}
            </span>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Kicker className="kicker--light">
                {pkg.region} · DAY EXPERIENCE
              </Kicker>
              {pkg.season && (
                <span className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase bg-ochre/90 text-navy px-2.5 py-1 rounded-full">
                  {pkg.season}
                </span>
              )}
            </div>
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
          href={`/api/pdf/daily/${pkg.slug ?? pkg.id}?locale=${locale}`}
          download
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase border border-ochre text-ochre px-4 py-2.5 hover:bg-ochre hover:text-navy transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </a>
      </div>

      {/* Adult / Child pricing */}
      <div className="max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pb-10 pt-4">
        <DailyPrices adultPrice={pkg.price} childPrice={childPrice} />
      </div>

      {/* Content */}
      <div className="relative max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-20 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16" style={{ zIndex: 10 }}>
        {/* Left column */}
        <div>
          {/* Carousel — top */}
          <Reveal>
            <div className="mb-14" style={{ zIndex: 10 }}>
              <HotelCarousel images={pkg.groupImages} labels={pkg.groupImageLabels} hotelName={pkg.name} />
            </div>
          </Reveal>

          {/* Schedule timeline */}
          <Reveal>
            <h2 className="sr-only">{t("dayItinerary")}</h2>
            <Kicker className="mb-6">{t("dayItinerary")}</Kicker>
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
                <h2 className="sr-only">{t("whatsIncluded")}</h2>
                <Kicker className="mb-6">{t("whatsIncluded")}</Kicker>
              </Reveal>
              <ul className="space-y-3">
                {pkg.included.map((item, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <li className="flex items-center gap-3 text-[15px] text-ink-soft leading-[1.6]">
                      <span className="text-ochre shrink-0 w-4 flex items-center justify-center">
                        <InclusionIcon name={item.icon} fallback="Check" />
                      </span>
                      {item.text}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div>
              <Reveal>
                <h2 className="sr-only">{t("whatsNotIncluded")}</h2>
                <Kicker className="mb-6">{t("whatsNotIncluded")}</Kicker>
              </Reveal>
              <ul className="space-y-3">
                {(pkg.notIncluded?.length
                  ? pkg.notIncluded
                  : ([
                      { text: "Hotel accommodation", icon: null },
                      { text: "Breakfast", icon: null },
                    ] as DailyInclusionItem[])
                ).map((item, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <li className="flex items-center gap-3 text-[15px] text-ink-soft leading-[1.6]">
                      <span className="text-muted shrink-0 w-4 flex items-center justify-center">
                        <InclusionIcon name={item.icon} fallback="X" />
                      </span>
                      {item.text}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right column — sticky booking card */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <div className="bg-[#fcf5ec] border border-rule shadow-[4px_6px_0_-1px_#1b4d5c] p-6">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-1">
                  Ticket Price
                </p>
                <p className="font-display text-[42px] leading-none tracking-[-0.02em] text-ochre mb-1">
                  {formatPrice(pkg.price, currency, rates, locale)}
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
                      Adults
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={tA("removeAdult")}
                          disabled={adults <= 1}
                          onClick={() => setAdults((a) => Math.max(1, a - 1))}
                          className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rule disabled:hover:text-ink-soft"
                        >−</button>
                        <span className="font-mono text-[16px] text-ink min-w-[2ch] text-center" aria-live="polite">{adults}</span>
                        <button
                          type="button"
                          aria-label={tA("addAdult")}
                          disabled={adults >= MAX_ADULTS}
                          onClick={() => setAdults((a) => Math.min(MAX_ADULTS, a + 1))}
                          className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rule disabled:hover:text-ink-soft"
                        >+</button>
                      </div>
                      <span className="font-mono text-[11px] text-muted ml-auto text-right">
                        {formatPrice(pkg.price, currency, rates, locale)} ea.
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">
                      Children <span className="text-ochre normal-case tracking-normal">· {Math.max(0, Math.round((1 - childPrice / pkg.price) * 100))}% off</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={tA("removeChild")}
                          disabled={children <= 0}
                          onClick={() => setChildren((c) => Math.max(0, c - 1))}
                          className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rule disabled:hover:text-ink-soft"
                        >−</button>
                        <span className="font-mono text-[16px] text-ink min-w-[2ch] text-center" aria-live="polite">{children}</span>
                        <button
                          type="button"
                          aria-label={tA("addChild")}
                          disabled={children >= MAX_CHILDREN}
                          onClick={() => setChildren((c) => Math.min(MAX_CHILDREN, c + 1))}
                          className="w-8 h-8 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rule disabled:hover:text-ink-soft"
                        >+</button>
                      </div>
                      <span className="font-mono text-[11px] text-muted ml-auto text-right">
                        {formatPrice(childPrice, currency, rates, locale)} ea.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                      Total
                    </p>
                    <p className="font-display text-[22px] leading-none tracking-[-0.02em] text-ink">
                      {formatPrice(totalPrice, currency, rates, locale)}
                    </p>
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
                      {`Hey Sabrina — I'd like to book the "${pkg.name}" daily tour on ${formatDate(selectedDate, locale, "full")} (${pkg.startTime}–${pkg.endTime}) for ${partyText(adults, children)}. Could you confirm availability?`}
                    </p>
                  </div>
                )}

                <GoldButton
                  href={selectedDate ? bookMessage(pkg, selectedDate, adults, children, locale) : "#"}
                  variant="solid"
                  target={selectedDate ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={!selectedDate}
                  tabIndex={!selectedDate ? -1 : undefined}
                  className={`w-full justify-center ${!selectedDate ? "opacity-50" : ""}`}
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
