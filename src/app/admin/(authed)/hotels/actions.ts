"use server";
import { updateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { REGIONS } from "@/lib/packages/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any { return createServiceClient(); }

function revalidateAll(regions?: ReadonlyArray<string | null | undefined>) {
  updateTag(tags.hotels.all());
  updateTag(tags.hotels.featured());
  const seen = new Set<string>();
  for (const r of regions ?? []) {
    if (r && !seen.has(r)) {
      seen.add(r);
      updateTag(tags.hotels.byRegion(r));
    }
  }
}

function revalidateAllRegions() {
  revalidateAll(REGIONS);
}

export async function reorderHotels(orderedIds: string[]): Promise<{ error?: string }> {
  const supabase = db();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("hotels").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidateAllRegions();
  return {};
}

export async function setHotelPublished(id: string, isPublished: boolean): Promise<{ error?: string }> {
  const supabase = db();
  const { data: prev } = await supabase.from("hotels").select("region").eq("id", id).maybeSingle();
  const { error } = await supabase.from("hotels").update({ is_published: isPublished }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll([prev?.region]);
  return {};
}

export async function deleteHotel(id: string): Promise<{ error?: string }> {
  const supabase = db();
  const { data: prev } = await supabase.from("hotels").select("region").eq("id", id).maybeSingle();
  const { error } = await supabase.from("hotels").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll([prev?.region]);
  return {};
}

export async function duplicateHotel(id: string): Promise<{ error?: string; newId?: string }> {
  const supabase = db();
  const { data: h, error: e } = await supabase
    .from("hotels")
    .select("*, hotel_amenities(*), hotel_room_types(*), hotel_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (e || !h) return { error: e?.message ?? "Not found" };

  const baseSlug = `${h.slug}-copy`;
  let slug = baseSlug; let n = 0;
  while (true) {
    const { data: ex } = await supabase.from("hotels").select("id").eq("slug", slug).maybeSingle();
    if (!ex) break;
    slug = `${baseSlug}-${++n}`;
  }

  const { data: newH, error: ie } = await supabase.from("hotels").insert({
    ...h, id: undefined, slug, name: `${h.name} (Copy)`, is_published: false, sort_order: (h.sort_order ?? 0) + 1,
    created_at: undefined, updated_at: undefined,
  }).select("id").single();
  if (ie || !newH) return { error: ie?.message ?? "Insert failed" };

  const newId = newH.id;
  const strip = ({ id: _id, hotel_id: _hid, created_at: _ca, ...rest }: Record<string, unknown>) => rest;
  if (h.hotel_amenities?.length) await supabase.from("hotel_amenities").insert(h.hotel_amenities.map((r: Record<string, unknown>) => ({ ...strip(r), hotel_id: newId })));
  if (h.hotel_room_types?.length) await supabase.from("hotel_room_types").insert(h.hotel_room_types.map((r: Record<string, unknown>) => ({ ...strip(r), hotel_id: newId, updated_at: undefined })));
  if (h.hotel_images?.length) await supabase.from("hotel_images").insert(h.hotel_images.map((r: Record<string, unknown>) => ({ ...strip(r), hotel_id: newId })));

  revalidateAll([h.region]);
  return { newId };
}
