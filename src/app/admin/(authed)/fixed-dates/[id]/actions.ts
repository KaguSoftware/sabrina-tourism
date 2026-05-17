"use server";
import { updateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { PremadeSchema, type PremadeFormValues } from "./schema";

function revalidateAll(slug?: string, previousSlug?: string | null) {
  updateTag(tags.premade.all());
  updateTag(tags.premade.slugs());
  if (slug) updateTag(tags.premade.bySlug(slug));
  if (previousSlug && previousSlug !== slug) updateTag(tags.premade.bySlug(previousSlug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

export async function savePremadePackage(payload: PremadeFormValues): Promise<{ error?: string; id?: string }> {
  const parsed = PremadeSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  const data = parsed.data;

  const supabase = db();
  let slug = slugify(data.name);
  if (!slug) return { error: "Name produces an empty slug." };

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
    start_date: data.start_date,
    end_date: data.end_date,
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
    price: data.price ?? null,
    currency: data.currency || 'USD',
    price_1_person: data.price_1_person ?? null,
    price_2_people: data.price_2_people ?? null,
    price_baby: data.price_baby ?? null,
    price_single_room_supplement: data.price_single_room_supplement ?? null,
    price_per_child: data.price_per_child ?? null,
  };

  if (pkgId) {
    // Recompute slug from the (possibly renamed) name; ensure uniqueness against other rows
    if (slug !== storedSlug) {
      let candidate = slug; let n = 2;
      while (true) {
        const { data: ex } = await supabase
          .from("premade_packages")
          .select("id")
          .eq("slug", candidate)
          .neq("id", pkgId)
          .maybeSingle();
        if (!ex) { slug = candidate; break; }
        candidate = `${slug}-${n++}`;
      }
    }
    const { error } = await supabase
      .from("premade_packages")
      .update({ ...coreFields, slug })
      .eq("id", pkgId);
    if (error) return { error: error.message };
  } else {
    let candidate = slug; let n = 2;
    while (true) {
      const { data: ex } = await supabase.from("premade_packages").select("id").eq("slug", candidate).maybeSingle();
      if (!ex) { slug = candidate; break; }
      candidate = `${slug}-${n++}`;
    }
    const { data: row, error } = await supabase.from("premade_packages").insert({
      slug,
      ...coreFields,
      sort_order: (await supabase.from("premade_packages").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !row) return { error: error?.message ?? "Insert failed" };
    pkgId = row.id;
  }

  // Replace gallery
  await supabase.from("premade_package_gallery").delete().eq("package_id", pkgId);
  if (data.gallery.length) {
    await supabase.from("premade_package_gallery").insert(
      data.gallery.map((g, i) => ({ package_id: pkgId, url: g.url, sort_order: i }))
    );
  }

  // Replace dates
  await supabase.from("premade_package_dates").delete().eq("package_id", pkgId);
  if (data.dates.length) {
    await supabase.from("premade_package_dates").insert(
      data.dates.map((d, i) => ({ package_id: pkgId, start_date: d.start_date, end_date: d.end_date, sort_order: i }))
    );
  }

  // Replace itinerary — preserve existing translations
  const { data: existingDays } = await supabase
    .from("premade_package_itinerary_days")
    .select("sort_order, title_translations, description_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  await supabase.from("premade_package_itinerary_days").delete().eq("package_id", pkgId);
  if (data.itinerary.length) {
    const sorted = [...data.itinerary].sort((a, b) => a.day_number - b.day_number);
    await supabase.from("premade_package_itinerary_days").insert(
      sorted.map((d, i) => ({
        package_id: pkgId,
        day_number: d.day_number,
        title: d.title,
        description: d.description,
        sort_order: i,
        title_translations: existingDays?.[i]?.title_translations ?? null,
        description_translations: existingDays?.[i]?.description_translations ?? null,
      }))
    );
  }

  // Replace tiers — preserve existing translations
  const { data: existingTiers } = await supabase
    .from("premade_package_tiers")
    .select("sort_order, highlights_translations")
    .eq("package_id", pkgId)
    .order("sort_order");
  await supabase.from("premade_package_tiers").delete().eq("package_id", pkgId);
  if (data.tiers.length) {
    await supabase.from("premade_package_tiers").insert(
      data.tiers.map((t, i) => ({
        package_id: pkgId,
        tier_name: t.tier_name,
        vehicle_class: t.vehicle_class,
        accommodation: t.accommodation,
        hotel_id: t.hotel_id ?? null,
        group_size: t.group_size,
        guide_languages: t.guide_languages,
        meals_included: t.meals_included,
        highlights: t.highlights,
        sort_order: i,
        highlights_translations: existingTiers?.[i]?.highlights_translations ?? null,
      }))
    );
  }

  // Replace inclusions — preserve existing translations
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
  await supabase.from("premade_package_inclusions").delete().eq("package_id", pkgId);
  const inclusionRows = [
    ...data.included.map((item, i) => ({
      package_id: pkgId, kind: "included", text: item.text, icon: item.icon ?? null, sort_order: i,
      text_translations: existingIncluded?.[i]?.text_translations ?? null,
    })),
    ...data.not_included.map((item, i) => ({
      package_id: pkgId, kind: "not_included", text: item.text, icon: item.icon ?? null, sort_order: i,
      text_translations: existingNotIncluded?.[i]?.text_translations ?? null,
    })),
  ];
  if (inclusionRows.length) {
    await supabase.from("premade_package_inclusions").insert(inclusionRows);
  }

  revalidateAll(slug, storedSlug);
  return { id: pkgId };
}
