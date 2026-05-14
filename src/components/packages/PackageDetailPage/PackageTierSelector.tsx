"use client";
import { Fragment } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { TIER_ROMAN } from "./constants";
import type { Tier } from "@/lib/packages/types";

export function PackageTierSelector({
  tiers,
  activeTierName,
  onSelect,
}: {
  tiers: Tier[];
  activeTierName: string;
  onSelect: (name: string) => void;
}) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="mb-14">
        <Reveal><Kicker>Choose your tier</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
            Three ways to travel this route.
          </GoldUnderlineHeading>
        </Reveal>
      </div>
      <Reveal delay={60}>
        <div className="mb-10 flex flex-col sm:flex-row gap-4 sm:gap-10 text-[13px] text-ink-soft leading-relaxed border-l-2 border-ochre pl-5">
          <p>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre block mb-1">Essential &amp; Signature</span>
            Small-group departures (up to 8 guests) on fixed dates. You travel alongside other like-minded guests — ideal for solo travellers or couples who enjoy a social dynamic.
          </p>
          <p>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre block mb-1">Private</span>
            Exclusively yours. Dates, pace, and add-ons set around your group. No shared vehicles, no shared guides — just your party and our team.
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {tiers.map((t, i) => {
          const active = t.name === activeTierName;
          return (
            <Reveal key={t.name} delay={i * 80}>
              <button
                className={`w-full text-left flex flex-col p-8 border transition-all duration-300 cursor-pointer ${
                  active
                    ? "border-ochre bg-[#faf7f0] shadow-[0_4px_40px_-20px_rgba(201,169,97,0.4)]"
                    : "border-rule hover:border-ochre/50 bg-cream"
                }`}
                onClick={() => onSelect(t.name)}
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
                {t.hotel && (
                  <div className="mb-5 flex items-start gap-3 border border-rule bg-cream-deep p-3">
                    {t.hotel.bedroomImage && (
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-rule">
                        <Image
                          src={t.hotel.bedroomImage}
                          alt={t.hotel.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">Hotel</p>
                      <p className="font-display text-[16px] leading-tight text-ink truncate">{t.hotel.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {t.hotel.stars > 0 && (
                          <span className="flex items-center gap-0.5 text-ochre" aria-label={`${t.hotel.stars} star hotel`}>
                            {Array.from({ length: Math.min(5, Math.max(0, t.hotel.stars)) }).map((_, k) => (
                              <Star key={k} size={11} fill="currentColor" strokeWidth={1.5} aria-hidden />
                            ))}
                          </span>
                        )}
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">{t.hotel.region}</span>
                      </div>
                    </div>
                  </div>
                )}
                <dl className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2 mb-6 text-[13px]">
                  {[
                    ["Vehicle", t.vehicleClass],
                    ["Stay", t.hotel ? t.hotel.name : t.accommodation],
                    ["Group", t.groupSize],
                    ["Guide", t.guideLanguages.join(", ")],
                    ["Meals", t.mealsIncluded],
                  ].map(([dt, dd]) => (
                    <Fragment key={`${t.name}-${dt}`}>
                      <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted pt-0.5">{dt}</dt>
                      <dd className="text-ink m-0">{dd}</dd>
                    </Fragment>
                  ))}
                </dl>
                <ul className="list-none p-0 border-t border-rule pt-4 space-y-1.5">
                  {t.highlights.map((h, j) => (
                    <li key={j} className="text-[13px] text-ink-soft pl-4 relative">
                      <span className="absolute left-0 top-2.25 w-2 h-px bg-ochre" />
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
  );
}
