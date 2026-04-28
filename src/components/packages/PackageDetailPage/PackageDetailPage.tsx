"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { RegionHeroSVG } from "@/components/illustrations/RegionHeroSVG/RegionHeroSVG";
import { getPackageBySlug } from "@/lib/packages/packages";
import { packageMessage } from "@/lib/whatsapp/whatsapp";
import type { Region } from "@/components/illustrations/RegionHeroSVG/types";
import { TIER_ROMAN, GALLERY_SPAN_CLASSES } from "./constants";
import type { PackageDetailPageProps } from "./types";

function prettyMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function PackageDetailPage({ slug, seedDate = "", seedPeople = "" }: PackageDetailPageProps) {
  const pkg = getPackageBySlug(slug);
  const [tier, setTier] = useState("Signature");
  const [openDay, setOpenDay] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightbox((i) => ((i ?? 0) + 1) % (pkg?.gallery.length ?? 1));
      if (e.key === "ArrowLeft")
        setLightbox((i) => ((i ?? 0) - 1 + (pkg?.gallery.length ?? 1)) % (pkg?.gallery.length ?? 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, pkg, closeLightbox]);

  if (!pkg) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="font-display font-light text-[48px] tracking-tight">Itinerary not found.</h1>
        <GoldButton href="/packages" variant="solid">Back to all itineraries</GoldButton>
      </main>
    );
  }

  const activeTier = pkg.tiers.find((t) => t.name === tier) ?? pkg.tiers[0];
  const waHref = packageMessage({
    name: pkg.name,
    tier,
    date: seedDate || "to be confirmed",
    count: seedPeople || "to be confirmed",
  });

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-[86vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
        <div className="absolute inset-0">
          {pkg.heroImage.startsWith("/") ? (
            <Image src={pkg.heroImage} alt="" fill className="object-cover object-top" priority sizes="100vw" />
          ) : (
            <RegionHeroSVG region={pkg.region as Region} className="w-full h-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/85" />
        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <span className="block font-mono text-[12px] tracking-[0.18em] uppercase text-cream/70 mb-7">
              <Link href="/packages" className="text-ochre hover:underline">Itineraries</Link>
              <span className="mx-2 opacity-50">/</span>
              {pkg.region}
            </span>
          </Reveal>
          <Reveal delay={140}>
            <Kicker className="kicker--light mb-5">
              {pkg.region.toUpperCase()} · {pkg.duration.toUpperCase()}
            </Kicker>
          </Reveal>
          <Reveal delay={260}>
            <h1 className="font-display font-light text-[clamp(48px,8vw,120px)] leading-[0.96] tracking-[-0.03em] mb-7 max-w-[16ch]">
              {pkg.name}
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="font-display italic font-light text-[clamp(18px,2vw,26px)] text-cream/88 max-w-[36ch] leading-[1.4]">
              {pkg.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,130px)] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(40px,6vw,100px)]">
        <div>
          <Reveal>
            <Kicker>The route, in brief</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-6 list-none p-0">
              {[
                ["Duration", pkg.duration],
                ["Region", pkg.region],
                ["Group size", `${pkg.minPeople}–${pkg.maxPeople} guests`],
                ["Available", `${prettyMonth(pkg.availableFrom)} – ${prettyMonth(pkg.availableTo)}`],
              ].map(([label, val]) => (
                <li key={label} className="flex justify-between gap-4 py-3.5 border-b border-rule text-[14px]">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">{label}</span>
                  <em className="not-italic text-ink text-right">{val}</em>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div>
          {pkg.overview.map((para, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className={`text-[clamp(16px,1.4vw,19px)] leading-[1.7] text-ink-soft mb-6 max-w-[60ch] ${i === 0 ? "first-letter:font-display first-letter:italic first-letter:text-[4em] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3.5 first-letter:pt-2 first-letter:text-ochre" : ""}`}>
                {para}
              </p>
            </Reveal>
          ))}
          {/* Inline photo strip */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {pkg.gallery.slice(0, 3).map((src, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ITINERARY ── */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
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
              <Reveal key={day.day} as="li" delay={i * 70} className="relative">
                <button
                  className="w-full text-left grid grid-cols-[auto_80px_1fr_auto] sm:grid-cols-[auto_100px_1fr_auto] gap-4 sm:gap-6 items-center py-5 border-b border-rule"
                  onClick={() => setOpenDay(isOpen ? -1 : day.day)}
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

      {/* ── TIER SELECTOR ── */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
        <div className="mb-14">
          <Reveal><Kicker>Choose your tier</Kicker></Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
              Three ways to travel this route.
            </GoldUnderlineHeading>
          </Reveal>
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
                  <dl className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2 mb-6 text-[13px]">
                    {[
                      ["Vehicle", t.vehicleClass],
                      ["Stay", t.accommodation],
                      ["Group", t.groupSize],
                      ["Guide", t.guideLanguages.join(", ")],
                      ["Meals", t.mealsIncluded],
                    ].map(([dt, dd]) => (
                      <>
                        <dt key={`dt-${dt}`} className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted pt-0.5">{dt}</dt>
                        <dd key={`dd-${dt}`} className="text-ink m-0">{dd}</dd>
                      </>
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

      {/* ── GALLERY ── */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
        <div className="mb-14">
          <Reveal><Kicker>In photographs</Kicker></Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
              Images from the route.
            </GoldUnderlineHeading>
          </Reveal>
        </div>
        <div className="grid grid-cols-6 auto-rows-[180px] gap-3">
          {pkg.gallery.map((src, i) => (
            <button
              key={i}
              className={`relative overflow-hidden bg-navy-soft cursor-zoom-in group ${GALLERY_SPAN_CLASSES[i % GALLERY_SPAN_CLASSES.length]}`}
              onClick={() => setLightbox(i)}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <span className="absolute bottom-2.5 left-3 font-display italic text-cream text-[14px] drop-shadow">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── INCLUDES ── */}
      <section className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div>
            <Kicker>Included</Kicker>
            <ul className="list-none p-0 mt-6">
              {pkg.included.map((x, i) => (
                <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                  <span className="font-display italic text-ochre text-[18px] w-4 flex-shrink-0">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Kicker>Not included</Kicker>
            <ul className="list-none p-0 mt-6">
              {pkg.notIncluded.map((x, i) => (
                <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                  <span className="text-muted text-[18px] w-4 flex-shrink-0">×</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="bg-navy text-cream py-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)] relative overflow-hidden">
        {/* Rings — right (bigger, more layers) */}
        <div aria-hidden="true" className="absolute right-[-180px] top-1/2 -translate-y-1/2 -z-10">
          {[680, 520, 360, 210, 80].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.04 + i * 0.012})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        {/* Rings — left accent */}
        <div aria-hidden="true" className="absolute left-[-140px] top-1/2 -translate-y-1/2 -z-10">
          {[440, 290, 140].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(201,154,63,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        {/* Diagonal hatch — top-left */}
        <div aria-hidden="true" className="deco-hatch" style={{ top: 0, left: 0, width: 360, height: 360, color: "rgba(201,154,63,0.08)" }} />
        {/* Diagonal hatch — bottom-right */}
        <div aria-hidden="true" className="deco-hatch" style={{ bottom: 0, right: 0, width: 280, height: 280, color: "rgba(255,255,255,0.03)" }} />
        <div className="max-w-[1320px] mx-auto relative z-10">
          <Reveal><Kicker className="kicker--light">Reserve</Kicker></Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading as="h2" className="text-[clamp(40px,6vw,84px)] mt-6 mb-7 tracking-[-0.02em]">
              {pkg.name}, {tier} tier.
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-cream/78 text-[17px] max-w-[56ch] mb-10 leading-relaxed">
              We&#39;ll confirm dates, group size, and the small details — usually within the hour.
              {seedDate && <> &nbsp;·&nbsp; <em className="text-ochre not-italic">Date: {seedDate}</em></>}
              {seedPeople && <> &nbsp;·&nbsp; <em className="text-ochre not-italic">Group: {seedPeople}</em></>}
            </p>
          </Reveal>
          <Reveal delay={280}>
            <GoldButton href={waHref} variant="solid" target="_blank" rel="noopener noreferrer" className="text-[14px] px-8 py-5">
              Reserve via WhatsApp
            </GoldButton>
          </Reveal>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-navy/96 z-[200] flex items-center justify-center p-14"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          style={{ animation: "fadeIn 240ms ease-out" }}
        >
          <button
            className="absolute top-6 right-7 text-cream text-3xl leading-none w-11 h-11 border border-cream/30 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
            aria-label="Close lightbox"
            onClick={closeLightbox}
          >
            ×
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-cream text-[48px] leading-none w-14 h-14 border border-cream/20 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => ((i ?? 0) - 1 + pkg.gallery.length) % pkg.gallery.length); }}
          >
            ‹
          </button>
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={pkg.gallery[lightbox]}
              alt=""
              width={1200}
              height={800}
              className="object-contain max-h-[80vh]"
              priority
            />
          </div>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-cream text-[48px] leading-none w-14 h-14 border border-cream/20 flex items-center justify-center hover:border-ochre hover:text-ochre transition-colors"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => ((i ?? 0) + 1) % pkg.gallery.length); }}
          >
            ›
          </button>
          <span className="absolute bottom-7 left-1/2 -translate-x-1/2 font-display italic text-cream text-[14px] tracking-[0.1em]">
            {String(lightbox + 1).padStart(2, "0")} / {String(pkg.gallery.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </main>
  );
}
