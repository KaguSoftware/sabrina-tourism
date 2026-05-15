import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
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

const MESSAGES = { en, ar, tr, es, it, fr, de, ru, zh, ja } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: MESSAGES[locale as keyof typeof MESSAGES],
  };
});
