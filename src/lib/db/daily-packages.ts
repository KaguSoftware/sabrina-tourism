import { unstable_cache } from 'next/cache';
import { createAnonClient, createServiceClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface DailyInclusionItemPublic {
  text: string;
  icon: string | null;
}

export interface DailyPricingPublic {
  onePerson: number | null;
  twoPeople: number | null;
  baby: number | null;
  singleRoomSupplement?: number | null;
  pricePerChild?: number | null;
}

export interface DailyPackagePublic {
  id: string;
  slug: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  heroImage: string;
  cardImage: string;
  vehicle: string;
  driver: string;
  price: number;
  currency: string;
  shortDescription: string;
  region: string;
  season: string | null;
  stops: Array<{ time: string; place: string; description: string }>;
  included: DailyInclusionItemPublic[];
  notIncluded: DailyInclusionItemPublic[];
  groupImages: string[];
  pricing: DailyPricingPublic | null;
}

export interface DailyPackageRaw {
  id: string;
  slug: string;
  name: string;
  tour_date: string;
  start_time: string;
  end_time: string;
  hero_image: string;
  card_image: string;
  vehicle: string;
  driver: string;
  price: number;
  currency: string;
  short_description: string;
  region: string;
  season: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  price_1_person: number | null;
  price_2_people: number | null;
  price_baby: number | null;
  price_single_room_supplement: number | null;
  price_per_child: number | null;
  daily_package_stops: Array<{ id: string; stop_time: string; place: string; description: string; sort_order: number }>;
  daily_package_included: Array<{ id: string; text: string; icon: string | null; sort_order: number }>;
  daily_package_not_included: Array<{ id: string; package_id?: string; text: string; icon: string | null; text_translations?: unknown; sort_order: number }>;
  daily_package_gallery: Array<{ id: string; url: string; sort_order: number }>;
}

function sortBy<T extends { sort_order: number }>(arr: T[]): T[] { return [...arr].sort((a, b) => a.sort_order - b.sort_order); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tr(translations: any, locale: string, fallback: string): string {
  if (!locale || locale === 'en') return fallback;
  return translations?.[locale] || fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assemble(row: any, locale = 'en'): DailyPackagePublic {
  return {
    id: row.id,
    slug: row.slug,
    name: tr(row.name_translations, locale, row.name),
    date: row.tour_date,
    startTime: row.start_time,
    endTime: row.end_time,
    heroImage: row.hero_image,
    cardImage: row.card_image,
    vehicle: row.vehicle,
    driver: row.driver,
    price: row.price,
    currency: row.currency,
    shortDescription: tr(row.short_description_translations, locale, row.short_description),
    region: row.region,
    season: row.season ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stops: sortBy(row.daily_package_stops ?? []).map((s: any) => ({
      time: s.stop_time,
      place: tr(s.place_translations, locale, s.place),
      description: tr(s.description_translations, locale, s.description),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    included: sortBy(row.daily_package_included ?? []).map((i: any) => ({
      text: tr(i.text_translations, locale, i.text),
      icon: i.icon ?? null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notIncluded: sortBy(row.daily_package_not_included ?? []).map((i: any) => ({
      text: tr(i.text_translations, locale, i.text),
      icon: i.icon ?? null,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupImages: sortBy(row.daily_package_gallery ?? []).map((g: any) => g.url),
    pricing: (row.price_1_person ?? row.price_2_people ?? row.price_baby ?? row.price_single_room_supplement ?? row.price_per_child) != null ? {
      onePerson: row.price_1_person ?? null,
      twoPeople: row.price_2_people ?? null,
      baby: row.price_baby ?? null,
      singleRoomSupplement: row.price_single_room_supplement ?? null,
      pricePerChild: row.price_per_child ?? null,
    } : null,
  };
}

const SELECT = '*, name_translations, short_description_translations, daily_package_stops(*, place_translations, description_translations), daily_package_included(*, text_translations), daily_package_gallery(*)';

async function fetchNotIncludedByPackageIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  packageIds: string[],
): Promise<Map<string, DailyPackageRaw['daily_package_not_included']>> {
  const ids = Array.from(new Set(packageIds.filter(Boolean)));
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase
    .from('daily_package_not_included')
    .select('id, package_id, text, icon, text_translations, sort_order')
    .in('package_id', ids)
    .order('sort_order');
  if (error || !data) return new Map();
  const grouped = new Map<string, DailyPackageRaw['daily_package_not_included']>();
  for (const item of data as DailyPackageRaw['daily_package_not_included']) {
    if (!item.package_id) continue;
    grouped.set(item.package_id, [...(grouped.get(item.package_id) ?? []), item]);
  }
  return grouped;
}

async function _getAllDailyPackages({ publishedOnly = true, locale = 'en' } = {}): Promise<DailyPackagePublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('daily_packages').select(SELECT).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/daily] getAllDailyPackages:', error); return []; }
  const notIncludedById = await fetchNotIncludedByPackageIds(supabase, (data ?? []).map((row: { id: string }) => row.id));
  return (data ?? []).map((row: DailyPackageRaw) => assemble({ ...row, daily_package_not_included: notIncludedById.get(row.id) ?? [] }, locale));
}

async function _getDailyPackageBySlug(slug: string, locale = 'en'): Promise<DailyPackagePublic | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase.from('daily_packages').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  const notIncludedById = await fetchNotIncludedByPackageIds(supabase, [data.id]);
  return assemble({ ...data, daily_package_not_included: notIncludedById.get(data.id) ?? [] }, locale);
}

export async function getAllDailyPackages(opts?: { publishedOnly?: boolean; locale?: string }): Promise<DailyPackagePublic[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  const locale = opts?.locale ?? 'en';
  return unstable_cache(
    () => _getAllDailyPackages({ publishedOnly, locale }),
    ['daily:all', String(publishedOnly), locale],
    { tags: [tags.daily.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getDailyPackageBySlug(slug: string, locale = 'en'): Promise<DailyPackagePublic | null> {
  return unstable_cache(
    () => _getDailyPackageBySlug(slug, locale),
    ['daily:bySlug', slug, locale],
    { tags: [tags.daily.bySlug(slug), tags.daily.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getDailyPackageRawById(id: string): Promise<DailyPackageRaw | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('daily_packages').select(SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  const notIncludedById = await fetchNotIncludedByPackageIds(supabase, [id]);
  return { ...data, daily_package_not_included: notIncludedById.get(id) ?? [] } as DailyPackageRaw;
}

export async function getAdminDailyPackages(): Promise<Array<{ id: string; slug: string; name: string; region: string; isPublished: boolean; sortOrder: number }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('daily_packages').select('id,slug,name,region,is_published,sort_order').order('sort_order');
  if (error) { console.error('[db/daily] getAdminDailyPackages:', error); return []; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({ id: r.id, slug: r.slug, name: r.name, region: r.region, isPublished: r.is_published, sortOrder: r.sort_order }));
}
