import { unstable_cache } from 'next/cache';
import { createAnonClient, createServiceClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface HotelRow {
  id: string;
  slug: string;
  name: string;
  name_translations: Record<string, string>;
  region: string;
  description: string;
  description_translations: Record<string, string>;
  long_description: string;
  long_description_translations: Record<string, string>;
  tag_a: string;
  tag_a_translations: Record<string, string>;
  tag_b: string;
  tag_b_translations: Record<string, string>;
  location: string;
  location_translations: Record<string, string>;
  stars: number;
  svg_variant: string;
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
  hotel_amenities: Array<{ id: string; text: string; text_translations: Record<string, string>; is_property: boolean; sort_order: number }>;
  hotel_room_types: Array<{ id: string; name: string; name_translations: Record<string, string>; capacity: number; beds: string; beds_translations: Record<string, string>; size: string; size_translations: Record<string, string>; image_index: number; highlights: string[]; sort_order: number }>;
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
  stars: number;
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

function tr(translations: Record<string, string> | null | undefined, locale: string, fallback: string): string {
  if (!locale || locale === 'en' || !translations) return fallback;
  return translations[locale] || fallback;
}

function assembleHotel(row: HotelRow, locale = 'en'): HotelPublic {
  const sorted = <T extends { sort_order: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: row.id,
    slug: row.slug,
    name: tr(row.name_translations, locale, row.name),
    region: row.region,
    description: tr(row.description_translations, locale, row.description),
    longDescription: tr(row.long_description_translations, locale, row.long_description),
    tags: [tr(row.tag_a_translations, locale, row.tag_a), tr(row.tag_b_translations, locale, row.tag_b)],
    stars: row.stars ?? 0,
    svgVariant: row.svg_variant,
    location: tr(row.location_translations, locale, row.location),
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
    amenities: sorted(row.hotel_amenities ?? []).map((a) => tr(a.text_translations, locale, a.text)),
    roomTypes: sorted(row.hotel_room_types ?? []).map((r) => ({
      id: r.id,
      name: tr(r.name_translations, locale, r.name),
      capacity: r.capacity,
      beds: tr(r.beds_translations, locale, r.beds),
      size: tr(r.size_translations, locale, r.size),
      imageIndex: r.image_index,
      highlights: r.highlights ?? [],
    })),
    images: sorted(row.hotel_images ?? []).map((i) => i.url),
  };
}

const SELECT = `
  *, name_translations, description_translations, long_description_translations,
  tag_a_translations, tag_b_translations, location_translations,
  hotel_amenities(*, text_translations),
  hotel_room_types(*, name_translations, beds_translations, size_translations),
  hotel_images(*)
`;

async function _getAllHotels({ publishedOnly = true, locale = 'en' } = {}): Promise<HotelPublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('hotels').select(SELECT).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/hotels] getAllHotels:', error); return []; }
  return (data ?? []).map((row: HotelRow) => assembleHotel(row, locale));
}

async function _getHotelsByRegion(region: string, { publishedOnly = true, locale = 'en' } = {}): Promise<HotelPublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('hotels').select(SELECT).eq('region', region).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/hotels] getHotelsByRegion:', error); return []; }
  return (data ?? []).map((row: HotelRow) => assembleHotel(row, locale));
}

async function _getHotelBySlug(slug: string, locale = 'en'): Promise<HotelPublic | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase.from('hotels').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return assembleHotel(data, locale);
}

export async function getAllHotels(opts?: { publishedOnly?: boolean; locale?: string }): Promise<HotelPublic[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  const locale = opts?.locale ?? 'en';
  return unstable_cache(
    () => _getAllHotels({ publishedOnly, locale }),
    ['hotels:all', String(publishedOnly), locale],
    { tags: [tags.hotels.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getHotelsByRegion(region: string, opts?: { publishedOnly?: boolean; locale?: string }): Promise<HotelPublic[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  const locale = opts?.locale ?? 'en';
  return unstable_cache(
    () => _getHotelsByRegion(region, { publishedOnly, locale }),
    ['hotels:byRegion', region, String(publishedOnly), locale],
    { tags: [tags.hotels.byRegion(region), tags.hotels.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getHotelBySlug(slug: string, locale = 'en'): Promise<HotelPublic | null> {
  return unstable_cache(
    () => _getHotelBySlug(slug, locale),
    ['hotels:bySlug', slug, locale],
    { tags: [tags.hotels.bySlug(slug), tags.hotels.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getHotelRawById(id: string): Promise<HotelRow | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('hotels').select(SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as HotelRow;
}

async function _getFeaturedHotels(locale = 'en'): Promise<HotelPublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase
    .from('hotels')
    .select(SELECT)
    .eq('is_published', true)
    .order('sort_order')
    .limit(3);
  if (error) { console.error('[db/hotels] getFeaturedHotels:', error); return []; }
  return (data ?? []).map((row: HotelRow) => assembleHotel(row, locale));
}

export async function getFeaturedHotels(locale = 'en'): Promise<HotelPublic[]> {
  return unstable_cache(
    () => _getFeaturedHotels(locale),
    ['hotels:featured', locale],
    { tags: [tags.hotels.featured(), tags.hotels.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getAdminHotels(): Promise<Array<{ id: string; slug: string; name: string; region: string; isPublished: boolean; sortOrder: number }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('hotels').select('id,slug,name,region,is_published,sort_order').order('sort_order');
  if (error) { console.error('[db/hotels] getAdminHotels:', error); return []; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({ id: r.id, slug: r.slug, name: r.name, region: r.region, isPublished: r.is_published, sortOrder: r.sort_order }));
}
