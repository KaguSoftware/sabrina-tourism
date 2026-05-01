import type { PackageRaw } from "@/lib/db/packages";
import type { PackageFormValues } from "@/app/admin/packages/[slug]/actions";
import { TIER_NAMES } from "./types";

export function defaultValues(pkg?: PackageRaw): PackageFormValues {
  if (pkg) {
    return {
      id: pkg.id,
      name: pkg.name,
      region: pkg.region as PackageFormValues["region"],
      duration: pkg.duration,
      duration_days: pkg.duration_days,
      short_description: pkg.short_description,
      overview: pkg.overview,
      hero_image: pkg.hero_image,
      card_image: pkg.card_image ?? null,
      min_people: pkg.min_people,
      max_people: pkg.max_people,
      available_from: pkg.available_from,
      available_to: pkg.available_to,
      is_published: pkg.is_published,
      is_featured: pkg.is_featured,
      itinerary: pkg.itinerary.map((d) => ({ title: d.title, description: d.description })),
      tiers: TIER_NAMES.map((name) => {
        const t = pkg.tiers.find((r) => r.tier_name === name) ?? {
          tier_name: name,
          vehicle_class: "",
          accommodation: "",
          group_size: "",
          guide_languages: [],
          meals_included: "",
          highlights: [],
        };
        return {
          tier_name: name,
          vehicle_class: t.vehicle_class,
          accommodation: t.accommodation,
          group_size: t.group_size,
          guide_languages: t.guide_languages,
          meals_included: t.meals_included,
          highlights: t.highlights,
        };
      }) as unknown as PackageFormValues["tiers"],
      gallery: pkg.gallery.map((g) => ({ path: g.image_path })),
      included: pkg.included.map((i) => ({ text: i.text })),
      not_included: pkg.not_included.map((i) => ({ text: i.text })),
    };
  }

  return {
    name: "",
    region: "Istanbul",
    duration: "",
    duration_days: 1,
    short_description: "",
    overview: "",
    hero_image: "",
    card_image: null,
    min_people: 1,
    max_people: 8,
    available_from: "",
    available_to: "",
    is_published: false,
    is_featured: false,
    itinerary: [],
    tiers: TIER_NAMES.map((name) => ({
      tier_name: name,
      vehicle_class: "",
      accommodation: "",
      group_size: "",
      guide_languages: [] as string[],
      meals_included: "",
      highlights: [] as string[],
    })) as unknown as PackageFormValues["tiers"],
    gallery: [],
    included: [],
    not_included: [],
  };
}
