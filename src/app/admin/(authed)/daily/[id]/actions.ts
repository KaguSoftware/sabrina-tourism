"use server";
import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { DailySchema, type DailyFormValues } from "./schema";
import { replaceChildren } from "@/lib/admin/replace-children";

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

function revalidateAll(slug?: string) {
  updateTag(tags.daily.admin());
  updateTag(tags.daily.all());
  if (slug) updateTag(tags.daily.bySlug(slug));
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

export async function saveDailyPackage(payload: DailyFormValues): Promise<{ error?: string; id?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const parsed = DailySchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  const data = parsed.data;

  const supabase = db();
  let slug = slugify(data.name);
  if (!slug) return { error: "Name produces an empty slug." };

  let pkgId = data.id;
  let storedSlug: string | null = null;
  if (pkgId) {
    const { data: existing } = await supabase
      .from("daily_packages")
      .select("slug")
      .eq("id", pkgId)
      .maybeSingle();
    storedSlug = existing?.slug ?? null;
  }

  const coreFields = {
    name: data.name,
    tour_date: data.tour_date,
    start_time: data.start_time,
    end_time: data.end_time,
    region: data.region,
    season: data.season ?? null,
    vehicle: data.vehicle,
    driver: data.driver,
    price: data.price,
    currency: data.currency,
    short_description: data.short_description,
    hero_image: data.hero_image,
    card_image: data.card_image,
    is_published: data.is_published,
    price_1_person: data.price_1_person ?? null,
    price_2_people: data.price_2_people ?? null,
    price_baby: data.price_baby ?? null,
    price_single_room_supplement: data.price_single_room_supplement ?? null,
    price_per_child: data.price_per_child ?? null,
  };

  if (pkgId) {
    const { error } = await supabase.from("daily_packages").update(coreFields).eq("id", pkgId);
    if (error) return { error: error.message };
  } else {
    slug = await findUniqueSlug(supabase, "daily_packages", slug);
    const { data: row, error } = await supabase.from("daily_packages").insert({
      slug,
      ...coreFields,
      sort_order: (await supabase.from("daily_packages").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !row) return { error: error?.message ?? "Insert failed" };
    pkgId = row.id;
  }
  if (!pkgId) return { error: "Save failed — no package id" };

  // Every child table is replaced wholesale. replaceChildren inserts before it
  // deletes and reports failures, so a bad write can no longer wipe a tour's
  // stops or inclusions while the editor claims the save succeeded.
  // Translations live on the child rows, so carry them across by position.

  const { data: existingStops } = await supabase
    .from("daily_package_stops")
    .select("sort_order, place_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  const stopRows = data.stops.map((s, i) => ({
    package_id: pkgId, stop_time: "", place: s.place, description: s.description, sort_order: i,
    place_translations: existingStops?.[i]?.place_translations ?? null,
    description_translations: existingStops?.[i]?.description_translations ?? null,
  }));

  const { data: existingIncluded } = await supabase
    .from("daily_package_included")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  const includedRows = data.included.map((item, i) => ({
    package_id: pkgId, text: item.text, icon: item.icon ?? null, sort_order: i,
    text_translations: existingIncluded?.[i]?.text_translations ?? null,
  }));

  const { data: existingNotIncluded } = await supabase
    .from("daily_package_not_included")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  const notIncludedRows = data.not_included.map((item, i) => ({
    package_id: pkgId, text: item.text, icon: item.icon ?? null, sort_order: i,
    text_translations: existingNotIncluded?.[i]?.text_translations ?? null,
  }));

  // "Add image" seeds a blank row; drop any the editor left unfilled so the
  // public gallery never renders placeholder tiles.
  const galleryRows = data.gallery
    .filter((g) => g.url.trim())
    .map((g, i) => ({ package_id: pkgId, url: g.url.trim(), sort_order: i }));

  const children: Array<[string, Record<string, unknown>[], string]> = [
    ["daily_package_stops", stopRows, "Stops"],
    ["daily_package_included", includedRows, "Inclusions"],
    ["daily_package_not_included", notIncludedRows, "Exclusions"],
    ["daily_package_gallery", galleryRows, "Gallery"],
  ];
  for (const [table, rows, label] of children) {
    const { error } = await replaceChildren(supabase, table, "package_id", pkgId, rows, label);
    if (error) return { error };
  }

  revalidateAll(storedSlug ?? slug);
  return { id: pkgId };
}
