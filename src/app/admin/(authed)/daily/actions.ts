"use server";
import { updateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";

function revalidateAll(slug?: string) {
  updateTag(tags.daily.all());
  if (slug) updateTag(tags.daily.bySlug(slug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

export async function reorderDailyPackages(orderedIds: string[]): Promise<{ error?: string }> {
  const supabase = db();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("daily_packages").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidateAll();
  return {};
}

export async function setDailyPublished(id: string, isPublished: boolean): Promise<{ error?: string }> {
  const supabase = db();
  const { error } = await supabase.from("daily_packages").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function deleteDailyPackage(id: string): Promise<{ error?: string }> {
  const supabase = db();
  const { error } = await supabase.from("daily_packages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function duplicateDailyPackage(id: string): Promise<{ error?: string; newId?: string }> {
  const supabase = db();
  const { data: pkg, error: pkgErr } = await supabase
    .from("daily_packages")
    .select("*, daily_package_stops(*), daily_package_included(*), daily_package_gallery(*)")
    .eq("id", id)
    .maybeSingle();
  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Not found" };

  const baseSlug = `${pkg.slug}-copy`;
  let newSlug = baseSlug; let n = 0;
  while (true) {
    const { data: ex } = await supabase.from("daily_packages").select("id").eq("slug", newSlug).maybeSingle();
    if (!ex) break;
    newSlug = `${baseSlug}-${++n}`;
  }

  const { data: newPkg, error: insertErr } = await supabase.from("daily_packages").insert({
    slug: newSlug, name: `${pkg.name} (Copy)`,
    tour_date: pkg.tour_date, start_time: pkg.start_time, end_time: pkg.end_time,
    region: pkg.region, vehicle: pkg.vehicle, driver: pkg.driver,
    price: pkg.price, currency: pkg.currency, short_description: pkg.short_description,
    hero_image: pkg.hero_image, card_image: pkg.card_image,
    is_published: false, sort_order: (pkg.sort_order ?? 0) + 1,
  }).select("id").single();
  if (insertErr || !newPkg) return { error: insertErr?.message ?? "Insert failed" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strip = (arr: any[]) => arr.map(({ id: _id, package_id: _pid, ...rest }: any) => ({ ...rest, package_id: newPkg.id }));

  if (pkg.daily_package_stops?.length) await supabase.from("daily_package_stops").insert(strip(pkg.daily_package_stops));
  if (pkg.daily_package_included?.length) await supabase.from("daily_package_included").insert(strip(pkg.daily_package_included));
  if (pkg.daily_package_gallery?.length) await supabase.from("daily_package_gallery").insert(strip(pkg.daily_package_gallery));

  revalidateAll();
  return { newId: newPkg.id };
}
