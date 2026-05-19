"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { DailyPackageCard } from "@/components/daily/DailyPackageCard/DailyPackageCard";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import type { DailyPackagePublic } from "@/lib/db/daily-packages";

interface DailyListPageProps {
  packages: DailyPackagePublic[];
}

export function DailyListPage({ packages }: DailyListPageProps) {
  const locale = useLocale();
  const t = useTranslations("packageList");
  const localePfx = locale === "en" ? "" : `/${locale}`;
  return (
    <>
      {/* Hero — matches PackageListPage exactly */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
        <div className="absolute inset-0">
          <Image
            src="/homepage.png"
            alt="Daily tours hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-5 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker light>Daily Packages</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading
              as="h1"
              className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
            >
              One Day, One Experience
            </GoldUnderlineHeading>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
              Ski resorts, theme parks, cultural landmarks — curated single-day adventures with every detail handled for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 max-w-330 mx-auto px-[clamp(20px,4vw,56px)] pt-14 pb-28">
        <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
          <span className="text-ochre font-display italic text-[18px] mr-1">
            {packages.length}
          </span>
          {packages.length === 1 ? "day available" : "days available"}
        </p>

        {packages.length === 0 ? (
          <div className="py-20 text-center max-w-[480px] mx-auto flex flex-col items-center gap-6">
            <Kicker>{t("noMatchesKicker")}</Kicker>
            <p className="font-display text-[clamp(22px,2.4vw,30px)] text-ink leading-[1.3]">
              No daily packages available at the moment.
            </p>
            <p className="font-sans text-[15px] text-ink-soft leading-[1.6]">
              Browse our multi-day itineraries or message us for a custom plan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <GoldButton href={`${localePfx}/tours/fixed-dates`} variant="solid">
                Browse packages
              </GoldButton>
              <GoldButton
                href={genericMessage(locale)}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contactWhatsapp")}
              </GoldButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 70}>
                <DailyPackageCard pkg={pkg} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
