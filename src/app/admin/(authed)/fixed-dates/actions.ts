"use server";
import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";

function revalidateAll(slug?: string) {
  updateTag(tags.premade.all());
  updateTag(tags.premade.slugs());
  updateTag(tags.premade.admin());
  if (slug) updateTag(tags.premade.bySlug(slug));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

/** A child row read back from Supabase, keyed by its own id and parent id. */
type ChildRow = { id: string; package_id: string } & Record<string, unknown>;

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

export async function reorderPremadePackages(orderedIds: string[]): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const updates = orderedIds.map((id, i) => ({ id, sort_order: i }));
  const { error } = await supabase.from("premade_packages").upsert(updates);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function setPremadePublished(id: string, isPublished: boolean): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { error } = await supabase.from("premade_packages").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function deletePremadePackage(id: string): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { error } = await supabase.from("premade_packages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function duplicatePremadePackage(id: string): Promise<{ error?: string; newId?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const { data: pkg, error: pkgErr } = await supabase
    .from("premade_packages")
    .select(
      "*, premade_package_gallery(*), premade_package_dates(*), premade_package_itinerary_days(*), premade_package_tiers(*), premade_package_inclusions(*)",
    )
    .eq("id", id)
    .maybeSingle();
  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Not found" };

  const baseSlug = `${pkg.slug}-copy`;
  const { data: _dupData } = await supabase.from("premade_packages").select("slug").like("slug", `${baseSlug}%`);
  const _dupExisting = new Set<string>((_dupData ?? []).map((r: { slug: string }) => r.slug));
  let newSlug = baseSlug;
  if (_dupExisting.has(baseSlug)) {
    let n = 1;
    while (_dupExisting.has(`${baseSlug}-${n}`)) n++;
    newSlug = `${baseSlug}-${n}`;
  }

  const { data: newPkg, error: insertErr } = await supabase.from("premade_packages").insert({
    slug: newSlug, name: `${pkg.name} (Copy)`,
    start_date: pkg.start_date, end_date: pkg.end_date,
    flexible_departure: pkg.flexible_departure ?? false,
    destinations: pkg.destinations, short_description: pkg.short_description,
    hero_image: pkg.hero_image, card_image: pkg.card_image,
    accommodation_name: pkg.accommodation_name, accommodation_description: pkg.accommodation_description,
    accommodation_image_a: pkg.accommodation_image_a, accommodation_image_b: pkg.accommodation_image_b,
    vehicle_model: pkg.vehicle_model, vehicle_features: pkg.vehicle_features,
    region: pkg.region, season: pkg.season, duration: pkg.duration,
    min_people: pkg.min_people, max_people: pkg.max_people,
    available_from: pkg.available_from, available_to: pkg.available_to,
    overview: pkg.overview, currency: pkg.currency,
    price_1_person: pkg.price_1_person, price_baby: pkg.price_baby,
    is_published: false,
    sort_order: (pkg.sort_order ?? 0) + 1,
  }).select("id").single();
  if (insertErr || !newPkg) return { error: insertErr?.message ?? "Insert failed" };

  const strip = (arr: ChildRow[]) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arr.map(({ id: _id, package_id: _pid, ...rest }) => ({ ...rest, package_id: newPkg.id }));

  const children: Array<[string, ChildRow[] | undefined, string]> = [
    ["premade_package_gallery", pkg.premade_package_gallery, "Gallery"],
    ["premade_package_dates", pkg.premade_package_dates, "Departure dates"],
    ["premade_package_itinerary_days", pkg.premade_package_itinerary_days, "Itinerary"],
    ["premade_package_tiers", pkg.premade_package_tiers, "Tiers"],
    ["premade_package_inclusions", pkg.premade_package_inclusions, "Inclusions"],
  ];
  for (const [table, rows, label] of children) {
    if (!rows?.length) continue;
    const { error: e } = await supabase.from(table).insert(strip(rows));
    if (e) return { error: `${label} copy failed: ${e.message}` };
  }

  revalidateAll();
  return { newId: newPkg.id };
}
