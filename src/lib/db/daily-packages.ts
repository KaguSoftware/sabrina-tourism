import { unstable_cache } from 'next/cache';
import { createAnonClient, createServiceClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

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
  stops: Array<{ time: string; place: string; description: string }>;
  included: string[];
  groupImages: string[];
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
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  daily_package_stops: Array<{ id: string; stop_time: string; place: string; description: string; sort_order: number }>;
  daily_package_included: Array<{ id: string; text: string; sort_order: number }>;
  daily_package_gallery: Array<{ id: string; url: string; sort_order: number }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortBy<T extends { sort_order: number }>(arr: T[]): T[] { return [...arr].sort((a, b) => a.sort_order - b.sort_order); }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assemble(row: any): DailyPackagePublic {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.tour_date,
    startTime: row.start_time,
    endTime: row.end_time,
    heroImage: row.hero_image,
    cardImage: row.card_image,
    vehicle: row.vehicle,
    driver: row.driver,
    price: row.price,
    currency: row.currency,
    shortDescription: row.short_description,
    region: row.region,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stops: sortBy(row.daily_package_stops ?? []).map((s: any) => ({ time: s.stop_time, place: s.place, description: s.description })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    included: sortBy(row.daily_package_included ?? []).map((i: any) => i.text),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupImages: sortBy(row.daily_package_gallery ?? []).map((g: any) => g.url),
  };
}

const SELECT = '*, daily_package_stops(*), daily_package_included(*), daily_package_gallery(*)';

async function _getAllDailyPackages({ publishedOnly = true } = {}): Promise<DailyPackagePublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('daily_packages').select(SELECT).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/daily] getAllDailyPackages:', error); return []; }
  return (data ?? []).map(assemble);
}

async function _getDailyPackageBySlug(slug: string): Promise<DailyPackagePublic | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase.from('daily_packages').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return assemble(data);
}

export async function getAllDailyPackages(opts?: { publishedOnly?: boolean }): Promise<DailyPackagePublic[]> {
  const publishedOnly = opts?.publishedOnly ?? true;
  return unstable_cache(
    () => _getAllDailyPackages({ publishedOnly }),
    ['daily:all', String(publishedOnly)],
    { tags: [tags.daily.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getDailyPackageBySlug(slug: string): Promise<DailyPackagePublic | null> {
  return unstable_cache(
    () => _getDailyPackageBySlug(slug),
    ['daily:bySlug', slug],
    { tags: [tags.daily.bySlug(slug), tags.daily.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getDailyPackageRawById(id: string): Promise<DailyPackageRaw | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('daily_packages').select(SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as DailyPackageRaw;
}

export async function getAdminDailyPackages(): Promise<Array<{ id: string; slug: string; name: string; region: string; isPublished: boolean; sortOrder: number }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('daily_packages').select('id,slug,name,region,is_published,sort_order').order('sort_order');
  if (error) { console.error('[db/daily] getAdminDailyPackages:', error); return []; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({ id: r.id, slug: r.slug, name: r.name, region: r.region, isPublished: r.is_published, sortOrder: r.sort_order }));
}
