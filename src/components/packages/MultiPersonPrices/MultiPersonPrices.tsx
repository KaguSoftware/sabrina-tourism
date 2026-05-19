"use client";
import { useLocale, useTranslations } from "next-intl";
import { BedSingle, Baby } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { useCurrency } from "@/lib/currency/context";
import { formatPrice as formatCurrency } from "@/lib/currency/format";

interface Pricing {
  twoPeople: number | null;
  singleRoomSupplement?: number | null;
  pricePerChild?: number | null;
}

interface MultiPersonPricesProps {
  pricing: Pricing;
  currency?: string;
}

const DoubleRoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <circle cx="17" cy="7" r="3" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
);

export function MultiPersonPrices({ pricing }: MultiPersonPricesProps) {
  const t = useTranslations("pricingBlock");
  const locale = useLocale();
  const { currency, rates } = useCurrency();
  const formatPrice = (amount: number) => formatCurrency(amount, currency, rates, locale);

  const slots = [
    {
      key: "doubleRoom",
      label: t("doubleRoom"),
      price: pricing.twoPeople,
      prefix: "",
      icon: <DoubleRoomIcon />,
    },
    {
      key: "singleRoom",
      label: t("singleRoom"),
      price: pricing.singleRoomSupplement ?? null,
      prefix: "+ ",
      icon: <BedSingle className="w-full h-full" strokeWidth={1.75} />,
    },
    {
      key: "child",
      label: t("child"),
      price: pricing.pricePerChild ?? null,
      prefix: "",
      icon: <Baby className="w-full h-full" strokeWidth={1.75} />,
    },
  ].filter((s) => s.price !== null);

  if (slots.length === 0) return null;

  return (
    <Reveal>
      <div className="border border-rule bg-cream-warm p-8 md:p-10">
        <div className="mb-6">
          <Kicker>{t("kicker")}</Kicker>
          <p className="font-display text-[22px] font-semibold tracking-tight text-ink mt-2">
            {t("heading")}
          </p>
        </div>
        <div className={`grid gap-px bg-rule ${slots.length === 3 ? "grid-cols-1 sm:grid-cols-3" : slots.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          {slots.map((slot) => (
            <div key={slot.key} className="bg-cream flex flex-col items-center py-8 px-4 gap-4">
              <div className="w-10 h-10 text-ochre">{slot.icon}</div>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted text-center leading-snug">
                {slot.label}
              </p>
              <p className="font-display text-[26px] font-semibold tracking-tight text-ink leading-none">
                {slot.prefix}{formatPrice(slot.price!)}
              </p>
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted text-center mt-5">
          {t("babiesFree")}
        </p>
      </div>
    </Reveal>
  );
}
