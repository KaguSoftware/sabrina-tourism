import type { MetadataRoute } from "next";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/i18n/locales";
import { getAllPremadeSlugs } from "@/lib/db/premade-packages";
import { getAllDailyPackages } from "@/lib/db/daily-packages";
import { REGION_SLUGS } from "@/lib/packages/constants";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sabrina-tourism.vercel.app";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

function localizedPath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path === "/" ? "" : path;
  return `/${locale}${path === "/" ? "" : path}`;
}

function urlFor(locale: Locale, path: string): string {
  return `${BASE}${localizedPath(locale, path)}`;
}

function alternatesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = urlFor(locale, path);
  }
  return languages;
}

interface RouteSpec {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const STATIC_ROUTES: RouteSpec[] = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  { path: "/packages", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tours/fixed-dates", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tours/daily-packages", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tours/custom-packages", changeFrequency: "weekly", priority: 0.9 },
  { path: "/regions", changeFrequency: "weekly", priority: 0.9 },
  { path: "/transportation", changeFrequency: "weekly", priority: 0.9 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cancellation", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [premadeSlugs, dailyPackages] = await Promise.all([
    getAllPremadeSlugs(),
    getAllDailyPackages({ publishedOnly: true }),
  ]);
  const dailySlugs = dailyPackages.map((p) => p.slug);
  const regionSlugs = Object.values(REGION_SLUGS);

  const entries: MetadataRoute.Sitemap = [];

  // Static routes — one entry per locale, with alternates for all locales.
  for (const route of STATIC_ROUTES) {
    const languages = alternatesFor(route.path);
    for (const locale of LOCALES) {
      entries.push({
        url: urlFor(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }
  }

  // Dynamic: premade (fixed-dates) detail pages → /tours/premade/{slug}
  for (const slug of premadeSlugs) {
    const path = `/tours/premade/${slug}`;
    const languages = alternatesFor(path);
    for (const locale of LOCALES) {
      entries.push({
        url: urlFor(locale, path),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  // Dynamic: daily package detail pages → /tours/daily/{slug}
  for (const slug of dailySlugs) {
    const path = `/tours/daily/${slug}`;
    const languages = alternatesFor(path);
    for (const locale of LOCALES) {
      entries.push({
        url: urlFor(locale, path),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  // Dynamic: region landing pages → /regions/{regionSlug}
  for (const regionSlug of regionSlugs) {
    const path = `/regions/${regionSlug}`;
    const languages = alternatesFor(path);
    for (const locale of LOCALES) {
      entries.push({
        url: urlFor(locale, path),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
