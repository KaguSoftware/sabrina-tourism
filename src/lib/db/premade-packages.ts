import { unstable_cache } from 'next/cache';
import { createAnonClient, createServiceClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface PremadeTierPublic {
  name: string;
  vehicleClass: string;
  accommodation: string;
  groupSize: string;
  guideLanguages: string[];
  mealsIncluded: string;
  highlights: string[];
}

export interface PremadeItineraryDayPublic {
  day: number;
  title: string;
  description: string;
}

export interface PremadePackagePublic {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  heroImage: string;
  cardImage: string;
  shortDescription: string;
  accommodation: { name: string; description: string; images: [string, string] };
  vehicle: { model: string; features: string[] };
  gallery: string[];
  dates: Array<{ startDate: string; endDate: string }>;
  // Rich fields
  region: string | null;
  duration: string | null;
  minPeople: number | null;
  maxPeople: number | null;
  availableFrom: string | null;
  availableTo: string | null;
  overview: string[] | null;
  tiers: PremadeTierPublic[];
  itinerary: PremadeItineraryDayPublic[];
  included: string[];
  notIncluded: string[];
  price: number | null;
  currency: string;
}

export interface PremadePackageRaw {
  id: string;
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  destinations: string[];
  hero_image: string;
  card_image: string;
  short_description: string;
  accommodation_name: string;
  accommodation_description: string;
  accommodation_image_a: string;
  accommodation_image_b: string;
  vehicle_model: string;
  vehicle_features: string[];
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  region: string | null;
  duration: string | null;
  min_people: number | null;
  max_people: number | null;
  available_from: string | null;
  available_to: string | null;
  overview: string | null;
  price: number | null;
  currency: string | null;
  premade_package_gallery: Array<{ id: string; url: string; sort_order: number }>;
  premade_package_dates: Array<{ id: string; start_date: string; end_date: string; sort_order: number }>;
  premade_package_itinerary_days: Array<{ id: string; day_number: number; title: string; description: string; sort_order: number }>;
  premade_package_tiers: Array<{ id: string; tier_name: string; vehicle_class: string; accommodation: string; group_size: string; guide_languages: string[]; meals_included: string; highlights: string[]; sort_order: number }>;
  premade_package_inclusions: Array<{ id: string; kind: string; text: string; sort_order: number }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function byOrder(arr: any[]): any[] {
  return [...arr].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

// Pick translated value or fall back to the English original
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function t(translations: any, locale: string, fallback: string): string {
  if (!locale || locale === 'en') return fallback;
  return translations?.[locale] || fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assemble(row: any, locale = 'en'): PremadePackagePublic {
  const gallery = byOrder(row.premade_package_gallery ?? []).map((g: { url: string }) => g.url);
  const dates = byOrder(row.premade_package_dates ?? []).map((d: { start_date: string; end_date: string }) => ({ startDate: d.start_date, endDate: d.end_date }));
  const itinerary = byOrder(row.premade_package_itinerary_days ?? []).map((d: { day_number: number; title: string; description: string; title_translations: unknown; description_translations: unknown }) => ({
    day: d.day_number,
    title: t(d.title_translations, locale, d.title),
    description: t(d.description_translations, locale, d.description),
  }));
  const tiers = byOrder(row.premade_package_tiers ?? []).map((tier: { tier_name: string; vehicle_class: string; accommodation: string; group_size: string; guide_languages: string[]; meals_included: string; highlights: string[]; highlights_translations: unknown }) => ({
    name: tier.tier_name,
    vehicleClass: tier.vehicle_class,
    accommodation: tier.accommodation,
    groupSize: tier.group_size,
    guideLanguages: tier.guide_languages ?? [],
    mealsIncluded: tier.meals_included,
    highlights: locale !== 'en' && tier.highlights_translations
      ? (t(tier.highlights_translations, locale, '') || '').split('\n').filter(Boolean)
      : tier.highlights ?? [],
  }));
  const inclusions = byOrder(row.premade_package_inclusions ?? []);
  const included = inclusions
    .filter((i: { kind: string }) => i.kind === 'included')
    .map((i: { text: string; text_translations: unknown }) => t(i.text_translations, locale, i.text));
  const notIncluded = inclusions
    .filter((i: { kind: string }) => i.kind === 'not_included')
    .map((i: { text: string; text_translations: unknown }) => t(i.text_translations, locale, i.text));

  const overviewEn = row.overview ? row.overview.split('\n').filter(Boolean) : null;
  const overviewTranslated = locale !== 'en' && row.overview_translations?.[locale]
    ? row.overview_translations[locale].split('\n').filter(Boolean)
    : null;

  return {
    id: row.id,
    slug: row.slug,
    name: t(row.name_translations, locale, row.name),
    startDate: row.start_date,
    endDate: row.end_date,
    destinations: row.destinations ?? [],
    heroImage: row.hero_image,
    cardImage: row.card_image,
    shortDescription: t(row.short_description_translations, locale, row.short_description),
    accommodation: {
      name: t(row.accommodation_name_translations, locale, row.accommodation_name),
      description: t(row.accommodation_description_translations, locale, row.accommodation_description),
      images: [row.accommodation_image_a, row.accommodation_image_b],
    },
    vehicle: { model: row.vehicle_model, features: row.vehicle_features ?? [] },
    gallery,
    dates,
    region: row.region ?? null,
    duration: row.duration ?? null,
    minPeople: row.min_people ?? null,
    maxPeople: row.max_people ?? null,
    availableFrom: row.available_from ?? null,
    availableTo: row.available_to ?? null,
    overview: overviewTranslated ?? overviewEn,
    price: row.price ?? null,
    currency: row.currency ?? 'USD',
    tiers,
    itinerary,
    included,
    notIncluded,
  };
}

const SELECT = '*, name_translations, short_description_translations, overview_translations, accommodation_name_translations, accommodation_description_translations, premade_package_gallery(*), premade_package_dates(*), premade_package_itinerary_days(*), premade_package_tiers(*), premade_package_inclusions(*)';

async function _getAllPremadePackages({ publishedOnly = true, locale = 'en' } = {}): Promise<PremadePackagePublic[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  let q = supabase.from('premade_packages').select(SELECT).order('sort_order');
  if (publishedOnly) q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) { console.error('[db/premade] getAllPremadePackages:', error.message, error.code, error.details, error.hint); return []; }
  return (data ?? []).map((row: unknown) => assemble(row, locale));
}

async function _getPremadePackageBySlug(slug: string, locale = 'en'): Promise<PremadePackagePublic | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data, error } = await supabase.from('premade_packages').select(SELECT).eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return assemble(data, locale);
}

async function _getAllPremadeSlugs(): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any;
  const { data } = await supabase.from('premade_packages').select('slug').eq('is_published', true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getAllPremadePackages(opts: { publishedOnly?: boolean; locale?: string } = {}): Promise<PremadePackagePublic[]> {
  const publishedOnly = opts.publishedOnly ?? true;
  const locale = opts.locale ?? 'en';
  return unstable_cache(
    () => _getAllPremadePackages({ publishedOnly, locale }),
    ['premade:all', String(publishedOnly), locale],
    { tags: [tags.premade.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getPremadePackageBySlug(slug: string, locale = 'en'): Promise<PremadePackagePublic | null> {
  return unstable_cache(
    () => _getPremadePackageBySlug(slug, locale),
    ['premade:bySlug', slug, locale],
    { tags: [tags.premade.bySlug(slug), tags.premade.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getAllPremadeSlugs(): Promise<string[]> {
  return unstable_cache(
    _getAllPremadeSlugs,
    ['premade:slugs'],
    { tags: [tags.premade.slugs(), tags.premade.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function getPremadePackageRawById(id: string): Promise<PremadePackageRaw | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('premade_packages').select(SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as PremadePackageRaw;
}

export async function getAdminPremadePackages(): Promise<Array<{ id: string; slug: string; name: string; isPublished: boolean; sortOrder: number }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase.from('premade_packages').select('id,slug,name,is_published,sort_order').order('sort_order');
  if (error) { console.error('[db/premade] getAdminPremadePackages:', error); return []; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({ id: r.id, slug: r.slug, name: r.name, isPublished: r.is_published, sortOrder: r.sort_order }));
}
