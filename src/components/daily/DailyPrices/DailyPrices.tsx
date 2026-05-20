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

  const freeLabel = t.has("free") ? t("free") : "Free";
  const babyLabel = t.has("baby") ? t("baby") : "Baby (under 2)";

  const slots = [
    { key: "adult", label: "Adult", value: format(adultPrice), highlight: false, icon: <User className="w-full h-full" strokeWidth={1.75} /> },
    { key: "child", label: "Child", value: format(childPrice), highlight: false, icon: <Baby className="w-full h-full" strokeWidth={1.75} /> },
    { key: "baby", label: babyLabel, value: freeLabel, highlight: true, icon: <Baby className="w-full h-full" strokeWidth={1.75} /> },
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
        <div className="grid gap-px bg-rule grid-cols-1 sm:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.key} className="bg-cream flex flex-col items-center py-5 px-3 gap-2.5">
              <div className="w-8 h-8 text-ochre">{slot.icon}</div>
              <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted text-center leading-snug">
                {slot.label}
              </p>
              <p className={`font-display text-[20px] font-semibold tracking-tight leading-none ${slot.highlight ? "text-ochre" : "text-ink"}`}>
                {slot.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
