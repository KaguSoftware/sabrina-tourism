import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/db/packages";

const BASE = "https://sabrina-tourism.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/packages`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/transportation`, changeFrequency: "monthly", priority: 0.7 },
    ...slugs.map((slug) => ({
      url: `${BASE}/packages/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
