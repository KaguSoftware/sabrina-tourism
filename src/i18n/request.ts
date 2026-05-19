import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getUIMessages } from "@/lib/db/ui-translations";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";
import tr from "../../messages/tr.json";
import es from "../../messages/es.json";
import it from "../../messages/it.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";
import ru from "../../messages/ru.json";
import zh from "../../messages/zh.json";
import ja from "../../messages/ja.json";

const STATIC = { en, ar, tr, es, it, fr, de, ru, zh, ja } as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function deepMergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown> | null
): Record<string, unknown> {
  if (!override) return base;

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    merged[key] = isPlainObject(baseValue) && isPlainObject(value)
      ? deepMergeMessages(baseValue, value)
      : value;
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  const dbMessages = await getUIMessages(locale);
  const staticMessages = STATIC[locale as keyof typeof STATIC] as Record<string, unknown>;
  const messages = deepMergeMessages(staticMessages, dbMessages);
  return { locale, messages };
});
