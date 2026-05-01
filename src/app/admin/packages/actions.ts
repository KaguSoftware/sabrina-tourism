"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/packages");
  revalidatePath("/");
  revalidateTag("packages", "max");
}

// Supabase v2.105 requires index signatures on Row types for mutation generics.
// Our hand-written types don't have them, so we cast to any for write operations.
// Read operations remain typed via the Database generic.
async function db() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await createServerClient()) as any;
}

export async function reorderPackages(orderedIds: string[]): Promise<{ error?: string }> {
  const supabase = await db();

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("packages")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);

    if (error) return { error: error.message };
  }

  revalidateAll();
  return {};
}

export async function setFeatured(
  packageId: string,
  isFeatured: boolean,
): Promise<{ error?: string }> {
  const supabase = await db();

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
  const supabase = await db();

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
  const supabase = await db();

  const { error } = await supabase.from("packages").delete().eq("id", packageId);

  if (error) return { error: error.message };

  revalidateAll();
  return {};
}

export async function duplicatePackage(
  packageId: string,
): Promise<{ error?: string; newSlug?: string }> {
  const supabase = await db();

  const { data: pkg, error: pkgErr } = await supabase
    .from("packages")
    .select(`*, package_itinerary_days(*), package_tiers(*), package_gallery(*), package_inclusions(*)`)
    .eq("id", packageId)
    .maybeSingle();

  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Package not found" };

  const baseSlug = `${pkg.slug}-copy`;
  let newSlug = baseSlug;
  let attempt = 0;
  while (true) {
    const { data: existing } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", newSlug)
      .maybeSingle();
    if (!existing) break;
    attempt++;
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
    await supabase.from("package_itinerary_days").insert(
      pkg.package_itinerary_days.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
  }

  if (pkg.package_tiers?.length) {
    await supabase.from("package_tiers").insert(
      pkg.package_tiers.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
  }

  if (pkg.package_gallery?.length) {
    await supabase.from("package_gallery").insert(
      pkg.package_gallery.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
  }

  if (pkg.package_inclusions?.length) {
    await supabase.from("package_inclusions").insert(
      pkg.package_inclusions.map(({ id: _id, package_id: _pid, created_at: _ca, updated_at: _ua, ...rest }: Record<string, unknown>) => ({
        ...rest,
        package_id: newId,
      })),
    );
  }

  revalidateAll();
  return { newSlug };
}
