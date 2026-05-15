"use client";
import { Fragment } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("packageDetail");
  const tCommon = useTranslations("common");
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="mb-14">
        <Reveal><Kicker>{t("chooseYourTier")}</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
            {t("threeWaysToTravel")}
          </GoldUnderlineHeading>
        </Reveal>
      </div>
      <Reveal delay={60}>
        <div className="mb-10 flex flex-col sm:flex-row gap-4 sm:gap-10 text-[13px] text-ink-soft leading-relaxed border-l-2 border-ochre pl-5">
          <p>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre block mb-1">{t("essentialSignature")}</span>
            {t("essentialSignatureDesc")}
          </p>
          <p>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre block mb-1">{t("private")}</span>
            {t("privateDesc")}
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {tiers.map((tier, i) => {
          const active = tier.name === activeTierName;
          return (
            <Reveal key={tier.name} delay={i * 80}>
              <button
                className={`w-full text-left flex flex-col p-8 border transition-all duration-300 cursor-pointer ${
                  active
                    ? "border-ochre bg-[#faf7f0] shadow-[0_4px_40px_-20px_rgba(201,169,97,0.4)]"
                    : "border-rule hover:border-ochre/50 bg-cream"
                }`}
                onClick={() => onSelect(tier.name)}
                aria-pressed={active}
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <span className="font-display italic text-ochre text-[22px] w-8">{TIER_ROMAN[i]}</span>
                  <h3 className="font-display font-normal text-[28px] tracking-tight flex-1">{tier.name}</h3>
                  {active && (
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase bg-ochre text-navy px-2.5 py-1">
                      {tCommon("selected")}
                    </span>
                  )}
                </div>
                <Hairline className="mb-6 opacity-50" />
                {tier.hotel && (
                  <div className="mb-5 flex items-start gap-3 border border-rule bg-cream-deep p-3">
                    {tier.hotel.bedroomImage && (
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-rule">
                        <Image
                          src={tier.hotel.bedroomImage}
                          alt={tier.hotel.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-0.5">{t("hotel")}</p>
                      <p className="font-display text-[16px] leading-tight text-ink truncate">{tier.hotel.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {tier.hotel.stars > 0 && (
                          <span className="flex items-center gap-0.5 text-ochre" aria-label={`${tier.hotel.stars} star hotel`}>
                            {Array.from({ length: Math.min(5, Math.max(0, tier.hotel.stars)) }).map((_, k) => (
                              <Star key={k} size={11} fill="currentColor" strokeWidth={1.5} aria-hidden />
                            ))}
                          </span>
                        )}
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">{tier.hotel.region}</span>
                      </div>
                    </div>
                  </div>
                )}
                <dl className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2 mb-6 text-[13px]">
                  {[
                    [t("vehicle"), tier.vehicleClass],
                    [t("stay"), tier.hotel ? tier.hotel.name : tier.accommodation],
                    [t("group"), tier.groupSize],
                    [t("guide"), tier.guideLanguages.join(", ")],
                    [t("meals"), tier.mealsIncluded],
                  ].map(([dt, dd]) => (
                    <Fragment key={`${tier.name}-${dt}`}>
                      <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted pt-0.5">{dt}</dt>
                      <dd className="text-ink m-0">{dd}</dd>
                    </Fragment>
                  ))}
                </dl>
                <ul className="list-none p-0 border-t border-rule pt-4 space-y-1.5">
                  {tier.highlights.map((h, j) => (
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
