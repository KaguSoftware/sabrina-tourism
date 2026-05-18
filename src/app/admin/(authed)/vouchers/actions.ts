"use server";

import Groq from "groq-sdk";
import { getAdminPremadePackages, getPremadePackageBySlug } from "@/lib/db/premade-packages";
import { getAdminDailyPackages, getDailyPackageBySlug } from "@/lib/db/daily-packages";
import { getAdminHotels, getHotelBySlug } from "@/lib/db/hotels";
import { getVehicles } from "@/lib/db/transport";
import { LOCALE_NAMES, type Locale } from "@/i18n/locales";

export interface PackageOption {
  id: string;
  slug: string;
  name: string;
  isPublished: boolean;
}

export interface PackageDefaultsTier {
  name: string;
  unitPrice: number | null;
}

export interface PackageDateOption {
  startDate: string;
  endDate: string;
}

export interface PackageDefaults {
  packageName: string;
  region: string;
  duration: string;
  currency: string;
  defaultUnitPrice: number | null;
  tiers: PackageDefaultsTier[];
  dates: PackageDateOption[];
}

export async function listPackagesForVoucher(): Promise<PackageOption[]> {
  const rows = await getAdminPremadePackages();
  return rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, isPublished: r.isPublished }));
}

export async function fetchPackageDefaults(
  slug: string,
): Promise<{ defaults?: PackageDefaults; error?: string }> {
  const pkg = await getPremadePackageBySlug(slug);
  if (!pkg) return { error: "Package not found" };

  const tiers: PackageDefaultsTier[] = (pkg.tiers ?? []).map((t) => ({
    name: t.name,
    unitPrice: pickTierUnitPrice(pkg.pricing),
  }));

  const defaultUnitPrice =
    tiers[0]?.unitPrice ??
    pkg.pricing?.twoPeople ??
    pkg.pricing?.onePerson ??
    pkg.price ??
    null;

  const dates: PackageDateOption[] = (pkg.dates ?? [])
    .map((d) => ({ startDate: d.startDate, endDate: d.endDate }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return {
    defaults: {
      packageName: pkg.name,
      region: pkg.region ?? "",
      duration: pkg.duration ?? "",
      currency: (pkg.currency || "EUR").toUpperCase(),
      defaultUnitPrice,
      tiers,
      dates,
    },
  };
}

function pickTierUnitPrice(pricing: { twoPeople: number | null; onePerson: number | null } | null): number | null {
  if (!pricing) return null;
  return pricing.twoPeople ?? pricing.onePerson ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily packages

export interface DailyPackageDefaults {
  packageName: string;
  region: string;
  currency: string;
  defaultUnitPrice: number | null;
  tourDate: string;
  tourStartTime: string;
  tourEndTime: string;
}

export async function listDailyPackagesForVoucher(): Promise<PackageOption[]> {
  const rows = await getAdminDailyPackages();
  return rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, isPublished: r.isPublished }));
}

export async function fetchDailyPackageDefaults(
  slug: string,
): Promise<{ defaults?: DailyPackageDefaults; error?: string }> {
  const pkg = await getDailyPackageBySlug(slug);
  if (!pkg) return { error: "Daily package not found" };
  return {
    defaults: {
      packageName: pkg.name,
      region: pkg.region ?? "",
      currency: (pkg.currency || "EUR").toUpperCase(),
      defaultUnitPrice: pkg.price ?? null,
      tourDate: pkg.date ?? "",
      tourStartTime: normalizeTime(pkg.startTime),
      tourEndTime: normalizeTime(pkg.endTime),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hotels

export interface HotelDefaults {
  packageName: string;
  region: string;
  checkInTime: string;
  checkOutTime: string;
}

export async function listHotelsForVoucher(): Promise<PackageOption[]> {
  const rows = await getAdminHotels();
  return rows.map((r) => ({ id: r.id, slug: r.slug, name: r.name, isPublished: r.isPublished }));
}

export async function fetchHotelDefaults(
  slug: string,
): Promise<{ defaults?: HotelDefaults; error?: string }> {
  const hotel = await getHotelBySlug(slug);
  if (!hotel) return { error: "Hotel not found" };
  return {
    defaults: {
      packageName: hotel.name,
      region: hotel.region ?? "",
      checkInTime: normalizeTime(hotel.checkInTime),
      checkOutTime: normalizeTime(hotel.checkOutTime),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Transport vehicles

export interface VehicleOption {
  id: string;
  label: string;
  capacity: string;
  fromPrice: string;
}

export interface VehicleDefaults {
  packageName: string;
  defaultUnitPrice: number | null;
}

export async function listVehiclesForVoucher(): Promise<VehicleOption[]> {
  const rows = await getVehicles();
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    capacity: r.capacity,
    fromPrice: r.from_price,
  }));
}

export async function fetchVehicleDefaults(
  id: string,
): Promise<{ defaults?: VehicleDefaults; error?: string }> {
  const rows = await getVehicles();
  const v = rows.find((r) => r.id === id);
  if (!v) return { error: "Vehicle not found" };
  return {
    defaults: {
      packageName: v.label,
      defaultUnitPrice: parsePrice(v.from_price),
    },
  };
}

function normalizeTime(value: string | null | undefined): string {
  if (!value) return "";
  // Accept "HH:MM" or "HH:MM:SS" or "H:MM" — return canonical "HH:MM"
  const m = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!m) return "";
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

function parsePrice(value: string | null | undefined): number | null {
  if (!value) return null;
  // Fleet `from_price` is free text like "€ 60", "60 EUR", "from €100", "1,200", "1.200,50".
  // Match the first grouped number, then disambiguate thousands vs decimal separator.
  const m = /(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d+)?)/.exec(value);
  if (!m) return null;
  let raw = m[1];
  const hasDot = raw.includes(".");
  const hasComma = raw.includes(",");
  if (hasDot && hasComma) {
    // Whichever separator appears last is the decimal point.
    const lastDot = raw.lastIndexOf(".");
    const lastComma = raw.lastIndexOf(",");
    if (lastDot > lastComma) {
      raw = raw.replace(/,/g, "");
    } else {
      raw = raw.replace(/\./g, "").replace(",", ".");
    }
  } else if (hasComma) {
    // Single comma: 3 digits after → thousands, else decimal.
    const afterComma = raw.split(",")[1] ?? "";
    raw = afterComma.length === 3 ? raw.replace(",", "") : raw.replace(",", ".");
  } else if (hasDot) {
    // Single dot: 3 digits after → thousands, else decimal (already valid for Number()).
    const afterDot = raw.split(".")[1] ?? "";
    if (afterDot.length === 3) raw = raw.replace(".", "");
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

// Each translatable key gets a one-line brief so the model knows what it's
// translating — what the string is for, where on the voucher it appears, what
// tone/length to use. Without this, an LLM treats "paymentNote" as a generic
// label and produces flat, register-mismatched output.
const FIELD_BRIEFS: Record<string, string> = {
  packageName:
    "Name of the booked tour or product. Used as the large display headline. Keep proper nouns (İstanbul Pack, Cappadocia Stay) intact. Should sound like a product name, not a sentence.",
  region:
    "Short geographic tag shown under the hero — e.g. 'Istanbul · Marmara'. Use established native-language place names. Keep the middle-dot · separator.",
  nightsDays:
    "Short duration tag like '5 nights · 6 days' or '1 day'. Keep numerals as digits. Keep the middle-dot separator.",
  paymentMethod:
    "Payment service or account used by the guest, e.g. 'Western Union', 'Bank Transfer', 'Cash on arrival'. PRESERVE wire-transfer brand names (Western Union, MoneyGram, PayPal) exactly. Translate only generic descriptors.",
  durationLabel:
    "Compact stay-length label like '5 nights'. Keep numerals as digits.",
  itemDescriptor:
    "Subtitle in small muted text under the item name in the price breakdown — e.g. 'Boutique tour · scheduled departure · group package'. Keep middle-dot separators. Tone: descriptive tags, not a sentence.",
  paymentNote:
    "A single-sentence italicized note centered on the voucher, prominent — e.g. 'Total payment to be settled in Istanbul upon arrival.' Tone: warm and formal, like a concierge note. Keep one sentence.",
  footerThanks:
    "Brief closing message in the navy footer — e.g. 'A warm welcome to Türkiye — we are honoured to host you.' Tone: heartfelt, gracious, like a luxury hotel welcome. May use an em-dash for flourish.",
  pickupLocation:
    "Geographic pickup point for a private transfer (e.g. airport, hotel name). PRESERVE landmark and airport names verbatim. Translate only generic terms ('hotel', 'airport') when useful.",
  dropoffLocation:
    "Geographic dropoff point for a private transfer. Same rules as pickupLocation.",
};

// Each guest's `role` is passed under a synthetic key `guest_role_N`. They're
// short labels like "Lead Guest", "Companion", "Child", "Spouse".
const GUEST_ROLE_BRIEF =
  "Guest role label, shown as a small uppercase eyebrow above the guest's name. Short noun phrase (1-3 words). Use natural target-language equivalents — e.g. Lead Guest / Companion / Child / Spouse.";

// Locale-specific register guidance. Tells the model how Arabic, Turkish, etc.
// formal-document language differs from casual or generic phrasing.
const LOCALE_GUIDANCE: Record<Locale, string> = {
  en: "Polished English with a warm, concierge tone.",
  ar:
    "Modern Standard Arabic (الفصحى) at a formal level — the register used on official documents, luxury hotel correspondence, and high-end concierge notes. Use the polite plural form (أنتم / حضرتكم) when addressing the guest. Use established Arabic place names: إسطنبول for Istanbul, تركيا for Turkey, القاهرة for Cairo, etc. Do not transliterate. Use Arabic-script numerals only if the rest of the document does — otherwise keep Western numerals as-is. Use Arabic punctuation marks where natural (، ؟ ؛).",
  tr:
    "Native Turkish at a formal, polished register — the way a high-end Istanbul boutique tour operator would write to a paying guest. Use 'siz' (formal you). Use authentic Turkish idiom; do NOT produce English-sounding translations. Tourism-industry vocabulary preferred (rezervasyon, transfer, konaklama).",
  es:
    "Formal Spanish using 'usted'. Polished, hospitality-industry register (lujo, atelier). Use Castilian Spanish unless the text reads more naturally in pan-Latin-American form. Preserve Türkiye/Istanbul; use 'Estambul' if more natural in flowing prose.",
  it:
    "Formal Italian using the 'Lei' form. Tone of a luxury Italian hotelier. Use 'gentile ospite' style phrasing where appropriate. Preserve Türkiye; use 'Istanbul' as-is.",
  fr:
    "Formal French using 'vous'. Tone of a Parisian luxury hotel concierge. Use 'Türkiye' for the country (or 'Turquie' if more natural in a sentence). Use 'Istanbul' as-is.",
  de:
    "Formal German using 'Sie'. Polished, hospitality-industry register. Compound nouns where natural (Reisedokument, Aufenthalt). Use 'Istanbul' / 'Türkei'.",
  ru:
    "Formal Russian using 'Вы' (capitalized) when directly addressing the guest. Polished, hospitality register. Use 'Стамбул' for Istanbul, 'Турция' for Turkey in running prose.",
  zh:
    "Simplified Chinese (中国大陆) at a formal, hospitality-industry register. Use 您 for second person. Use 伊斯坦布尔 / 土耳其 for place names. Preserve brand names (Sabrina Turizm) in Latin script.",
  ja:
    "Polite Japanese (敬語/丁寧語). Use ます/です throughout. Tone: high-end hotel concierge. Use イスタンブール / トルコ for place names. Preserve brand names (Sabrina Turizm) in Latin script.",
};

function buildBriefedInput(cleaned: Record<string, string>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(cleaned)) {
    const brief = key.startsWith("guest_role_")
      ? GUEST_ROLE_BRIEF
      : FIELD_BRIEFS[key] ?? "Free-text voucher field.";
    lines.push(`- "${key}":`);
    lines.push(`    brief: ${brief}`);
    lines.push(`    english: ${JSON.stringify(value)}`);
  }
  return lines.join("\n");
}

export async function translateVoucherFields(
  fields: Record<string, string>,
  targetLocale: Locale,
): Promise<{ result?: Record<string, string>; error?: string }> {
  if (targetLocale === "en") {
    return { result: fields };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { error: "GROQ_API_KEY is not set in .env.local" };

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "string" && value.trim().length > 0) {
      cleaned[key] = value;
    }
  }
  if (Object.keys(cleaned).length === 0) return { result: {} };

  const localeName = LOCALE_NAMES[targetLocale];
  const guidance = LOCALE_GUIDANCE[targetLocale];
  const briefedInput = buildBriefedInput(cleaned);
  const groq = new Groq({ apiKey });

  const systemPrompt = `You are the in-house translator for Sabrina Turizm, a boutique luxury tour operator based in Karaköy, Istanbul. You translate official travel-voucher copy from English into ${localeName}.

The voucher is a single-page A4 PDF handed (or emailed) to paying guests. It's a customer-facing official document, not internal copy — register matters. Imagine the prose of a top-tier hotel's welcome letter, not a generic invoice or Google-Translate output.

────── LOCALE: ${localeName} ──────
${guidance}

────── RULES ──────
1. PRESERVE these literally, never translate:
   • Brand names: "Sabrina Turizm", "Sabrina"
   • Personal names, voucher numbers, phone numbers, passport numbers, dates
   • Wire-transfer / payment brand names: "Western Union", "MoneyGram", "PayPal", "Stripe", "Wise"
   • Custom landmark names the admin typed verbatim (Sabiha Gökçen, Sultanahmet, Karaköy, etc.) — keep recognizable form, you may add native script in parentheses only if widely used
2. Use established native-language forms for well-known city/country names (Istanbul → إسطنبول/Estambul/イスタンブール, Türkiye → تركيا/Turquie/トルコ).
3. Preserve formatting: middle dots (·), em-dashes (—), line breaks, digits, currency symbols.
4. Match length to the original — voucher labels are tight; don't pad with filler.
5. Each field has a "brief" telling you what it's for and what tone/length to use. Read it before translating.
6. CRITICAL: Never put a double-quote character (") inside any string value — use a single quote (') or rephrase. The output must be valid JSON.

────── OUTPUT FORMAT ──────
Return a single JSON object whose keys exactly match the input keys, and whose values are the ${localeName} translations. No commentary, no markdown fences, no extra keys.`;

  const userPrompt = `Translate the following voucher fields into ${localeName}. Each item has a key, a brief explaining what the field is for, and the English source text.

${briefedInput}

Return ONLY the JSON object: { "<key>": "<${localeName} translation>", ... }`;

  try {
    let content: string;
    try {
      const chat = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 2048,
      });
      content = chat.choices[0]?.message?.content ?? "{}";
    } catch {
      const chat2 = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      });
      content = extractJson(chat2.choices[0]?.message?.content ?? "{}");
    }
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const key of Object.keys(cleaned)) {
      const v = parsed[key];
      if (typeof v === "string") out[key] = v;
    }
    return { result: out };
  } catch (err) {
    console.error("[voucher/translate] error:", err);
    return { error: "Translation failed. Try again." };
  }
}
