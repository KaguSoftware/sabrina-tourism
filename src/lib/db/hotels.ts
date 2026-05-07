import { createAnonClient, createServiceClient } from '@/lib/supabase/server';

export interface HotelRow {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
  long_description: string;
  tag_a: string;
  tag_b: string;
  svg_variant: string;
  location: string;
  bedroom_image: string;
  check_in_time: string;
  check_out_time: string;
  languages: string[];
  distance_km: number;
  bedrooms: number;
  bathrooms: number;
  free_wifi: boolean;
  free_cancellation: boolean;
  free_parking: boolean;
  bed_breakfast: boolean;
  balcony: boolean;
  washer: boolean;
  ac: boolean;
  tv: boolean;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  hotel_amenities: Array<{ id: string; text: string; is_property: boolean; sort_order: number }>;
  hotel_room_types: Array<{ id: string; name: string; capacity: number; beds: string; size: string; image_index: number; highlights: string[]; sort_order: number }>;
  hotel_images: Array<{ id: string; url: string; label: string; sort_order: number }>;
}

export type HotelPublic = {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
  longDescription: string;
  tags: [string, string];
  svgVariant: string;
  location: string;
  bedroomImage: string;
  checkInTime: string;
  checkOutTime: string;
  languages: string[];
  distanceKm: number;
  bedrooms: number;
  bathrooms: number;
  freeWifi: boolean;
  freeCancellation: boolean;
  freeParking: boolean;
  bedBreakfast: boolean;
  balcony: boolean;
  washer: boolean;
  ac: boolean;
  tv: boolean;
  amenities: string[];
  roomTypes: Array<{ id: string; name: string; capacity: number; beds: string; size: string; imageIndex: number; highlights: string[] }>;
  images: string[];
};

function assembleHotel(row: HotelRow): HotelPublic {
  const sorted = <T extends { sort_order: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    region: row.region,
    description: row.description,
    longDescription: row.long_description,
    tags: [row.tag_a, row.tag_b],
    svgVariant: row.svg_variant,
    location: row.location,
    bedroomImage: row.bedroom_image,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    languages: row.languages ?? [],
    distanceKm: row.distance_km,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    freeWifi: row.free_wifi,
    freeCancellation: row.free_cancellation,
    freeParking: row.free_parking,
    bedBreakfast: row.bed_breakfast,
    balcony: row.balcony,
    washer: row.washer,
    ac: row.ac,
    tv: row.tv,
    amenities: sorted(row.hotel_amenities ?? []).map((a) => a.text),
    roomTypes: sorted(row.hotel_room_types ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity,
      beds: r.beds,
      size: r.size,
      imageIndex: r.image_index,
      highlights: r.highlights ?? [],
    })),
    images: sorted(row.hotel_images ?? []).map((i) => i.url),
  };
}

const SELECT = `
  *,
  hotel_amenities(*),
  hotel_room_types(*),
  hotel_images(*)
`;

export async function getAllHotels({ publishedOnly = true } = {}): Promise<HotelPublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('hotels').select(SELECT).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/hotels] getAllHotels:', error); return []; }
  return (data ?? []).map(assembleHotel);
}

export async function getHotelsByRegion(region: string, { publishedOnly = true } = {}): Promise<HotelPublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('hotels').select(SELECT).eq('region', region).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/hotels] getHotelsByRegion:', error); return []; }
  return (data ?? []).map(assembleHotel);
}

export async function getHotelBySlug(slug: string): Promise<HotelPublic | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase.from('hotels').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return assembleHotel(data);
}

export async function getHotelRawById(id: string): Promise<HotelRow | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('hotels').select(SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as HotelRow;
}

export async function getAdminHotels(): Promise<Array<{ id: string; slug: string; name: string; region: string; isPublished: boolean; sortOrder: number }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('hotels').select('id,slug,name,region,is_published,sort_order').order('sort_order');
  if (error) { console.error('[db/hotels] getAdminHotels:', error); return []; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({ id: r.id, slug: r.slug, name: r.name, region: r.region, isPublished: r.is_published, sortOrder: r.sort_order }));
}
