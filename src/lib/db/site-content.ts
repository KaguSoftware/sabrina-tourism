import { unstable_cache } from 'next/cache';
import { createAnonClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';
import type { SiteContentKey, SiteContentDataMap } from '@/lib/supabase/types';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function fetchSiteContent<K extends SiteContentKey>(key: K): Promise<SiteContentDataMap[K]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', key)
    .single() as unknown as { data: { data: Record<string, unknown> } | null; error: unknown };

  if (error || !data) {
    console.warn(`[db/site-content] Missing site_content row for key: ${key}`);
    return {} as SiteContentDataMap[K];
  }

  return data.data as unknown as SiteContentDataMap[K];
}

export async function getSiteContent<K extends SiteContentKey>(key: K): Promise<SiteContentDataMap[K]> {
  const cached = unstable_cache(
    () => fetchSiteContent(key),
    ['site-content', key],
    { tags: [tags.siteContent(key)], revalidate: REVALIDATE_SECONDS },
  );
  return cached();
}
