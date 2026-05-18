import { unstable_cache } from 'next/cache';
import { createAnonClient } from '@/lib/supabase/server';
import { tags } from '@/lib/cache/tags';
import type { SiteContentKey, SiteContentDataMap } from '@/lib/supabase/types';

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

type RawRow = {
  data: Record<string, unknown> | null;
  data_translations: Record<string, Record<string, unknown>> | null;
};

function mergeLocale<T extends Record<string, unknown>>(
  data: Record<string, unknown> | null,
  translations: Record<string, Record<string, unknown>> | null,
  locale: string,
): T {
  const base = (data ?? {}) as Record<string, unknown>;
  if (locale === 'en' || !translations) return base as T;
  const overrides = translations[locale];
  if (!overrides || typeof overrides !== 'object') return base as T;
  const merged: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(overrides)) {
    if (v != null && v !== '') merged[k] = v;
  }
  return merged as T;
}

async function fetchSiteContent<K extends SiteContentKey>(key: K, locale: string): Promise<SiteContentDataMap[K]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('data, data_translations')
    .eq('id', key)
    .single() as unknown as { data: RawRow | null; error: unknown };

  if (error || !data) {
    console.warn(`[db/site-content] Missing site_content row for key: ${key}`);
    return {} as SiteContentDataMap[K];
  }

  return mergeLocale<SiteContentDataMap[K] & Record<string, unknown>>(data.data, data.data_translations, locale);
}

export async function getSiteContent<K extends SiteContentKey>(key: K, locale: string = 'en'): Promise<SiteContentDataMap[K]> {
  const cached = unstable_cache(
    () => fetchSiteContent(key, locale),
    ['site-content', key, locale],
    { tags: [tags.siteContent(key)], revalidate: REVALIDATE_SECONDS },
  );
  return cached();
}

async function fetchSiteContentBatch<K extends SiteContentKey>(
  keys: readonly K[],
  locale: string,
): Promise<{ [P in K]: SiteContentDataMap[P] }> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('id, data, data_translations')
    .in('id', keys as unknown as string[]) as unknown as {
      data: Array<{ id: K } & RawRow> | null;
      error: unknown;
    };

  const result = {} as { [P in K]: SiteContentDataMap[P] };
  if (error || !data) {
    for (const k of keys) result[k] = {} as unknown as SiteContentDataMap[K];
    return result;
  }
  const byId = new Map(data.map((r) => [r.id, r]));
  for (const k of keys) {
    const row = byId.get(k);
    result[k] = mergeLocale<SiteContentDataMap[typeof k] & Record<string, unknown>>(
      row?.data ?? null,
      row?.data_translations ?? null,
      locale,
    );
  }
  return result;
}

export async function getSiteContentBatch<K extends SiteContentKey>(
  keys: readonly K[],
  locale: string = 'en',
): Promise<{ [P in K]: SiteContentDataMap[P] }> {
  const sortedKeys = [...keys].sort() as K[];
  const cached = unstable_cache(
    () => fetchSiteContentBatch(sortedKeys, locale),
    ['site-content:batch', sortedKeys.join('|'), locale],
    { tags: sortedKeys.map((k) => tags.siteContent(k)), revalidate: REVALIDATE_SECONDS },
  );
  return cached();
}
