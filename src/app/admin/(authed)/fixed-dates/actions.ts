"use server";
import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";

function revalidateAll(slug?: string) {
  revalidateTag(tags.premade.all(), "max");
  revalidateTag(tags.premade.slugs(), "max");
  if (slug) revalidateTag(tags.premade.bySlug(slug), "max");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

export async function reorderPremadePackages(orderedIds: string[]): Promise<{ error?: string }> {
  const supabase = db();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("premade_packages").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidateAll();
  return {};
}

export async function setPremadePublished(id: string, isPublished: boolean): Promise<{ error?: string }> {
  const supabase = db();
  const { error } = await supabase.from("premade_packages").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function deletePremadePackage(id: string): Promise<{ error?: string }> {
  const supabase = db();
  const { error } = await supabase.from("premade_packages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return {};
}

export async function duplicatePremadePackage(id: string): Promise<{ error?: string; newId?: string }> {
  const supabase = db();
  const { data: pkg, error: pkgErr } = await supabase
    .from("premade_packages")
    .select("*, premade_package_gallery(*)")
    .eq("id", id)
    .maybeSingle();
  if (pkgErr || !pkg) return { error: pkgErr?.message ?? "Not found" };

  const baseSlug = `${pkg.slug}-copy`;
  let newSlug = baseSlug; let n = 0;
  while (true) {
    const { data: ex } = await supabase.from("premade_packages").select("id").eq("slug", newSlug).maybeSingle();
    if (!ex) break;
    newSlug = `${baseSlug}-${++n}`;
  }

  const { data: newPkg, error: insertErr } = await supabase.from("premade_packages").insert({
    slug: newSlug, name: `${pkg.name} (Copy)`,
    start_date: pkg.start_date, end_date: pkg.end_date,
    destinations: pkg.destinations, short_description: pkg.short_description,
    hero_image: pkg.hero_image, card_image: pkg.card_image,
    accommodation_name: pkg.accommodation_name, accommodation_description: pkg.accommodation_description,
    accommodation_image_a: pkg.accommodation_image_a, accommodation_image_b: pkg.accommodation_image_b,
    vehicle_model: pkg.vehicle_model, vehicle_features: pkg.vehicle_features,
    is_published: false,
    sort_order: (pkg.sort_order ?? 0) + 1,
  }).select("id").single();
  if (insertErr || !newPkg) return { error: insertErr?.message ?? "Insert failed" };

  if (pkg.premade_package_gallery?.length) {
    await supabase.from("premade_package_gallery").insert(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pkg.premade_package_gallery.map(({ id: _id, package_id: _pid, ...rest }: any) => ({ ...rest, package_id: newPkg.id }))
    );
  }

  revalidateAll();
  return { newId: newPkg.id };
}
