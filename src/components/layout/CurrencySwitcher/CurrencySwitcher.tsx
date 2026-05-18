"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleDollarSign } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/lib/currency/context";
import {
  CURRENCIES,
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  type Currency,
} from "@/i18n/currencies";

function formatTimeAgo(iso: string | null, locale: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "minute");
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(-days, "day");
}

export function CurrencySwitcher({ transparent }: { transparent?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("currencySwitcher");
  const { currency, setCurrency, isLive, fetchedAt } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pick(next: Currency) {
    setOpen(false);
    if (next === currency) return;
    setCurrency(next, { manual: true });
  }

  const footer = isLive
    ? t("liveRates", { time: formatTimeAgo(fetchedAt, locale) })
    : t("ratesUnavailable");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className={`inline-flex items-center gap-2 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
          transparent ? "text-cream/80 hover:text-cream" : "text-ink/65 hover:text-ink"
        }`}
      >
        <CircleDollarSign size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>{currency}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 mt-3 min-w-56 border border-rule bg-cream shadow-[0_10px_34px_-10px_rgba(11,26,46,0.25)] transition-all duration-200 origin-top-right z-70 ${
          open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="absolute -top-3 left-0 right-0 h-3" />
        {CURRENCIES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => pick(code)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-150 border-b border-rule last:border-0 ${
              code === currency
                ? "bg-cream-warm text-ochre font-semibold"
                : "text-ink hover:bg-cream-warm hover:text-ochre"
            }`}
            aria-label={t("switchTo", { currency: code })}
            aria-current={code === currency ? "true" : undefined}
            role="menuitem"
          >
            <span className="text-[13px] leading-none w-4 text-center" aria-hidden="true">
              {CURRENCY_SYMBOLS[code]}
            </span>
            <span className="w-9">{code}</span>
            <span className="text-[10px] tracking-[0.1em] normal-case text-muted">
              {CURRENCY_NAMES[code]}
            </span>
          </button>
        ))}
        <p className="px-4 py-2.5 font-mono text-[9.5px] tracking-[0.12em] uppercase italic text-muted bg-cream-warm/60 border-t border-rule">
          {footer}
        </p>
      </div>
    </div>
  );
}
