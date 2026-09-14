export const tags = {
  premade: {
    all: () => 'premade:all',
    bySlug: (slug: string) => `premade:slug:${slug}`,
    slugs: () => 'premade:slugs',
    admin: () => 'premade:admin',
  },
  daily: {
    all: () => 'daily:all',
    bySlug: (slug: string) => `daily:slug:${slug}`,
    admin: () => 'daily:admin',
  },
  hotels: {
    all: () => 'hotels:all',
    byRegion: (region: string) => `hotels:region:${region}`,
    bySlug: (slug: string) => `hotels:slug:${slug}`,
    featured: () => 'hotels:featured',
    admin: () => 'hotels:admin',
  },
  transport: {
    airports: () => 'transport:airports',
    vehicles: () => 'transport:vehicles',
  },
  siteContent: (key: string) => `site-content:${key}`,
  ui: (locale: string) => `ui-translations:${locale}`,
} as const;
