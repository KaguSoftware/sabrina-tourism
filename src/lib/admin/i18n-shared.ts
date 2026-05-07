export const ADMIN_LOCALES = ["en", "ar", "tr"] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];
export const ADMIN_LOCALE_COOKIE = "admin_locale";

export const ADMIN_LOCALE_LABELS: Record<AdminLocale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

export function isAdminLocale(locale: string | undefined): locale is AdminLocale {
  return !!locale && ADMIN_LOCALES.includes(locale as AdminLocale);
}
