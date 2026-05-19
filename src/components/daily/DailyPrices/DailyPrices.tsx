"use client";
import { useLocale } from "next-intl";
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
  const { currency, rates } = useCurrency();
  const format = (n: number) => formatCurrency(n, currency, rates, locale);

  const slots = [
    { key: "adult", label: "Adult", price: adultPrice, icon: <User className="w-full h-full" strokeWidth={1.75} /> },
    { key: "child", label: "Child", price: childPrice, icon: <Baby className="w-full h-full" strokeWidth={1.75} /> },
  ];

  return (
    <Reveal>
      <div className="border border-rule bg-cream-warm p-8 md:p-10">
        <div className="mb-6">
          <Kicker>Ticket rates</Kicker>
          <p className="font-display text-[22px] font-semibold tracking-tight text-ink mt-2">
            Price per person
          </p>
        </div>
        <div className="grid gap-px bg-rule grid-cols-2">
          {slots.map((slot) => (
            <div key={slot.key} className="bg-cream flex flex-col items-center py-8 px-4 gap-4">
              <div className="w-10 h-10 text-ochre">{slot.icon}</div>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted text-center leading-snug">
                {slot.label}
              </p>
              <p className="font-display text-[26px] font-semibold tracking-tight text-ink leading-none">
                {format(slot.price)}
              </p>
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted text-center mt-5">
          Babies under 2 travel free.
        </p>
      </div>
    </Reveal>
  );
}
