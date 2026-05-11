"use server";

import Groq from "groq-sdk";
import { LOCALES, LOCALE_NAMES } from "@/i18n/locales";

export type ContentLocale = Exclude<(typeof LOCALES)[number], "en">;
export type TranslationMap = Record<ContentLocale, string>;

const CONTENT_LOCALES = LOCALES.filter((l) => l !== "en") as ContentLocale[];

export async function translateContentBatch(
  fields: Record<string, string>,
  context: string
): Promise<{ result?: Record<string, Record<ContentLocale, string>>; error?: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { error: "GROQ_API_KEY is not set in .env.local" };

  const groq = new Groq({ apiKey });

  // Translate all locales in parallel — one request per locale, all fields per request
  try {
    const fieldsJson = JSON.stringify(fields, null, 2);

    const localeResults = await Promise.all(
      CONTENT_LOCALES.map(async (locale) => {
        const localeName = LOCALE_NAMES[locale];
        const prompt = `You are a professional translator for a boutique Turkish tourism company.
Translate ALL the following fields from English into ${localeName}.

Context: ${context}

Rules:
- Keep the tone professional, warm, and travel-focused
- Preserve any formatting (line breaks, dashes, bullet chars)
- Return ONLY a valid JSON object with the same keys as the input, each value being the ${localeName} translation
- You MUST include every key — do not skip any

English fields:
${fieldsJson}`;

        const chat = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" },
          max_tokens: 4096,
        });

        const content = chat.choices[0]?.message?.content ?? "{}";
        return { locale, result: JSON.parse(content) as Record<string, string> };
      })
    );

    const merged: Record<string, Record<ContentLocale, string>> = {};
    for (const { locale, result } of localeResults) {
      for (const [key, value] of Object.entries(result)) {
        if (!merged[key]) merged[key] = {} as Record<ContentLocale, string>;
        merged[key][locale as ContentLocale] = value;
      }
    }

    return { result: merged };
  } catch (e) {
    return { error: String(e) };
  }
}
