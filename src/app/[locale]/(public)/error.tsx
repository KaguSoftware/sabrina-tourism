"use client";
import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { genericMessage } from "@/lib/whatsapp/whatsapp";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[72vh] flex items-center px-[clamp(20px,4vw,56px)] py-32">
      <div className="max-w-[640px] mx-auto text-center">
        <Kicker>{t("errorKicker")}</Kicker>
        <h1 className="font-display font-light text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-ink mt-4 mb-5">
          {t("errorHeading")}
        </h1>
        <p className="font-sans text-[16px] text-ink-soft leading-[1.6] mb-10">
          {t("errorBody")}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <GoldButton onClick={reset} variant="solid">
            {t("tryAgain")}
          </GoldButton>
          <GoldButton
            href={genericMessage(locale)}
            variant="ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
