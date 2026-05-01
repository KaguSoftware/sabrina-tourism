import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { getPublicUrl } from '@/lib/supabase/storage';
import type { Package } from '@/lib/packages/types';
import type {
  PackageRow,
  PackageItineraryDayRow,
  PackageTierRow,
  PackageGalleryRow,
  PackageInclusionRow,
} from '@/lib/supabase/types';

type PackageTierName = 'Essential' | 'Signature' | 'Private';

function assemblePackage(
  row: PackageRow,
  itinerary: PackageItineraryDayRow[],
  tiers: PackageTierRow[],
  gallery: PackageGalleryRow[],
  inclusions: PackageInclusionRow[],
): Package {
  const orderedTiers = (['Essential', 'Signature', 'Private'] as PackageTierName[])
    .map((name) => {
      const t = tiers.find((t) => t.tier_name === name)!;
      return {
        name: t.tier_name,
        vehicleClass: t.vehicle_class,
        accommodation: t.accommodation,
        groupSize: t.group_size,
        guideLanguages: t.guide_languages,
        mealsIncluded: t.meals_included,
        highlights: t.highlights,
      };
    }) as Package['tiers'];

  return {
    slug: row.slug,
    name: row.name,
    region: row.region,
    duration: row.duration,
    durationDays: row.duration_days,
    shortDescription: row.short_description,
    overview: row.overview.split('\n').filter(Boolean),
    heroImage: getPublicUrl(row.hero_image),
    cardImage: row.card_image ? getPublicUrl(row.card_image) : undefined,
    gallery: gallery
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((g) => getPublicUrl(g.image_path)),
    itinerary: itinerary
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((d) => ({ day: d.day_number, title: d.title, description: d.description })),
    tiers: orderedTiers,
    included: inclusions
      .filter((i) => i.kind === 'included')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.text),
    notIncluded: inclusions
      .filter((i) => i.kind === 'not_included')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.text),
    minPeople: row.min_people,
    maxPeople: row.max_people,
    availableFrom: row.available_from,
    availableTo: row.available_to,
  };
}

export async function getAllPackages({ publishedOnly = true } = {}): Promise<Package[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from('packages')
    .select(`
      *,
      package_itinerary_days(*),
      package_tiers(*),
      package_gallery(*),
      package_inclusions(*)
    `)
    .order('sort_order');

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[db/packages] getAllPackages error:', error);
    return [];
  }

  return (data ?? []).map((row: any) =>
    assemblePackage(
      row,
      row.package_itinerary_days ?? [],
      row.package_tiers ?? [],
      row.package_gallery ?? [],
      row.package_inclusions ?? [],
    ),
  );
}

export async function getPackageBySlug(
  slug: string,
): Promise<Package | { redirectTo: string } | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_itinerary_days(*),
      package_tiers(*),
      package_gallery(*),
      package_inclusions(*)
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[db/packages] getPackageBySlug error:', error);
    return null;
  }

  if (data) {
    return assemblePackage(
      data,
      (data as any).package_itinerary_days ?? [],
      (data as any).package_tiers ?? [],
      (data as any).package_gallery ?? [],
      (data as any).package_inclusions ?? [],
    );
  }

  const { data: history, error: historyError } = await supabase
    .from('package_slug_history')
    .select('package_id')
    .eq('old_slug', slug)
    .maybeSingle() as unknown as { data: { package_id: string } | null; error: { message: string } | null };

  if (historyError) {
    console.error('[db/packages] getPackageBySlug history error:', historyError);
    return null;
  }

  if (!history) return null;

  const { data: current, error: currentError } = await supabase
    .from('packages')
    .select('slug')
    .eq('id', history.package_id)
    .maybeSingle() as unknown as { data: { slug: string } | null; error: { message: string } | null };

  if (currentError) {
    console.error('[db/packages] getPackageBySlug current slug error:', currentError);
    return null;
  }

  if (!current) return null;

  return { redirectTo: current.slug };
}

export async function getFeaturedPackages(): Promise<Package[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_itinerary_days(*),
      package_tiers(*),
      package_gallery(*),
      package_inclusions(*)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(3);

  if (error) {
    console.error('[db/packages] getFeaturedPackages error:', error);
    return [];
  }

  return (data ?? []).map((row: any) =>
    assemblePackage(
      row,
      row.package_itinerary_days ?? [],
      row.package_tiers ?? [],
      row.package_gallery ?? [],
      row.package_inclusions ?? [],
    ),
  );
}

// Raw shape for the admin editor — includes id, DB-native field names, and relations
export interface PackageRaw {
  id: string;
  slug: string;
  name: string;
  region: string;
  duration: string;
  duration_days: number;
  short_description: string;
  overview: string; // raw string, split by \n\n on display
  hero_image: string;
  card_image: string | null;
  min_people: number;
  max_people: number;
  available_from: string;
  available_to: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  updated_at: string;
  itinerary: Array<{ id: string; day_number: number; title: string; description: string; sort_order: number }>;
  tiers: Array<{ id: string; tier_name: string; vehicle_class: string; accommodation: string; group_size: string; guide_languages: string[]; meals_included: string; highlights: string[] }>;
  gallery: Array<{ id: string; image_path: string; sort_order: number }>;
  included: Array<{ id: string; text: string; sort_order: number }>;
  not_included: Array<{ id: string; text: string; sort_order: number }>;
}

export async function getPackageRawBySlug(slug: string): Promise<PackageRaw | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_itinerary_days(*),
      package_tiers(*),
      package_gallery(*),
      package_inclusions(*)
    `)
    .eq('slug', slug)
    .maybeSingle() as unknown as { data: any; error: any };

  if (error || !data) return null;

  const sorted = <T extends { sort_order: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.sort_order - b.sort_order);

  const inclusions: any[] = data.package_inclusions ?? [];

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    region: data.region,
    duration: data.duration,
    duration_days: data.duration_days,
    short_description: data.short_description,
    overview: data.overview,
    hero_image: data.hero_image,
    card_image: data.card_image,
    min_people: data.min_people,
    max_people: data.max_people,
    available_from: data.available_from,
    available_to: data.available_to,
    is_published: data.is_published,
    is_featured: data.is_featured,
    sort_order: data.sort_order,
    updated_at: data.updated_at,
    itinerary: sorted(data.package_itinerary_days ?? []).map((d: any) => ({
      id: d.id,
      day_number: d.day_number,
      title: d.title,
      description: d.description,
      sort_order: d.sort_order,
    })),
    tiers: (['Essential', 'Signature', 'Private'] as const).map((name) => {
      const t = (data.package_tiers ?? []).find((r: any) => r.tier_name === name) ?? {
        id: '',
        tier_name: name,
        vehicle_class: '',
        accommodation: '',
        group_size: '',
        guide_languages: [],
        meals_included: '',
        highlights: [],
      };
      return {
        id: t.id,
        tier_name: t.tier_name,
        vehicle_class: t.vehicle_class,
        accommodation: t.accommodation,
        group_size: t.group_size,
        guide_languages: t.guide_languages ?? [],
        meals_included: t.meals_included,
        highlights: t.highlights ?? [],
      };
    }),
    gallery: sorted(data.package_gallery ?? []).map((g: any) => ({
      id: g.id,
      image_path: g.image_path,
      sort_order: g.sort_order,
    })),
    included: sorted(inclusions.filter((i: any) => i.kind === 'included')).map((i: any) => ({
      id: i.id,
      text: i.text,
      sort_order: i.sort_order,
    })),
    not_included: sorted(inclusions.filter((i: any) => i.kind === 'not_included')).map((i: any) => ({
      id: i.id,
      text: i.text,
      sort_order: i.sort_order,
    })),
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient<Database>(url, key);

  const { data, error } = await supabase
    .from('packages')
    .select('slug')
    .eq('is_published', true);

  if (error) {
    console.error('[db/packages] getAllSlugs error:', error);
    return [];
  }

  return (data ?? []).map((row) => (row as { slug: string }).slug);
}
