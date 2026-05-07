"use server";

import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import Groq from "groq-sdk";

import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/locales";

function messagesPath(locale: string) {
  return path.join(process.cwd(), "messages", `${locale}.json`);
}

export async function loadAllMessages(): Promise<Record<Locale, Record<string, unknown>>> {
  const result = {} as Record<Locale, Record<string, unknown>>;
  for (const locale of LOCALES) {
    try {
      const raw = await fs.readFile(messagesPath(locale), "utf-8");
      result[locale] = JSON.parse(raw);
    } catch {
      result[locale] = {};
    }
  }
  return result;
}

export async function saveMessages(
  locale: Locale,
  messages: Record<string, unknown>
): Promise<{ error?: string }> {
  if (!LOCALES.includes(locale)) return { error: "Invalid locale" };
  try {
    await fs.writeFile(messagesPath(locale), JSON.stringify(messages, null, 2) + "\n", "utf-8");
    revalidatePath("/admin/translations");
    return {};
  } catch (e) {
    return { error: String(e) };
  }
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
