import type { Locale } from "./locales";

export const CURRENCIES = ["EUR", "GBP", "USD", "TRY", "SAR", "RUB", "CNY", "JPY"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  TRY: "₺",
  SAR: "﷼",
  RUB: "₽",
  CNY: "¥",
  JPY: "¥",
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  EUR: "Euro",
  GBP: "British Pound",
  USD: "US Dollar",
  TRY: "Turkish Lira",
  SAR: "Saudi Riyal",
  RUB: "Russian Ruble",
  CNY: "Chinese Yuan",
  JPY: "Japanese Yen",
};

export const LOCALE_TO_CURRENCY: Record<Locale, Currency> = {
  en: "GBP",
  tr: "TRY",
  ar: "SAR",
  es: "EUR",
  it: "EUR",
  fr: "EUR",
  de: "EUR",
  ru: "RUB",
  zh: "CNY",
  ja: "JPY",
};

export const ZERO_DECIMAL_CURRENCIES: Currency[] = ["JPY", "TRY", "RUB"];

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}
