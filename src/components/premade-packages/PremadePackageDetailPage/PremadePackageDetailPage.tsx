"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { HotelCarousel } from "@/components/primitives/HotelCarousel/HotelCarousel";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
import { WA_BASE, WA_PHONE } from "@/lib/whatsapp/constants";
import { useLocale, useTranslations } from "next-intl";
import { LUCIDE_REGISTRY, type LucideIcon } from "@/lib/icons/lucide-registry";
import { getInclusionIcon } from "@/lib/icons/inclusion-icons";
import { MultiPersonPrices } from "@/components/packages/MultiPersonPrices/MultiPersonPrices";

function InclusionIcon({ name, fallback }: { name: string | null; fallback: string }) {
  const def = getInclusionIcon(name);
  const Component = (def ? LUCIDE_REGISTRY[def.lucide] : LUCIDE_REGISTRY[fallback]) as LucideIcon | undefined;
  if (!Component) return null;
  return <Component size={16} strokeWidth={1.75} />;
}

type PremadePackage = PremadePackagePublic;

type DateRange = { startDate: string; endDate: string };

const GLOW_WINDOW = 3;

function useItineraryGlow(count: number) {
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

const TIER_ROMAN = ["I", "II", "III"] as const;

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function prettyMonth(iso: string, locale: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(locale, { month: "short", year: "numeric" });
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
  locale: string;
}

function ReserveSection({ pkg, tier, onTierChange, dates, selectedDateIdx, setSelectedDateIdx, selectedDate, locale }: ReserveSectionProps) {
  const t = useTranslations("packageDetail");
  const tCommon = useTranslations("common");
  const [people, setPeople] = useState(2);

  const dateLabel = `${formatDate(selectedDate.startDate, locale)} → ${formatDate(selectedDate.endDate, locale)}`;
  const previewMsg = `Hey Sabrina — I'd like to reserve "${pkg.name}" at the ${tier} tier for ${people} guest(s), starting ${dateLabel}. Could you confirm availability?`;
  const waHref = waLink(previewMsg);

  return (
    <section className="pt-[clamp(12px,2vw,24px)] pb-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)] relative z-20">
      <div className="max-w-[1320px] mx-auto">
        <Reveal><Kicker>{t("reserve")}</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(40px,6vw,84px)] mt-6 mb-7 tracking-[-0.02em]">
            {pkg.name}, {tier} tier.
          </GoldUnderlineHeading>
        </Reveal>
        {pkg.price != null && (
          <Reveal delay={140}>
            <div className="mb-8">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-1">{t("startingFrom")}</p>
              <p className="font-display text-[42px] leading-none tracking-[-0.02em] text-ochre mb-1">
                {pkg.currency} {pkg.price.toLocaleString()}
              </p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">{t("perPerson")}</p>
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
            {/* Date select */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("departureDate")}</span>
              <select
                value={selectedDateIdx}
                onChange={(e) => setSelectedDateIdx(Number(e.target.value))}
                className="w-full border-b border-rule bg-transparent font-sans text-[14px] text-ink pb-2.5 pr-6 focus:outline-none focus:border-ochre transition-colors duration-200 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c99a3f' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0 center" }}
              >
                {dates.map((d, i) => {
                  const s = new Date(d.startDate + "T00:00:00");
                  const e = new Date(d.endDate + "T00:00:00");
                  const label = `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString(locale, { month: "short", year: "numeric" })}`;
                  return <option key={i} value={i}>{label}</option>;
                })}
              </select>
            </div>

            {/* Group size stepper */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("numberOfGuests")}</span>
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
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("tierLabel")}</span>
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
            <Kicker className="mb-3">{t("messagePreview")}</Kicker>
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
            <span>{tCommon("reserveWhatsapp")}</span>
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
  const locale = useLocale();
  const t = useTranslations("packageDetail");
  const tCommon = useTranslations("common");
  const dates = pkg.dates && pkg.dates.length > 0 ? pkg.dates : [{ startDate: pkg.startDate, endDate: pkg.endDate }];
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [tier, setTier] = useState("Signature");
  const [openDay, setOpenDay] = useState(1);
  const { refs: dayRefs, active: activeDays } = useItineraryGlow(pkg.itinerary?.length ?? 0);

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
            <div className="flex flex-wrap items-center gap-2">
              <Kicker light>{t("groupPackage")}</Kicker>
              {pkg.region && (
                <span className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase bg-navy/60 text-cream px-2.5 py-1 rounded-full">
                  {pkg.region}
                </span>
              )}
              {pkg.season && (
                <span className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase bg-ochre/90 text-navy px-2.5 py-1 rounded-full">
                  {pkg.season}
                </span>
              )}
            </div>
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

      {/* PDF download */}
      <div className="max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pt-8 flex justify-end">
        <a
          href={`/api/pdf/premade/${pkg.slug}?locale=${locale}`}
          download
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase border border-ochre text-ochre px-4 py-2.5 hover:bg-ochre hover:text-navy transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t("downloadPdf")}
        </a>
      </div>

      {/* Overview — route brief + description */}
      {(pkg.overview || pkg.region) && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,130px)] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(40px,6vw,100px)]">
          <div>
            <Reveal>
              <Kicker>{t("routeInBrief")}</Kicker>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mt-6 list-none p-0">
                {[
                  pkg.duration && [t("duration"), pkg.duration],
                  pkg.region && [t("region"), pkg.region],
                  (pkg.minPeople != null && pkg.maxPeople != null) && [t("groupSize"), `${pkg.minPeople}–${pkg.maxPeople} guests`],
                  (pkg.availableFrom && pkg.availableTo) && [t("available"), `${prettyMonth(pkg.availableFrom, locale)} – ${prettyMonth(pkg.availableTo, locale)}`],
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
            <Reveal><Kicker>{t("dayByDay")}</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                {t("theItinerary")}
              </GoldUnderlineHeading>
            </Reveal>
          </div>
          <ol className="list-none p-0 relative">
            <span className="absolute left-[6px] top-3 bottom-3 w-px bg-rule" aria-hidden="true" />
            {pkg.itinerary.map((day, i) => {
              const isOpen = openDay === day.day;
              const lit = activeDays.has(i);
              return (
                <li key={day.day} ref={(el) => { dayRefs.current[i] = el; }} className="relative">
                  <button
                    className="w-full text-left grid grid-cols-[auto_80px_1fr_auto] sm:grid-cols-[auto_100px_1fr_auto] gap-4 sm:gap-6 items-center py-5 border-b border-rule"
                    onClick={() => setOpenDay(isOpen ? -1 : day.day)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`relative z-10 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-all duration-700 ${
                        isOpen ? "bg-ochre border-ochre" : "bg-cream border-ochre"
                      } ${lit ? "scale-125 shadow-[0_0_14px_5px_rgba(201,154,63,0.7)]" : ""}`}
                    />
                    <span className={`font-display italic text-ochre text-[18px] transition-all duration-700 ${lit ? "drop-shadow-[0_0_8px_rgba(201,154,63,0.9)]" : ""}`}>
                      Day {String(day.day).padStart(2, "0")}
                    </span>
                    <span className={`font-display font-normal text-[clamp(17px,1.8vw,22px)] transition-all duration-700 ${lit ? "drop-shadow-[0_0_6px_rgba(201,154,63,0.6)]" : ""}`}>{day.title}</span>
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
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Multi-person pricing */}
      {pkg.pricing && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(48px,6vw,80px)]">
          <MultiPersonPrices pricing={pkg.pricing} currency={pkg.currency} />
        </section>
      )}

      {/* Tier selector */}
      {pkg.tiers && pkg.tiers.length === 3 && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="mb-14">
            <Reveal><Kicker>{t("chooseYourTier")}</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                {t("threeWaysToTravel")}
              </GoldUnderlineHeading>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Reveal delay={160}>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">{t("essentialSignature")}</p>
                <p className="text-[15px] text-ink-soft leading-[1.65] max-w-[46ch]">
                  {t("essentialSignatureDescShort")}
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-2">{t("private")}</p>
                <p className="text-[15px] text-ink-soft leading-[1.65] max-w-[46ch]">
                  {t("privateDesc")}
                </p>
              </Reveal>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {pkg.tiers.map((tierItem, i) => {
              const active = tierItem.name === tier;
              return (
                <Reveal key={tierItem.name} delay={i * 80}>
                  <button
                    className={`w-full text-left flex flex-col p-8 border transition-all duration-300 cursor-pointer ${
                      active
                        ? "border-ochre bg-[#faf7f0] shadow-[0_4px_40px_-20px_rgba(201,169,97,0.4)]"
                        : "border-rule hover:border-ochre/50 bg-cream"
                    }`}
                    onClick={() => setTier(tierItem.name)}
                    aria-pressed={active}
                  >
                    <div className="flex items-center gap-3.5 mb-5">
                      <span className="font-display italic text-ochre text-[22px] w-8">{TIER_ROMAN[i]}</span>
                      <h3 className="font-display font-normal text-[28px] tracking-tight flex-1">{tierItem.name}</h3>
                      {active && (
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase bg-ochre text-navy px-2.5 py-1">
                          {tCommon("selected")}
                        </span>
                      )}
                    </div>
                    <Hairline className="mb-6 opacity-50" />
                    {tierItem.hotel && (
                      <div className="mb-5 overflow-hidden border border-rule bg-cream-deep">
                        {tierItem.hotel.bedroomImage && (
                          <div className="relative aspect-[4/2.1]">
                            <Image
                              src={tierItem.hotel.bedroomImage}
                              alt={tierItem.hotel.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="font-display text-[19px] leading-tight text-ink">{tierItem.hotel.name}</p>
                          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted mt-1">
                            {tierItem.hotel.region}
                            {tierItem.hotel.stars ? ` · ${"★".repeat(tierItem.hotel.stars)}` : ""}
                          </p>
                        </div>
                      </div>
                    )}
                    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 mb-6 text-[13px]">
                      {[
                        [t("vehicle"), tierItem.vehicleClass],
                        [t("stay"), tierItem.hotel ? tierItem.hotel.name : tierItem.accommodation],
                        [t("group"), tierItem.groupSize],
                        [t("guide"), tierItem.guideLanguages.join(", ")],
                        [t("meals"), tierItem.mealsIncluded],
                      ].map(([dt, dd]) => (
                        <div key={dt} className="contents">
                          <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted pt-0.5 whitespace-nowrap">{dt}</dt>
                          <dd className="text-ink m-0">{dd}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="list-none p-0 border-t border-rule pt-4 space-y-1.5">
                      {tierItem.highlights.map((h, j) => (
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
      <ReserveSection pkg={pkg} tier={tier} onTierChange={setTier} dates={dates} selectedDateIdx={selectedDateIdx} setSelectedDateIdx={setSelectedDateIdx} selectedDate={selectedDate} locale={locale} />

      {/* Gallery */}
      {pkg.gallery.length > 0 && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="mb-10">
            <Reveal><Kicker>{t("inPhotographs")}</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                {t("imagesFromTheRoute")}
              </GoldUnderlineHeading>
            </Reveal>
          </div>
          <div className="max-w-3xl">
            <HotelCarousel images={pkg.gallery} hotelName={pkg.name} showThumbnails={false} />
          </div>
        </section>
      )}

      {/* Includes */}
      {(pkg.included || pkg.notIncluded) && (
        <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {pkg.included && (
              <Reveal>
                <Kicker>{t("included")}</Kicker>
                <ul className="list-none p-0 mt-6">
                  {pkg.included.map((x, i) => (
                    <li key={i} className="flex items-center gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                      <span className="text-ochre flex-shrink-0 w-4 flex items-center justify-center">
                        <InclusionIcon name={x.icon} fallback="Check" />
                      </span>
                      {x.text}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {pkg.notIncluded && (
              <Reveal delay={80}>
                <Kicker>{t("notIncluded")}</Kicker>
                <ul className="list-none p-0 mt-6">
                  {pkg.notIncluded.map((x, i) => (
                    <li key={i} className="flex items-center gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                      <span className="text-muted flex-shrink-0 w-4 flex items-center justify-center">
                        <InclusionIcon name={x.icon} fallback="X" />
                      </span>
                      {x.text}
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
          <span>←</span> {t("allFixedDatePackages")}
        </Link>
      </div>

    </main>
  );
}
