export const TIER_LABELS = ["Essential", "Signature", "Private"] as const;

export const REGIONS = [
  "Istanbul",
  "Cappadocia",
  "Aegean",
  "Mediterranean",
  "Black Sea",
  "Eastern Anatolia",
] as const;

export const REGION_SLUGS: Record<(typeof REGIONS)[number], string> = {
  Istanbul: "istanbul",
  Cappadocia: "cappadocia",
  Aegean: "aegean",
  Mediterranean: "mediterranean",
  "Black Sea": "black-sea",
  "Eastern Anatolia": "eastern-anatolia",
};

export const REGION_KEYS: Record<(typeof REGIONS)[number], string> = {
  Istanbul: "istanbul",
  Cappadocia: "cappadocia",
  Aegean: "aegean",
  Mediterranean: "mediterranean",
  "Black Sea": "blackSea",
  "Eastern Anatolia": "easternAnatolia",
};

/** Maps a region name to its `nav.regions.*` translation key. Falls back to the raw value if unknown. */
export function regionKey(region: string): string {
  return REGION_KEYS[region as (typeof REGIONS)[number]] ?? region;
}

const SLUG_TO_REGION = Object.fromEntries(
  Object.entries(REGION_SLUGS).map(([region, slug]) => [slug, region])
) as Record<string, (typeof REGIONS)[number]>;

export function slugToRegion(slug: string): (typeof REGIONS)[number] | null {
  return SLUG_TO_REGION[slug] ?? null;
}

export const PEOPLE_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "4", label: "3–5" },
  { value: "6", label: "6+" },
] as const;
