"use client";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import type { DailyPackage } from "@/lib/daily/types";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function bookMessage(pkg: DailyPackage): string {
  const phone = process.env.NEXT_PUBLIC_WA_PHONE ?? "";
  const num = phone.replace(/[^\d+]/g, "");
  const text = encodeURIComponent(
    `Hey Sabrina — I'd like to book the "${pkg.name}" daily tour on ${formatDate(pkg.date)} (${pkg.startTime}–${pkg.endTime}). Could you confirm availability?`
  );
  return `https://wa.me/${num}?text=${text}`;
}

export function DailyDetailPage({ pkg }: { pkg: DailyPackage }) {
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

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
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
              {pkg.region.toUpperCase()} · DAY-TO-NIGHT
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
                {formatDate(pkg.date)}
                <span className="mx-3 opacity-40">·</span>
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

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-20 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
        {/* Left column */}
        <div>
          {/* Schedule timeline */}
          <Reveal>
            <Kicker className="mb-6">Full Day Schedule</Kicker>
          </Reveal>
          <ol className="relative border-l border-rule pl-8 space-y-10 mb-20">
            {pkg.stops.map((stop, i) => (
              <Reveal key={i} delay={i * 50}>
                <li className="relative">
                  {/* dot */}
                  <span className="absolute -left-[41px] top-1.5 w-3 h-3 rounded-full bg-ochre border-2 border-cream shadow" />
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ochre mb-1">
                    {stop.time}
                  </p>
                  <h3 className="font-display text-[20px] leading-tight mb-1">
                    {stop.place}
                  </h3>
                  <p className="text-[15px] text-ink-soft leading-[1.6]">
                    {stop.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* Gallery */}
          <Reveal>
            <Kicker className="mb-6">Destinations</Kicker>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
            {pkg.groupImages.map((src, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="relative aspect-[4/3] overflow-hidden border border-rule">
                  <Image
                    src={src}
                    alt={`${pkg.name} — destination ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.05]"
                    sizes="(max-width:640px) 50vw, 25vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          {/* Inclusions */}
          <Reveal>
            <Kicker className="mb-6">What's Included</Kicker>
          </Reveal>
          <ul className="space-y-3 mb-0">
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

        {/* Right column — sticky booking card */}
        <aside>
          <div className="sticky top-24">
            <Reveal>
              <div className="bg-[#fcf5ec] border border-rule shadow-[4px_6px_0_-1px_#1b4d5c] p-6">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-1">
                  Fixed Price
                </p>
                <p className="font-display text-[42px] leading-none tracking-[-0.02em] text-ochre mb-1">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </p>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-6">
                  per person
                </p>

                <div className="border-t border-rule pt-5 mb-5 space-y-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">
                      Date
                    </p>
                    <p className="text-[14px] text-ink font-medium">
                      {formatDate(pkg.date)}
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
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">
                      Vehicle
                    </p>
                    <p className="text-[14px] text-ink font-medium">
                      {pkg.vehicle}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">
                      Driver
                    </p>
                    <p className="text-[14px] text-ink font-medium">
                      {pkg.driver}
                    </p>
                  </div>
                </div>

                {/* Vehicle image */}
                <div className="relative aspect-[16/9] overflow-hidden border border-rule mb-5">
                  <Image
                    src="/chauffer.png"
                    alt={pkg.vehicle}
                    fill
                    className="object-cover"
                    sizes="340px"
                  />
                </div>

                <GoldButton
                  href={bookMessage(pkg)}
                  variant="solid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center"
                >
                  Book This Day
                </GoldButton>

                <p className="text-[12px] text-muted text-center mt-3 leading-[1.5]">
                  Secure your spot via WhatsApp — we respond within the hour.
                </p>
              </div>
            </Reveal>
          </div>
        </aside>
      </div>
    </>
  );
}
