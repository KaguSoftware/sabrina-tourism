"use client";
import { useState, useEffect, useCallback } from "react";
import { packageMessage } from "@/lib/whatsapp/whatsapp";
import { PackageHero } from "./PackageHero";
import { PackageOverview } from "./PackageOverview";
import { PackageItinerary } from "./PackageItinerary";
import { PackageTierSelector } from "./PackageTierSelector";
import { PackageIncludes } from "./PackageIncludes";
import { PackageGallery } from "./PackageGallery";
import { PackageCTAStrip } from "./PackageCTAStrip";
import { PackageLightbox } from "./PackageLightbox";
import type { PackageDetailPageProps } from "./types";

export function PackageDetailPage({ pkg, seedDate = "", seedPeople = "" }: PackageDetailPageProps) {
  const [tier, setTier] = useState("Signature");
  const [openDay, setOpenDay] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

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
  const waHref = packageMessage({
    name: pkg.name,
    tier,
    date: seedDate || "to be confirmed",
    count: seedPeople || "to be confirmed",
  });

  return (
    <main className="bg-cream">
      <PackageHero pkg={pkg} />
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
      <PackageIncludes included={pkg.included} notIncluded={pkg.notIncluded} />
      <PackageGallery gallery={pkg.gallery} onOpen={setLightbox} />
      <PackageCTAStrip
        packageName={pkg.name}
        tierName={tier}
        waHref={waHref}
        seedDate={seedDate}
        seedPeople={seedPeople}
      />
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
