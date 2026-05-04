"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { PackageHero } from "./PackageHero";
import { PackageOverview } from "./PackageOverview";
import { PackageItinerary } from "./PackageItinerary";
import { PackageTierSelector } from "./PackageTierSelector";
import { PackageIncludes } from "./PackageIncludes";
import { PackageGallery } from "./PackageGallery";
import { PackageCTAStrip } from "./PackageCTAStrip";
import { PackageLightbox } from "./PackageLightbox";
import type { PackageDetailPageProps } from "./types";

const VALID_TIERS = ["Essential", "Signature", "Private"];

export function PackageDetailPage({ pkg, seedDate = "", seedPeople = "", seedTier = "" }: PackageDetailPageProps) {
  const initialTier = VALID_TIERS.includes(seedTier) ? seedTier : "Signature";
  const [tier, setTier] = useState(initialTier);
  const [openDay, setOpenDay] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [date, setDate] = useState(seedDate);
  const [people, setPeople] = useState(seedPeople);
  const heroRef = useRef<HTMLDivElement>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightbox((i) => ((i ?? 0) + 1) % pkg.gallery.length);
      if (e.key === "ArrowLeft")
        setLightbox((i) => ((i ?? 0) - 1 + pkg.gallery.length) % pkg.gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, pkg, closeLightbox]);

  const activeTier = pkg.tiers.find((t) => t.name === tier) ?? pkg.tiers[0];

  const scrollToReserveInputs = () => {
    document
      .getElementById("package-reserve-inputs")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main>
      <div ref={heroRef}>
        <PackageHero pkg={pkg} />
      </div>
      <PackageOverview pkg={pkg} />
      <PackageItinerary
        itinerary={pkg.itinerary}
        openDay={openDay}
        onToggle={(day) => setOpenDay(openDay === day ? -1 : day)}
      />
      <PackageTierSelector
        tiers={pkg.tiers}
        activeTierName={activeTier.name}
        onSelect={setTier}
      />
      <PackageCTAStrip
        packageName={pkg.name}
        tierName={tier}
        date={date}
        people={people}
        onDateChange={setDate}
        onPeopleChange={setPeople}
        onTierChange={setTier}
      />
      <PackageIncludes included={pkg.included} notIncluded={pkg.notIncluded} />
      <PackageGallery gallery={pkg.gallery} onOpen={setLightbox} />
      {/* Sticky mobile reserve bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy px-5 py-3 flex items-center justify-between gap-4 transition-transform duration-300 ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!stickyVisible}
      >
        <div className="flex flex-col min-w-0">
          <span className="text-cream font-display text-[15px] tracking-tight truncate">{pkg.name}</span>
          <span className="text-ochre font-mono text-[10px] tracking-[0.18em] uppercase">{tier} tier</span>
        </div>
        <button
          type="button"
          onClick={scrollToReserveInputs}
          style={{ backgroundColor: "#c99a3f", color: "#8B9A5B" }}
          className="shrink-0 bg-ochre text-navy px-5 py-3 font-mono text-[12px] tracking-[0.14em] uppercase font-medium transition-colors duration-200 hover:bg-gold"
        >
          Reserve →
        </button>
      </div>

      {lightbox !== null && (
        <PackageLightbox
          gallery={pkg.gallery}
          index={lightbox}
          onClose={closeLightbox}
          onPrev={() => setLightbox((i) => ((i ?? 0) - 1 + pkg.gallery.length) % pkg.gallery.length)}
          onNext={() => setLightbox((i) => ((i ?? 0) + 1) % pkg.gallery.length)}
        />
      )}
    </main>
  );
}
