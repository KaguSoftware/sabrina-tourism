"use client";
import { useLocale, useTranslations } from "next-intl";
import { User, Baby } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { useCurrency } from "@/lib/currency/context";
import { formatPrice as formatCurrency } from "@/lib/currency/format";

interface DailyPricesProps {
  adultPrice: number;
  childPrice: number;
}

export function DailyPrices({ adultPrice, childPrice }: DailyPricesProps) {
  const locale = useLocale();
  const t = useTranslations("pricingBlock");
  const { currency, rates } = useCurrency();
  const format = (n: number) => formatCurrency(n, currency, rates, locale);

  const babiesFreeNote = t.has("babiesFree") ? t("babiesFree") : "Babies under 2 travel free.";
  const childAgesTag = t.has("childAges") ? t("childAges") : "Ages 2–6";

  const slots = [
    { key: "adult", label: "Adult", value: format(adultPrice), icon: <User className="w-full h-full" strokeWidth={1.75} /> },
    { key: "child", label: "Child", value: format(childPrice), icon: <Baby className="w-full h-full" strokeWidth={1.75} /> },
  ];

  return (
    <Reveal>
      <div className="border border-rule bg-cream-warm p-6 md:p-7">
        <div className="mb-4">
          <Kicker>Ticket rates</Kicker>
          <p className="font-display text-[18px] font-semibold tracking-tight text-ink mt-1.5">
            Price per person
          </p>
        </div>
        <div className="grid gap-px bg-rule grid-cols-1 sm:grid-cols-2">
          {slots.map((slot) => (
            <div key={slot.key} className="bg-cream flex flex-col items-center justify-center py-5 px-3 gap-2.5">
              {slot.key === "child" ? (
                <span className="inline-block font-mono text-[8.5px] tracking-[0.14em] uppercase text-ochre bg-ochre/10 border border-ochre/30 px-1.5 py-0.5 rounded-sm">
                  {childAgesTag}
                </span>
              ) : null}
              <div className="w-8 h-8 text-ochre">{slot.icon}</div>
              <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted text-center leading-snug">
                {slot.label}
              </p>
              <p className="font-display text-[20px] font-semibold tracking-tight leading-none text-ink">
                {slot.value}
              </p>
              {slot.key === "child" ? (
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-muted text-center leading-snug mt-1">
                  {babiesFreeNote}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
