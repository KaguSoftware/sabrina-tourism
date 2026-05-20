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

  type PaidSlot = {
    key: string;
    label: string;
    icon: React.ReactNode;
    price: number;
    prefix: string;
    isFree: false;
  };
  type FreeSlot = {
    key: string;
    label: string;
    icon: React.ReactNode;
    isFree: true;
  };
  type Slot = PaidSlot | FreeSlot;

  const priceSlots: PaidSlot[] = (
    [
      { key: "doubleRoom", label: t("doubleRoom"), price: pricing.twoPeople, prefix: "", icon: <DoubleRoomIcon /> },
      { key: "singleRoom", label: t("singleRoom"), price: pricing.singleRoomSupplement ?? null, prefix: "+ ", icon: <BedSingle className="w-full h-full" strokeWidth={1.75} /> },
      { key: "child", label: t("child"), price: pricing.pricePerChild ?? null, prefix: "", icon: <Baby className="w-full h-full" strokeWidth={1.75} /> },
    ] as Array<{ key: string; label: string; price: number | null; prefix: string; icon: React.ReactNode }>
  )
    .filter((s): s is { key: string; label: string; price: number; prefix: string; icon: React.ReactNode } => s.price !== null)
    .map((s) => ({ ...s, isFree: false as const }));

  // Baby column is ALWAYS shown — babies under 2 travel free.
  const babySlot: FreeSlot = {
    key: "baby",
    label: t.has("baby") ? t("baby") : "Baby (under 2)",
    icon: <Baby className="w-full h-full" strokeWidth={1.75} />,
    isFree: true,
  };

  const allSlots: Slot[] = [...priceSlots, babySlot];

  return (
    <Reveal>
      <div className="border border-rule bg-cream-warm p-6 md:p-7">
        <div className="mb-4">
          <Kicker>{t("kicker")}</Kicker>
          <p className="font-display text-[18px] font-semibold tracking-tight text-ink mt-1.5">
            {t("heading")}
          </p>
        </div>
        <div className={`grid gap-px bg-rule ${
          allSlots.length === 4 ? "grid-cols-2 sm:grid-cols-4"
          : allSlots.length === 3 ? "grid-cols-1 sm:grid-cols-3"
          : allSlots.length === 2 ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1"
        }`}>
          {allSlots.map((slot) => (
            <div key={slot.key} className="bg-cream flex flex-col items-center py-5 px-3 gap-2.5">
              <div className="w-8 h-8 text-ochre">{slot.icon}</div>
              <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted text-center leading-snug">
                {slot.label}
              </p>
              {slot.isFree ? (
                <p className="font-display text-[20px] font-semibold tracking-tight text-ochre leading-none">
                  {t.has("free") ? t("free") : "Free"}
                </p>
              ) : (
                <p className="font-display text-[20px] font-semibold tracking-tight text-ink leading-none">
                  {slot.prefix}{formatPrice(slot.price)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
