"use client";
import { useTranslations } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { DailyPackageCard } from "@/components/daily/DailyPackageCard/DailyPackageCard";
import type { DailyPackagePublic } from "@/lib/db/daily-packages";

export const PRIVATE_DAY_TOURS_ID = "private-day-tours";

/** Admin-made one-day private tours, shown above the multi-day trip builder. */
export function PrivateDayTours({ packages }: { packages: DailyPackagePublic[] }) {
  const t = useTranslations("customTour.privateDayTours");
  if (packages.length === 0) return null;

  return (
    <section
      id={PRIVATE_DAY_TOURS_ID}
      className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-[clamp(60px,8vw,100px)] scroll-mt-24"
    >
      <Reveal>
        <Kicker>{t("kicker")}</Kicker>
        <GoldUnderlineHeading
          as="h2"
          className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink"
        >
          {t("heading")}
        </GoldUnderlineHeading>
        <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[56ch]">
          {t("sub")}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
        {packages.map((pkg, i) => (
          <Reveal key={pkg.id} delay={i * 70}>
            <DailyPackageCard pkg={pkg} />
          </Reveal>
        ))}
      </div>

      <div className="mt-[clamp(48px,6vw,72px)] flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-rule" />
        <a
          href="#custom-tour-wizard"
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted hover:text-ochre transition-colors duration-200 text-center"
        >
          {t("buildMultiDay")} ↓
        </a>
        <span aria-hidden className="h-px flex-1 bg-rule" />
      </div>
    </section>
  );
}
