export const tags = {
  packages: {
    all: () => 'packages:all',
    bySlug: (slug: string) => `packages:slug:${slug}`,
    slugs: () => 'packages:slugs',
    featured: () => 'packages:featured',
  },
  premade: {
    all: () => 'premade:all',
    bySlug: (slug: string) => `premade:slug:${slug}`,
    slugs: () => 'premade:slugs',
  },
  daily: {
    all: () => 'daily:all',
    bySlug: (slug: string) => `daily:slug:${slug}`,
  },
  hotels: {
    all: () => 'hotels:all',
    byRegion: (region: string) => `hotels:region:${region}`,
    bySlug: (slug: string) => `hotels:slug:${slug}`,
    featured: () => 'hotels:featured',
  },
  transport: {
    airports: () => 'transport:airports',
    vehicles: () => 'transport:vehicles',
  },
  siteContent: (key: string) => `site-content:${key}`,
  uiTranslations: () => "ui-translations",
} as const;
