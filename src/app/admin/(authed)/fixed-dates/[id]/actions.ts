"use server";
import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { PremadeSchema, type PremadeFormValues } from "./schema";
import { replaceChildren } from "@/lib/admin/replace-children";

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

function revalidateAll(slug?: string, previousSlug?: string | null) {
  updateTag(tags.premade.admin());
  updateTag(tags.premade.all());
  updateTag(tags.premade.slugs());
  if (slug) updateTag(tags.premade.bySlug(slug));
  if (previousSlug && previousSlug !== slug) updateTag(tags.premade.bySlug(previousSlug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findUniqueSlug(supabase: any, table: string, baseSlug: string, excludeId?: string): Promise<string> {
  const query = supabase.from(table).select("slug").like("slug", `${baseSlug}%`);
  const { data } = excludeId ? await query.neq("id", excludeId) : await query;
  const existing = new Set<string>((data ?? []).map((r: { slug: string }) => r.slug));
  if (!existing.has(baseSlug)) return baseSlug;
  let n = 2;
  while (existing.has(`${baseSlug}-${n}`)) n++;
  return `${baseSlug}-${n}`;
}

function deriveDateSpan(
  dates: Array<{ start_date: string; end_date: string }>,
): { start: string; end: string } | null {
  const starts = dates.map((d) => d.start_date).filter(Boolean).sort();
  const ends = dates.map((d) => d.end_date).filter(Boolean).sort();
  if (!starts.length || !ends.length) return null;
  return { start: starts[0], end: ends[ends.length - 1] };
}

function deriveFlexibleSpan(availableFrom: string, availableTo: string): { start: string; end: string } {
  const today = new Date().toISOString().slice(0, 10);
  const start = availableFrom || today;
  return { start, end: availableTo && availableTo >= start ? availableTo : start };
}

export async function savePremadePackage(payload: PremadeFormValues): Promise<{ error?: string; id?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const parsed = PremadeSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  const data = parsed.data;

  const supabase = db();
  let slug = slugify(data.name);
  if (!slug) return { error: "Name produces an empty slug." };

  // Flexible tours let the guest pick the start date, so fixed departures are
  // dropped rather than left behind as hidden rows.
  const departures = data.flexible_departure ? [] : data.dates;

  // `premade_packages.start_date` / `end_date` are legacy NOT NULL columns kept
  // for backwards compatibility. Departures now live in `premade_package_dates`,
  // so derive the legacy span from the earliest / latest departure rather than
  // trusting the (no longer edited) top-level form fields. Flexible tours have
  // no departures, so fall back to the availability window.
  const span = data.flexible_departure
    ? deriveFlexibleSpan(data.available_from, data.available_to)
    : deriveDateSpan(departures);
  if (!span) return { error: "Add at least one departure date before saving." };

  let pkgId = data.id;
  let storedSlug: string | null = null;
  if (pkgId) {
    const { data: existing } = await supabase
      .from("premade_packages")
      .select("slug")
      .eq("id", pkgId)
      .maybeSingle();
    storedSlug = existing?.slug ?? null;
  }

  const coreFields = {
    name: data.name,
    start_date: span.start,
    end_date: span.end,
    flexible_departure: data.flexible_departure,
    destinations: data.destinations,
    short_description: data.short_description,
    hero_image: data.hero_image,
    card_image: data.card_image,
    accommodation_name: data.accommodation_name,
    accommodation_description: data.accommodation_description,
    accommodation_image_a: data.accommodation_image_a,
    accommodation_image_b: data.accommodation_image_b,
    vehicle_model: data.vehicle_model,
    vehicle_features: data.vehicle_features,
    is_published: data.is_published,
    region: data.region || null,
    season: data.season ?? null,
    duration: data.duration || null,
    min_people: data.min_people,
    max_people: data.max_people,
    available_from: data.available_from || null,
    available_to: data.available_to || null,
    overview: data.overview || null,
    currency: data.currency || 'USD',
    price_1_person: data.price_1_person ?? null,
    price_baby: data.price_baby ?? null,
  };

  if (pkgId) {
    // Recompute slug from the (possibly renamed) name; ensure uniqueness against other rows
    if (slug !== storedSlug) {
      slug = await findUniqueSlug(supabase, "premade_packages", slug, pkgId);
    }
    const { error } = await supabase
      .from("premade_packages")
      .update({ ...coreFields, slug })
      .eq("id", pkgId);
    if (error) return { error: error.message };
  } else {
    slug = await findUniqueSlug(supabase, "premade_packages", slug);
    const { data: row, error } = await supabase.from("premade_packages").insert({
      slug,
      ...coreFields,
      sort_order: (await supabase.from("premade_packages").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !row) return { error: error?.message ?? "Insert failed" };
    pkgId = row.id;
  }
  if (!pkgId) return { error: "Save failed — no package id" };

  // Every child table is replaced wholesale. replaceChildren inserts before it
  // deletes and reports failures, so a bad write can no longer wipe a tour's
  // itinerary or departures while the editor claims the save succeeded.

  // "Add image" seeds a blank row; drop any the editor left unfilled so the
  // public gallery never renders placeholder tiles.
  const galleryRows = data.gallery
    .filter((g) => g.url.trim())
    .map((g, i) => ({ package_id: pkgId, url: g.url.trim(), sort_order: i }));

  const dateRows = departures.map((d, i) => ({
    package_id: pkgId,
    start_date: d.start_date,
    end_date: d.end_date,
    sort_order: i,
  }));

  // Translations live on the child rows, so carry them across by position.
  const { data: existingDays } = await supabase
    .from("premade_package_itinerary_days")
    .select("sort_order, title_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  const itineraryRows = [...data.itinerary]
    .sort((a, b) => a.day_number - b.day_number)
    .map((d, i) => ({
      package_id: pkgId,
      day_number: d.day_number,
      title: d.title,
      description: d.description,
      sort_order: i,
      title_translations: existingDays?.[i]?.title_translations ?? {},
      description_translations: existingDays?.[i]?.description_translations ?? {},
    }));

  const { data: existingTiers } = await supabase
    .from("premade_package_tiers")
    .select("sort_order, tier_name_translations, vehicle_class_translations, group_size_translations, meals_included_translations, guide_languages_translations, highlights_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  const tierRows = data.tiers.map((t, i) => ({
    package_id: pkgId,
    tier_name: t.tier_name,
    vehicle_class: t.vehicle_class,
    accommodation: t.accommodation,
    hotel_id: t.hotel_id ?? null,
    group_size: t.group_size,
    guide_languages: t.guide_languages,
    meals_included: t.meals_included,
    highlights: t.highlights,
    price_2_people: t.price_2_people ?? null,
    price_single_room_supplement: t.price_single_room_supplement ?? null,
    price_per_child: t.price_per_child ?? null,
    sort_order: i,
    tier_name_translations: existingTiers?.[i]?.tier_name_translations ?? {},
    vehicle_class_translations: existingTiers?.[i]?.vehicle_class_translations ?? {},
    group_size_translations: existingTiers?.[i]?.group_size_translations ?? {},
    meals_included_translations: existingTiers?.[i]?.meals_included_translations ?? {},
    guide_languages_translations: existingTiers?.[i]?.guide_languages_translations ?? {},
    highlights_translations: existingTiers?.[i]?.highlights_translations ?? {},
  }));

  const { data: existingIncluded } = await supabase
    .from("premade_package_inclusions")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId).eq("kind", "included")
    .order("sort_order");
  const { data: existingNotIncluded } = await supabase
    .from("premade_package_inclusions")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId).eq("kind", "not_included")
    .order("sort_order");
  const inclusionRows = [
    ...data.included.map((item, i) => ({
      package_id: pkgId, kind: "included", text: item.text, icon: item.icon ?? null, sort_order: i,
      text_translations: existingIncluded?.[i]?.text_translations ?? {},
    })),
    ...data.not_included.map((item, i) => ({
      package_id: pkgId, kind: "not_included", text: item.text, icon: item.icon ?? null, sort_order: i,
      text_translations: existingNotIncluded?.[i]?.text_translations ?? {},
    })),
  ];

  const children: Array<[string, Record<string, unknown>[], string]> = [
    ["premade_package_gallery", galleryRows, "Gallery"],
    ["premade_package_dates", dateRows, "Departure dates"],
    ["premade_package_itinerary_days", itineraryRows, "Itinerary"],
    ["premade_package_tiers", tierRows, "Tiers"],
    ["premade_package_inclusions", inclusionRows, "Inclusions"],
  ];
  for (const [table, rows, label] of children) {
    const { error } = await replaceChildren(supabase, table, "package_id", pkgId, rows, label);
    if (error) return { error };
  }

  revalidateAll(slug, storedSlug);
  return { id: pkgId };
}
