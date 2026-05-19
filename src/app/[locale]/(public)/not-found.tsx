import { useTranslations, useLocale } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";

export default function NotFound() {
  const t = useTranslations("errors");
  const locale = useLocale();
  const localePfx = locale === "en" ? "" : `/${locale}`;

  return (
    <section className="min-h-[72vh] flex items-center px-[clamp(20px,4vw,56px)] py-32">
      <div className="max-w-[640px] mx-auto text-center">
        <Kicker>{t("notFoundKicker")}</Kicker>
        <h1 className="font-display font-light text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-ink mt-4 mb-5">
          {t("notFoundHeading")}
        </h1>
        <p className="font-sans text-[16px] text-ink-soft leading-[1.6] mb-10">
          {t("notFoundBody")}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <GoldButton href={`${localePfx}/`} variant="solid">
            {t("backHome")}
          </GoldButton>
          <GoldButton href={`${localePfx}/tours/fixed-dates`} variant="ghost">
            {t("browsePackages")}
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
