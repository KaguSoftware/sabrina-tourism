import { createServerClient } from '@/lib/supabase/server';
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

export async function getAllSlugs(): Promise<string[]> {
  const supabase = await createServerClient();

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
