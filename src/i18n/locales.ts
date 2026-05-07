export const LOCALES = ["en", "tr", "ar", "es", "it", "fr", "de", "ru", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN", tr: "TR", ar: "AR", es: "ES", it: "IT",
  fr: "FR", de: "DE", ru: "RU", zh: "ZH", ja: "JA",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English", tr: "Turkish",  ar: "Arabic",   es: "Spanish", it: "Italian",
  fr: "French",  de: "German",   ru: "Russian",  zh: "Chinese", ja: "Japanese",
};

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}
