import { CURRENCIES, ZERO_DECIMAL_CURRENCIES, type Currency } from "@/i18n/currencies";

export type Rates = Partial<Record<Currency, number>>;

export function convert(amountEur: number, currency: Currency, rates: Rates): number {
  if (currency === "EUR") return amountEur;
  const rate = rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    return amountEur;
  }
  return amountEur * rate;
}

export function getDisplayCurrency(currency: Currency, rates: Rates): Currency {
  if (currency === "EUR") return "EUR";
  const rate = rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return "EUR";
  return currency;
}

export function formatPrice(
  amountEur: number,
  currency: Currency,
  rates: Rates,
  locale: string = "en-US",
): string {
  const display = getDisplayCurrency(currency, rates);
  const value = convert(amountEur, display, rates);
  const fractionDigits = ZERO_DECIMAL_CURRENCIES.includes(display) ? 0 : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: display,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Parse a freeform price string like "€ 120", "€120 / day", "120 EUR" into a number of EUR.
 * Returns null if no parseable amount is found.
 */
export function parseEurAmount(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.,]/g, " ").trim();
  if (!cleaned) return null;
  const match = cleaned.match(/[0-9]+(?:[.,][0-9]+)?/);
  if (!match) return null;
  const n = Number(match[0].replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function isSupportedCurrency(c: string): c is Currency {
  return (CURRENCIES as readonly string[]).includes(c);
}
