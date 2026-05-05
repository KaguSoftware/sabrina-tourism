"use client";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import type { PremadePackage } from "@/lib/premade-packages/data";
import { formatDate } from "@/lib/premade-packages/data";
import { WA_BASE, WA_PHONE } from "@/lib/whatsapp/constants";

function waLink(message: string): string {
  const num = WA_PHONE.replace(/[^\d+]/g, "");
  return `${WA_BASE}${encodeURIComponent(num)}?text=${encodeURIComponent(message)}`;
}

function inquireLink(pkg: PremadePackage): string {
  return waLink(
    `Hey Sabrina — I'd like to inquire about the "${pkg.name}" package (${formatDate(pkg.startDate)} → ${formatDate(pkg.endDate)}). Could you share availability and pricing?`
  );
}

interface Props {
  pkg: PremadePackage;
}

export function PremadePackageDetailPage({ pkg }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[75vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src={pkg.heroImage}
            alt={pkg.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Fixed Departure</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(36px,5.5vw,72px)] mt-6 mb-6 tracking-[-0.025em] max-w-[18ch] text-cream"
            >
              {pkg.name}
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            {/* Date pill */}
            <div
              className="inline-flex items-center gap-3 px-5 py-3 mb-6"
              style={{ backgroundColor: "rgba(11,26,46,0.72)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c99a3f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-cream">
                {formatDate(pkg.startDate)}
              </span>
              <span className="text-ochre">→</span>
              <span className="font-mono text-[12px] tracking-[0.18em] uppercase text-cream">
                {formatDate(pkg.endDate)}
              </span>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              {pkg.shortDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
          {/* Left column */}
          <div className="space-y-16">
            {/* Destinations */}
            <Reveal>
              <section>
                <Kicker>Destinations</Kicker>
                <div className="flex flex-wrap gap-3 mt-6">
                  {pkg.destinations.map((dest) => (
                    <span
                      key={dest}
                      className="font-mono text-[12px] tracking-[0.18em] uppercase px-4 py-2 border border-rule text-ink-soft"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Accommodation */}
            <Reveal>
              <section>
                <Kicker>Accommodation</Kicker>
                <h2 className="font-display font-normal text-[clamp(24px,3vw,36px)] tracking-[-0.012em] leading-tight mt-4 mb-4">
                  {pkg.accommodation.name}
                </h2>
                <p className="text-[16px] text-ink-soft leading-[1.7] mb-6 max-w-[60ch]">
                  {pkg.accommodation.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {pkg.accommodation.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden border border-rule"
                    >
                      <Image
                        src={src}
                        alt={`${pkg.accommodation.name} — photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Transportation */}
            <Reveal>
              <section>
                <Kicker>Chauffeur Service</Kicker>
                <h2 className="font-display font-normal text-[clamp(24px,3vw,36px)] tracking-[-0.012em] leading-tight mt-4 mb-4">
                  {pkg.vehicle.model}
                </h2>
                <ul className="space-y-3">
                  {pkg.vehicle.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-[15px] text-ink-soft">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#c99a3f" }}
                        aria-hidden="true"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {/* Destination gallery */}
            <Reveal>
              <section>
                <Kicker>Places You'll Visit</Kicker>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {pkg.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden border border-rule group"
                    >
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
                  ))}
                </div>
              </section>
            </Reveal>
          </div>

          {/* Right column — sticky booking card */}
          <div>
            <Reveal>
              <div className="sticky top-28 border border-rule bg-[#fcf5ec] p-8 shadow-[4px_6px_0_-1px_#1b4d5c]">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ochre mb-4">
                  Package Summary
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-start gap-4 border-b border-rule pb-4">
                    <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Start</span>
                    <span className="font-sans text-[14px] text-ink text-right">
                      {formatDate(pkg.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4 border-b border-rule pb-4">
                    <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">End</span>
                    <span className="font-sans text-[14px] text-ink text-right">
                      {formatDate(pkg.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4 border-b border-rule pb-4">
                    <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Hotel</span>
                    <span className="font-sans text-[14px] text-ink text-right max-w-[160px]">
                      {pkg.accommodation.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4 border-b border-rule pb-4">
                    <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Vehicle</span>
                    <span className="font-sans text-[14px] text-ink text-right max-w-[160px]">
                      {pkg.vehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Route</span>
                    <span className="font-sans text-[14px] text-ink text-right max-w-[160px]">
                      {pkg.destinations.join(" → ")}
                    </span>
                  </div>
                </div>

                <GoldButton
                  href={inquireLink(pkg)}
                  variant="solid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center"
                >
                  Inquire Now
                </GoldButton>

                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted text-center mt-4">
                  We&apos;ll reply within 24 hours
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Back link */}
        <Reveal>
          <div className="mt-16 pt-10 border-t border-rule">
            <Link
              href="/tours/premade"
              className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.16em] uppercase text-ink-soft hover:text-ochre transition-colors duration-200"
            >
              <span>←</span> All premade packages
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
