"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
import { WA_BASE, WA_PHONE } from "@/lib/whatsapp/constants";

type PremadePackage = PremadePackagePublic;

type DateRange = { startDate: string; endDate: string };

const TIER_ROMAN = ["I", "II", "III"] as const;

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function prettyMonth(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function waLink(message: string): string {
  const num = WA_PHONE.replace(/[^\d+]/g, "");
  return `${WA_BASE}${encodeURIComponent(num)}?text=${encodeURIComponent(message)}`;
}


interface ReserveSectionProps {
  pkg: PremadePackage;
  tier: string;
  onTierChange: (t: string) => void;
  dates: DateRange[];
  selectedDateIdx: number;
  setSelectedDateIdx: (i: number) => void;
  selectedDate: DateRange;
}

function ReserveSection({ pkg, tier, onTierChange, dates, selectedDateIdx, setSelectedDateIdx, selectedDate }: ReserveSectionProps) {
  const [people, setPeople] = useState(2);

  const dateLabel = `${formatDate(selectedDate.startDate)} → ${formatDate(selectedDate.endDate)}`;
  const previewMsg = `Hey Sabrina — I'd like to reserve "${pkg.name}" at the ${tier} tier for ${people} guest(s), starting ${dateLabel}. Could you confirm availability?`;
  const waHref = waLink(previewMsg);

  return (
    <section className="pt-[clamp(12px,2vw,24px)] pb-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)] relative z-20">
      <div className="max-w-[1320px] mx-auto">
        <Reveal><Kicker>Reserve</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(40px,6vw,84px)] mt-6 mb-7 tracking-[-0.02em]">
            {pkg.name}, {tier} tier.
          </GoldUnderlineHeading>
        </Reveal>
        {pkg.price != null && (
          <Reveal delay={140}>
            <div className="mb-8">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-1">Starting from</p>
              <p className="font-display text-[42px] leading-none tracking-[-0.02em] text-ochre mb-1">
                {pkg.currency} {pkg.price.toLocaleString()}
              </p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">per person</p>
            </div>
          </Reveal>
        )}
        <Reveal delay={160}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre mb-10">
            No payment now &nbsp;·&nbsp; We send a tailored quote first &nbsp;·&nbsp; You confirm only when ready
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[560px] mb-8">
            {/* Date pills */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Start date</span>
              <div className="flex flex-wrap gap-2">
                {dates.map((d, i) => {
                  const s = new Date(d.startDate + "T00:00:00");
                  const e = new Date(d.endDate + "T00:00:00");
                  const label = `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
                  const active = selectedDateIdx === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDateIdx(i)}
                      className="font-sans text-[13px] px-4 py-1.5 rounded-full border transition-all duration-200"
                      style={{
                        backgroundColor: active ? "#0b1a2e" : "transparent",
                        color: active ? "#c99a3f" : "#1f1a14",
                        borderColor: active ? "transparent" : "#c99a3f",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group size stepper */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Number of guests</span>
              <div className="flex items-center border-b border-rule focus-within:border-ochre transition-colors duration-200 pb-2.5 gap-3">
                <button
                  type="button"
                  onClick={() => setPeople((n) => Math.max(1, n - 1))}
                  className="text-ink-soft hover:text-ochre transition-colors text-base leading-none"
                >−</button>
                <span className="font-sans text-[16px] text-ink min-w-[2ch] text-center">{people}</span>
                <button
                  type="button"
                  onClick={() => setPeople((n) => n + 1)}
                  className="text-ink-soft hover:text-ochre transition-colors text-base leading-none"
                >+</button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tier pills */}
        <Reveal delay={220}>
          <div className="flex flex-col gap-2 mb-10 max-w-[560px]">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Tier</span>
            <div className="flex flex-wrap gap-2">
              {(["Essential", "Signature", "Private"] as const).map((t) => {
                const active = tier === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTierChange(t)}
                    className="font-sans text-[13px] px-4 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      backgroundColor: active ? "#0b1a2e" : "transparent",
                      color: active ? "#c99a3f" : "#1f1a14",
                      borderColor: active ? "transparent" : "#c99a3f",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Message preview */}
        <Reveal delay={240}>
          <div className="mb-10 max-w-[640px]">
            <Kicker className="mb-3">Message preview</Kicker>
            <pre className="font-mono text-[12px] leading-[1.7] text-ink-soft whitespace-pre-wrap p-4 border-l-2 border-ochre/50 bg-ochre/5">
              {previewMsg}
            </pre>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <button
            type="button"
            onClick={() => window.open(waHref, "_blank", "noopener,noreferrer")}
            style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
            className="inline-flex items-center gap-4 px-10 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-semibold shadow-[0_4px_32px_-6px_rgba(11,26,46,0.45)] transition-all duration-300 hover:shadow-[0_8px_40px_-6px_rgba(11,26,46,0.35)] hover:scale-[1.02] active:scale-[0.99] group"
          >
            <span>Reserve via WhatsApp</span>
            <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

interface Props {
  pkg: PremadePackage;
}

export function PremadePackageDetailPage({ pkg }: Props) {
  const dates = pkg.dates && pkg.dates.length > 0 ? pkg.dates : [{ startDate: pkg.startDate, endDate: pkg.endDate }];
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [tier, setTier] = useState("Signature");
  const [openDay, setOpenDay] = useState(1);

  const selectedDate = dates[selectedDateIdx] ?? dates[0];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[82vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src={pkg.heroImage}
            alt={pkg.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/85" />

        <div className="relative z-5 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Group Package</Kicker>
          </Reveal>
          <Reveal delay={140}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(48px,7vw,100px)] mt-6 mb-6 tracking-[-0.025em] max-w-[18ch] text-cream leading-[0.96]"
            >
              {pkg.name}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={260}>
            <p className="font-display italic font-light text-[clamp(17px,1.8vw,24px)] text-cream/88 max-w-[40ch] leading-[1.4]">
              {pkg.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Overview — route brief + description */}
      {(pkg.overview || pkg.region) && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,130px)] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(40px,6vw,100px)]">
          <div>
            <Reveal>
              <Kicker>The route, in brief</Kicker>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-6 list-none p-0">
                {[
                  pkg.duration && ["Duration", pkg.duration],
                  pkg.region && ["Region", pkg.region],
                  (pkg.minPeople != null && pkg.maxPeople != null) && ["Group size", `${pkg.minPeople}–${pkg.maxPeople} guests`],
                  (pkg.availableFrom && pkg.availableTo) && ["Available", `${prettyMonth(pkg.availableFrom)} – ${prettyMonth(pkg.availableTo)}`],
                ]
                  .filter((x): x is [string, string] => Boolean(x))
                  .map(([label, val]) => (
                    <li key={label as string} className="flex justify-between gap-4 py-3.5 border-b border-rule text-[14px]">
                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">{label as string}</span>
                      <em className="not-italic text-ink text-right">{val as string}</em>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>
          <div>
            {(pkg.overview ?? [] as string[]).map((para, i) => (
              <Reveal key={i} delay={i * 80}>
                <p
                  className={`text-[clamp(16px,1.4vw,19px)] leading-[1.7] text-ink-soft mb-6 max-w-[60ch] ${
                    i === 0
                      ? "first-letter:font-display first-letter:italic first-letter:text-[4em] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3.5 first-letter:pt-2 first-letter:text-ochre"
                      : ""
                  }`}
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Itinerary */}
      {pkg.itinerary && pkg.itinerary.length > 0 && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="mb-14">
            <Reveal><Kicker>Day by day</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                The itinerary.
              </GoldUnderlineHeading>
            </Reveal>
          </div>
          <ol className="list-none p-0 relative">
            <span className="absolute left-[6px] top-3 bottom-3 w-px bg-rule" aria-hidden="true" />
            {pkg.itinerary.map((day, i) => {
              const isOpen = openDay === day.day;
              return (
                <Reveal key={day.day} as="li" delay={i * 60} className="relative">
                  <button
                    className="w-full text-left grid grid-cols-[auto_80px_1fr_auto] sm:grid-cols-[auto_100px_1fr_auto] gap-4 sm:gap-6 items-center py-5 border-b border-rule"
                    onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`relative z-10 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors duration-200 ${
                        isOpen ? "bg-ochre border-ochre" : "bg-cream border-ochre"
                      }`}
                    />
                    <span className="font-display italic text-ochre text-[18px]">
                      Day {String(day.day).padStart(2, "0")}
                    </span>
                    <span className="font-display font-normal text-[clamp(17px,1.8vw,22px)]">{day.title}</span>
                    <span className="text-ochre text-[20px] w-6 text-center" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "300px" : "0px" }}
                  >
                    <p className="pl-[148px] sm:pl-[168px] pt-2 pb-6 text-ink-soft leading-[1.65] max-w-[64ch]">
                      {day.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </section>
      )}

      {/* Tier selector */}
      {pkg.tiers && pkg.tiers.length === 3 && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="mb-14">
            <Reveal><Kicker>Choose your tier</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                Three ways to travel this route.
              </GoldUnderlineHeading>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Reveal delay={160}>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">Essential & Signature</p>
                <p className="text-[15px] text-ink-soft leading-[1.65] max-w-[46ch]">
                  Small-group departures on fixed dates. You travel alongside other like-minded guests — ideal for solo travellers or couples who enjoy a social dynamic.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">Private</p>
                <p className="text-[15px] text-ink-soft leading-[1.65] max-w-[46ch]">
                  Exclusively yours. Dates, pace, and add-ons set around your group. No shared vehicles, no shared guides — just your party and our team.
                </p>
              </Reveal>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {pkg.tiers.map((t, i) => {
              const active = t.name === tier;
              return (
                <Reveal key={t.name} delay={i * 80}>
                  <button
                    className={`w-full text-left flex flex-col p-8 border transition-all duration-300 cursor-pointer ${
                      active
                        ? "border-ochre bg-[#faf7f0] shadow-[0_4px_40px_-20px_rgba(201,169,97,0.4)]"
                        : "border-rule hover:border-ochre/50 bg-cream"
                    }`}
                    onClick={() => setTier(t.name)}
                    aria-pressed={active}
                  >
                    <div className="flex items-center gap-3.5 mb-5">
                      <span className="font-display italic text-ochre text-[22px] w-8">{TIER_ROMAN[i]}</span>
                      <h3 className="font-display font-normal text-[28px] tracking-tight flex-1">{t.name}</h3>
                      {active && (
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase bg-ochre text-navy px-2.5 py-1">
                          Selected
                        </span>
                      )}
                    </div>
                    <Hairline className="mb-6 opacity-50" />
                    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 mb-6 text-[13px]">
                      {[
                        ["Vehicle", t.vehicleClass],
                        ["Stay", t.accommodation],
                        ["Group", t.groupSize],
                        ["Guide", t.guideLanguages.join(", ")],
                        ["Meals", t.mealsIncluded],
                      ].map(([dt, dd]) => (
                        <div key={dt} className="contents">
                          <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted pt-0.5 whitespace-nowrap">{dt}</dt>
                          <dd className="text-ink m-0">{dd}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="list-none p-0 border-t border-rule pt-4 space-y-1.5">
                      {t.highlights.map((h, j) => (
                        <li key={j} className="text-[13px] text-ink-soft pl-4 relative">
                          <span className="absolute left-0 top-[9px] w-2 h-px bg-ochre" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Reserve section */}
      <ReserveSection pkg={pkg} tier={tier} onTierChange={setTier} dates={dates} selectedDateIdx={selectedDateIdx} setSelectedDateIdx={setSelectedDateIdx} selectedDate={selectedDate} />

      {/* Gallery */}
      {pkg.gallery.length > 0 && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="mb-10">
            <Reveal><Kicker>In photographs</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                Images from the route.
              </GoldUnderlineHeading>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pkg.gallery.map((src, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="relative aspect-[4/3] overflow-hidden border border-rule group">
                  <Image
                    src={src}
                    alt={`${pkg.destinations[i % pkg.destinations.length]} scene`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <span className="absolute bottom-2 left-2 font-mono text-[10px] tracking-[0.2em] uppercase text-cream bg-navy/70 px-2 py-1">
                    {pkg.destinations[i % pkg.destinations.length]}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Includes */}
      {(pkg.included || pkg.notIncluded) && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {pkg.included && (
              <Reveal>
                <Kicker>Included</Kicker>
                <ul className="list-none p-0 mt-6">
                  {pkg.included.map((x, i) => (
                    <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                      <span className="font-display italic text-ochre text-[18px] w-4 flex-shrink-0">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {pkg.notIncluded && (
              <Reveal delay={80}>
                <Kicker>Not included</Kicker>
                <ul className="list-none p-0 mt-6">
                  {pkg.notIncluded.map((x, i) => (
                    <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                      <span className="text-muted text-[18px] w-4 flex-shrink-0">×</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-12">
        <Link
          href="/tours/fixed-dates"
          className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] uppercase text-ink-soft hover:text-ochre transition-colors duration-200"
        >
          <span>←</span> All fixed-date packages
        </Link>
      </div>
    </main>
  );
}
