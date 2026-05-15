import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";
import tr from "../../messages/tr.json";

const MESSAGES = { en, ar, tr } as const;

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
