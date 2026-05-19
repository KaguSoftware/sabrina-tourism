"use server";
import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";

function revalidateAll(slug?: string) {
  updateTag(tags.daily.admin());
  updateTag(tags.daily.all());
  if (slug) updateTag(tags.daily.bySlug(slug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

export async function reorderDailyPackages(orderedIds: string[]): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const updates = orderedIds.map((id, i) => ({ id, sort_order: i }));
  const { error } = await supabase.from("daily_packages").upsert(updates);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function setDailyPublished(id: string, isPublished: boolean): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { error } = await supabase.from("daily_packages").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function deleteDailyPackage(id: string): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { error } = await supabase.from("daily_packages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function duplicateDailyPackage(id: string): Promise<{ error?: string; newId?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { data: pkg, error: pkgErr } = await supabase
    .from("daily_packages")
    .select("*, daily_package_stops(*), daily_package_included(*), daily_package_gallery(*)")
    .eq("id", id)
    .maybeSingle();
  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Not found" };

  const baseSlug = `${pkg.slug}-copy`;
  const { data: _dupData } = await supabase.from("daily_packages").select("slug").like("slug", `${baseSlug}%`);
  const _dupExisting = new Set<string>((_dupData ?? []).map((r: { slug: string }) => r.slug));
  let newSlug = baseSlug;
  if (_dupExisting.has(baseSlug)) {
    let n = 1;
    while (_dupExisting.has(`${baseSlug}-${n}`)) n++;
    newSlug = `${baseSlug}-${n}`;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const strip = (arr: any[]) => arr.map(({ id: _id, package_id: _pid, ...rest }: any) => ({ ...rest, package_id: newPkg.id }));

  if (pkg.daily_package_stops?.length) {
    const { error: es } = await supabase.from("daily_package_stops").insert(strip(pkg.daily_package_stops));
    if (es) return { error: `Stops copy failed: ${es.message}` };
  }
  if (pkg.daily_package_included?.length) {
    const { error: ei } = await supabase.from("daily_package_included").insert(strip(pkg.daily_package_included));
    if (ei) return { error: `Inclusions copy failed: ${ei.message}` };
  }
  if (pkg.daily_package_gallery?.length) {
    const { error: eg } = await supabase.from("daily_package_gallery").insert(strip(pkg.daily_package_gallery));
    if (eg) return { error: `Gallery copy failed: ${eg.message}` };
  }

  revalidateAll();
  return { newId: newPkg.id };
}
