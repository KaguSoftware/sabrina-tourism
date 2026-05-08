"use server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { HotelSchema, type HotelFormValues } from "./schema";

function revalidateAll(slug?: string) {
  revalidatePath("/regions");
  if (slug) revalidatePath(`/regions/${slug}`);
  revalidatePath("/");
}

export async function saveHotel(payload: HotelFormValues): Promise<{ error?: string; id?: string }> {
  const parsed = HotelSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  const data = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;

  let slug = slugify(data.name);
  if (!slug) return { error: "Name produces an empty slug." };

  let hotelId = data.id;

  if (hotelId) {
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
    // INSERT — ensure slug uniqueness
    let candidate = slug; let n = 2;
    while (true) {
      const { data: ex } = await supabase.from("hotels").select("id").eq("slug", candidate).maybeSingle();
      if (!ex) { slug = candidate; break; }
      candidate = `${slug}-${n++}`;
    }
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

  // Replace amenities
  await supabase.from("hotel_amenities").delete().eq("hotel_id", hotelId);
  if (data.amenities.length) {
    await supabase.from("hotel_amenities").insert(data.amenities.map((a, i) => ({ hotel_id: hotelId, text: a.text, is_property: false, sort_order: i })));
  }

  // Replace room types
  await supabase.from("hotel_room_types").delete().eq("hotel_id", hotelId);
  if (data.room_types.length) {
    await supabase.from("hotel_room_types").insert(data.room_types.map((r, i) => ({
      hotel_id: hotelId, name: r.name, capacity: r.capacity, beds: r.beds,
      size: r.size, image_index: r.image_index, highlights: r.highlights, sort_order: i,
    })));
  }

  // Replace images
  await supabase.from("hotel_images").delete().eq("hotel_id", hotelId);
  if (data.images.length) {
    await supabase.from("hotel_images").insert(data.images.map((img, i) => ({ hotel_id: hotelId, url: img.url, label: img.label, sort_order: i })));
  }

  revalidateAll(slug);
  return { id: hotelId };
}
