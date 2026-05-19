"use server";

import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

function revalidateAll() {
  updateTag(tags.packages.all());
  updateTag(tags.packages.slugs());
  updateTag(tags.packages.featured());
  updateTag(tags.packages.admin());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  return createServiceClient();
}

export async function reorderPackages(orderedIds: string[]): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();
  const updates = orderedIds.map((id, i) => ({ id, sort_order: i }));
  const { error } = await supabase.from("packages").upsert(updates);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function setFeatured(
  packageId: string,
  isFeatured: boolean,
): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();

  const { error } = await supabase
    .from("packages")
    .update({ is_featured: isFeatured })
    .eq("id", packageId);

  if (error) {
    if (error.message.includes("3") || error.code === "P0001") {
      return { error: "Maximum 3 featured packages. Unfeature another first." };
    }
    return { error: error.message };
  }

  revalidateAll();
  return {};
}

export async function setPublished(
  packageId: string,
  isPublished: boolean,
): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();

  const update: Record<string, boolean> = { is_published: isPublished };
  if (!isPublished) {
    update.is_featured = false;
  }

  const { error } = await supabase
    .from("packages")
    .update(update)
    .eq("id", packageId);

  if (error) return { error: error.message };

  revalidateAll();
  return {};
}

export async function deletePackage(packageId: string): Promise<{ error?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();

  const { error } = await supabase.from("packages").delete().eq("id", packageId);

  if (error) return { error: error.message };

  revalidateAll();
  return {};
}

export async function duplicatePackage(
  packageId: string,
): Promise<{ error?: string; newSlug?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const supabase = db();

  const { data: pkg, error: pkgErr } = await supabase
    .from("packages")
    .select(`*, package_itinerary_days(*), package_tiers(*), package_gallery(*), package_inclusions(*)`)
    .eq("id", packageId)
    .maybeSingle();

  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Package not found" };

  const baseSlug = `${pkg.slug}-copy`;
  const { data: _dupData } = await supabase.from("packages").select("slug").like("slug", `${baseSlug}%`);
  const _dupExisting = new Set<string>((_dupData ?? []).map((r: { slug: string }) => r.slug));
  let newSlug = baseSlug;
  if (_dupExisting.has(baseSlug)) {
    let attempt = 1;
    while (_dupExisting.has(`${baseSlug}-${attempt}`)) attempt++;
    newSlug = `${baseSlug}-${attempt}`;
  }

  const { data: newPkg, error: insertErr } = await supabase
    .from("packages")
    .insert({
      slug: newSlug,
      name: `${pkg.name} (Copy)`,
      region: pkg.region,
      duration: pkg.duration,
      duration_days: pkg.duration_days,
      short_description: pkg.short_description,
      overview: pkg.overview,
      hero_image: pkg.hero_image,
      card_image: pkg.card_image,
      min_people: pkg.min_people,
      max_people: pkg.max_people,
      available_from: pkg.available_from,
      available_to: pkg.available_to,
      is_published: false,
      is_featured: false,
      sort_order: (pkg.sort_order ?? 0) + 1,
    })
    .select("id")
    .single();

  if (insertErr || !newPkg) return { error: insertErr?.message ?? "Insert failed" };

  const newId = newPkg.id;

  if (pkg.package_itinerary_days?.length) {
    const { error: e1 } = await supabase.from("package_itinerary_days").insert(
      pkg.package_itinerary_days.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
    if (e1) return { error: `Itinerary copy failed: ${e1.message}` };
  }

  if (pkg.package_tiers?.length) {
    const { error: e2 } = await supabase.from("package_tiers").insert(
      pkg.package_tiers.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
    if (e2) return { error: `Tiers copy failed: ${e2.message}` };
  }

  if (pkg.package_gallery?.length) {
    const { error: e3 } = await supabase.from("package_gallery").insert(
      pkg.package_gallery.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
    if (e3) return { error: `Gallery copy failed: ${e3.message}` };
  }

  if (pkg.package_inclusions?.length) {
    const { error: e4 } = await supabase.from("package_inclusions").insert(
      pkg.package_inclusions.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
    if (e4) return { error: `Inclusions copy failed: ${e4.message}` };
  }

  revalidateAll();
  return { newSlug };
}
