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

  const localeList = CONTENT_LOCALES
    .map((l) => `"${l}" (${LOCALE_NAMES[l]})`)
    .join(", ");

  const langList = CONTENT_LOCALES
    .map((l) => LOCALE_NAMES[l])
    .join(", ");

  const prompt = `You are a professional translator for a boutique Turkish tourism company. Translate ALL the following fields from English into: ${langList}.

Context: ${context}

Rules:
- Keep the tone professional, warm, and travel-focused
- Preserve any formatting (line breaks, dashes, bullet chars)
- Return ONLY a valid JSON object where each key from the input maps to an object with keys ${localeList}

English fields:
${JSON.stringify(fields, null, 2)}`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chat.choices[0]?.message?.content ?? "{}";
    const result = JSON.parse(content) as Record<string, Record<ContentLocale, string>>;
    return { result };
  } catch (e) {
    return { error: String(e) };
  }
}
