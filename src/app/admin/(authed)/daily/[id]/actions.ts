"use server";
import { updateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { DailySchema, type DailyFormValues } from "./schema";

function revalidateAll(slug?: string) {
  updateTag(tags.daily.all());
  if (slug) updateTag(tags.daily.bySlug(slug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

export async function saveDailyPackage(payload: DailyFormValues): Promise<{ error?: string; id?: string }> {
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
    let candidate = slug; let n = 2;
    while (true) {
      const { data: ex } = await supabase.from("daily_packages").select("id").eq("slug", candidate).maybeSingle();
      if (!ex) { slug = candidate; break; }
      candidate = `${slug}-${n++}`;
    }
    const { data: row, error } = await supabase.from("daily_packages").insert({
      slug,
      ...coreFields,
      sort_order: (await supabase.from("daily_packages").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !row) return { error: error?.message ?? "Insert failed" };
    pkgId = row.id;
  }

  // Replace stops — preserve existing translations
  const { data: existingStops } = await supabase
    .from("daily_package_stops")
    .select("sort_order, place_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  await supabase.from("daily_package_stops").delete().eq("package_id", pkgId);
  if (data.stops.length) {
    await supabase.from("daily_package_stops").insert(
      data.stops.map((s, i) => ({
        package_id: pkgId, stop_time: "", place: s.place, description: s.description, sort_order: i,
        place_translations: existingStops?.[i]?.place_translations ?? null,
        description_translations: existingStops?.[i]?.description_translations ?? null,
      }))
    );
  }

  // Replace inclusions — preserve existing translations
  const { data: existingIncluded } = await supabase
    .from("daily_package_included")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  await supabase.from("daily_package_included").delete().eq("package_id", pkgId);
  if (data.included.length) {
    await supabase.from("daily_package_included").insert(
      data.included.map((item, i) => ({
        package_id: pkgId, text: item.text, icon: item.icon ?? null, sort_order: i,
        text_translations: existingIncluded?.[i]?.text_translations ?? null,
      }))
    );
  }

  // Replace not-included
  const { data: existingNotIncluded } = await supabase
    .from("daily_package_not_included")
    .select("sort_order, text_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  await supabase.from("daily_package_not_included").delete().eq("package_id", pkgId);
  if (data.not_included.length) {
    await supabase.from("daily_package_not_included").insert(
      data.not_included.map((item, i) => ({
        package_id: pkgId, text: item.text, icon: item.icon ?? null, sort_order: i,
        text_translations: existingNotIncluded?.[i]?.text_translations ?? null,
      }))
    );
  }

  // Replace gallery
  await supabase.from("daily_package_gallery").delete().eq("package_id", pkgId);
  if (data.gallery.length) {
    await supabase.from("daily_package_gallery").insert(
      data.gallery.map((g, i) => ({ package_id: pkgId, url: g.url, sort_order: i }))
    );
  }

  revalidateAll(storedSlug ?? slug);
  return { id: pkgId };
}
