"use server";
import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { DailySchema, type DailyFormValues } from "./schema";

function revalidateAll(slug?: string) {
  revalidateTag(tags.daily.all(), "max");
  if (slug) revalidateTag(tags.daily.bySlug(slug), "max");
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

  if (pkgId) {
    const { error } = await supabase.from("daily_packages").update({
      name: data.name, tour_date: data.tour_date, start_time: data.start_time, end_time: data.end_time,
      region: data.region, vehicle: data.vehicle, driver: data.driver,
      price: data.price, currency: data.currency, short_description: data.short_description,
      hero_image: data.hero_image, card_image: data.card_image, is_published: data.is_published,
    }).eq("id", pkgId);
    if (error) return { error: error.message };
  } else {
    let candidate = slug; let n = 2;
    while (true) {
      const { data: ex } = await supabase.from("daily_packages").select("id").eq("slug", candidate).maybeSingle();
      if (!ex) { slug = candidate; break; }
      candidate = `${slug}-${n++}`;
    }
    const { data: row, error } = await supabase.from("daily_packages").insert({
      slug, name: data.name, tour_date: data.tour_date, start_time: data.start_time, end_time: data.end_time,
      region: data.region, vehicle: data.vehicle, driver: data.driver,
      price: data.price, currency: data.currency, short_description: data.short_description,
      hero_image: data.hero_image, card_image: data.card_image, is_published: data.is_published,
      sort_order: (await supabase.from("daily_packages").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !row) return { error: error?.message ?? "Insert failed" };
    pkgId = row.id;
  }

  // Replace stops
  await supabase.from("daily_package_stops").delete().eq("package_id", pkgId);
  if (data.stops.length) {
    await supabase.from("daily_package_stops").insert(
      data.stops.map((s, i) => ({ package_id: pkgId, stop_time: "", place: s.place, description: s.description, sort_order: i }))
    );
  }

  // Replace inclusions
  await supabase.from("daily_package_included").delete().eq("package_id", pkgId);
  if (data.included.length) {
    await supabase.from("daily_package_included").insert(
      data.included.map((item, i) => ({ package_id: pkgId, text: item.text, sort_order: i }))
    );
  }

  // Replace gallery
  await supabase.from("daily_package_gallery").delete().eq("package_id", pkgId);
  if (data.gallery.length) {
    await supabase.from("daily_package_gallery").insert(
      data.gallery.map((g, i) => ({ package_id: pkgId, url: g.url, sort_order: i }))
    );
  }

  revalidateAll(slug);
  return { id: pkgId };
}
