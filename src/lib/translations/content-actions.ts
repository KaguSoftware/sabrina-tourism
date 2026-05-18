"use server";

import { updateTag, revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import type { ContentLocale } from "./ai";

export type ContentTranslations = Record<string, Record<ContentLocale, string>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

/* ── Daily packages ─────────────────────────────────────────────────── */

export async function saveDailyTranslations(
  pkgId: string,
  translations: ContentTranslations
): Promise<{ error?: string }> {
  const supabase = db();

  // Main package fields
  const pkgUpdate: Record<string, unknown> = {};
  if (translations.name) pkgUpdate.name_translations = translations.name;
  if (translations.short_description) pkgUpdate.short_description_translations = translations.short_description;

  if (Object.keys(pkgUpdate).length) {
    const { error } = await supabase.from("daily_packages").update(pkgUpdate).eq("id", pkgId);
    if (error) return { error: error.message };
  }

  // Stops — keyed as stop_{stopIndex}_place, stop_{stopIndex}_description
  const stopUpdates: Record<string, Record<string, unknown>> = {};
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^stop_(\d+)_(place|description)$/);
    if (!m) continue;
    const idx = m[1];
    const field = m[2];
    if (!stopUpdates[idx]) stopUpdates[idx] = {};
    stopUpdates[idx][`${field}_translations`] = val;
  }
  for (const [idx, update] of Object.entries(stopUpdates)) {
    const { data: stops } = await supabase
      .from("daily_package_stops")
      .select("id")
      .eq("package_id", pkgId)
      .order("sort_order");
    const stop = stops?.[parseInt(idx)];
    if (stop) {
      await supabase.from("daily_package_stops").update(update).eq("id", stop.id);
    }
  }

  // Included — keyed as included_{idx}
  const includedUpdates: Record<string, Record<ContentLocale, string>> = {};
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^included_(\d+)$/);
    if (!m) continue;
    includedUpdates[m[1]] = val;
  }
  for (const [idx, val] of Object.entries(includedUpdates)) {
    const { data: items } = await supabase
      .from("daily_package_included")
      .select("id")
      .eq("package_id", pkgId)
      .order("sort_order");
    const item = items?.[parseInt(idx)];
    if (item) {
      await supabase.from("daily_package_included").update({ text_translations: val }).eq("id", item.id);
    }
  }

  const notIncludedUpdates: Record<string, Record<ContentLocale, string>> = {};
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^not_included_(\d+)$/);
    if (!m) continue;
    notIncludedUpdates[m[1]] = val;
  }
  for (const [idx, val] of Object.entries(notIncludedUpdates)) {
    const { data: items } = await supabase
      .from("daily_package_not_included")
      .select("id")
      .eq("package_id", pkgId)
      .order("sort_order");
    const item = items?.[parseInt(idx)];
    if (item) {
      await supabase.from("daily_package_not_included").update({ text_translations: val }).eq("id", item.id);
    }
  }

  updateTag(tags.daily.all());
  return {};
}

/* ── Premade (fixed-date) packages ──────────────────────────────────── */

export async function savePremadeTranslations(
  pkgId: string,
  translations: ContentTranslations
): Promise<{ error?: string }> {
  const supabase = db();

  const pkgFields = ["name", "short_description", "overview", "accommodation_name", "accommodation_description"];
  const pkgUpdate: Record<string, unknown> = {};
  for (const f of pkgFields) {
    if (translations[f]) pkgUpdate[`${f}_translations`] = translations[f];
  }
  if (Object.keys(pkgUpdate).length) {
    const { error } = await supabase.from("premade_packages").update(pkgUpdate).eq("id", pkgId);
    if (error) return { error: error.message };
  }

  // Itinerary days — keyed as day_{idx}_title, day_{idx}_description
  const dayUpdates: Record<string, Record<string, unknown>> = {};
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^day_(\d+)_(title|description)$/);
    if (!m) continue;
    if (!dayUpdates[m[1]]) dayUpdates[m[1]] = {};
    dayUpdates[m[1]][`${m[2]}_translations`] = val;
  }
  for (const [idx, update] of Object.entries(dayUpdates)) {
    const { data: days } = await supabase
      .from("premade_package_itinerary_days")
      .select("id")
      .eq("package_id", pkgId)
      .order("sort_order");
    const day = days?.[parseInt(idx)];
    if (day) await supabase.from("premade_package_itinerary_days").update(update).eq("id", day.id);
  }

  // Tiers highlights — keyed as tier_{idx}_highlights
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^tier_(\d+)_highlights$/);
    if (!m) continue;
    const { data: tiers } = await supabase
      .from("premade_package_tiers")
      .select("id")
      .eq("package_id", pkgId)
      .order("sort_order");
    const tier = tiers?.[parseInt(m[1])];
    if (tier) await supabase.from("premade_package_tiers").update({ highlights_translations: val }).eq("id", tier.id);
  }

  // Inclusions — keyed as inclusion_{idx}
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^inclusion_(included|not_included)_(\d+)$/);
    if (!m) continue;
    const kind = m[1];
    const idx = parseInt(m[2]);
    const { data: items } = await supabase
      .from("premade_package_inclusions")
      .select("id")
      .eq("package_id", pkgId)
      .eq("kind", kind)
      .order("sort_order");
    const item = items?.[idx];
    if (item) await supabase.from("premade_package_inclusions").update({ text_translations: val }).eq("id", item.id);
  }

  updateTag(tags.premade.all());
  return {};
}

/* ── Hotels ─────────────────────────────────────────────────────────── */

export async function saveHotelTranslations(
  hotelId: string,
  translations: ContentTranslations
): Promise<{ error?: string }> {
  const supabase = db();

  const hotelFields = ["name", "description", "long_description", "tag_a", "tag_b", "location"];
  const hotelUpdate: Record<string, unknown> = {};
  for (const f of hotelFields) {
    if (translations[f]) hotelUpdate[`${f}_translations`] = translations[f];
  }
  if (Object.keys(hotelUpdate).length) {
    const { error } = await supabase.from("hotels").update(hotelUpdate).eq("id", hotelId);
    if (error) return { error: error.message };
  }

  // Amenities — keyed as amenity_{idx}
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^amenity_(\d+)$/);
    if (!m) continue;
    const { data: items } = await supabase
      .from("hotel_amenities")
      .select("id")
      .eq("hotel_id", hotelId)
      .order("sort_order");
    const item = items?.[parseInt(m[1])];
    if (item) await supabase.from("hotel_amenities").update({ text_translations: val }).eq("id", item.id);
  }

  // Room types — keyed as room_{idx}_name, room_{idx}_beds, room_{idx}_size, room_{idx}_highlights
  const roomUpdates: Record<string, Record<string, unknown>> = {};
  for (const [key, val] of Object.entries(translations)) {
    const m = key.match(/^room_(\d+)_(name|beds|size|highlights)$/);
    if (!m) continue;
    if (!roomUpdates[m[1]]) roomUpdates[m[1]] = {};
    roomUpdates[m[1]][`${m[2]}_translations`] = val;
  }
  for (const [idx, update] of Object.entries(roomUpdates)) {
    const { data: rooms } = await supabase
      .from("hotel_room_types")
      .select("id")
      .eq("hotel_id", hotelId)
      .order("sort_order");
    const room = rooms?.[parseInt(idx)];
    if (room) await supabase.from("hotel_room_types").update(update).eq("id", room.id);
  }

  updateTag(tags.hotels.all());
  return {};
}

/* ── Load translations ───────────────────────────────────────────────── */

export async function loadDailyTranslations(pkgId: string): Promise<ContentTranslations> {
  const supabase = db();
  const result: ContentTranslations = {};

  const { data: pkg } = await supabase
    .from("daily_packages")
    .select("name_translations, short_description_translations")
    .eq("id", pkgId)
    .single();

  if (pkg) {
    if (pkg.name_translations) result.name = pkg.name_translations;
    if (pkg.short_description_translations) result.short_description = pkg.short_description_translations;
  }

  const { data: stops } = await supabase
    .from("daily_package_stops")
    .select("place_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");

  (stops ?? []).forEach((s: Record<string, unknown>, i: number) => {
    if (s.place_translations) result[`stop_${i}_place`] = s.place_translations as Record<ContentLocale, string>;
    if (s.description_translations) result[`stop_${i}_description`] = s.description_translations as Record<ContentLocale, string>;
  });

  const { data: included } = await supabase
    .from("daily_package_included")
    .select("text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");

  (included ?? []).forEach((item: Record<string, unknown>, i: number) => {
    if (item.text_translations) result[`included_${i}`] = item.text_translations as Record<ContentLocale, string>;
  });

  const { data: notIncluded } = await supabase
    .from("daily_package_not_included")
    .select("text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");

  (notIncluded ?? []).forEach((item: Record<string, unknown>, i: number) => {
    if (item.text_translations) result[`not_included_${i}`] = item.text_translations as Record<ContentLocale, string>;
  });

  return result;
}

export async function loadPremadeTranslations(pkgId: string): Promise<ContentTranslations> {
  const supabase = db();
  const result: ContentTranslations = {};

  const { data: pkg } = await supabase
    .from("premade_packages")
    .select("name_translations, short_description_translations, overview_translations, accommodation_name_translations, accommodation_description_translations")
    .eq("id", pkgId)
    .single();

  if (pkg) {
    const map: Record<string, string> = {
      name: "name_translations",
      short_description: "short_description_translations",
      overview: "overview_translations",
      accommodation_name: "accommodation_name_translations",
      accommodation_description: "accommodation_description_translations",
    };
    for (const [k, col] of Object.entries(map)) {
      if (pkg[col]) result[k] = pkg[col];
    }
  }

  const { data: days } = await supabase
    .from("premade_package_itinerary_days")
    .select("title_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");

  (days ?? []).forEach((d: Record<string, unknown>, i: number) => {
    if (d.title_translations) result[`day_${i}_title`] = d.title_translations as Record<ContentLocale, string>;
    if (d.description_translations) result[`day_${i}_description`] = d.description_translations as Record<ContentLocale, string>;
  });

  const { data: tiers } = await supabase
    .from("premade_package_tiers")
    .select("highlights_translations")
    .eq("package_id", pkgId)
    .order("sort_order");

  (tiers ?? []).forEach((t: Record<string, unknown>, i: number) => {
    if (t.highlights_translations) result[`tier_${i}_highlights`] = t.highlights_translations as Record<ContentLocale, string>;
  });

  // Inclusions
  const { data: included } = await supabase
    .from("premade_package_inclusions")
    .select("text_translations, kind")
    .eq("package_id", pkgId)
    .eq("kind", "included")
    .order("sort_order");

  const { data: notIncluded } = await supabase
    .from("premade_package_inclusions")
    .select("text_translations, kind")
    .eq("package_id", pkgId)
    .eq("kind", "not_included")
    .order("sort_order");

  (included ?? []).forEach((item: Record<string, unknown>, i: number) => {
    if (item.text_translations) result[`inclusion_included_${i}`] = item.text_translations as Record<ContentLocale, string>;
  });

  (notIncluded ?? []).forEach((item: Record<string, unknown>, i: number) => {
    if (item.text_translations) result[`inclusion_not_included_${i}`] = item.text_translations as Record<ContentLocale, string>;
  });

  return result;
}

export async function loadHotelTranslations(hotelId: string): Promise<ContentTranslations> {
  const supabase = db();
  const result: ContentTranslations = {};

  const { data: hotel } = await supabase
    .from("hotels")
    .select("name_translations, description_translations, long_description_translations, tag_a_translations, tag_b_translations, location_translations")
    .eq("id", hotelId)
    .single();

  if (hotel) {
    for (const [col, val] of Object.entries(hotel)) {
      const key = col.replace("_translations", "");
      if (val) result[key] = val as Record<ContentLocale, string>;
    }
  }

  const { data: amenities } = await supabase
    .from("hotel_amenities")
    .select("text_translations")
    .eq("hotel_id", hotelId)
    .order("sort_order");

  (amenities ?? []).forEach((a: Record<string, unknown>, i: number) => {
    if (a.text_translations) result[`amenity_${i}`] = a.text_translations as Record<ContentLocale, string>;
  });

  const { data: rooms } = await supabase
    .from("hotel_room_types")
    .select("name_translations, beds_translations, size_translations, highlights_translations")
    .eq("hotel_id", hotelId)
    .order("sort_order");

  (rooms ?? []).forEach((r: Record<string, unknown>, i: number) => {
    if (r.name_translations) result[`room_${i}_name`] = r.name_translations as Record<ContentLocale, string>;
    if (r.beds_translations) result[`room_${i}_beds`] = r.beds_translations as Record<ContentLocale, string>;
    if (r.size_translations) result[`room_${i}_size`] = r.size_translations as Record<ContentLocale, string>;
    if (r.highlights_translations) result[`room_${i}_highlights`] = r.highlights_translations as Record<ContentLocale, string>;
  });

  return result;
}

/* ── Site content (home, tours page, etc.) ──────────────────────── */

export async function loadSiteContentTranslations(key: string): Promise<ContentTranslations> {
  const supabase = db();
  const result: ContentTranslations = {};
  const { data: row } = await supabase
    .from("site_content")
    .select("data_translations")
    .eq("id", key)
    .single();
  if (row?.data_translations && typeof row.data_translations === "object") {
    // data_translations shape: { tr: { fieldKey: "val" }, ar: { ... }, ... }
    // Pivot to ContentTranslations: { fieldKey: { tr: "val", ar: "val" } }
    for (const [locale, fields] of Object.entries(row.data_translations as Record<string, Record<string, string>>)) {
      for (const [field, value] of Object.entries(fields)) {
        if (!result[field]) result[field] = {} as Record<ContentLocale, string>;
        (result[field] as Record<string, string>)[locale] = value;
      }
    }
  }
  return result;
}

export async function saveSiteContentTranslations(
  key: string,
  translations: ContentTranslations
): Promise<{ error?: string }> {
  const supabase = db();
  // Pivot ContentTranslations back to { locale: { fieldKey: value } }
  const byLocale: Record<string, Record<string, string>> = {};
  for (const [field, localeMap] of Object.entries(translations)) {
    for (const [locale, value] of Object.entries(localeMap)) {
      if (!byLocale[locale]) byLocale[locale] = {};
      byLocale[locale][field] = value;
    }
  }
  const { error } = await supabase
    .from("site_content")
    .update({ data_translations: byLocale })
    .eq("id", key);
  if (error) return { error: error.message };
  updateTag(tags.siteContent(key));
  revalidatePath("/", "layout");
  return {};
}
