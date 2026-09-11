"use server";
import { updateTag } from "next/cache";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { HotelSchema, type HotelFormValues } from "./schema";
import { replaceChildren } from "@/lib/admin/replace-children";

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findUniqueSlug(supabase: any, table: string, baseSlug: string, excludeId?: string): Promise<string> {
  const query = supabase.from(table).select("slug").like("slug", `${baseSlug}%`);
  const { data } = excludeId ? await query.neq("id", excludeId) : await query;
  const existing = new Set<string>((data ?? []).map((r: { slug: string }) => r.slug));
  if (!existing.has(baseSlug)) return baseSlug;
  let n = 2;
  while (existing.has(`${baseSlug}-${n}`)) n++;
  return `${baseSlug}-${n}`;
}

function revalidateAll(slug?: string, regions?: ReadonlyArray<string | null | undefined>) {
  updateTag(tags.hotels.admin());
  updateTag(tags.hotels.all());
  updateTag(tags.hotels.featured());
  if (slug) updateTag(tags.hotels.bySlug(slug));
  const seen = new Set<string>();
  for (const r of regions ?? []) {
    if (r && !seen.has(r)) {
      seen.add(r);
      updateTag(tags.hotels.byRegion(r));
    }
  }
}

export async function saveHotel(payload: HotelFormValues): Promise<{ error?: string; id?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
  const parsed = HotelSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  const data = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;

  let slug = slugify(data.name);
  if (!slug) return { error: "Name produces an empty slug." };

  let hotelId = data.id;
  let previousRegion: string | null = null;

  if (hotelId) {
    // Read previous region so we can invalidate the old region tag if it changed
    const { data: prev } = await supabase
      .from("hotels")
      .select("region")
      .eq("id", hotelId)
      .maybeSingle();
    previousRegion = prev?.region ?? null;

    // UPDATE
    const { error } = await supabase.from("hotels").update({
      name: data.name, region: data.region, description: data.description,
      long_description: data.long_description, tag_a: data.tag_a, tag_b: data.tag_b,
      stars: data.stars,
      svg_variant: data.svg_variant, location: data.location,
      check_in_time: data.check_in_time, check_out_time: data.check_out_time,
      languages: data.languages, distance_km: data.distance_km,
      bedrooms: data.bedrooms, bathrooms: data.bathrooms,
      free_wifi: data.free_wifi, free_cancellation: data.free_cancellation,
      free_parking: data.free_parking, bed_breakfast: data.bed_breakfast,
      balcony: data.balcony, washer: data.washer, ac: data.ac, tv: data.tv,
      is_published: data.is_published,
    }).eq("id", hotelId);
    if (error) return { error: error.message };
  } else {
    // INSERT — ensure slug uniqueness with a single LIKE query
    slug = await findUniqueSlug(supabase, "hotels", slug);
    const { data: newH, error } = await supabase.from("hotels").insert({
      slug, name: data.name, region: data.region, description: data.description,
      long_description: data.long_description, tag_a: data.tag_a, tag_b: data.tag_b,
      stars: data.stars,
      svg_variant: data.svg_variant, location: data.location,
      check_in_time: data.check_in_time, check_out_time: data.check_out_time,
      languages: data.languages, distance_km: data.distance_km,
      bedrooms: data.bedrooms, bathrooms: data.bathrooms,
      free_wifi: data.free_wifi, free_cancellation: data.free_cancellation,
      free_parking: data.free_parking, bed_breakfast: data.bed_breakfast,
      balcony: data.balcony, washer: data.washer, ac: data.ac, tv: data.tv,
      is_published: data.is_published,
      sort_order: (await supabase.from("hotels").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()).data?.sort_order + 1 || 0,
    }).select("id").single();
    if (error || !newH) return { error: error?.message ?? "Insert failed" };
    hotelId = newH.id;
  }
  if (!hotelId) return { error: "Save failed — no hotel id" };

  // Every child table is replaced wholesale. replaceChildren inserts before it
  // deletes and reports failures, so a bad write can no longer wipe a hotel's
  // rooms or amenities while the editor claims the save succeeded.
  // Translations live on the child rows, so carry them across by position.

  const { data: existingAmenities } = await supabase
    .from("hotel_amenities")
    .select("sort_order, text_translations")
    .eq("hotel_id", hotelId)
    .order("sort_order");
  const amenityRows = data.amenities.map((a, i) => ({
    hotel_id: hotelId,
    text: a.text,
    is_property: false,
    sort_order: i,
    text_translations: existingAmenities?.[i]?.text_translations ?? {},
  }));

  const { data: existingRoomTypes } = await supabase
    .from("hotel_room_types")
    .select("sort_order, name_translations, beds_translations, size_translations, highlights_translations")
    .eq("hotel_id", hotelId)
    .order("sort_order");
  const roomTypeRows = data.room_types.map((r, i) => ({
    hotel_id: hotelId, name: r.name, capacity: r.capacity, beds: r.beds,
    size: r.size, image_index: r.image_index, highlights: r.highlights, sort_order: i,
    name_translations: existingRoomTypes?.[i]?.name_translations ?? {},
    beds_translations: existingRoomTypes?.[i]?.beds_translations ?? {},
    size_translations: existingRoomTypes?.[i]?.size_translations ?? {},
    highlights_translations: existingRoomTypes?.[i]?.highlights_translations ?? {},
  }));

  const imageRows = data.images
    .filter((img) => img.url.trim())
    .map((img, i) => ({ hotel_id: hotelId, url: img.url.trim(), label: img.label, sort_order: i }));

  const children: Array<[string, Record<string, unknown>[], string]> = [
    ["hotel_amenities", amenityRows, "Amenities"],
    ["hotel_room_types", roomTypeRows, "Room types"],
    ["hotel_images", imageRows, "Images"],
  ];
  for (const [table, rows, label] of children) {
    const { error } = await replaceChildren(supabase, table, "hotel_id", hotelId, rows, label);
    if (error) return { error };
  }

  revalidateAll(slug, [data.region, previousRegion]);
  return { id: hotelId };
}
