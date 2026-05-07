import { cookies } from "next/headers";
import type { AbstractIntlMessages } from "next-intl";
import { ADMIN_LOCALE_COOKIE, isAdminLocale, type AdminLocale } from "./i18n-shared";

export async function getAdminLocale(): Promise<AdminLocale> {
  const store = await cookies();
  const locale = store.get(ADMIN_LOCALE_COOKIE)?.value;
  return isAdminLocale(locale) ? locale : "en";
}

export async function getAdminMessages(locale: AdminLocale): Promise<AbstractIntlMessages> {
  return (await import(`../../../messages/${locale}.json`)).default;
}

export async function getAdminT() {
  const locale = await getAdminLocale();
  const messages = await getAdminMessages(locale);
  const admin = messages.admin as Record<string, unknown>;

  function read(path: string): string {
    const value = path.split(".").reduce<unknown>((acc, key) => {
      if (!acc || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[key];
    }, admin);

    return typeof value === "string" ? value : path;
  }

  return {
    locale,
    t(path: string, values?: Record<string, string | number>) {
      let text = read(path);
      if (values) {
        for (const [key, value] of Object.entries(values)) {
          text = text.replaceAll(`{${key}}`, String(value));
        }
      }
      return text;
    },
  };
}
