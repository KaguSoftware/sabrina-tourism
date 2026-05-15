"use server";

import { revalidateTag } from "next/cache";
import fs from "fs/promises";
import path from "path";
import Groq from "groq-sdk";

import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/locales";
import { loadAllUIMessages, saveUIMessages, saveAllUIMessages } from "@/lib/db/ui-translations";

// Keep this for seeding only
function messagesPath(locale: string) {
  return path.join(process.cwd(), "messages", `${locale}.json`);
}

export async function loadAllMessages(): Promise<Record<Locale, Record<string, unknown>>> {
  // Try DB first
  const dbData = await loadAllUIMessages();

  // Fall back to JSON files for any locale missing from DB
  const result = {} as Record<Locale, Record<string, unknown>>;
  for (const locale of LOCALES) {
    if (dbData[locale] && Object.keys(dbData[locale]).length > 0) {
      result[locale] = dbData[locale];
    } else {
      try {
        const raw = await fs.readFile(messagesPath(locale), "utf-8");
        result[locale] = JSON.parse(raw);
      } catch {
        result[locale] = {};
      }
    }
  }
  return result;
}

export async function saveMessages(
  locale: Locale,
  messages: Record<string, unknown>
): Promise<{ error?: string }> {
  if (!LOCALES.includes(locale)) return { error: "Invalid locale" };
  const { error } = await saveUIMessages(locale, messages);
  if (error) return { error };
  revalidateTag("ui-translations", "max");
  return {};
}

export async function saveAllMessages(
  allMessages: Record<Locale, Record<string, unknown>>
): Promise<{ error?: string }> {
  const { error } = await saveAllUIMessages(allMessages);
  if (error) return { error };
  revalidateTag("ui-translations", "max");
  return {};
}

// Add a seed action — call once to populate DB from JSON files
export async function seedTranslationsFromFiles(): Promise<{ error?: string }> {
  const all: Record<string, Record<string, unknown>> = {};
  for (const locale of LOCALES) {
    try {
      const raw = await fs.readFile(messagesPath(locale), "utf-8");
      all[locale] = JSON.parse(raw);
    } catch {
      // skip
    }
  }
  const { error } = await saveAllUIMessages(all);
  if (error) return { error };
  revalidateTag("ui-translations", "max");
  return {};
}

export async function translateWithAI(
  namespace: string,
  values: Record<string, string>,
  targetLocale: Locale
): Promise<{ result?: Record<string, string>; error?: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { error: "GROQ_API_KEY is not set in .env.local" };

  const groq = new Groq({ apiKey });

  const prompt = `You are a professional translator. Translate the following JSON object values from English to ${LOCALE_NAMES[targetLocale]}.

Rules:
- Preserve all {placeholder} variables exactly as-is (e.g. {n}, {assigned}, {total})
- Preserve all ← → arrow characters exactly
- Keep the same tone: friendly, professional, boutique travel brand
- Return ONLY a valid JSON object with the same keys, no extra text

Namespace context: "${namespace}" (UI strings for a Turkish tourism website)

English source:
${JSON.stringify(values, null, 2)}`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chat.choices[0]?.message?.content ?? "{}";
    const result = JSON.parse(content) as Record<string, string>;
    return { result };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function translateAllLocalesWithAI(
  namespace: string,
  values: Record<string, string>
): Promise<{ results?: Record<Locale, Record<string, string>>; error?: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { error: "GROQ_API_KEY is not set in .env.local" };

  const groq = new Groq({ apiKey });
  const nonEnglish = LOCALES.filter((l) => l !== "en") as Locale[];

  const translations = await Promise.all(
    nonEnglish.map(async (locale) => {
      const prompt = `You are a professional translator. Translate the following JSON object values from English to ${LOCALE_NAMES[locale]}.

Rules:
- Preserve all {placeholder} variables exactly as-is (e.g. {n}, {assigned}, {total})
- Preserve all ← → arrow characters exactly
- Keep the same tone: friendly, professional, boutique travel brand
- Return ONLY a valid JSON object with the same keys, no extra text

Namespace context: "${namespace}" (UI strings for a Turkish tourism website)

English source:
${JSON.stringify(values, null, 2)}`;

      try {
        const chat = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" },
        });
        const content = chat.choices[0]?.message?.content ?? "{}";
        return { locale, result: JSON.parse(content) as Record<string, string> };
      } catch {
        return { locale, result: {} as Record<string, string> };
      }
    })
  );

  const results = Object.fromEntries(
    translations.map(({ locale, result }) => [locale, result])
  ) as Record<Locale, Record<string, string>>;

  return { results };
}
